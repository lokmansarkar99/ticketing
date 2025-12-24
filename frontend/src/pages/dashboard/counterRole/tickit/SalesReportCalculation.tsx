import { useState } from "react";
type Particular = {
  subject: string;
  amount: string;
};

interface IReport {
  counterName: string;
  sold: number;
  fare: number;
  totalCommission: number;
  user: {
    userName: string;
    commission: number;
    sold: number;
  }[];
}

export default function SalesReportCalculation({ orderSeat }: any) {
  const report: IReport[] = [];
  for (const seat of orderSeat) {
    if (seat?.order?.counter?.name) {
      const findCounter = report.find(
        (r) => r.counterName === seat.order.counter.name
      );

      const commission = seat?.order?.counter?.commssion || 0;
      const commissionType = seat?.order?.counter?.commissionType || "Fixed";
      const finalCommission =
        commissionType === "Fixed"
          ? commission
          : seat?.fare * (commission / 100);
      if (!findCounter) {
        report.push({
          counterName: seat?.order?.counter?.name,
          sold: 1,
          fare: seat.fare,
          totalCommission: finalCommission,
          user: [
            {
              userName: seat.order.user.userName,
              sold: 1,
              commission: finalCommission,
            },
          ],
        });
      } else {
        findCounter.sold += 1;
        findCounter.fare += seat.fare;
        findCounter.totalCommission += finalCommission;
        const findUser = findCounter.user.find(
          (user) => user.userName === seat.order.user.userName
        );
        if (!findUser) {
          findCounter.user.push({
            userName: seat.order.user.userName,
            sold: 1,
            commission: finalCommission,
          });
        } else {
          findUser.sold += 1;
          findUser.commission += finalCommission;
        }
      }
    }
  }

  const [particulars, setParticulars] = useState<Particular[]>([
    { subject: "", amount: "" },
  ]);

  const addParticular = () => {
    setParticulars([...particulars, { subject: "", amount: "" }]);
  };

  const updateParticular = (
    index: number,
    field: keyof Particular,
    value: string
  ) => {
    const updated = [...particulars];
    updated[index][field] = value;
    setParticulars(updated);
  };

  const particularTotal = particulars.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  return (
    <div className=" w-full overflow-x-auto ">
      <div className="border border-gray-700 w-full text-xs rounded-xl p-2">
        {/* Header */}
        <div className="border-b border-gray-700 bg-gray-200 text-center font-semibold p-1">
          Counter Sales Report
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-700">
              <th className="border border-gray-700 p-1">Counter Title</th>
              <th className="border border-gray-700 p-1">Sold</th>
              <th className="border border-gray-700 p-1">Fare</th>
              <th className="border border-gray-700" colSpan={2}>
                <span className="">Commission</span>
                <p className="grid grid-cols-2 justify-items-center items-center border-t mt-1">
                  <span>User Name</span> <span>Commission</span>
                </p>
              </th>
              <th className="border border-gray-700 p-1">Total Commission</th>
              <th className="border border-gray-700 p-1" colSpan={2}>
                Particular
              </th>
              <th className="border border-gray-700 p-1">Receive Amount</th>
            </tr>
          </thead>

          <tbody>
            {report.map((counter, counterIndex) => {
              const userRows = counter.user;

              return (
                <tr key={counterIndex}>
                  {/* Counter Name */}
                  <td className="border border-gray-700 p-1 font-semibold text-center">
                    {counter.counterName}
                  </td>

                  {/* Sold */}
                  <td className="border border-gray-700 p-1 text-center">
                    {counter.sold}
                  </td>

                  {/* Fare */}
                  <td className="border border-gray-700 p-1 text-center">
                    {counter.fare}
                  </td>

                  {/* Commission: Username & Commission List */}
                  <td
                    className="border border-gray-700 p-1 text-center"
                    colSpan={2}
                  >
                    <div className="flex flex-col gap-1">
                      {userRows.map((u, i) => (
                        <div key={i} className="grid grid-cols-2 gap-2">
                         
                        
                          <p className="p-1 border w-full">{u.userName}</p>
                          <p className="p-1 border w-full">{u.commission / u.sold} x {u.sold}={u.commission}</p>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Total Commission */}
                  <td className="border border-gray-700 p-1 text-center">
                    {counter.totalCommission}
                  </td>

                  {/* PARTICULAR (already dynamic) */}
                  <td className="border border-gray-700 p-1" colSpan={2}>
                    <div className="flex flex-col gap-2">
                      {particulars.map((p, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Subject"
                            value={p.subject}
                            onChange={(e) =>
                              updateParticular(index, "subject", e.target.value)
                            }
                            className="border p-1 w-full"
                          />
                          <input
                            type="number"
                            placeholder="Amount"
                            value={p.amount}
                            onChange={(e) =>
                              updateParticular(index, "amount", e.target.value)
                            }
                            className="border p-1 w-24"
                          />
                        </div>
                      ))}

                      {/* Buttons */}
                      <div className="flex items-center gap-2 text-xs">
                        <span>Particular Total = {particularTotal}</span>
                        <button
                          className="px-2 py-1 bg-primary text-white rounded"
                          onClick={addParticular}
                        >
                          Add more
                        </button>
                        <button className="px-2 py-1 bg-secondary text-white rounded">
                          Save
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Receive Amount = Fare - TotalCommission - ParticularTotal */}
                  <td className="border border-gray-700 p-1 text-center">
                    {counter.fare - counter.totalCommission - particularTotal}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
