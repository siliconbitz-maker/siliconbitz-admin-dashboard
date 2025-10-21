'use client';
import { useEffect, useState } from "react";
import axios from "axios";

type User = { id: string; name: string };
type Project = { id: string; name: string };
type Task = {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  status: "todo" | "accepted" | "review" | "done";
  user?: User;
  userId?: string;
  project: Project;
  timeSpent: number;
  deadline: string;
};

export default function Scrumboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [weeklyTime, setWeeklyTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // main loading
  const [actionLoading, setActionLoading] = useState(false); // add/edit/delete
  const [form, setForm] = useState({
    name: "",
    description: "",
    difficulty: "Easy",
    userId: "",
    projectId: "",
    deadline: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, usersRes, projectsRes, meRes] = await Promise.all([
        axios.get("/api/tasks"),
        axios.get("/api/users"),
        axios.get("/api/projects"),
        axios.get("/api/me"),
      ]);

      setTasks(tasksRes.data.tasks);
      setUsers(usersRes.data.users);
      setProjects(projectsRes.data.projects);
      setCurrentUser(meRes.data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const time = tasks
      .filter(
        (t) =>
          t.user?.id === currentUser.id &&
          t.timeSpent &&
          new Date(t.deadline) >= oneWeekAgo
      )
      .reduce((acc, t) => acc + t.timeSpent, 0);
    setWeeklyTime(time);
  }, [tasks, currentUser]);

  const handleAddTask = async () => {
    setActionLoading(true);
    try {
      await axios.post("/api/tasks", form);
      setShowModal(false);
      setForm({
        name: "",
        description: "",
        difficulty: "Easy",
        userId: "",
        projectId: "",
        deadline: "",
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (
    task: Task,
    newStatus: Task["status"],
    elapsedTime = 0
  ) => {
    setActionLoading(true);
    try {
      await axios.put("/api/tasks", {
        id: task.id,
        status: newStatus,
        elapsedTime,
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    setActionLoading(true);
    try {
      await axios.delete("/api/tasks", { data: { id: taskId } });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen">
      {/* Weekly Time */}
      {currentUser && (
        <div className="mb-4 p-4 bg-[#E0F7FA] border-l-4 border-[#00B8D9] rounded shadow-sm">
          <p className="text-sm font-semibold text-[#0F4C75]">
            Hello {currentUser.name}, you spent this week: {formatTime(weeklyTime)}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#1B262C]">Scrumboard</h1>
        <button
          className="px-5 py-2 bg-[#0077B6] text-white font-semibold rounded-lg hover:bg-[#023E8A] transition flex items-center justify-center"
          onClick={() => setShowModal(true)}
        >
          {actionLoading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : null}
          Add Task
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg shadow bg-[#F1F5F9] animate-pulse h-80" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {["todo", "accepted", "review", "done"].map((status) => (
            <div key={status} className="bg-[#F1F5F9] rounded-lg p-4 shadow-lg flex flex-col">
              <h3
                className={`text-white font-semibold py-2 px-3 rounded mb-3 text-center ${
                  status === "todo"
                    ? "bg-[#FF6B6B]"
                    : status === "accepted"
                    ? "bg-[#FFD93D]"
                    : status === "review"
                    ? "bg-[#4ECDC4]"
                    : "bg-[#1B262C]"
                }`}
              >
                {status.toUpperCase()}
              </h3>
              {tasks.filter((t) => t.status === status).length === 0 ? (
                <p className="text-center text-[#495057] text-sm mt-4">No tasks</p>
              ) : (
                tasks
                  .filter((t) => t.status === status)
                  .map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      status={status}
                      handleStatusChange={handleStatusChange}
                      handleDelete={handleDelete}
                      actionLoading={actionLoading}
                    />
                  ))
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#00000050] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold text-[#1B262C] mb-4">Add Task</h2>
            <input
              placeholder="Task Name"
              className="w-full p-2 border border-[#CBD5E1] rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border border-[#CBD5E1] rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <select
              className="w-full p-2 border border-[#CBD5E1] rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <select
              className="w-full p-2 border border-[#CBD5E1] rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <select
              className="w-full p-2 border border-[#CBD5E1] rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="w-full p-2 border border-[#CBD5E1] rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-[#E0E0E0] text-[#1B262C] rounded hover:bg-[#CBD5E1] transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#0077B6] text-white rounded hover:bg-[#023E8A] transition flex items-center justify-center"
                onClick={handleAddTask}
              >
                {actionLoading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                )}
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// TaskCard component
function TaskCard({ task, status, handleStatusChange, handleDelete, actionLoading }: any) {
  const [seconds, setSeconds] = useState(task.timeSpent || 0);

  useEffect(() => {
    let interval: number;
    if (status === "accepted") {
      interval = window.setInterval(() => setSeconds((prev: number) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-4 border-l-4 border-[#0077B6] hover:shadow-lg transition relative">
      <p className="font-bold text-[#1B262C] text-sm mb-1">Project: {task.project.name}</p>
      <h4 className="font-semibold text-[#1B262C] text-base mb-1">{task.name}</h4>
      <p className="text-[#495057] text-sm mb-1">{task.description}</p>
      <p className="text-[#495057] text-xs mb-1">Assigned: {task.user?.name || "Unassigned"}</p>
      <p className="text-[#495057] text-xs mb-1">Difficulty: {task.difficulty}</p>

      {status === "accepted" && (
        <p className="text-[#0077B6] font-semibold text-xs mb-1">Timer: {formatTime(seconds)}</p>
      )}
      {status === "done" && (
        <p className="text-[#0077B6] font-semibold text-xs mb-1">Time Spent: {formatTime(task.timeSpent)}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {status === "todo" && (
          <button
            className="px-3 py-1 bg-[#0077B6] text-white rounded hover:bg-[#023E8A] transition flex items-center justify-center"
            onClick={() => handleStatusChange(task, "accepted")}
            disabled={actionLoading}
          >
            {actionLoading && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>}
            Accept
          </button>
        )}
        {status === "accepted" && (
          <button
            className="px-3 py-1 bg-[#FFD93D] text-black rounded hover:bg-[#FFC300] transition flex items-center justify-center"
            onClick={() => handleStatusChange(task, "review", seconds)}
            disabled={actionLoading}
          >
            {actionLoading && <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin mr-1"></span>}
            Finish
          </button>
        )}
        {status === "review" && (
          <button
            className="px-3 py-1 bg-[#4ECDC4] text-white rounded hover:bg-[#38B2AC] transition flex items-center justify-center"
            onClick={() => handleStatusChange(task, "done")}
            disabled={actionLoading}
          >
            {actionLoading && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>}
            Finish Review
          </button>
        )}
        {status === "done" && (
          <button
            className="px-3 py-1 bg-[#FF6B6B] text-white rounded hover:bg-[#E63946] transition flex items-center justify-center"
            onClick={() => handleDelete(task.id)}
            disabled={actionLoading}
          >
            {actionLoading && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span>}
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
