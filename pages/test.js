import React from "react";

const Test = () => {
  const testHandler = async () => {
    console.log("test");
  };
  return <button onClick={testHandler}>Test</button>;
};

export default Test;
