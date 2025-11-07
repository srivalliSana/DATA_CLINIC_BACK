import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");
    
    if (!tokenParam) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }
    
    setToken(tokenParam);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Call the backend API to reset the password
      const res = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
      
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
              Reset Your Password
            </h2>
            
            {success ? (
              <div className="text-center">
                <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                  Your password has been reset successfully! Redirecting to login...
                </div>
                <Link
                  to="/auth/login"
                  className="text-[var(--color-primary)] font-medium hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                  </div>
                )}
                
                {!token ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">
                      Invalid or expired reset link. Please request a new password reset.
                    </p>
                    <Link
                      to="/auth/forgot-password"
                      className="text-[var(--color-primary)] font-medium hover:underline"
                    >
                      Request New Reset Link
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full"
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                  </form>
                )}
                
                <p className="text-sm text-center mt-4 text-black/70 dark:text-white/80">
                  Remember your password?{" "}
                  <Link
                    to="/auth/login"
                    className="text-[var(--color-primary)] font-medium"
                  >
                    Login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}