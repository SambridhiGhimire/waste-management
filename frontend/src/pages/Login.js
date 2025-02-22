import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import vector from "../assets/vector.png";

const Login = () => {
  const { user, loginWithEmail, signup, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    let success;
    if (isSignup) {
      success = await signup(name, email, password);
    } else {
      success = await loginWithEmail(email, password);
    }
    if (!success) setError("Invalid credentials or email already in use.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f7f4] px-4 gap-10">
      {/* Left Side - Image */}
      <div className="md:flex items-center justify-center p-6 ">
        <img src={vector} alt="Branding" className="w-full h-auto max-h-96 object-contain" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-md">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">{isSignup ? "Create an Account" : "Login to Your Account"}</h2>
          {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-gray-700 font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                placeholder="johndoe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition">
              {isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span onClick={() => setIsSignup(!isSignup)} className="text-green-600 font-medium cursor-pointer hover:underline">
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>

          <Link to="/forgot-password" className="block text-center text-sm text-green-600 mt-3 hover:underline">
            Forgot Password?
          </Link>

          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <button onClick={loginWithGoogle} className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg font-medium hover:bg-gray-100 transition">
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 12.3c0-.9-.1-1.8-.2-2.7H12v5.1h6.5c-.3 1.4-1 2.6-2 3.5v3h3.3c2-1.9 3.2-4.7 3.2-8z" fill="#4285F4" />
              <path d="M12 24c3.2 0 5.8-1.1 7.7-3.1l-3.3-3c-1 0.7-2.3 1.1-3.7 1.1-2.9 0-5.4-1.9-6.3-4.5H2.3v3.1C4.3 21.2 7.9 24 12 24z" fill="#34A853" />
              <path d="M5.7 14.4c-.2-.7-.3-1.4-.3-2.2s.1-1.5.3-2.2V6.9H2.3C1.4 8.7 1 10.4 1 12c0 1.6.4 3.3 1.3 5.1l3.4-2.7z" fill="#FBBC05" />
              <path d="M12 4.6c1.7 0 3.1.6 4.3 1.7l3.2-3.2C17.8 1.1 15.2 0 12 0 7.9 0 4.3 2.8 2.3 6.9l3.4 2.7c.9-2.6 3.4-5 6.3-5z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
