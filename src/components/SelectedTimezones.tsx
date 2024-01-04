import { memo } from "react";
import TimezoneRow from "./SelectedTimezoneRow";
import { Timezone, useSelectedTimezones } from "~/utils/hooks/use-timezones";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { cn } from "~/utils/cn";
import { useSearchParams } from "react-router-dom";

export default memo(function SelectedTimezones() {
  const [selectedTimezones, setSelectedTimezones] = useSelectedTimezones();
  const [, setSearchParams] = useSearchParams();

  function reorderTimezones(
    timezones: Timezone[],
    sourceIndex: number,
    destinationIndex: number
  ) {
    const result = Array.from(timezones);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);

    return result;
  }

  function reorderUrl(timezonesName: string[]) {
    setSearchParams({ timezones: JSON.stringify(timezonesName) });
  }

  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const items = reorderTimezones(
      selectedTimezones,
      source.index,
      destination.index
    );
    const timezoneName = items.map((i) => i.name);
    reorderUrl(timezoneName);
    setSelectedTimezones(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <main
            {...provided.droppableProps}
            className={cn(
              "flex flex-col max-h-[880px] w-full odd_childs even_childs relative -z-1",
              {
                "pointer-events-none": snapshot.isDraggingOver,
              }
            )}
            ref={provided.innerRef}
          >
            {selectedTimezones.map((timezone, index) => (
              <Draggable
                key={timezone.name}
                draggableId={timezone.name}
                index={index}
              >
                {(provided, snapshot) => (
                  <TimezoneRow
                    provided={provided}
                    snapshot={snapshot}
                    timezone={timezone}
                    key={timezone.name}
                    isHome={index === 0}
                    index={index}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </main>
        )}
      </Droppable>
    </DragDropContext>
  );
});
