import React from "react";
import { useContext, useEffect, useRef, useState } from "react";

const Friend = ({ img, name }) => {
  return (
    <div className="flex flex-row items-center p-1 mv-1 pl-2 cursor-pointer">
      <img src={img} alt={name} className="w-7 rounded-full mr-4" />
      <span className="text-gray-600">{name}</span>
    </div>
  );
};

export default Friend;
