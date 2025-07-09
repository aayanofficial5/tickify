import React, { useEffect, useState } from "react";
import Login from "./Login";
import Signup from "./SignUp";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import icon  from "@/assets/icon.png";

const Auth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    const isAdmin = location.pathname === "/admin";
    setIsAdminRoute(isAdmin);

    if (isAdmin) {
      setIsLogin(true); // force login for admin
    } else {
      const queryParams = new URLSearchParams(location.search);
      const mode = queryParams.get("mode");
      setIsLogin(mode !== "signup");
    }
  }, [location]);

  return (
    <div
      className={`min-h-screen flex justify-center bg-[#0f0f0f] px-4 text-white pt-35 ${
        isLogin ? "pb-50" : "pb-23"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-2 absolute top-13">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <img src={icon} alt="" className="h-8" />
          <span className="text-gradient text-4xl">Tickify</span>
        </Link>
        <p className="text-sm text-gray-400 mt-1">
          {isAdminRoute
            ? "Admin login panel"
            : "Your premium movie experience awaits"}
        </p>
      </div>

      <Card className="w-full max-w-md bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-lg">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">
            {isAdminRoute ? "Admin Login" : "Welcome"}
          </h2>
          <p className="text-sm text-gray-400">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </CardHeader>

        <CardContent>
          {/* Toggle Tabs (hide if admin route) */}
          {!isAdminRoute && (
            <div className="flex mb-6 p-2 gap-1 rounded-3xl bg-cinema-border">
              <Button
                variant="ghost"
                className={`flex-1 rounded-2xl ${
                  isLogin
                    ? "bg-black hover:bg-black  text-white"
                    : "text-gray-400 hover:bg-cinema-dark/50"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </Button>

              <Button
                variant="ghost"
                className={`flex-1 rounded-2xl ${
                  !isLogin
                    ? "bg-black text-white hover:bg-black"
                    : "text-gray-400 hover:bg-cinema-dark/50"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Form */}
          {isLogin ? (
            <Login isAdmin={isAdminRoute} />
          ) : (
            <Signup setIsLogin={setIsLogin} />
          )}

          <div className="flex justify-center">
            <Link to="/">
              <Button variant="ghost" className="mt-6 bg-cinema-border">
                <ArrowLeft />
                <div>Back to Movies</div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
