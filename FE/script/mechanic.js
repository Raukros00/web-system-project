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

export const buildMechanicPracticesList = async () => {
  clearContainer(MAIN);

  MAIN.appendChild(loader);
  const practicesList = await HTTP_GET("practice/");
  loader.remove();
  buildPracticesList(practicesList);
};

export const buildMechanicCompletedPractices = async () => {
  clearContainer(MAIN);

  MAIN.appendChild(loader);
  const practicesList = await HTTP_GET("practice/completed");
  loader.remove();
  buildPracticesList(practicesList);
};

const buildPracticesList = (practiceList) => {
  practiceList.map((practice) => {
    MAIN.appendChild(StatusCard(practice, true, buildPracticeEditor));
  });
};

const buildPracticeEditor = async (practiceId) => {
  clearContainer(MAIN);
  MAIN.appendChild(loader);
  pageTitle.textContent = `Pratica #${practiceId}`;

  const practice = await HTTP_GET(`practice/${practiceId}`);

  loader.remove();

  MAIN.append(genInfoCardPractice(practice), genFormPracticeEditor(practice));
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

const genFormPracticeEditor = (practice) => {
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
  workDescriptionLabel.id = "workDescriptionLabel";
  workDescriptionLabel.textContent = "Operazioni effettuate";

  totalHoursWorkedInput.min = 0;
  totalHoursWorkedInput.value = practice.totalHours ?? 0;
  workDescriptionInput.value = practice.workDescription ?? "";

  saveBtnContainer.className = "Save__container";

  saveBtn.className = "Btn__primary";
  saveBtn.textContent = "Salva pratica";

  editorCard.className = "Status__card";
  editorWrapper.className = "Editor__wrapper";

  saveBtnContainer.appendChild(saveBtn);
  saveBtn.addEventListener("click", () => updatePractice(practice.id));

  updatedPractice.newStatus = practice.status;

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
    totalHoursWorkedContainer,
    workDescriptionContainer
  );

  editorCard.appendChild(editorWrapper);

  return editorCard;
};

//TODO Aggiungere popup di conferma
const genProgressContainer = (status) => {
  const progressContainer = document.createElement("div");
  const acceptedLabel = document.createElement("span");
  const inProgressLabel = document.createElement("span");
  const completedLabel = document.createElement("span");
  const progressBar = document.createElement("div");
  const progress = document.createElement("span");

  progressContainer.className = "Progress__container";
  acceptedLabel.className = "step";
  inProgressLabel.className = "step";
  completedLabel.className = "step";
  progressBar.className = "Progress__bar";
  progress.className = "progress";
  progress.style = "width: 0px";

  acceptedLabel.id = "ACCEPTED";
  inProgressLabel.id = "IN_PROGRESS";
  completedLabel.id = "COMPLETED";

  acceptedLabel.textContent = "Accettata";
  inProgressLabel.textContent = "In lavorazione";
  completedLabel.textContent = "Completata";

  let currentStep = 0;

  switch (status) {
    case "COMPLETED":
      completedLabel.classList.add("active");
      currentStep += 1;
    case "IN_PROGRESS":
      inProgressLabel.classList.add("active");
      currentStep += 1;
    case "ACCEPTED":
      acceptedLabel.classList.add("active");
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
    acceptedLabel,
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
