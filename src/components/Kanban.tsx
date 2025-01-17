import { useMemo, useState } from "react";
import { Column, Id } from "../type";
import AddButton from "./AddButton";
import ContentContainer from "./ContentContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import SkeletonContainers from "./SkeletonContainers";

const Kanban = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  //useMemo hook for columns id helps in optimization
  const columnsId = useMemo(() => {
    return columns.map((col) => col.id);
  }, [columns]);

  //   console.log(columns);

  return (
    <div className="min-h-screen  items-center flex flex-col justify-center ">
      <div
        className="
    flex justify-between items-center bg-neutral-700 w-full max-w-6xl mx-auto py-2 px-4 rounded-md shadow-md"
      >
        <p className="text-white tracking-wider font-semibold">
          Click add button to add Columns
        </p>
        <AddButton addColumsData={addColumsData} />
      </div>

      <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className=" flex gap-4 w-full max-w-6xl mx-auto overflow-x-scroll overflow-y-hidden mt-4 ">
          {/* Display the skeleton cotainer only when the columns array is empty */}
          {columns.length === 0 && <SkeletonContainers />}
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <div key={col.id}>
                <ContentContainer
                  columns={col}
                  handleDeleteCol={() => handleDeleteCol(col.id)}
                />
              </div>
            ))}
          </SortableContext>
        </div>

        {/* Added drag overlay so that while dragging we can see the skeleton column */}

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ContentContainer
                columns={activeColumn}
                handleDeleteCol={handleDeleteCol}
              ></ContentContainer>
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function addColumsData() {
    const newColumnData: Column = {
      id: generateRandomId(),
      title: `New Column ${columns.length + 1}`,
    };

    setColumns([...columns, newColumnData]);
  }

  //function to generate random Id
  function generateRandomId() {
    return Math.floor(Math.random() * 1000);
  }
  //function handleDelete
  function handleDeleteCol(id: Id) {
    const filteredData = columns.filter((col) => col.id !== id);
    setColumns(filteredData);
  }

  //function to handle onDrag event
  function onDragStart(event: DragStartEvent) {
    // console.log("Draged event", event);

    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.columns);
      return;
    }
  }

  //function to handle onDragEnd event
  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setColumns((prev) => {
      const findActiveIndex = prev.findIndex((col) => col.id === activeId);
      const findOverIndex = prev.findIndex((col) => col.id === overId);

      return arrayMove(prev, findActiveIndex, findOverIndex);
    });
  }
};

export default Kanban;
