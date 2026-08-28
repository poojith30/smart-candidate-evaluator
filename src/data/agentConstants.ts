import type { AgentInfo } from '../types';

export const AGENTS_CONFIG: Record<string, AgentInfo> = {
  tech: {
    id: 'tech',
    title: 'Technical Agent',
    subtitle: 'Hard Skills & Architecture Assessor',
    description: 'Analyzes technical depth, algorithmic rigor, system design tradeoffs, problem solving in transcripts, and validates claimed tech stack competencies from resume against interview answers.',
    focusAreas: ['System Design & Architecture', 'Code Quality & Best Practices', 'Tech Stack Alignment', 'Technical Depth & Problem Solving'],
    themeColor: {
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      border: 'border-cyan-500/20 hover:border-cyan-500/50',
      glow: 'shadow-glow-cyan',
      accent: 'text-cyan-400',
      bgSubtle: 'bg-cyan-950/20',
      iconBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    }
  },
  culture: {
    id: 'culture',
    title: 'HR / Culture Agent',
    subtitle: 'Values & Team Alignment Assessor',
    description: 'Evaluates behavioral traits, communication clarity, emotional intelligence, cross-functional collaboration, growth mindset, and organizational culture compatibility from interview responses.',
    focusAreas: ['Communication & Articulation', 'Collaboration & Team Dynamics', 'Conflict Resolution & Humility', 'Growth Mindset & Motivation'],
    themeColor: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      border: 'border-emerald-500/20 hover:border-emerald-500/50',
      glow: 'shadow-glow-emerald',
      accent: 'text-emerald-400',
      bgSubtle: 'bg-emerald-950/20',
      iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    }
  },
  manager: {
    id: 'manager',
    title: 'Hiring Manager Agent',
    subtitle: 'Execution & Business Impact Assessor',
    description: 'Focuses on end-to-end delivery capability, project ownership, business acumen, mentorship potential, prioritization under constraints, and immediate readiness for role requirements.',
    focusAreas: ['Project Ownership & Delivery', 'Business & Product Acumen', 'Leadership & Mentorship', 'Prioritization & Velocity'],
    themeColor: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      border: 'border-amber-500/20 hover:border-amber-500/50',
      glow: 'shadow-glow-amber',
      accent: 'text-amber-400',
      bgSubtle: 'bg-amber-950/20',
      iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    }
  },
  skeptic: {
    id: 'skeptic',
    title: 'Skeptic Agent',
    subtitle: 'Adversarial Risk & Red Flag Assessor',
    description: 'Actively hunts for resume-to-interview contradictions, unverified claims, shallow responses, vague answers to deep questions, potential flight risks, and overlooked warning signs.',
    focusAreas: ['Resume Claim Verification', 'Vague/Superficial Answers', 'Inconsistencies & Red Flags', 'Risk Mitigation Notes'],
    themeColor: {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      border: 'border-rose-500/20 hover:border-rose-500/50',
      glow: 'shadow-glow-rose',
      accent: 'text-rose-400',
      bgSubtle: 'bg-rose-950/20',
      iconBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    }
  }
};
