import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetCollectionAccountDashboardQuery } from "@/store/api/accounts/accountsDashboardApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";
import CollectionDetails from "./CollectionDetails";

export interface ICollectionStateProps {
  search: string;
  expensesList: any[];
  authorizeModalOpen: boolean;
  detailsModalOpen: boolean;
  selectedCollectionId: number | null;
  selectedEditStatus: boolean;
}

export interface ICollectionManagementDashboardProps {}

// Inside your CollectionList component, after fetching the expensesList data and setting the selectedCollectionId

const CollectionList: FC<ICollectionManagementDashboardProps> = () => {
  const { translate } = useCustomTranslator();

  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 100, totalPage: 10 },
  });

  const [expenseState, setExpenseState] = useState<ICollectionStateProps>({
    search: "",
    authorizeModalOpen: false,
    detailsModalOpen: false,
    expensesList: [],
    selectedCollectionId: null,
    selectedEditStatus: false,
  });

  const { data: collectionData, isLoading: collectionLoading } =
    useGetCollectionAccountDashboardQuery({
      search: expenseState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });

  useEffect(() => {
    if (collectionData) {
      setExpenseState((prev) => ({
        ...prev,
        expensesList: collectionData?.data || [],
      }));
      setQuery((prev) => ({ ...prev, meta: collectionData?.meta }));
    }
  }, [collectionData]);

  // const handleAuthorizeClick = (id: number, editStatus: boolean) => {
  //   setExpenseState((prev) => ({
  //     ...prev,
  //     authorizeModalOpen: true,
  //     selectedCollectionId: id,
  //     selectedEditStatus: editStatus,
  //   }));
  // };

  const handleDetailsClick = (id: number) => {
    setExpenseState((prev) => ({
      ...prev,
      detailsModalOpen: true,
      selectedCollectionId: id,
    }));
  };

  // const closeAuthorizeModal = () => {
  //   setExpenseState((prev) => ({
  //     ...prev,
  //     authorizeModalOpen: false,
  //     selectedCollectionId: null,
  //     selectedEditStatus: false,
  //   }));
  // };

  const closeDetailsModal = () => {
    setExpenseState((prev) => ({
      ...prev,
      detailsModalOpen: false,
      selectedCollectionId: null,
    }));
  };

  // Find the selected collection and extract its amount
  // const selectedCollection = expenseState.expensesList.find(
  //   (item) => item.id === expenseState.selectedCollectionId
  // );
  //const selectedAmount = selectedCollection ? selectedCollection.amount : 0;

  const columns = [
    { accessorKey: "id", header: translate("আইডি", "ID") },
    {
      accessorKey: "coachConfig.coachNo",
      header: translate("কোচ নম্বর", "Cocah Number"),
    },

    {
      accessorKey: "counter.name",
      header: translate("কাউন্টার নাম", "Counter Name"),
    },
    {
      accessorKey: "supervisor.userName",
      header: translate("সুপারভাইজার নাম", "Supervisor Name"),
    },
    {
      accessorKey: "collectionType",
      header: translate("সংগ্রহের প্রকার", "Collection Type"),
    },
    {
      accessorKey: "routeDirection",
      header: translate("রুট নির্দেশ", "Route Direction"),
    },

    { accessorKey: "amount", header: translate("পরিমাণ", "Amount") },
    {
      accessorKey: "date",
      header: translate("তারিখ", "Date"),
      cell: ({ row }: { row: any }) =>
        new Date(row.original.date).toLocaleDateString(),
    },
    {
      header: translate("কার্যক্রম", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: any }) => {
        const collection = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel>
                {translate("কার্যক্রম", "Action")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Details Button */}
              <Button
                onClick={() => handleDetailsClick(collection.id)}
                variant="outline"
                className="w-full flex justify-start"
                size="xs"
              >
                {translate("বিস্তারিত", "Details")}
              </Button>

              {/* Authorize Button
              <Button
                onClick={() =>
                  handleAuthorizeClick(collection.id, collection.edit)
                }
                variant="outline"
                className="w-full flex justify-start"
                size="xs"
              >
                {translate("অনুমোদন করুন", "Authorize")}
              </Button> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (collectionLoading) return <TableSkeleton columns={7} />;

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "সংগ্রহ ব্যবস্থাপনা তালিকা এবং সকল তথ্য উপাত্ত",
          "Collection list and all relevant information & data"
        )}
        heading={translate("সংগ্রহ ব্যবস্থাপনা", "Collection Management")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setExpenseState((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate("search", "search")}
              />
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LuDownload className="size-4 mr-1" />
                    {translate("এক্সপোর্ট", "Export")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cn("w-[100px] space-y-2")}
                  align="end"
                >
                  <DropdownMenuItem>
                    {translate("পিডিএফ", "PDF")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {translate("এক্সেল", "Excel")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </TableToolbar>
        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={expenseState.expensesList}
        />
      </TableWrapper>

      {/* Authorize Collection Modal
      <Dialog
        open={expenseState.authorizeModalOpen}
        onOpenChange={closeAuthorizeModal}
      >
        <DialogContent size="lg">
          <DialogTitle>{translate("অনুমোদন করুন", "Authorize")}</DialogTitle>
          {expenseState.selectedCollectionId && (
            <AuthorizeCollectionModal
              collectionId={expenseState.selectedCollectionId}
              editStatus={expenseState.selectedEditStatus}
              closeModal={closeAuthorizeModal}
              amount={selectedAmount} // Pass the correct amount as prop
            />
          )}
        </DialogContent>
      </Dialog>
 */}
      {/* Collection Details Modal */}
      <Dialog
        open={expenseState.detailsModalOpen}
        onOpenChange={closeDetailsModal}
      >
        <DialogContent size="lg">
          <DialogTitle>
            {translate("সংগ্রহ বিস্তারিত", "Collection Details")}
          </DialogTitle>
          {expenseState && (
            <CollectionDetails collectionDetailsData={expenseState} />
          )}
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default CollectionList;
