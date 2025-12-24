import React from "react";
import { Paragraph } from "@/components/common/typography/Paragraph";
import { format } from "date-fns";

interface IExpenseCategoryPrintProps {
  categoryData: Array<{ name: string; note: string; amount: number }>;
  logo: { companyLogoBangla: string };
}

const ExpenseCategoryPrint = React.forwardRef<HTMLDivElement, IExpenseCategoryPrintProps>(
  ({ categoryData, logo }, ref) => {
    const currentDate = format(new Date(), "MMMM dd, yyyy");

    // Calculate the total amount
    const totalAmount = categoryData?.reduce((sum, category) => sum + category.amount, 0) || 0;

    return (
      <section
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
        }}
        className="flex flex-col justify-center items-center p-6"
      >
        {/* Client Section */}
        <header className="mb-6 text-center">
          {/* Logo */}
          <img
            src={logo?.companyLogoBangla}
            alt="Logo"
            className="w-32 h-auto mx-auto mb-4"
          />
          <Paragraph size={"sm"} className="font-bold pb-2">
            Expense Category Report
          </Paragraph>
          <Paragraph size={"sm"}>Date: {currentDate}</Paragraph>
        </header>

        {/* Expense Category Table */}
        <div className="w-full overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black px-4 py-2 text-left text-sm font-semibold">
                  Category Name
                </th>
                <th className="border border-black px-4 py-2 text-left text-sm font-semibold">
                  Note
                </th>
                <th className="border border-black px-4 py-2 text-left text-sm font-semibold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {categoryData?.map((category, index) => (
                <tr key={index} className="text-sm">
                  <td className="border border-black px-4 py-2">{category?.name}</td>
                  <td className="border border-black px-4 py-2">{category?.note}</td>
                  <td className="border border-black px-4 py-2">
                    {category?.amount?.toFixed(2)}৳
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="font-bold text-sm">
                <td className="border border-black px-4 py-2">Total</td>
                <td className="border border-black px-4 py-2 text-center">-</td>
                <td className="border border-black px-4 py-2">
                  {totalAmount?.toFixed(2)}৳
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  }
);

export default ExpenseCategoryPrint;
