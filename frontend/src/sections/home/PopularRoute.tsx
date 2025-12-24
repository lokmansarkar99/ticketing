export default function PopularRoutes({
  items,
  setBookingState,
  setSearchTriggered,
}: any) {
  return (
    <section className="w-full py-10">
      <div className="">
        {/* Title */}
        <h2 className="inline-block text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 border-b-2 border-secondary py-1">
          Popular Bus Routes
        </h2>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items?.length > 0 &&
            items?.map((route: any, index: number) => {
              const [from, to] = route?.routeName
                ?.split("➜")
                .map((s: any) => s.trim());
              return (
                <div
                  key={index}
                  onClick={() => {
                    setBookingState((prevState: any) => ({
                      ...prevState,
                      fromStationId: route?.from,
                      toStationId: route?.to,
                      coachType: "AC",
                      date: new Date(),
                    }));
                    setSearchTriggered(true);
                    // Scroll to top smoothly
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="grid grid-cols-3 justify-items-center cursor-pointer items-center border border-gray-300 bg-white dark:bg-background dark:text-gray-200 rounded-md py-5 px-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col text-gray-800 dark:text-gray-200 text-sm font-medium">
                    <span className="text-base font-semibold">{from}</span>
                  </div>

                  <div className="flex flex-col items-center border-b border-dashed w-16 -mt-2.5">
                    {" "}
                    <svg
                      version="1.0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 512.000000 512.000000"
                      preserveAspectRatio="xMidYMid meet"
                      className="-mb-2"
                    >
                      {" "}
                      <g
                        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#840495"
                        stroke="none"
                      >
                        {" "}
                        <path d="M286 3839 c-142 -49 -244 -164 -275 -309 -9 -40 -11 -257 -9 -820 l3 -765 24 -58 c47 -117 147 -210 268 -247 58 -18 93 -20 317 -20 l252 0 13 -50 c34 -131 157 -252 300 -294 224 -65 460 57 541 282 l23 62 805 -2 805 -3 12 -40 c55 -185 231 -315 425 -315 194 0 370 130 425 315 l12 40 239 5 c267 6 272 7 336 78 59 65 60 83 56 680 -3 487 -2 532 13 532 11 0 29 -28 54 -87 41 -98 71 -133 116 -133 37 0 79 39 79 74 0 26 -102 272 -121 291 -5 5 -48 12 -95 15 l-86 5 -32 87 c-132 352 -454 618 -825 683 -71 13 -341 15 -1850 15 -1750 -1 -1767 -1 -1825 -21z m3715 -170 c52 -15 129 -44 170 -64 68 -34 199 -120 199 -131 0 -2 -945 -4 -2100 -4 -2024 0 -2100 1 -2100 18 0 34 55 126 92 155 73 59 -17 56 1888 54 l1755 -2 96 -26z m-3191 -629 l0 -260 -320 0 -320 0 0 260 0 260 320 0 320 0 0 -260z m958 3 l-3 -258 -392 -3 -393 -2 0 260 0 260 395 0 395 0 -2 -257z m952 -3 l0 -260 -395 0 -395 0 0 260 0 260 395 0 395 0 0 -260z m950 0 l0 -260 -395 0 -395 0 0 260 0 260 395 0 395 0 0 -260z m890 213 c46 -74 91 -189 111 -288 16 -75 19 -136 19 -371 l0 -281 -121 18 -121 17 -218 216 -218 215 -88 3 -89 3 -3 258 -2 257 350 0 350 0 30 -47z m-404 -847 l220 -213 104 -16 c58 -9 129 -19 158 -23 l52 -7 0 -167 c0 -130 -3 -170 -14 -179 -9 -8 -79 -11 -231 -9 l-218 3 -17 51 c-69 201 -281 329 -487 295 -165 -28 -300 -142 -353 -295 l-17 -51 -807 0 -807 0 -18 51 c-20 59 -68 138 -108 176 -52 50 -144 97 -221 114 -65 14 -88 15 -151 5 -173 -27 -317 -151 -366 -316 l-12 -40 -244 0 c-174 0 -255 4 -281 13 -62 22 -114 67 -142 123 l-26 53 0 323 0 323 1883 0 1883 0 220 -214z m-2731 -454 c47 -24 106 -83 130 -132 10 -19 20 -62 23 -96 20 -258 -291 -400 -475 -216 -112 111 -103 302 18 405 23 20 60 43 83 51 57 22 169 15 221 -12z m2498 -5 c198 -116 192 -395 -10 -494 -175 -85 -380 28 -400 222 -13 128 71 255 197 296 14 5 57 7 96 5 56 -2 82 -9 117 -29z" />{" "}
                      </g>{" "}
                    </svg>{" "}
                  </div>
                  <div className="flex flex-col text-gray-800 dark:text-gray-200 text-sm font-medium text-right">
                    <span className="text-base font-semibold">{to}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
