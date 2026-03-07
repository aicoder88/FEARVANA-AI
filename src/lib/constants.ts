/**
 * Constants Module
 *
 * This file re-exports all constants from the split constant files.
 * For new code, prefer importing directly from the specific constant file:
 *
 * import { FEARVANA_LIFE_AREAS } from '@/lib/constants/life-areas'
 * import { AI_MODELS } from '@/lib/constants/ai'
 * import { SPIRAL_DYNAMICS_LEVELS } from '@/lib/constants/spiral-dynamics'
 */

// Re-export everything from the split constant files
export * from "./constants/life-areas";
export * from "./constants/ui";
export * from "./constants/ai";
export * from "./constants/spiral-dynamics";
export * from "./constants/gamification";
