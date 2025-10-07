import { useState, useContext } from "react";
import api from "../../api/axios";
// import { AuthContext } from "../../context/AuthContext";
// import api from "../api/axios";
import { AuthProvider } from "../../context/AuthProvider";

const Register = () => {
  const { setUser } = useContext(AuthProvider);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/register", { name, email, password });
      setUser(res.data.user);
      alert("Registration successful!");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-2 w-80 mx-auto mt-10">
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border p-2 rounded"/>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded"/>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2 rounded"/>
      <button type="submit" className="bg-green-500 text-white p-2 rounded">Register</button>
    </form>
  );
};

export default Register;
