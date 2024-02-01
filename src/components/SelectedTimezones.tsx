import { memo } from "react";
import SelectedTimezoneRow from "./SelectedTimezoneRow";
import { useSelectedTimezones } from "~/utils/hooks/use-selected-timezones";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { cn } from "~/utils/cn";
import { useSearchParams } from "react-router-dom";
import TimeSelectionOverlay from "./TimeSelectionOverlay";
import { getDifferenceHoursFromHome, getTimeDials } from "~/utils/timezones";
import { dialColorWithLocalStorageAtom } from "~/atoms/dial-colors-model";
import { useAtom } from "jotai";

export default memo(function SelectedTimezones() {
  const [selectedTimezones, setSelectedTimezones] = useSelectedTimezones();
  const [dialColor] = useAtom(dialColorWithLocalStorageAtom);
  const [, setSearchParams] = useSearchParams();

  function reorderTimezones(
    timezones: ITimezone[],
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
    const tzs = reorderTimezones(
      selectedTimezones,
      source.index,
      destination.index
    );
    const timezoneName = tzs.map((i) => i.name);
    reorderUrl(timezoneName);

    let h = tzs[0];

    const newTimezones = tzs.map((tz, index) => {
      if (index === 0) {
        tz.diffHoursFromHome = getDifferenceHoursFromHome(h.name, h.name);
        tz.timeDials = getTimeDials(h, dialColor, h, true);
        h = tz;
      } else {
        tz.diffHoursFromHome = getDifferenceHoursFromHome(tz.name, h.name);
        tz.timeDials = getTimeDials(tz, dialColor, h);
      }

      return tz;
    });

    setSelectedTimezones(newTimezones);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <main
            {...provided.droppableProps}
            className={cn(
              " flex flex-col max-h-[880px] w-full odd_childs even_childs relative -z-1",
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
                  <SelectedTimezoneRow
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
            <TimeSelectionOverlay />
          </main>
        )}
      </Droppable>
    </DragDropContext>
  );
});
