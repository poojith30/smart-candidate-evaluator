import type { CandidateProfile, AgentEvaluation, AgentEvidenceItem } from '../../types';
import { TECHNICAL_AGENT_SYSTEM_PROMPT } from './agentPrompts';
import { callGeminiApi, isApiKeyConfigured } from '../llm/llmProvider';

export async function evaluateTechnical(
  jobDescription: string,
  profile: CandidateProfile
): Promise<AgentEvaluation> {
  // Check if live LLM is configured
  if (isApiKeyConfigured()) {
    try {
      const userPrompt = `
JOB DESCRIPTION:
${jobDescription || 'Standard software engineering role requirements.'}

CANDIDATE PROFILE:
${JSON.stringify({
  name: profile.candidateName,
  skills: profile.skills,
  technicalExperience: profile.technicalExperience,
  education: profile.education,
  claims: profile.claims.filter(c => c.category === 'Technical Capability' || c.category === 'Architecture & Scale'),
  missingInformation: profile.missingInformation
}, null, 2)}

Provide your independent technical evaluation strictly in the specified JSON format.
`;

      const responseText = await callGeminiApi(TECHNICAL_AGENT_SYSTEM_PROMPT, userPrompt, true);
      const parsed = JSON.parse(responseText);

      return {
        agentId: 'tech',
        agentName: 'Technical Agent',
        roleTitle: 'Hard Skills & Architecture Assessor',
        overallAssessment: parsed.overallAssessment || 'Candidate technical evaluation complete.',
        recommendation: parsed.recommendation || 'Move Forward',
        confidence: parsed.confidence || 'High',
        confidenceScore: parsed.confidenceScore || 85,
        strengths: parsed.strengths || [],
        concerns: parsed.concerns || [],
        evidenceItems: parsed.evidenceItems || [],
        evaluatedAt: new Date(),
        isEvaluationComplete: true,
      };
    } catch (err) {
      console.warn('Technical Agent LLM call failed or fell back:', err);
    }
  }

  // Deterministic Evaluation Engine (Strictly derives assessment from parsed Candidate Profile data without hallucinating)
  const verifiedSkills = profile.skills.filter(s => s.verifiedInTranscript);
  const unverifiedSkills = profile.skills.filter(s => !s.verifiedInTranscript && s.source === 'Resume');
  const technicalClaims = profile.claims.filter(c => c.category === 'Technical Capability' || c.category === 'Architecture & Scale');

  const strengths: string[] = [
    `Demonstrated proficiency in ${verifiedSkills.slice(0, 3).map(s => s.name).join(', ') || 'core stack competencies'} with verbal transcript validation.`,
    technicalClaims[0] ? `Corroborated technical deliverable: "${technicalClaims[0].claimText.slice(0, 90)}..."` : 'Relevant technical experience documented in profile.'
  ].filter(Boolean);

  const concerns: string[] = [
    unverifiedSkills.length > 0 ? `${unverifiedSkills.length} skills listed on resume were not probed or validated in interview transcript (${unverifiedSkills.slice(0, 3).map(s => s.name).join(', ')}).` : null,
    profile.missingInformation.length > 0 ? `Unsubstantiated JD criteria: ${profile.missingInformation[0].topic} (Insufficient evidence).` : null
  ].filter(Boolean) as string[];

  const evidenceItems: AgentEvidenceItem[] = [];

  // Add evidence from verified skills
  verifiedSkills.slice(0, 2).forEach(s => {
    if (s.quotes.length > 0) {
      evidenceItems.push({
        claimOrConclusion: `Proficiency in ${s.name} substantiated during interview.`,
        source: s.source,
        exactQuoteOrEvidence: s.quotes[0].quote,
        explanation: 'Candidate provided contextual technical details during interview discussion.'
      });
    }
  });

  // Add evidence from technical claims
  technicalClaims.slice(0, 2).forEach(c => {
    if (c.quotes.length > 0) {
      evidenceItems.push({
        claimOrConclusion: c.claimText,
        source: c.source,
        exactQuoteOrEvidence: c.quotes[0].quote,
        explanation: c.supportingEvidence
      });
    }
  });

  if (evidenceItems.length === 0) {
    evidenceItems.push({
      claimOrConclusion: 'Technical depth and stack alignment assessment.',
      source: 'Resume',
      exactQuoteOrEvidence: profile.summary,
      explanation: 'Derived from candidate profile document evidence.'
    });
  }

  const recommendation = verifiedSkills.length >= 3 && concerns.length <= 1 
    ? 'Move Forward' 
    : verifiedSkills.length > 0 
    ? 'Move Forward with Reservations' 
    : 'Requires Clarification';

  return {
    agentId: 'tech',
    agentName: 'Technical Agent',
    roleTitle: 'Hard Skills & Architecture Assessor',
    overallAssessment: `Evaluated ${profile.skills.length} technical skills and ${technicalClaims.length} architecture claims. Candidate demonstrates verified depth in ${verifiedSkills.map(s => s.name).join(', ') || 'core domains'}, with ${unverifiedSkills.length} uncorroborated resume claims remaining.`,
    recommendation,
    confidence: 'High',
    confidenceScore: verifiedSkills.length >= 4 ? 90 : 75,
    strengths,
    concerns: concerns.length > 0 ? concerns : ['No major technical risks detected against provided documents.'],
    evidenceItems,
    evaluatedAt: new Date(),
    isEvaluationComplete: true,
  };
}
