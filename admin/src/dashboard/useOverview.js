import { useEffect, useRef, useState } from 'react';
import { overviewApi } from './overviewClient.js';

export function useOverview() {
  const [state, setState] = useState({ data: null, loading: true, refreshing: false, error: '' });
  const refresh = useRef(() => {});

  useEffect(() => {
    let active = true;
    let pending = false;
    async function load() {
      if (pending) return;
      pending = true;
      setState((current) => ({ ...current, loading: !current.data, refreshing: !!current.data, error: '' }));
      try {
        const data = await overviewApi.get();
        if (active) setState({ data, loading: false, refreshing: false, error: '' });
      } catch (error) {
        if (active) setState((current) => ({ ...current, loading: false, refreshing: false, error: error.message }));
      } finally { pending = false; }
    }
    function refreshVisible() { if (!document.hidden) void load(); }
    refresh.current = load;
    void load();
    const timer = window.setInterval(refreshVisible, 60000);
    window.addEventListener('focus', refreshVisible);
    document.addEventListener('visibilitychange', refreshVisible);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', refreshVisible);
      document.removeEventListener('visibilitychange', refreshVisible);
    };
  }, []);

  return { ...state, refresh: () => refresh.current() };
}
