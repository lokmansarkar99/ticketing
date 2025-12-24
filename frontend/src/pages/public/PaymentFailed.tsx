import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { FC } from "react";
import { FaTimesCircle } from "react-icons/fa";

interface IPaymentFailedProps {}

const PaymentFailed: FC<IPaymentFailedProps> = () => {
  return (
    <PageWrapper>
      {" "}
      <div className="flex justify-center">
        <div className="w-full md:w-5/12 shadow-lg p-12 text-center my-10 border-b-4 border-red-600">
          <FaTimesCircle className="text-6xl text-red-600 mx-auto" />
          <h2 className="text-4xl font-semibold my-3">Your payment failed</h2>
          <p className="text-lg text-gray-600 font-medium">Try again later</p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PaymentFailed;
