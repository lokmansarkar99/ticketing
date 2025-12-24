export interface IRefundTypeOptionsProps {
    key: "NO_Charge" | "No_Cancellation" | "%_Of_Ticket_Fare";
    label: {
      en: string;
      bn: string;
    };
  }
  
  export const refundTypeOptions: IRefundTypeOptionsProps[] = [
    {
      key: "NO_Charge",
      label: { en: "No Charge", bn: "কোনো চার্জ নেই" },
    },
    {
      key: "No_Cancellation",
      label: { en: "No Cancellation", bn: "বাতিল নেই" },
    },
    {
      key: "%_Of_Ticket_Fare",
      label: { en: "% of Ticket Fare", bn: "টিকেট ভাড়ার %" },
    },
  ];
  