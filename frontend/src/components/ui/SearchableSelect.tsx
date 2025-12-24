import React, { useEffect, useRef, useState } from "react";
import { Loader } from "../common/Loader";

interface Option {
    [key: string]: any;
    id: number | string;
    name: string;
}

interface SearchableSelectProps {
    labelFor?: string;
    label?: string;
    error?: string;
    value?: string;
    onValueChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    loading?: boolean;
    labelKey: string;
    valueKey?: string;
    disabled?: boolean;
    noneOption?: boolean;
    isReset?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    value,
    onValueChange,
    options,
    placeholder = "Select...",
    loading = false,
    labelKey,
    valueKey = "id",
    disabled,
    noneOption = false,
    isReset = false,
}) => {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(
        (opt) => opt[valueKey]?.toString() === value
    );

    useEffect(() => {
        if (isReset || isOpen) {
            setInputValue("")
        }
    },[isReset, isOpen])

    useEffect(() => {
        if (selectedOption) {
            setInputValue(selectedOption[labelKey]);
        }
    }, [selectedOption, labelKey]);

    const searchValue = inputValue.toLowerCase();
    const selectedLabel = selectedOption?.[labelKey]?.toLowerCase() || "";
    const isExactMatch = searchValue === selectedLabel;

    let filteredOptions: Option[] = [];

    if (noneOption && !options.some((opt) => String(opt[valueKey]) === "none")) {
        filteredOptions.push({
            [valueKey]: "none",
            [labelKey]: "none",
        } as Option);
    }

    if (searchValue.trim() === "" || isExactMatch) {
        filteredOptions = [...filteredOptions, ...options];
    } else {
        const startsWithMatches = options.filter((opt) =>
            String(opt[labelKey]).toLowerCase().startsWith(searchValue)
        );

        filteredOptions = [
            ...filteredOptions,
            ...(startsWithMatches.length > 0
                ? startsWithMatches
                : options.filter((opt) =>
                    String(opt[labelKey]).toLowerCase().includes(searchValue)
                )),
        ];
    }

    const handleSelect = (opt: Option) => {
        onValueChange(String(opt[valueKey])); // Ensure value is string
        setInputValue(
            opt[valueKey] === "none" ? "" : String(opt[labelKey])
        );
        setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (
            containerRef.current &&
            !containerRef.current.contains(e.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="flex h-9 items-center text-muted-foreground justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-full"

                />
                {/* Arrow Icon */}
                <div
                    className={`absolute inset-y-0 right-3 flex items-center pointer-events-none transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                >
                    <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-thin">
                    {loading && (
                        <div className="flex justify-center items-center p-2">
                            <Loader />
                        </div>
                    )}

                    {!loading && filteredOptions.length > 0
                        ? filteredOptions.map((option) => (
                            <div
                                key={option[valueKey]}
                                onClick={() => handleSelect(option)}
                                className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-sm "
                            >
                                {option[labelKey]}
                            </div>
                        ))
                        : !loading && (
                            <div className="text-center text-sm text-gray-500 py-2">
                                No results found
                            </div>
                        )}
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;
