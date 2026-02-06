import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import storage from '../utils/storage';

const SubscriptionContext = createContext(null);
const STORAGE_KEY = 'subscription_state_v1';

const getIsActive = (state) => {
  if (!state?.isPremium) {
    return false;
  }
  if (!state.expiresAt) {
    return true;
  }
  return state.expiresAt > Date.now();
};

export function SubscriptionProvider({ children }) {
  const [state, setState] = useState({ isPremium: false, expiresAt: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const raw = await storage.getItem(STORAGE_KEY);
        if (!mounted) {
          return;
        }
        if (raw) {
          const parsed = JSON.parse(raw);
          const isActive = getIsActive(parsed);
          setState({
            isPremium: isActive ? parsed.isPremium : false,
            expiresAt: isActive ? parsed.expiresAt : null,
          });
        }
      } catch (error) {
        if (mounted) {
          setState({ isPremium: false, expiresAt: null });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const setSubscription = async ({ isPremium, expiresAt }) => {
    const nextState = { isPremium, expiresAt: expiresAt || null };
    setState(nextState);
    try {
      await storage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (error) {
      // ignore persistence failures
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      loading,
      isActive: getIsActive(state),
      setSubscription,
    }),
    [state, loading],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used inside SubscriptionProvider');
  }
  return context;
}
