import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import api from "../../api/axios";

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [rolesList, setRolesList] = useState([]); // All roles for selection
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    roles: [],
  });



  const [editingUser, setEditingUser] = useState(null);

  // Fetch users and roles
  const fetchUsersAndRoles = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        api.get("/users", { withCredentials: true }),
        api.get("/admin/roles", { withCredentials: true }),
      ]);

      // Ensure roles are always arrays
      const normalizedUsers = usersRes.data.map((u) => ({
        ...u,
        roles: Array.isArray(u.roles) ? u.roles : [],
      }));

      setUsers(normalizedUsers);
      setRolesList(rolesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  // Create user
  const handleCreate = async () => {
    try {
      const payload = {
        ...newUser,
        roles: rolesList
          .filter((r) => (newUser.roles || []).includes(r.name))
          .map((r) => r._id),
      };

      await api.post("/users/register", payload, { withCredentials: true });
      setNewUser({ name: "", email: "", password: "", roles: [] });
      fetchUsersAndRoles();
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  // Update user
  // Update user
const handleUpdate = async () => {
  try {
    // Convert role names → role IDs before sending
    const payload = {
      ...editingUser,
      roles: rolesList
        .filter((r) => (editingUser.roles || []).includes(r.name))
        .map((r) => r._id),
    };

    await api.put(`/users/${editingUser._id}`, payload, {
      withCredentials: true,
    });

    setEditingUser(null);
    fetchUsersAndRoles();
  } catch (err) {
    alert(err.response?.data?.message || "Update failed");
  }
};


  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/users/${id}`, { withCredentials: true });
      fetchUsersAndRoles();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // Assign roles
  const handleAssignRoles = async () => {
    try {
      const roleIds = rolesList
        .filter((r) => (editingUser.roles || []).includes(r.name))
        .map((r) => r._id);

      await api.put(
        `/users/${editingUser._id}/assign-roles`,
        { roles: roleIds },
        { withCredentials: true }
      );

      setEditingUser(null);
      fetchUsersAndRoles();
    } catch (err) {
      alert(err.response?.data?.message || "Assign roles failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Users Management</h1>

      {/* Create User Form */}
      {user.permissions.includes("user.create") && !editingUser && (
        <div className="mb-4 border p-4 rounded bg-gray-50">
          <h2 className="font-semibold">Create New User</h2>
          <input
            className="border p-1 m-1"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({ ...newUser, name: e.target.value })
            }
          />
          <input
            className="border p-1 m-1"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
          />
          <input
            type="password"
            className="border p-1 m-1"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />

          {/* Roles checkboxes */}
          <div className="my-2">
            <h3 className="font-semibold">Assign Roles</h3>
            {rolesList.map((r) => (
              <label key={r._id} className="mr-2">
                <input
                  type="checkbox"
                  checked={(newUser.roles || []).includes(r.name)}
                  onChange={() => {
                    const currentRoles = newUser.roles || [];
                    const updatedRoles = currentRoles.includes(r.name)
                      ? currentRoles.filter((role) => role !== r.name)
                      : [...currentRoles, r.name];
                    setNewUser({ ...newUser, roles: updatedRoles });
                  }}
                  className="mr-1"
                />
                {r.name}
              </label>
            ))}
          </div>

          <button
            className="bg-green-500 text-white p-1 rounded"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      )}

      {/* Edit User Form */}
      {editingUser && user.permissions.includes("user.edit") && (
        <div className="mb-4 border p-4 rounded bg-yellow-50">
          <h2 className="font-semibold">Edit User</h2>
          <input
            className="border p-1 m-1"
            placeholder="Name"
            value={editingUser.name || ""}
            onChange={(e) =>
              setEditingUser({ ...editingUser, name: e.target.value })
            }
          />
          <input
            className="border p-1 m-1"
            placeholder="Email"
            value={editingUser.email || ""}
            onChange={(e) =>
              setEditingUser({ ...editingUser, email: e.target.value })
            }
          />
          <input
            type="password"
            className="border p-1 m-1"
            placeholder="Password"
            onChange={(e) =>
              setEditingUser({ ...editingUser, password: e.target.value })
            }
          />

          {/* Roles checkboxes */}
          <div className="my-2">
            <h3 className="font-semibold">Assign Roles</h3>
            {rolesList.map((r) => (
              <label key={r._id} className="mr-2">
                <input
                  type="checkbox"
                  checked={(editingUser.roles || []).includes(r.name)}
                  onChange={() => {
                    const currentRoles = editingUser.roles || [];
                    const updatedRoles = currentRoles.includes(r.name)
                      ? currentRoles.filter((role) => role !== r.name)
                      : [...currentRoles, r.name];
                    setEditingUser({ ...editingUser, roles: updatedRoles });
                  }}
                  className="mr-1"
                />
                {r.name}
              </label>
            ))}
            <button
              className="bg-blue-500 text-white p-1 rounded ml-2"
              onClick={handleAssignRoles}
            >
              Assign Roles
            </button>
          </div>

          <button
            className="bg-blue-500 text-white p-1 rounded"
            onClick={handleUpdate}
          >
            Update
          </button>
          <button
            className="bg-gray-400 text-white p-1 rounded ml-2"
            onClick={() => setEditingUser(null)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Users Table */}
      <table className="border-collapse border w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Roles</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{(u.roles || []).join(", ")}</td>
              <td className="p-2">
                {user.permissions.includes("user.edit") && (
                  <button
                    className="bg-yellow-500 text-white p-1 rounded mr-2"
                    onClick={() => setEditingUser({ ...u })}
                  >
                    Edit
                  </button>
                )}
                {user.permissions.includes("user.delete") && (
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => handleDelete(u._id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
