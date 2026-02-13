import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import storage from '../utils/storage';
import { toStoredImage } from '../utils/imageSources';

const HistoryContext = createContext(null);

const STORAGE_KEY = 'history_items_v1';
const MAX_ITEMS = 200;

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function HistoryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsRef = useRef([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const raw = await storage.getItem(STORAGE_KEY);
        if (!mounted) {
          return;
        }
        setItems(raw ? JSON.parse(raw) : []);
      } catch (error) {
        if (mounted) {
          setItems([]);
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

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const persist = useCallback(async (nextItems) => {
    itemsRef.current = nextItems;
    setItems(nextItems);
    try {
      await storage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    } catch (error) {
      // ignore persistence failures
    }
  }, []);

  const addItem = useCallback(async ({ type, image, meta }) => {
    const storedImage = toStoredImage(
      image,
      type === 'faceSwap' ? 'faceSwapPlaceholder' : 'imagePlaceholder',
    );

    const newItem = {
      id: createId(),
      type,
      image: storedImage,
      meta: meta || {},
      createdAt: Date.now(),
    };

    const nextItems = [newItem, ...itemsRef.current].slice(0, MAX_ITEMS);
    await persist(nextItems);
  }, [persist]);

  const clearItems = useCallback(async () => {
    await persist([]);
  }, [persist]);

  const value = useMemo(
    () => ({
      items,
      loading,
      addItem,
      clearItems,
    }),
    [items, loading, addItem, clearItems],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used inside HistoryProvider');
  }
  return context;
}
