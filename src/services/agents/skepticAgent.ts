import type { CandidateProfile, AgentEvaluation, AgentEvidenceItem } from '../../types';
import { SKEPTIC_AGENT_SYSTEM_PROMPT } from './agentPrompts';
import { callGeminiApi, isApiKeyConfigured } from '../llm/llmProvider';

export async function evaluateSkeptic(
  jobDescription: string,
  profile: CandidateProfile
): Promise<AgentEvaluation> {
  // Check if live LLM is configured
  if (isApiKeyConfigured()) {
    try {
      const userPrompt = `
JOB DESCRIPTION:
${jobDescription || 'Standard software engineering requirements.'}

CANDIDATE PROFILE (AUDIT DATA):
${JSON.stringify({
  name: profile.candidateName,
  unverifiedClaims: profile.claims.filter(c => c.verificationStatus === 'Unverified Resume Claim'),
  corroboratedClaims: profile.claims.filter(c => c.verificationStatus === 'Corroborated by Transcript'),
  contradictions: profile.contradictions,
  missingInformation: profile.missingInformation,
  skills: profile.skills
}, null, 2)}

Provide your independent Skeptic evaluation strictly in the specified JSON format.
`;

      const responseText = await callGeminiApi(SKEPTIC_AGENT_SYSTEM_PROMPT, userPrompt, true);
      const parsed = JSON.parse(responseText);

      return {
        agentId: 'skeptic',
        agentName: 'Skeptic Agent',
        roleTitle: 'Adversarial Risk & Red Flag Assessor',
        overallAssessment: parsed.overallAssessment || 'Candidate skeptic audit complete.',
        recommendation: parsed.recommendation || 'Move Forward with Reservations',
        confidence: parsed.confidence || 'High',
        confidenceScore: parsed.confidenceScore || 90,
        strengths: parsed.strengths || [],
        concerns: parsed.concerns || [],
        evidenceItems: parsed.evidenceItems || [],
        evaluatedAt: new Date(),
        isEvaluationComplete: true,
      };
    } catch (err) {
      console.warn('Skeptic Agent LLM call failed or fell back:', err);
    }
  }

  // Deterministic Evaluation Engine (Strictly derives assessment from parsed Candidate Profile data without hallucinating)
  const unverifiedClaims = profile.claims.filter(c => c.verificationStatus === 'Unverified Resume Claim');
  const corroboratedClaims = profile.claims.filter(c => c.verificationStatus === 'Corroborated by Transcript');
  const contradictions = profile.contradictions;
  const missingInfo = profile.missingInformation;

  const strengths: string[] = [
    corroboratedClaims.length > 0
      ? `${corroboratedClaims.length} major technical claims were tested in interview and stood up to verification.`
      : 'Basic professional history is consistent across documentation.'
  ];

  const concerns: string[] = [];

  if (contradictions.length > 0) {
    concerns.push(`Flagged Discrepancy: ${contradictions[0].topic} (${contradictions[0].discrepancySummary})`);
  }

  if (unverifiedClaims.length > 0) {
    concerns.push(`${unverifiedClaims.length} resume claims lack verbal substantiation in interview transcript (Unverified claim).`);
  }

  if (missingInfo.length > 0) {
    concerns.push(`Unverified JD baseline: ${missingInfo[0].topic} (Insufficient evidence).`);
  }

  if (concerns.length === 0) {
    concerns.push('No severe contradictions or exaggerated claims detected in analyzed materials.');
  }

  const evidenceItems: AgentEvidenceItem[] = [];

  // Add contradiction evidence if any
  if (contradictions.length > 0) {
    evidenceItems.push({
      claimOrConclusion: `Potential inconsistency in ${contradictions[0].topic}`,
      source: 'Both',
      exactQuoteOrEvidence: `Resume: "${contradictions[0].resumeStatement.quote}" vs Transcript: "${contradictions[0].transcriptStatement.quote}"`,
      explanation: contradictions[0].discrepancySummary
    });
  }

  // Add unverified claim evidence
  if (unverifiedClaims.length > 0 && unverifiedClaims[0].quotes.length > 0) {
    evidenceItems.push({
      claimOrConclusion: `Unverified claim on resume: "${unverifiedClaims[0].claimText}"`,
      source: 'Resume',
      exactQuoteOrEvidence: unverifiedClaims[0].quotes[0].quote,
      explanation: 'Appears as written bullet in resume but was not probed or validated in the interview conversation.'
    });
  }

  // Add missing info evidence
  if (missingInfo.length > 0) {
    evidenceItems.push({
      claimOrConclusion: `Missing evidence for required skill: ${missingInfo[0].topic}`,
      source: 'Resume',
      exactQuoteOrEvidence: missingInfo[0].reason,
      explanation: 'Insufficient evidence provided in candidate documentation.'
    });
  }

  const recommendation = contradictions.length > 0
    ? 'Move Forward with Reservations'
    : unverifiedClaims.length > 2
    ? 'Move Forward with Reservations'
    : 'Move Forward';

  return {
    agentId: 'skeptic',
    agentName: 'Skeptic Agent',
    roleTitle: 'Adversarial Risk & Red Flag Assessor',
    overallAssessment: `Adversarial audit completed: identified ${contradictions.length} potential discrepancies, ${unverifiedClaims.length} uncorroborated resume claims, and ${missingInfo.length} missing job requirement evidence points.`,
    recommendation,
    confidence: 'High',
    confidenceScore: 90,
    strengths,
    concerns,
    evidenceItems,
    evaluatedAt: new Date(),
    isEvaluationComplete: true,
  };
}
