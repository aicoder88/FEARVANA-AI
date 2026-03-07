export const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  light: "#f8fafc",
  dark: "#1e293b",
};

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const DEFAULT_DASHBOARD_LAYOUT = {
  radar: { x: 0, y: 0, w: 6, h: 4 },
  progress: { x: 6, y: 0, w: 6, h: 2 },
  trends: { x: 6, y: 2, w: 6, h: 2 },
  checklist: { x: 0, y: 4, w: 4, h: 4 },
  coach: { x: 4, y: 4, w: 8, h: 4 },
};

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

export const LOCAL_STORAGE_KEYS = {
  THEME: "fearvana-theme",
  DASHBOARD_LAYOUT: "fearvana-dashboard-layout",
  USER_PREFERENCES: "fearvana-user-preferences",
  SACRED_EDGE_DATA: "fearvana-sacred-edge",
  AI_CHAT_HISTORY: "fearvana-chat-history",
} as const;
