document.addEventListener("DOMContentLoaded", async () => {
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const sliderImages = document.querySelectorAll(".slide");

  let currentSlideIndex = 0;
  
  setInterval(() => {
    if (currentSlideIndex < sliderImages.length - 1) {
      currentSlideIndex += 1;
    } else {
      currentSlideIndex = 0;
    }
    if (sliderWrapper) {
      sliderWrapper.style.transform = `translateX(-${
        currentSlideIndex * 100
      }%)`;
    }
  }, 4000);

})
