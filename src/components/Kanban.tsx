import { useMemo, useState } from "react";
import { Column, Id, Task } from "../type";
import AddButton from "./AddButton";
import ContentContainer from "./ContentContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import SkeletonContainers from "./SkeletonContainers";
import TaskCard from "./TaskCard";

const Kanban = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [task, setTask] = useState<Task[]>([]);

  //useMemo hook for columns id helps in optimization
  const columnsId = useMemo(() => {
    return columns.map((col) => col.id);
  }, [columns]);

  //   console.log(columns);

  //adding useSensor hook to fix delete button issue, because delete button is acting like draggable element

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <div className="min-h-screen items-center flex flex-col justify-center ">
      <div
        className="
    flex justify-between items-center bg-neutral-700 w-full max-w-6xl mx-auto py-2 px-4 rounded-md shadow-md"
      >
        <p className="text-white tracking-wider font-semibold">
          Click add button to add Columns
        </p>
        <AddButton addColumsData={addColumsData} />
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className=" flex gap-4 w-full max-w-6xl mx-auto overflow-x-scroll overflow-y-hidden mt-4 scrollbar-thin scrollbar-thumb-rose-500 scrollbar-track-transparent h-[50vh] 2xl:h-[30vh]">
          {/* Display the skeleton cotainer only when the columns array is empty */}
          {columns.length === 0 && <SkeletonContainers />}
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <div key={col.id}>
                <ContentContainer
                  columns={col}
                  handleDeleteCol={() => handleDeleteCol(col.id)}
                  updateColumn={updateColumn}
                  addTask={addTask}
                  task={task.filter((ta) => ta.columnId === col.id)}
                  handleTaskDelete={handleTaskDelete}
                  updateTextValue={updateTextValue}
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
                updateColumn={updateColumn}
                addTask={addTask}
                task={task.filter((task) => task.id === activeColumn.id)}
                handleTaskDelete={handleTaskDelete}
                updateTextValue={updateTextValue}
              ></ContentContainer>
            )}

            {activeTask && (
              <TaskCard
                task={activeTask}
                handleTaskDelete={handleTaskDelete}
                updateTextValue={updateTextValue}
              />
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
    setActiveColumn(null);
    setActiveTask(null);

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

  //function to handle onDragOver event for task drag
  // function onDragOver(event: DragOverEvent) {
  //   const { active, over } = event;

  //   if (!over) return;

  //   const activeId = active.id;
  //   const overId = over.id;

  //   if (activeId === overId) return;

  //   //Dropping a task in same column

  //   const isActiveATask = active.data.current?.type === "Task";
  //   const isOverATask = active.data.current?.type === "Task";

  //   if (!isActiveATask) return;

  //   if (isActiveATask && isOverATask) {
  //     setTask((task) => {
  //       const findActiveIndex = task.findIndex((t) => t.id === activeId);
  //       const findOverIndex = task.findIndex((t) => t.id === overId);

  //       task[findActiveIndex].columnId = task[findOverIndex].columnId;

  //       return arrayMove(task, findActiveIndex, findOverIndex);
  //     });
  //   }

  //   //Dropping the task in different column

  //   const isOverAColumn = over.data.current?.type === "Column";

  //   if (isActiveATask && isOverAColumn) {
  //     setTask((task) => {
  //       const findActiveIndex = task.findIndex((t) => t.id === activeId);

  //       task[findActiveIndex].columnId = overId;

  //       return arrayMove(task, findActiveIndex, findActiveIndex);
  //     });
  //   }
  // }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";
    const isOverAColumn = overData?.type === "Column";

    // Dropping a task on another task in the same column
    if (isActiveATask && isOverATask) {
      setTask((prevTasks) => {
        const tasks = [...prevTasks];
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        // Swap their positions but keep them in the same column
        if (activeIndex !== -1 && overIndex !== -1) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex);
        }

        return tasks;
      });
    }

    // Dropping a task into a different column
    if (isActiveATask && isOverAColumn) {
      setTask((prevTasks) => {
        const tasks = [...prevTasks];
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        if (activeIndex !== -1) {
          tasks[activeIndex] = {
            ...tasks[activeIndex],
            columnId: overId,
          };
        }

        return tasks;
      });
    }
  }

  //function to update column title
  function updateColumn(id: Id, title: string) {
    setColumns((prev) => {
      return prev.map((col) => {
        if (col.id === id) {
          return { ...col, title };
        }
        return col;
      });
    });
  }

  //function to add task
  function addTask(columnId: Id) {
    const newTaskData: Task = {
      id: generateRandomId(),
      columnId,
      content: `New Task ${task.length + 1}`,
    };

    setTask([...task, newTaskData]);
  }
  //function to delete the tasks

  function handleTaskDelete(id: Id) {
    const newTask = task.filter((tas) => tas.id !== id);

    setTask(newTask);
  }

  //function to update the text
  function updateTextValue(id: Id, content: string) {
    const newTask = task.map((tas) =>
      tas.id !== id ? tas : { ...tas, content }
    );
    setTask(newTask);
  }
};

export default Kanban;
