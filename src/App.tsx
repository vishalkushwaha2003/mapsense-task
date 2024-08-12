import  { useState } from "react";
import FixSidebar from "./components/FixSidebar";
import MainContent from "./components/MainContent";
import ToggleSidebar from "./components/ToggleSidebar";



function App() {
  const [clickedFixSidebarItem, setClickedFixSidebarItem] =
    useState<string>("mapsense");
  const [isFixSidebarItemClicked, setIsFixSidebarItemClicked] =
    useState<boolean>(false);

  const handleClickedFixSidebarItem = (val: string) => {
    setClickedFixSidebarItem(val);
    
      setIsFixSidebarItemClicked(true);
    
  };

  return (
    <div className="flex ">
      <div className="flex">
        <FixSidebar handleClickedFixSidebarItem={handleClickedFixSidebarItem} />
        <ToggleSidebar
          clickedFixSidebarItem={clickedFixSidebarItem}
          isFixSidebarItemClicked={isFixSidebarItemClicked}
          setIsFixSidebarItemClicked={setIsFixSidebarItemClicked}
        />
      </div>
      <MainContent isFixSidebarItemClicked={isFixSidebarItemClicked}/>
    </div>
  );
}

export default App;
