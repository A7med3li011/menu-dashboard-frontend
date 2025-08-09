import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
// import "./Layout.css"; // Import CSS file

export default function Layout() {
  return (
    <div className="flex  bg-primary">
      <div className="w-[80px] sm:w-[100px] lg:w-[130px]">
        <SideBar />
      </div>
      <main className="  flex-1 text-white  pt-12 px-10  max-w-3xl overflow-hidden  lg:max-w-7xl mx-auto h-[1200px]  overflow-y-scroll scrollbar-hidden ">
        <Outlet />
      </main>
    </div>
  );
}
