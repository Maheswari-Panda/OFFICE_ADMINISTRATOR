import React from "react";

function Button(props) {
  return (
    <button
      type="submit"
      className={`w-full flex justify-center bg-${props.color}-400  hover:bg-${props.color}-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500`}
    >
      {props.text}
    </button>
  );
}

export default Button;
