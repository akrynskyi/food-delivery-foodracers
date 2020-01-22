$(document).ready(() => {
  $(".section-header-slider").slick({
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: "linear",
    draggable: false,
    autoplay: true,
    autoplaySpeed: 2000
  });
});
