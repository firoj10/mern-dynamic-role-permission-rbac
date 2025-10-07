import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import api from "../../api/axios";

const Posts = () => {
  const { user, loading } = useAuth(); // loading flag যোগ করলাম
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts", { withCredentials: true });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading) fetchPosts();
  }, [loading]);

  // Create
  const handleCreate = async () => {
    try {
      await api.post("/posts", newPost, { withCredentials: true });
      setNewPost({ title: "", content: "" });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }
  };

  // Update
  const handleUpdate = async () => {
    try {
      await api.put(`/posts/${editingPost._id}`, editingPost, { withCredentials: true });
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/posts/${id}`, { withCredentials: true });
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // 🔹 Loading or no user yet
  if (loading || !user) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Posts Management</h1>

      {/* Create Post Form */}
      {user?.permissions?.includes("post.create") && !editingPost && (
        <div className="mb-4 border p-4 rounded bg-gray-50">
          <h2 className="font-semibold">Create New Post</h2>
          <input
            className="border p-1 m-1 w-full"
            placeholder="Title"
            value={newPost.title}
            onChange={e => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            className="border p-1 m-1 w-full"
            placeholder="Content"
            value={newPost.content}
            onChange={e => setNewPost({ ...newPost, content: e.target.value })}
          ></textarea>
          <button className="bg-green-500 text-white p-1 rounded" onClick={handleCreate}>Create</button>
        </div>
      )}

      {/* Edit Post Form */}
      {editingPost && user?.permissions?.includes("post.edit") && (
        <div className="mb-4 border p-4 rounded bg-yellow-50">
          <h2 className="font-semibold">Edit Post</h2>
          <input
            className="border p-1 m-1 w-full"
            placeholder="Title"
            value={editingPost.title}
            onChange={e => setEditingPost({ ...editingPost, title: e.target.value })}
          />
          <textarea
            className="border p-1 m-1 w-full"
            placeholder="Content"
            value={editingPost.content}
            onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
          ></textarea>
          <button className="bg-blue-500 text-white p-1 rounded" onClick={handleUpdate}>Update</button>
          <button className="bg-gray-400 text-white p-1 rounded ml-2" onClick={() => setEditingPost(null)}>Cancel</button>
        </div>
      )}

      {/* Posts Table */}
      <table className="border-collapse border w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Title</th>
            <th className="p-2">Content</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p._id} className="border-b">
              <td className="p-2">{p.title}</td>
              <td className="p-2">{p.content}</td>
              <td className="p-2">
                {user?.permissions?.includes("post.edit") && (
                  <button className="bg-yellow-500 text-white p-1 rounded mr-2" onClick={() => setEditingPost(p)}>Edit</button>
                )}
                {user?.permissions?.includes("post.delete") && (
                  <button className="bg-red-500 text-white p-1 rounded" onClick={() => handleDelete(p._id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Posts;
