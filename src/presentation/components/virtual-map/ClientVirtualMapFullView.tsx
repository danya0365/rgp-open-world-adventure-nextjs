"use client";

import { useEffect, useState } from "react";
import { VirtualMapFullView } from "./VirtualMapFullView";

export function ClientVirtualMapFullView() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <VirtualMapFullView />;
}
