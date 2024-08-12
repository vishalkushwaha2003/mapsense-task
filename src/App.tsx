import FixSidebar from "./components/FixSidebar"
import Sidebar from "./components/ToggleSidebar"


function App() {
  return (
    <div className="bg-red-700">
     <div className="flex">
     <FixSidebar/>
     <Sidebar/>
     </div>

    </div>
  )
}

export default App
