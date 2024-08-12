// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

// Define the types for props
interface SidebarProps {
  clickedFixSidebarItem: string;
  isFixSidebarItemClicked:boolean;
}

// Define the type for the icon state
type IconType = React.ReactNode | null;

const ToggleSidebar: React.FC<SidebarProps> = ({ clickedFixSidebarItem ,isFixSidebarItemClicked}) => {
  const [isOpen, setIsOpen] = useState<boolean>(isFixSidebarItemClicked);
  const [isClickedItemVal, setIsClickedItemVal] = useState<string>(clickedFixSidebarItem);
  const [isClickedItemIcon, setIsClickedItemIcon] = useState<IconType>(null);

  useEffect(() => {
    setIsClickedItemVal(clickedFixSidebarItem);
    setIsOpen(isFixSidebarItemClicked)

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
  }, [clickedFixSidebarItem,isFixSidebarItemClicked]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex z-9">
      {/* <ArrowForwardOutlinedIcon
        onClick={toggleSidebar}
        className="absolute hover:cursor-pointer rounded-md bg-slate-300"
        sx={{
          width: "30px",
          height: "30px",
        }}
      /> */}

      <div
        className={`absolute h-[100vh] w-64 bg-slate-200 text-white transition-transform duration-200 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="h-10 flex items-center px-2 border-b text-slate-800 border-slate-400">
            {isClickedItemIcon} <p>{isClickedItemVal}</p>
          </div>
          <ClearIcon
            onClick={toggleSidebar}
            className="absolute text-slate-900 hover:cursor-pointer right-2 top-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ToggleSidebar;
