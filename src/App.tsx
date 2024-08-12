import React, { useState } from "react";
import FixSidebar from "./components/FixSidebar";
import MainContent from "./components/MainContent";
import ToggleSidebar from "./components/ToggleSidebar";

// Define the type for the FixSidebar props
interface FixSidebarProps {
  handleClickedFixSidebarItem: (val: string) => void;
}

// Define the type for the ToggleSidebar props
interface ToggleSidebarProps {
  clickedFixSidebarItem: string;
  isFixSidebarItemClicked: boolean;
}

function App() {
  const [clickedFixSidebarItem, setClickedFixSidebarItem] =
    useState<string>("mapsense");
  const [isFixSidebarItemClicked, setIsFixSidebarItemClicked] =
    useState<boolean>(false);

  const handleClickedFixSidebarItem = (val: string) => {
    setClickedFixSidebarItem(val);
    if (!isFixSidebarItemClicked) {
      setIsFixSidebarItemClicked(true);
    }
  };

  return (
    <div className="flex">
      <div className="flex">
        <FixSidebar handleClickedFixSidebarItem={handleClickedFixSidebarItem} />
        <ToggleSidebar
          clickedFixSidebarItem={clickedFixSidebarItem}
          isFixSidebarItemClicked={isFixSidebarItemClicked}
        />
      </div>
      <MainContent />
    </div>
  );
}

export default App;
