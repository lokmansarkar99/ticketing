import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { TableWrapper } from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useGetSupervisorCoachDetailsQuery } from "@/store/api/superviosr/supervisorExpenseApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import React, { useState } from "react";
import AddSupervisorCollection from "./AddSupervisorCollection";
//@ts-ignore
const CoachDetailsForSupervisor: React.FC = ({ coachId }: { coachId: any }) => {
  const { translate } = useCustomTranslator();
  const { data: coachDetailsData, isLoading: coachDetailsLoading } =
    useGetSupervisorCoachDetailsQuery(coachId);
  const [counterId, setCounterId] = useState(null);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);

  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 0, totalPage: 0 },
  });
  const handelDataInfo = (id: any, boolean: boolean) => {
    setCounterId(id);
    setCollectionModalOpen(boolean);
  };
  const localData = localStorage.getItem("collection");
  const findAllCollection = localData ? JSON.parse(localData) : [];

  const columns = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info: any) => {
        const rowIndex = info.row.index + 1 + (query.page - 1) * query.size;
        return <span>{rowIndex}</span>;
      },
    },
    {
      accessorKey: "counterName",
      header: translate("কাউন্টার নাম", "Counter Name"),
    },
    {
      accessorKey: "totalSeat",
      header: translate("যাত্রী সংখ্যা", "Total Passenger"),
    },
    {
      accessorKey: "seatNumbers",
      header: translate("আসন সংখ্যা", "Seat No"),
      cell: ({ row }: { row: any }) => {
        const seatinfo = row.original.seatNumbers;

        if (!seatinfo || seatinfo.length === 0) {
          return translate("কোনো আসন নেই", "No Seats"); // Handle empty or undefined cases
        }

        // Remove the last item

        // Format as "1A - 2B"
        return seatinfo.map((data: any) => data.seat).join(" - ");
      },
    },
    {
      accessorKey: "totalAmount",
      header: translate("মোট টাকা", "Total Amount"),
    },
    {
      accessorKey: "commission",
      header: translate("মোট কমিশন", "Total Commission "),
    },
    {
      accessorKey: "totalAmountWithoutCommission",
      header: translate("কমিশন ছাড়া মোট পরিমাণ", "Collection Amount"),
    },
    {
      header: translate("কার্যক্রম", "Actions"),
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const counterId = row.original.counterId;
        const coachId = coachDetailsData?.data?.coachInfo?.id;
        const collectionKey = `${coachId}-${counterId}`;

        // Check if the collectionKey exists in findAllCollection
        const shouldHideCollectionButton =
          findAllCollection?.includes(collectionKey);

        // Conditionally render the button
        return !shouldHideCollectionButton ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handelDataInfo(counterId, true)}
          >
            {translate("সংগ্রহ", "Collection")}
          </Button>
        ) : (
          <h2 className="text-green-600 font-semibold">Completed</h2>
        );
      },
    },
  ];

  if (coachDetailsLoading) {
    return <TableSkeleton columns={10} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        heading={translate("সংগ্রহ তথ্য উপাত্ত", "Collection Information")}
      >
        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={coachDetailsData?.data?.counterWiseReport || []}
        />
      </TableWrapper>

      {/* Dialog for Add Collection */}
      <Dialog open={collectionModalOpen} onOpenChange={setCollectionModalOpen}>
        <DialogContent size="lg" className="sm:max-w-[600px]">
          <AddSupervisorCollection
            setCollectionState={() => {
              setCollectionModalOpen(false);
            }}
            coachDetailsData={coachDetailsData} // Pass coachId if needed
            //@ts-ignore
            counterId={counterId}
          />
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default CoachDetailsForSupervisor;
