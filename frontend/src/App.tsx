import { useState } from "react";
import { Page } from "./types";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Students    from "./components/Students";
import Courses     from "./components/Courses";
import Assignments from "./components/Assignments";
import Grades      from "./components/Grades";
import Login       from "./components/Login";
import Register    from "./components/Register";

const nav: { id: Page; label: string }[] = [
  { id: "students",    label: "Students" },
  { id: "courses",     label: "Courses" },
  { id: "assignments", label: "Assignments" },
  { id: "grades",      label: "Grades" },
];

function Shell() {
  const { user, logout, isTeacher } = useAuth();
  const [page, setPage] = useState<Page>("students");
  const [authPage, setAuthPage] = useState<"login" | "register">("login");

  if (!user) {
    return authPage === "login"
      ? <Login     onGoRegister={() => setAuthPage("register")} />
      : <Register  onGoLogin={   () => setAuthPage("login")} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-zinc-900 flex flex-col py-6">
        <div className="px-5 mb-8">
          <div className="text-white text-sm font-semibold tracking-tight">EduTrack</div>
          <div className="text-zinc-500 text-xs mt-0.5">Student management</div>
        </div>

        <nav className="flex-1 flex flex-col gap-0.5 px-2">
          {nav.map(({ id, label }) => {
            const active = page === id;
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer border-none
                  ${active
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 bg-transparent"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="px-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2.5 mb-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0
              ${isTeacher ? "bg-blue-600" : "bg-zinc-600"}`}>
              {user.username[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-zinc-200 text-xs font-medium truncate">{user.username}</div>
              <div className={`text-xs ${isTeacher ? "text-blue-400" : "text-zinc-500"}`}>
                {isTeacher ? "Teacher" : "Student"}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-left text-xs text-zinc-500 hover:text-zinc-300 bg-transparent border-none cursor-pointer transition-colors py-1"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto bg-zinc-50">
        {/* Role banner for students */}
        {!isTeacher && (
          <div className="bg-amber-50 border-b border-amber-200 px-8 py-2 text-xs text-amber-700 flex items-center gap-1.5">
            <svg width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            You are signed in as a <strong>Student</strong> — view only. Contact a teacher to make changes.
          </div>
        )}
        <div className="max-w-4xl mx-auto px-8 py-9">
          {page === "students"    && <Students />}
          {page === "courses"     && <Courses />}
          {page === "assignments" && <Assignments />}
          {page === "grades"      && <Grades />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
