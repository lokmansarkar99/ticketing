import circleimage from "../../assets/Loading Bus-01.png";
import busImage from "../../assets/Loading Bus-02.png";
import "./HomeLoader.css";

const HomeLoader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen pb-20 bg-gray-100 dark:bg-background">
      <div className="main animate-pulse">
        {/* Rotating Circle */}
        <div className="circle">
          <img src={circleimage} alt="circle" className="circle-image" />
        </div>
        {/* Rotating Bus Outside Circle */}
        <div className="bus-container">
          <img src={busImage} alt="bus" className="bus-image" />
        </div>
      </div>
    </div>
  );
};

export default HomeLoader;
