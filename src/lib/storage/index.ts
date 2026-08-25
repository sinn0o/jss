import { localStorageClient } from "./localStorageClient";
import type { StorageClient } from "./storageClient";

// 활성 저장소 구현체. 이후 Supabase로 마이그레이션할 때는 이 한 줄만 교체하면 된다.
export const storage: StorageClient = localStorageClient;

export type { StorageClient } from "./storageClient";
