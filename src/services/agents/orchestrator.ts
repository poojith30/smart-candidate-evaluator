import type { CandidateProfile, AgentRole, AgentEvaluation } from '../../types';
import { evaluateTechnical } from './technicalAgent';
import { evaluateHR } from './hrAgent';
import { evaluateHiringManager } from './managerAgent';
import { evaluateSkeptic } from './skepticAgent';

/**
 * Orchestrates the 4 independent agent evaluations for a single candidate.
 * 
 * CRITICAL INDEPENDENCE RULE ENFORCED:
 * - Each agent runs in its own isolated call.
 * - No agent receives the inputs, outputs, scores, or conclusions of any other agent.
 * - All 4 evaluations execute concurrently in parallel without cross-talk.
 */
export async function evaluateCandidateIndependently(
  jobDescriptionText: string,
  profile: CandidateProfile
): Promise<Record<AgentRole, AgentEvaluation>> {
  // Execute all four agents in parallel isolated calls
  const [techEval, hrEval, managerEval, skepticEval] = await Promise.all([
    evaluateTechnical(jobDescriptionText, profile),
    evaluateHR(jobDescriptionText, profile),
    evaluateHiringManager(jobDescriptionText, profile),
    evaluateSkeptic(jobDescriptionText, profile),
  ]);

  return {
    tech: techEval,
    culture: hrEval,
    manager: managerEval,
    skeptic: skepticEval,
  };
}
