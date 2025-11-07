import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Redirect if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (user && token) {
      const lastVisitedPage = localStorage.getItem("lastVisitedPage") || "/";
      navigate(lastVisitedPage);
    }
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Navigate to success page with user data
      navigate("/auth/success?token=" + data.token + "&email=" + data.user.email + "&name=" + data.user.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Google Login ---
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <>
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-top)] to-[var(--bg-bottom)]" />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-5">
        <div className="glass p-10 w-full max-w-lg">
          <h2
            className="text-4xl font-bold mb-8 text-center"
            style={{ color: "var(--title)" }}
          >
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-lg"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] text-lg"
            />

            <div className="flex justify-end">
              <Link
                to="/auth/forgot-password"
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-4 text-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            className="btn w-full mt-6 flex items-center justify-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100 py-4 text-lg"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="text-sm text-center mt-6 text-black/70 dark:text-white/80">
            Don’t have an account?{" "}
            <Link
              to="/auth/register"
              className="text-[var(--color-primary)] font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
