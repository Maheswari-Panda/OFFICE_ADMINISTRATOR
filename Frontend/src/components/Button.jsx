import React from "react";

function Button(props) {
  return (
    <button type={props.type} className={`btn btn-${props.size} bg-${props.color}-500 text-white rounded hover:bg-${props.color}-600`} onClick={props.onClick}>
    {props.icon && <span className="text-lg">{props.icon}</span>}
    {props.iconTag} {props.text}
  </button>
  
  );
}

export default Button;
