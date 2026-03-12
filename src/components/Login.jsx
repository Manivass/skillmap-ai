import React, { useState, useEffect } from "react";
import Loginlogo from "../img/Loginlogo.png";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
const Login = () => {
  const [isLogin, setLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPasssword] = useState("");
  const [iserr, setErr] = useState("");

  const handleGoogleLogin = async (response) => {
    try {
      console.log("Google Token:", response.credential);
      const res = await axios.post(
        BASE_URL + "/google-login",
        { token: response.credential, provider: "google" },
        { withCredentials: true },
      );
      console.log("Backend response:", res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          "309200387998-4irl0kdpdb895getlg8d0j5h6um54699.apps.googleusercontent.com",
        callback: handleGoogleLogin,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large" },
      );
    }
  }, []);

  const handleLogin = async () => {
    try {
      await axios.post(
        BASE_URL + "/login",
        {
          emailId: email,
          password,
        },
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      setErr(err?.message);
    }
  };
  const handleSignUp = async () => {
    try {
      await axios.post(BASE_URL + "/signup", {
        firstName,
        lastName,
        emailId: email,
        password,
      });
    } catch (err) {
      setErr(err?.response?.data?.message);
    }
  };
  return (
    <div className="hero bg-sky-100 min-h-screen shadow-md">
      <div className="hero-content  bg-white flex-col lg:flex-row rounded-md">
        <div className=" text-center w-1/2 ">
          <img src={Loginlogo} className="w-140 h-138 rounded-lg" />
        </div>
        <div className="card   w-full max-w-sm shrink-0 ">
          <div className="card-body">
            <fieldset className="fieldset">
              <h2 className="text-2xl font-semibold text-sky-700 text-center">
                Welcome Back
              </h2>
              <h2 className="text-sm text-balance text-black text-center font-semibold">
                {isLogin ? "Login to your Account" : "signin your Account"}
              </h2>
              {!isLogin && (
                <div>
                  <label className="label ">Firstname</label>
                  <input
                    type="name"
                    className="input bg-base-100 mt-1"
                    placeholder="Firstname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              )}
              {!isLogin && (
                <div>
                  <label className="label ">LastName</label>
                  <input
                    type="name"
                    className="input bg-base-100 mt-1"
                    placeholder="LastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              )}

              <label className="label ">Email</label>
              <input
                type="email"
                className="input bg-base-100"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="label">Password</label>
              <input
                type="password"
                className="input bg-base-100"
                placeholder="Password"
                value={password}
                onChange={(e) => setPasssword(e.target.value)}
              />
              <p className="text-sm text-red-500">{iserr}</p>
              <button
                onClick={isLogin ? handleLogin : handleSignUp}
                className="btn btn-success mt-4 text-white w-22/23"
              >
                {isLogin ? "Login" : "sign In "}
              </button>
              <label
                className="underline cursor-pointer"
                onClick={() => setLogin(!isLogin)}
              >
                {isLogin
                  ? "didn't have account ? sign in "
                  : "already have Account ? Login"}
              </label>

              <h2 className="text-lg text-center text-base-300">OR</h2>

              <div id="googleBtn" className="w-22/23"></div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
