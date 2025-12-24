// import { IReceivedPaymentTableRequired } from "@/components/common/payment/AddReceivedPaymentTableRequired";

// export const paymentChangeExcluder = (
//   paymentTable: IReceivedPaymentTableRequired[],
//   changeAmount: number = 0
// ) => {
//   const updatePayment =
//     (paymentTable?.length > 0 &&
//       paymentTable?.map((singlePayment: IReceivedPaymentTableRequired) =>
//         singlePayment?.accountType?.toLowerCase() === "cash"
//           ? {
//               paymentAmount:
//                 changeAmount > 0
//                   ? (+singlePayment?.paymentAmount || 0) - (+changeAmount || 0)
//                   : +singlePayment?.paymentAmount,
//               accountId: singlePayment?.accountId,
//             }
//           : {
//               paymentAmount: singlePayment.paymentAmount,
//               accountId: singlePayment?.accountId,
//             }
//       )) ||
//     [];

//   const removeInvalidAmountItem =
//     (updatePayment?.length > 0 &&
//       updatePayment?.filter(
//         (singleItem: any) =>
//           singleItem?.accountId !== null && +singleItem?.paymentAmount > 0
//       )) ||
//     [];

//   return removeInvalidAmountItem;
// };
