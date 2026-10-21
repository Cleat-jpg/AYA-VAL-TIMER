const talkingDate = new Date("2025-10-06T00:00:00");
const officialDate = new Date("2025-12-16T00:00:00");

const fmt = { year: 'numeric', month: 'long', day: 'numeric' };
const talkingFormatted = talkingDate.toLocaleDateString('en-US', fmt);
const officialFormatted = officialDate.toLocaleDateString('en-US', fmt);

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

    const scrollSpeed = 0.8;   // pixels per frame (raise for faster)
    let pos = 0;

    function autoScroll() {
        // Exact distance from the first photo to its duplicate
        const loop = gallery.children[totalImages].offsetLeft - gallery.children[0].offsetLeft;

        if (loop > 0) {
            pos += scrollSpeed;
            if (pos >= loop) pos -= loop;
            gallery.scrollLeft = pos;
        }

        requestAnimationFrame(autoScroll);
    }

    autoScroll();
}

function pluralize(value, unit) {
    return `${value} ${unit}${value === 1 ? '' : 's'}`;
}

// Time elapsed since a start date, as months/days/hours/minutes/seconds
function elapsedSince(start) {
    const now = new Date();

    let months = (now.getFullYear() - start.getFullYear()) * 12;
    months += now.getMonth() - start.getMonth();
    if (now.getDate() < start.getDate()) months--;
    if (months < 0) months = 0;

    const tempDate = new Date(start);
    tempDate.setMonth(tempDate.getMonth() + months);

    const diff = now - tempDate;
    return {
        months,
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
    };
}

function formatElapsed(t) {
    return `${pluralize(t.months, 'month')}, ${pluralize(t.days, 'day')}, ${pluralize(t.hours, 'hour')}, ${pluralize(t.minutes, 'minute')}, and ${pluralize(t.seconds, 'second')}.`;
}

function formatDiff(diff) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${pluralize(days, 'day')}, ${pluralize(hours, 'hour')}, ${pluralize(minutes, 'minute')}, and ${pluralize(seconds, 'second')}`;
}

function ordinal(n) {
    if (n === 1) return '1st';
    if (n === 2) return '2nd';
    if (n === 3) return '3rd';
    return `${n}th`;
}

// Countdown to the next anniversary of the official date
function formatCountdown() {
    const now = new Date();
    let next = new Date(now.getFullYear(), officialDate.getMonth(), officialDate.getDate());
    if (next <= now) {
        next = new Date(now.getFullYear() + 1, officialDate.getMonth(), officialDate.getDate());
    }
    const years = next.getFullYear() - officialDate.getFullYear();
    return `${formatDiff(next - now)} until our ${ordinal(years)} anniversary!`;
}

function updateTimer() {
    const dateEl = document.getElementById("date");
    const timerEl = document.getElementById("timer");
    const annivDateEl = document.getElementById("anniv-date");
    const annivTimerEl = document.getElementById("anniv-timer");
    const countdownEl = document.getElementById("anniv-countdown");

    if (dateEl && timerEl) {
        dateEl.textContent = `AYA! We've been talking since ${talkingFormatted}`;
        timerEl.textContent = formatElapsed(elapsedSince(talkingDate));
    }

    if (annivDateEl && annivTimerEl && countdownEl) {
        const now = new Date();
        if (now < officialDate) {
            annivDateEl.textContent = `Counting down to ${officialFormatted}`;
            annivTimerEl.textContent = `${formatDiff(officialDate - now)}.`;
            countdownEl.textContent = "";
        } else {
            annivDateEl.textContent = `Official since ${officialFormatted}`;
            annivTimerEl.textContent = formatElapsed(elapsedSince(officialDate));
            countdownEl.textContent = formatCountdown();
        }
    }
}

// Run after DOM loads
window.addEventListener("DOMContentLoaded", () => {
    initGallery();
    updateTimer();
    setInterval(updateTimer, 1000);
});