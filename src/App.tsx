import { useState } from "react";
import FixSidebar from "./components/FixSidebar";
import MainContent from "./components/MainContent";
import ToggleSidebar from "./components/ToggleSidebar";

function App() {
  const [clickedFixSidebarItem, setClickedFixSidebarItem] =
    useState<string>("mapsense");
  const [isFixSidebarItemClicked, setIsFixSidebarItemClicked] =
    useState<boolean>(false);
  
    const [zoomValSlider, setZoomValSlider] = useState<number>(17);

  const [radiusData, setRadiusData] = useState<number>(100);

  const handleClickedFixSidebarItem = (val: string) => {
    setClickedFixSidebarItem(val);

    setIsFixSidebarItemClicked(true);
  };

  const handleRadiusChangeClicked = (val: number) => {
    setRadiusData(val);
  };

  const handleZoomValSlider=(val:number)=>{
    setZoomValSlider(val);
  }

  return (
    <div className="flex ">
      <div className="flex">
        <FixSidebar handleClickedFixSidebarItem={handleClickedFixSidebarItem} />
        <ToggleSidebar
          clickedFixSidebarItem={clickedFixSidebarItem}
          isFixSidebarItemClicked={isFixSidebarItemClicked}
          setIsFixSidebarItemClicked={setIsFixSidebarItemClicked}
          handleRadiusChangeClicked={handleRadiusChangeClicked}
          handleZoomValSlider={handleZoomValSlider}  // Add this line to handle zoom value change in MainContent component.  // Note: Replace 'handleZoomValSlider' with your actual function name.  // Also, pass the zoomValSlider value to MainContent component.  // Example: <MainContent zoomValSlider={zoomValSlider} />  // This will pass the zoomValSlider value to the MainContent component.  // Make sure to import and use the MainContent
        />
      </div>
      <MainContent
        isFixSidebarItemClicked={isFixSidebarItemClicked}
        radiusData={radiusData}
        zoomValSlider={zoomValSlider}
      />
    </div>
  );
}

export default App;
