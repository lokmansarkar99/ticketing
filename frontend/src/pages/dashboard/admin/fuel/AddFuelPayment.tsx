import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import { Loader } from "@/components/common/Loader";
import AddPaymentTable from "@/components/common/payment/AddPaymentTable";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  addUpdateFuelPaymentschema,
  addUpdateFuelPaymentschemaProps,
} from "@/schemas/financial/addUpdateFuelPaymentSchema";
import {
  useAddDuePaymentMutation,
  useFindDuePaymentsQuery,
} from "@/store/api/finance/paymentApi";
import { useGetFuelCompanyAllListQuery } from "@/store/api/superviosr/fuelCompanyApi";
import { useGetVehiclesQuery } from "@/store/api/vehiclesSchedule/vehicleApi";
import { fuelPaymentForm } from "@/utils/constants/form/addUpdateFuelPaymentForm";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IAddFuelPaymentProps {
  setPaymentOpen: (paymentOpen: boolean) => void;
}

const AddFuelPayment: FC<IAddFuelPaymentProps> = ({ setPaymentOpen }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  // PAYMENT TABLE STATE
  const [paymentTable, setPaymentTable] = useState<any[]>([
    {
      index: 0,
      accountId: null,
      paymentAmount: "",
      currentBalance: null,
    },
  ]);

  const [currentDue, setCurrentDue] = useState<number>(0);

  const { data: fuelCompanyListData, isLoading: loadingFuelCOmpany } =
    useGetFuelCompanyAllListQuery({});

  const { data: vehiclesData, isLoading: vehiclesLoading } =
    useGetVehiclesQuery({});

  // ADD CUSTOMER PAYMENT MUTATION
  const [
    addDuePayment,
    { isLoading: addDuePaymentLoading, error: addDuePaymentError },
  ] = useAddDuePaymentMutation() as any;

  // REACT HOOK FORM TO ADD ADD Due PAYMENT
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
  } = useForm<addUpdateFuelPaymentschemaProps>({
    resolver: zodResolver(addUpdateFuelPaymentschema),
  });
  const { data: findDuePayment } = useFindDuePaymentsQuery(
    watch("fuelCompanyId") && watch("registrationNo")
      ? {
          fuelCompanyId: watch("fuelCompanyId"),
          registrationNo: watch("registrationNo"),
        }
      : skipToken
  );

  const totalAmount = paymentTable.reduce(
    (total: any, item: { paymentAmount: any }) =>
      total + (item.paymentAmount || 0),
    0
  );

  useEffect(() => {
    const initialDueAmount = findDuePayment?.data?.due || 0;
    const paymentTotal = paymentTable.reduce((total, payment) => {
      return total + Number(payment.paymentAmount || 0);
    }, 0);
    setCurrentDue(initialDueAmount - paymentTotal);
    // Set the totalAmount in the form
    setValue("amount", totalAmount);

    // Update the payments array in the form
    setValue(
      "payments",
      paymentTable.map((account: any) => ({
        accountId: account.accountId,
        paymentAmount: account.paymentAmount || 0,
      }))
    );
  }, [setValue, paymentTable, totalAmount, findDuePayment?.data?.due]);

  const handleAddDuePay = async (data: addUpdateFuelPaymentschemaProps) => {
    if (totalAmount > findDuePayment?.data?.due) {
      // Set an error in the form for the total payment field
      setError("payments", {
        type: "manual",
        message: translate(
          "পেমেন্ট পরিমাণ কিস্তি পরিমাণের চেয়ে বেশি হতে পারে না",
          "Payment amount cannot be greater than the due amount"
        ),
      });
      toast({
        title: translate("ত্রুটি", "Error"),
        description: translate(
          "পেমেন্ট পরিমাণ কিস্তি পরিমাণের চেয়ে বেশি হতে পারে না",
          "Payment amount cannot be greater than the due amount"
        ),
        variant: "destructive",
      });
      return;
    }


    const result = await addDuePayment(data);
    if (result?.data?.success) {
      toast({
        title: translate("ব্যয় যোগ করার বার্তা", "Message for adding expense"),
        description: toastMessage("add", translate("ব্যয়", "expense")),
      });
      setPaymentOpen(false);
    }
  };

  if (loadingFuelCOmpany) {
    return <Loader />;
  }

  return (
    <FormWrapper
      heading={translate("ব্যয় যোগ করুন", "Add Payment")}
      subHeading={translate(
        "সিস্টেমে নতুন ব্যয় যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new expense to the system."
      )}
    >
      <form onSubmit={handleSubmit(handleAddDuePay)}>
        <ul className="flex justify-between border py-1.5 rounded-md px-2 mt-2 mx-1">
          <li className="flex space-x-2">
            <label className="text-sm md:text-base">Due Amount</label>

            <b className="ml-2 text-sm md:text-base text-red-500">
              {findDuePayment?.data?.due
                ? findDuePayment?.data?.due?.toFixed(2)
                : "0.00"}
              ৳
            </b>
          </li>

          <li>
            <label className="text-sm md:text-base">Payable Amount</label>

            <b className="ml-2 text-sm md:text-base">
              {totalAmount.toFixed(2) || "0.00"}৳
            </b>
          </li>
          <li className="flex space-x-2">
            <label className="text-sm md:text-base">Current Due</label>

            <b className="ml-2 text-sm md:text-base text-red-500">
              {currentDue.toFixed(2)}৳
            </b>
          </li>
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 mt-5 gap-x-4 md:gap-x-6">
          {/* Registration NUMBER */}
          <InputWrapper
            error={errors.registrationNo?.message}
            labelFor="registrationNo"
            label={translate(
              fuelPaymentForm?.registrationNo.label.bn,
              fuelPaymentForm?.registrationNo.label.en
            )}
          >
            <Select
              value={watch("registrationNo") || ""}
              onValueChange={(value: string) => {
                setValue("registrationNo", value);
                setError("registrationNo", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="registrationNo" className="w-full">
                <SelectValue
                  placeholder={translate(
                    fuelPaymentForm.registrationNo.placeholder.bn,
                    fuelPaymentForm.registrationNo.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!vehiclesLoading &&
                  vehiclesData?.data?.length > 0 &&
                  vehiclesData.data.map((coach: any, index: number) => (
                    <SelectItem
                      key={index}
                      value={coach.registrationNo?.toString()} // Use registrationNo as the value
                    >
                      {formatter({
                        type: "words",
                        words: coach.registrationNo,
                      })}
                    </SelectItem>
                  ))}

                {vehiclesLoading && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>

          <InputWrapper
            label={translate(
              "জ্বালানী কোম্পানি নির্বাচন করুন",
              "Select Fuel Company"
            )}
            error={errors.fuelCompanyId?.message}
          >
            <Select
              onValueChange={(value) =>
                setValue("fuelCompanyId", parseInt(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={translate(
                    "জ্বালানী কোম্পানি নির্বাচন করুন",
                    "Select Fuel Company"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {fuelCompanyListData?.data.map((company: any) => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputWrapper>
        </div>

        <AddPaymentTable
          required
          scrollable
          paymentTable={paymentTable}
          setPaymentTable={setPaymentTable}
          watch={watch}
          property="payments"
          setError={setError}
        />

        {/* ERROR MESSAGE */}
        <Submit
          loading={addDuePaymentLoading}
          errors={addDuePaymentError}
          submitTitle={translate("ব্যয় যোগ করুন", "Add Payment")}
          errorTitle={translate("ব্যয় যোগ করতে ত্রুটি", "Add Payment Error")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddFuelPayment;
