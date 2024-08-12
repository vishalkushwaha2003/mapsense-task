import React from "react";
import MainMap from "./MainMap";

interface MainContentProps {
  isFixSidebarItemClicked: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  isFixSidebarItemClicked,
}) => {
  return (
    <div
      className={` transition-all duration-200  ${
        isFixSidebarItemClicked ? "w-[calc(100vw-256px)] ml-[256px]  " : "w-full "
      }`}
    >
      <MainMap />
    </div>
  );
};

export default MainContent;
