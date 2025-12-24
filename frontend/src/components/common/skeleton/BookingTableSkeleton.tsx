import { FC } from "react";
import SectionWrapper from "../wrapper/SectionWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import PageTransition from "../effect/PageTransition";

interface ITableSkeletonProps {
  columns?: number;
  rows?: number;
}

const BookingTableSkeleton: FC<ITableSkeletonProps> = ({
  columns = 10,
  rows = 3,
}) => {
  return (
    <PageTransition variant="fade">
      <SectionWrapper className="w-full my-0">
        <div className="rounded-md border-2 border-border/30 overflow-hidden w-full">
          <Table>
            <TableHeader>
              <TableRow className="!border-0 bg-background hover:bg-background/90 !rounded-md">
                {Array(columns)
                  .fill(null)
                  .map((_, index) => (
                    <TableHead key={index} className="!h-10 leading-6 truncate">
                      <Skeleton
                        className={cn(columns >= 5 ? "w-9/12" : "w-3/12")}
                        variant="primary"
                        shape="rounded"
                        typography="paragraph_sm"
                      />
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y-0 border-0">
              {Array(rows)
                .fill(null)
                .map((_, index) => (
                  <TableRow
                    key={index}
                    className={cn(
                      index % 2 === 0 ? "bg-background/30" : "bg-background/60",
                      "divide-y-0 border-0  !py-0 !mt-0"
                    )}
                  >
                    {Array(columns - 1)
                      .fill(null)
                      .map((_, index) => (
                        <TableHead
                          key={index}
                          className="!h-10 leading-6 truncate"
                        >
                          <Skeleton
                            className={cn(columns >= 5 ? "w-9/12" : "w-3/12")}
                            variant="primary"
                            shape="rounded"
                            typography="paragraph_sm"
                          />
                        </TableHead>
                      ))}
                    <TableCell className="!h-10 py-0 w-40">
                      <Skeleton variant="primary" shape="rounded" button="sm" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </SectionWrapper>
    </PageTransition>
  );
};

export default BookingTableSkeleton;
