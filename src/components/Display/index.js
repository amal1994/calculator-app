import React from "react";
import { Textfit } from "react-textfit";
import "./screen.css";

const Display = ({ value, className }) => {
  return (
    <Textfit className={`screen ${className}`} mode="single" max={70}>
      {value}
    </Textfit>
  );
};

export default Display;
