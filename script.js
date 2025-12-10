const startDate = new Date("2025-10-06T00:00:00");
const formattedDate = startDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});
function initGallery() {
const gallery = document.getElementById("gallery");
const totalImages = 48;
const folder = "us/";

// Generate images
for (let i = 1; i <= totalImages; i++) {
    const img = document.createElement("img");
    img.src = `${folder}image (${i}).jpg`;
    img.alt = `Photo ${i}`;
    gallery.appendChild(img);
}

// Duplicate images for seamless loop
gallery.innerHTML += gallery.innerHTML;

let scrollSpeed = 1; // pixels per frame

function autoScroll() {
    gallery.scrollLeft += scrollSpeed;

    // Loop back to start
    if (gallery.scrollLeft >= gallery.scrollWidth / 2) {
        gallery.scrollLeft = 0;
    }

    requestAnimationFrame(autoScroll);
}

autoScroll();

}

function updateTimer() {
   const now = new Date();

// Calculate months
let months = (now.getFullYear() - startDate.getFullYear()) * 12;
months += now.getMonth() - startDate.getMonth();
if (now.getDate() < startDate.getDate()) months--;

// Calculate remaining days, hours, minutes, seconds
const tempDate = new Date(startDate);
tempDate.setMonth(tempDate.getMonth() + months);

const diff = now - tempDate;

const days = Math.floor(diff / (1000 * 60 * 60 * 24));
const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
const minutes = Math.floor((diff / (1000 * 60)) % 60);
const seconds = Math.floor((diff / 1000) % 60);

function pluralize(value, unit) {
    return `${value} ${unit}${value <= 1 ? '' : 's'}`;
}

const dateEl = document.getElementById("date");
const timerEl = document.getElementById("timer");

if (dateEl && timerEl) {
    document.getElementById("date").textContent = `AYA! We've been together since ${formattedDate}`;
timerEl.textContent = `${pluralize(months, 'month')}, ${pluralize(days, 'day')}, ${pluralize(hours, 'hour')}, ${pluralize(minutes, 'minute')}, and ${pluralize(seconds, 'second')}.`;
}


}

// Run after DOM loads
window.addEventListener("DOMContentLoaded", () => {
    initGallery();
    updateTimer();
    setInterval(updateTimer, 1000);
});
