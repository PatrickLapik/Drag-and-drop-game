function displayData(jsonData, targetElementId) {
  const jsonDisplayElement = document.getElementById(targetElementId);

  Object.keys(jsonData).forEach((key) => {
    const data = jsonData[key];

    const dataBox = document.createElement("div");

    const dataContent = document.createElement("p");

    dataContent.innerHTML =
      targetElementId === "itemDisplay" ? `${data.item}` : `${data.answer}`;

    const answerId = data.id;

    if (targetElementId === "itemDisplay") {
      dataBox.setAttribute("draggable", "true");
      dataBox.classList.add("item");

      dataBox.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", JSON.stringify(data));
      });
    } else {
      dataBox.classList.add("answer");
    }

    dataBox.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    dataBox.addEventListener("drop", (event) => {
      event.preventDefault();

      const draggedData = JSON.parse(event.dataTransfer.getData("text/plain"));

      if (draggedData.id == answerId) {
        console.log("Match");
      } else {
        console.log("No match");
      }
    });

    dataBox.appendChild(dataContent);
    jsonDisplayElement.appendChild(dataBox);
  });
}

fetch("data.json")
  .then((response) => response.json())
  .then((jsonData) => {
    displayData(jsonData, "itemDisplay");

    displayData(jsonData, "answerDisplay");
  });
