// src/components/ui/DotLoader.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const Loader = ({ label1 = "Loading...", label2 = "Back to movies" ,fullscreen = true }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`${
        fullscreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 top-18 backdrop-blur"
          : "flex flex-col items-center justify-center"
      }`}
    >
      <div className="flex space-x-1">
        <span className="h-5 w-5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <span className="h-5 w-5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <span className="h-5 w-5 rounded-full bg-primary animate-bounce" />
      </div>
      <p className="mt-2 text-base text-muted-foreground">{label1}</p>
      <Button onClick={() => navigate(-1)} className="mt-4 cursor-pointer">
        <ArrowLeft /> {label2}
      </Button>
    </div>
  );
};

export default Loader;
