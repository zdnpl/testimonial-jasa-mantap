async function getAPI() {
  const slider = document.getElementById("testimonialSlider");

  try {
    const response = await fetch("https://dummyjson.com/comments");
    const data = await response.json();

    // Add comments to the slider
    data.comments.forEach((comment) => {
      const htmlContent = `
        <div class="testimonial-card">
          <p class="mb-3">"${comment.body}"</p>
          <h5 class="fw-bold">${comment.user.fullName || "Anonymous"}</h5>
          <small class="text-muted usn">@${comment.user.username || "unknown"}</small>
        </div>`;
      slider.insertAdjacentHTML("beforeend", htmlContent);
    });

    // Enable sliding with cursor and touch
    enableCursorAndTouchSliding(slider);

    // Set the initial active testimonial (centered one)
    highlightCenter(slider);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function enableCursorAndTouchSliding(slider) {
  let isDown = false;
  let startX;
  let scrollLeft;

  // Mouse Events
  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.classList.add("active");
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.classList.remove("active");
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust scroll speed
    slider.scrollLeft = scrollLeft - walk;
  });

  // Touch Events (for mobile)
  slider.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust scroll speed
    slider.scrollLeft = scrollLeft - walk;
  });

  slider.addEventListener("touchend", () => {
    isDown = false;
  });
}

// Function to highlight the center card
function highlightCenter(slider) {
  const cards = slider.querySelectorAll(".testimonial-card");

  // Detect the center card based on scroll position
  slider.addEventListener("scroll", () => {
    let centerCard = null;
    let minDistance = Number.MAX_VALUE;

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const centerPosition = cardRect.left + cardRect.width / 2;
      const sliderCenter = slider.getBoundingClientRect().left + slider.offsetWidth / 2;
      const distance = Math.abs(centerPosition - sliderCenter);

      if (distance < minDistance) {
        minDistance = distance;
        centerCard = card;
      }
    });

    // Remove 'active' class from all cards
    cards.forEach((card) => {
      card.classList.remove("active");
    });

    // Add 'active' class to the centered card
    if (centerCard) {
      centerCard.classList.add("active");
    }
  });
}

// Fetch testimonials on page load
getAPI();
