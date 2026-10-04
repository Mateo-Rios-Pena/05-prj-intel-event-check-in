const GOAL = 50; 
const STORAGE_KEY = "intelSummitCheckIn";


const TEAM_NAMES = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};


const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const celebration = document.getElementById("celebration");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");

const teamCountElements = {
  water: document.getElementById("waterCount"),
  zero: document.getElementById("zeroCount"),
  power: document.getElementById("powerCount"),
};




let count = 0;                               
let teamCounts = { water: 0, zero: 0, power: 0 }; 
let attendees = [];                    



function saveProgress() {
  try {
    const data = { count: count, teamCounts: teamCounts, attendees: attendees };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Could not save progress:", error);
  }
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      count = saved.count || 0;
      teamCounts = saved.teamCounts || teamCounts;
      attendees = saved.attendees || [];
    }
  } catch (error) {
    console.error("Could not load saved progress:", error);
  }
}


function showMessage(text, styleClass) {
  greeting.textContent = text;
  greeting.className = styleClass;
  greeting.style.display = "block";
}


function renderAttendeeList() {
  attendeeList.innerHTML = ""; 

  if (attendees.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty";
    emptyItem.textContent = "No one has checked in yet.";
    attendeeList.appendChild(emptyItem);
    return;
  }

  attendees.forEach(function (person) {
    const item = document.createElement("li");
    item.className = person.team;

    const nameSpan = document.createElement("span");
    nameSpan.className = "attendee-name";
    nameSpan.textContent = person.name;

    const teamSpan = document.createElement("span");
    teamSpan.className = "attendee-team";
    teamSpan.textContent = TEAM_NAMES[person.team];

    item.appendChild(nameSpan);
    item.appendChild(teamSpan);
    attendeeList.appendChild(item);
  });
}

function updateCelebration() {
  if (count < GOAL) {
    celebration.hidden = true;
    return;
  }

  const highest = Math.max(teamCounts.water, teamCounts.zero, teamCounts.power);
  const winners = [];
  for (const team in teamCounts) {
    if (teamCounts[team] === highest) {
      winners.push(TEAM_NAMES[team]);
    }
  }

  if (winners.length === 1) {
    celebration.textContent =
      "🎉 We hit our goal of " + GOAL + " attendees! " +
      winners[0] + " wins with " + highest + " check-ins!";
  } else {
    celebration.textContent =
      "🎉 We hit our goal of " + GOAL + " attendees! It's a tie between " +
      winners.join(" and ") + " with " + highest + " check-ins each!";
  }
  celebration.hidden = false;
}


function updateDisplay() {
  attendeeCount.textContent = count;

  const percent = Math.min((count / GOAL) * 100, 100); 
  progressBar.style.width = percent + "%";

  for (const team in teamCounts) {
    teamCountElements[team].textContent = teamCounts[team];
  }

  renderAttendeeList();
  updateCelebration();
}




form.addEventListener("submit", function (event) {
  event.preventDefault(); 

  const name = nameInput.value.trim(); 
  const team = teamSelect.value;

  
  if (name === "" || team === "") {
    showMessage("Please enter a name and choose a team.", "error-message");
    return;
  }

  
  count++;
  teamCounts[team]++;
  attendees.unshift({ name: name, team: team }); 

 
  showMessage(
    "Welcome, " + name + "! You're checked in for " + TEAM_NAMES[team] + ". 🌱",
    "success-message"
  );
  updateDisplay();
  saveProgress();

  
  form.reset();
  nameInput.focus();
});




loadProgress();
updateDisplay();