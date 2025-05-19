import { HTTP_GET, Loader, clearContainer } from "./main.js";

const MAIN = document.querySelector(".Main__Container");
const pageTitle = document.querySelector("#pageTitle");
const loader = Loader();

let filters = [];

const getCustomers = async () => {
  let params = "?";

  filters.map((filter) => {
    params += `${filter.filterName}=${filter.filterValue}&`;
  });

  return await HTTP_GET(`customer/${params}`);
};

export const buildCustomersList = async () => {
  pageTitle.textContent = "Clienti";
  clearContainer(MAIN);

  MAIN.appendChild(loader);
  const customers = await getCustomers();
  loader.remove();

  MAIN.append(genFilters(), genCustomerTable());
  loadDataTable(customers);
};

const genFilters = () => {
  const filterContainer = document.createElement("div");
  const firstNameFilter = document.createElement("div");
  const firstNameLabel = document.createElement("label");
  const firstNameInput = document.createElement("input");

  const lastNameFilter = document.createElement("div");
  const lastNameLabel = document.createElement("label");
  const lastNameInput = document.createElement("input");
  const birthDateFilter = document.createElement("div");
  const birthDateLabel = document.createElement("label");
  const birthDateInput = document.createElement("input");
  const phoneFilter = document.createElement("div");
  const phoneLabel = document.createElement("label");
  const phoneInput = document.createElement("input");
  const emailFilter = document.createElement("div");
  const emailLabel = document.createElement("label");
  const emailInput = document.createElement("input");
  const submit = document.createElement("input");

  filterContainer.className = "Filters__container";

  firstNameFilter.className = "Input__container";
  lastNameFilter.className = "Input__container";
  birthDateFilter.className = "Input__container";
  phoneFilter.className = "Input__container";
  emailFilter.className = "Input__container";
  firstNameInput.className = "Input__Text";
  lastNameInput.className = "Input__Text";
  birthDateInput.className = "Input__Text";
  phoneInput.className = "Input__Text";
  emailInput.className = "Input__Text";

  firstNameInput.id = "firstNameFilter";
  firstNameInput.placeholder = "Mario";
  firstNameLabel.textContent = "Nome";

  lastNameInput.id = "lastNameFilter";
  lastNameInput.placeholder = "Rossi";
  lastNameLabel.textContent = "Cognome";

  birthDateInput.id = "birthDateFilter";
  birthDateInput.type = "date";
  birthDateLabel.textContent = "Data di nascita";

  phoneInput.id = "phoneFilter";
  phoneInput.type = "tel";
  phoneInput.placeholder = "+391234567890";
  phoneLabel.textContent = "Telefono";

  emailInput.id = "emailFilter";
  emailInput.type = "email";
  emailInput.placeholder = "mario.rossi@mail.it";
  emailLabel.textContent = "Email";

  submit.className = "Btn__primary";
  submit.type = "submit";
  submit.value = "Cerca";

  submit.addEventListener("click", () => handleSubmitFilters());

  firstNameFilter.append(firstNameLabel, firstNameInput);
  lastNameFilter.append(lastNameLabel, lastNameInput);
  birthDateFilter.append(birthDateLabel, birthDateInput);
  phoneFilter.append(phoneLabel, phoneInput);
  emailFilter.append(emailLabel, emailInput);
  filterContainer.append(
    firstNameFilter,
    lastNameFilter,
    birthDateFilter,
    phoneFilter,
    emailFilter,
    submit
  );
  return filterContainer;
};

const genCustomerTable = () => {
  const tableContainer = document.createElement("div");
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  const tbody = document.createElement("tbody");

  tableContainer.className = "Table__container";

  const columns = ["Nome", "Cognome", "Data di nascita", "Telefono", "Email"];
  columns.map((columnName) => {
    const th = document.createElement("th");
    th.textContent = columnName;
    trHead.appendChild(th);
  });

  thead.appendChild(trHead);

  table.append(thead, tbody);
  tableContainer.appendChild(table);

  return tableContainer;
};

const loadDataTable = (customers) => {
  const tbody = document.querySelector("tbody");

  console.log(customers);

  customers.map((customer) => {
    const tr = document.createElement("tr");
    const firstName = document.createElement("td");
    const lastName = document.createElement("td");
    const birthDate = document.createElement("td");
    const phoneNumber = document.createElement("td");
    const email = document.createElement("td");

    firstName.textContent = customer.firstName;
    lastName.textContent = customer.lastName;
    birthDate.textContent = customer.birthDate;
    phoneNumber.textContent = customer.phoneNumber;
    email.textContent = customer.email;

    tr.append(firstName, lastName, birthDate, phoneNumber, phoneNumber, email);
    tbody.appendChild(tr);
  });
};

const handleSubmitFilters = async () => {
  filters = [];

  const firstName = document.querySelector("#firstNameFilter").value;
  const lastName = document.querySelector("#lastNameFilter").value;
  const birthDate = document.querySelector("#birthDateFilter").value;
  const phone = document.querySelector("#phoneFilter").value;
  const mail = document.querySelector("#emailFilter").value;

  if (firstName)
    filters.push({
      filterName: "firstName",
      filterValue: firstName,
    });

  if (lastName)
    filters.push({
      filterName: "lastName",
      filterValue: lastName,
    });

  if (birthDate)
    filters.push({
      filterName: "birthDate",
      filterValue: birthDate,
    });

  if (phone)
    filters.push({
      filterName: "phoneNumber",
      filterValue: phone,
    });

  if (mail)
    filters.push({
      filterName: "email",
      filterValue: mail,
    });

  clearContainer(document.querySelector("tbody"));
  loadDataTable(await getCustomers());
};
