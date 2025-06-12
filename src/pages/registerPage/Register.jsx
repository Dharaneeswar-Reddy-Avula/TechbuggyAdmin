import { useState } from "react";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { adminRegister,mailToNewAdmin } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
const AdminRegister = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(adminRegister({ name, email, password, role }))
      .unwrap()
      .then(() => {
        onClose();
        dispatch(mailToNewAdmin({email,password}));
      })
      .catch(() => {});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex z-50 items-center justify-center bg-gray-800 bg-opacity-50">
      <div>
        <ToastContainer position="top-center" />
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Admin Register
        </h2>
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input
              type="text"
              placeholder="Enter role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" size={20} />
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
