var taskInput = document.getElementById("new-task");
var addButton = document.getElementsByTagName("button")[0];
var incompleteTaskHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");

// Create a new task list item
var createNewTaskElement = function(taskString) {
  var listItem = document.createElement("li");

  var checkBox = document.createElement("input");
  var label = document.createElement("label");
  var editInput = document.createElement("input");
  var editButton = document.createElement("button");
  var deleteButton = document.createElement("button");

  checkBox.type = "checkbox";
  label.innerText = taskString;
  editInput.type = "text";
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
};

// Save tasks to localStorage
function saveTasks() {
  const incomplete = [];
  const complete = [];

  for (let i = 0; i < incompleteTaskHolder.children.length; i++) {
    const label = incompleteTaskHolder.children[i].querySelector("label").innerText;
    incomplete.push(label);
  }

  for (let i = 0; i < completedTasksHolder.children.length; i++) {
    const label = completedTasksHolder.children[i].querySelector("label").innerText;
    complete.push(label);
  }

  localStorage.setItem("incompleteTasks", JSON.stringify(incomplete));
  localStorage.setItem("completeTasks", JSON.stringify(complete));
}

// Load tasks from localStorage
function loadTasks() {
  const incomplete = JSON.parse(localStorage.getItem("incompleteTasks")) || [];
  const complete = JSON.parse(localStorage.getItem("completeTasks")) || [];

  incomplete.forEach(taskText => {
    const listItem = createNewTaskElement(taskText);
    incompleteTaskHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
  });

  complete.forEach(taskText => {
    const listItem = createNewTaskElement(taskText);
    const checkbox = listItem.querySelector("input[type=checkbox]");
    checkbox.checked = true;
    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);
  });
}

// Add task
var addTask = function() {
  var taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }
  var listItem = createNewTaskElement(taskText);
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  taskInput.value = "";
  saveTasks();
};

// Edit task
var editTask = function() {
  var listItem = this.parentNode;
  var editInput = listItem.querySelector("input[type=text]");
  var label = listItem.querySelector("label");
  var isEditMode = listItem.classList.contains("editMode");

  if (isEditMode) {
    label.innerText = editInput.value;
    saveTasks();
  } else {
    editInput.value = label.innerText;
  }

  listItem.classList.toggle("editMode");
};

// Delete task
var deleteTask = function() {
  var listItem = this.parentNode;
  var ul = listItem.parentNode;
  ul.removeChild(listItem);
  saveTasks();
};

// Task completed
var taskCompleted = function() {
  var listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
  saveTasks();
};

// Task incomplete
var taskIncomplete = function() {
  var listItem = this.parentNode;
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  saveTasks();
};

// Bind task events
var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
  var checkBox = taskListItem.querySelector("input[type=checkbox]");
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");

  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};



// Setup
addButton.addEventListener("click", addTask);
loadTasks(); // Load on page load
