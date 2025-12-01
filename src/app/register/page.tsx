"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    console.log("form: ", JSON.stringify(form));
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Registration successful! You can now log in.");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Register</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-500"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-indigo-500"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="parent">Parent</option>
          <option value="admin">Admin</option>
          <option value="superAdmin">Super Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && (
          <p className="text-sm text-center text-gray-600">{message}</p>
        )}
      </form>
    </div>
  );
}
