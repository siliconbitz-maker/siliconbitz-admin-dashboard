"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type User = { id: string; name: string };
type Project = { id: string; name:string };
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
  const [form, setForm] = useState({
    name: "",
    description: "",
    difficulty: "Easy",
    userId: "",
    projectId: "",
    deadline: "",
  });

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate weekly time for current user
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
    fetchData();
  };

  const handleStatusChange = async (
    task: Task,
    newStatus: Task["status"],
    elapsedTime = 0
  ) => {
    await axios.put("/api/tasks", {
      id: task.id,
      status: newStatus,
      elapsedTime,
    });
    fetchData();
  };

  const handleDelete = async (taskId: string) => {
    await axios.delete("/api/tasks", { data: { id: taskId } });
    fetchData();
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
    <div className="p-6">
      {/* Weekly Time */}
      {currentUser && (
        <div className="mb-4 p-2 bg-gray-100 rounded">
          <p className="text-sm font-semibold">
            Hello {currentUser.name}, you spent this week: {formatTime(weeklyTime)}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Scrumboard</h1>
        <button
          className="px-4 py-2 bg-[#00008A] text-white rounded hover:bg-green-700"
          onClick={() => setShowModal(true)}
        >
          Add Task
        </button>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#00000050] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl  font-semibold mb-4">Add Task</h2>
            <input
              placeholder="Task Name"
              className="w-full p-2 border mb-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border mb-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <select
              className="w-full p-2 border mb-2"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <select
              className="w-full p-2 border mb-2"
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
              className="w-full p-2 border mb-2"
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
              className="w-full p-2 border mb-4"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#00008A] text-white rounded hover:bg-gray-400"
                onClick={handleAddTask}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Columns */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {["todo", "accepted", "review", "done"].map((status) => (
          <div key={status} className="p-4 rounded">
            <h3 className="text-lg bg-[#CCFFCC] py-2 px-3 text-black font-semibold capitalize mb-2">
              {status}
            </h3>
            {tasks
              .filter((t) => t.status === status)
              .map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  status={status}
                  handleStatusChange={handleStatusChange}
                  handleDelete={handleDelete}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// TaskCard component
function TaskCard({ task, status, handleStatusChange, handleDelete }: any) {
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
    <div
      className="relative bg-[#ADEBB3] text-white p-4 mb-4 shadow-lg"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%)" }}
    >
      {/* Icon */}
      <div className="absolute top-2 right-2 bg-white text-black rounded-full p-1 shadow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <p className="font-bold text-black text-lg mb-1">#: {task.project.name}</p>
      <h4 className="font-bold text-black text-sm mb-1">Task: {task.name}</h4>
      <p className="text-sm text-black mb-1">Tools/Keywords: {task.description}</p>
      <p className="text-xs text-black mb-1">Assign: {task.user?.name || "Unassigned"}</p>
      <p className="text-xs text-black mb-1">Difficulty: {task.difficulty}</p>

      {/* Timer */}
      {status === "accepted" && (
        <p className="text-xs font-semibold text-black mb-2">Timer: {formatTime(seconds)}</p>
      )}
      {status === "done" && (
        <p className="text-xs font-semibold text-black mb-2">Time Spent: {formatTime(task.timeSpent)}</p>
      )}

      <div className="flex justify-between mt-2 flex-wrap gap-2">
        {status === "todo" && (
          <button
            className="px-3 py-1 bg-[#4052D6] text-white rounded hover:bg-blue-600 transition"
            onClick={() => handleStatusChange(task, "accepted")}
          >
            Accept +
          </button>
        )}
        {status === "accepted" && (
          <button
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            onClick={() => handleStatusChange(task, "review", seconds)}
          >
            Finish
          </button>
        )}
        {status === "review" && (
          <button
            className="px-3 py-1 bg-[#4052D6] text-white rounded hover:bg-green-600 transition"
            onClick={() => handleStatusChange(task, "done")}
          >
            Finish Review
          </button>
        )}
        {status === "done" && (
          <button
            className="px-3 py-1 bg-[#4052D6] text-white rounded hover:bg-red-600 transition"
            onClick={() => handleDelete(task.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
