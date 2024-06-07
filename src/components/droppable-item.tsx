import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

export const DroppableItem = ({
  id,
  className,
  children,
}: Readonly<{ id: string; className?: string; children: ReactNode }>) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className={className} ref={setNodeRef}>
      {children}
    </div>
  );
};
