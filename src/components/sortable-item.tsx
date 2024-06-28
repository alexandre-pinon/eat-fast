import type { WeekMeal } from "@/entities/meal";
import { useModalStore } from "@/hooks/modal-store";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

export const SortableItem = ({
  meal,
  className,
  children,
}: Readonly<{
  meal: WeekMeal;
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
  const { openModal, setModalState, setActiveMeal, hideBackLink } =
    useModalStore();

  const handleOnClick = () => {
    setActiveMeal(meal);
    hideBackLink();
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
