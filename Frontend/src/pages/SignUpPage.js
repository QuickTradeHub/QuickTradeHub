import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaPhoneAlt,
  FaEnvelope,
  FaImage,
} from "react-icons/fa";

const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const navigate = useNavigate();

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
    }
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setRoles((prevRoles) =>
      checked
        ? [...prevRoles, value]
        : prevRoles.filter((role) => role !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !username
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (roles.length === 0) {
      setError("Please select at least one role.");
      return;
    }

    setLoading(true);
    try {
      const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        password: password,
        userName: username,
        roles: roles,
        profileImg: profileImg,
        status: "ACTIVE",
      };

      const response = await fetch(
        "https://quicktradehub.in/authenticationservice/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShowSuccessPopup(true);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-300 via-purple-500 to-pink-500 min-h-screen pt-16 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg sm:w-11/12 md:w-8/12 lg:w-6/12">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            {
              id: "firstName",
              placeholder: "First Name",
              value: firstName,
              setter: setFirstName,
              icon: <FaUser className="text-gray-500" />,
            },
            {
              id: "lastName",
              placeholder: "Last Name",
              value: lastName,
              setter: setLastName,
              icon: <FaUser className="text-gray-500" />,
            },
            {
              id: "username",
              placeholder: "Username",
              value: username,
              setter: setUsername,
              icon: <FaUser className="text-gray-500" />,
            },
            {
              id: "email",
              placeholder: "Email Address",
              value: email,
              setter: setEmail,
              icon: <FaEnvelope className="text-gray-500" />,
            },
            {
              id: "phone",
              placeholder: "Phone Number",
              value: phone,
              setter: setPhone,
              icon: <FaPhoneAlt className="text-gray-500" />,
            },
            {
              id: "password",
              placeholder: "Password",
              value: password,
              setter: setPassword,
              type: "password",
              icon: <FaLock className="text-gray-500" />,
            },
            {
              id: "confirmPassword",
              placeholder: "Confirm Password",
              value: confirmPassword,
              setter: setConfirmPassword,
              type: "password",
              icon: <FaLock className="text-gray-500" />,
            },
          ].map(({ id, placeholder, value, setter, type = "text", icon }) => (
            <div
              key={id}
              className="w-full flex items-center border-b-2 border-gray-300 focus-within:border-blue-500"
            >
              <div className="p-3">{icon}</div>
              <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full p-4 text-lg text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="profileImg" className="text-sm text-gray-600">
              Profile Image
            </label>
            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500 mt-2">
              <FaImage className="text-gray-500 p-2" />
              <input
                id="profileImg"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="mt-2 p-3 border-none focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Select Role</label>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  value="SELLER"
                  onChange={handleRoleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Seller</span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  value="BUYER"
                  onChange={handleRoleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Buyer</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>

          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 transition-all duration-200"
              >
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
            <h3 className="text-xl font-semibold text-center text-green-600 mb-4">
              Account Created Successfully!
            </h3>
            <p className="text-center mb-6">
              Your account has been created successfully. Click below to log in.
            </p>
            <button
              onClick={handleClosePopup}
              className="w-full p-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
