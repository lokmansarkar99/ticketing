import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangeEvent, useState } from "react";
import { LuDownload } from "react-icons/lu";
import { ISalesDataStateProps } from "../counterHome/CounterDashboardHome";
import { ColumnDef } from "@tanstack/react-table";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddFund from "./AddFund";
import {
  useDeleteFundMutation,
  useGetFundsCounterQuery,
  useGetFundsQuery,
  useUpdateFundMutation,
} from "@/store/api/counter/fundApi";
import { Plus } from "lucide-react";
import { playSound } from "@/utils/helpers/playSound";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfFundCounter from "../../pdf/PdfFundCounter";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { Loader } from "@/components/common/Loader";
import ExcelFundCredit from "./ExcelFundCredit";

const FundCredit = () => {
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 100, totalPage: 10 },
  });
  const { data: singleCms } = useGetSingleCMSQuery({});
  const [deleteFund] = useDeleteFundMutation({});
  const [updateFund] = useUpdateFundMutation({});
  const [fundOpen, setFundOpen] = useState(false);
  //const dispatch = useDispatch();
  const { translate } = useCustomTranslator();
  const { role, permission } = shareAuthentication();

  const [salesTickitState, setSalesTickitState] =
    useState<ISalesDataStateProps>({
      search: "",
      addUserOpen: false,
      updateModalOpeans: false,
      detailsModalOpen: false,
      usersList: [],
      selectedOrderId: null,
      isPrinting: false,
    });

  const fundDeleteHandler = async (id: number) => {
    const result = await deleteFund(id).unwrap();

    if (result?.success) {
      toast(
        translate("ফান্ড সফলভাবে মুছে ফেলা হয়েছে", "Fund deleted successfully")
      );
      playSound("remove");
    }
  };
  const fundAcceptHandler = async (id: number) => {
    try {
      const result = await updateFund({
        id,
        updateData: { status: "Verified" },
      }).unwrap();

      if (result?.success) {
        toast(
          translate(
            "ফান্ড সফলভাবে গ্রহণ করা হয়েছে",
            "Fund accepted successfully"
          )
        );
        playSound("success");
      }
    } catch (error: any) {
      toast(
        error?.data?.message ||
          translate("পুনরায় চেষ্টা করুন", "Please try again")
      );
    }
  };

  const fundRejectHandler = async (id: number) => {
    try {
      const result = await updateFund({
        id,
        updateData: { status: "Cancelled" },
      }).unwrap();

      if (result?.success) {
        toast(
          translate(
            "ফান্ড সফলভাবে প্রত্যাখ্যান করা হয়েছে",
            "Fund rejected successfully"
          )
        );
        playSound("remove");
      }
    } catch (error: any) {
      toast(
        error?.data?.message ||
          translate("পুনরায় চেষ্টা করুন", "Please try again")
      );
    }
  };

  // Fetch sales data using the API hook
  const { data: fundList, isLoading: loadingSalesTickit } =
    useGetFundsCounterQuery({
      search: salesTickitState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });
  const { data: fundListAdmin, isLoading: fundLoading } = useGetFundsQuery({
    search: salesTickitState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info) => (query.page - 1) * query.size + info.row.index + 1,
    },
    {
      accessorKey: "paymentType",
      header: translate("পেমেন্ট টাইপ", "Payment Type"),
    },
    {
      accessorKey: "txId",
      header: translate("ট্রানজ্যাকশন আইডি", "Transaction Id"),
    },
    {
      accessorKey: "amount",
      header: translate("পরিমাণ", "Amount"),
    },

    {
      header: translate("কার্যক্রম", "Actions"),
      id: "actions",
      cell: ({ row }) => {
        const order = row.original as any;
        return (
          <>
            <AlertDialog>
              {role.toLowerCase() === "counter" &&
                order?.status === "Pending" && (
                  <>
                    <AlertDialogTrigger
                      className={cn(
                        " flex bg-destructive text-destructive-foreground hover:bg-destructive/90 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-destructive focus:text-bg-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      )}
                    >
                      <span className="ml-0.5">
                        {translate("মুছে ফেলুন", "Delete")}
                      </span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {translate(
                            "আপনি কি একদম নিশ্চিত?",
                            "Are you absolutely sure?"
                          )}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {translate(
                            "আপনি কি ফান্ড মুছে ফেলতে চান? আপনি আপনার ফান্ড মুছে ফেলতে যাচ্ছেন।",
                            "Are you sure you want to delete this fund? You are about to delete your fund."
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {translate("বাতিল করুন", "Cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => fundDeleteHandler(order?.id)}
                        >
                          {translate("নিশ্চিত করুন", "Confirm")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </>
                )}
            </AlertDialog>
            {role.toLowerCase() === "admin" && order?.status === "Pending" && (
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-sm text-sm">
                      {translate("গ্রহণ করুন", "Accept")}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {translate(
                          "আপনি কি একদম নিশ্চিত?",
                          "Are you absolutely sure?"
                        )}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {translate(
                          "আপনি কি এই ফান্ডটি গ্রহণ করতে চান?",
                          "Do you want to accept this fund?"
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {translate("বাতিল করুন", "Cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => fundAcceptHandler(order?.id)}
                      >
                        {translate("গ্রহণ করুন", "Accept")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-sm text-sm ml-2">
                      {translate("প্রত্যাখ্যান করুন", "Reject")}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {translate(
                          "আপনি কি একদম নিশ্চিত?",
                          "Are you absolutely sure?"
                        )}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {translate(
                          "আপনি কি এই ফান্ডটি প্রত্যাখ্যান করতে চান?",
                          "Do you want to reject this fund?"
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {translate("বাতিল করুন", "Cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => fundRejectHandler(order?.id)}
                      >
                        {translate("প্রত্যাখ্যান করুন", "Reject")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </>
        );
      },
    },
  ];

  if (loadingSalesTickit || fundLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <div className="mt-5">
      {/* table design */}
      <TableWrapper
        subHeading={translate(
          "আজকের ফান্ড তথ্য উপাত্ত",
          "Today's Fund Information"
        )}
        className="font-bold"
        heading=""
        // heading={translate("আজকের সেলস", "Today's Sales")}
      >
        <TableToolbar alignment="responsive" className="-mt-14">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSalesTickitState((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate("search", "search")}
              />
            </li>
            {role.toLowerCase() === "counter" &&
              permission?.isPrepaid === true && (
                <li>
                  <Dialog open={fundOpen} onOpenChange={setFundOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full flex justify-start"
                        size="icon"
                      >
                        <Plus />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] max-h-[90%] overflow-y-auto">
                      <AddFund setFundOpen={setFundOpen} />
                    </DialogContent>
                  </Dialog>
                </li>
              )}
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm">
                    <LuDownload className="size-4 mr-1" />
                    {translate("এক্সপোর্ট", "Export")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cn("w-[100px] space-y-2")}
                  align="end"
                >
                  <DropdownMenuItem>
                    {role?.toLowerCase() === "counter" && (
                      <PDFDownloadLink
                        document={
                          <PdfFundCounter
                            result={fundList?.data || []}
                            singleCms={singleCms}
                          />
                        }
                        fileName="fund_prepaid_report.pdf"
                      >
                        {
                          //@ts-ignore
                          (params) => {
                            const { loading } = params;
                            return loading ? (
                              <Button
                                disabled
                                className="transition-all duration-150 px-10 w-full"
                                variant="destructive"
                                size="sm"
                              >
                                <Loader /> Pdf
                              </Button>
                            ) : (
                              <Button
                                variant="destructive"
                                size="sm"
                                className="px-10 w-full"
                              >
                                Pdf
                              </Button>
                            );
                          }
                        }
                      </PDFDownloadLink>
                    )}

                    {role?.toLowerCase() === "admin" && (
                      <PDFDownloadLink
                        document={
                          <PdfFundCounter
                            result={fundListAdmin?.data || []}
                            singleCms={singleCms}
                          />
                        }
                        fileName="fund_prepaid_report.pdf"
                      >
                        {
                          //@ts-ignore
                          (params) => {
                            const { loading } = params;
                            return loading ? (
                              <Button
                                disabled
                                className="transition-all duration-150 px-10 w-full"
                                variant="destructive"
                                size="sm"
                              >
                                <Loader /> Pdf
                              </Button>
                            ) : (
                              <Button
                                variant="destructive"
                                size="sm"
                                className="px-10 w-full"
                              >
                                Pdf
                              </Button>
                            );
                          }
                        }
                      </PDFDownloadLink>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {role?.toLowerCase()==="counter" && <ExcelFundCredit result={fundList?.data || []}/>}
                    {role?.toLowerCase()==="admin" && <ExcelFundCredit result={fundListAdmin?.data || []}/>}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </TableToolbar>
        {role.toLowerCase() === "counter" && (
          <DataTable
            query={query}
            setQuery={setQuery}
            pagination
            columns={columns}
            data={fundList?.data || []}
          />
        )}
        {role.toLowerCase() === "admin" && (
          <DataTable
            query={query}
            setQuery={setQuery}
            pagination
            columns={columns}
            data={fundListAdmin?.data || []}
          />
        )}
      </TableWrapper>
    </div>
  );
};

export default FundCredit;
