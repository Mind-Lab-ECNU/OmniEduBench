document.addEventListener('DOMContentLoaded', () => {
  if (window.bulmaCarousel) {
    window.bulmaCarousel.attach('[data-carousel]');
  }
  if (window.bulmaSlider) {
    window.bulmaSlider.attach('[data-slider]');
  }
});
