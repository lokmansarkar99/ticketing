import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { FC } from "react";
import {
  convertTo12Hour,
  convertTo24Hour,
} from "@/utils/helpers/convertTo24Hour";

interface IRoute {
  counterId: number;
  name: string;
  isBoardingPoint: boolean;
  isDroppingPoint: boolean;
  boardingTime: string;
  droppingTime: string;
  active: boolean;
  fixed?: boolean;
}

interface DragListProps {
  routes: IRoute[];
  setRoutes: React.Dispatch<React.SetStateAction<IRoute[]>>;
}

function SortableItem({
  route,
  index,
  setRoutes,
}: {
  route: IRoute;
  index: number;
  setRoutes: React.Dispatch<React.SetStateAction<IRoute[]>>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: route.counterId,
      disabled: route.fixed,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: route.fixed ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center gap-4 border rounded-lg p-3 bg-gray-50"
    >
      {/* Drag Handle */}
      <div className="w-48 font-medium">
        {!route.fixed ? (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab text-gray-700"
          >
            {route.name}
          </div>
        ) : (
          <div className="text-gray-500">{route.name}</div>
        )}
      </div>

      {/* Boarding */}
      <input
        type="checkbox"
        checked={route.isBoardingPoint}
        onChange={(e) =>
          setRoutes((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              isBoardingPoint: e.target.checked,
            };
            return updated;
          })
        }
      />

      {/* Boarding Time */}
      <input
        type="time"
        value={route.boardingTime ? convertTo24Hour(route.boardingTime) : ""}
        onChange={(e) => {
          const value24 = e.target.value;
          const value12 = convertTo12Hour(value24);

          setRoutes((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              boardingTime: value12,
            };
            return updated;
          });
        }}
        className="border px-2 ml-5 py-1 rounded"
      />

      {/* Dropping */}
      <input
        type="checkbox"
        checked={route.isDroppingPoint}
        onChange={(e) =>
          setRoutes((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              isDroppingPoint: e.target.checked,
            };
            return updated;
          })
        }
        className="w-20"
      />

      {/* Dropping Time */}
      <input
        type="time"
        value={route.droppingTime ? convertTo24Hour(route.droppingTime) : ""}
        onChange={(e) => {
          const value24 = e.target.value;
          const value12 = convertTo12Hour(value24);

          setRoutes((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              droppingTime: value12,
            };
            return updated;
          });
        }}
        className="border px-2 py-1 rounded"
      />

      {/* Active Toggle */}
      <input
        type="checkbox"
        checked={route.active}
        onChange={(e) =>
          setRoutes((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], active: e.target.checked };
            return updated;
          })
        }
      />

      {/* Remove only if not fixed */}
      {!route.fixed ? (
        <button
          type="button"
          onClick={() =>
            setRoutes((prev) => prev.filter((_, i) => i !== index))
          }
          className="text-red-600 hover:underline w-16 text-center"
        >
          Remove
        </button>
      ) : (
        <>
          <div className="w-16"></div>
        </>
      )}
    </div>
  );
}

const DragList: FC<DragListProps> = ({ routes, setRoutes }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      setRoutes((prev) => {
        const oldIndex = prev.findIndex((r) => r.counterId === active.id);
        const newIndex = prev.findIndex((r) => r.counterId === over.id);

        // Prevent moving fixed routes
        if (prev[oldIndex]?.fixed || prev[newIndex]?.fixed) return prev;

        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={routes.map((r) => r.counterId)}
        strategy={verticalListSortingStrategy}
      >
        <div>
          <div className="flex justify-evenly items-center p bg-gray-100 font-medium">
            <p className="w-32">Counter</p>
            <p>Boarding Counter</p>
            <p className="-ml-7">Boarding Time</p>
            <p>Dropping Counter</p>
            <p>Dropping Time</p>
            <p>Active</p>
            <p>Action</p>
          </div>
          <div className="flex gap-3 flex-col">
            {routes.map((route, index) => (
              <SortableItem
                key={route.counterId}
                route={route}
                index={index}
                setRoutes={setRoutes}
              />
            ))}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DragList;
