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
import { readWriteSelectedDateAtom } from "~/atoms/date";
import { setUrlTimezonesNameAtom } from "~/atoms/url-timezones-name";
import { getDifferenceHoursFromHome, getTimeDials } from "~/utils/timezones";
import { dialColorWithLocalStorageAtom } from "~/atoms/dial-colors-model";

export default function SelectedTimezones() {
  const [selectedTimezones, setSelectedTimezones] = useSelectedTimezones();
  const [dialColor] = useAtom(dialColorWithLocalStorageAtom);
  const [, setUrlTimezonesName] = useAtom(setUrlTimezonesNameAtom);
  const [, setSelectedDate] = useAtom(readWriteSelectedDateAtom);

  function recalculateTimezone(timezones: ITimezone[]): ITimezone[] {
    let home = timezones[0];

    return timezones.map((timezone, index) => {
      timezone.diffHoursFromHome = getDifferenceHoursFromHome(
        timezone.name,
        home.name
      );

      timezone.timeDials = getTimeDials(timezone, dialColor, home, index === 0);

      if (index === 0) {
        home = timezone;
      }

      return timezone;
    });
  }

  function reorderTimezones(
    timezones: ITimezone[],
    sourceIndex: number,
    destinationIndex: number
  ) {
    const result = Array.from(timezones);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);

    return recalculateTimezone(result);
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
    setSelectedTimezones(tzs);
    setSelectedDate(home.date);
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
