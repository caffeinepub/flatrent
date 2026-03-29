import { HttpAgent } from "@icp-sdk/core/agent";
import { useEffect, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

let cachedClient: StorageClient | null = null;

export function useStorageClient() {
  const [client, setClient] = useState<StorageClient | null>(cachedClient);

  useEffect(() => {
    if (cachedClient) {
      setClient(cachedClient);
      return;
    }
    loadConfig().then((config) => {
      const agent = new HttpAgent({ host: config.backend_host });
      const sc = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      cachedClient = sc;
      setClient(sc);
    });
  }, []);

  return client;
}
