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
    <div className="flex z-9">
    
       
       
     
      <ArrowForwardOutlinedIcon
       onClick={toggleSidebar}
       className="absolute hover:cursor-pointer   rounded-md bg-slate-300 "
       sx={{
        width:'30px',
        height:'30px',
       }}
      
      />
      

      <div
        className={`absolute h-[100vh] w-64 bg-slate-200 text-white transition-transform duration-200 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
       <ClearIcon
         onClick={toggleSidebar}
         className='absolute hover:cursor-pointer right-2 top-2'
       />
      </div>

      
    </div>
  );
};

export default Sidebar;
