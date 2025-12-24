import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectSkeleton from "../skeleton/SelectSkeleton";
import formatter from "@/utils/helpers/formatter";
import {
  Popover,
  // PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";

export interface ITagSelectDataProps {
  key: string | number;
  label: string;
}

interface TagSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  id?: string;
  tags: ITagSelectDataProps[];
  setTags: React.Dispatch<React.SetStateAction<ITagSelectDataProps[]>>;
  loading?: boolean;
  data?: ITagSelectDataProps[];
}

const TagSelect = React.forwardRef<HTMLButtonElement, TagSelectProps>(
  (props, ref) => {
    const { placeholder, tags, setTags, loading, data = [], id } = props;
    // const { translate } = useCustomTranslator();
    const [popoverOpenStates, setPopoverOpenStates] = useState<{
      [key: string]: boolean;
    }>({});

    const removeTag = (tagToRemove: ITagSelectDataProps) => {
      setTags(tags?.filter((tag) => tag.key !== tagToRemove.key));
      setPopoverOpenStates((prevState) => ({
        ...prevState,
        [String(tagToRemove.key)]: false, // Convert key to string
      }));
    };

    const togglePopover = (tagKey: string | number, isOpen: boolean) => {
      setPopoverOpenStates((prevState) => ({
        ...prevState,
        [String(tagKey)]: isOpen, // Convert key to string
      }));
    };

    const filteredData = data?.filter(
      (singleStation) => !tags?.some((tag) => tag.key === singleStation.key)
    );

    return (
      <div className="flex gap-x-2 flex-wrap">
        <div
          className={cn(
            "flex flex-wrap gap-2 rounded-md",
            tags?.length > 0 && "mr-2",
            tags?.length !== 0 && "mb-3"
          )}
        >
          {tags?.map((tag: ITagSelectDataProps, index: number) => (
            <Badge
              className="px-1.5 group h-9"
              size="lg"
              variant="outline"
              key={index}
            >
              <span className="mr-2 text-base text-muted-foreground font-normal font-open_sans tracking-tight">
                {formatter({
                  type: "words",
                  words: tag?.label,
                })}
              </span>

              <Popover
                open={popoverOpenStates[String(tag.key)] || false}
                onOpenChange={(isOpen) => togglePopover(tag.key, isOpen)}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className={cn(
                      "size-5 rounded-full bg-destructive text-white flex justify-center items-center"
                    )}
                  >
                    <X className="size-3" />
                  </button>
                </PopoverTrigger>
                {/* <PopoverContent
                  className="w-[160px] flex items-center justify-center"
                  align="center"
                  side="top"
                >
                  <div className="flex items-center justify-between gap-x-3">
                    <Button
                      onClick={() => togglePopover(tag.key, false)}
                      className="text-sm"
                      size="xs"
                      variant="outline"
                    >
                      {translate("বাতিল", "Cancel")}
                    </Button>
                    <Button
                      className="text-sm"
                      variant="destructive"
                      size="xs"
                      onClick={() => removeTag(tag)}
                    >
                      {translate("নিশ্চিত", "Confirm")}
                    </Button>
                  </div>
                </PopoverContent> */}
              </Popover>
            </Badge>
          ))}
        </div>

        {filteredData?.length > 0 && (
          <Select
            onValueChange={(value: string) => {
              const parsedValue: ITagSelectDataProps = JSON.parse(value);

              if (
                parsedValue &&
                !tags?.some((tag) => tag.key === parsedValue.key)
              ) {
                setTags([...tags, parsedValue]);
              }
            }}
          >
            <SelectTrigger id={id} ref={ref} className="w-[300px] ">
              {tags?.length > 0 ? (
                <span className="text-base text-muted-foreground">
                  {tags[tags?.length - 1]?.label}
                </span>
              ) : (
                <SelectValue placeholder={placeholder} />
              )}
            </SelectTrigger>
            <SelectContent className="w-[300px] max-h-[250px] overflow-y-auto">
              {!loading &&
                filteredData?.length > 0 &&
                filteredData.map(
                  (
                    singleStation: ITagSelectDataProps,
                    stationIndex: number
                  ) => (
                    <SelectItem
                      key={stationIndex}
                      value={JSON.stringify(singleStation)}
                    >
                      {singleStation?.label}
                    </SelectItem>
                  )
                )}

              {loading && !filteredData?.length && <SelectSkeleton />}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  }
);

TagSelect.displayName = "TagSelect";

export { TagSelect };
