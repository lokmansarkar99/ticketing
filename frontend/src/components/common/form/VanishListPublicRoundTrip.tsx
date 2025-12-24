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
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";

interface IVanishListTableProps {
  listItems: any[];
  handleBookingSeat: (item: any) => void;
}

export const VanishListPublicRoundTrip: FC<IVanishListTableProps> = ({
  listItems,
  handleBookingSeat,
}) => {
  const { translate } = useCustomTranslator();
  const [storedReturnDate, setStoredReturnDate] = useState<string | null>(null);

  useEffect(() => {
    const savedReturnDate = localStorage.getItem("returnDate");
    setStoredReturnDate(savedReturnDate);
  }, []);

  // Check if there is at least one item with discount
  const hasDiscount = listItems.some(
    (item) => item.previousAmount && item.previousAmount > 0
  );

  return (
    <section className="h-full w-full overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 dark:bg-[#1f2128] border border-gray-300">
            <th className="border border-gray-300 p-2">
              {translate("ক্রমিক", "Index")}
            </th>
            <th className="border border-gray-300 p-2">
              {translate("আসন নম্বর", "Seat No")}
            </th>
            <th className="border border-gray-300 p-2">
              {translate("বর্তমান মূল্য", "Current Price")}
            </th>
            {hasDiscount && (
              <th className="border border-gray-300 p-2">
                {translate("ছাড়ের পর মূল্য", "Discounted Price")}
              </th>
            )}
            <th className="border border-gray-300 p-2">
              {translate("অ্যাকশন", "Action")}
            </th>
          </tr>
        </thead>
        <tbody>
          {listItems?.map((item, index) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 dark:hover:dark:bg-[#1f2128]"
            >
              <td className="border border-gray-300 p-2 text-center">
                {index + 1}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {item.seat}{" "}
                {item.date === storedReturnDate && (
                  <span className="ml-2 text-red-500 text-sm">
                    {translate("রিটার্ন টিকেট", "Return Ticket")}
                  </span>
                )}
              </td>
              <td
                className={`border border-gray-300 p-2 text-center ${
                  item.previousAmount && item.previousAmount > 0
                    ? "line-through"
                    : ""
                }`}
              >
                {translate(
                  convertToBnDigit(
                    formatter({ type: "amount", amount: item.currentAmount })
                  ),
                  formatter({ type: "amount", amount: item.currentAmount })
                )}
              </td>
              {hasDiscount && (
                <td className="border border-gray-300 p-2 text-center">
                  {item.previousAmount && item.previousAmount > 0
                    ? translate(
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
                      )
                    : ""}
                </td>
              )}
              <td className="border border-gray-300 p-2 text-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-8 h-[30px] p-0 m-0"
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
