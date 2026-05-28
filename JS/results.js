const container = document.getElementById("results-container");

// TEAM COLORS
const teamColors = {
  "Red Bull Racing": "#0600EF",
  "Ferrari": "#DC0000",
  "Mercedes": "#00D2BE",
  "McLaren": "#FF8700",
  "Aston Martin": "#006F62",
  "Alpine": "#0090FF",
  "Haas F1 Team": "#FFFFFF",
  "Williams": "#005AFF",
  "Audi": "#4142418c",
  "Racing Bulls": "#2B4562",
  "Cadillac": "#B9B9B9",
};


// FORMAT RACE TIME
function formatRaceTime(seconds) {

  if (!seconds) return "N/A";

  const hrs = Math.floor(seconds / 3600);

  const mins = Math.floor((seconds % 3600) / 60);

  const secs = (seconds % 60).toFixed(3);

  // under 1 timme
  if (hrs <= 0) {
    return `${mins}m ${secs}s`;
  }

  // normalt race
  return `${hrs}h ${mins}m ${secs}s`;
}


// FORMAT GAP TO LEADER
function formatGap(gap, position) {

  // vinnaren
  if (position === 1) {
    return "N/A";
  }

  // inget värde
  if (!gap) {
    return "N/A";
  }

  // om API redan skickar +1 LAP osv
  if (typeof gap === "string" && gap.includes("LAP")) {
    return gap;
  }

  // annars sekunder
  return `+${parseFloat(gap).toFixed(3)}s`;
}



// HÄMTA RESULTAT + DRIVERS
Promise.all([

  fetch("https://api.openf1.org/v1/session_result?session_key=latest")
    .then(res => res.json()),

  fetch("https://api.openf1.org/v1/drivers?session_key=latest")
    .then(res => res.json())

])

.then(([results, drivers]) => {

  // SORTERA EFTER POSITION
  results.sort((a, b) => {

    if (!a.position) return 1;
    if (!b.position) return -1;

    return a.position - b.position;

  });

  // LOOPA FÖRARE
  results.forEach((result) => {

    // HITTA DRIVER
    const driver = drivers.find(
      d => d.driver_number == result.driver_number
    );

    // om ingen driver hittas
    if (!driver) return;

    // SKAPA FIELDSET
    const card = document.createElement("fieldset");

    card.classList.add("result-card");

    // TEAM COLOR
    const color = teamColors[driver.team_name] || "red";

    card.style.borderColor = color;

    // PODIUM
    if (result.position === 1) {
      card.classList.add("gold");
    }

    if (result.position === 2) {
      card.classList.add("silver");
    }

    if (result.position === 3) {
      card.classList.add("bronze");
    }

    // STATUS
    let status = "Finished";

    if (result.dnf) {
      status = "DNF";
      card.classList.add("dnf-card");
    }

    if (result.dns) {
      status = "DNS";
      card.classList.add("dnf-card");
    }

    if (result.dsq) {
      status = "DSQ";
      card.classList.add("dnf-card");
    }

    // WINNER BADGE
    let badge = "";

    if (result.position === 1) {
      badge = `
        <span class="fastest-lap">
          WINNER
        </span>
      `;
    }

    // BILD
    const image = driver.headshot_url
      ? driver.headshot_url
      : "../Bilder/defaultdriver.png";

    // HTML
    card.innerHTML = `

      <legend>
        ${result.position ? `P${result.position}` : "DNF"}
      </legend>

      <div class="result-content">

        <img src="${image}" class="result-img">

        <div class="result-info">

          <h2>
            ${driver.full_name}
            ${badge}
          </h2>

          <p><b>Driver Number:</b> #${driver.driver_number}</p>

          <p><b>Team:</b> ${driver.team_name}</p>

          <p><b>Position:</b> ${result.position || "DNF"}</p>

          <p><b>Race Time:</b> ${formatRaceTime(result.duration)}</p>

          <p><b>Gap To Leader:</b> ${formatGap(result.gap_to_leader, result.position)}</p>

          <p><b>Laps Completed:</b> ${result.number_of_laps || "N/A"}</p>

          <p><b>Status:</b> ${status}</p>

        </div>

      </div>

    `;

    // LÄGG TILL
    container.appendChild(card);

  });

})

.catch((err) => {
  console.error(err);
});