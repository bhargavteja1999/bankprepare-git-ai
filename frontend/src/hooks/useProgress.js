import { useState, useEffect, useCallback } from "react";
import * as progressApi from "../services/progressApi";
export function useProgress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    setLoading(true);
    try { const d = await progressApi.getProgress(); setData(d); } finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { data, loading, refresh };
}
export default useProgress;
