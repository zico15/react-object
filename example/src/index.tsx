import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useObject } from "react-useobject";

function Example() {
  const user = useObject({ name: "John", age: 30 });

  useEffect(() => {
    console.log("user changed: ", user);
  }, [user]);

  useEffect(() => {
    console.log("user.age changed: ", user.age);
  }, [user.age]);

  useEffect(() => {
    console.log("user.name changed: ", user.name);
  }, [user.name]);

  return (
    <div className="example">
      <div className="user">
        <h3>UserName: {user.name}</h3>
        <h3>UseAge: {user.age}</h3>
        <div>
          <button
            onClick={() => {
              user.name = "name_" + Math.random();
            }}
          >
            Rondom name
          </button>

          <button
            onClick={() => {
              user.age = Math.floor(Math.random() * 100);
            }}
          >
            Rondom age
          </button>
        </div>
        <div className="display">user.name = {}</div>
      </div>
    </div>
  );
}

createRoot(document.querySelector(".root") as Element).render(<Example />);
