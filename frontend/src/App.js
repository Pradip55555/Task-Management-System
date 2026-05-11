import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // FETCH TASKS
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    setLoading(true);

    axios
      .get("http://127.0.0.1:8000/task/")
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // ADD + UPDATE TASK
  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Task cannot be empty");
      return;
    }

    if (editId) {
      axios
        .put(`http://127.0.0.1:8000/task/${editId}/`, {
          title: title,
          completed: false,
        })
        .then(() => {
          fetchTasks();
          setTitle("");
          setEditId(null);
        });
    } else {
      axios
        .post("http://127.0.0.1:8000/task/", {
          title: title,
          completed: false,
        })
        .then(() => {
          fetchTasks();
          setTitle("");
        });
    }
  };

  // DELETE TASK
  const deleteTask = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/task/${id}/`)
      .then(() => fetchTasks());
  };

  // EDIT TASK
  const editTask = (task) => {
    setTitle(task.title);
    setEditId(task.id);
  };

  // TOGGLE COMPLETE
  const toggleComplete = (task) => {
    axios
      .put(`http://127.0.0.1:8000/task/${task.id}/`, {
        title: task.title,
        completed: !task.completed,
      })
      .then(() => fetchTasks());
  };

  // FILTER TASKS
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "#1e293b",
          padding: "30px",
          borderRadius: "15px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          🚀 Smart Task Manager
        </h1>

        <p style={{ textAlign: "center", color: "#94a3b8" }}>
          Total Tasks: {tasks.length}
        </p>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "none",
          }}
        />

        {/* ADD TASK */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "none",
            }}
          />

          <button
            onClick={handleSubmit}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        <hr style={{ margin: "20px 0" }} />

        {/* LOADING */}
        {loading && <p>Loading...</p>}

        {/* TASK LIST */}
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            style={{
              background: "#334155",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3
                style={{
                  textDecoration: task.completed
                    ? "line-through"
                    : "none",
                }}
              >
                {task.title}
              </h3>

              <span
                style={{
                  color: task.completed
                    ? "#22c55e"
                    : "#facc15",
                }}
              >
                {task.completed
                  ? "Completed"
                  : "Pending"}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => toggleComplete(task)}
                style={{
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ✓
              </button>

              <button
                onClick={() => editTask(task)}
                style={{
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {!loading && filteredTasks.length === 0 && (
          <p style={{ textAlign: "center" }}>
            No tasks found
          </p>
        )}
      </div>
    </div>
  );
}

export default App;