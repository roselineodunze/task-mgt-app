document.addEventListener("DOMContentLoaded", async () => {
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const sliderImages = document.querySelectorAll(".slide");
  const authForms = document.querySelectorAll(".auth");
  const fullnameField = document.getElementById("fullnameGroup");
  const fullnameInput = document.getElementById("fullname");
  const confirmPasswordField = document.getElementById("confirmPasswordGroup");
  const confitmPasswordInput = document.getElementById("confirmPassword");
  const form = document.getElementById("authForm");
  const errorMessage = document.getElementById("error-message");
  const successMessage = document.getElementById("success-message");
  const taskForm = document.getElementById("taskForm");
  const taskFormInput = document.querySelector("#taskForm input");
  const taskList = document.getElementById("taskList");
  const taskLength = document.querySelector("#taskLength i");

  let currentSlideIndex = 0;
  let isSignup = true;
  let isEdit = false;
  let taskIdToEdit = null

  loadTasks();

  setInterval(() => {
    if (currentSlideIndex < sliderImages.length - 1) {
      currentSlideIndex += 1;
    } else {
      currentSlideIndex = 0;
    }
    if (sliderWrapper) {
      sliderWrapper.style.transform = `translateX(-${currentSlideIndex * 50}%)`;
    }
  }, 4000);

  const updateFormMode = () => {
    fullnameField.style.display = isSignup ? "block" : "none";
    fullnameInput.disabled = isSignup ? false : true;

    confirmPasswordField.style.display = isSignup ? "block" : "none";
    confitmPasswordInput.disabled = isSignup ? false : true;
  };

  authForms.forEach((form) => {
    form.addEventListener("click", () => {
      authForms.forEach((f) => f.classList.remove("add-border"));
      form.classList.add("add-border");
      if (form.id === "login") {
        isSignup = false;
      } else if (form.id === "signup") {
        isSignup = true;
      }
      updateFormMode();
    });
  });

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      console.log("starting");

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      console.log(data);

      try {
        if (isSignup) {
          console.log("it is signup");
          if (data.confirmPassword !== data.password) {
            errorMessage.style.display = "block";
            errorMessage.textContent = "Password does not match";
            return;
          }
          console.log("Submitting data to server:", data);
          const response = await fetch(
            "http://localhost:3000/api/auth/signup",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          if (response.ok) {
            window.location.href = "todo-list.html";
          } else {
            console.error("Failed:", response.status);
          }
        } else {
          const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (response.ok) {
            window.location.href = "todo-list.html";
          } else {
            console.error("Failed:", response.status);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }

  //todo list
  if (taskForm) {
    taskForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(taskForm);
      const data = Object.fromEntries(formData.entries());
      console.log(data);

      try {
        if (!isEdit) {
          console.log("it is new");
          const response = await fetch("http://localhost:3000/api/todos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (response.ok) {
            taskFormInput.value = "";
            loadTasks();
            successMessage.style.display = "block";
            successMessage.textContent = "Task added successfully!";
            setInterval(() => {
              successMessage.textContent = "";
              successMessage.style.display = "none";
            }, 2000);
          } else {
            console.error("Failed:", response.status);
          }
        } else {
          data.id = taskIdToEdit;
          await handleEditTask(data);
          isEdit = false
          taskIdToEdit = null
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });

    const handleEditTask = async (data) => {
      const response = await fetch("http://localhost:3000/api/todos/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log("okay");
        taskFormInput.value = "";
        loadTasks();
        successMessage.style.display = "block";
        successMessage.textContent = "Task updated successfully!";
        setInterval(() => {
          successMessage.textContent = "";
          successMessage.style.display = "none";
        }, 2000);
      } else {
        console.error("Failed:", response.status);
      }
    };

    window.handleCompletedTask = async function (checkbox, task) {
      const isChecked = checkbox.checked;
      const newData = {
        id: task.id,
        task: task.task,
        isCompleted: isChecked ? 1 : 0,
      };
      console.log(newData);
      try {
        const response = await fetch(`http://localhost:3000/api/todos/edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        });
        if (response.ok) {
          loadTasks();
        } else {
          console.error("Failed:", response.status);
        }
      } catch (err) {
        console.log("err", err);
      }
    };

    document.addEventListener("change", function (e) {
      if (e.target.matches('input[type="checkbox"][data-id]')) {
        const checkbox = e.target;
        const id = parseInt(checkbox.dataset.id);
        const taskText = checkbox.dataset.task;

        const task = {
          id,
          task: taskText,
        };

        handleCompletedTask(checkbox, task);
      }
    });

    document.addEventListener("click", function (e) {
      const editTask = e.target.closest(".task-item");
      if (editTask) {
        isEdit = true;
        taskIdToEdit = editTask.dataset.id;
        const taskText = editTask.dataset.task;
        taskFormInput.value = taskText
      }
    });

    document.addEventListener("click", async function (e) {
      const deleteIcon = e.target.closest(".delete-btn");
      if (deleteIcon) {
        const taskId = deleteIcon.dataset.id;
        if (!taskId) return;

        const confirmed = confirm("Are you sure you want to delete this task?");
        if (!confirmed) return;

        try {
          const data = {
            id: taskId,
          };
          const response = await fetch(
            `http://localhost:3000/api/todos/delete`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (response.ok) {
            loadTasks(); // Refresh the list
          } else {
            console.error("Failed to delete:", response.status);
          }
        } catch (err) {
          console.error("Delete error:", err);
        }
      }
    });
  }

  async function loadTasks() {
    try {
      const response = await fetch("http://localhost:3000/api/todos");
      const tasks = await response.json();

      taskList.innerHTML = tasks
        .map(
          (task) => `
        <div
              class="w-full border rounded-md flex items-center justify-center gap-2 h-10 px-3 my-3"
            >
              <input
                type="checkbox"
                ${task.isCompleted === 1 ? "checked" : ""}
                class="text-white bg-gray-600 border border-black h-4 w-4"
                data-id="${task.id}"
                data-task="${task.task.replace(/"/g, "&quot;")}"
                
              />
              <p class="flex-1 text-sm font-medium task-item cursor-pointer" 
                data-id="${task.id}"
                data-task="${task.task.replace(/"/g, "&quot;")}">
                ${task.task}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="delete-btn lucide lucide-x-icon lucide-x cursor-pointer"
                data-id="${task.id}"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </div>
            
        `
        )
        .join("");
      const completedTasks = tasks.filter((t) => t.isCompleted === 0);
      taskLength.textContent = `Your remaining todos: ${completedTasks.length}`;
    } catch (err) {
      console.log("error:", err);
    }
  }
});
