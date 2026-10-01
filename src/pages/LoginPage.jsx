import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
  }

  function switchMode() {
    setMode(mode === "login" ? "signup" : "login");
    resetForm();
  }

  function handleSignup(event) {
    event.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      alert("An account with this email already exists. Please log in.");
      setMode("login");
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      workouts: [],
      fitnessGoals: null,
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    alert("Account created! You can now log in.");
    setMode("login");
    resetForm();
  }

  function handleLogin(event) {
    event.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const matchedUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!matchedUser) {
      alert("Those details don't match. Try again or create an account.");
      return;
    }

    const workoutsKey = `workouts_${matchedUser.id}`;
    const goalKey = `fit_goal_v1_${matchedUser.id}`;

    if (!localStorage.getItem(workoutsKey)) {
      localStorage.setItem(workoutsKey, JSON.stringify([]));
    }

    if (!localStorage.getItem(goalKey)) {
      localStorage.setItem(goalKey, JSON.stringify(null));
    }

    onLogin?.(matchedUser);
    navigate("/fit", { replace: true });
  }

  const isSignup = mode === "signup";

  return (
    <div className="login-page">
      <section className="login-intro">
        <div className="login-logo">FitJournal / your pace</div>
        <h1>Build a routine you’ll want to keep.</h1>
        <p>
          A private, simple space to record every session, set a meaningful target,
          and notice your progress.
        </p>

        <div className="feature-list">
          {[
            ["⌁", "Log every session"],
            ["◎", "Set a personal target"],
            ["↗", "See your progress clearly"],
          ].map(([icon, text]) => (
            <div className="feature-item" key={text}>
              <span className="feature-icon">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </section>

      <section className="login-panel">
        <div className="auth-card surface-card">
          <p className="eyebrow">Welcome to FitJournal</p>
          <h2 className="mb-2">{isSignup ? "Start your journey" : "Welcome back"}</h2>
          <p className="text-muted mb-4">
            {isSignup
              ? "Create your private fitness space in a minute."
              : "Sign in to continue your momentum."}
          </p>

          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            {isSignup && (
              <div className="mb-3">
                <label className="form-label">Your name</label>
                <input className="form-control" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Alex" required />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input type="email" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required />
            </div>

            <button className="btn btn-success w-100" type="submit">
              {isSignup ? "Create account" : "Log in"}
            </button>
          </form>

          <p className="text-center text-muted mt-4 mb-0">
            {isSignup ? "Already have an account? " : "New to FitJournal? "}
            <button className="auth-switch border-0 bg-transparent p-0" onClick={switchMode}>
              {isSignup ? "Log in" : "Create one"}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
