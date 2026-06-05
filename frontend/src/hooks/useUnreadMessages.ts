import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../auth/useAuth";

type UnreadData = { total: number; by_link: Record<string, number> };

const POLL_MS = 30_000;

export function useUnreadMessages() {
  const { session } = useAuth();
  const [data, setData] = useState<UnreadData>({ total: 0, by_link: {} });

  useEffect(() => {
    if (!session) return;

    function fetch() {
      api
        .get<UnreadData>("/messages/unread-counts")
        .then((res) => setData(res.data))
        .catch(() => {});
    }

    fetch();
    const id = setInterval(fetch, POLL_MS);
    return () => clearInterval(id);
  }, [session]);

  return data;
}
