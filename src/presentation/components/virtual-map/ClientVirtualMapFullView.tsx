"use client";

import { useEffect, useState } from "react";
import { VirtualMapFullView } from "./VirtualMapFullView";

interface ClientVirtualMapFullViewProps {
  initialLocationId?: string;
}

export function ClientVirtualMapFullView({ initialLocationId }: ClientVirtualMapFullViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <VirtualMapFullView initialLocationId={initialLocationId} />;
}
