import React from "react";
import MainMap from "./MainMap";

interface MainContentProps {
  isFixSidebarItemClicked: boolean;
  radiusData: number;
}

const MainContent: React.FC<MainContentProps> = ({
  isFixSidebarItemClicked,
  radiusData,
}) => {
  return (
    <div
      className={` transition-all duration-200  ${
        isFixSidebarItemClicked
          ? "w-[calc(100vw-256px)] ml-[256px]  "
          : "w-full "
      }`}
    >
      <MainMap radiusData={radiusData} />
    </div>
  );
};

export default MainContent;
