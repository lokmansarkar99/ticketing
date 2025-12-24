import { TableCell } from "@/components/ui/table";
import { FC } from "react";

interface IEmptyTableCellProps {
  className: string;
  item: number;
}

const EmptyTableCell: FC<IEmptyTableCellProps> = ({ className, item }) => {
  return (
    <>
      {Array(item)
        .fill("")
        .map((_: any, index: number) => (
          <TableCell key={index} className={className}></TableCell>
        ))}
    </>
  );
};

export default EmptyTableCell;
