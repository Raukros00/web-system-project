import {
  Loader,
  HTTP_GET,
  HTTP_POST,
  getCookie,
  clearAllCookies,
} from "./main.js";

window.addEventListener("DOMContentLoaded", async () => {
  const token = getCookie("token");

  if (!token) {
    clearAllCookies();
    return;
  }

  try {
    await HTTP_GET("auth/profile");
    window.location.href = "/dashboard.html";
  } catch (err) {
    clearAllCookies;
  }
});

const login = (e) => {
  e.preventDefault();

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  document.querySelector("#loginCard").appendChild(Loader());

  if (document.querySelector(".Error__message")) {
    document.querySelector(".Error__message").remove();
  }

  HTTP_POST("auth/login", {
    username,
    password,
  })
    .then((data) => {
      if (data.token) {
        document.cookie = `token=${data.token}; path=/; Secure; SameSite=Strict`;
        window.location.href = "/dashboard.html";
      }
    })
    .catch((e) => {
      const error = document.createElement("p");
      error.className = "Error__message";
      error.textContent = "Errore durante l'autenticazione!";
      document.querySelector(".Input__wrapper").appendChild(error);
    })
    .finally(() => {
      document.querySelector("#loader").remove();
    });
};

document.querySelector("#loginForm").addEventListener("submit", login);
