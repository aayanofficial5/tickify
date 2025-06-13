import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const NavBar = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out!");
      // navigate("/login");
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        🎫 Ticketify
      </Link>

      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:underline text-gray-700">Home</Link>
        {user && (
          <Link to="/my-bookings" className="hover:underline text-gray-700">
            My Bookings
          </Link>
        )}
        {user ? (
          <>
            <span className="text-sm text-gray-500 hidden sm:inline">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
