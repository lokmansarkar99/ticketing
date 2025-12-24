import { Button } from "@/components/ui/button";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { CSVLink } from "react-csv";

const UserWiseSalesReportSummeryExcel = ({ result, disabled }: any) => {
    const formattedData = result?.map((sale: any, index: number) => ({
        index: index + 1,
        travelDate: sale?.travelDate || 'N/A',
        coachNo: sale?.coachNo || 'N/A',
        route: sale?.route || 'N/A',
        schedule: sale?.schedule || 'N/A',
        soldSeatQty: sale?.soldSeatQty || 'N/A',
        fare: sale?.fare || 'N/A',
    }));

    return (
        <CSVLink
            data={formattedData || []}
            headers={[
                { label: "SL", key: "index" },
                { label: "Travel Date", key: "travelDate" },
                { label: "Coach No", key: "coachNo" },
                { label: "Route", key: "route" },
                { label: "Schedule", key: "schedule" },
                { label: "Sold Seat Qty", key: "soldSeatQty" },
                { label: "Fare", key: "fare" },
            ]}
            filename={`${appConfiguration?.appName} - User Wise Sales Report Summery.csv`}
        >
            <Button disabled={disabled} variant="green" size="xs">
                Excel
            </Button>
        </CSVLink>
    );
};

export default UserWiseSalesReportSummeryExcel;