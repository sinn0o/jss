"use client";

import { useCallback, useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import type { Experience, ExperienceInput } from "@/lib/types";

export function useExperiences() {
  const [data, setData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await storage.listExperiences();
      setData(list);
    } catch {
      setError("경험 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // refresh()의 첫 동기 구문(setLoading(true))은 마운트 시 초기 로딩 상태를 트리거하기 위한
    // 의도된 동작이다 (초기값도 true라 실질 변화는 없음).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const create = useCallback(async (input: ExperienceInput) => {
    const created = await storage.createExperience(input);
    setData((prev) => [created, ...prev]);
    return created;
  }, []);

  const update = useCallback(async (id: string, patch: Partial<ExperienceInput>) => {
    const updated = await storage.updateExperience(id, patch);
    setData((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    await storage.deleteExperience(id);
    setData((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { data, loading, error, refresh, create, update, remove };
}
