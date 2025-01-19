import { useMemo, useState } from "react";
import { Column, Id, Task } from "../type";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiPlus, FiTrash } from "react-icons/fi";
import TaskCard from "./TaskCard";

interface Props {
  columns: Column;
  handleDeleteCol: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  addTask: (columnId: Id) => void;
  task: Task[];
  handleTaskDelete: (id: Id) => void;
  updateTextValue: (id: Id, content: string) => void;
}

const KanbanBoard = (props: Props) => {
  const {
    columns,
    handleDeleteCol,
    updateColumn,
    addTask,
    task,
    handleTaskDelete,
    updateTextValue,
  } = props;
  const [editMode, setEditMode] = useState(false);

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
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  //Get the Id for Tasks
  const itemsId = useMemo(() => {
    return task.map((item) => item.id);
  }, [task]);

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
      className="w-72 max-w-96  rounded-md h-80 max-h-96 bg-neutral-500 shadow-xl p-2 flex flex-col "
    >
      <div
        {...attributes}
        {...listeners}
        className="bg-neutral-700 text-white p-2 rounded-md flex items-center justify-between mb-2"
      >
        <div className="flex gap-3">
          <p className="text-xs bg-neutral-500 flex items-center p-2 rounded-md text-white">
            0
          </p>
          <form
            className="flex items-center  "
            onClick={() => setEditMode(true)}
          >
            {!editMode && (
              <p className="font-semibold flex items-center">{columns.title}</p>
            )}
            {editMode && (
              <input
                autoFocus
                value={columns.title}
                onBlur={() => setEditMode(false)}
                className="outline-none px-2 py-0.5 focus:ring-2 focus:ring-rose-500 rounded-md text-black"
                onChange={(e) => updateColumn(columns.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  setEditMode(false);
                }}
              />
            )}
          </form>
        </div>
        <div>
          <button
            onClick={() => handleDeleteCol(columns.id)}
            className=" px-2 py-1 rounded-md bg-neutral-500 hover:bg-neutral-400 transition-all duration-500 "
          >
            <FiTrash className="text-white" />
          </button>
        </div>
      </div>
      <div className="flex flex-grow flex-col overflow-x-hidden overflow-y-scroll scrollbar-none">
        <SortableContext items={itemsId}>
          {task.map((tas) => (
            <TaskCard
              handleTaskDelete={handleTaskDelete}
              key={tas.id}
              task={tas}
              updateTextValue={updateTextValue}
            />
          ))}
        </SortableContext>
      </div>

      <button
        onClick={() => addTask(columns.id)}
        className="flex items-center gap-2 text-white bg-neutral-700 p-2 rounded-md hover:ring-1 hover:ring-green-500 transition-all duration-500 group mt-2"
      >
        <FiPlus
          size={18}
          className="bg-red-500  rounded-md group-hover:bg-green-500 "
        />{" "}
        Add Task
      </button>
    </div>
  );
};

export default KanbanBoard;
