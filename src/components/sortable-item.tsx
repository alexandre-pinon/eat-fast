import { useModalStore } from "@/hooks/modal-store";
import type { Meal } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

export const SortableItem = ({
  meal,
  className,
  children,
}: Readonly<{
  meal: Meal;
  className?: string;
  children: ReactNode;
}>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: meal.id });
  const { openModal, setModalState, setActiveMeal } = useModalStore();

  const handleOnClick = () => {
    setActiveMeal(meal);
    setModalState("meal");
    openModal();
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      className={className}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleOnClick}
    >
      {children}
    </div>
  );
};
