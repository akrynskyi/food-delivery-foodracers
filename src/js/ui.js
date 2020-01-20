// sidebar navigation
const overlay = document.querySelector("#sidebarOverlay");
const burger = document.querySelector(".burger");
const sidebarNav = document.querySelector(".sidebar");
const closeNav = document.querySelector("#closeSidebar");

burger.addEventListener("click", () => {
  sidebarNav.classList.add("sidebar__open");
  overlay.classList.add("overlay__visible");
});
closeNav.addEventListener("click", () => {
  sidebarNav.classList.remove("sidebar__open");
  overlay.classList.remove("overlay__visible");
});
