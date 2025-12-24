import PageTransition from "@/components/common/effect/PageTransition";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import AccountantReportTable from "@/components/common/table/AccountantReportTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetAccountReportDetailsByIdQuery } from "@/store/api/accounts/accountsDashboardApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AuthorizeCollectionModal from "../collectionManagement/AuthorizeCollectionModal";

const DetailsOfReport: React.FC = () => {
  const { translate } = useCustomTranslator();

  const { id } = useParams<{ id: string }>();
  const { data: reportDetails, isLoading } =
    useGetAccountReportDetailsByIdQuery(id);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  if (isLoading) {
    return <TableSkeleton columns={5} />;
  }
  if (!reportDetails || !reportDetails.data) {
    return (
      <PageWrapper>
        <h2 className="text-center mt-10 text-xl font-bold">No Report Found</h2>
      </PageWrapper>
    );
  }

  const {
    upWayCollectionReport,
    downWayCollectionReport,
    expenseReport,
    upWayOthersIncomeReport,
  } = reportDetails.data;

  const upWayData = [
    ...upWayCollectionReport,
    ...upWayOthersIncomeReport.map((item: any) => ({
      ...item,
      counterName: item.counterName,
      amount: item.amount,
      file: item.file || null,
    })),
  ];

  const downWayData = [...downWayCollectionReport];
  const maxRows = Math.max(
    upWayData.length,
    downWayData.length,
    expenseReport.length
  );
  const handleFileClick = (file: string | null) => {
    if (file) {
      setSelectedFile(file);
    }
  };
  //calculation
  const upDownTotal =
    (reportDetails?.data?.totalUpIncome || 0) +
    (reportDetails?.data?.totalDownIncome || 0);
  const totalOtherIncome =
    (reportDetails?.data?.othersIncomeUpWay || 0) +
    (reportDetails?.data?.othersIncomeDownWay || 0);
  const cashOnHand =
    upDownTotal +
    (reportDetails?.data?.totalUpOpeningBalance || 0) +
    (reportDetails?.data?.totalDownOpeningBalance || 0) -
    (reportDetails?.data?.totalExpense || 0);
  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-4">Report Details</h1>
      <PageTransition>
        <div className="grid gap-5 grid-cols-12">
          <div className="col-span-12 flex">
            {/* Up Way Income Table */}
            <AccountantReportTable
              data={upWayData}
              mainHeader="Up Way Income"
              subHeaders={["Counter Name", "Taka", "File"]}
              onFileClick={handleFileClick}
              maxRows={maxRows}
            />

            {/* Down Way Income Table */}
            <AccountantReportTable
              data={downWayData}
              mainHeader="Down Way Income"
              subHeaders={["Counter Name", "Taka", "File"]}
              onFileClick={handleFileClick}
              maxRows={maxRows}
            />

            {/* Expense Report Table */}
            <AccountantReportTable
              data={expenseReport}
              mainHeader="Expense Report"
              subHeaders={["Expense Name", "Taka", "File"]}
              onFileClick={handleFileClick}
              maxRows={maxRows}
            />
          </div>

          {/* Image Display Section */}
          <div className="col-span-12  border-2 rounded-md justify-center border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300 p-4">
            {selectedFile ? (
              <img
                src={selectedFile}
                alt="Selected"
                className="w-full h-[600px] object-contain"
              />
            ) : (
              <h2 className="text-center">Click on a file to preview</h2>
            )}
          </div>
        </div>
        <div>
          <div className="w-7/12 flex justify-end items-end">
            <div className="w-full pt-10">
              <PageTransition className="border-2 rounded-md border-primary/50 bg-primary/5 backdrop-blur-[2px] p-4 duration-300">
                <table className="w-full border-collapse border-primary/50 bg-primary/5 backdrop-blur-[2px] text-left text-sm">
                  <thead>
                    <tr>
                      <th className="border-primary/50 px-4 py-2">
                        Description
                      </th>
                      <th className="border-primary/50 px-4 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-primary/50 px-4 py-2">
                        Up & Down Income Subtotal
                      </td>
                      <td className="border-primary/50 px-4 py-2">
                        {upDownTotal}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-primary/50 px-4 py-2">
                        Today's Up Opening Balance
                      </td>
                      <td className="border-primary/50 px-4 py-2">
                        {reportDetails?.data?.totalUpOpeningBalance || 0.0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-primary/50 px-4 py-2">
                        Today's Down Opening Balance
                      </td>
                      <td className="border-primary/50 px-4 py-2">
                        {reportDetails?.data?.totalDownOpeningBalance || 0.0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-primary/50 px-4 py-2">Expense</td>
                      <td className="border-primary/50 px-4 py-2">
                        {reportDetails?.data?.totalExpense || 0.0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-primary/50 px-4 py-2">
                        Other Income
                      </td>
                      <td className="border-primary/50 px-4 py-2">
                        {totalOtherIncome || 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-primary/50 px-4 py-2">
                        Cash On Hand
                      </td>
                      <td className="border-primary/50 px-4 py-2">
                        {cashOnHand || 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {!reportDetails?.data?.report?.authorizeStatus ? (
                  <Button
                    className="px-10 py-3 bg-primary mt-5 rounded-sm"
                    onClick={openModal}
                  >
                    Authorize Report
                  </Button>
                ) : (
                  <div className="py-3 text-center">
                    <h2 className="text-bold">Authorized By:</h2>
                    <h3 className="text-green-500 text-semibold">
                      {reportDetails?.data?.report?.authorizeBy?.userName}
                    </h3>
                  </div>
                )}
              </PageTransition>
            </div>
          </div>
        </div>
      </PageTransition>
      {/* Authorize Collection Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent size="lg">
            <DialogTitle>{translate("অনুমোদন করুন", "Authorize")}</DialogTitle>

            <AuthorizeCollectionModal
              //@ts-ignore
              reportId={id}
              amount={cashOnHand}
              closeModal={closeModal} // Pass the correct amount as prop
            />
          </DialogContent>
        </Dialog>
      )}
    </PageWrapper>
  );
};

export default DetailsOfReport;
