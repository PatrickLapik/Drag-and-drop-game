let timer;
let elapsedTimeSeconds = 0;
let elapsedTimeMinutes = 0;
let timeTaken = 0;

let answered = 0;

let wrongAnswers = 0;

window.onload = function () {
	startTimer();
};

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

//Timer
function startTimer() {
	timer = setTimeout(updateTimer, 1000);
}

function updateTimer() {
	elapsedTimeSeconds++;
	timeTaken++;
	if (elapsedTimeSeconds == 60) {
		elapsedTimeSeconds = 0;
		elapsedTimeMinutes++;
	}

	const formattedMinutes = String(elapsedTimeMinutes).padStart(2, "0");
	const formattedSeconds = String(elapsedTimeSeconds).padStart(2, "0");

	document.getElementById(
		"timer"
	).innerHTML = `Timer: ${formattedMinutes}:${formattedSeconds}`;

	timer = setTimeout(updateTimer, 1000);
}

function stopTimer() {
	clearTimeout(timer);
	elapsedTimeSeconds = 0;
	elapsedTimeMinutes = 0;
	document.getElementById("timer").innerHTML = "Timer: 0 seconds";
}
//

function gameEnd() {
	clearTimeout(timer);

	document.getElementById(
		"wrongAnswers"
	).innerHTML = `Wrong answers: ${wrongAnswers}`;

	document.getElementById(
		"timeTaken"
	).innerHTML = `Time taken: ${timeTaken} seconds`;

	document.getElementById("scorePopup").classList.remove("invisible");
}

function displayData(jsonData, targetElementId) {
	const jsonDisplayElement = document.getElementById(targetElementId);

	shuffleArray(jsonData);

	console.log(jsonData);

	jsonData.forEach((data) => {
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
				"text-xl",
				"min-[1920px]:text-2xl",
			];
			dataBox.classList.add(...divStyleItem);

			jsonDisplayElement.appendChild(dataBox);
		} else {
			const answerBoxContainer = document.createElement("div");
			answerBoxContainer.appendChild(dataBox);

			const containerStyle = [
				"flex",
				"flex-col",
				"p-4",
				"bg-white",
				"border-4",
				"border-violet-400",
				"border-dotted",
				"rounded-xl",
			];
			answerBoxContainer.classList.add(...containerStyle);

			const divStyleAnswer = [
				"flex",
				"flex-auto",
				"items-center",
				"justify-center",
				"text-center",
				"text-xl",
				"min-[1920px]:text-2xl",
			];
			dataBox.classList.add(...divStyleAnswer);

			jsonDisplayElement.appendChild(answerBoxContainer);

			answerBoxContainer.addEventListener("dragover", (event) => {
				event.preventDefault();
			});

			answerBoxContainer.addEventListener("drop", (event) => {
				event.preventDefault();

				const draggingItem = document.querySelector(".dragging");

				const draggedData = JSON.parse(
					event.dataTransfer.getData("text/plain")
				);

				if (draggedData.id == answerId) {
					answered++;

					const target = event.currentTarget;

					target.appendChild(draggingItem);

					target.classList.remove("border-violet-400");
					target.classList.add("border-green-400");

					if (Object.keys(jsonData).length == answered) {
						gameEnd();
					}
				} else {
					const target = event.currentTarget;

					target.classList.remove("border-violet-400");
					target.classList.add("border-red-400");

					setTimeout(() => {
						target.classList.remove("border-red-400");
						target.classList.add("border-violet-400");
					}, 1000);

					wrongAnswers++;
				}
			});
		}
	});
}

fetch("data.json")
	.then((response) => response.json())
	.then((jsonData) => {
		const shuffledData = Object.values(jsonData);

		const selectedData = shuffledData.slice(0, 15);
		displayData(selectedData, "itemDisplay");
		displayData(selectedData, "answerDisplay");
	});
