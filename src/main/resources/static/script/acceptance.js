import {
  HTTP_GET,
  HTTP_POST,
  Loader,
  clearContainer,
  dateFormatter,
  genIcon,
} from "./main.js";

const MAIN = document.querySelector(".Main__Container");
const APP_CONTAINER = document.querySelector(".Container");
const pageTitle = document.querySelector("#pageTitle");

const loader = Loader();

let MODAL;
let filters = [];

/** CUSTOMERS SECTION **/

export const buildCustomersList = async () => {
  pageTitle.textContent = "Clienti";
  clearContainer(MAIN);

  MAIN.appendChild(loader);
  const customers = await getCustomers();
  loader.remove();

  const tableColumns = [
    "Nome",
    "Cognome",
    "Data di nascita",
    "Telefono",
    "Email",
  ];

  const tableHeader = document.createElement("div");
  const newCustomerBtn = document.createElement("button");

  tableHeader.className = "Table__header";
  newCustomerBtn.className = "Btn__primary";
  newCustomerBtn.append("Nuovo cliente", genIcon("add"));

  newCustomerBtn.addEventListener("click", () =>
    APP_CONTAINER.appendChild(genModal("Nuovo cliente", genNewCustomerForm()))
  );

  tableHeader.append(genCustomersFilters(), newCustomerBtn);

  MAIN.append(tableHeader, genTable(tableColumns));
  loadDataTableCustomer(customers);
};

const getCustomers = async () => {
  let params = "?";

  filters.map((filter) => {
    params += `${filter.filterName}=${filter.filterValue}&`;
  });

  return await HTTP_GET(`customer/${params}`);
};

const genNewCustomerForm = () => {
  const form = document.createElement("div");
  const callsignRow = document.createElement("div");
  const birthDatePhoneRow = document.createElement("div");
  const mailRow = document.createElement("div");
  const actionButtons = document.createElement("div");

  const cancelBtn = document.createElement("button");
  const createBtn = document.createElement("button");

  cancelBtn.textContent = "Annulla";
  createBtn.textContent = "Crea";

  cancelBtn.className = "Btn__secondary";
  createBtn.className = "Btn__primary";

  callsignRow.className = "Row";
  birthDatePhoneRow.className = "Row";
  mailRow.className = "Row";
  actionButtons.className = "Action__buttons";

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
  const birthDateInput = genInputField(
    "Data di nascita",
    "date",
    "birthDateInput",
    ""
  );
  const phoneNumberInput = genInputField(
    "Numero di telefono",
    "tel",
    "phoneNumberInput",
    "+391234567890"
  );
  const emailInput = genInputField(
    "Email",
    "mail",
    "emailInput",
    "mario.rossi@mail.it"
  );

  callsignRow.append(firstNameInput, lastNameInput);
  birthDatePhoneRow.append(birthDateInput, phoneNumberInput);
  mailRow.appendChild(emailInput);
  actionButtons.append(cancelBtn, createBtn);

  form.append(callsignRow, birthDatePhoneRow, mailRow, actionButtons);

  cancelBtn.addEventListener("click", () => MODAL.remove());
  createBtn.addEventListener("click", async () => {
    createCustomer()
      .then(() => {
        MODAL.remove();
        clearContainer(document.querySelector("tbody"));
        loadDataTableCustomer(getCustomers());
      })
      .catch((e) => {
        const error = document.createElement("p");
        error.className = "Error__message";
        error.textContent = e.description;
        form.insertBefore(error, actionButtons);
      });
  });

  return form;
};

const genCustomersFilters = () => {
  const filterContainer = document.createElement("div");
  const callsignFilter = document.createElement("div");
  const callsignLabel = document.createElement("label");
  const callsignInput = document.createElement("input");

  const birthDateFilter = document.createElement("div");
  const birthDateLabel = document.createElement("label");
  const birthDateInput = document.createElement("input");
  const phoneFilter = document.createElement("div");
  const phoneLabel = document.createElement("label");
  const phoneInput = document.createElement("input");
  const emailFilter = document.createElement("div");
  const emailLabel = document.createElement("label");
  const emailInput = document.createElement("input");
  const submit = document.createElement("button");

  filterContainer.className = "Filters__container";

  callsignFilter.className = "Input__container w-40";
  birthDateFilter.className = "Input__container w-20";
  phoneFilter.className = "Input__container w-40";
  emailFilter.className = "Input__container w-50";
  callsignInput.className = "Input__Text";
  birthDateInput.className = "Input__Text";
  phoneInput.className = "Input__Text";
  emailInput.className = "Input__Text";

  callsignInput.id = "callsignFilter";
  callsignInput.placeholder = "Mario Rossi";
  callsignLabel.textContent = "Nominativo";

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

  submit.className = "Btn__secondary";
  submit.type = "submit";
  submit.append("Cerca", genIcon("search"));

  submit.addEventListener("click", () => handleCustomersSubmitFilters());

  callsignFilter.append(callsignLabel, callsignInput);
  birthDateFilter.append(birthDateLabel, birthDateInput);
  phoneFilter.append(phoneLabel, phoneInput);
  emailFilter.append(emailLabel, emailInput);
  filterContainer.append(
    callsignFilter,
    birthDateFilter,
    phoneFilter,
    emailFilter,
    submit
  );
  return filterContainer;
};

const loadDataTableCustomer = (customers) => {
  const tbody = document.querySelector("tbody");

  customers.map((customer) => {
    const tr = document.createElement("tr");
    const firstName = document.createElement("td");
    const lastName = document.createElement("td");
    const birthDate = document.createElement("td");
    const phoneNumber = document.createElement("td");
    const email = document.createElement("td");

    firstName.textContent = customer.firstName;
    lastName.textContent = customer.lastName;
    birthDate.textContent = dateFormatter(customer.birthDate);
    phoneNumber.textContent = customer.phoneNumber;
    email.textContent = customer.email;

    tr.append(firstName, lastName, birthDate, phoneNumber, phoneNumber, email);
    tbody.appendChild(tr);
  });
};

const handleCustomersSubmitFilters = async () => {
  filters = [];

  const callsign = document.querySelector("#callsignFilter").value;
  const birthDate = document.querySelector("#birthDateFilter").value;
  const phone = document.querySelector("#phoneFilter").value;
  const mail = document.querySelector("#emailFilter").value;

  if (callsign)
    filters.push({
      filterName: "callsign",
      filterValue: callsign,
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
  loadDataTableCustomer(await getCustomers());
};

const createCustomer = async () => {
  const firstName = document.querySelector("#firstNameInput").value;
  const lastName = document.querySelector("#lastNameInput").value;
  const birthDate = document.querySelector("#birthDateInput").value;
  const phoneNumber = document.querySelector("#phoneNumberInput").value;
  const email = document.querySelector("#emailInput").value;

  const data = {
    firstName,
    lastName,
    birthDate,
    phoneNumber,
    email,
  };

  return await HTTP_POST("customer/", data);
};

/** END CUSTOMERS SECTION **/

/** VEHICLES SECTION **/

export const buildVehicleList = async () => {
  pageTitle.textContent = "Motori";
  clearContainer(MAIN);

  MAIN.appendChild(loader);
  const vehicles = await getVehicles();
  loader.remove();

  const tableColumns = ["Marca", "Modello", "Targa", "Propietario"];

  const tableHeader = document.createElement("div");
  const newVehicleBtn = document.createElement("button");

  tableHeader.className = "Table__header";
  newVehicleBtn.className = "Btn__primary";
  newVehicleBtn.append("Nuovo motore", genIcon("add"));

  const form = await genNewVehicleForm();

  newVehicleBtn.addEventListener("click", () =>
    APP_CONTAINER.appendChild(genModal("Nuovo Motore", form))
  );

  const brands = await HTTP_GET("vehicle/brands");

  tableHeader.append(
    genVehicleFilters(brands, getModelsByBrand),
    newVehicleBtn
  );

  MAIN.append(tableHeader, genTable(tableColumns));
  loadDataTableVehicle(vehicles);
};

const getVehicles = async () => {
  let params = "?";

  filters.map((filter) => {
    params += `${filter.filterName}=${filter.filterValue}&`;
  });

  return await HTTP_GET(`vehicle/${params}`);
};

const getModelsByBrand = async (brand) => {
  return await HTTP_GET(`vehicle/models?brand=${brand}`);
};

const genNewVehicleForm = async () => {
  const form = document.createElement("div");
  const modelBrandRow = document.createElement("div");
  const plateClientRow = document.createElement("div");
  const actionButtons = document.createElement("div");

  const cancelBtn = document.createElement("button");
  const createBtn = document.createElement("button");

  cancelBtn.textContent = "Annulla";
  createBtn.textContent = "Crea";

  cancelBtn.className = "Btn__secondary";
  createBtn.className = "Btn__primary";

  modelBrandRow.className = "Row";
  plateClientRow.className = "Row";
  actionButtons.className = "Action__buttons";

  const brands = await HTTP_GET("vehicle/brands");
  const brandInput = genInputField("Marca", "text", "brandInput", "Yamaha");
  const brandField = brandInput.querySelector("input");
  const brandSuggestions = brands;
  const brandDatalist = document.createElement("datalist");
  brandDatalist.id = "brandSuggestions";
  brandSuggestions.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    brandDatalist.appendChild(option);
  });
  brandField.setAttribute("list", "brandSuggestions");
  brandInput.appendChild(brandDatalist);

  const models = await HTTP_GET("vehicle/models");
  const modelInput = genInputField("Modello", "text", "modelInput", "Tracer 7");
  const modelField = modelInput.querySelector("input");
  const modelSuggestions = models;
  const modelDatalist = document.createElement("datalist");
  modelDatalist.id = "modelSuggestions";
  modelSuggestions.forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    modelDatalist.appendChild(option);
  });
  modelField.setAttribute("list", "modelSuggestions");
  modelInput.appendChild(modelDatalist);

  const plateInput = genInputField("Targa", "text", "plateInput", "AB123CD");

  const customerContainer = document.createElement("div");
  customerContainer.className = "Input__container w-100";

  const customerLabel = document.createElement("label");
  customerLabel.textContent = "Cliente";

  const customerSelect = document.createElement("select");
  customerSelect.id = "customerSelect";
  customerSelect.className = "Input__Text";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Seleziona un cliente";
  customerSelect.appendChild(defaultOption);

  const customers = await getCustomers();

  customers.forEach((client) => {
    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = `${client.firstName} ${client.lastName}`;
    customerSelect.appendChild(option);
  });

  customerContainer.append(customerLabel, customerSelect);

  modelBrandRow.append(brandInput, modelInput);
  plateClientRow.append(plateInput, customerContainer);
  actionButtons.append(cancelBtn, createBtn);

  form.append(modelBrandRow, plateClientRow, actionButtons);

  cancelBtn.addEventListener("click", () => MODAL.remove());
  createBtn.addEventListener("click", async () => {
    createVehicle()
      .then(() => {
        MODAL.remove();
        clearContainer(document.querySelector("tbody"));
        getVehicles().then((vehicles) => {
          loadDataTableVehicle(vehicles);
        });
      })
      .catch((e) => {
        const error = document.createElement("p");
        error.className = "Error__message";
        error.textContent = e.description;
        form.insertBefore(error, actionButtons);
      });
  });

  return form;
};

const genVehicleFilters = (brands = [], getModelsByBrand) => {
  const filterContainer = document.createElement("div");

  const brandFilter = document.createElement("div");
  const brandLabel = document.createElement("label");
  const brandSelect = document.createElement("select");

  const modelFilter = document.createElement("div");
  const modelLabel = document.createElement("label");
  const modelSelect = document.createElement("select");

  const plateFilter = document.createElement("div");
  const plateLabel = document.createElement("label");
  const plateInput = document.createElement("input");

  const submit = document.createElement("button");

  filterContainer.className = "Filters__container";
  brandFilter.className = "Input__container w-100";
  modelFilter.className = "Input__container w-100";
  plateFilter.className = "Input__container w-100";

  brandSelect.className = "Input__Text";
  modelSelect.className = "Input__Text";
  plateInput.className = "Input__Text";

  brandSelect.id = "brandFilter";
  brandLabel.textContent = "Marca";

  const defaultBrandOption = document.createElement("option");
  defaultBrandOption.value = "";
  defaultBrandOption.textContent = "Tutti";
  brandSelect.appendChild(defaultBrandOption);

  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });

  brandSelect.addEventListener("change", async () => {
    const selectedBrand = brandSelect.value;
    clearContainer(modelSelect);

    if (selectedBrand && getModelsByBrand) {
      const models = await getModelsByBrand(selectedBrand);

      const defaultModelOption = document.createElement("option");
      defaultModelOption.value = "";
      defaultModelOption.textContent = "Tutti";
      modelSelect.appendChild(defaultModelOption);

      models.forEach((model) => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    }
  });

  modelSelect.id = "modelFilter";
  modelLabel.textContent = "Modello";

  plateInput.id = "plateFilter";
  plateInput.placeholder = "AB123CD";
  plateLabel.textContent = "Targa";

  submit.className = "Btn__secondary";
  submit.type = "submit";
  submit.append("Cerca", genIcon("search"));
  submit.addEventListener("click", () => handleVehiclesSubmitFilters());

  brandFilter.append(brandLabel, brandSelect);
  modelFilter.append(modelLabel, modelSelect);
  plateFilter.append(plateLabel, plateInput);

  filterContainer.append(brandFilter, modelFilter, plateFilter, submit);

  return filterContainer;
};

const loadDataTableVehicle = (vehicles) => {
  const tbody = document.querySelector("tbody");

  console.log(vehicles);

  vehicles.map((vehicle) => {
    const tr = document.createElement("tr");
    const brand = document.createElement("td");
    const model = document.createElement("td");
    const nameplate = document.createElement("td");
    const owner = document.createElement("td");

    brand.textContent = vehicle.brand;
    model.textContent = vehicle.model;
    nameplate.textContent = vehicle.nameplate;
    owner.textContent = `${vehicle.customer.firstName} ${vehicle.customer.lastName}`;

    tr.append(brand, model, nameplate, owner);
    tbody.appendChild(tr);
  });
};

const handleVehiclesSubmitFilters = async () => {
  filters = [];

  const brand = document.querySelector("#brandFilter").value;
  const model = document.querySelector("#modelFilter").value;
  const nameplate = document.querySelector("#plateFilter").value;

  if (brand)
    filters.push({
      filterName: "brand",
      filterValue: brand,
    });

  if (model)
    filters.push({
      filterName: "model",
      filterValue: model,
    });

  if (nameplate)
    filters.push({
      filterName: "nameplate",
      filterValue: nameplate,
    });

  clearContainer(document.querySelector("tbody"));
  loadDataTableVehicle(await getVehicles());
};

const createVehicle = async () => {
  const brand = document.querySelector("#brandInput").value;
  const model = document.querySelector("#modelInput").value;
  const nameplate = document.querySelector("#plateInput").value;
  const customerId = document.querySelector("#customerSelect").value;

  const data = {
    nameplate,
    brand,
    model,
    customerId,
  };

  return await HTTP_POST("vehicle/", data);
};

/** END VEHICLES SECTION **/

/** UTILS **/

const genTable = (columns = []) => {
  const tableContainer = document.createElement("div");
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  const tbody = document.createElement("tbody");

  tableContainer.className = "Table__container";

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

const genModal = (titleValue, body) => {
  const background = document.createElement("div");
  const modal = document.createElement("div");
  const modalHeader = document.createElement("div");
  const title = document.createElement("h2");

  MODAL = background;

  const closeBtn = genIcon("cancel");
  background.id = "modal";
  background.className = "Modal__background";
  modal.className = "Modal__card";
  modalHeader.className = "Modal__header";

  title.textContent = titleValue;

  closeBtn.addEventListener("click", () => background.remove());

  modalHeader.append(title, closeBtn);

  modal.append(modalHeader, body);
  background.appendChild(modal);
  return background;
};

const genInputField = (labelValue, inputType, inputId, placeholder) => {
  const container = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");

  container.className = "Input__container";
  input.className = "Input__Text";

  label.textContent = labelValue;

  input.type = inputType;
  input.id = inputId;
  input.placeholder = placeholder;

  container.append(label, input);
  return container;
};

/** END UTILS **/
