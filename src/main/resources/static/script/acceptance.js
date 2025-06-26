import {
  HTTP_GET,
  HTTP_POST,
  Loader,
  clearContainer,
  dateFormatter,
  genIcon,
  genStatusLabel,
  mapStatusLabel,
  errorHandle,
  genModal,
  genTable,
  genInputField,
  MODAL,
} from "./main.js";

const MAIN = document.querySelector(".Main__Container");
const APP_CONTAINER = document.querySelector(".Container");
const pageTitle = document.querySelector("#pageTitle");

const loader = Loader();

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
  newCustomerBtn.className = "Btn primary";
  newCustomerBtn.append("Nuovo cliente", genIcon("add"));

  const form = await genNewCustomerForm();

  newCustomerBtn.addEventListener("click", () =>
    APP_CONTAINER.appendChild(genModal("Nuovo cliente", form))
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

const genNewCustomerForm = async () => {
  const form = document.createElement("div");
  const errorSection = document.createElement("div");
  const nameOrSurnameRow = document.createElement("div");
  const birthDatePhoneRow = document.createElement("div");
  const mailRow = document.createElement("div");
  const actionButtons = document.createElement("div");

  const cancelBtn = document.createElement("button");
  const createBtn = document.createElement("button");

  cancelBtn.textContent = "Annulla";
  createBtn.textContent = "Crea";

  cancelBtn.className = "Btn secondary";
  createBtn.className = "Btn primary";

  nameOrSurnameRow.className = "Row";
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

  nameOrSurnameRow.append(firstNameInput, lastNameInput);
  birthDatePhoneRow.append(birthDateInput, phoneNumberInput);
  mailRow.appendChild(emailInput);
  actionButtons.append(cancelBtn, createBtn);

  form.append(
    nameOrSurnameRow,
    birthDatePhoneRow,
    mailRow,
    errorSection,
    actionButtons
  );

  cancelBtn.addEventListener("click", () => MODAL.remove());
  createBtn.addEventListener("click", async () => {
    const firstName = document.querySelector("#firstNameInput").value;
    const lastName = document.querySelector("#lastNameInput").value;
    const birthDate = document.querySelector("#birthDateInput").value;
    const phoneNumber = document.querySelector("#phoneNumberInput").value;
    const email = document.querySelector("#emailInput").value;

    console.log(firstName, lastName, birthDate, phoneNumber, email);

    if (!firstName || !lastName || !birthDate || !phoneNumber || !email) {
      clearContainer(errorSection);
      errorSection.appendChild(errorHandle("ALL_FIELDS_ARE_REQUIRED"));
      return;
    }

    try {
      await createCustomer({
        firstName,
        lastName,
        birthDate,
        phoneNumber,
        email,
      });
      MODAL.remove();
      clearContainer(document.querySelector("tbody"));
      const customers = await getCustomers();
      loadDataTableCustomer(customers);
    } catch (e) {
      clearContainer(errorSection);
      errorSection.appendChild(errorHandle(`PRACTICE_${e.error}`));
    }
  });

  return form;
};

const genCustomersFilters = () => {
  const filterContainer = document.createElement("div");
  const nameOrSurnameFilter = document.createElement("div");
  const nameOrSurnameLabel = document.createElement("label");
  const nameOrSurnameInput = document.createElement("input");

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

  nameOrSurnameFilter.className = "Input__container w-40";
  birthDateFilter.className = "Input__container w-20";
  phoneFilter.className = "Input__container w-40";
  emailFilter.className = "Input__container w-50";
  nameOrSurnameInput.className = "Input__Text";
  birthDateInput.className = "Input__Text";
  phoneInput.className = "Input__Text";
  emailInput.className = "Input__Text";

  nameOrSurnameInput.id = "nameOrSurnameFilter";
  nameOrSurnameInput.placeholder = "Mario Rossi";
  nameOrSurnameLabel.textContent = "Nominativo";

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

  submit.className = "Btn secondary";
  submit.type = "submit";
  submit.append("Cerca", genIcon("search"));

  submit.addEventListener("click", () => handleCustomersSubmitFilters());

  nameOrSurnameFilter.append(nameOrSurnameLabel, nameOrSurnameInput);
  birthDateFilter.append(birthDateLabel, birthDateInput);
  phoneFilter.append(phoneLabel, phoneInput);
  emailFilter.append(emailLabel, emailInput);
  filterContainer.append(
    nameOrSurnameFilter,
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

  const nameOrSurname = document.querySelector("#nameOrSurnameFilter").value;
  const birthDate = document.querySelector("#birthDateFilter").value;
  const phone = document.querySelector("#phoneFilter").value;
  const mail = document.querySelector("#emailFilter").value;

  if (nameOrSurname)
    filters.push({
      filterName: "nameOrSurname",
      filterValue: nameOrSurname,
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

const createCustomer = async (data) => {
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
  newVehicleBtn.className = "Btn primary";
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

  cancelBtn.className = "Btn secondary";
  createBtn.className = "Btn primary";

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
        form.insertBefore(errorHandle(`VEHICLES_${e.error}`), actionButtons);
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

  submit.className = "Btn secondary";
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

/** PRACTICES SECTION **/

const getPractices = async () => {
  let params = "?";

  filters.map((filter) => {
    params += `${filter.filterName}=${filter.filterValue}&`;
  });

  return await HTTP_GET(`practice/${params}`);
};

export const buildPracticesList = async () => {
  pageTitle.textContent = "Pratiche";

  clearContainer(MAIN);

  MAIN.appendChild(loader);
  const practices = await getPractices();
  loader.remove();

  const tableColumns = [
    "Codice pratica",
    "Veicolo",
    "Cliente",
    "Problema",
    "Stato",
  ];

  const tableHeader = document.createElement("div");
  const newPracticeBtn = document.createElement("button");

  tableHeader.className = "Table__header";
  newPracticeBtn.className = "Btn primary";
  newPracticeBtn.append("Nuova pratica", genIcon("add"));

  const form = await genNewPracticeForm();

  newPracticeBtn.addEventListener("click", () =>
    APP_CONTAINER.appendChild(genModal("Nuova Pratica", form))
  );

  const brands = await HTTP_GET("vehicle/brands");
  const status = ["ACCEPTED", "IN_PROGRESS", "TO_PAY", "COMPLETED"];

  tableHeader.append(
    genPracticeFilters(brands, status, getModelsByBrand),
    newPracticeBtn
  );

  MAIN.append(tableHeader, genTable(tableColumns));

  loadDataTablePractice(practices);
};

const loadDataTablePractice = (practices) => {
  const tbody = document.querySelector("tbody");

  practices.map((practice) => {
    const tr = document.createElement("tr");
    const practiceId = document.createElement("td");
    const vehicle = document.createElement("td");
    const customer = document.createElement("td");
    const problemDescription = document.createElement("td");
    const status = document.createElement("td");

    practiceId.textContent = practice.id;
    vehicle.textContent = `${practice.vehicle.brand} ${practice.vehicle.model} (${practice.vehicle.nameplate})`;
    customer.textContent = `${practice.customer.firstName} ${practice.customer.lastName}`;
    problemDescription.textContent = `${practice.problemDescription}`;
    status.appendChild(genStatusLabel(practice.status));

    tr.append(practiceId, vehicle, customer, problemDescription, status);
    tbody.appendChild(tr);
  });
};

const genNewPracticeForm = async () => {
  const form = document.createElement("div");
  const errorSection = document.createElement("div");
  const clientPlateRow = document.createElement("div");
  const descriptionRow = document.createElement("div");
  const actionButtons = document.createElement("div");

  clientPlateRow.className = "Row";
  descriptionRow.className = "Row";
  actionButtons.className = "Action__buttons";

  const cancelBtn = document.createElement("button");
  const createBtn = document.createElement("button");

  cancelBtn.textContent = "Annulla";
  createBtn.textContent = "Crea";

  cancelBtn.className = "Btn secondary";
  createBtn.className = "Btn primary";

  const customerContainer = document.createElement("div");
  customerContainer.className = "Input__container w-100";

  const customerLabel = document.createElement("label");
  customerLabel.textContent = "Cliente";

  const customerSelect = document.createElement("select");
  customerSelect.id = "customerSelect";
  customerSelect.className = "Input__Text";

  const defaultCustomerOption = document.createElement("option");
  defaultCustomerOption.value = "";
  defaultCustomerOption.textContent = "Seleziona un cliente";
  customerSelect.appendChild(defaultCustomerOption);

  const customers = await getCustomers();
  customers.forEach((client) => {
    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = `${client.firstName} ${client.lastName}`;
    customerSelect.appendChild(option);
  });

  customerContainer.append(customerLabel, customerSelect);

  const plateContainer = document.createElement("div");
  plateContainer.className = "Input__container w-100";

  const plateLabel = document.createElement("label");
  plateLabel.textContent = "Targa";

  const plateSelect = document.createElement("select");
  plateSelect.id = "plateSelect";
  plateSelect.className = "Input__Text";

  const defaultPlateOption = document.createElement("option");
  defaultPlateOption.value = "";
  defaultPlateOption.textContent = "Seleziona un veicolo";
  plateSelect.appendChild(defaultPlateOption);

  plateContainer.append(plateLabel, plateSelect);

  const descriptionContainer = document.createElement("div");
  descriptionContainer.className = "Input__container w-100";

  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Descrizione del problema";

  const descriptionTextarea = document.createElement("textarea");
  descriptionTextarea.className = "Input__Text";
  descriptionTextarea.rows = 4;
  descriptionTextarea.placeholder = "Descrivi il problema...";

  descriptionContainer.append(descriptionLabel, descriptionTextarea);

  clientPlateRow.append(customerContainer, plateContainer);
  descriptionRow.append(descriptionContainer);
  actionButtons.append(cancelBtn, createBtn);
  form.append(clientPlateRow, descriptionRow, errorSection, actionButtons);

  customerSelect.addEventListener("change", async () => {
    const clienteId = customerSelect.value;

    plateSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleziona un veicolo";
    plateSelect.appendChild(defaultOption);

    if (!clienteId) return;

    const clientVehicles = await getVehiclesByClientId(clienteId);
    clientVehicles.forEach((vehicle) => {
      const option = document.createElement("option");
      option.value = vehicle.nameplate;
      option.textContent = `${vehicle.brand} ${vehicle.model} (${vehicle.nameplate})`;
      plateSelect.appendChild(option);
    });
  });

  cancelBtn.addEventListener("click", () => MODAL.remove());
  createBtn.addEventListener("click", async () => {
    const clientId = customerSelect.value;
    const nameplate = plateSelect.value;
    const problemDescription = descriptionTextarea.value.trim();

    if (!clientId || !nameplate || !problemDescription) {
      clearContainer(errorSection);
      errorSection.appendChild(errorHandle("ALL_FIELDS_ARE_REQUIRED"));
      return;
    }

    try {
      await createPractice({ nameplate, problemDescription });
      MODAL.remove();
      clearContainer(document.querySelector("tbody"));
      const practices = await getPractices();
      loadDataTablePractice(practices);
    } catch (e) {
      clearContainer(errorSection);
      errorSection.appendChild(errorHandle(`PRACTICE_${e.error}`));
    }
  });

  return form;
};

const createPractice = async (newPractice) => {
  return await HTTP_POST("practice/", newPractice);
};

const getVehiclesByClientId = async (clienteId) => {
  return await HTTP_GET(`vehicle/?customerId=${clienteId}`);
};

const genMultiSelect = (idMultiSelect, labelText, options = []) => {
  const container = document.createElement("div");
  container.className = "Input__container w-100";
  container.id = idMultiSelect;

  const label = document.createElement("label");
  label.textContent = labelText;

  const multiselect = document.createElement("div");
  multiselect.className = "custom-multiselect";

  const selectBox = document.createElement("div");
  selectBox.className = "select-box";
  selectBox.tabIndex = 0;

  const selectedSpan = document.createElement("span");
  selectedSpan.className = "selected";
  selectedSpan.textContent = `Seleziona ${labelText.toLowerCase()}`;

  const caret = document.createElement("div");
  caret.className = "caret";

  selectBox.append(selectedSpan, caret);

  const optionsContainer = document.createElement("div");
  optionsContainer.className = "options-container";

  options.forEach((option) => {
    const labelOption = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = option;
    labelOption.append(
      checkbox,
      document.createTextNode(" " + mapStatusLabel(option))
    );

    checkbox.addEventListener("change", () => {
      const selected = Array.from(
        optionsContainer.querySelectorAll("input[type='checkbox']:checked")
      ).map((cb) => mapStatusLabel(cb.value));
      selectedSpan.textContent = selected.length
        ? selected.join(", ")
        : `Seleziona ${labelText.toLowerCase()}`;
    });

    optionsContainer.appendChild(labelOption);
  });

  selectBox.addEventListener("click", () => {
    optionsContainer.style.display =
      optionsContainer.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!multiselect.contains(e.target)) {
      optionsContainer.style.display = "none";
    }
  });

  multiselect.append(selectBox, optionsContainer);

  container.append(label, multiselect);

  return container;
};

const genPracticeFilters = (brands = [], states = [], getModelsByBrand) => {
  const filterContainer = document.createElement("div");
  filterContainer.className = "Filters__container";

  const nameFilter = document.createElement("div");
  nameFilter.className = "Input__container w-100";
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Nominativo";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "nameFilter";
  nameInput.className = "Input__Text";
  nameInput.textContent = "Mario Rossi";
  nameFilter.append(nameLabel, nameInput);

  const brandFilter = document.createElement("div");
  brandFilter.className = "Input__container w-100";
  const brandLabel = document.createElement("label");
  brandLabel.textContent = "Marchio";
  const brandSelect = document.createElement("select");
  brandSelect.id = "brandFilter";
  brandSelect.className = "Input__Text";

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

  brandFilter.append(brandLabel, brandSelect);

  const modelFilter = document.createElement("div");
  modelFilter.className = "Input__container w-100";
  const modelLabel = document.createElement("label");
  modelLabel.textContent = "Modello";
  const modelSelect = document.createElement("select");
  modelSelect.id = "modelFilter";
  modelSelect.className = "Input__Text";

  const defaultModelOption = document.createElement("option");
  defaultModelOption.value = "";
  defaultModelOption.textContent = "Tutti";
  modelSelect.appendChild(defaultModelOption);

  modelFilter.append(modelLabel, modelSelect);

  brandSelect.addEventListener("change", async () => {
    const selectedBrand = brandSelect.value;
    modelSelect.innerHTML = "";
    modelSelect.appendChild(defaultModelOption);

    if (selectedBrand && getModelsByBrand) {
      const models = await getModelsByBrand(selectedBrand);
      models.forEach((model) => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    }
  });

  const statusFilter = genMultiSelect("selectFilter", "Stato", states);

  const submit = document.createElement("button");
  submit.className = "Btn secondary";
  submit.type = "submit";
  submit.append("Cerca", genIcon("search"));
  submit.addEventListener("click", () => handlePracticesSubmitFilters());

  filterContainer.append(
    nameFilter,
    brandFilter,
    modelFilter,
    statusFilter,
    submit
  );

  return filterContainer;
};

const handlePracticesSubmitFilters = async () => {
  filters = [];

  const nameOrSurname = document.querySelector("#nameFilter").value;
  const brand = document.querySelector("#brandFilter").value;
  const model = document.querySelector("#modelFilter").value;
  const status = Array.from(
    document.querySelectorAll(
      "#selectFilter .options-container input[type='checkbox']:checked"
    )
  ).map((cb) => cb.value);

  if (status)
    filters.push({
      filterName: "status",
      filterValue: status,
    });

  if (nameOrSurname)
    filters.push({
      filterName: "nameOrSurname",
      filterValue: nameOrSurname,
    });

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

  clearContainer(document.querySelector("tbody"));
  loadDataTablePractice(await getPractices());
};

/** END PRACTICES SECTION **/
