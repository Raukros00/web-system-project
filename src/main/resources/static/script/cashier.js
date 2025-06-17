import {
  clearContainer,
  genLabelAndValue,
  HTTP_GET,
  HTTP_PATCH,
  Loader,
  StatusCard,
  genStatusLabel,
  genDivider,
  errorHandle,
} from "./main.js";

const MAIN = document.querySelector(".Main__Container");
const pageTitle = document.querySelector("#pageTitle");
const loader = Loader();

const getPractices = async (status) => {
  return await HTTP_GET(`practice/?status=${status}`);
};

const getPractice = async (practiceId) => {
  return await HTTP_GET(`practice/${practiceId}`);
};

export const buildCashierPracticesList = async () => {
  pageTitle.textContent = "Pratiche da pagare";
  clearContainer(MAIN);

  MAIN.appendChild(loader);
  const practicesList = await getPractices("TO_PAY");
  loader.remove();
  buildPracticesList(practicesList);
};

export const buildCashierCompletedPracticesList = async () => {
  pageTitle.textContent = "Archivio pratiche";
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
  MAIN.appendChild(genInfoCardPractice(practice));

  if (practice.status !== "COMPLETED") {
    MAIN.appendChild(genPaymentCard(practice));
  }
};

const genInfoCardPractice = (practice) => {
  const { customer, vehicle, usedSparePartList } = practice;
  const infoCard = document.createElement("div");
  const infoWrapper = document.createElement("div");
  const title = document.createElement("h2");
  const clientInformationTitle = document.createElement("h3");
  const clientInfoRow = document.createElement("div");
  const vehicleInformationTitle = document.createElement("h3");
  const vehicleInfoRow = document.createElement("div");
  const vehicleProblemRow = document.createElement("div");
  const mechanicOperationTitle = document.createElement("h3");
  const mechanicOperationRow = document.createElement("div");
  const status = document.createElement("div");

  infoCard.className = "Status__card";
  infoWrapper.className = "Info__wrapper";
  clientInfoRow.className = "Info__row";
  vehicleInfoRow.className = "Info__row";
  vehicleProblemRow.className = "Info__row";
  mechanicOperationRow.className = "Info__row";
  status.className = "Info--content";

  title.textContent = "Anagrafica";
  clientInformationTitle.textContent = "Cliente";
  vehicleInformationTitle.textContent = "Moto";
  mechanicOperationTitle.textContent = "Operato";

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

  const containerSpareParts = document.createElement("div");
  const labelSpareParts = document.createElement("span");

  containerSpareParts.className = "Info--content";
  labelSpareParts.textContent = "Pezzi usati";

  const sparePartsList = document.createElement("ul");
  usedSparePartList.forEach((sparePart) => {
    const sparePartItem = document.createElement("li");
    sparePartItem.textContent = `x${sparePart.quantity} €${sparePart.price} ${
      sparePart.sparePartName
    }  (TOT €${sparePart.price * sparePart.quantity})`;
    sparePartsList.appendChild(sparePartItem);
  });

  containerSpareParts.append(labelSpareParts, sparePartsList);

  mechanicOperationRow.append(
    genLabelAndValue("Ore lavorate", practice.totalHours),
    genLabelAndValue("Costo manodopera (ora)", `€${practice.manpowerCost}`),
    genLabelAndValue("Operazioni effettuate", practice.workDescription),
    containerSpareParts
  );

  infoWrapper.append(
    title,
    clientInformationTitle,
    clientInfoRow,
    genDivider(),
    vehicleInformationTitle,
    vehicleInfoRow,
    vehicleProblemRow,
    genDivider(),
    mechanicOperationTitle,
    mechanicOperationRow
  );
  infoCard.appendChild(infoWrapper);

  return infoCard;
};

const genPaymentCard = (practice) => {
  const paymentCard = document.createElement("div");
  const paymentWrapper = document.createElement("div");
  const errorContainer = document.createElement("div");
  const title = document.createElement("h2");

  const paymentRow = document.createElement("div");
  const paymentMethod = document.createElement("div");
  const confirmWrapper = document.createElement("div");
  const confirmBtn = document.createElement("button");

  paymentCard.className = "Status__card";
  paymentWrapper.className = "Info__wrapper";
  confirmWrapper.className = "Info--content flex-end";
  confirmWrapper.style = "flex: 0 0 auto; min-width: 30%";

  title.textContent = "Pagamento";

  paymentRow.className = "Info__row";
  paymentRow.style = "gap: 3rem";
  paymentMethod.className = "Info--content ";
  paymentMethod.style = "flex: 1 1 auto; min-width: 30%";

  const paymentMethodLabel = document.createElement("span");
  const paymentMethodInput = document.createElement("select");

  paymentMethodLabel.textContent = "Metodo di pagamento";

  const cardPayment = document.createElement("option");
  cardPayment.textContent = "Carta";
  cardPayment.value = "card";

  const cashPayment = document.createElement("option");
  cashPayment.textContent = "Contanti";
  cashPayment.value = "cash";

  paymentMethodInput.append(cardPayment, cashPayment);
  paymentMethodInput.className = "Input__Text";

  paymentMethod.append(paymentMethodLabel, paymentMethodInput);

  confirmBtn.className = "Btn primary";
  confirmBtn.textContent = "Conferma";
  confirmWrapper.appendChild(confirmBtn);

  paymentRow.append(
    genLabelAndValue("Prezzo totale", `€${practice.totalPrice}`),
    paymentMethod,
    confirmWrapper
  );

  confirmBtn.addEventListener("click", async () => {
    try {
      await HTTP_PATCH(`practice/${practice.id}`, { newStatus: "COMPLETED" });
      clearContainer(MAIN);
      MAIN.appendChild(loader);
      loader.remove();
      buildPracticeEditor(practice.id);
    } catch (e) {
      clearContainer(errorContainer);
      errorContainer.appendChild(errorHandle(`CASHIER_${e.error}`));
    }
  });

  paymentWrapper.append(title, paymentRow, errorContainer);
  paymentCard.appendChild(paymentWrapper);

  return paymentCard;
};
