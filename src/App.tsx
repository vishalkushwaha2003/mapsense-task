import { useState } from "react";
import FixSidebar from "./components/FixSidebar";
import MainContent from "./components/MainContent";
import ToggleSidebar from "./components/ToggleSidebar";

function App() {
  const [clickedFixSidebarItem, setClickedFixSidebarItem] =
    useState<string>("mapsense");
  const [isFixSidebarItemClicked, setIsFixSidebarItemClicked] =
    useState<boolean>(false);

  const [radiusData, setRadiusData] = useState<number>(500);

  const handleClickedFixSidebarItem = (val: string) => {
    setClickedFixSidebarItem(val);

    setIsFixSidebarItemClicked(true);
  };

  const handleRadiusChangeClicked = (val: number) => {
    setRadiusData(val);
  };

  return (
    <div className="flex ">
      <div className="flex">
        <FixSidebar handleClickedFixSidebarItem={handleClickedFixSidebarItem} />
        <ToggleSidebar
          clickedFixSidebarItem={clickedFixSidebarItem}
          isFixSidebarItemClicked={isFixSidebarItemClicked}
          setIsFixSidebarItemClicked={setIsFixSidebarItemClicked}
          handleRadiusChangeClicked={handleRadiusChangeClicked}
        />
      </div>
      <MainContent
        isFixSidebarItemClicked={isFixSidebarItemClicked}
        radiusData={radiusData}
      />
    </div>
  );
}

export default App;
