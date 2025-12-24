import React, { useEffect, useRef, useState } from "react";

interface Counter {
  id: number;
  name: string;
}

interface CounterDropdownProps {
  counters: Counter[];
  onSelect: (counter: Counter) => void;
  selectedCounter: Counter | null; // Pass the selected counter to highlight or manage the state
}

const CounterDropdown: React.FC<CounterDropdownProps> = ({
  counters,
  onSelect,
  selectedCounter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or after selection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-4 py-2 w-full bg-black bg-opacity-70 rounded-lg shadow-lg flex justify-between items-center focus:outline-none text-white"
      >
        <span>{selectedCounter ? selectedCounter.name : "Select Counter"}</span>
        <span>▼</span>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <ul className="absolute mt-2 w-full bg-black bg-opacity-90 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto text-white">
          {counters.length > 0 ? (
            counters.map((counter) => (
              <li
                key={counter.id}
                onClick={() => {
                  onSelect(counter);
                  setIsOpen(false); // Close after selection
                }}
                className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
              >
                {counter.name}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm">No counters available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CounterDropdown;
