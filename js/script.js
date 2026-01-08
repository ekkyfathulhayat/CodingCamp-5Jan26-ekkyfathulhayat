// ELEMEN DARI HTML

const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const completedCount = document.getElementById("completedCount");
const progressPercent = document.getElementById("progressPercent");


// DATA TASK (sementara)

let tasks = [];

let currentFilter = "all"; 


// EVENT: KLIK TOMBOL +

addTaskBtn.addEventListener("click", function () {
  const taskText = taskInput.value;
  const taskDate = dateInput.value;

  // Validasi input
  if (taskText === "") {
    alert("Task tidak boleh kosong!");
    return;
  }

  // Object task
  const task = {
    id: Date.now(),
    title: taskText,
    date: taskDate,
    status: "pending"
  };

  tasks.push(task);

  renderTasks();
  updateTotal();
  updatePending();
  updateProgress();

  // Reset input
  taskInput.value = "";
  dateInput.value = "";
});
  // TASK KE HTML

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => task.status === "pending");
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.status === "completed");
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<div class="no-task">No task found</div>`;
    return;
  }

  filteredTasks.forEach(function (task) {
    const taskRow = document.createElement("div");
    taskRow.className = "table-header";

    taskRow.innerHTML = `
      <span>${task.title}</span>
      <span>${task.date || "No due date"}</span>
      <span>
        ${
          task.status === "pending"
            ? `<span class="status pending">Pending</span>`
            : `<span class="status completed">Completed</span>`
        }
      </span>
      <span>
        ${
          task.status === "pending"
            ? `
              <button class="complete-btn" data-id="${task.id}">
                <span class="material-symbols-outlined">check</span>
              </button>
              <button class="delete-one" data-id="${task.id}">
                <span class="material-symbols-outlined">delete</span>
              </button>
            `
            : `<span class="done-text">Done</span>`
        }
      </span>
    `;

    taskList.appendChild(taskRow);
  });

  setupDeleteButtons();
  setupCompleteButtons();
}

function setupDeleteButtons() {
  const deleteButtons = document.querySelectorAll(".delete-one");

  deleteButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const taskId = this.getAttribute("data-id");
      deleteTask(taskId);
    });
  });
}

function setupCompleteButtons() {
  const completeButtons = document.querySelectorAll(".complete-btn");

  completeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const taskId = this.getAttribute("data-id");
      completeTask(taskId);
    });
  });
}

// Fungsi Complete Task
function completeTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id == id) {
      task.status = "completed";
    }
    return task;
  });

  renderTasks();
  updatePending();
  updateCompleted();
  updateProgress();
}

// UPDATE JUMLAH TASK

function updateTotal() {
  totalCount.textContent = tasks.length;
}


// UPDATE JUMLAH PENDING

function updatePending() {
  const pendingTasks = tasks.filter(function (task) {
    return task.status === "pending";
  });

  pendingCount.textContent = pendingTasks.length;
}

// UPDATE JUMLAH COMPLETE
function updateCompleted() {
  const completedTasks = tasks.filter(function (task) {
    return task.status === "completed";
  });

  completedCount.textContent = completedTasks.length;
}

// UPDATE PERSENTASE PROGRESS
function updateProgress() {
  if (tasks.length === 0) {
    progressPercent.textContent = "0%";
    return;
  }

  const completedTasks = tasks.filter(function (task) {
    return task.status === "completed";
  });

  const percent = Math.round(
    (completedTasks.length / tasks.length) * 100
  );

  progressPercent.textContent = percent + "%";
}

// Menghapus Task dari Array

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id != id;
  });

renderTasks();
updateTotal();
updatePending();
updateCompleted();
updateProgress();

}

// Tombol delete all

deleteAllBtn.addEventListener("click", function () {
  if (tasks.length === 0) {
    alert("Tidak ada task untuk dihapus.");
    return;
  }

  const confirmDelete = confirm("Apakah kamu yakin ingin menghapus semua task?");

  if (confirmDelete) {
    tasks = [];
    renderTasks();
    updateTotal();
    updatePending();
    updateCompleted();
    updateProgress();
  }
});

// FILTER BUTTON
const filterSelect = document.getElementById("filterSelect");

filterSelect.addEventListener("change", function () {
  currentFilter = this.value;
  renderTasks();
});


