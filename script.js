function displayData(jsonData, targetElementId) {
	const jsonDisplayElement = document.getElementById(targetElementId);

	Object.keys(jsonData).forEach((key) => {
		const data = jsonData[key];

		const dataBox = document.createElement("div");

		dataBox.innerHTML =
			targetElementId === "itemDisplay" ? `${data.item}` : `${data.answer}`;

		const answerId = data.id;

		if (targetElementId === "itemDisplay") {
			dataBox.setAttribute("draggable", "true");

			dataBox.addEventListener("dragstart", (event) => {
				event.dataTransfer.setData("text/plain", JSON.stringify(data));
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

			const draggedData = JSON.parse(event.dataTransfer.getData("text/plain"));

			if (draggedData.id == answerId) {
				console.log("Match");
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
