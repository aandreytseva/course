import { useEffect, useState } from "react";
import { Grade, Student, Course, Assignment } from "../types";
import * as api from "../api";
import { ApiError } from "../api";
import { useAuth } from "../context/AuthContext";
import { Badge, Btn, Empty, ErrorBar, Field, Input, Modal, SearchBar, Select, Spinner, Table, Td, Th, Tr, useConfirm } from "./ui";

type Form = { value: string; studentId: string; courseId: string; date: string };
type FE = Partial<Record<keyof Form, string>>;
const today = new Date().toISOString().slice(0, 10);
const blank: Form = { value: "", studentId: "", courseId: "", date: today };

function validate(f: Form): FE {
  const e: FE = {};
  if (!f.studentId) e.studentId = "Please select a student.";
  if (!f.courseId)  e.courseId  = "Please select a course.";
  if (!f.date)      e.date      = "Required.";
  if (!f.value.trim()) {
    e.value = "Required.";
  } else {
    const v = Number(f.value);
    if (!Number.isInteger(v))  e.value = "Must be a whole number.";
    else if (v < 1 || v > 10) e.value = "Must be between 1 and 10.";
  }
  return e;
}

const gradeColor = (v: number) => (v >= 8 ? "green" : v >= 5 ? "yellow" : "red") as "green" | "yellow" | "red";

function exportCsv(grades: Grade[], sName: (id: number | null) => string, cName: (id: number | null) => string) {
  const header = ["Student", "Course", "Grade", "Date"];
  const rows = grades.map(g => [
    sName(g.studentId),
    cName(g.courseId),
    String(g.value),
    g.date,
  ]);
  const csv = [header, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `grades_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface StudentPanelProps {
  student: Student;
  grades: Grade[];
  courses: Course[];
  assignments: Assignment[];
  onClose: () => void;
}

function daysLeft(dueDate: string | null): string {
  if (!dueDate) return "";
  const diff = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000);
  if (diff < 0)  return "Overdue";
  if (diff === 0) return "Today";
  return `${diff}d left`;
}

function daysColor(dueDate: string | null): string {
  if (!dueDate) return "text-zinc-400";
  const diff = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000);
  if (diff < 0)  return "text-red-500";
  if (diff <= 7) return "text-yellow-600";
  return "text-green-600";
}

function StudentPanel({ student, grades, courses, assignments, onClose }: StudentPanelProps) {
  const studentGrades = grades.filter(g => g.studentId === student.id);
  const courseIds = [...new Set(studentGrades.map(g => g.courseId).filter(Boolean))] as number[];

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-30"
        onClick={onClose}
      />
      {/* panel */}
      <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-40 flex flex-col overflow-hidden">
        {/* header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold text-zinc-900">
              {student.firstName} {student.lastName}
            </div>
            <div className="text-sm text-zinc-500 mt-0.5">{student.groupName}</div>
            <div className="text-xs text-zinc-400 mt-0.5">{student.email}</div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 mt-0.5 shrink-0"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* summary row */}
        <div className="px-6 py-3 bg-zinc-50 border-b border-zinc-100 flex gap-6 text-sm">
          <div>
            <span className="text-zinc-400">Grades</span>
            <span className="ml-2 font-semibold text-zinc-800">{studentGrades.length}</span>
          </div>
          <div>
            <span className="text-zinc-400">Avg</span>
            <span className="ml-2 font-semibold text-zinc-800">
              {studentGrades.length
                ? (studentGrades.reduce((s, g) => s + g.value, 0) / studentGrades.length).toFixed(1)
                : "—"}
            </span>
          </div>
          <div>
            <span className="text-zinc-400">Courses</span>
            <span className="ml-2 font-semibold text-zinc-800">{courseIds.length}</span>
          </div>
        </div>

        {/* content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {courseIds.length === 0 && (
            <p className="text-sm text-zinc-400 text-center mt-8">No grades recorded.</p>
          )}
          {courseIds.map(cid => {
            const course = courses.find(c => c.id === cid);
            const grade  = studentGrades.find(g => g.courseId === cid);
            const courseAssignments = assignments.filter(a => a.courseId === cid);
            return (
              <div key={cid} className="rounded-xl border border-zinc-100 overflow-hidden">
                {/* course header */}
                <div className="flex items-center justify-between px-4 py-3 bg-zinc-50">
                  <div>
                    <div className="text-sm font-semibold text-zinc-800">{course?.name ?? "—"}</div>
                    {course?.teacher && (
                      <div className="text-xs text-zinc-400 mt-0.5">{course.teacher}</div>
                    )}
                  </div>
                  {grade && (
                    <Badge text={`${grade.value}/10`} color={gradeColor(grade.value)} />
                  )}
                </div>

                {/* assignments */}
                {courseAssignments.length === 0 ? (
                  <div className="px-4 py-2 text-xs text-zinc-400">No assignments for this course.</div>
                ) : (
                  <ul className="divide-y divide-zinc-50">
                    {courseAssignments.map(a => (
                      <li key={a.id} className="flex items-center justify-between px-4 py-2.5 gap-2">
                        <div className="min-w-0">
                          <div className="text-sm text-zinc-700 truncate">{a.title}</div>
                          {a.description && (
                            <div className="text-xs text-zinc-400 truncate">{a.description}</div>
                          )}
                        </div>
                        {a.dueDate && (
                          <div className="text-right shrink-0">
                            <div className="text-xs text-zinc-400">{a.dueDate}</div>
                            <div className={`text-xs font-medium ${daysColor(a.dueDate)}`}>
                              {daysLeft(a.dueDate)}
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function Grades() {
  const [grades, setGrades]           = useState<Grade[]>([]);
  const [students, setStudents]       = useState<Student[]>([]);
  const [courses, setCourses]         = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [search, setSearch]           = useState("");
  const [modal, setModal]             = useState<null | "add" | Grade>(null);
  const [form, setForm]               = useState<Form>(blank);
  const [fe, setFe]                   = useState<FE>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]         = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { confirm, dialog }           = useConfirm();
  const { isTeacher }                 = useAuth();

  const load = () => {
    setLoading(true);
    Promise.all([api.getGrades(), api.getStudents(), api.getCourses(), api.getAssignments()])
      .then(([g, s, c, a]) => { setGrades(g); setStudents(s); setCourses(c); setAssignments(a); })
      .catch((e: ApiError) => setServerError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const sName = (id: number | null) => { const s = students.find(x => x.id === id); return s ? `${s.firstName} ${s.lastName}` : "—"; };
  const cName = (id: number | null) => courses.find(x => x.id === id)?.name ?? "—";
  const filtered = grades.filter(g =>
    `${sName(g.studentId)} ${cName(g.courseId)}`.toLowerCase().includes(search.toLowerCase())
  );
  const avg = filtered.length ? (filtered.reduce((s, g) => s + g.value, 0) / filtered.length).toFixed(1) : null;

  const setField = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setFe(prev => ({ ...prev, [k]: undefined }));
    setServerError("");
  };

  const openAdd  = () => { setForm(blank); setFe({}); setServerError(""); setModal("add"); };
  const openEdit = (g: Grade) => {
    setForm({ value: String(g.value), studentId: String(g.studentId ?? ""), courseId: String(g.courseId ?? ""), date: g.date });
    setFe({}); setServerError(""); setModal(g);
  };

  const openStudentPanel = (studentId: number | null) => {
    if (!studentId) return;
    const s = students.find(x => x.id === studentId);
    if (s) setSelectedStudent(s);
  };

  const save = async () => {
    const errors = validate(form);
    if (Object.keys(errors).length) { setFe(errors); return; }
    const body = { value: Number(form.value), studentId: Number(form.studentId), courseId: Number(form.courseId), date: form.date };
    try {
      modal === "add" ? await api.createGrade(body) : await api.updateGrade((modal as Grade).id, body);
      setModal(null); load();
    } catch (e) {
      if (e instanceof ApiError && Object.keys(e.fields).length) setFe(e.fields as FE);
      else setServerError(e instanceof ApiError ? e.message : "Unexpected error.");
    }
  };

  const remove = async (g: Grade) => {
    const ok = await confirm(
      "Delete grade",
      `Delete grade ${g.value}/10 for ${sName(g.studentId)} in ${cName(g.courseId)}?`,
      "Delete",
      "danger"
    );
    if (!ok) return;
    try { await api.deleteGrade(g.id); load(); }
    catch (e) { setServerError(e instanceof ApiError ? e.message : "Delete failed."); }
  };

  return (
    <div>
      {dialog}

      {selectedStudent && (
        <StudentPanel
          student={selectedStudent}
          grades={grades}
          courses={courses}
          assignments={assignments}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-semibold text-zinc-900">Grades</h1>
          <span className="text-sm text-zinc-400">{filtered.length}</span>
          {avg && <span className="text-sm text-zinc-400">· avg <span className="font-medium text-zinc-700">{avg}</span></span>}
        </div>
        <div className="flex gap-2">
          {isTeacher && (
            <Btn
              variant="ghost"
              onClick={() => exportCsv(filtered, sName, cName)}
              disabled={filtered.length === 0}
            >
              <svg width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </Btn>
          )}
          {isTeacher && <Btn onClick={openAdd}>+ Add grade</Btn>}
        </div>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by student or course…" />

      {loading ? <Spinner /> : (
        <Table>
          <thead><tr><Th>Student</Th><Th>Course</Th><Th>Grade</Th><Th>Date</Th><Th children={undefined} /></tr></thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={5}><Empty label="No grades yet." /></td></tr>
              : filtered.map(g => (
                <Tr key={g.id}>
                  <Td>
                    <button
                      className="font-medium text-left hover:text-blue-600 hover:underline underline-offset-2 transition-colors"
                      onClick={() => openStudentPanel(g.studentId)}
                    >
                      {sName(g.studentId)}
                    </button>
                  </Td>
                  <Td className="text-zinc-500">{cName(g.courseId)}</Td>
                  <Td><Badge text={String(g.value)} color={gradeColor(g.value)} /></Td>
                  <Td className="text-zinc-400">{g.date}</Td>
                  <Td className="text-right">
                    {isTeacher && (
                      <div className="flex gap-2 justify-end">
                        <Btn variant="ghost" size="sm" onClick={() => openEdit(g)}>Edit</Btn>
                        <Btn variant="danger" size="sm" onClick={() => remove(g)}>Delete</Btn>
                      </div>
                    )}
                  </Td>
                </Tr>
              ))
            }
          </tbody>
        </Table>
      )}

      {modal && (
        <Modal title={modal === "add" ? "New grade" : "Edit grade"} onClose={() => setModal(null)}>
          {serverError && <ErrorBar message={serverError} />}
          <Field label="Student" error={fe.studentId}>
            <Select value={form.studentId} onChange={setField("studentId")} error={!!fe.studentId}>
              <option value="">— select student —</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </Select>
          </Field>
          <Field label="Course" error={fe.courseId}>
            <Select value={form.courseId} onChange={setField("courseId")} error={!!fe.courseId}>
              <option value="">— select course —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
          <Field label="Grade (1–10)" error={fe.value}>
            <Input type="number" min={1} max={10} step={1} value={form.value} onChange={setField("value")} placeholder="e.g. 8" error={!!fe.value} />
          </Field>
          <Field label="Date" error={fe.date}>
            <Input type="date" value={form.date} onChange={setField("date")} error={!!fe.date} />
          </Field>
          <div className="flex gap-2 justify-end pt-1">
            <Btn variant="ghost" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
