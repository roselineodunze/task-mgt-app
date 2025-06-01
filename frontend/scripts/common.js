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

  async function fetchUser() {
    const response = await fetch("http://localhost:3000/api/auth/me");
    const data = await response.json();
    const user = data.user;
    console.log("user is", user);

    if (user) {
      return user;
    } else {
      console.error("No user found in session.");
    }
  }
})
