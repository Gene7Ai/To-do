const input = document.querySelector("#todo-input");
const addBtn = document.querySelector("#add-btn");
const todoList = document.querySelector("#todo-list");

const filterAllBtn = document.querySelector("#filter-all");
const filterActiveBtn = document.querySelector("#filter-active");
const filterCompletedBtn = document.querySelector("#filter-completed");
const totalCount = document.querySelector("#total-count");
const activeCount = document.querySelector("#active-count");
const completedCount = document.querySelector("#completed-count");

const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];

const hadMissingIds = savedTodos.some(function (todo) {
  return !todo.id;
});

let todos = savedTodos.map(function (todo) {
  return {
    id: todo.id || generateId(),
    text: todo.text,
    completed: !!todo.completed
  };
});

let currentFilter = "all";

function generateId() {
  return Date.now().toString() + Math.random().toString(16).slice(2);
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function updateStats() {
  const total = todos.length;
  const active = todos.filter(function (todo) {
    return !todo.completed;
  }).length;
  const completed = todos.filter(function (todo) {
    return todo.completed;
  }).length;

  totalCount.textContent = total;
  activeCount.textContent = active;
  completedCount.textContent = completed;
}

function updateFilterButtons() {
  filterAllBtn.classList.remove("active");
  filterActiveBtn.classList.remove("active");
  filterCompletedBtn.classList.remove("active");

  if (currentFilter === "all") {
    filterAllBtn.classList.add("active");
  } else if (currentFilter === "active") {
    filterActiveBtn.classList.add("active");
  } else {
    filterCompletedBtn.classList.add("active");
  }
}

function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter(function (todo) {
      return !todo.completed;
    });
  }

  if (currentFilter === "completed") {
    return todos.filter(function (todo) {
      return todo.completed;
    });
  }

  return todos;
}

function renderTodos() {
  todoList.innerHTML = "";
  updateStats();

  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "empty-state";
    emptyLi.innerHTML = `
      <strong>这里还是空的</strong>
      <span>先添加一条任务试试吧。</span>
    `;
    todoList.appendChild(emptyLi);
    updateFilterButtons();
    return;
  }

  filteredTodos.forEach(function (todo) {
    const li = document.createElement("li");

    if (todo.completed) {
      li.classList.add("completed");
    }

    const span = document.createElement("span");
    span.textContent = todo.text;

    const actions = document.createElement("div");
    actions.className = "actions";

    const completeBtn = document.createElement("button");
    completeBtn.textContent = todo.completed ? "取消" : "完成";
    completeBtn.className = "complete-btn";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "删除";
    deleteBtn.className = "delete-btn";

    completeBtn.addEventListener("click", function () {
      const realIndex = todos.findIndex(function (item) {
        return item.id === todo.id;
      });

      if (realIndex !== -1) {
        todos[realIndex].completed = !todos[realIndex].completed;
        saveTodos();
        renderTodos();
      }
    });

    deleteBtn.addEventListener("click", function () {
      const realIndex = todos.findIndex(function (item) {
        return item.id === todo.id;
      });

      if (realIndex !== -1) {
        todos.splice(realIndex, 1);
        saveTodos();
        renderTodos();
      }
    });

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);

    todoList.appendChild(li);
  });

  updateFilterButtons();
}

function addTodo() {
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("请输入任务内容");
    return;
  }

  todos.push({
    id: generateId(),
    text: taskText,
    completed: false
  });

  saveTodos();
  renderTodos();
  input.value = "";
  input.focus();
}

addBtn.addEventListener("click", addTodo);

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});

filterAllBtn.addEventListener("click", function () {
  currentFilter = "all";
  renderTodos();
});

filterActiveBtn.addEventListener("click", function () {
  currentFilter = "active";
  renderTodos();
});

filterCompletedBtn.addEventListener("click", function () {
  currentFilter = "completed";
  renderTodos();
});

if (hadMissingIds) {
  saveTodos();
}

renderTodos();