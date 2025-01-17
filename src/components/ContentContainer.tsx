import React from "react";
import { Column, Id } from "../type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiTrash, FiPlus } from "react-icons/fi";

interface Props {
  columns: Column;
  handleDeleteCol: (id: Id) => void;
}

const KanbanBoard = (props: Props) => {
  const { columns, handleDeleteCol } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columns.id,
    data: {
      type: "Column",
      columns,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  //create a custom overlook while dragging
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-72 max-w-96  rounded-md h-80 max-h-96 bg-neutral-400 shadow-xl p-1 flex flex-col border opacity-40 border-rose-500 "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-72 max-w-96  rounded-md h-80 max-h-96 bg-neutral-400 shadow-xl p-1 flex flex-col "
    >
      <div
        {...attributes}
        {...listeners}
        className="bg-neutral-700 text-white p-2 rounded-md flex items-center justify-between"
      >
        <div className="flex gap-3">
          <p className="text-xs bg-neutral-500 flex items-center p-2 rounded-md text-white">
            0
          </p>
          <p className="font-semibold flex items-center">{columns.title}</p>
        </div>
        <div>
          <button
            onClick={() => handleDeleteCol(columns.id)}
            className=" px-2 py-1 rounded-md hover:bg-neutral-500 transition-all duration-500 "
          >
            <FiTrash className="text-white" size={20} />
          </button>
        </div>
      </div>
      <div className="flex flex-grow">
        <h1>Content</h1>
      </div>
      <div>
        <p>footer</p>
      </div>
    </div>
  );
};

export default KanbanBoard;
