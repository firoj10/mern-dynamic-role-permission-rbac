import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthProvider";

// Small reusable badge component
const PermissionBadge = ({ name }) => (
  <span className="inline-block text-xs font-medium px-2 py-0.5 mr-2 mb-2 rounded-full border bg-white/40">
    {name}
  </span>
);

// Group permissions by module for organized UI
const groupPermissions = (permissions) => {
  const grouped = {};
  permissions.forEach((perm) => {
    const key = perm.module || perm.group || "General";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(perm);
  });
  return grouped;
};

const Roles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });
  const [editing, setEditing] = useState(null);

  // Fetch roles and permissions from API
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const [rolesRes, permRes] = await Promise.all([
        api.get("/admin/roles", { withCredentials: true }),
        api.get("/admin/permissions", { withCredentials: true }),
      ]);

      setRoles(rolesRes.data.items || rolesRes.data || []);
      setPermissions(permRes.data.items || permRes.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Create new role
  const handleCreate = async () => {
    if (!newRole.name) return alert("Role name is required");
    try {
      await api.post("/admin/roles", newRole, { withCredentials: true });
      setNewRole({ name: "", permissions: [] });
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  // Update existing role
  const handleUpdate = async () => {
    if (!editing.name) return alert("Role name is required");
    try {
      await api.put(`/admin/roles/${editing._id}`, editing, {
        withCredentials: true,
      });
      setEditing(null);
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // Delete role
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await api.delete(`/admin/roles/${id}`, { withCredentials: true });
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // Toggle permission checkbox
  const togglePermission = (permId, roleObj, setRoleFn) => {
    const exists = roleObj.permissions.includes(permId);
    const updated = exists
      ? roleObj.permissions.filter((id) => id !== permId)
      : [...roleObj.permissions, permId];
    setRoleFn({ ...roleObj, permissions: updated });
  };

  // Prepare grouped permission list
  const groupedPermissions = groupPermissions(permissions);

  // When editing starts, normalize permission IDs
  const startEditing = (role) => {
    // Some APIs return populated permissions (array of objects)
    const normalizedPermissions = role.permissions.map((p) =>
      typeof p === "string" ? p : p._id
    );
    setEditing({ ...role, permissions: normalizedPermissions });
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        <h1 className="text-2xl font-semibold mb-2">Roles Management</h1>
        <p>Loading data...</p>
      </div>
    );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800">
          Roles Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage user roles and assign permissions easily.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Create or Edit */}
        <div className="lg:col-span-1 space-y-6">
          {/* Create Role */}
          {user.permissions.includes("role.create") && !editing && (
            <div className="bg-white shadow-sm rounded-lg border p-5">
              <h2 className="text-lg font-semibold mb-3 text-slate-800">
                Create Role
              </h2>

              <input
                placeholder="Role Name"
                value={newRole.name}
                onChange={(e) =>
                  setNewRole({ ...newRole, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-600">
                  Assign Permissions
                </label>

                {/* Grouped Permissions */}
                {Object.keys(groupedPermissions).map((group) => (
                  <div
                    key={group}
                    className="mb-4 border rounded-lg p-3 bg-slate-50"
                  >
                    <h4 className="text-sm font-semibold text-slate-700 mb-2 border-b pb-1">
                      {group}
                    </h4>
                    <div className="flex flex-wrap">
                      {groupedPermissions[group].map((p) => (
                        <label
                          key={p._id}
                          className="inline-flex items-center mr-3 mb-2 cursor-pointer px-2 py-1 rounded border bg-white"
                        >
                          <input
                            type="checkbox"
                            checked={newRole.permissions.includes(p._id)}
                            onChange={() =>
                              togglePermission(p._id, newRole, setNewRole)
                            }
                            className="mr-2 accent-slate-700"
                          />
                          <span className="text-sm">{p.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCreate}
                disabled={!newRole.name}
                className={`w-full mt-3 py-2 rounded text-white font-medium ${
                  newRole.name
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Create Role
              </button>
            </div>
          )}

          {/* Edit Role */}
          {editing && user.permissions.includes("role.edit") && (
            <div className="bg-white shadow-sm rounded-lg border p-5">
              <h2 className="text-lg font-semibold mb-3 text-slate-800">
                Edit Role
              </h2>

              <input
                placeholder="Role Name"
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-600">
                  Permissions
                </label>
                {Object.keys(groupedPermissions).map((group) => (
                  <div
                    key={group}
                    className="mb-4 border rounded-lg p-3 bg-slate-50"
                  >
                    <h4 className="text-sm font-semibold text-slate-700 mb-2 border-b pb-1">
                      {group}
                    </h4>
                    <div className="flex flex-wrap">
                      {groupedPermissions[group].map((p) => (
                        <label
                          key={p._id}
                          className="inline-flex items-center mr-3 mb-2 cursor-pointer px-2 py-1 rounded border bg-white"
                        >
                          <input
                            type="checkbox"
                            checked={editing.permissions.includes(p._id)}
                            onChange={() =>
                              togglePermission(p._id, editing, setEditing)
                            }
                            className="mr-2 accent-blue-600"
                          />
                          <span className="text-sm">{p.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 py-2 rounded border bg-white text-slate-700 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Roles List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">All Roles</h2>
            <span className="text-sm text-slate-500">
              Total: {roles.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.length > 0 ? (
              roles.map((r) => (
                <div
                  key={r._id}
                  className="bg-white border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-slate-800">
                        {r.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        ID: {r._id}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {user.permissions.includes("role.edit") && (
                        <button
                          onClick={() => startEditing(r)}
                          className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-500 text-white text-sm"
                        >
                          Edit
                        </button>
                      )}
                      {user.permissions.includes("role.delete") && (
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    {r.permissions?.length ? (
                      <div className="flex flex-wrap">
                        {r.permissions.map((p) => (
                          <PermissionBadge
                            key={typeof p === "string" ? p : p._id}
                            name={p.name || p}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        No permissions assigned
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center p-6 bg-white border rounded text-slate-500">
                No roles found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;
