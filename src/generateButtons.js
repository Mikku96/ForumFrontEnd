import { messageReceiver } from "./main.js";

const messagesPerPage = 10;

// Populates the navigation bars both above and below the main message view with 
// buttons for changing message pages
function makeButtons(messages, currentIndex) {
    const indexButtonCount = Math.ceil(messages.length / messagesPerPage);
    const pageNavs = document.querySelectorAll(".pageNav"); // Top and bottom navigation button bars
    removeButtons();

    pageNavs.forEach((element) => {
        const indexButtonsDiv = document.createElement("div");
        indexButtonsDiv.setAttribute("id", "pageNavSwitches");

        const pageNumber = document.createElement("div");
        pageNumber.innerHTML = `Page ${(currentIndex + 1)} of ${indexButtonCount}`;
        pageNumber.setAttribute("id", "pageNumber");
        indexButtonsDiv.append(pageNumber);

        for (let i = 0; i < indexButtonCount; i++) {
            const indexButton = document.createElement("button");
            indexButton.setAttribute("class", "switch");
            indexButton.innerHTML = i + 1;

            indexButton.addEventListener("click", async () => {
                await messageReceiver(i);
            });

            // Displays no more than 7 page buttons, including first and last pages,
            // adding arrows in place of omitted pages
            if (indexButtonCount > 7) {
                if (currentIndex <= 3) {
                    if (!(i <= 5 || i === indexButtonCount - 1)) {
                        indexButton.style.display = "none";
                    }
                    if (i === indexButtonCount - 2) {
                        const arrow = document.createElement("div");
                        arrow.innerHTML = "&#129130";
                        arrow.setAttribute("id", "arrow");
                        indexButtonsDiv.append(arrow);
                    }
                }
                else if (currentIndex >= indexButtonCount - 4) {
                    if (!(i === 0 || i >= indexButtonCount - 6)) {
                        indexButton.style.display = "none";
                    }
                    if (i === 1) {
                        const arrow = document.createElement("div");
                        arrow.innerHTML = "&#129130";
                        arrow.setAttribute("id", "arrow");
                        indexButtonsDiv.append(arrow);
                    }
                }
                else {
                    if (!((i === 0 || i === indexButtonCount - 1) ||
                        (i >= currentIndex - 2 && i <= currentIndex + 2))) {
                        indexButton.style.display = "none";
                    }
                    if (i === currentIndex - 3 || i === currentIndex + 3) {
                        const arrow = document.createElement("div");
                        arrow.innerHTML = "&#129130";
                        arrow.setAttribute("id", "arrow");
                        indexButtonsDiv.append(arrow);
                    }
                }
            }
            if (i === currentIndex)
                indexButton.style["background-color"] = "yellow";

            indexButtonsDiv.appendChild(indexButton);
        }

        // Shows a "Next" button if not on the last page
        if (currentIndex !== indexButtonCount - 1) {
            const nextButton = document.createElement("button");
            nextButton.innerHTML = "Next";
            nextButton.setAttribute("class", "next");
            nextButton.addEventListener('click', async () => {
                if (currentIndex + 1 < indexButtonCount) {
                    await messageReceiver(currentIndex + 1);
                }
            });
            indexButtonsDiv.appendChild(nextButton);
        }

        element.appendChild(indexButtonsDiv);
    });
}

// For removing previous navigation buttons before creating new ones
function removeButtons() {
    const topNav = document.querySelector(".pageNav.start");
    const bottomNav = document.querySelector(".pageNav.end");

    if (topNav) {
        const existingButtons = topNav.querySelector("#pageNavSwitches");
        if (existingButtons) {
            topNav.removeChild(existingButtons);
        }
    }
    if (bottomNav) {
        const existingButtons = bottomNav.querySelector("#pageNavSwitches");
        if (existingButtons) {
            bottomNav.removeChild(existingButtons);
        }
    }
}

export { makeButtons };