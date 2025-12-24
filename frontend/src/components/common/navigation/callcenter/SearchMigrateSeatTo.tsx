import { InputWrapper } from "../../form/InputWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import SelectSkeleton from "../../skeleton/SelectSkeleton";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import formatter from "@/utils/helpers/formatter";

interface IMigrateSearch {
  coachNo: string;
  date: string | null;
  fromStationId: number | null;
  destinationStationId: number | null;
}

interface SearchMigrateSeatToProps {
  searchData: IMigrateSearch;
  setSearchData: React.Dispatch<React.SetStateAction<IMigrateSearch>>;
  coachListDataLoading: boolean;
  coachListData: any;
  countersLoading: boolean;
  countersData: any;
  popoverOpen: boolean;
  setPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  trigger: any;
  resultData: any;
}

const SearchMigrateSeatTo = ({
  searchData,
  setSearchData,
  coachListDataLoading,
  coachListData,
  countersLoading,
  countersData,
  popoverOpen,
  setPopoverOpen,
  trigger,
}: SearchMigrateSeatToProps) => {
  const { translate } = useCustomTranslator();

  const shouldFetchData = Boolean(
    searchData.fromStationId &&
      searchData.destinationStationId &&
      searchData.coachNo &&
      searchData.date
  );

  const handleSearch = () => {
    if (shouldFetchData && searchData.date) {
      trigger({
        fromStationId: searchData.fromStationId,
        destinationStationId: searchData.destinationStationId,
        date: searchData.date,
        coachNo: searchData.coachNo,
      });
    }
  };

  return (
    <div className="">
      <h3 className="text-lg font-semibold text-center mb-2">Migrate To</h3>
      <div className="grid grid-cols-2 items-center">
        <InputWrapper error={""} label={""}>
          <Select
            value={searchData.coachNo}
            onValueChange={(value: string) => {
              setSearchData((prev) => ({ ...prev, coachNo: value }));
            }}
          >
            <SelectTrigger className="h-7">
              <SelectValue
                placeholder={translate("কোচ নম্বর ✼", "Select Coach Number ✼")}
              />
            </SelectTrigger>
            <SelectContent>
              {coachListDataLoading ? (
                <SelectSkeleton />
              ) : (
                coachListData?.data?.map((coach: any) => (
                  <SelectItem key={coach.id} value={coach.coachNo?.toString()}>
                    {formatter({ type: "words", words: coach.coachNo })}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </InputWrapper>
        <InputWrapper label={""}>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left text-sm font-normal h-7",
                  !searchData.date && "text-muted-foreground"
                )}
              >
                {searchData.date
                  ? format(new Date(searchData.date), "PPP")
                  : translate(
                      "বুকিংয়ের তারিখ নির্বাচন করুন",
                      "Pick booking date"
                    )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={searchData.date ? new Date(searchData.date) : undefined}
                onSelect={(date: Date | undefined) => {
                  setSearchData((prev) => ({
                    ...prev,
                    date: date ? format(date, "yyyy-MM-dd") : null,
                  }));
                  setPopoverOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        <InputWrapper label={""}>
          <Select
            value={searchData.fromStationId?.toString() || ""}
            onValueChange={(value: string) => {
              setSearchData((prev) => ({ ...prev, fromStationId: +value }));
            }}
          >
            <SelectTrigger className="h-7">
              <SelectValue
                placeholder={translate(
                  "শুরু করার কাউন্টার ✼",
                  "Starting Counter ✼"
                )}
              />
            </SelectTrigger>
            <SelectContent>
              {countersLoading ? (
                <SelectSkeleton />
              ) : (
                countersData?.data
                  ?.filter(
                    (counter: any) =>
                      counter.id !== searchData.destinationStationId &&
                      counter?.isSegment === true
                  )
                  ?.map((counter: any) => (
                    <SelectItem key={counter.id} value={counter.id.toString()}>
                      {counter.name}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        </InputWrapper>

        <InputWrapper label={""}>
          <Select
            value={searchData.destinationStationId?.toString() || ""}
            onValueChange={(value: string) => {
              setSearchData((prev) => ({
                ...prev,
                destinationStationId: +value,
              }));
            }}
          >
            <SelectTrigger className="h-7">
              <SelectValue
                placeholder={translate(
                  "গন্তব্য কাউন্টার ✼",
                  "Ending Counter ✼"
                )}
              />
            </SelectTrigger>
            <SelectContent>
              {countersLoading ? (
                <SelectSkeleton />
              ) : (
                countersData?.data
                  ?.filter(
                    (counter: any) =>
                      counter.id !== searchData.fromStationId &&
                      counter?.isSegment === true
                  )
                  ?.map((counter: any) => (
                    <SelectItem key={counter.id} value={counter.id.toString()}>
                      {counter.name}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        </InputWrapper>
      </div>

      <div className="flex justify-end">
        <Button
          className="px-2 h-7"
          onClick={handleSearch}
          disabled={!shouldFetchData}
        >
          {translate("অনুসন্ধান করুন", "Search")}
        </Button>
      </div>
    </div>
  );
};

export default SearchMigrateSeatTo;