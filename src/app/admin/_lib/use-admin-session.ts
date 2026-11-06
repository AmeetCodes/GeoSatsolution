'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ADMIN_LOGIN_PATH,
  SESSION_ACTIVITY_DEBOUNCE_MS,
  SESSION_INACTIVITY_MS,
  SESSION_WARNING_MS,
} from '@/lib/auth/session-config';

const WARNING_REFRESH_RETRY_MS = 5000;

export function useAdminSession() {
  const router = useRouter();
  const [warningRemainingMs, setWarningRemainingMs] = useState(0);
  const lastActivityRef = useRef(0);
  const lastPingRef = useRef(0);
  const refreshingRef = useRef(false);
  const expiredRef = useRef(false);
  const warningActiveRef = useRef(false);

  const redirectToLogin = useCallback(
    (reason?: string) => {
      if (expiredRef.current) return;
      expiredRef.current = true;
      warningActiveRef.current = false;
      setWarningRemainingMs(0);

      const query = reason ? `?reason=${encodeURIComponent(reason)}` : '';
      router.replace(`${ADMIN_LOGIN_PATH}${query}`);
      router.refresh();
    },
    [router],
  );

  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (refreshingRef.current || expiredRef.current) return false;

    refreshingRef.current = true;
    try {
      const response = await fetch('/api/admin/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (response.status === 401) {
        redirectToLogin('timeout');
        return false;
      }

      if (!response.ok) return false;

      const now = Date.now();
      lastActivityRef.current = now;
      lastPingRef.current = now;
      warningActiveRef.current = false;
      setWarningRemainingMs(0);
      return true;
    } catch {
      return false;
    } finally {
      refreshingRef.current = false;
    }
  }, [redirectToLogin]);

  const markActivity = useCallback(() => {
    if (expiredRef.current) return;

    const now = Date.now();
    lastActivityRef.current = now;
    const sinceLastPing = now - lastPingRef.current;
    const shouldPing =
      sinceLastPing >= SESSION_ACTIVITY_DEBOUNCE_MS ||
      (warningActiveRef.current && sinceLastPing >= WARNING_REFRESH_RETRY_MS);

    if (!shouldPing) return;

    lastPingRef.current = now;
    void refreshSession();
  }, [refreshSession]);

  const expireSession = useCallback(async () => {
    if (expiredRef.current) return;

    expiredRef.current = true;
    warningActiveRef.current = false;
    setWarningRemainingMs(0);

    await Promise.race([
      fetch('/api/admin/auth/logout', { method: 'POST', keepalive: true }),
      new Promise<void>((resolve) => setTimeout(resolve, 3000)),
    ]).catch(() => undefined);

    router.replace(`${ADMIN_LOGIN_PATH}?reason=timeout`);
    router.refresh();
  }, [router]);

  const logout = useCallback(async () => {
    if (expiredRef.current) return;

    expiredRef.current = true;
    warningActiveRef.current = false;
    setWarningRemainingMs(0);

    await fetch('/api/admin/auth/logout', { method: 'POST' }).catch(() => undefined);

    router.replace(ADMIN_LOGIN_PATH);
    router.refresh();
  }, [router]);

  useEffect(() => {
    lastActivityRef.current = Date.now();

    const initialRefresh = window.setTimeout(() => {
      void refreshSession();
    }, 0);

    const activityEvents: Array<keyof WindowEventMap> = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
      'touchstart',
    ];

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, markActivity, { passive: true });
    });

    const timer = window.setInterval(() => {
      if (expiredRef.current) return;

      const inactiveFor = Date.now() - lastActivityRef.current;

      if (inactiveFor >= SESSION_INACTIVITY_MS) {
        void expireSession();
        return;
      }

      if (inactiveFor >= SESSION_INACTIVITY_MS - SESSION_WARNING_MS) {
        warningActiveRef.current = true;
        setWarningRemainingMs(SESSION_INACTIVITY_MS - inactiveFor);
        return;
      }

      if (warningActiveRef.current) {
        warningActiveRef.current = false;
        setWarningRemainingMs(0);
      }
    }, 1000);

    return () => {
      window.clearTimeout(initialRefresh);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, markActivity);
      });
      window.clearInterval(timer);
    };
  }, [expireSession, markActivity, refreshSession]);

  return {
    showWarning: warningRemainingMs > 0,
    warningRemainingMs,
    extendSession: refreshSession,
    logout,
  };
}
