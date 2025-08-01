const ecoTips = [
  "Take a walk or cycle instead of using a vehicle.",
  "Turn off lights when not in use.",
  "Avoid plastic water bottles.",
  "Take shorter showers to save water.",
  "Bring your own cloth bag when shopping."
];

function initTracker() {
  const tipElement = document.getElementById("ecoTip");
  if (tipElement) {
    const randomTip = ecoTips[Math.floor(Math.random() * ecoTips.length)];
    tipElement.textContent = randomTip;
  }

  const form = document.getElementById("habitForm");
  const input = document.getElementById("habitInput");
  const count = document.getElementById("habitCount");
  const carbon = document.getElementById("carbonSaved");

  let habitLog = JSON.parse(localStorage.getItem("habitLog")) || [];
  if (count) count.textContent = `Total habits logged: ${habitLog.length}`;
  if (carbon) carbon.textContent = `Estimated CO₂ saved: ${(habitLog.length * 0.35).toFixed(2)} kg`;

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const habit = input.value.trim();
      if (habit) {
        const entry = {
          text: habit,
          date: new Date().toISOString().split("T")[0]
        };
        habitLog.push(entry);
        localStorage.setItem("habitLog", JSON.stringify(habitLog));
        count.textContent = `Total habits logged: ${habitLog.length}`;
        carbon.textContent = `Estimated CO₂ saved: ${(habitLog.length * 0.35).toFixed(2)} kg`;
        input.value = "";
        alert("Habit logged!");
        initProgress(); // Refresh badges and streak
      }
    });
  }
}

function initProgress() {
  const CO2_PER_HABIT = 0.5;
  const habitLog = JSON.parse(localStorage.getItem("habitLog")) || [];
  const badges = JSON.parse(localStorage.getItem("badges")) || [];

  const summary = document.getElementById("summary");
  const badge = document.getElementById("badge");
  const streakEl = document.getElementById("streak");
  const badgeContainer = document.getElementById("badges");

  const totalHabits = habitLog.length;
  if (summary) summary.textContent = `You've logged ${totalHabits} green habits so far. Keep going!`;

  let currentBadge = "🏅 Eco Starter";
  if (totalHabits >= 15) currentBadge = "🥇 Sustainability Star";
  else if (totalHabits >= 7) currentBadge = "🏆 Green Streaker";
  else if (totalHabits >= 3) currentBadge = "🎉 Eco Newbie";
  if (badge) badge.textContent = currentBadge;

  const uniqueDates = [...new Set(habitLog.map(h => h.date))].sort();
  let maxStreak = 0;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      currentStreak++;
    } else {
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 1;
    }
  }
  maxStreak = Math.max(maxStreak, currentStreak);
const activeDays = uniqueDates.length;
if (streakEl) streakEl.innerText = `🔥 Streak: ${maxStreak} day(s) | 📅 Active Days: ${activeDays}`;
  window.streak = maxStreak;
  window.activeDays = activeDays;

  if (totalHabits >= 3 && !badges.includes("Eco Newbie")) badges.push("Eco Newbie");
  if (totalHabits >= 7 && !badges.includes("Green Streaker")) badges.push("Green Streaker");
  if (totalHabits >= 15 && !badges.includes("Sustainability Star")) badges.push("Sustainability Star");
  localStorage.setItem("badges", JSON.stringify(badges));

  if (badgeContainer) {
    badgeContainer.innerHTML = "";
    badges.forEach(b => {
      const div = document.createElement("div");
      div.className = "badge";
      div.textContent = b;
      badgeContainer.appendChild(div);
    });
  }

  window.totalHabits = totalHabits;
  window.currentBadge = currentBadge.replace(/^.*? /, "");
}

function generateShareCard() {
  const canvas = document.getElementById('shareCardCanvas');
  const ctx = canvas.getContext('2d');
  const badgeImg = new Image();

  canvas.width = 500;
  canvas.height = 300;
  canvas.style.display = 'block';

  badgeImg.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e8f5e9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#2e7d32";
    ctx.font = "26px Verdana";
    ctx.fillText("🌿 Green Habit Tracker", 120, 50);

    ctx.font = "18px Arial";
    ctx.fillText(`✔️ Habits Logged: ${window.totalHabits}`, 50, 120);
    ctx.fillText(`🌱 CO₂ Saved: ${(window.totalHabits * 0.5).toFixed(2)} kg`, 50, 160);
    ctx.fillText(`🔥 Streak: ${window.streak} day(s)`, 50, 200);
ctx.fillText(`📅 Active Days: ${window.activeDays}`, 50, 230);
ctx.fillText(`🏅 Badge: ${window.currentBadge}`, 50, 260);

    ctx.drawImage(badgeImg, 370, 100, 100, 100);

    const link = document.getElementById('downloadLink');
    link.href = canvas.toDataURL("image/png");
    link.download = "green-impact-card.png";
    link.style.display = 'inline-block';
  };

  badgeImg.src = "green badge.jpg"; // Ensure image exists
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("ecoTip")) initTracker();
  if (document.getElementById("summary")) initProgress();
});
