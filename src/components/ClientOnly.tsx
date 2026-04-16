"use client";

import { ReactNode, useSyncExternalStore } from "react";

function subscribe() {
  return () => undefined;
}

export default function ClientOnly({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
}
