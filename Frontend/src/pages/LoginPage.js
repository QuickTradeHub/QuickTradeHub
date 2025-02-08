import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://13.49.132.61:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email:username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token',data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-500 to-pink-500 min-h-screen p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-4 sm:mb-6">Login to Your Account</h2>

        {error && <p className="text-red-600 text-center text-sm sm:text-base mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {[
            { id: "username", placeholder: "Username", value: username, setter: setUsername, icon: <FaUser className="text-gray-500" /> },
            { id: "password", placeholder: "Password", value: password, setter: setPassword, type: "password", icon: <FaLock className="text-gray-500" /> },
          ].map(({ id, placeholder, value, setter, type = "text", icon }) => (
            <div key={id} className="w-full flex items-center border-2 border-gray-200 rounded-lg focus-within:border-blue-500 bg-gray-50">
              <div className="p-3">{icon}</div>
              <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full p-3 text-sm sm:text-lg text-gray-700 bg-transparent focus:outline-none"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full p-3 sm:p-4 bg-blue-600 text-white font-semibold text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          <div className="text-center mt-4 space-y-1 sm:space-y-2 text-sm sm:text-base">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 transition-all duration-200">
                Sign Up here
              </Link>
            </p>
            <p>
              Forgot your password?{" "}
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 transition-all duration-200">
                Reset Password
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
