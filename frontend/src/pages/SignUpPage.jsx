import { useState } from "react";
import toast from "react-hot-toast";
import {
  MessageSquare,
  User,
  Mail,
  Eye,
  Lock,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AuthImagePattern from "../components/AuthImagePattern";
import { signup } from "../store/authSlice";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid Email");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = validateForm();
    if (valid === false) return;

    dispatch(signup(formData));
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        {/* LOGO */}
        <div className="w-full max-w-md ">
          <div className="flex flex-col items-center">
            <div
              className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
            >
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-xl">Create Your Account</h1>
            <p className="py-3">Get Started With Free Account</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col py-3 ">
              <label className="py-2">Full Name</label>
              <div className="relative">
                <div className="absolute left-0 pl-3 inset-y-0 flex items-center">
                  <User className="size-5" />
                </div>
                <input
                  type="text"
                  placeholder="Enter Your Full Name"
                  className="pl-10 w-full py-2 border rounded-lg"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col py-3">
              <label className="py-2">Email</label>
              <div className="relative">
                <div className="absolute left-0  inset-y-0 flex items-center pl-3">
                  <Mail className="size-5" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your email address"
                  className="pl-10 w-full border rounded-lg py-2"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col py-3">
              <label className="py-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 flex items-center pl-3">
                  <Lock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your password"
                  className="py-2 w-full border rounded-lg pl-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute pr-3 right-0 inset-y-0 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full disabled={loading}"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading.....
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-base-content/60">
              Already have an Account?{" "}
              <Link to="/login" className="link link-primary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/*Right Side*/}
      <AuthImagePattern
        title="Join Our Community"
        subtitle="Connect with friends,share moments,and stay in touch with your loved ones"
      />
    </div>
  );
};

export default SignUpPage;
