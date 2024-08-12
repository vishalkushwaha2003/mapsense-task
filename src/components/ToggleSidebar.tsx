import React, { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

// Define the types for props
interface SidebarProps {
  clickedFixSidebarItem: string;
  isFixSidebarItemClicked: boolean;
  setIsFixSidebarItemClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

// Define the type for the icon state
type IconType = React.ReactNode | null;

const ToggleSidebar: React.FC<SidebarProps> = ({
  clickedFixSidebarItem,
  isFixSidebarItemClicked,
  setIsFixSidebarItemClicked,
}) => {
  const [isClickedItemVal, setIsClickedItemVal] = useState<string>(
    clickedFixSidebarItem
  );
  const [isClickedItemIcon, setIsClickedItemIcon] = useState<IconType>(null);

  useEffect(() => {
    setIsClickedItemVal(clickedFixSidebarItem);

    setIsClickedItemIcon(() => {
      switch (clickedFixSidebarItem.toLowerCase()) {
        case "layers":
          return <LayersOutlinedIcon />;
        case "settings":
          return <SettingsOutlinedIcon />;
        default:
          return null;
      }
    });
  }, [clickedFixSidebarItem]);

  const toggleSidebar = () => {
    setIsFixSidebarItemClicked(!isFixSidebarItemClicked);
  };

  return (
    <div className=" ">
      <div
        className={`absolute z-9 ${
          isFixSidebarItemClicked ? "border-r border-slate-600" : ""
        } h-[100vh] w-64 bg-slate-200 text-white transition-transform duration-200 transform ${
          isFixSidebarItemClicked ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div >
          <div className="h-10 flex items-center px-2 border-b text-slate-800 border-slate-400">
            {isClickedItemIcon} <p className="font-medium">{isClickedItemVal}</p>
          </div>
          <ClearIcon
            onClick={toggleSidebar}
            className="absolute text-slate-900 hover:cursor-pointer hover:bg-slate-300 duration-200 right-2 top-2"
          />

          
        </div>
      </div>
    </div>
  );
};

export default ToggleSidebar;
