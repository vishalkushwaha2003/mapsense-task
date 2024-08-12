// src/components/Sidebar.tsx
import React, { useState } from 'react';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ClearIcon from '@mui/icons-material/Clear';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
    
       
       
     
      <ArrowForwardOutlinedIcon
       onClick={toggleSidebar}
       className=" text-white rounded-md bg-slate-400/30 "
      
      />
      

      <div
        className={`absolute h-[100vh] w-64 bg-gray-800 text-white transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
       <ClearIcon
         onClick={toggleSidebar}
       />
      </div>

      <div className="flex-1 p-4">
        <h1 className="text-2xl">Main Content Area</h1>
        <p>This is where the main content will go.</p>
      </div>
    </div>
  );
};

export default Sidebar;
