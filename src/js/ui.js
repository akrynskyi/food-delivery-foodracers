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

// gallery
const images = document.querySelectorAll(".gallery-image");
const lightbox = document.querySelector(".lightbox");
const imageContainer = document.querySelector(".lightbox-container");

images.forEach(image => {
  image.addEventListener("click", () => {
    lightbox.classList.add("active");
    const lightboxImage = document.createElement("img");
    lightboxImage.classList.add("lightbox-image");
    lightboxImage.src = image.src;
    while (imageContainer.firstChild) {
      imageContainer.removeChild(imageContainer.firstChild);
    }
    imageContainer.appendChild(lightboxImage);
  });
});
lightbox.addEventListener("click", e => {
  if (e.target !== e.currentTarget) return;
  lightbox.classList.remove("active");
});
