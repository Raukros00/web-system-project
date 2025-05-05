import {
  checkTokenValidity,
  clearContainer,
  genIcon,
  genLabelAndValue,
  HTTP_GET,
  Loader,
  StatusCard,
  userProfile,
  genStatusLabel,
} from "./main.js";

const MAIN = document.querySelector(".Main__Container");
const pageTitle = document.querySelector("#pageTitle");
const loader = Loader();

window.addEventListener("DOMContentLoaded", async () => {
  await checkTokenValidity();

  if (userProfile) {
    document.querySelector(
      "#helloUser"
    ).textContent = `Ciao ${userProfile.firstName} ${userProfile.lastName}!`;
  }

  switch (userProfile.role) {
    case "MECHANIC":
      await buildMechanicDashboard();
      break;

    default:
      window.location.href = "/login.html";
      break;
  }
});

const populateMenu = (menuItems) => {
  const menu = document.querySelector("#menuList");
  clearContainer(menu);

  menuItems.map((item) => {
    const menuItem = document.createElement("li");
    menuItem.className = item.active ? "active" : "";
    menuItem.append(genIcon(item.iconName), item.label);
    menuItem.addEventListener("click", () => {
      menuItems.forEach((i) => (i.active = false));
      item.active = true;
      populateMenu(menuItems);
      item.navAction();
    });
    menu.appendChild(menuItem);
  });
};

const buildMechanicDashboard = async () => {
  //Build menu
  const menu = [
    {
      label: "Home",
      iconName: "home",
      navAction: () => buildMechanicPracticesList(),
      active: true,
    },
    {
      label: "Pratiche complete",
      iconName: "task_alt",
      navAction: () => buildMechanicCompletedPractices(),
    },
  ];

  populateMenu(menu);
  buildMechanicPracticesList();
};

const buildMechanicPracticesList = async () => {
  clearContainer(MAIN);

  MAIN.appendChild(loader);
  const practicesList = await HTTP_GET("practice/");
  loader.remove();
  buildPracticesList(practicesList);
};

const buildMechanicCompletedPractices = async () => {
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

  const workDescriptionInput = document.createElement("textarea");

  editorCard.className = "Editor__card";

  editorCard.append(workDescriptionInput);

  return editorCard;
};
