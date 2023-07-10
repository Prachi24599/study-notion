import React from "react";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import frameImage from "../assets/frame.png";

const Template = ({ title, desc1, desc2, image, formType, setIsLoggedIn }) => {
  return (
    <div>
      <div>
        <h1>{title}</h1>
        <p>
          <span>{desc1}</span>
          <span>{desc2}</span>
        </p>

        {formType === "signup" ? <Signup /> : <Login />}

        <div>
          <div></div>
          <p>OR</p>
          <div></div>
        </div>

        <button>
          <p>Sign Up with Google</p>
        </button>
      </div>

      <div>
        <img
          src={frameImage}
          alt="Pattern"
          width={558}
          height={504}
          loading="lazy"
        />
        <img
          src={image}
          alt="Students"
          width={558}
          height={504}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Template;
