import React from "react";
import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";

const RenderSteps = () => {
  const { step } = useSelector((state) => state.booking);

  const steps = [
    { id: 1, title: "Select Showtime" },
    { id: 2, title: "Choose Seats" },
    { id: 3, title: "Confirm Booking" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-0 mb-10">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {steps.map((item, index) => (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <div className="relative flex flex-col items-center flex-1 text-center">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full font-bold text-sm border-2 z-10 transition-all duration-300
                  ${
                    step === item.id
                      ? "border-cinema-gold bg-cinema-gold text-cinema-dark"
                      : step > item.id
                      ? "bg-cinema-purple border-cinema-purple text-white"
                      : "bg-muted text-muted-foreground border-muted"
                  }`}
              >
                {step > item.id ? <FaCheck size={12} /> : item.id}
              </div>
              <div className="absolute top-10 text-[10px] sm:text-xs text-center text-muted-foreground w-24 sm:w-28">
                {item.title}
              </div>
            </div>

            {/* Connecting Line */}
            {index !== steps.length - 1 && (
              <div
                className={`flex-11 h-0.5 border-t-2 border-dashed ${
                  step > item.id ? "border-cinema-purple" : "border-gray-600"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RenderSteps;
