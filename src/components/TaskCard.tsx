import { useState } from "react";
import { Id, Task } from "../type";
import { FiTrash } from "react-icons/fi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  handleTaskDelete: (id: Id) => void;
  updateTextValue: (id: Id, content: string) => void;
}

const TaskCard = ({ task, handleTaskDelete, updateTextValue }: Props) => {
  const [isMouseIn, setIsMouseIn] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setIsMouseIn(false);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (editMode) {
    return (
      <>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className=" h-[70px] min-h-[70px] bg-neutral-700 text-white w-full  flex justify-between items-center px-3  rounded-md cursor-grab hover:ring-red-500 hover:ring-1 hover:ring-inset transition-all duration-500 mt-2"
        >
          <textarea
            value={task.content}
            className="w-full bg-transparent resize-none focus:outline-none h-[70px] min-h-[70px] overflow-x-hidden overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-sky-500 scrollbar-track-transparent scrollbar-thumb-rounded-md  "
            autoFocus
            onBlur={toggleEditMode}
            onChange={(e) => updateTextValue(task.id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                toggleEditMode();
              }
            }}
          />
        </div>
        {/* <div className="fixed animate-bounce top-20 right-16 bg-rose-200 p-2 rounded-md text-red-500">
          Press Shift + Enter to save
        </div> */}
      </>
    );
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className=" h-[70px] min-h-[70px] bg-neutral-700 text-white w-full  flex justify-between items-center px-3 rounded-md cursor-grab border border-rose-500 opacity-30 mt-2 "
      />
    );
  }

  return (
    <div
      onClick={toggleEditMode}
      onMouseEnter={() => setIsMouseIn(true)}
      onMouseLeave={() => setIsMouseIn(false)}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className=" h-[70px] min-h-[70px] bg-neutral-700 text-white w-full  flex justify-between items-center px-3 rounded-md cursor-grab hover:ring-red-500 hover:ring-1 hover:ring-inset  mt-2  "
    >
      <p className="whitespace-pre-wrap overflow-y-auto overflow-x-hidden h-[70px] min-h-[70px] py-2 w-full scrollbar-thin scrollbar-thumb-sky-500 scrollbar-track-transparent scrollbar-thumb-rounded-md ">
        {task.content}
      </p>
      {isMouseIn && (
        <button
          onClick={() => handleTaskDelete(task.id)}
          className=" px-2 py-1 rounded-md bg-neutral-500  transition-all duration-500 opacity-80 hover:opacity-100 "
        >
          <FiTrash />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
