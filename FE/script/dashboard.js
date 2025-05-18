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
      navAction: () => buildMechanicPracticesList(),
      active: true,
    },
    {
      label: "Clienti",
      iconName: "group",
      navAction: () => buildMechanicCompletedPractices(),
    },
    {
      label: "Motori",
      iconName: "settings",
      navAction: () => buildMechanicCompletedPractices(),
    },
  ];

  populateMenu(menu);
};
