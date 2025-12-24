export const Signature = () => {
  return (
    <div className="border border-black text-xs w-full mt-4">
      {/* Rows */}
      {[
        ["Terminal Fee:", "", "Total(TK):", ""],
        ["Line Expenditure:", "", "Total Expenditure(TK):", ""],
        ["Staff Salary:", "", "Deposite:", ""],
        ["Oil:", "", "", ""],
        ["Vehicle Expenditure:", "", "", ""],
        ["Others:", "", "", ""],
      ].map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-4 border-b border-black last:border-b-0"
        >
          <div className="border-r border-black p-2 text-right">{row[0]}</div>
          <div className="border-r border-black p-2">{row[1]}</div>
          <div className="border-r border-black p-2 text-right">{row[2]}</div>
          <div className="p-2">{row[3]}</div>
        </div>
      ))}
    </div>
  );
};
