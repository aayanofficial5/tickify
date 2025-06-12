// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { shows } from "../data/shows";
import ShowCard from './../components/showCard';

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);


  return (
  <div className="p-6 bg-gray-100 min-h-screen">
    <h1 className="text-3xl font-bold text-center mb-6">
      Welcome, {user?.email} 🎉
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
      {shows.map((show) => (
        <ShowCard key={show.id} {...show} />
      ))}
    </div>
  </div>
);
};

export default Home;
