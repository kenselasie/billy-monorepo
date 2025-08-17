"use client";
import React from "react";

const Test = () => {
  const initialState = {
    count: 0,
    name: "Test",
  };
  const reducerFnc = (
    state: { name: string; count: number },
    action: { type: string }
  ) => {
    if (action.type === "increment") {
      return { ...state, count: state.count + 1 };
    }
    if (action.type === "decrement") {
      return { ...state, count: state.count - 1 };
    }
    if (action.type === "reset") {
      return initialState;
    }
    return state;
  };

  const [state, dispatch] = React.useReducer(reducerFnc, initialState);
  return (
    <div>
      {state.name} - {state.count} <br /> <br />
      <button onClick={() => dispatch({ type: "increment" })}>Plus</button>{" "}
      <br /> <br />
      <button onClick={() => dispatch({ type: "decrement" })}>
        Minus
      </button>{" "}
      <br />
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
};

export default Test;
