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

export default memo(function SelectedTimezones() {
  const [selectedTimezones, setSelectedTimezones] = useSelectedTimezones();

  function reorder(
    timezones: Timezone[],
    sourceIndex: number,
    destinationIndex: number
  ) {
    const result = Array.from(timezones);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);

    return result;
  }

  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const items = reorder(selectedTimezones, source.index, destination.index);
    setSelectedTimezones(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <main
            {...provided.droppableProps}
            className={cn(
              "flex flex-col max-h-[880px] w-full odd_childs even_childs absolute -z-1"
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
