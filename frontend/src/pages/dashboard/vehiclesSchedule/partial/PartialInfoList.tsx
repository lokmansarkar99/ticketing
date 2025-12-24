import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetPartialInfoAllQuery } from "@/store/api/vehiclesSchedule/partialApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import UpdatePartial from "./UpdatePartial";

interface IPartialInfoProps {}

export interface IPartialInfoStateProps {
  search: string;
  partialList: any[];
}

const PartialInfoList: FC<IPartialInfoProps> = () => {
  const { translate } = useCustomTranslator();
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: 0,
      size: 10,
      total: 100,
      totalPage: 10,
    },
  });
  const [partialState, setPartialState] = useState<IPartialInfoStateProps>({
    search: "",
    partialList: [],
  });

  const { data: partialInfoData, isLoading: partialLoading } =
    useGetPartialInfoAllQuery({
      search: partialState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });
  useEffect(() => {
    if (partialInfoData?.data) {
      const partialArray = [partialInfoData.data]; // Convert response object to an array
      const customizePartialData = partialArray.map((item, index) => ({
        ...item,
        index: index + 1,
      }));

      setPartialState((prevState: IPartialInfoStateProps) => ({
        ...prevState,
        partialList: customizePartialData,
      }));
    }
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: partialInfoData?.meta || prevState.meta,
    }));
  }, [partialInfoData]);

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    {
      accessorKey: "partialPercentage",
      header: translate("পারশিয়াল শতাংশ", "Partial Percentage"),
    },
    { accessorKey: "time", header: translate("সময়", "Time") },
    {
      accessorKey: "counterBookingTime",
      header: translate("কাউন্টার বুকিং টাইম", "Counter Booking Time"),
    },
    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const partial = row.original as any;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel>
                {translate("কার্যক্রমগুলো", "Actions")}
              </DropdownMenuLabel>
              {/* UPDATE PARTIAL */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("সম্পাদনা করুন", "Update")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <UpdatePartial
                    partialData={{
                      id: partial.id,
                      partialPercentage: partial.partialPercentage,
                      time: partial.time,
                      counterBookingTime: partial.counterBookingTime,
                    }}
                  />
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (partialLoading) {
    return <TableSkeleton columns={6} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "পারশিয়াল তথ্য এবং সংশ্লিষ্ট উপাত্ত",
          "Partial Info and relevant data"
        )}
        heading={translate("পারশিয়াল ইনফো", "Partial Info")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2"></ul>
        </TableToolbar>
        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={partialState.partialList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default PartialInfoList;
