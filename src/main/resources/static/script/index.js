import { Loader, HTTP_GET, StatusCard } from "./main.js";

window.searchPractice = (e) => {
  e.preventDefault();

  const practiceId = document.querySelector("#practiceId").value;
  const nameplate = document.querySelector("#nameplate").value;

  document.querySelector("#searchCard").appendChild(Loader());

  HTTP_GET(`practice/search?practiceId=${practiceId}&nameplate=${nameplate}`)
    .then((data) => {
      document.querySelector("#searchCard").appendChild(StatusCard(data));
    })
    .catch((e) => {
      console.log("Errore", e);
    })
    .finally(() => {
      document.querySelector("#loader").remove();
    });
};
