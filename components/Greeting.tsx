"use client";

import { useState, useEffect } from "react";

const Greeting = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();

      if (currentHour < 12) {
        return "Good Morning";
      } else if (currentHour < 18) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    };

    setGreeting(getGreeting());
  }, []);

  if (!greeting) {
    return null;
  }

  return (
    <p className="text-md md:text-lg text-secondary mb-2">
      {greeting}, gSomnia 💛
    </p>
  );
};

export default Greeting;
