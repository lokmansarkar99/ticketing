import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { FC } from "react";
import { FaBan } from "react-icons/fa";

interface IPaymentCancelProps {}

const PaymentCancel: FC<IPaymentCancelProps> = () => {
  return (
    <PageWrapper>
      {" "}
      <div className="flex justify-center">
        <div className="w-full md:w-5/12 shadow-lg p-12 text-center my-10 border-b-4 border-yellow-600">
          <FaBan className="text-6xl text-yellow-600 mx-auto" />
          <h2 className="text-4xl font-semibold my-3">
            Your payment was cancelled
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            The payment process was cancelled. Please try again if needed.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PaymentCancel;
