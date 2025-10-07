// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import api from "../api/axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);       // logged-in user
//   const [loading, setLoading] = useState(true); // /me fetch status

//   const fetchUser = async () => {
//     try {
//       const res = await api.get("/users/me", {
//         withCredentials: true, // cookie/token automatically sent
//       });


//       setUser(res.data.user);  // user set
//     } catch (err) {
//       setUser(null);
//     } finally {
//       setLoading(false);       // fetch finished
//     }
//   };

//   useEffect(() => {
//     fetchUser();               // app load এ fetch
//   }, []);
//  const logout = async () => {
//     try {
//       await api.post("/auth/logout");
//     } catch (err) {
//       console.error("Logout error:", err);
//     } finally {
//       setUser(null);
//       setToken(null);
//       localStorage.removeItem("token");
//       delete api.defaults.headers.common["Authorization"];
//       window.location.href = "/login";
//     }
//   };
//   return (
//     <AuthContext.Provider value={{ user, setUser, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // logged-in user
  const [loading, setLoading] = useState(true); // /me fetch status

  const fetchUser = async () => {
    try {
      const res = await api.get("/users/me", {
        withCredentials: true, // cookie/token automatically sent
      });
      setUser(res.data.user);  // user set
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);       // fetch finished
    }
  };

  useEffect(() => {
    fetchUser();               // app load এ fetch
  }, []);

  // ✅ Fixed logout (no setToken)
  const logout = async () => {
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
