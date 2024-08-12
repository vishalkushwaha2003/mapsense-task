import FixSidebar from "./components/FixSidebar"
import MainContent from "./components/MainContent"
import Sidebar from "./components/ToggleSidebar"


function App() {
  return (
    <div className=" flex">
     <div className="flex">
     <FixSidebar/>
     <Sidebar/>
     </div>
     <MainContent/>

    </div>
  )
}

export default App
