import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-foreground mb-6">
          {isLogin ? "Welcome Back 👋" : "Create an Account ✨"}
        </h2>

        {/* Form */}
        <form className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl bg-white/20 dark:bg-black/30 text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          )}
          <input
            type="email"
            placeholder="University Email"
            className="w-full px-4 py-3 rounded-xl bg-white/20 dark:bg-black/30 text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/20 dark:bg-black/30 text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />

          <button
            type="submit"
            className="w-full btn btn-primary"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Switch */}
        <p className="text-center text-sm text-foreground/70 mt-6">
          {isLogin ? "Don’t have an account?" : "Already registered?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-semibold hover:underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>

        {/* Back to Home */}
        <p className="text-center text-xs text-foreground/60 mt-4">
          <Link to="/" className="hover:underline">← Back to Home</Link>
        </p>
      </motion.div>
    </>
  );
}
