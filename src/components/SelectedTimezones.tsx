import SelectedTimezoneRow from "./SelectedTimezoneRow";
import { useSelectedTimezones } from "~/utils/hooks/use-selected-timezones";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import { cn } from "~/utils/cn";
import TimeSelectionOverlay from "./TimeSelectionOverlay";
import { useAtom } from "jotai";
import { selectedDateAtom } from "~/atoms/date";
import { urlTimezonesNameAtom } from "~/atoms/url-timezones-name";

export default function SelectedTimezones() {
  const [selectedTimezones] = useSelectedTimezones();
  const [, setUrlTimezonesName] = useAtom(urlTimezonesNameAtom);
  const [, setSelectedDate] = useAtom(selectedDateAtom);

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

  const onDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) {
      return;
    }

    const tzs = reorderTimezones(
      selectedTimezones,
      source.index,
      destination.index
    );
    const timezonesName = tzs.map((i) => i.name);
    setUrlTimezonesName(timezonesName);

    const home = tzs[0];

    setSelectedDate({ name: home.name, date: home.date });
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
}
