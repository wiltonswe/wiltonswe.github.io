const container = document.getElementById("results-container");


const teamColors = {
  "Red Bull Racing": "#0600EF",
  "Ferrari": "#DC0000",
  "Mercedes": "#00D2BE",
  "McLaren": "#FF8700",
  "Aston Martin": "#006F62",
  "Alpine": "#0090FF",
  "Haas F1 Team": "#FFFFFF",
  "Williams": "#005AFF",
  "Audi": "#525252a4",
  "Racing Bulls": "#2B4562",
  "Cadillac": "#dddddd",
};



function formatRaceTime(seconds) {

  if (!seconds) return "N/A";

  const hrs = Math.floor(seconds / 3600);

  const mins = Math.floor((seconds % 3600) / 60);

  const secs = (seconds % 60).toFixed(3);


  if (hrs <= 0) {
    return `${mins}m ${secs}s`;
  }


  return `${hrs}h ${mins}m ${secs}s`;
}



function formatGap(gap, position) {


  if (position === 1) {
    return "N/A";
  }

  
  if (!gap) {
    return "N/A";
  }


  if (typeof gap === "string" && gap.includes("LAP")) {
    return gap;
  }


  return `+${parseFloat(gap).toFixed(3)}s`;
}




Promise.all([

  fetch("https://api.openf1.org/v1/session_result?session_key=latest")
    .then(res => res.json()),

  fetch("https://api.openf1.org/v1/drivers?session_key=latest")
    .then(res => res.json())

])

.then(([results, drivers]) => {


  results.sort((a, b) => {

    if (!a.position) return 1;
    if (!b.position) return -1;

    return a.position - b.position;

  });


  results.forEach((result) => {


    const driver = drivers.find(
      d => d.driver_number == result.driver_number
    );


    if (!driver) return;


    const card = document.createElement("fieldset");

    card.classList.add("result-card");


    const color = teamColors[driver.team_name] || "red";

    card.style.borderColor = color;


    if (result.position === 1) {
      card.classList.add("gold");
    }

    if (result.position === 2) {
      card.classList.add("silver");
    }

    if (result.position === 3) {
      card.classList.add("bronze");
    }


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


    let badge = "";

    if (result.position === 1) {
      badge = `
        <span class="fastest-lap">
          WINNER
        </span>
      `;
    }


    const image = driver.headshot_url
      ? driver.headshot_url
      : "../Bilder/defaultdriver.png";


    card.innerHTML = `

      <legend>
        ${result.position ? `P${result.position}` : "DNF"}
      </legend>

      <div class="result-content">

        <img 
          src="${image}" 
          class="result-img"
          alt="${driver.full_name} Formula 1 driver portrait"
          loading="lazy"
        >

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


    container.appendChild(card);

  });

})

.catch((err) => {
  console.error(err);
});