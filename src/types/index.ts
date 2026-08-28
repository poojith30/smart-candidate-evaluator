export interface UploadedDoc {
  file: File | null;
  name: string;
  size: number;
  type: string;
  uploadedAt?: Date;
  rawText?: string;
}

export interface CandidateDocs {
  resume: UploadedDoc | null;
  transcript: UploadedDoc | null;
}

export interface EvaluationDocuments {
  jobDescription: UploadedDoc | null;
  candidateA: CandidateDocs;
  candidateB: CandidateDocs;
}

export type CandidateId = 'candidateA' | 'candidateB';
export type ViewTab = 'candidateA' | 'candidateB' | 'comparison';

export type AgentRole = 'tech' | 'culture' | 'manager' | 'skeptic';

export interface AgentInfo {
  id: AgentRole;
  title: string;
  subtitle: string;
  description: string;
  focusAreas: string[];
  themeColor: {
    badge: string;
    border: string;
    glow: string;
    accent: string;
    bgSubtle: string;
    iconBg: string;
  };
}

export type PipelineStage = 
  | 'input_ready'
  | 'parsing_documents'
  | 'independent_analysis'
  | 'debate_rounds'
  | 'synthesis_decision'
  | 'complete';

// --- CANDIDATE PROFILE BUILDER DATA MODEL ---

export type EvidenceType = 
  | 'FACT / DIRECT EVIDENCE'
  | 'CANDIDATE CLAIM'
  | 'MISSING INFORMATION'
  | 'POSSIBLE CONTRADICTION';

export type EvidenceSource = 'Resume' | 'Transcript' | 'Both';

export interface QuotedEvidence {
  quote: string;
  source: 'Resume' | 'Transcript';
  sectionOrSpeaker?: string;
  pageOrTimestamp?: string;
}

export interface CandidateSkill {
  id: string;
  name: string;
  category: 'Languages & Frameworks' | 'System Architecture & Cloud' | 'Database & Storage' | 'Practices & Leadership' | 'General';
  evidenceType: EvidenceType;
  source: EvidenceSource;
  quotes: QuotedEvidence[];
  verifiedInTranscript: boolean;
  statusNote: string;
}

export interface CandidateEducation {
  id: string;
  degree: string;
  fieldOfStudy?: string;
  institution: string;
  graduationYear?: string;
  evidenceType: EvidenceType;
  source: EvidenceSource;
  quote?: string;
  statusNote: string;
}

export interface CandidateExperience {
  id: string;
  role: string;
  organization: string;
  duration?: string;
  highlights: string[];
  technologies: string[];
  evidenceType: EvidenceType;
  source: EvidenceSource;
  quotes: QuotedEvidence[];
  statusNote: string;
}

export interface TechnicalExperience {
  id: string;
  domain: string;
  scaleOrDeliverable: string;
  toolsUsed: string[];
  evidenceType: EvidenceType;
  source: EvidenceSource;
  quotes: QuotedEvidence[];
  statusNote: string;
}

export interface CandidateClaim {
  id: string;
  claimText: string;
  category: 'Technical Capability' | 'Architecture & Scale' | 'Leadership & Ownership' | 'Delivery & Impact' | 'General';
  evidenceType: EvidenceType;
  source: EvidenceSource;
  supportingEvidence: string;
  quotes: QuotedEvidence[];
  verificationStatus: 'Corroborated by Transcript' | 'Unverified Resume Claim' | 'Verbal Assertion in Interview';
  statusNote: string;
}

export interface MissingInfoItem {
  id: string;
  topic: string;
  jdRequirement: string;
  status: 'Insufficient evidence';
  reason: string;
  suggestedClarification: string;
}

export interface ContradictionItem {
  id: string;
  topic: string;
  severity: 'High' | 'Medium' | 'Low';
  resumeStatement: {
    text: string;
    quote: string;
  };
  transcriptStatement: {
    text: string;
    quote: string;
  };
  discrepancySummary: string;
}

export interface CandidateProfile {
  id: string;
  candidateId: CandidateId;
  candidateName: string;
  summary: string;
  rawStats: {
    resumeCharCount: number;
    transcriptCharCount: number;
    jobDescriptionCharCount: number;
    totalEvidencePoints: number;
  };
  skills: CandidateSkill[];
  education: CandidateEducation[];
  workExperience: CandidateExperience[];
  technicalExperience: TechnicalExperience[];
  claims: CandidateClaim[];
  missingInformation: MissingInfoItem[];
  contradictions: ContradictionItem[];
  processedAt: Date;
  isProcessed: boolean;
}

// --- FOUR INDEPENDENT AI AGENTS DATA MODEL ---

export type AgentRecommendation = 
  | 'Strongly Move Forward'
  | 'Move Forward'
  | 'Move Forward with Reservations'
  | 'Do Not Move Forward'
  | 'Requires Clarification';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface AgentEvidenceItem {
  claimOrConclusion: string;
  source: EvidenceSource;
  exactQuoteOrEvidence: string;
  explanation: string;
}

export interface AgentEvaluation {
  agentId: AgentRole;
  agentName: string;
  roleTitle: string;
  overallAssessment: string;
  recommendation: AgentRecommendation;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0 to 100
  strengths: string[];
  concerns: string[];
  evidenceItems: AgentEvidenceItem[];
  evaluatedAt: Date;
  isEvaluationComplete: boolean;
}

export interface CandidateEvaluations {
  candidateA: Record<AgentRole, AgentEvaluation | null>;
  candidateB: Record<AgentRole, AgentEvaluation | null>;
}

// --- STAGE 4: MULTI-AGENT DEBATE DATA MODEL ---

export type DebatePosition = 'agree' | 'disagree' | 'partially agree';

export interface DebateResponse {
  id: string;
  respondingAgent: AgentRole;
  targetAgent: AgentRole;
  pointAddressed: string;
  response: string;
  supportingEvidence: string;
  position: DebatePosition;
}

export interface OpinionChange {
  agentId: AgentRole;
  agentName: string;
  originalRecommendation: AgentRecommendation;
  originalConfidence: ConfidenceLevel;
  originalConfidenceScore: number;
  revisedRecommendation: AgentRecommendation;
  revisedConfidence: ConfidenceLevel;
  revisedConfidenceScore: number;
  changed: boolean;
  reason: string;
  influencedByAgent: AgentRole | null;
  evidence: string;
}

export interface DebateResult {
  candidateId: CandidateId;
  round1Responses: DebateResponse[];
  opinionChanges: OpinionChange[];
  isComplete: boolean;
  timestamp: Date;
}

// --- STAGE 5: FINAL DECISION AND FINAL REPORT DATA MODEL ---

export type FinalRecommendation = 
  | 'Strongly Advance'
  | 'Advance'
  | 'Hold / Need More Evidence'
  | 'Do Not Advance';

export interface UnresolvedDisagreement {
  topic: string;
  agentAPerspective: {
    agent: AgentRole;
    stance: string;
  };
  agentBPerspective: {
    agent: AgentRole;
    stance: string;
  };
  finalReasoning: string;
}

export interface EvidenceTraceItem {
  claim: string;
  source: EvidenceSource | 'Debate Argument';
  citation: string;
  impactOnDecision: string;
}

export interface FinalDecisionReport {
  candidateId: CandidateId;
  candidateName: string;
  recommendation: FinalRecommendation;
  confidenceScore: number; // 0 to 100
  confidenceExplanation: string;
  decisionReasoning: string;
  strengths: Array<{
    strength: string;
    evidence: string;
    source: EvidenceSource;
  }>;
  concerns: Array<{
    concern: string;
    evidence: string;
    source: EvidenceSource;
  }>;
  unresolvedDisagreements: UnresolvedDisagreement[];
  opinionChangesSummary: string;
  evidenceTrace: EvidenceTraceItem[];
  generatedAt: Date;
  isComplete: boolean;
}
