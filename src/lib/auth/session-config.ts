export const ADMIN_SESSION_COOKIE = "geosat_admin_session";
export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_DASHBOARD_PATH = "/admin/dashboard";

export const SESSION_ABSOLUTE_MS = 12 * 60 * 60 * 1000;
export const SESSION_INACTIVITY_MS = 30 * 60 * 1000;
export const SESSION_WARNING_MS = 2 * 60 * 1000;
export const SESSION_ACTIVITY_DEBOUNCE_MS = 60 * 1000;
export const SESSION_COOKIE_MAX_AGE_SECONDS = Math.floor(SESSION_ABSOLUTE_MS / 1000);

export const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 5;
