import { NavLink } from "react-router-dom";
import { FaBrain, FaComments, FaChartBar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navItems = [
    { to: "/dashboard/topics", label: "Browse Topics", icon: FaBrain },
    { to: "/dashboard/debates", label: "My Debates", icon: FaComments },
    { to: "/dashboard/analytics", label: "Analytics", icon: FaChartBar },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className="h-full w-64 p-4 bg-[#131313] shadow-lg z-30">
        {/* Mobile close */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={onClose}>
            <IoClose className="text-2xl text-white" />
          </button>
        </div>

        <a href="/">
          <h1 className="text-2xl font-bold text-white mb-8">Openfloor.</h1>
        </a>

        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-gray-700 ${
                  isActive ? "bg-gray-800 text-purple-400" : "text-white"
                }`
              }
            >
              <Icon className="text-inherit text-xl" />
              <span className="text-inherit">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
