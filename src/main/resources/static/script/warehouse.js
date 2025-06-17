import {
  HTTP_GET,
  HTTP_POST,
  Loader,
  clearContainer,
  genIcon,
  genModal,
  genTable,
  MODAL,
  HTTP_PUT,
  errorHandle,
} from "./main.js";

const MAIN = document.querySelector(".Main__Container");
const APP_CONTAINER = document.querySelector(".Container");
const pageTitle = document.querySelector("#pageTitle");

const loader = Loader();

let filters = [];

const getParts = async () => {
  let params = "?isAvailable=false&";

  filters.map((filter) => {
    params += `${filter.filterName}=${filter.filterValue}&`;
  });

  return await HTTP_GET(`inventory/${params}`);
};

export const buildPartsList = async () => {
  pageTitle.textContent = "Magazzino";

  clearContainer(MAIN);

  MAIN.appendChild(loader);
  const parts = await getParts();
  loader.remove();

  const tableColumns = [
    "Codice pezzo",
    "Nome pezzo",
    "Quantità",
    "Prezzo",
    "Azioni",
  ];

  const tableHeader = document.createElement("div");
  const newPartBtn = document.createElement("button");

  tableHeader.className = "Table__header";
  newPartBtn.className = "Btn primary";
  newPartBtn.append("Nuovo pezzo", genIcon("add"));

  const form = await genNewPartForm();

  newPartBtn.addEventListener("click", () =>
    APP_CONTAINER.appendChild(genModal("Nuovo Pezzo", form))
  );

  tableHeader.append(genPartFilters(), newPartBtn);

  MAIN.append(tableHeader, genTable(tableColumns));

  loadDataTableParts(parts);
};

const loadDataTableParts = (parts) => {
  const tbody = document.querySelector("tbody");

  parts.map((part) => {
    const tr = document.createElement("tr");
    const partId = document.createElement("td");
    const partName = document.createElement("td");
    const partQuantity = document.createElement("td");
    const price = document.createElement("td");
    const actions = document.createElement("td");

    partId.textContent = part.id;
    partName.textContent = part.partName;
    price.textContent = `€${part.price}`;
    partQuantity.textContent = part.quantity;

    const editBtn = document.createElement("button");
    editBtn.className = "Btn grey";
    editBtn.innerHTML = "Modifica";
    editBtn.addEventListener("click", () => {
      const form = genEditForm(part);
      APP_CONTAINER.appendChild(genModal("Modifica", form));
    });

    actions.appendChild(editBtn);
    tr.append(partId, partName, partQuantity, price, actions);

    tbody.appendChild(tr);
  });
};

const genNewPartForm = async () => {
  const form = document.createElement("div");
  const errorSection = document.createElement("div");
  const nameRow = document.createElement("div");
  const quantityRow = document.createElement("div");
  const priceRow = document.createElement("div");
  const actionButtons = document.createElement("div");

  nameRow.className = "Row";
  quantityRow.className = "Row";
  priceRow.className = "Row";
  actionButtons.className = "Action__buttons";

  const cancelBtn = document.createElement("button");
  const createBtn = document.createElement("button");

  cancelBtn.textContent = "Annulla";
  createBtn.textContent = "Crea";

  cancelBtn.className = "Btn secondary";
  createBtn.className = "Btn primary";

  const nameContainer = document.createElement("div");
  nameContainer.className = "Input__container w-100";

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Nome";
  nameLabel.htmlFor = "partName";

  const nameInput = document.createElement("input");
  nameInput.id = "partName";
  nameInput.className = "Input__Text";
  nameInput.placeholder = "Nome del pezzo";

  nameContainer.append(nameLabel, nameInput);

  const quantityContainer = document.createElement("div");
  quantityContainer.className = "Input__container w-100";

  const quantityLabel = document.createElement("label");
  quantityLabel.textContent = "Quantità";
  quantityLabel.htmlFor = "quantity";

  const quantityInput = document.createElement("input");
  quantityInput.id = "quantity";
  quantityInput.className = "Input__Text";
  quantityInput.type = "number";
  quantityInput.placeholder = "Quantità disponibile";
  quantityInput.min = 1;

  quantityContainer.append(quantityLabel, quantityInput);

  const priceContainer = document.createElement("div");
  priceContainer.className = "Input__container w-100";

  const priceLabel = document.createElement("label");
  priceLabel.textContent = "Prezzo";
  priceLabel.htmlFor = "price";

  const priceInput = document.createElement("input");
  priceInput.id = "price";
  priceInput.className = "Input__Text";
  priceInput.type = "number";
  priceInput.min = 1;

  priceContainer.append(priceLabel, priceInput);

  nameRow.appendChild(nameContainer);
  quantityRow.appendChild(quantityContainer);
  priceRow.appendChild(priceContainer);
  actionButtons.append(cancelBtn, createBtn);
  form.append(nameRow, quantityRow, priceRow, errorSection, actionButtons);

  cancelBtn.addEventListener("click", () => MODAL.remove());
  createBtn.addEventListener("click", async () => {
    const partName = nameInput.value.trim();
    const quantity = parseInt(quantityInput.value, 10);
    const price = parseFloat(priceInput.value);

    if (!partName || isNaN(quantity) || isNaN(price)) {
      clearContainer(errorSection);
      errorSection.appendChild(errorHandle("ALL_FIELDS_ARE_REQUIRED"));
      return;
    }

    try {
      await createPart({ partName, quantity, price });
      MODAL.remove();
      clearContainer(document.querySelector("tbody"));
      const parts = await getParts();
      loadDataTableParts(parts);
    } catch (e) {
      clearContainer(errorSection);
      errorSection.appendChild(errorHandle(`WAREHOUSE_${e.error}`));
    }
  });

  return form;
};

const createPart = async (newPart) => {
  return await HTTP_POST("inventory/", newPart);
};

const genPartFilters = () => {
  const filterContainer = document.createElement("div");
  filterContainer.className = "Filters__container";

  const idInput = createFilterInput("Id", "filterId");
  const nameInput = createFilterInput("Nome", "filterName");
  const quantityInput = createFilterInput("Quantità", "filterQuantity");

  const submit = document.createElement("button");
  submit.className = "Btn secondary";
  submit.type = "submit";
  submit.append("Cerca", genIcon("search"));
  submit.addEventListener("click", () => handlePracticesSubmitFilters());

  filterContainer.append(idInput, nameInput, quantityInput, submit);
  return filterContainer;
};

const createFilterInput = (labelText, filterId) => {
  const container = document.createElement("div");
  container.className = "Input__container";

  const label = document.createElement("label");
  label.textContent = labelText;
  label.htmlFor = filterId;

  const input = document.createElement("input");
  input.className = "Input__Text";
  input.placeholder = labelText;
  input.id = filterId;

  container.append(label, input);
  return container;
};

const handlePracticesSubmitFilters = async () => {
  filters = [];

  const filterId = document.querySelector("#filterId").value;
  const filterName = document.querySelector("#filterName").value;
  const filterQuantity = document.querySelector("#filterQuantity").value;

  if (filterId)
    filters.push({
      filterName: "id",
      filterValue: filterId,
    });

  if (filterName)
    filters.push({
      filterName: "partName",
      filterValue: filterName,
    });

  if (filterQuantity)
    filters.push({
      filterName: "quantity",
      filterValue: filterQuantity,
    });

  clearContainer(document.querySelector("tbody"));
  loadDataTableParts(await getParts());
};

const genEditForm = (part) => {
  const form = document.createElement("div");
  const errorContainer = document.createElement("div");
  const quantityRow = document.createElement("div");
  const priceRow = document.createElement("div");
  const actionButtons = document.createElement("div");

  quantityRow.className = "Row";
  priceRow.className = "Row";
  actionButtons.className = "Action__buttons";

  const quantityContainer = document.createElement("div");
  quantityContainer.className = "Input__container w-100";

  const quantityLabel = document.createElement("label");
  quantityLabel.textContent = "Quantità";
  quantityLabel.htmlFor = "quantity";

  const quantityInput = document.createElement("input");
  quantityInput.className = "Input__Text";
  quantityInput.id = "quantity";
  quantityInput.type = "number";
  quantityInput.value = part.quantity;
  quantityInput.min = 1;

  const priceContainer = document.createElement("div");
  priceContainer.className = "Input__container w-100";

  const priceLabel = document.createElement("label");
  priceLabel.textContent = "Prezzo";
  priceLabel.htmlFor = "price";

  const priceInput = document.createElement("input");
  priceInput.className = "Input__Text";
  priceInput.id = "price";
  priceInput.type = "number";
  priceInput.value = part.price;
  priceInput.min = 1.0;

  quantityContainer.append(quantityLabel, quantityInput);
  quantityRow.appendChild(quantityContainer);
  priceContainer.append(priceLabel, priceInput);
  priceRow.appendChild(priceContainer);

  const cancelBtn = document.createElement("button");
  const saveBtn = document.createElement("button");

  cancelBtn.textContent = "Annulla";
  saveBtn.textContent = "Salva";

  cancelBtn.className = "Btn secondary";
  saveBtn.className = "Btn primary";

  actionButtons.append(cancelBtn, saveBtn);
  form.append(quantityRow, priceRow, errorContainer, actionButtons);

  cancelBtn.addEventListener("click", () => MODAL.remove());
  saveBtn.addEventListener("click", async () => {
    const newQuantity = parseInt(quantityInput.value, 10);
    const newPrice = priceInput.value;
    if (
      (isNaN(newQuantity) && newQuantity < 1) ||
      (isNaN(newPrice) && newPrice < 1)
    ) {
      clearContainer(errorContainer);
      errorContainer.appendChild(errorHandle("FORMAT_FIELD_ERROR"));
      return;
    }

    try {
      await handleUpdatePriceAndQuantity(part.id, newQuantity, newPrice);
      MODAL.remove();
      clearContainer(document.querySelector("tbody"));
      const parts = await getParts();
      loadDataTableParts(parts);
    } catch (e) {
      clearContainer(errorContainer);
      errorContainer.appendChild(errorHandle(`WAREHOUSE_${e.error}`));
    }
  });

  return form;
};

const handleUpdatePriceAndQuantity = async (id, quantity, price) => {
  return await HTTP_PUT("inventory/", {
    id,
    quantity,
    price,
  });
};
