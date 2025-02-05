import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
      checked ? [...prevRoles, value] : prevRoles.filter((role) => role !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword || !username) {
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
            roles: roles, // No need to stringify, unless required by API
            profileImg: profileImg,
            status: "ACTIVE",
          };
          

          const response = await fetch("http://13.49.132.61:8080/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Ensure JSON is sent
            },
            body: JSON.stringify(formData),
          });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[ 
            { id: "firstName", placeholder: "Enter your first name", value: firstName, setter: setFirstName },
            { id: "lastName", placeholder: "Enter your last name", value: lastName, setter: setLastName },
            { id: "username", placeholder: "Choose a username", value: username, setter: setUsername },
            { id: "email", placeholder: "Enter your email", value: email, setter: setEmail },
            { id: "phone", placeholder: "Enter your phone number", value: phone, setter: setPhone },
            { id: "password", placeholder: "Enter your password", value: password, setter: setPassword, type: "password" },
            { id: "confirmPassword", placeholder: "Confirm your password", value: confirmPassword, setter: setConfirmPassword, type: "password" },
          ].map(({ id, placeholder, value, setter, type = "text" }) => (
            <div key={id} className="relative">
              <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="p-3 border border-gray-300 rounded-md mt-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label htmlFor="profileImg" className="text-sm text-gray-600">Profile Image</label>
            <input
              id="profileImg"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="p-3 border border-gray-300 rounded-md mt-1"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Select Role</label>
            <div className="flex items-center space-x-4">
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
            className="w-full p-3 bg-blue-600 text-white rounded-md mt-4"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>

          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
