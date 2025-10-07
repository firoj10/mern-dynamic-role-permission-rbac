import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthProvider";

const Permissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPerm, setNewPerm] = useState({ name: "", description: "", module: "" });
  const [editing, setEditing] = useState(null);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/permissions", { withCredentials: true });
      // backend থেকে pagination object আসছে → items use করতে হবে
      setPermissions(res.data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => { fetchPermissions(); }, []);

  const handleCreate = async () => {
    if (!newPerm.name) return alert("Name required");
    try {
      await api.post("/admin/permissions", newPerm, { withCredentials: true });
      setNewPerm({ name: "", description: "", module: "" });
      fetchPermissions();
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  const handleUpdate = async () => {
    if (!editing.name) return alert("Name required");
    try {
      await api.put(`/admin/permissions/${editing._id}`, editing, { withCredentials: true });
      setEditing(null);
      fetchPermissions();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/admin/permissions/${id}`, { withCredentials: true });
      fetchPermissions();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  console.log("User permissions:", user?.permissions);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Permissions Management</h1>

      {/* Create Form */}
      {user.permissions.includes("permission.create") && !editing && (
      <div className="mb-4 border p-4 rounded bg-gray-50">
        <h2 className="font-semibold">Create Permission</h2>
        <input placeholder="Name" value={newPerm.name} onChange={e => setNewPerm({ ...newPerm, name: e.target.value })} className="border p-1 m-1 w-full" />
        <input placeholder="Description" value={newPerm.description} onChange={e => setNewPerm({ ...newPerm, description: e.target.value })} className="border p-1 m-1 w-full" />
        <input placeholder="Module" value={newPerm.module} onChange={e => setNewPerm({ ...newPerm, module: e.target.value })} className="border p-1 m-1 w-full" />
        <button className="bg-green-500 text-white p-1 rounded" onClick={handleCreate}>Create</button>
      </div>
      )} 

      {/* Edit Form */}
      {editing && user?.permissions?.includes("permission.view") && (
        <div className="mb-4 border p-4 rounded bg-yellow-50">
          <h2 className="font-semibold">Edit Permission</h2>
          <input placeholder="Name" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="border p-1 m-1 w-full" />
          <input placeholder="Description" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} className="border p-1 m-1 w-full" />
          <input placeholder="Module" value={editing.module} onChange={e => setEditing({ ...editing, module: e.target.value })} className="border p-1 m-1 w-full" />
          <button className="bg-blue-500 text-white p-1 rounded" onClick={handleUpdate}>Update</button>
          <button className="bg-gray-400 text-white p-1 rounded ml-2" onClick={() => setEditing(null)}>Cancel</button>
        </div>
      )}

      {/* Table */}
      <table className="border-collapse border w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Module</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map(p => (
            <tr key={p._id} className="border-b">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.description}</td>
              <td className="p-2">{p.module}</td>
              <td className="p-2">
                {user?.permissions.includes("permission.edit") && (
                  <button onClick={() => setEditing(p)}>Edit</button>
                )}
                {user?.permissions.includes("permission.delete") && (
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                )}



              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Permissions;
