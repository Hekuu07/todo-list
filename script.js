const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const emptyMessage = document.getElementById("emptyMessage");
const remainingCounter = document.getElementById("remainingCounter");

const filterButtons = document.querySelectorAll(".filter-btn");

// Загружаем задачи
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Текущий фильтр
let currentFilter = "all";

// Сохраняем задачи
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Отображаем задачи
function renderTasks() {
    taskList.innerHTML = "";

    // Фильтруем задачи
    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    // Показываем сообщение, если задач нет
    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");
        li.className = "task-item";

        // Чекбокс
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        // Текст задачи
        const span = document.createElement("span");
        span.textContent = task.text;

        // Отметка выполнения при нажатии на текст
        span.addEventListener("click", function() {
            task.completed = !task.completed;

            saveTasks();
            renderTasks();
        });

        if (task.completed) {
            span.classList.add("completed");
        }

        // Кнопка удаления с иконкой
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.className = "delete-btn";
        deleteBtn.title = "Удалить задачу";

        // Отметка выполнения
        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        // Удаление задачи
        deleteBtn.addEventListener("click", function() {
            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        li.append(checkbox, span, deleteBtn);
        taskList.appendChild(li);
    });

    updateCounter();
}

// Добавление задачи
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Введите задачу!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

// Счётчики
function updateCounter() {
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const remaining = total - completed;

    taskCounter.textContent =
        `${completed} выполнено из ${total}`;

    remainingCounter.textContent =
        `Осталось выполнить: ${remaining}`;
}

// Переключение фильтров
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        // Меняем активную кнопку
        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

// Кнопка добавления
addTaskBtn.addEventListener("click", addTask);

// Добавление через Enter
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

//Кнопка ENTER
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();

        if (taskInput.value.trim() !== "") {
            addTask();
        }
    }
});

// Первоначальная загрузка
renderTasks();