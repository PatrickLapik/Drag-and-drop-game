let timer;
let elapsedTimeSeconds = 0;
let elapsedTimeMinutes = 0;

window.onload = function () {
  startTimer();
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  timer = setTimeout(updateTimer, 1000);
}

function updateTimer() {
  elapsedTimeSeconds++;
  if (elapsedTimeSeconds == 60) {
    elapsedTimeSeconds = 0;
    elapsedTimeMinutes++;
  }

  const formattedMinutes = String(elapsedTimeMinutes).padStart(2, "0");
  const formattedSeconds = String(elapsedTimeSeconds).padStart(2, "0");

  document.getElementById("timer")
  .innerHTML = `Timer: ${formattedMinutes}:${formattedSeconds}`;

  timer = setTimeout(updateTimer, 1000);
}

function stopTimer() {
  clearTimeout(timer);
  elapsedTime = 0;
  document.getElementById("timer").innerHTML = "Timer: 0 seconds";
}

function displayData(jsonData, targetElementId) {
  const jsonDisplayElement = document.getElementById(targetElementId);

  const shuffledData = Object.values(jsonData);
  shuffleArray(shuffledData);

  shuffledData.forEach((data) => {
    const dataBox = document.createElement("div");

    dataBox.innerHTML =
      targetElementId === "itemDisplay" ? `${data.item}` : `${data.answer}`;

    const answerId = data.id;

    if (targetElementId === "itemDisplay") {
      dataBox.setAttribute("draggable", "true");

      dataBox.addEventListener("dragstart", (event) => {
        dataBox.classList.add("dragging");
        event.dataTransfer.setData("text/plain", JSON.stringify(data));
      });

      dataBox.addEventListener("dragend", () => {
        dataBox.classList.remove("dragging");
      });

      const divStyleItem = [
        "bg-violet-100",
        "text-center",
        "border-4",
        "border-violet-400",
        "rounded-xl",
        "p-4",
      ];
      dataBox.classList.add(...divStyleItem);
    } else {
      const divStyleAnswer = [
        "flex",
        "self-center",
        "justify-center",
        "text-center",
        "bg-white",
        "border-4",
        "border-violet-400",
        "border-dotted",
        "rounded-xl",
        "p-4",
      ];
      dataBox.classList.add(...divStyleAnswer);
    }

    dataBox.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    dataBox.addEventListener("drop", (event) => {
      event.preventDefault();

      const draggingItem = document.querySelector(".dragging");

      const draggedData = JSON.parse(event.dataTransfer.getData("text/plain"));

      if (draggedData.id == answerId) {
        console.log("Match");
        event.target.appendChild(draggingItem);
      } else {
        console.log("No match");
      }
    });

    jsonDisplayElement.appendChild(dataBox);
  });
}

fetch("data.json")
  .then((response) => response.json())
  .then((jsonData) => {
    displayData(jsonData, "itemDisplay");

    displayData(jsonData, "answerDisplay");
  });
