import { useAuth } from "../../context/AuthProvider";

const Navbar = () => {
 const { logout } = useAuth();


  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div>
          <button
          onClick={logout}
          className="w-full py-2 text-center transition-all rounded-lg font-semibold"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;

