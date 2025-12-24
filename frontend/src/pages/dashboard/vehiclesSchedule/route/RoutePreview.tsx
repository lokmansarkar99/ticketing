import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ id, label }: { id: number; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className=" bg-secondary text-white px-3 py-1 rounded-md cursor-move my-1 flex items-center"
    >
      <span className="mr-2">➜</span>
      {label}
    </div>
  );
}

export default function RoutePreview({
  from,
  to,
  viaStations,
  setViaStations,
}: any) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setViaStations((items: any[]) => {
        const oldIndex = items.findIndex((i) => i.key === active.id);
        const newIndex = items.findIndex((i) => i.key === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="border p-3 flex flex-wrap items-center gap-3">
      {/* FROM station */}
      {from && (
        <div className="bg-green-600 text-white px-3 py-1 rounded-md inline-block mr-2">
          {from}
        </div>
      )}

      {/* VIA stations sortable */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={viaStations.map((s: any) => s.key)}
          strategy={verticalListSortingStrategy}
        >
          {viaStations.map((station: any) => (
            <SortableItem
              key={station.key}
              id={station.key}
              label={station.label}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* TO station */}
      {to && (
        <div className="bg-red-600 text-white px-3 py-1 rounded-md inline-block ml-2">
          <span className="mr-2">➜</span>
          {to}
        </div>
      )}
    </div>
  );
}
