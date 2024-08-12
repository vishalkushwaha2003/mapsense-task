import React from 'react';

interface MainContentProps {
  isFixSidebarItemClicked: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ isFixSidebarItemClicked }) => {
  return (
    <div
      className={`transition-all duration-200 ${
        isFixSidebarItemClicked ? 'w-[calc(100vw-256px)] ml-[256px] ' : 'w-full'
      }`}
    >
      rergeg
    </div>
  );
};

export default MainContent;
