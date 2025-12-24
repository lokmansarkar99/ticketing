/* eslint-disable @typescript-eslint/ban-ts-comment */
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useGetSupervisorCollectionAllListQuery } from "@/store/api/superviosr/supervisorCollectionApi";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { ChangeEvent, FC, useEffect, useState } from "react"; // Ensure ChangeEvent is imported
import { FiEdit } from "react-icons/fi";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddExtraIncome from "./AddExtraIncome";
import SupervisorCollectionDetails from "./SupervisorCollectionDetails";
import UpdateSupervisorCollection from "./UpdateSupervisorCollection";

interface ISupervisorCollectionListProps {}

interface ISupervisorCollectionStateProps {
  search: string;
  addCollectionOpen: boolean;
  collectionList: SupervisorCollection[];
}

export interface SupervisorCollection {
  id: number;
  coachConfigId: number;
  counterId: number;
  supervisorId: number;
  collectionType: string;
  routeDirection: string;
  noOfPassenger: number;
  amount: number;
  date: string;
  file?: string;
  edit?: boolean; // Add this line if needed
}

const SupervisorManagement: FC<ISupervisorCollectionListProps> = () => {
  const { translate } = useCustomTranslator();

  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 100, totalPage: 10 },
  });

  const [collectionState, setCollectionState] =
    useState<ISupervisorCollectionStateProps>({
      search: "",
      addCollectionOpen: false,
      collectionList: [],
    });

  const { data: collectionData, isLoading: collectionLoading } =
    useGetSupervisorCollectionAllListQuery({
      search: collectionState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });

  //const [deleteCollection] = useDeleteCollectionOfSupervisorMutation();

  useEffect(() => {
    const customizedData = collectionData?.data?.map(
      (item: SupervisorCollection, index: number) => ({
        ...item,
        index: generateDynamicIndexWithMeta(collectionData, index),
      })
    );

    setCollectionState((prevState) => ({
      ...prevState,
      collectionList: customizedData || [],
    }));

    setQuery((prev) => ({
      ...prev,
      meta: collectionData?.meta,
    }));
  }, [collectionData]);

  // const handleDelete = async (id: number) => {
  //   const result = await deleteCollection(id);
  //   if (result.data?.success) {
  //     toast({
  //       title: translate("সংগ্রহ মুছে ফেলার বার্তা", "Collection Deleted"),
  //       description: toastMessage("delete", translate("সংগ্রহ", "Collection")),
  //     });
  //     playSound("remove");

  //     refetch();
  //   }
  // };

  const columns: ColumnDef<SupervisorCollection>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    {
      accessorKey: "coachConfig.coachNo",
      header: translate("কোচ ", "Coach Number"),
    },
    {
      accessorKey: "counter.name",
      header: translate("কাউন্টার", "Counter Name"),
    },
    {
      accessorKey: "supervisor.userName",
      header: translate("সুপারভাইজার", "Supervisor Name"),
    },
    {
      accessorKey: "collectionType",
      header: translate("সংগ্রহের ধরন", "Collection Type"),
    },
    {
      accessorKey: "routeDirection",
      header: translate("রুটের দিক", "Route Direction"),
    },
    {
      accessorKey: "noOfPassenger",
      header: translate("যাত্রীর সংখ্যা", "Number of Passengers"),
    },
    { accessorKey: "amount", header: translate("পরিমাণ", "Amount") },
    {
      accessorKey: "date",
      header: translate("তারিখ", "Date"),
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      accessorKey: "file",
      header: translate("ফাইল", "File"),
      cell: ({ row }) =>
        row.original.file
          ? new Date(row.original.file).toLocaleDateString()
          : "-",
    },
    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex gap-2">
            {/* Edit Button */}
            {item.edit && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="xs">
                    <FiEdit className="mr-1" />
                    {translate("সম্পাদনা করুন", "Edit")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle>Update Collection</DialogTitle>
                  <UpdateSupervisorCollection
                    collectionData={item}
                    setCollectionState={setCollectionState}
                  />
                </DialogContent>
              </Dialog>
            )}

            {/* Details Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="xs">
                  {translate("বিস্তারিত", "Details")}
                </Button>
              </DialogTrigger>
              <DialogContent size="lg">
                <DialogTitle>Collection Details</DialogTitle>
                <SupervisorCollectionDetails id={item.id} />
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  if (collectionLoading) {
    return <TableSkeleton columns={6} />;
  }

  return (
    <PageWrapper>
      <TableWrapper heading={translate("সংগ্রহ", "Collection")}>
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCollectionState((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate("অনুসন্ধান করুন", "Search")}
              />
            </li>
            <li>
              <Dialog
                open={collectionState.addCollectionOpen}
                onOpenChange={(open) =>
                  setCollectionState((prev) => ({
                    ...prev,
                    addCollectionOpen: open,
                  }))
                }
              >
                <DialogTrigger asChild>
                  <Button variant="default" size="icon">
                    <LuPlus />
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle>Add Collection</DialogTitle>
                  <AddExtraIncome setCollectionState={setCollectionState} />
                </DialogContent>
              </Dialog>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm">
                    <LuDownload className="mr-1" />
                    {translate("এক্সপোর্ট", "Export")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>PDF</DropdownMenuItem>
                  <DropdownMenuItem>Excel</DropdownMenuItem>
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
          data={collectionState.collectionList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default SupervisorManagement;
