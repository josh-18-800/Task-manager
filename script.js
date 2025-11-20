const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const clearTasksBtn = document.getElementById('clearTasksBtn');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Load theme
window.onload = function () {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        themeToggle.checked = true;
    }
    renderTasks();
};

// Toggle Theme
themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Add Task
addTaskBtn.addEventListener("click", () => {
    if (taskInput.value.trim() === "") return alert("Enter a task!");

    const newTask = {
        text: taskInput.value,
        completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
});

// Render Tasks
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span onclick="toggleComplete(${index})" class="${task.completed ? "completed" : ""}">
                ${task.text}
            </span>
            <button onclick="deleteTask(${index})" class="delete-btn">X</button>
        `;
        taskList.appendChild(li);
    });
}

// Toggle Complete
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Delete Task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Clear All Tasks
clearTasksBtn.addEventListener("click", () => {
    if (confirm("Clear all tasks?")) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
});

// Save to LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
