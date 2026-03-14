import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { MessageSquare, Mail, Lock, EyeOff, Eye } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import { login } from "../store/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2 ">
      <div className="flex  flex-col justify-center items-center p-6 sm:p-12">
        {/*left side*/}
        <div className="w-full max-w-md space-y-8">
          {/*logo*/}
          <div className="">
            <div className="flex flex-col items-center justify-center">
              <div>
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in your account</p>
            </div>
          </div>

          {/*form*/}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label>Email</label>
              <div className="relative">
                <div className="absolute left-0 inset-y-0 pl-3 flex items-center">
                  <Mail className="z-10 w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`w-full input input-bordered pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label>Password</label>
              <div className="relative">
                <div className="absolute pl-3 left-0 inset-y-0 flex items-center z-10">
                  <Lock className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type="password"
                  className="w-full input input-bordered pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-base-content/40" />
                  ) : (
                    <Eye className="w-5 h-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button className="btn btn-primary w-full">Sign In</button>
          </form>

          <div className="text-center">
            <p className="text-base-content/40">
              {" "}
              Don&apos;t have an account?
              <Link to="/signup" className="link link-primary">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={
          "Sign in to continue your conversations and catch up with your messages."
        }
      />
    </div>
  );
};

export default LoginPage;
