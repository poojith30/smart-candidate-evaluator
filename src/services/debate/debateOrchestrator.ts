import type {
  CandidateId,
  CandidateProfile,
  AgentRole,
  AgentEvaluation,
  DebateResult,
  DebateResponse,
  OpinionChange,
} from '../../types';
import { callGeminiApi, isApiKeyConfigured } from '../llm/llmProvider';
import { DEBATE_ROUND1_CROSS_EXAM_PROMPT, DEBATE_ROUND2_REASSESSMENT_PROMPT } from './debatePrompts';

/**
 * Runs a single cross-examination interaction turn in Round 1.
 */
async function runCrossExamTurn(
  respondingAgent: AgentRole,
  targetAgent: AgentRole,
  targetPoint: string,
  profile: CandidateProfile,
  jobDescriptionText: string,
  fallbackResponse: DebateResponse
): Promise<DebateResponse> {
  if (isApiKeyConfigured()) {
    try {
      const userPrompt = `
RESPONDING AGENT: ${respondingAgent.toUpperCase()}
TARGET AGENT BEING ADDRESSED: ${targetAgent.toUpperCase()}
POINT TO ADDRESS: "${targetPoint}"

JOB DESCRIPTION:
${jobDescriptionText || 'Standard engineering requirements.'}

CANDIDATE PROFILE EVIDENCE:
${JSON.stringify({
  skills: profile.skills,
  claims: profile.claims,
  missing: profile.missingInformation,
  contradictions: profile.contradictions
}, null, 2)}

Provide your persona response strictly in the requested JSON format.
`;

      const raw = await callGeminiApi(DEBATE_ROUND1_CROSS_EXAM_PROMPT, userPrompt, true);
      const parsed = JSON.parse(raw);

      return {
        id: `turn-${respondingAgent}-${targetAgent}-${Date.now()}`,
        respondingAgent,
        targetAgent,
        pointAddressed: parsed.pointAddressed || targetPoint,
        response: parsed.response || fallbackResponse.response,
        supportingEvidence: parsed.supportingEvidence || fallbackResponse.supportingEvidence,
        position: parsed.position || fallbackResponse.position,
      };
    } catch (err) {
      console.warn(`Round 1 cross-exam turn ${respondingAgent} -> ${targetAgent} LLM failed, using deterministic fallback:`, err);
    }
  }

  return fallbackResponse;
}

/**
 * Runs a reassessment turn for an agent in Round 2.
 */
async function runReassessmentTurn(
  agent: AgentRole,
  originalEval: AgentEvaluation,
  round1Discourse: DebateResponse[],
  profile: CandidateProfile,
  jobDescriptionText: string,
  fallbackChange: OpinionChange
): Promise<OpinionChange> {
  if (isApiKeyConfigured()) {
    try {
      const userPrompt = `
AGENT: ${agent.toUpperCase()}
ORIGINAL INDEPENDENT RECOMMENDATION: ${originalEval.recommendation}
ORIGINAL CONFIDENCE: ${originalEval.confidence} (${originalEval.confidenceScore}%)

JOB DESCRIPTION:
${jobDescriptionText || 'Standard engineering requirements.'}

ROUND 1 CROSS-EXAMINATION DISCOURSE:
${JSON.stringify(round1Discourse, null, 2)}

CANDIDATE PROFILE EVIDENCE:
${JSON.stringify({
  skills: profile.skills,
  claims: profile.claims,
  missing: profile.missingInformation,
  contradictions: profile.contradictions
}, null, 2)}

Provide your Round 2 reassessment strictly in the requested JSON format.
`;

      const raw = await callGeminiApi(DEBATE_ROUND2_REASSESSMENT_PROMPT, userPrompt, true);
      const parsed = JSON.parse(raw);

      return {
        agentId: agent,
        agentName: originalEval.agentName,
        originalRecommendation: originalEval.recommendation,
        originalConfidence: originalEval.confidence,
        originalConfidenceScore: originalEval.confidenceScore,
        revisedRecommendation: parsed.revisedRecommendation || originalEval.recommendation,
        revisedConfidence: parsed.revisedConfidence || originalEval.confidence,
        revisedConfidenceScore: parsed.revisedConfidenceScore || originalEval.confidenceScore,
        changed: Boolean(parsed.changed),
        reason: parsed.reason || fallbackChange.reason,
        influencedByAgent: parsed.influencedByAgent || fallbackChange.influencedByAgent,
        evidence: parsed.evidence || fallbackChange.evidence,
      };
    } catch (err) {
      console.warn(`Round 2 reassessment turn for ${agent} LLM failed, using deterministic fallback:`, err);
    }
  }

  return fallbackChange;
}

/**
 * Orchestrates the full Multi-Agent Debate for a single candidate.
 */
export async function runCandidateDebate(
  jobDescriptionText: string,
  profile: CandidateProfile,
  evals: Record<AgentRole, AgentEvaluation>,
  candidateId: CandidateId
): Promise<DebateResult> {
  const verifiedSkills = profile.skills.filter(s => s.verifiedInTranscript);
  const unverifiedSkills = profile.skills.filter(s => !s.verifiedInTranscript && s.source === 'Resume');
  const hasContradictions = profile.contradictions.length > 0;
  const missingPoints = profile.missingInformation.length;

  // --- ROUND 1: CROSS-EXAMINATION TURNS ---
  // Interaction 1: Skeptic -> Technical
  const skepticToTechFallback: DebateResponse = {
    id: `turn-skeptic-tech-${candidateId}`,
    respondingAgent: 'skeptic',
    targetAgent: 'tech',
    pointAddressed: evals.tech.strengths[0] || 'High technical confidence',
    response: unverifiedSkills.length > 0
      ? `Technical Agent assumes broad competency, but ${unverifiedSkills.length} resume skills (${unverifiedSkills.slice(0, 2).map(s => s.name).join(', ')}) were never verified in the interview transcript.`
      : hasContradictions
      ? `Technical Agent must account for the ownership contradiction flagged in ${profile.contradictions[0].topic}.`
      : 'Technical assessment is solid, but we must verify if the candidate had sole responsibility or team support.',
    supportingEvidence: unverifiedSkills.length > 0
      ? `Resume lists ${unverifiedSkills.map(s => s.name).join(', ')} but transcript contains no discussion.`
      : 'Extracted from transcript verification audit.',
    position: unverifiedSkills.length > 0 || hasContradictions ? 'disagree' : 'partially agree',
  };

  // Interaction 2: Technical -> Skeptic
  const techToSkepticFallback: DebateResponse = {
    id: `turn-tech-skeptic-${candidateId}`,
    respondingAgent: 'tech',
    targetAgent: 'skeptic',
    pointAddressed: evals.skeptic.concerns[0] || 'Unverified skills and gaps',
    response: verifiedSkills.length > 0
      ? `While not every skill was tested, the candidate gave in-depth technical explanations for ${verifiedSkills.slice(0, 2).map(s => s.name).join(' and ')}, which demonstrates genuine architectural depth.`
      : 'I acknowledge the Skeptic\'s point that transcript evidence is sparse on specific advanced architectures.',
    supportingEvidence: verifiedSkills[0]?.quotes[0]?.quote || 'Documented transcript responses.',
    position: 'partially agree',
  };

  // Interaction 3: Manager -> Culture
  const managerToCultureFallback: DebateResponse = {
    id: `turn-manager-culture-${candidateId}`,
    respondingAgent: 'manager',
    targetAgent: 'culture',
    pointAddressed: evals.culture.overallAssessment || 'Team alignment & communication',
    response: missingPoints > 0
      ? `I agree with HR that communication is strong, but from a hiring standpoint, missing background in ${profile.missingInformation[0].topic} will require structured onboarding support.`
      : 'I concur with HR; strong collaborative communication translates directly to faster project delivery velocity.',
    supportingEvidence: missingPoints > 0 ? profile.missingInformation[0].reason : 'Interview dialogue records.',
    position: missingPoints > 0 ? 'partially agree' : 'agree',
  };

  // Interaction 4: Culture -> Manager
  const cultureToManagerFallback: DebateResponse = {
    id: `turn-culture-manager-${candidateId}`,
    respondingAgent: 'culture',
    targetAgent: 'manager',
    pointAddressed: evals.manager.concerns[0] || 'Delivery & onboarding risk',
    response: `The candidate's high adaptability and clear communication will allow them to close any missing domain knowledge rapidly during onboarding.`,
    supportingEvidence: profile.claims.find(c => c.category === 'Leadership & Ownership')?.quotes[0]?.quote || 'Behavioral transcript context.',
    position: 'agree',
  };

  // Run Round 1 calls in parallel
  const [r1Turn1, r1Turn2, r1Turn3, r1Turn4] = await Promise.all([
    runCrossExamTurn('skeptic', 'tech', evals.tech.strengths[0] || 'Technical depth', profile, jobDescriptionText, skepticToTechFallback),
    runCrossExamTurn('tech', 'skeptic', evals.skeptic.concerns[0] || 'Unverified claims', profile, jobDescriptionText, techToSkepticFallback),
    runCrossExamTurn('manager', 'culture', evals.culture.overallAssessment, profile, jobDescriptionText, managerToCultureFallback),
    runCrossExamTurn('culture', 'manager', evals.manager.concerns[0] || 'Delivery risk', profile, jobDescriptionText, cultureToManagerFallback),
  ]);

  const round1Responses = [r1Turn1, r1Turn2, r1Turn3, r1Turn4];

  // --- ROUND 2: REASSESSMENT TURNS ---
  // Technical Agent Reassessment
  const techReassessFallback: OpinionChange = unverifiedSkills.length >= 3
    ? {
        agentId: 'tech',
        agentName: 'Technical Agent',
        originalRecommendation: evals.tech.recommendation,
        originalConfidence: evals.tech.confidence,
        originalConfidenceScore: evals.tech.confidenceScore,
        revisedRecommendation: 'Move Forward with Reservations',
        revisedConfidence: 'Medium',
        revisedConfidenceScore: Math.max(65, evals.tech.confidenceScore - 12),
        changed: true,
        reason: 'Confidence adjusted downwards after Skeptic Agent highlighted that several secondary skills listed on resume were unverified in the transcript.',
        influencedByAgent: 'skeptic',
        evidence: `Unverified resume items: ${unverifiedSkills.slice(0, 3).map(s => s.name).join(', ')}`
      }
    : {
        agentId: 'tech',
        agentName: 'Technical Agent',
        originalRecommendation: evals.tech.recommendation,
        originalConfidence: evals.tech.confidence,
        originalConfidenceScore: evals.tech.confidenceScore,
        revisedRecommendation: evals.tech.recommendation,
        revisedConfidence: evals.tech.confidence,
        revisedConfidenceScore: evals.tech.confidenceScore,
        changed: false,
        reason: 'No change — verified transcript depth in core technologies remains sufficient to support the original technical recommendation.',
        influencedByAgent: null,
        evidence: 'Primary technical answers corroborated.'
      };

  // HR Agent Reassessment
  const hrReassessFallback: OpinionChange = {
    agentId: 'culture',
    agentName: 'HR / Culture Agent',
    originalRecommendation: evals.culture.recommendation,
    originalConfidence: evals.culture.confidence,
    originalConfidenceScore: evals.culture.confidenceScore,
    revisedRecommendation: evals.culture.recommendation,
    revisedConfidence: evals.culture.confidence,
    revisedConfidenceScore: evals.culture.confidenceScore,
    changed: false,
    reason: 'No change — debate cross-examination reaffirmed strong communication clarity and positive team orientation.',
    influencedByAgent: null,
    evidence: 'Interview behavioral consistency.'
  };

  // Hiring Manager Reassessment
  const managerReassessFallback: OpinionChange = missingPoints > 0
    ? {
        agentId: 'manager',
        agentName: 'Hiring Manager Agent',
        originalRecommendation: evals.manager.recommendation,
        originalConfidence: evals.manager.confidence,
        originalConfidenceScore: evals.manager.confidenceScore,
        revisedRecommendation: evals.manager.recommendation,
        revisedConfidence: 'Medium',
        revisedConfidenceScore: Math.max(70, evals.manager.confidenceScore - 8),
        changed: true,
        reason: 'Maintained hire recommendation but lowered confidence slightly to account for documented onboarding gaps identified during cross-examination.',
        influencedByAgent: 'skeptic',
        evidence: profile.missingInformation[0]?.reason || 'Onboarding risk considerations.'
      }
    : {
        agentId: 'manager',
        agentName: 'Hiring Manager Agent',
        originalRecommendation: evals.manager.recommendation,
        originalConfidence: evals.manager.confidence,
        originalConfidenceScore: evals.manager.confidenceScore,
        revisedRecommendation: evals.manager.recommendation,
        revisedConfidence: evals.manager.confidence,
        revisedConfidenceScore: evals.manager.confidenceScore,
        changed: false,
        reason: 'No change — practical hiring value and delivery ownership remain strong.',
        influencedByAgent: null,
        evidence: 'Demonstrated project track record.'
      };

  // Skeptic Agent Reassessment
  const skepticReassessFallback: OpinionChange = verifiedSkills.length >= 3
    ? {
        agentId: 'skeptic',
        agentName: 'Skeptic Agent',
        originalRecommendation: evals.skeptic.recommendation,
        originalConfidence: evals.skeptic.confidence,
        originalConfidenceScore: evals.skeptic.confidenceScore,
        revisedRecommendation: evals.skeptic.recommendation,
        revisedConfidence: 'High',
        revisedConfidenceScore: evals.skeptic.confidenceScore,
        changed: false,
        reason: 'No change — while Technical Agent substantiated core competencies, secondary claim risks and missing criteria remain valid concerns.',
        influencedByAgent: null,
        evidence: 'Adversarial audit findings hold.'
      }
    : {
        agentId: 'skeptic',
        agentName: 'Skeptic Agent',
        originalRecommendation: evals.skeptic.recommendation,
        originalConfidence: evals.skeptic.confidence,
        originalConfidenceScore: evals.skeptic.confidenceScore,
        revisedRecommendation: 'Do Not Move Forward',
        revisedConfidence: 'High',
        revisedConfidenceScore: 92,
        changed: true,
        reason: 'Hardened stance due to lack of verifiable transcript evidence for critical requirements.',
        influencedByAgent: 'tech',
        evidence: 'Unverified technical baseline.'
      };

  // Run Round 2 calls in parallel
  const [techReassess, hrReassess, managerReassess, skepticReassess] = await Promise.all([
    runReassessmentTurn('tech', evals.tech, round1Responses, profile, jobDescriptionText, techReassessFallback),
    runReassessmentTurn('culture', evals.culture, round1Responses, profile, jobDescriptionText, hrReassessFallback),
    runReassessmentTurn('manager', evals.manager, round1Responses, profile, jobDescriptionText, managerReassessFallback),
    runReassessmentTurn('skeptic', evals.skeptic, round1Responses, profile, jobDescriptionText, skepticReassessFallback),
  ]);

  const opinionChanges = [techReassess, hrReassess, managerReassess, skepticReassess];

  return {
    candidateId,
    round1Responses,
    opinionChanges,
    isComplete: true,
    timestamp: new Date(),
  };
}
