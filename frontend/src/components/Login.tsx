import { useState } from "react";
import * as api from "../api";
import { ApiError } from "../api";
import { useAuth } from "../context/AuthContext";
import { Btn, ErrorBar, Field, Input } from "./ui";

export default function Login({ onGoRegister }: { onGoRegister: () => void }) {
  const { login } = useAuth();
  const [form, setForm]   = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) { setError("Fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await api.login(form);
      login({ username: res.username, role: res.role as "STUDENT" | "TEACHER", token: res.token });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 w-[380px] p-8">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-xl font-semibold text-zinc-900 tracking-tight">EduTrack</div>
          <div className="text-sm text-zinc-400 mt-0.5">Sign in to your account</div>
        </div>

        {error && <div className="mb-4"><ErrorBar message={error} /></div>}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label="Username">
            <Input
              value={form.username}
              onChange={set("username")}
              placeholder="your username"
              autoFocus
              autoComplete="username"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>

          <Btn type="submit" disabled={loading} className="w-full justify-center mt-1">
            {loading ? "Signing in…" : "Sign in"}
          </Btn>
        </form>

        <p className="text-sm text-zinc-400 text-center mt-6">
          No account?{" "}
          <button
            onClick={onGoRegister}
            className="text-zinc-700 font-medium hover:underline bg-transparent border-none cursor-pointer"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
