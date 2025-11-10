import logo from "../assets/final logo-03.png";
import offerIcon from "../assets/discount.png";
import logoutIcon from "../assets/logout-outlined.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Layers, Package, BookOpen, MessageSquare } from "lucide-react";

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user.user);

  const routes = [
    {
      title: "Menu Display",
      icon: "BookOpen",
      link: "/menu",
      access: ["admin"],
    },
    {
      title: "Categories",
      icon: "Menu",
      link: "/categories",
      access: ["admin"],
    },

    {
      title: "Products",
      icon: "Package",
      link: "/products",
      access: ["admin"],
    },
    {
      title: "Reviews",
      icon: "MessageSquare",
      link: "/reviews",
      access: ["admin"],
    },
    {
      title: "Offers",
      icon: offerIcon,
      link: "/offer",
      access: ["admin"],
    },
  ];

  return (
    <div className="bg-secondary text-white px-4 pb-3 h-[1200px] overflow-hidden w-full flex flex-col">
      <div className=" mb-5">
        <img className="w-full" src={logo} />
      </div>

      {/* Navigation items - takes remaining space */}
      <div className="flex-1 flex flex-col">
        {routes.map(
          (ele, index) =>
            ele.access.includes(user.role) && (
              <div
                onClick={() => navigate(ele.link)}
                key={index}
                className="flex flex-col justify-center items-center cursor-pointer hover:bg-opacity-80 transition-all duration-200 py-2 mb-6"
              >
                {ele.icon === "BookOpen" ? (
                  <BookOpen
                    className={`mb-2 w-[30px] h-[30px] transition-all duration-300 ease-in-out ${
                      location.pathname === ele.link
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  />
                ) : ele.icon === "Menu" ? (
                  <Menu
                    className={`mb-2 w-[30px] h-[30px] transition-all duration-300 ease-in-out ${
                      location.pathname === ele.link
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  />
                ) : ele.icon === "Layers" ? (
                  <Layers
                    className={`mb-2 w-[30px] h-[30px] transition-all duration-300 ease-in-out ${
                      location.pathname === ele.link
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  />
                ) : ele.icon === "Package" ? (
                  <Package
                    className={`mb-2 w-[30px] h-[30px] transition-all duration-300 ease-in-out ${
                      location.pathname === ele.link
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  />
                ) : ele.icon === "MessageSquare" ? (
                  <MessageSquare
                    className={`mb-2 w-[30px] h-[30px] transition-all duration-300 ease-in-out ${
                      location.pathname === ele.link
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  />
                ) : (
                  <img
                    src={ele.icon}
                    alt="icon"
                    className={`mb-2 w-[30px] lg:w-[30px] transition-all duration-300 ease-in-out ${
                      location.pathname === ele.link
                        ? "filter brightness-0 invert"
                        : ""
                    }`}
                  />
                )}
                <p className={`text-sm text-center`}>{ele.title}</p>
              </div>
            )
        )}
      </div>

      {/* Logout button - stays at bottom */}
      <div
        onClick={() => {
          localStorage.removeItem("patriaUser");
          navigate("/login");
        }}
        className="flex flex-col items-center cursor-pointer hover:bg-opacity-80 transition-all duration-200 py-2 mb-6 mt-auto"
      >
        <img
          src={logoutIcon}
          alt="icon"
          className="mb-2 w-[30px] lg:w-[30px]"
        />
        <p className="text-sm text-center">Logout</p>
      </div>
    </div>
  );
}
