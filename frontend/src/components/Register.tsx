import { useState } from "react";
import * as api from "../api";
import { ApiError } from "../api";
import { useAuth } from "../context/AuthContext";
import { Btn, ErrorBar, Field, Input, Select } from "./ui";

export default function Register({ onGoLogin }: { onGoLogin: () => void }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "", confirm: "", role: "STUDENT" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) { setError("Fill in all fields."); return; }
    if (form.username.trim().length < 3) { setError("Username must be at least 3 characters."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const res = await api.register({ username: form.username.trim(), password: form.password, role: form.role });
      login({ username: res.username, role: res.role as "STUDENT" | "TEACHER", token: res.token });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 w-[380px] p-8">
        <div className="mb-8">
          <div className="text-xl font-semibold text-zinc-900 tracking-tight">EduTrack</div>
          <div className="text-sm text-zinc-400 mt-0.5">Create your account</div>
        </div>

        {error && <div className="mb-4"><ErrorBar message={error} /></div>}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Username">
            <Input
              value={form.username}
              onChange={set("username")}
              placeholder="Choose a username"
              autoFocus
              autoComplete="username"
            />
          </Field>

          <Field label="Role">
            <Select value={form.role} onChange={set("role")}>
              <option value="STUDENT">Student — view only</option>
              <option value="TEACHER">Teacher — full access</option>
            </Select>
          </Field>

          <Field label="Password">
            <Input
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </Field>

          <Field label="Confirm password">
            <Input
              type="password"
              value={form.confirm}
              onChange={set("confirm")}
              placeholder="Repeat password"
              autoComplete="new-password"
            />
          </Field>

          <Btn type="submit" disabled={loading} className="w-full justify-center mt-1">
            {loading ? "Creating account…" : "Create account"}
          </Btn>
        </form>

        <p className="text-sm text-zinc-400 text-center mt-6">
          Already have an account?{" "}
          <button
            onClick={onGoLogin}
            className="text-zinc-700 font-medium hover:underline bg-transparent border-none cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
