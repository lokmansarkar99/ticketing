import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import { TableWrapper } from "@/components/common/wrapper/TableWrapper";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
// table related start 


const PassengerDetailsTable = ({ data, isSoldModalOpen = false, setIsModalOpen }: any) => {
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
            accessorKey: "date",
            header: translate("বিক্রিত সিট সংখ্যা", "Journey Date"),
            accessorFn: (row) => row.date ?? "N/A",
        },
        {
            accessorKey: "coachNo",
            header: translate("বিক্রিত সিট সংখ্যা", "Coach No"),
            accessorFn: (row) => row.coachNo ?? "N/A",
        },
        {
            accessorKey: "schedule",
            header: translate("বিক্রিত সিট সংখ্যা", "Schedule"),
            accessorFn: (row) => row.schedule ?? "N/A",
        },
        {
            accessorKey: "seatNo",
            header: translate("বিক্রিত সিট সংখ্যা", "Seat Number Title"),
            accessorFn: (row) => row.seatNo ?? "N/A",
        },
        {
            accessorKey: "totalSoldSeat",
            header: translate("বিক্রিত সিট সংখ্যা", "Total Sold Seat"),
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
            accessorKey: "totalFare",
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
        <Dialog
            // open={counterState.addCounterOpen}
            open={isSoldModalOpen}
            onOpenChange={(open: boolean) => setIsModalOpen(open)}
        >
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
    );
}

export default PassengerDetailsTable;