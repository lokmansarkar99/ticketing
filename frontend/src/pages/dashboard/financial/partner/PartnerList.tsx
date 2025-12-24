import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  useDeletePartnerMutation,
  useGetPartnersQuery,
} from "@/store/api/finance/partnerApi";
import { fallback } from "@/utils/constants/common/fallback";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import formatter from "@/utils/helpers/formatter";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddPartner from "./AddPartner";
import DetailsPartner from "./DetailsPartner";
import UpdatePartner from "./UpdatePartner";

interface IPartnerListProps {}
export interface IPartnerStateProps {
  search: string;
  actionData: any;
  addPartnerOpen: boolean;
  partnerList: any[];
  partnerId: number | null;
}

const PartnerList: FC<IPartnerListProps> = () => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: 0,
      size: 10,
      total: 100,
      totalPage: 10,
    },
  });
  const [partnerState, setPartnerState] = useState<IPartnerStateProps>({
    search: "",
    actionData: {},
    addPartnerOpen: false,
    partnerList: [],
    partnerId: null,
  });

  const { data: partnersData, isLoading: partnersLoading } =
    useGetPartnersQuery({
      search: partnerState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });

  const [deletePartner] = useDeletePartnerMutation({});

  useEffect(() => {
    const customizePartnersData = partnersData?.data?.map(
      (singlePartner: any, partnerIndex: number) => ({
        ...singlePartner,
        name: formatter({ type: "words", words: singlePartner?.name }),
        phone: singlePartner?.phone || fallback.notFound.en,
        address: singlePartner?.address || fallback.notFound.en,
        index: generateDynamicIndexWithMeta(partnersData, partnerIndex),
      })
    );

    setPartnerState((prevState: IPartnerStateProps) => ({
      ...prevState,
      partnerList: customizePartnersData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: partnersData?.meta,
    }));
  }, [partnersData]);

  const partnerDeleteHandler = async (id: number) => {
    const result = await deletePartner(id);

    if (result.data?.success) {
      toast({
        title: translate(
          "অংশীদার মুছে ফেলার বার্তা",
          "Message for deleting partner"
        ),
        description: toastMessage("delete", translate("অংশীদার", "partner")),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },

    {
      accessorKey: "name",
      header: translate("পুরো নাম", "Full Name"),
    },

    {
      accessorKey: "phone",
      header: translate("যোগাযোগ নম্বর", "Contact No"),
    },

    {
      accessorKey: "address",
      header: translate("ঠিকানা", "Address"),
    },

    {
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const partner = row.original as any;
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
              {/* UPDATE PARTNER */}
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
                <DialogContent size="md">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdatePartner id={partner?.id} />
                </DialogContent>
              </Dialog>

              {/* DETAILS PARTNER */}
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
                  <DetailsPartner id={partner?.id} />
                </DialogContent>
              </Dialog>

              {/* USER DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => partnerDeleteHandler(partner.id)}
                alertLabel={translate("অংশীদার", "Partner")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (partnersLoading) {
    return <TableSkeleton columns={5} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "অংশীদারীদের তালিকা এবং সকল তথ্য উপাত্ত",
          "Partner list and all ralevnet information & data"
        )}
        heading={translate("অংশীদার", "Partner")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPartnerState((prevState: IPartnerStateProps) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.partner.placeholder.bn,
                  searchInputLabelPlaceholder.partner.placeholder.en
                )}
              />
            </li>
            <li>
              <Dialog
                open={partnerState.addPartnerOpen}
                onOpenChange={(open: boolean) =>
                  setPartnerState((prevState: IPartnerStateProps) => ({
                    ...prevState,
                    addPartnerOpen: open,
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
                      {translate("অংশীদার যুক্ত করুন", "Add Partner")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="md">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddPartner setPartnerState={setPartnerState} />
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
                    {translate("পিডিএফ", "Pdf")}
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
          data={partnerState.partnerList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default PartnerList;
