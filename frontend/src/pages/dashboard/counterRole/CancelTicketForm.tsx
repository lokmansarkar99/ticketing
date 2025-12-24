import { Input } from "@/components/ui/input";
import { addBookingSeatForm } from "@/utils/constants/form/addBookingForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";

const CancelTicketForm = ({ cancelTickets }: any) => {
    const { translate } = useCustomTranslator();
    const firstTicket = cancelTickets?.[0];
  
    const customerName = firstTicket?.order?.customerName || "";
    const phone = firstTicket?.order?.phone || "";
    const gender = firstTicket?.order?.gender || "";
    const email = firstTicket?.order?.email || "";
    const boardingPoint = firstTicket?.fromStation?.name || "";
    const droppingPoint = firstTicket?.toStation?.name || "";
  
    return (
      <div>
        <table className="table-auto border-collapse border w-full">
          <tbody className="text-[13px]">
            {/* Row 1: Name and Phone */}
            <tr className="border">
              <td className="border px-2 py-1 font-medium text-xs">
                {translate("নাম", "Name")}
              </td>
              <td className="border px-2 py-1">
                <Input
                  value={customerName}
                  type="text"
                  id="name"
                  readOnly
                  placeholder={translate(
                    addBookingSeatForm.name.placeholder.bn,
                    addBookingSeatForm.name.placeholder.en
                  )}
                  className="w-full h-7"
                />
              </td>
              <td className="border px-2 py-1 font-medium text-xs">
                {translate("ফোন", "Phone")}{" "}
                <span className="text-red-600 font-semibold">✼</span>
              </td>
              <td className="border px-2 py-1">
                <Input
                  value={phone}
                  type="tel"
                  id="phone"
                  readOnly
                  placeholder={translate(
                    addBookingSeatForm.phone.placeholder.bn,
                    addBookingSeatForm.phone.placeholder.en
                  )}
                  className="w-full h-7"
                />
              </td>
            </tr>
  
            {/* Row 2: Gender and Email */}
            <tr className="border">
              <td className="border px-2 py-1 font-medium text-xs">
                {translate("লিঙ্গ", "Gender")}
              </td>
              <td className="border px-2 py-1">
                <Input
                  value={gender}
                  type="text"
                  id="gender"
                  readOnly
                  className="w-full h-7"
                />
              </td>
              <td className="border px-2 py-1 font-medium text-xs">
                {translate("ইমেইল", "Email")}
              </td>
              <td className="border px-2 py-1">
                <Input
                  value={email || ""}
                  type="email"
                  id="email"
                  readOnly
                  placeholder={translate(
                    addBookingSeatForm.email.placeholder.bn,
                    addBookingSeatForm.email.placeholder.en
                  )}
                  className="w-full h-7"
                />
              </td>
            </tr>
  
            {/* Row 3: Boarding and Dropping Points */}
            <tr className="border">
              <td className="border px-2 py-1 font-medium text-xs">
                {translate("বোর্ডিং পয়েন্ট", "Boarding Point")}{" "}
                <span className="text-red-600 font-semibold">✼</span>
              </td>
              <td className="border px-2 py-1">
                <Input
                  value={boardingPoint}
                  type="text"
                  id="boardingPoint"
                  readOnly
                  className="w-full h-7"
                />
              </td>
              <td className="border px-2 py-1 font-medium text-xs">
                {translate("ড্রপিং পয়েন্ট", "Drop Point")}{" "}
                <span className="text-red-600 font-semibold">✼</span>
              </td>
              <td className="border px-2 py-1">
                <Input
                  value={droppingPoint}
                  type="text"
                  id="droppingPoint"
                  readOnly
                  className="w-full h-7"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  export default CancelTicketForm