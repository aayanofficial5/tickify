import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";

const Login = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      let admin = false;
      // 🔐 Check admin permission if it's an admin route
      if (isAdmin) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || userDoc.data()?.admin !== "true") {
          await signOut(auth);
          toast.error("Access denied. Admins only.");
          navigate("/auth?mode=login");
          return;
        }
        admin = true;
      }

      const {
        uid: id,
        email: userEmail,
        displayName,
        photoURL,
        emailVerified,
      } = user;

      const userData = {
        id,
        email: userEmail,
        displayName,
        photoURL,
        emailVerified,
        admin,
      };

      dispatch(login({ user: userData, token: await user.getIdToken(true) }));

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {/* Email Input */}
      <div className="relative">
        <Mail className="absolute left-3 top-2 text-gray-400" size={18} />
        <Input
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 bg-[#111] border border-gray-700 text-white placeholder-gray-400"
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <Lock className="absolute left-3 top-2 text-gray-400" size={18} />
        <Input
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 pr-10 bg-[#111] border border-gray-700 text-white placeholder-gray-400"
        />
        <div
          className="absolute right-3 top-2 text-gray-400 cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </div>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full btn-gradient hover:opacity-90 transition !text-black font-semibold"
      >
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default Login;
