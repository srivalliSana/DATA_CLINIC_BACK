import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Redirect if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/"); // redirect to home if logged in
    }
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // ✅ Save token + user after registration
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("✅ Registered successfully!");
      navigate("/upload-dataset"); // go to upload dataset page after registering
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Google Register (same as Google Login) ---
  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-top)] to-[var(--bg-bottom)]" />
      <div className="relative z-10">
        <div className="flex justify-center items-center pt-20 pb-10 px-5">
          <div className="glass p-8 w-full max-w-md">
            <h2
              className="text-3xl font-bold mb-6 text-center"
              style={{ color: "var(--title)" }}
            >
              Create Account
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--cta)]"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--cta)]"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--cta)]"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            {/* Google Button */}
            <button
              onClick={handleGoogleRegister}
              className="btn w-full mt-4 flex items-center justify-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100"
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <p className="text-sm text-center mt-4 text-black/70 dark:text-white/80">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-[var(--title)] font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
