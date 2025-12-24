import formatter from "../helpers/formatter";
import { useCustomTranslator } from "./useCustomTranslator";

type MessageType =
  | "add"
  | "update"
  | "delete"
  | "login"
  | "cancel"
  | "confirm"
  | "return"
  | "approve"
  | "reject"
  | "send"
  | "receive"
  | "archive"
  | "changePassword"
  | "transfer"
  | "Error"
  | "Registration";

const useMessageGenerator = () => {
  const { translate } = useCustomTranslator();

  const toastMessage = (messageType: MessageType, title: string): string => {
    const formattedTitle = title?.toLowerCase();
    const capitalizedTitle = formatter({ type: "words", words: title });

    const baseMessage = translate(
      `${title} সফলভাবে সম্পন্ন হয়েছে`,
      `The '${title}' has been successfully`
    );

    const checkListMessage = translate(
      `দয়া করে নিশ্চিত করতে '${formattedTitle}' তালিকা পরীক্ষা করুন`,
      `Please check the '${formattedTitle}' list to ensure the`
    );

    switch (messageType) {
      case "add":
        return translate(
          `নতুন '${title}' সফলভাবে সিস্টেমে যোগ করা হয়েছে। ${checkListMessage} সংযোজন সফল হয়েছে।`,
          `A new '${title}' has been successfully added to the system. ${checkListMessage} addition was successful.`
        );
      case "update":
        return translate(
          `${baseMessage} আপডেট হয়েছে। ${checkListMessage} আপডেট সফল হয়েছে।`,
          `${baseMessage} updated. ${checkListMessage} update was successful.`
        );
      case "delete":
        return translate(
          `${baseMessage} সিস্টেম থেকে সরানো হয়েছে। ${checkListMessage} মুছে ফেলা সফল হয়েছে।`,
          `${baseMessage} removed from the system. ${checkListMessage} deletion was successful.`
        );
      case "login":
        return translate(
          `লগইন সফল হয়েছে, '${capitalizedTitle}'. আমাদের অ্যাপ্লিকেশনে স্বাগতম!`,
          `Login successful, '${capitalizedTitle}'. Welcome to our application!`
        );
      case "cancel":
        return translate(
          `${baseMessage} বাতিল হয়েছে। ${checkListMessage} বাতিল সফল হয়েছে।`,
          `${baseMessage} canceled. ${checkListMessage} cancelation was successful.`
        );
      case "confirm":
        return translate(
          `${baseMessage} নিশ্চিত হয়েছে। ${checkListMessage} নিশ্চিতকরণ সফল হয়েছে।`,
          `${baseMessage} confirmed. ${checkListMessage} confirmation was successful.`
        );
      case "return":
        return translate(
          `${baseMessage} ফেরত এসেছে। ${checkListMessage} রিটার্ন সফল হয়েছে।`,
          `${baseMessage} returned. ${checkListMessage} return was successful.`
        );
      case "approve":
        return translate(
          `${baseMessage} অনুমোদিত হয়েছে। ${checkListMessage} অনুমোদন সফল হয়েছে।`,
          `${baseMessage} approved. ${checkListMessage} approval was successful.`
        );
      case "reject":
        return translate(
          `${baseMessage} প্রত্যাখ্যাত হয়েছে। ${checkListMessage} প্রত্যাখ্যান সফল হয়েছে।`,
          `${baseMessage} rejected. ${checkListMessage} rejection was successful.`
        );
      case "send":
        return translate(
          `${baseMessage} পাঠানো হয়েছে। ${checkListMessage} প্রেরণ সফল হয়েছে।`,
          `${baseMessage} sent. ${checkListMessage} sending was successful.`
        );
      case "receive":
        return translate(
          `${baseMessage} গৃহীত হয়েছে। ${checkListMessage} গ্রহণ সফল হয়েছে।`,
          `${baseMessage} received. ${checkListMessage} reception was successful.`
        );
      case "archive":
        return translate(
          `${baseMessage} সংরক্ষণ করা হয়েছে। ${checkListMessage} সংরক্ষণ সফল হয়েছে।`,
          `${baseMessage} archived. ${checkListMessage} archiving was successful.`
        );
      case "transfer":
        return translate(
          `${baseMessage} স্থানান্তর করা হয়েছে। ${checkListMessage} স্থানান্তর সফল হয়েছে।`,
          `${baseMessage} transferred. ${checkListMessage} transfer was successful.`
        );
      case "changePassword":
        return translate(
          `আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।`,
          `Your password has been successfully changed`
        );
      default:
        return translate(
          `অজানা বার্তার ধরন: ${messageType}`,
          `Unknown message type: ${messageType}`
        );
    }
  };

  return { toastMessage };
};

export default useMessageGenerator;
