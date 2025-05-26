const BASER_URL = "http://localhost:8080";

export let userProfile = null;

export const Loader = () => {
  const loaderContainer = document.createElement("div");
  const loader = document.createElement("span");

  loaderContainer.id = "loader";
  loaderContainer.className = "loader__container";
  loader.className = "loader";

  loaderContainer.appendChild(loader);
  return loaderContainer;
};

export const clearContainer = (container) => {
  Array.from(container.children).forEach((child) => child.remove());
};

/** START NETWORKS UTILS **/

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

export const clearAllCookies = () => {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

const httpRequest = async (method, path, body = null) => {
  const token = getCookie("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASER_URL}/${path}`, options);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: "UNKNOWN", description: "Unknown error" };
    }

    throw {
      status: response.status,
      ...errorData,
    };
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const checkTokenValidity = async () => {
  const token = getCookie("token");

  if (!token) {
    clearAllCookies();
    window.location.href = "/login.html";
    return;
  }

  try {
    userProfile = await HTTP_GET("auth/profile");
  } catch (err) {
    console.warn("Token non valido o scaduto:", err.message);
    window.location.href = "/login.html";
  }
};

export const HTTP_GET = (path) => httpRequest("GET", path);
export const HTTP_POST = (path, body) => httpRequest("POST", path, body);
export const HTTP_PUT = (path, body) => httpRequest("PUT", path, body);
export const HTTP_PATCH = (path, body) => httpRequest("PATCH", path, body);
export const HTTP_DELETE = (path) => httpRequest("DELETE", path);

/** END NETWORKS UTILS **/

/** START COMPONENTS **/

export const genIcon = (iconName) => {
  const icon = document.createElement("span");
  icon.className = "material-symbols-outlined";
  icon.textContent = iconName;

  return icon;
};

export const StatusCard = (data, staff = false, onClick = null) => {
  const { status, vehicle, customer } = data;

  const statusCard = document.createElement("div");
  const imgContainer = document.createElement("div");
  const img = document.createElement("img");
  const textContainer = document.createElement("div");
  const customerInfo = document.createElement("div");
  const customerText = document.createElement("p");
  const vehicleInfoUp = document.createElement("div");
  const vehicleInfoDown = document.createElement("div");
  const statusInfo = document.createElement("div");

  const brandInfo = genLabelAndValue("Marca", vehicle.brand);
  const modelInfo = genLabelAndValue("Modello", vehicle.model);
  const plateNameInfo = genLabelAndValue("Targa", vehicle.nameplate);

  statusCard.className = "Status__card";
  imgContainer.className = "Status__card--img";
  textContainer.className = "Status__card--text";
  customerText.className = "Status__card--customer";

  vehicleInfoUp.className = "Status__card--vehicleInfo";
  vehicleInfoDown.className = "Status__card--vehicleInfo";

  statusInfo.className = "Info--content";

  img.src = "./public/moto.png";
  customerText.textContent = `Ciao ${customer.firstName} ${customer.lastName}`;

  customerInfo.appendChild(customerText);
  statusInfo.appendChild(genStatusLabel(status));
  vehicleInfoUp.append(brandInfo, modelInfo);
  vehicleInfoDown.append(plateNameInfo, statusInfo);
  imgContainer.appendChild(img);

  !staff && textContainer.appendChild(customerInfo);

  textContainer.append(vehicleInfoUp, vehicleInfoDown);

  if (staff) {
    const btn = document.createElement("button");
    btn.className = "Btn__primary";
    btn.textContent = "Apri pratica";

    onClick && btn.addEventListener("click", () => onClick(data.id));

    textContainer.appendChild(btn);
  }

  statusCard.append(imgContainer, textContainer);

  return statusCard;
};

export const genStatusLabel = (status) => {
  const statusLabel = document.createElement("span");

  statusLabel.className = `Status__label ${status}`;

  switch (status) {
    case "ACCEPTED":
      statusLabel.textContent = "ACCETTATA";
      break;
    case "IN_PROGRESS":
      statusLabel.textContent = "IN LAVORAZIONE";
      break;
    case "COMPLETED":
      statusLabel.textContent = "COMPLETATA";
      break;
  }

  return statusLabel;
};

export const genLabelAndValue = (label, value) => {
  const container = document.createElement("div");
  const labelText = document.createElement("span");
  const valueText = document.createElement("p");

  container.className = "Info--content";

  labelText.textContent = label;
  valueText.textContent = value;

  container.append(labelText, valueText);
  return container;
};

/** END COMPONENTS **/

/** START UTILS **/

export const dateFormatter = (date) => {
  const newDate = new Date(date);

  // Estrai giorno, mese, anno con padding
  const day = String(newDate.getDate()).padStart(2, "0");
  const month = String(newDate.getMonth() + 1).padStart(2, "0"); // +1 perché i mesi partono da 0
  const year = newDate.getFullYear();

  return `${day}/${month}/${year}`;
};

/** END UTILS **/
