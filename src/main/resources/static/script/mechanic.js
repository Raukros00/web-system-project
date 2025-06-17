import {
  clearContainer,
  genLabelAndValue,
  HTTP_GET,
  Loader,
  StatusCard,
  genStatusLabel,
  HTTP_PATCH,
} from "./main.js";

const MAIN = document.querySelector(".Main__Container");
const pageTitle = document.querySelector("#pageTitle");
const loader = Loader();

const getPractices = async (status) => {
  const statusList =
    status === "IN_PROGRESS"
      ? "status=ACCEPTED&status=IN_PROGRESS"
      : "status=COMPLETED&status=TO_PAY";

  return await HTTP_GET(`practice/?${statusList}`);
};

const getPractice = async (practiceId) => {
  return await HTTP_GET(`practice/${practiceId}`);
};

const getSparePartsAvailable = async () => {
  return await HTTP_GET("inventory/?isAvailable=true");
};

export const buildMechanicPracticesList = async () => {
  pageTitle.textContent = "Pratiche";
  clearContainer(MAIN);

  MAIN.appendChild(loader);
  const practicesList = await getPractices("IN_PROGRESS");
  loader.remove();
  buildPracticesList(practicesList);
};

export const buildMechanicCompletedPractices = async () => {
  pageTitle.textContent = "Pratiche complete";
  clearContainer(MAIN);

  MAIN.appendChild(loader);
  const practicesList = await getPractices("COMPLETED");
  loader.remove();
  buildPracticesList(practicesList);
};

const buildPracticesList = (practiceList) => {
  practiceList.map((practice) => {
    MAIN.appendChild(StatusCard(practice, true, buildPracticeEditor));
  });
};

const buildPracticeEditor = async (practiceId) => {
  pageTitle.textContent = `Pratica #${practiceId}`;
  clearContainer(MAIN);

  MAIN.appendChild(loader);
  const practice = await getPractice(practiceId);
  loader.remove();
  const formPracticeEditor = await genFormPracticeEditor(practice);
  MAIN.append(genInfoCardPractice(practice), formPracticeEditor);
};

const genInfoCardPractice = (practice) => {
  const { customer, vehicle } = practice;
  const infoCard = document.createElement("div");
  const infoWrapper = document.createElement("div");
  const title = document.createElement("h2");
  const clientInformationTitle = document.createElement("h3");
  const clientInfoRow = document.createElement("div");
  const vehicleInformationTitle = document.createElement("h3");
  const vehicleInfoRow = document.createElement("div");
  const vehicleProblemRow = document.createElement("div");
  const status = document.createElement("div");

  const divider = document.createElement("hr");

  infoCard.className = "Status__card";
  infoWrapper.className = "Info__wrapper";
  clientInfoRow.className = "Info__row";
  vehicleInfoRow.className = "Info__row";
  vehicleProblemRow.className = "Info--row";
  status.className = "Info--content";

  title.textContent = "Anagrafica";
  clientInformationTitle.textContent = "Cliente";
  vehicleInformationTitle.textContent = "Moto";

  status.appendChild(genStatusLabel(practice.status));

  clientInfoRow.append(
    genLabelAndValue("Nome", customer.firstName),
    genLabelAndValue("Cognome", customer.lastName),
    genLabelAndValue("Telefono", customer.phoneNumber),
    genLabelAndValue("Email", customer.email)
  );

  vehicleInfoRow.append(
    genLabelAndValue("Marchio", vehicle.brand),
    genLabelAndValue("Modello", vehicle.model),
    genLabelAndValue("Targa", vehicle.nameplate),
    status
  );

  vehicleProblemRow.appendChild(
    genLabelAndValue("Descrizione problema", practice.problemDescription)
  );

  infoWrapper.append(
    title,
    clientInformationTitle,
    clientInfoRow,
    divider,
    vehicleInformationTitle,
    vehicleInfoRow,
    vehicleProblemRow
  );
  infoCard.appendChild(infoWrapper);

  return infoCard;
};

const genFormPracticeEditor = async (practice) => {
  const editorCard = document.createElement("div");
  const editorWrapper = document.createElement("div");
  const progressBar = genProgressContainer(practice.status);
  const title = document.createElement("h2");

  const totalHoursWorkedContainer = document.createElement("div");
  const totalHoursWorkedLabel = document.createElement("label");
  const totalHoursWorkedInput = document.createElement("input");

  const workDescriptionContainer = document.createElement("div");
  const workDescriptionLabel = document.createElement("label");
  const workDescriptionInput = document.createElement("textarea");

  const saveBtnContainer = document.createElement("div");
  const saveBtn = document.createElement("button");

  title.textContent = "Scheda di lavoro";

  totalHoursWorkedContainer.className = "Input__container";
  workDescriptionContainer.className = "Input__container";

  totalHoursWorkedInput.className = "Input__Text";
  totalHoursWorkedInput.type = "number";
  totalHoursWorkedInput.id = "totalHoursWorked";
  workDescriptionInput.className = "Input__Text";
  workDescriptionInput.id = "workDescription";

  totalHoursWorkedLabel.id = "totalHoursWorkedLabel";
  totalHoursWorkedLabel.textContent = "Ore impiegate";
  totalHoursWorkedLabel.htmlFor = "totalHoursWorked";
  workDescriptionLabel.id = "workDescriptionLabel";
  workDescriptionLabel.textContent = "Operazioni effettuate";
  workDescriptionLabel.htmlFor = "workDescription";

  totalHoursWorkedInput.min = 0;
  totalHoursWorkedInput.value = practice.totalHours ?? 0;
  workDescriptionInput.value = practice.workDescription ?? "";

  saveBtnContainer.className = "Save__container";

  saveBtn.className = "Btn primary";
  saveBtn.textContent = "Salva pratica";

  editorCard.className = "Status__card";
  editorWrapper.className = "Editor__wrapper";

  saveBtnContainer.appendChild(saveBtn);
  saveBtn.addEventListener("click", () => updatePractice(practice.id));

  updatedPractice.newStatus = practice.status;

  const availableSpareParts = await getSparePartsAvailable();

  const sparePartsSelector = genUsedSparePartsSelector(
    practice,
    availableSpareParts
  );

  totalHoursWorkedContainer.append(
    totalHoursWorkedLabel,
    totalHoursWorkedInput
  );
  workDescriptionContainer.append(
    workDescriptionLabel,
    workDescriptionInput,
    saveBtnContainer
  );

  editorWrapper.append(
    title,
    progressBar,
    sparePartsSelector,
    totalHoursWorkedContainer,
    workDescriptionContainer
  );

  editorCard.appendChild(editorWrapper);

  return editorCard;
};

const genUsedSparePartsSelector = (practice, availableSpareParts) => {
  const container = document.createElement("div");
  const labelSparePart = document.createElement("label");

  container.className = "Input__container";
  labelSparePart.textContent = "Lista componenti";
  labelSparePart.htmlFor = "sparePartSelect";

  container.appendChild(labelSparePart);

  // Lista pezzi usati
  const usedSparePartsList = document.createElement("ul");
  usedSparePartsList.id = "usedSparePartsList";
  usedSparePartsList.className = "Used__SpareParts--list";

  // Select ricambi
  const sparePartSelect = document.createElement("select");
  sparePartSelect.id = "sparePartSelect";
  sparePartSelect.className = "Input__Text";
  availableSpareParts.forEach((sparePart) => {
    const option = document.createElement("option");
    option.value = sparePart.id;
    option.textContent = `${sparePart.partName} (x${sparePart.quantity})`;
    sparePartSelect.appendChild(option);
  });

  const addSparePartBtn = document.createElement("button");
  addSparePartBtn.textContent = "Aggiungi";
  addSparePartBtn.type = "button";
  addSparePartBtn.className = "Btn secondary";

  const renderUsedSparePartsList = () => {
    usedSparePartsList.innerHTML = "";

    updatedPractice.usedSparePartList.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} x${item.quantity} `;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "X";
      removeBtn.type = "button";
      removeBtn.addEventListener("click", () => {
        item.quantity--;
        if (item.quantity <= 0) {
          updatedPractice.usedSparePartList =
            updatedPractice.usedSparePartList.filter((i) => i.id !== item.id);
        }
        renderUsedSparePartsList();
      });

      li.appendChild(removeBtn);
      usedSparePartsList.appendChild(li);
    });
  };

  addSparePartBtn.addEventListener("click", () => {
    const selectedId = sparePartSelect.value;
    const selectedName =
      sparePartSelect.options[sparePartSelect.selectedIndex].text;

    const existing = updatedPractice.usedSparePartList.find(
      (item) => item.id === selectedId
    );

    const selectedSparePart = availableSpareParts.find(
      (item) => item.id === Number(selectedId)
    );

    const usedSelectedSparePart = practice.usedSparePartList.find(
      (item) => item.id === Number(selectedId)
    );

    if (existing) {
      const usedSelectedSparePartQuantity = usedSelectedSparePart
        ? usedSelectedSparePart.quantity
        : 0;

      const isOutOfQuantity =
        existing.quantity + 1 - usedSelectedSparePartQuantity >
        selectedSparePart.quantity;

      if (isOutOfQuantity) return;

      existing.quantity++;
    } else {
      updatedPractice.usedSparePartList.push({
        id: selectedId,
        name: selectedSparePart.partName,
        quantity: 1,
      });
    }

    renderUsedSparePartsList();
  });

  if (practice.usedSparePartList) {
    updatedPractice.usedSparePartList = practice.usedSparePartList.map(
      (sp) => ({
        id: sp.id.toString(),
        name: sp.sparePartName,
        quantity: sp.quantity,
      })
    );
    renderUsedSparePartsList();
  } else {
    updatedPractice.usedSparePartList = [];
  }

  const spareSelectContainer = document.createElement("div");
  spareSelectContainer.className = "SpareSelect__container w-100";
  spareSelectContainer.append(sparePartSelect, addSparePartBtn);

  container.append(usedSparePartsList, spareSelectContainer);
  return container;
};

const genProgressContainer = (status) => {
  const progressContainer = document.createElement("div");
  const toPayLabel = document.createElement("span");
  const inProgressLabel = document.createElement("span");
  const completedLabel = document.createElement("span");
  const progressBar = document.createElement("div");
  const progress = document.createElement("span");

  progressContainer.className = "Progress__container";
  toPayLabel.className = "step";
  inProgressLabel.className = "step";
  completedLabel.className = "step";
  progressBar.className = "Progress__bar";
  progress.className = "progress";
  progress.style = "width: 0px";

  toPayLabel.id = "ACCEPTED";
  inProgressLabel.id = "IN_PROGRESS";
  completedLabel.id = "TO_PAY";

  toPayLabel.textContent = "Accettata";
  inProgressLabel.textContent = "In lavorazione";
  completedLabel.textContent = "Da pagare";

  let currentStep = 0;

  switch (status) {
    case "TO_PAY":
      completedLabel.classList.add("active");
      currentStep += 1;
    case "IN_PROGRESS":
      inProgressLabel.classList.add("active");
      currentStep += 1;
    case "ACCEPTED":
      toPayLabel.classList.add("active");
      currentStep += 1;
  }

  progress.style.width = `${((currentStep - 1) / (3 - 1)) * 100}%`;

  const btns = [inProgressLabel, completedLabel];

  btns.map((btn) =>
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) return;
      currentStep += 1;
      btn.classList.add("active");
      updatedPractice.newStatus = btn.id;
      progress.style.width = `${((currentStep - 1) / (3 - 1)) * 100}%`;
    })
  );

  progressBar.appendChild(progress);

  progressContainer.append(
    toPayLabel,
    inProgressLabel,
    completedLabel,
    progressBar
  );

  return progressContainer;
};

const updatePractice = async (practiceId) => {
  updatedPractice.totalHours = Number(
    document.querySelector("#totalHoursWorked").value
  );
  updatedPractice.workDescription =
    document.querySelector("#workDescription").value;

  try {
    await HTTP_PATCH(`practice/${practiceId}`, updatedPractice);
    clearContainer(MAIN);
    MAIN.appendChild(loader);
    loader.remove();
    buildPracticeEditor(practiceId);
  } catch (e) {
    document.querySelector("#totalHoursWorkedLabel").className =
      "Error__message";
    document.querySelector("#totalHoursWorkedLabel").textContent =
      "Ore impiegate (Valore non valido!)";
  }
};

let updatedPractice = {
  newStatus: "",
  totalHours: 0.0,
  workDescription: "",
};
