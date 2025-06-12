import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (error) {
      toast.error(error.message||"Invalid credentials or user not found.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
