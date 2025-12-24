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
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import {
  AnimatePresence,
  motion,
  useAnimate,
  usePresence,
} from "framer-motion";
import { FC, useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";

export const List = <T extends { id: number; checked: false }>({
  items,
  renderContent,
  onRemove,
}: {
  items: T[];
  renderContent: (item: T) => JSX.Element;
  onRemove?: (item: any) => void;
}) => {
  return (
    <div className="w-full space-y-3 px-1 max-h-[160px] overflow-y-auto">
      <AnimatePresence>
        {items?.length > 0 &&
          items?.map((item, idx) => (
            <ListItem
              key={item.id}
              id={item.id}
              onRemove={onRemove ? () => onRemove(item) : undefined}
            >
              {renderContent({
                ...item,
                index: generateDynamicIndexWithMeta(items.length, idx),
              })}
            </ListItem>
          ))}
      </AnimatePresence>
    </div>
  );
};

const ListItem = ({
  children,
  onRemove,
}: {
  id: number;
  children: JSX.Element;
  onRemove?: () => void;
  handleCheck?: (id: number) => void;
}) => {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const { translate } = useCustomTranslator();

  useEffect(() => {
    if (!isPresent) {
      const exitAnimation = async () => {
        await animate(
          scope.current,
          {
            opacity: 0,
          },
          {
            delay: 0.75,
          }
        );
        safeToRemove();
      };

      exitAnimation();
    }
  }, [isPresent]);

  return (
    <motion.div
      ref={scope}
      layout
      className="relative flex w-full items-center gap-3 rounded-md backdrop-blur-[2px] border px-1 leading-5 h-9 "
    >
      {children}

      {onRemove && (
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
                {translate("আপনি কি নিশ্চিত?", "Are you absolutely sure?")}
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
              <AlertDialogAction onClick={onRemove}>
                {translate("চালিয়ে যান", "Continue")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </motion.div>
  );
};

// Example usage of the reusable List component

interface IVanishListProps {
  listItems: any[];
  handleBookingSeat: any;
}
export const VanishList: FC<IVanishListProps> = ({
  listItems,
  handleBookingSeat,
}) => {
  const { translate } = useCustomTranslator();
  const [storedReturnDate, setStoredReturnDate] = useState<string | null>(null);

  useEffect(() => {
    const savedReturnDate = localStorage.getItem("returnDate");
    setStoredReturnDate(savedReturnDate);
  }, []);

  return (
    <section className="h-full ">
      <div className="mx-auto w-full">
        <List
          items={listItems}
          onRemove={handleBookingSeat}
          renderContent={(t) => (
            <ul className="flex items-center md:gap-x-16 gap-x-5 w-full">
              <li className="md:w-8 flex justify-center items-center rounded-md">
                {t.index}
              </li>
              <li className="md:text-base text-sm flex md:flex-row flex-col">
                {translate("আসন নম্বরঃ ", "Seat No: ")} {t.seat}
                {t.date === storedReturnDate && (
                  <span className="md:ml-2 ml-1 text-red-500 md:text-base text-xs">
                    {translate("রিটার্ন টিকেট", "Return Ticket")}
                  </span>
                )}
              </li>
              <li className="flex gap-x-2 items-center font-anek md:text-base text-sm">
                <span className="md:font-semibold font-medium line-through">
                  {translate(
                    convertToBnDigit(
                      formatter({ type: "amount", amount: t.currentAmount })
                    ),
                    formatter({ type: "amount", amount: t.currentAmount })
                  )}
                </span>
                <span className=" font-light">
                  {translate(
                    convertToBnDigit(
                      formatter({
                        type: "amount",
                        amount: t.currentAmount - t.previousAmount,
                      })
                    ),
                    formatter({
                      type: "amount",
                      amount: t.currentAmount - t.previousAmount,
                    })
                  )}
                </span>
              </li>
            </ul>
          )}
        />
      </div>
    </section>
  );
};
