import { FC } from "react";
import Barcode from "react-barcode";

interface IBarCodeProps {
  companyName: string;
  singleProduct: any;
}

const BarCode: FC<IBarCodeProps> = ({ companyName, singleProduct }) => {
  return (
    <div className="font-anek break-after-page bg-white text-black rounded-lg">
      <ul>
        <li className="flex justify-center text-[12px] leading-3 uppercase">
          <h4>
            <strong>{companyName}</strong>
          </h4>
        </li>
        <li>
          <b className="flex justify-center text-[10px] font-normal leading-3 uppercase">
            {singleProduct?.sku}
          </b>
        </li>

        <li>
          <Barcode
            displayValue={false}
            value={singleProduct?.sku}
            width={1.5}
            height={30}
            marginTop={1.5}
            marginBottom={1.5}
          />
        </li>
        <li className="leading-3 mx-auto font-medium text-[12px] max-w-[144px] truncate px-2 flex justify-center items-center space-x-0.5">
          <label className="text-center block leading-4">
            {singleProduct?.productName}
          </label>
        </li>
        <li className="flex justify-center space-x-1 leading-4">
          <b className="text-[14px] leading-3">
            TK.{" "}
            {(singleProduct?.sellingPrice || singleProduct?.sellPrice)?.toFixed(
              2
            )}{" "}
            + VAT
          </b>
        </li>
      </ul>
    </div>
  );
};

export default BarCode;
