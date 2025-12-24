import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import { TableWrapper } from "@/components/common/wrapper/TableWrapper";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import PassengerDetailsTable from "./PassengerDetailsTable";
// table related start 


const SoldDetailsTable = ({ data, isSoldModalOpen = false, setIsModalOpen }: any) => {
    const [selectedPassengerDetails, setSelectedPassengerDetails] = useState<any>(null);
    const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
    const { translate } = useCustomTranslator();
    const [query, setQuery] = useState<IQueryProps>({
        sort: "asc",
        page: 1,
        size: 20,
        meta: {
            page: 0,
            size: 20,
            total: 100,
            totalPage: 1,
        },
    });

    const handlePassengerDetailsModalOpen = (selectedDetailsIndex: number) => {
        setSelectedPassengerDetails(data[selectedDetailsIndex]);
        setIsPassengerModalOpen(true)
    }


    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "index",
            header: translate("সি.না", "SL"),
            accessorFn: (_, index) => `${index < 9 ? "0" : ""}${index + 1}`,
            footer: () => {
                return (
                    <div className="text-left font-bold">
                        Total:
                    </div>
                );
            },
        },
        {
            accessorKey: "userName",
            header: translate("ভ্রমণের তারিখ", "User Name"),
            cell: ({ row }) =>
                <span>
                    {row.original.userName ? row.original.userName : ""}
                    <span
                        className="hover:text-secondary duration-300 cursor-pointer ml-2"
                        onClick={() => handlePassengerDetailsModalOpen(row.index)}
                    >
                        {`(+Details)`}
                    </span>
                </span>,
        },
        {
            accessorKey: "totalSoldSeat",
            header: translate("বিক্রিত সিট সংখ্যা", "Total Sold"),
            accessorFn: (row) => row.totalSoldSeat ?? 0,
            footer: () => {
                const total = (data ?? []).reduce(
                    (sum: number, item: any) => sum + Number(item.totalSoldSeat ?? 0),
                    0
                );

                return (
                    <div className="font-bold">
                        {total.toLocaleString()}
                    </div>
                );
            },
        },
        {
            accessorKey: "fare",
            header: translate("ভাড়া", "Fare"),
            accessorFn: (row) => row.totalFare ?? 0,
            footer: () => {
                const total = (data ?? []).reduce(
                    (sum: number, item: any) => sum + Number(item.totalFare ?? 0),
                    0
                );

                return (
                    <div className="font-bold">
                        {total.toLocaleString()}
                    </div>
                );
            },
        },
    ];
    // table related end
    return (
        <>
            <Dialog
                // open={counterState.addCounterOpen}
                open={isSoldModalOpen}
                onOpenChange={(open: boolean) => setIsModalOpen(open)}
            >
                {/* <DialogTrigger asChild>
                  <Button
                    className="group relative"
                    variant="green"
                    size="icon"
                  >
                    <LuPlus />
                    <span className="custom-tooltip-top">
                      {translate("ব্যবহারকারী যুক্ত করুন", "Add User")}
                    </span>
                  </Button>
                </DialogTrigger> */}
                <DialogContent size="lg">
                    <DialogTitle className="sr-only">empty</DialogTitle>
                    <TableWrapper
                        heading={""}
                    >

                        <DataTable
                            query={query}
                            setQuery={setQuery}
                            pagination
                            columns={columns}
                            data={data || []}
                        />
                    </TableWrapper>
                </DialogContent>
            </Dialog>
            {/* Modal  */}
            {/* sold modal  */}
            <PassengerDetailsTable
                data={selectedPassengerDetails?.orderDetails || []}
                isSoldModalOpen={isPassengerModalOpen}
                setIsModalOpen={setIsPassengerModalOpen}
            />
        </>
    );
}

export default SoldDetailsTable;