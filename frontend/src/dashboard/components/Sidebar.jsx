// components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", permission: null, icon: "📊" },
  { name: "Posts", path: "/dashboard/posts", permission: "post.view", icon: "📝" },
  { name: "Users", path: "/dashboard/users", permission: "user.view", icon: "👥" },
  { name: "Permissions", path: "/dashboard/permissions", permission: "permission.view", icon: "🔑" },
  { name: "Roles", path: "/dashboard/roles", permission: "role.view", icon: "🛡️" },
];

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-5 text-2xl font-bold tracking-wide text-center border-b border-gray-700">
        Admin Panel
      </div>

      {/* Menu */}
      <ul className="flex flex-col p-3 mt-2 space-y-1">
        {menuItems.map(
          (item) =>
            (!item.permission || user?.permissions.includes(item.permission)) && (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            )
        )}
      </ul>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-gray-700 text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} MyApp
      </div>
    </aside>
  );
};

export default Sidebar;
