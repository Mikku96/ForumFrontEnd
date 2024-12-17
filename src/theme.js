const theme = localStorage.getItem("theme");
const container = document.querySelector(".container");

if (theme === "dark-theme") {
    document.body.classList.add("dark-theme");
    container.classList.add("dark-container");
}

function toggleTheme() {
    if (document.body.classList.contains("dark-theme")) {
        document.body.classList.remove("dark-theme");
        container.classList.remove("dark-container");
        localStorage.removeItem("theme");
    }
    else {
        document.body.classList.add("dark-theme");
        container.classList.add("dark-container");
        localStorage.setItem("theme", "dark-theme");
    }
}

document.getElementById("themeButton").addEventListener("click", toggleTheme);