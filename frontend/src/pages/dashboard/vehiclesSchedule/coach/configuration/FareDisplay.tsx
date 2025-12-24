const FareDisplay = ({ segments }: { segments: any[] }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Fare Information</h3>

      <div className="grid gap-4 md:grid-cols-3">
        {segments?.length > 0 ?
          segments?.map((segment, index) => (
            <div
              key={index}
              className=" rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="bg-[#1BC5FE] p- text-white">
                <h4 className="font-semibold text-center">
                  {segment.fromStation.name} → {segment.toStation.name}
                </h4>
              </div>

              <div className="px-2 py-1">
                <div className="">
                  <div className="flex justify-between items-center border-b pb-1">
                    <span className="text-gray-600 font-medium">
                      Economy Class
                    </span>
                    <span className="font-semibold">
                      ৳{segment.e_class_amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b py-1">
                    <span className="text-gray-600 font-medium">
                      Business Class
                    </span>
                    <span className="font-semibold">
                      ৳{segment.b_class_amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center  py-1">
                    <span className="text-gray-600 font-medium">
                      Sleeper Class
                    </span>
                    <span className="font-semibold">
                      ৳{segment.sleeper_class_amount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )):<><p className="text-center text-xl font-semibold text-red-600">Select a coach first !</p></>}
      </div>
    </div>
  );
};

export default FareDisplay;
