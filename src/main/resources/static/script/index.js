import {
  Loader,
  HTTP_GET,
  StatusCard,
  clearContainer,
  errorHandle,
} from "./main.js";

window.searchPractice = (e) => {
  e.preventDefault();

  const practiceId = document.querySelector("#practiceId").value;
  const nameplate = document.querySelector("#nameplate").value;

  const resultCard = document.querySelector("#searchResult");

  resultCard.appendChild(Loader());

  HTTP_GET(`practice/search?practiceId=${practiceId}&nameplate=${nameplate}`)
    .then((data) => {
      clearContainer(resultCard);
      resultCard.appendChild(StatusCard(data));
    })
    .catch((e) => {
      clearContainer(resultCard);
      resultCard.appendChild(errorHandle(`PRACTICE_${e.error}`));
    })
    .finally(() => {
      document.querySelector("#loader").remove();
    });
};
