// 保存キー
const STORAGE_KEY = "day06-memo";

const EL = {
  input: document.getElementById("js-input"),
  addButton: document.getElementById("js-add-btn"),
  todoList: document.getElementById("js-list"),
};

// UUID（フォールバック付き）
const uuid = () =>
  globalThis.crypto && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);

/* Storage helpers */
function getTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function setTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/* DOM helpers */
function createTodoLI(todo) {
  const li = document.createElement("li");
  li.dataset.id = todo.id;

  const text = document.createElement("span");
  text.textContent = todo.text;
  text.className = "todo-text";

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "btn btn-del js-del";
  delBtn.setAttribute("aria-label", "削除");
  delBtn.textContent = "削除";

  li.appendChild(text);
  li.appendChild(delBtn);
  return li;
}

function render() {
  const todos = getTodos();
  EL.todoList.innerHTML = "";
  for (const t of todos) EL.todoList.appendChild(createTodoLI(t));
}

/* 追加 */
function saveTodo() {
  const text = EL.input.value.trim();
  if (!text) return;

  const todos = getTodos();
  const newTodo = { id: uuid(), text };
  todos.push(newTodo);
  setTodos(todos);

  EL.todoList.appendChild(createTodoLI(newTodo));
  EL.input.value = "";
  EL.input.focus();
}

/* 削除（イベント委譲） */
function handleListClick(e) {
  const btn = e.target.closest(".js-del");
  if (!btn) return;

  const li = btn.closest("li");
  const id = li.dataset.id; // ← 文字列のまま比較
  const todos = getTodos().filter((t) => t.id !== id);
  setTodos(todos);
  li.remove();
}

/* イベント */
EL.addButton.addEventListener("click", saveTodo);
EL.input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveTodo();
});
EL.todoList.addEventListener("click", handleListClick);
window.addEventListener("DOMContentLoaded", render);
