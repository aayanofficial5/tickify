import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "sonner";

import {
  Ticket,
  User,
  LogOut,
  Settings
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      dispatch(logout());
      toast.success("Logged out!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    }
  };

  return (
    <nav className="bg-cinema-dark text-white px-4 md:px-6 py-5 shadow-sm sticky top-0 z-50 border-b border-cinema-border">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold pl-2 md:pl-10">
          <Ticket className="text-yellow-400 h-8 w-8" />
          <span className="text-gradient text-2xl">Tickify</span>
        </Link>

        {/* Right section */}
        <div className="pr-2 md:pr-10 flex items-center justify-between gap-3 md:gap-10">
          <button
            className="text-base hover:text-yellow-400"
            onClick={() => navigate("/")}
          >
            Movies
          </button>

          {token && (
            <Link to="/bookings" className="hidden sm:flex text-base hover:text-yellow-400">
              My Bookings
            </Link>
          )}

          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-cinema-border hover:bg-cinema-card gap-2"
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-cinema-card border-cinema-border"
              >
                <DropdownMenuLabel className="text-foreground">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cinema-border" />
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-foreground hover:text-cinema-gold cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/bookings"
                    className="flex sm:hidden items-center gap-2 text-foreground hover:text-cinema-gold cursor-pointer"
                  >
                    <Ticket className="h-4 w-4" />
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cinema-border" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-foreground hover:text-cinema-gold cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                className="btn-dark !px-4 !border-1 !border-gray-600"
                onClick={() => navigate("/auth?mode=signin")}
              >
                <User />
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/auth?mode=signup")}
                className="btn-gradient !px-4 !text-black"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
