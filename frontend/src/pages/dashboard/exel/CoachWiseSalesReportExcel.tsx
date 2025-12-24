import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const CoachWiseSalesReportExcel = ({ result, disabled }: any) => {
    const formattedData = result?.map((sale: any, index: number) => ({
        index: index + 1,
        travelDate: sale?.travelDate || 'N/A',
        coachNo: sale?.coachNo || 'N/A',
        seatNo: sale?.seatNo || 'N/A',
        route: sale?.routeName || 'N/A',
        from: sale?.from || 'N/A',
        to: sale?.to || 'N/A',
        originalFare: sale?.originalFare || 'N/A',
        discount: sale?.discount || 'N/A',
        fare: sale?.fare || 'N/A',
        refund: sale?.refund || 'N/A',
        orderedBy: sale?.orderedBy || 'N/A',
        remarks: sale?.remarks || 'N/A',
    }));

    return (
        <CSVLink
            data={formattedData || []}
            headers={[
                { label: "SL", key: "index" },
                { label: "Travel Date", key: "travelDate" },
                { label: "Coach No", key: "coachNo" },
                { label: "Seat No", key: "seatNo" },
                { label: "Route", key: "route" },
                { label: "From", key: "from" },
                { label: "To", key: "to" },
                { label: "Original Fare", key: "originalFare" },
                { label: "Discount", key: "discount" },
                { label: "Fare", key: "fare" },
                { label: "Refund", key: "refund" },
                { label: "Ordered By", key: "orderedBy" },
                { label: "Remarks", key: "remarks" },
            ]}
            filename={`${appConfiguration?.appName} - Coach Wise Sales Report.csv`}
        >
            <Button disabled={disabled} variant="green" size="xs">
                Excel
            </Button>
        </CSVLink>
    );
};

export default CoachWiseSalesReportExcel;