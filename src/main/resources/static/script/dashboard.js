import {
  checkTokenValidity,
  clearContainer,
  genIcon,
  userProfile,
  clearAllCookies,
} from "./main.js";

import {
  buildMechanicPracticesList,
  buildMechanicCompletedPractices,
} from "./mechanic.js";

import {
  buildCustomersList,
  buildPracticesList,
  buildVehicleList,
} from "./acceptance.js";

import { buildPartsList } from "./warehouse.js";

import { buildUsersList } from "./admin.js";

import {
  buildCashierPracticesList,
  buildCashierCompletedPracticesList,
} from "./cashier.js";

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

    case "ACCEPTANCE_AGENT":
      await buildAcceptanceAgentDashboard();
      break;

    case "WAREHOUSE_WORKER":
      buildWareHouseWorkerDashboard();
      break;

    case "ADMIN":
      buildAdminDashboard();
      break;

    case "CASHIER":
      buildCashierDashboard();
      break;

    default:
      window.location.href = "/login.html";
      break;
  }
});

document.querySelector("#logout").addEventListener("click", () => {
  clearAllCookies();
  window.location.href = "/login.html";
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
  const menu = [
    {
      label: "Pratiche",
      iconName: "folder_open",
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

const buildAcceptanceAgentDashboard = async () => {
  const menu = [
    {
      label: "Pratiche",
      iconName: "folder_open",
      navAction: () => buildPracticesList(),
      active: true,
    },
    {
      label: "Clienti",
      iconName: "group",
      navAction: () => buildCustomersList(),
    },
    {
      label: "Motori",
      iconName: "settings",
      navAction: () => buildVehicleList(),
    },
  ];

  populateMenu(menu);
  buildPracticesList();
};

const buildWareHouseWorkerDashboard = async () => {
  const menu = [
    {
      label: "Magazzino",
      iconName: "inventory_2",
      navAction: () => buildPartsList(),
      active: true,
    },
  ];

  populateMenu(menu);
  buildPartsList();
};

const buildAdminDashboard = async () => {
  const menu = [
    {
      label: "Utenti",
      iconName: "group",
      navAction: () => buildUsersList(),
      active: true,
    },
  ];

  populateMenu(menu);
  buildUsersList();
};

const buildCashierDashboard = async () => {
  const menu = [
    {
      label: "Cassa",
      iconName: "euro",
      navAction: () => buildCashierPracticesList(),
      active: true,
    },
    {
      label: "Archivio",
      iconName: "receipt",
      navAction: () => buildCashierCompletedPracticesList(),
    },
  ];

  populateMenu(menu);
  buildCashierPracticesList();
};
