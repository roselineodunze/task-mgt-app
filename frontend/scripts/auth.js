document.addEventListener("DOMContentLoaded", async () => {
    const authForms = document.querySelectorAll(".auth");
    const fullnameField = document.getElementById("fullnameGroup");
    const fullnameInput = document.getElementById("fullname");
    const confirmPasswordField = document.getElementById("confirmPasswordGroup");
    const confitmPasswordInput = document.getElementById("confirmPassword");
    const form = document.getElementById("authForm");
    const errorMessage = document.getElementById("error-message");
  
    let isSignup = true;
  
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
              console.error("Failed to get user:", response.status);
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
})