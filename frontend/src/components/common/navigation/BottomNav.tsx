import { Link } from "react-router-dom";
import { FaList, FaUser } from "react-icons/fa";
import { RiFindReplaceLine } from "react-icons/ri";
import { BsLifePreserver } from "react-icons/bs";

const BottomNav = () => {
  return (
    <div className="fixed z-40 bottom-0 w-full bg-white text-primary text-center flex justify-between px-4 items-center py-2 border-t border-gray-500">
      {/* Pre-Order Section */}
      {/* Account Section */}
      <Link to="/profile/my-profile" className="flex flex-col items-center">
        <FaUser size={20} className="" />
        <span className=" text-xs font-semibold">Account</span>
      </Link>

      {/* Compare Section */}
      <Link to={"/profile/order-list"}>
        {" "}
        <div className="relative flex flex-col items-center" title="Compare">
          <FaList size={20} className="" />
          <span className=" text-xs font-semibold">Order List</span>
        </div>
      </Link>
      <Link to="/search_tickit" className="flex flex-col items-center">
        <RiFindReplaceLine className="text-2xl" />
        <span className="text-xs font-semibold">Find Ticket</span>
      </Link>
      <Link to="/reserve" className="flex flex-col items-center">
        <BsLifePreserver className="text-xl" />
        <span className="text-xs font-semibold">Reserve</span>
      </Link>
    </div>
  );
};

export default BottomNav;
