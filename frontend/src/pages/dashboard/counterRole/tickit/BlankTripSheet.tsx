export default function BlankTripSheet() {
  return (
    <div className="py-4 w-full max-w-full">
      <div className="border border-black w-full text-xs">
        {/* Header Row */}
        <div className="grid grid-cols-10 border-b border-black text-center font-semibold">
          <div className=" border-r border-black p-2">Counter Name</div>
          <div className="border-r border-black p-2">Dept. Time</div>
          <div className="border-r border-black p-2">Pass. Qty</div>
          <div className="border-r border-black p-2">Amount(TK)</div>
          <div className="border-r border-black p-2">Signature</div>

          <div className=" border-r border-black p-2">Counter Name</div>
          <div className="border-r border-black p-2">Dept. Time</div>
          <div className="border-r border-black p-2">Pass. Qty</div>
          <div className="p-2 border-r">Amount(TK)</div>
          <div className="p-2">Signature</div>
        </div>

        {/* 15 Empty Rows */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`grid grid-cols-10 text-center h-8 ${
              i !== 14 ? "border-b border-black" : ""
            }`}
          >
            {[...Array(10)].map((_, j) => (
              <div
                key={j}
                className={`${j !== 9 ? "border-r border-black" : ""} h-full`}
              ></div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}
