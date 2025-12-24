import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  useDeleteAccountMutation,
  useGetAccountsQuery,
} from "@/store/api/finance/accountApi";
import formatter from "@/utils/helpers/formatter";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {  FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddAccount from "./AddAccount";
import DetailsAccount from "./DetailsAccount";
import UpdateAccount from "./UpdateAccount";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfAccountList from "../../pdf/PdfAccountList";
import { Loader } from "@/components/common/Loader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import AccountListExcel from "../../exel/AccountListExcel";
interface IAccountListProps { }
export interface IAccountStateProps {
  search: string;
  actionData: any;
  addAccountOpen: boolean;
  accountsList: any[];
  accountId: number | null;
}

const AccountList: FC<IAccountListProps> = () => {
  const { data: singleCms } = useGetSingleCMSQuery(
      {}
    );
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const [accountState, setAccountState] = useState<IAccountStateProps>({
    search: "",
    actionData: {},
    addAccountOpen: false,
    accountsList: [],
    accountId: null,
  });

  const { data: accountsData, isLoading: accountsLoading } =
    useGetAccountsQuery("All");

  const [deleteAccount] = useDeleteAccountMutation({});

  useEffect(() => {
    const customizeAccountsData = accountsData?.data?.map(
      (singleUser: any, userIndex: number) => ({
        ...singleUser,
        accountName: formatter({
          type: "words",
          words: singleUser?.accountName,
        }),
        bankName: formatter({ type: "words", words: singleUser?.bankName }),
        accountType: formatter({
          type: "words",
          words: singleUser?.accountType,
        }),
        openingBalance: formatter({
          type: "amount",
          amount: singleUser?.openingBalance,
        }),
        currentBalance: formatter({
          type: "amount",
          amount: singleUser?.currentBalance,
        }),
        index: generateDynamicIndexWithMeta(accountsData, userIndex),
      })
    );

    setAccountState((prevState: IAccountStateProps) => ({
      ...prevState,
      accountsList: customizeAccountsData || [],
    }));
  }, [accountsData]);

  const accountDeleteHandler = async (id: number) => {
    const result = await deleteAccount(id);

    if (result.data?.success) {
      toast({
        title: translate(
          "অ্যাকাউন্ট মুছে ফেলার বার্তা",
          "Message for deleting account"
        ),
        description: toastMessage("delete", translate("অ্যাকাউন্ট", "account")),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    {
      accessorKey: "accountName",
      header: translate("অ্যাকাউন্টের নাম", "Account Name"),
    },
    {
      accessorKey: "bankName",
      header: translate("ব্যাংকের নাম", "Bank Name"),
    },
    {
      accessorKey: "accountType",
      header: translate("অ্যাকাউন্টের ধরন", "Type"),
    },
    {
      accessorKey: "openingBalance",
      header: translate("প্রারম্ভিক ব্যালেন্স", "Opening Balance"),
    },
    {
      accessorKey: "currentBalance",
      header: translate("বর্তমান ব্যালেন্স", "Current Balance"),
    },

    {
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const account = row.original as any;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel>
                {translate("কার্যক্রমগুলো", "Actions")}
              </DropdownMenuLabel>
              {/* UPDATE ACCOUNT */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("সম্পাদনা করুন", "Update")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateAccount id={account?.id} />
                </DialogContent>
              </Dialog>
              {/* DETAILS ACCOUNT */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("বিস্তারিত", "Details")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <DetailsAccount id={account?.id} />
                </DialogContent>
              </Dialog>
              {/* USER DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => accountDeleteHandler(account.id)}
                alertLabel={translate("অ্যাকাউন্ট", "account")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (accountsLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "অ্যাকাউন্টের তালিকা এবং সকল তথ্য উপাত্ত",
          "Account list and all ralevnet information & data"
        )}
        heading={translate("অ্যাকাউন্ট", "Account")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            {/* <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAccountState((prevState: IAccountStateProps) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.account.placeholder.bn,
                  searchInputLabelPlaceholder.account.placeholder.en
                )}
              />
            </li> */}
            <li>
              <Dialog
                open={accountState.addAccountOpen}
                onOpenChange={(open: boolean) =>
                  setAccountState((prevState: IAccountStateProps) => ({
                    ...prevState,
                    addAccountOpen: open,
                  }))
                }
              >
                <DialogTrigger asChild>
                  <Button
                    className="group relative"
                    variant="green"
                    size="icon"
                  >
                    <LuPlus />
                    <span className="custom-tooltip-top">
                      {translate("অ্যাকাউন্ট যুক্ত করুন", "Add Account")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddAccount setAccountState={setAccountState} />
                </DialogContent>
              </Dialog>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="green" size="sm">
                    <LuDownload className="size-4 mr-1" />
                    {translate("এক্সপোর্ট", " Export")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cn("w-[100px] space-y-2")}
                  align="end"
                >
                  <DropdownMenuItem>
                    <PDFDownloadLink
                      document={
                        <PdfAccountList
                          result={accountState.accountsList || []}
                          singleCms={singleCms}
                        />
                      }
                      fileName="today_sales_report.pdf"
                    >
                      {
                        //@ts-ignore
                        (params) => {
                          const { loading } = params;
                          return loading ? (
                            <Button
                              disabled
                              className="transition-all duration-150"
                              variant="destructive"
                              size="xs"
                            >
                              <Loader /> {translate("পিডিএফ", "PDF")}
                            </Button>
                          ) : (
                            <Button variant="destructive" size="xs">
                              {translate("পিডিএফ", "PDF")}
                            </Button>
                          );
                        }
                      }
                    </PDFDownloadLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <AccountListExcel result={accountState.accountsList || []} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </TableToolbar>
        <DataTable columns={columns} data={accountState.accountsList} />
      </TableWrapper>
    </PageWrapper>
  );
};

export default AccountList;
