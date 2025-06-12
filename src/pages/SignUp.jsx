import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Registered successfully!");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Register</h2>

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
          placeholder="Password (min 6 chars)"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};


export default SignUp;
