import React from 'react';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

interface FixSidebarProps {
  handleClickedFixSidebarItem: (item: string) => void;
}

const FixSidebar: React.FC<FixSidebarProps> = ({ handleClickedFixSidebarItem }) => {

  const handleClick = (val:string) => {
    
    handleClickedFixSidebarItem(val);
  }

  return (
    <div className="h-[100vh] bg-slate-200 w-14  border-r border-slate-900 z-10 flex flex-col gap-6">
      <div className="mx-auto h-10 w-10 mt-2 rounded-full border border-slate-800"></div>
      
      <div className='text-center flex flex-col gap-2'>
        <div className='hover:cursor-pointer hover:bg-slate-300 py-1' onClick={()=>handleClick('Layers')}>
          <LayersOutlinedIcon fontSize='large' />
          <div className=' text-[12px] mt-[0px] '>Layers</div>
        </div>
        <div className='hover:cursor-pointer hover:bg-slate-300 py-1' onClick={()=>handleClick('Settings')}>
          <SettingsOutlinedIcon fontSize='large' />
          <div className=' text-[12px] mt-[0px]'>Settings</div>
        </div>
      </div>
    </div>
  );
}

export default FixSidebar;
