import {
  HTTP_GET,
  HTTP_POST,
  HTTP_PUT,
  Loader,
  clearContainer,
  genIcon,
  genInputField,
  genModal,
  genTable,
  MODAL,
  errorHandle,
} from "./main.js";

const MAIN = document.querySelector(".Main__Container");
const APP_CONTAINER = document.querySelector(".Container");
const pageTitle = document.querySelector("#pageTitle");

const loader = Loader();

const getUsers = async () => {
  return await HTTP_GET(`user/`);
};

export const buildUsersList = async () => {
  pageTitle.textContent = "Utenti";

  clearContainer(MAIN);
  MAIN.appendChild(loader);
  const users = await getUsers();
  loader.remove();

  const tableColumns = [
    "Username",
    "Nome e Cognome",
    "Email",
    "Ruolo",
    "Azioni",
  ];

  const tableHeader = document.createElement("div");
  tableHeader.className = "Table__header";

  const newUserBtn = document.createElement("button");
  newUserBtn.className = "Btn primary";
  newUserBtn.textContent = "Nuovo utente";
  newUserBtn.appendChild(genIcon("add"));

  const form = await genNewUserForm();

  newUserBtn.addEventListener("click", () =>
    APP_CONTAINER.appendChild(genModal("Crea utente", form))
  );

  tableHeader.append(newUserBtn);
  MAIN.append(tableHeader, genTable(tableColumns));

  loadDataTableUsers(users);
};

const loadDataTableUsers = (users) => {
  const tbody = document.querySelector("tbody");

  users.forEach((user) => {
    const tr = document.createElement("tr");

    const username = document.createElement("td");
    const fullName = document.createElement("td");
    const email = document.createElement("td");
    const role = document.createElement("td");
    const actions = document.createElement("td");

    username.textContent = user.username;
    fullName.textContent = `${user.firstName} ${user.lastName}`;
    email.textContent = user.email;
    role.textContent = user.role;

    const editBtn = document.createElement("button");
    editBtn.className = "Btn grey";
    editBtn.textContent = "Modifica ruolo";

    editBtn.addEventListener("click", () => {
      const form = genEditUserRoleForm(user);
      APP_CONTAINER.appendChild(genModal("Modifica ruolo utente", form));
    });

    actions.appendChild(editBtn);

    tr.append(username, fullName, email, role, actions);
    tbody.appendChild(tr);
  });
};

const genNewUserForm = () => {
  const form = document.createElement("div");
  const errorContainer = document.createElement("div");
  const row = document.createElement("div");
  const actionButtons = document.createElement("div");

  row.className = "Row";
  actionButtons.className = "Action__buttons";

  const firstLastNameRow = document.createElement("div");
  firstLastNameRow.className = "Row";

  const firstNameInput = genInputField(
    "Nome",
    "text",
    "firstNameInput",
    "Mario"
  );
  const lastNameInput = genInputField(
    "Cognome",
    "text",
    "lastNameInput",
    "Rossi"
  );

  firstLastNameRow.append(firstNameInput, lastNameInput);

  const usernamePasswordRow = document.createElement("div");
  usernamePasswordRow.className = "Row";

  const usernameInput = genInputField(
    "Username",
    "text",
    "usernameInput",
    "mario.rossi"
  );
  const passwordInput = genInputField(
    "Password",
    "password",
    "passwordInput",
    ""
  );

  usernamePasswordRow.append(usernameInput, passwordInput);

  const emailRoleRow = document.createElement("div");
  emailRoleRow.className = "Row";

  const emailInput = genInputField(
    "Email",
    "email",
    "emailInput",
    "mario.rossi@email.it"
  );

  const roleContainer = document.createElement("div");
  const roleLabel = document.createElement("label");

  roleContainer.className = "Input__container w-100";

  roleLabel.textContent = "Ruolo";
  roleLabel.htmlFor = "roleInput";

  const roleSelector = document.createElement("select");
  roleSelector.className = "Input__Text";
  roleSelector.id = "roleInput";

  ROLES.forEach((role) => {
    const option = document.createElement("option");
    option.text = role.name;
    option.value = role.value;
    roleSelector.appendChild(option);
  });

  roleContainer.append(roleLabel, roleSelector);

  emailRoleRow.append(emailInput, roleContainer);

  const cancelBtn = document.createElement("button");
  const createBtn = document.createElement("button");
  cancelBtn.textContent = "Annulla";
  createBtn.textContent = "Crea";
  cancelBtn.className = "Btn secondary";
  createBtn.className = "Btn primary";

  cancelBtn.addEventListener("click", () => MODAL.remove());
  createBtn.addEventListener("click", async () => {
    const firstName = document.querySelector("#firstNameInput").value;
    const lastName = document.querySelector("#lastNameInput").value;
    const username = document.querySelector("#usernameInput").value;
    const password = document.querySelector("#passwordInput").value;
    const email = document.querySelector("#emailInput").value;
    const role = roleSelector.value;

    if (!firstName || !lastName || !username || !password || !email) {
      clearContainer(errorContainer);
      errorContainer.appendChild(errorHandle("ALL_FIELDS_ARE_REQUIRED"));
      return;
    }

    const newUser = {
      firstName,
      lastName,
      username,
      password,
      email,
      role,
    };

    try {
      await HTTP_POST("auth/register", newUser);
      MODAL.remove();
      clearContainer(document.querySelector("tbody"));
      const users = await getUsers();
      loadDataTableUsers(users);
    } catch (e) {
      clearContainer(errorContainer);
      errorContainer.appendChild(errorHandle(`ADMIN_${e.error}`));
    }
  });

  actionButtons.append(cancelBtn, createBtn);
  form.append(
    firstLastNameRow,
    usernamePasswordRow,
    emailRoleRow,
    errorContainer,
    actionButtons
  );
  return form;
};

const genEditUserRoleForm = (user) => {
  const form = document.createElement("div");
  const roleRow = document.createElement("div");
  const actionButtons = document.createElement("div");

  roleRow.className = "Row";
  actionButtons.className = "Action__buttons";

  const roleContainer = document.createElement("div");
  roleContainer.className = "Input__container w-100";

  const roleLabel = document.createElement("label");

  roleLabel.textContent = "Ruolo";
  roleLabel.htmlFor = "roleInput";

  const roleSelector = document.createElement("select");
  roleSelector.className = "Input__Text";
  roleSelector.id = "roleInput";

  ROLES.forEach((role) => {
    const option = document.createElement("option");
    option.text = role.name;
    option.value = role.value;
    roleSelector.appendChild(option);
  });

  roleContainer.append(roleLabel, roleSelector);
  roleRow.append(roleContainer);

  const cancelBtn = document.createElement("button");
  const saveBtn = document.createElement("button");

  cancelBtn.textContent = "Annulla";
  saveBtn.textContent = "Salva";

  cancelBtn.className = "Btn secondary";
  saveBtn.className = "Btn primary";

  cancelBtn.addEventListener("click", () => MODAL.remove());
  saveBtn.addEventListener("click", async () => {
    try {
      await HTTP_PUT(`user/${user.id}`, { role: roleInput.value.trim() });
      MODAL.remove();
      clearContainer(document.querySelector("tbody"));
      const users = await getUsers();
      loadDataTableUsers(users);
    } catch (e) {
      const error = document.createElement("p");
      error.className = "Error__message";
      error.textContent = e.description || "Errore nella modifica del ruolo.";
      form.insertBefore(error, actionButtons);
    }
  });

  actionButtons.append(cancelBtn, saveBtn);
  form.append(roleRow, actionButtons);

  return form;
};

const ROLES = [
  {
    name: "Admin",
    value: "ADMIN",
  },
  {
    name: "Meccanico",
    value: "MECHANIC",
  },
  {
    name: "Accettazione",
    value: "ACCEPTANCE_AGENT",
  },
  {
    name: "Magazziniere",
    value: "WAREHOUSE_WORKER",
  },
  {
    name: "Cassiere",
    value: "CASHIER",
  },
];
