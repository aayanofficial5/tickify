import { useState } from "react";
import { auth } from "../../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

const Signup = ({ setIsLogin }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: fullName });
      toast.success("Account created successfully!");
      setIsLogin(true);
    } catch (error) {
      toast.error(error.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      {/* Full Name */}
      <div className="relative">
        <User className="absolute left-3 top-2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="pl-10 bg-[#111] border border-gray-700 text-white placeholder-gray-400"
        />
      </div>

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-2 text-gray-400" size={18} />
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="pl-10 bg-[#111] border border-gray-700 text-white placeholder-gray-400"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-2 text-gray-400" size={18} />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="pl-10 pr-10 bg-[#111] border border-gray-700 text-white placeholder-gray-400"
        />
        <div
          className="absolute right-3 top-2 text-gray-400 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </div>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-2 text-gray-400" size={18} />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="pl-10 pr-10 bg-[#111] border border-gray-700 text-white placeholder-gray-400"
        />
        <div
          className="absolute right-3 top-2 text-gray-400 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full btn-gradient hover:opacity-90 transition text-black font-semibold"
      >
        {loading ? "Creating..." : "Create Account"}
      </Button>
    </form>
  );
};

export default Signup;
