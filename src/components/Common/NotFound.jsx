// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-dark text-center px-4">
      <h1 className="text-6xl font-bold text-cinema-gold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-6">Page Not Found</p>
      <Button asChild className="bg-gradient-primary">
        <Link to="/"><ArrowLeft/>Go Back Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
