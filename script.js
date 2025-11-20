// Firebase Config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const clearBtn = document.getElementById('clearTasksBtn');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');

// Load tasks
window.onload = () => {
    loadTasks();
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeToggle.checked = true;
    }
};

themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Add task
addTaskBtn.addEventListener('click', addTask);
function addTask() {
    const text = taskInput.value.trim();
    if (!text) return alert('Enter a task');
    
    db.collection("tasks").add({ text, completed: false });
    taskInput.value = "";
    loadTasks();
}

// Load tasks
async function loadTasks() {
    taskList.innerHTML = "";
    const snapshot = await db.collection("tasks").get();
    snapshot.forEach(doc => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span onclick="toggleComplete('${doc.id}', ${doc.data().completed})" class="${doc.data().completed ? 'completed' : ''}">${doc.data().text}</span>
            <button onclick="deleteTask('${doc.id}')" class="delete-btn">X</button>`;
        taskList.appendChild(li);
    });
}

// Toggle complete
function toggleComplete(id, state) {
    db.collection("tasks").doc(id).update({ completed: !state });
    loadTasks();
}

// Delete task
function deleteTask(id) {
    db.collection("tasks").doc(id).delete();
    loadTasks();
}

// Clear all tasks
clearBtn.addEventListener('click', async () => {
    if (confirm('Clear all tasks?')) {
        const snapshot = await db.collection("tasks").get();
        snapshot.forEach(doc => doc.ref.delete());
        loadTasks();
    }
});
