import React, { useEffect, useState } from "react";
import Login from "./Login";
import Signup from "./SignUp";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get("mode");
    setIsLogin(mode !== "signup"); 
  }, [location.search]);

  return (
    <div className={`min-h-screen flex justify-center bg-[#0f0f0f] px-4 text-white pt-35 ${isLogin?"pb-50":"pb-23"}`}>
      <div className="text-center absolute top-12">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <span>🎟️</span> CinemaFlix
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Your premium movie experience awaits
        </p>
      </div>

      <Card className="w-full max-w-md bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-lg">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Welcome</h2>
          <p className="text-sm text-gray-400">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </CardHeader>

        <CardContent>
          {/* Toggle Tabs */}
          <div className="flex mb-6 gap-1">
            <Button
              variant="ghost"
              className={`flex-1 ${isLogin ? "bg-black text-white" : "text-gray-400"}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 ${!isLogin ? "bg-black text-white" : "text-gray-400"}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </Button>
          </div>

          {isLogin ? <Login /> : <Signup />}

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-gray-400 hover:underline">
              ← Back to Movies
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
