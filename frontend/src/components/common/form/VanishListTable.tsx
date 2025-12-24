import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";

interface IVanishTableProps {
  listItems: any[];
  handleBookingSeat: (item: any) => void;
  couponInputs: any;
  handleCouponChange: any;
}

export const VanishListTable: FC<IVanishTableProps> = ({
  listItems,
  handleBookingSeat,
  couponInputs,
  handleCouponChange,
}) => {
  const { translate } = useCustomTranslator();
  const { role, permission } = shareAuthentication();
  const [storedReturnDate, setStoredReturnDate] = useState<string | null>(null);
  useEffect(() => {
    const savedReturnDate = localStorage.getItem("returnDate");
    setStoredReturnDate(savedReturnDate);
  }, []);

  const now = new Date();
  // Convert to Date objects
  const fromDate = new Date(permission?.showDiscountFromDate);
  const endDate = new Date(permission?.showDiscountEndDate);

  // Ensure valid dates and check if now is within the range
  const isDiscountActive =
    !isNaN(fromDate.getTime()) &&
    !isNaN(endDate.getTime()) &&
    now >= fromDate &&
    now <= endDate;
  return (
    <section className="h-full w-full overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 border border-gray-300 dark:bg-[#1f2128]">
            <th className="border border-gray-300 px-2">
              {translate("ক্রমিক", "Index")}
            </th>
            <th className="border border-gray-300 px-2">
              {translate("আসন নম্বর", "Seat No")}
            </th>
            <th className="border border-gray-300 px-2">
              {translate("ভাড়া", "Fare")}
            </th>
            {/* {role === "counter" ? (
              <>
                {listItems.some((item) => item.previousAmount > 0) && (
                  <th className="border border-gray-300 px-2">
                    {translate("ছাড়ের পর মূল্য", "Discounted Price")}
                  </th>
                )}
              </>
            ) : (
              ""
            )} */}
            {role === "counter" &&
            permission?.showDiscountMenu === true &&
            isDiscountActive ? (
              <>
                {" "}
                <th className="border border-gray-300 px-2">
                  {translate("ডিসকাউন্ট", "Discount")}
                </th>
              </>
            ) : role !== "counter" ? (
              <>
                {" "}
                <th className="border border-gray-300 px-2">
                  {translate("ডিসকাউন্ট", "Discount")}
                </th>
              </>
            ) : null}
            <th className="border border-gray-300 px-2">
              {translate("অ্যাকশন", "Action")}
            </th>
          </tr>
        </thead>
        <tbody>
          {listItems?.map((item, index) => (
            <tr key={item.id} className="hover:dark:bg-[#1f2128]">
              <td className="border border-gray-300 px-2 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-300 px-2 text-center">
                {item.seat}{" "}
                {item.date === storedReturnDate && (
                  <span className="ml-2 text-red-500 text-sm">
                    {translate("রিটার্ন টিকেট", "Return Ticket")}
                  </span>
                )}
              </td>
              <td className={`border border-gray-300 px-2 text-center`}>
                {translate(
                  convertToBnDigit(
                    formatter({ type: "amount", amount: item.currentAmount })
                  ),
                  formatter({ type: "amount", amount: item.currentAmount })
                )}
              </td>

              {/* {item.previousAmount > 0 ? (
                <td className="border border-gray-300 px-2 text-center">
                  {translate(
                    convertToBnDigit(
                      formatter({
                        type: "amount",
                        amount: item.currentAmount - item.previousAmount,
                      })
                    ),
                    formatter({
                      type: "amount",
                      amount: item.currentAmount - item.previousAmount,
                    })
                  )}
                </td>
              ) : (
                <td className="border border-gray-300 px-2 text-center">
                  {translate(
                    convertToBnDigit(
                      formatter({ type: "amount", amount: item.currentAmount })
                    ),
                    formatter({ type: "amount", amount: item.currentAmount })
                  )}
                </td>
              )} */}
              {role === "counter" &&
              permission?.showDiscountMenu === true &&
              isDiscountActive ? (
                <td className={`border border-gray-300 px-2 py-1 text-center`}>
                  <Input
                    type="text"
                    value={couponInputs[item.seat] || ""}
                    onChange={(e) => {
                      let value = e.target.value;

                      if (permission?.vipSeatAllowToSale === false) {
                        value = value.replace(/vip/gi, "");
                      }

                      handleCouponChange(item.seat, value);
                    }}
                    placeholder={translate("কুপন লিখুন", "Enter coupon")}
                    className="max-w-[150px] mx-auto h-6"
                  />
                </td>
              ) : role !== "counter" ? (
                <td className={`border border-gray-300 px-2 py-1 text-center`}>
                  <Input
                    type="text"
                    value={couponInputs[item.seat] || ""}
                    onChange={(e) => {
                      let value = e.target.value;

                      if (permission?.vipSeatAllowToSale === false) {
                        value = value.replace(/vip/gi, "");
                      }

                      handleCouponChange(item.seat, value);
                    }}
                    placeholder={translate("কুপন লিখুন", "Enter coupon")}
                    className="max-w-[150px] mx-auto h-6"
                  />
                </td>
              ) : null}
              <td className="border border-gray-300 px-2 text-center pt-1">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-5 h-[20px] p-0 m-0"
                      size="icon"
                      variant="destructive"
                    >
                      <LuTrash2 className="size-[16px]" />
                      <span className="sr-only">Remove Ticket</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {translate(
                          "আপনি কি নিশ্চিত?",
                          "Are you absolutely sure?"
                        )}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {translate(
                          "এই পদক্ষেপটি পূর্বাবস্থায় ফেরানো যাবে না। এটি আপনার নির্বাচিত টিকেট স্থায়ীভাবে মুছে ফেলবে এবং আপনার ডেটা আমাদের স্টোর থেকে সরিয়ে দেবে।",
                          "This action cannot be undone. This will permanently delete your selected ticket and remove your data from our store."
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {translate("বাতিল করুন", "Cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleBookingSeat(item)}
                      >
                        {translate("চালিয়ে যান", "Continue")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
