/**
 * Design Tokens
 *
 * Centralized design system tokens for consistent styling across the application.
 * Replaces scattered hardcoded values with reusable constants.
 *
 * Usage:
 * import { GRADIENTS, COLORS, SPACING } from '@/lib/design-tokens';
 * className={GRADIENTS.primary}
 */

/**
 * Color Gradients
 * Consistent gradient patterns used throughout the app
 */
export const GRADIENTS = {
  // Primary gradients
  primary: 'bg-gradient-to-r from-primary via-accent to-primary',
  primaryBr: 'bg-gradient-to-br from-primary via-accent to-primary',
  primaryVertical: 'bg-gradient-to-b from-primary to-accent',

  // Page backgrounds
  pageBackground: 'bg-gradient-to-br from-background via-background to-primary/5',
  pageBackgroundIndigo: 'bg-gradient-to-br from-background via-background to-indigo-50/20 dark:to-indigo-950/20',
  pageBackgroundBlue: 'bg-gradient-to-br from-background via-background to-blue-50/20 dark:to-blue-950/20',
  pageBackgroundPurple: 'bg-gradient-to-br from-background via-background to-purple-50/20 dark:to-purple-950/20',

  // Icon backgrounds
  iconBlue: 'bg-gradient-to-br from-blue-500 to-blue-600',
  iconIndigo: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500',
  iconGreen: 'bg-gradient-to-br from-green-500 to-green-600',
  iconOrange: 'bg-gradient-to-br from-orange-500 to-red-500',
  iconPurple: 'bg-gradient-to-br from-purple-500 to-purple-600',
  iconEmerald: 'bg-gradient-to-br from-emerald-500 to-teal-600',

  // Card backgrounds
  cardSubtle: 'bg-gradient-to-br from-card via-card to-accent/5 dark:to-accent/10',
  cardBlue: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
  cardGreen: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900',
  cardPurple: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900',
  cardIndigo: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950',
  cardEmerald: 'bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-50 dark:from-emerald-950 dark:via-blue-950 dark:to-emerald-950',

  // Text gradients
  textPrimary: 'bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent',
  textIndigo: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent',
  textBlue: 'bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent',

  // Button gradients
  buttonPrimary: 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90',
  buttonIndigo: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500',
  buttonBlue: 'bg-gradient-to-r from-blue-500 to-blue-600',
  buttonGreen: 'bg-gradient-to-r from-green-500 to-green-600',
} as const;

/**
 * Sacred Edge specific color schemes
 */
export const SACRED_EDGE_COLORS = {
  primary: {
    bg: 'bg-indigo-50 dark:bg-indigo-950',
    text: 'text-indigo-700 dark:text-indigo-300',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
  },
} as const;

/**
 * Life area color mappings
 */
export const LIFE_AREA_COLORS = {
  mindset_maturity: {
    light: 'purple',
    gradient: GRADIENTS.iconPurple,
    bg: 'bg-purple-50 dark:bg-purple-950',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
  family_relationships: {
    light: 'pink',
    gradient: 'bg-gradient-to-br from-pink-500 to-pink-600',
    bg: 'bg-pink-50 dark:bg-pink-950',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-200 dark:border-pink-800',
  },
  money: {
    light: 'green',
    gradient: GRADIENTS.iconGreen,
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  fitness: {
    light: 'blue',
    gradient: GRADIENTS.iconBlue,
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  health: {
    light: 'red',
    gradient: 'bg-gradient-to-br from-red-500 to-red-600',
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  skill_building: {
    light: 'indigo',
    gradient: GRADIENTS.iconIndigo,
    bg: 'bg-indigo-50 dark:bg-indigo-950',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
  fun_joy: {
    light: 'yellow',
    gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
} as const;

/**
 * Shadow styles
 */
export const SHADOWS = {
  card: 'shadow-sm hover:shadow-lg',
  cardMd: 'shadow-md hover:shadow-xl',
  cardLg: 'shadow-lg hover:shadow-2xl',
  glow: 'shadow-lg shadow-primary/25',
  glowIndigo: 'shadow-lg shadow-indigo-500/25',
  glowBlue: 'shadow-lg shadow-blue-500/25',
} as const;

/**
 * Border styles
 */
export const BORDERS = {
  default: 'border border-border',
  primary: 'border-2 border-primary',
  accent: 'border-2 border-accent',
  subtle: 'border border-border/50',
  none: 'border-0',
} as const;

/**
 * Spacing scales
 */
export const SPACING = {
  page: 'px-4 py-8',
  section: 'mb-8',
  card: 'p-6',
  cardSm: 'p-4',
  cardLg: 'p-8',
} as const;

/**
 * Border radius
 */
export const RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;

/**
 * Transition styles
 */
export const TRANSITIONS = {
  default: 'transition-all duration-200',
  slow: 'transition-all duration-300',
  fast: 'transition-all duration-150',
  colors: 'transition-colors duration-200',
  transform: 'transition-transform duration-300',
} as const;

/**
 * Interactive states
 */
export const INTERACTIVE = {
  hover: 'hover:scale-105 hover:shadow-lg',
  hoverSubtle: 'hover:scale-102 hover:shadow-md',
  click: 'active:scale-95',
  focus: 'focus:ring-2 focus:ring-primary focus:ring-offset-2',
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
} as const;

/**
 * Animation classes
 */
export const ANIMATIONS = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
} as const;

/**
 * Common component styles
 */
export const COMPONENTS = {
  header: 'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40',
  card: 'rounded-lg border bg-card text-card-foreground shadow-sm',
  cardHover: 'rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300',
  button: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
} as const;

/**
 * Grid layouts
 */
export const GRIDS = {
  stats: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  cards: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  twoCol: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
  threeCol: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  fourCol: 'grid grid-cols-2 md:grid-cols-4 gap-4',
} as const;

/**
 * Typography
 */
export const TYPOGRAPHY = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  body: 'text-base',
  small: 'text-sm text-muted-foreground',
  muted: 'text-muted-foreground',
} as const;

/**
 * Helper function to combine design tokens
 */
export function combineTokens(...tokens: string[]) {
  return tokens.join(' ');
}

/**
 * Get life area color scheme
 */
export function getLifeAreaColors(category: keyof typeof LIFE_AREA_COLORS) {
  return LIFE_AREA_COLORS[category] || LIFE_AREA_COLORS.mindset_maturity;
}
