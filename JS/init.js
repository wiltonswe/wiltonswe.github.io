const sessionNameEl = document.getElementById("session-name");
const countdownEl = document.getElementById("countdown");

let calendar = [];

fetch("../JS/calendar.json")
  .then(res => {
    if (!res.ok) {
      throw new Error("Kunde inte ladda calendar.json");
    }
    return res.json();
  })
  .then(data => {
    calendar = data;
    console.log("Calendar laddad:", calendar);
    start();
  })
  .catch(err => console.error("JSON error:", err));

function getNextSession() {
  const now = new Date();

  for (let gp of calendar) {
    for (let session of gp.sessions) {
      const sessionDate = new Date(session.date);

      if (sessionDate > now) {
        return {
          gp: gp.gp,
          name: session.name,
          date: sessionDate
        };
      }
    }
  }

  return null;
}

function start() {
  setInterval(() => {

    const next = getNextSession();

    if (!next) {
      sessionNameEl.textContent = "Säsongen är slut 🏁";
      countdownEl.textContent = "";
      return;
    }

    const now = new Date();
    const diff = next.date - now;


    if (diff <= 0) {
      countdownEl.textContent = "00d 00h 00m 00s";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    sessionNameEl.textContent = `${next.gp} - ${next.name}`;

    countdownEl.textContent =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;

  }, 1000);
}

let header = document.querySelector("header");
header.innerHTML = `
 <nav class="navbar navbar-expand-lg bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="index.html">
  <img src="/Bilder/f1logga.png" alt="f1logga" class="nav-logo">
</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Meny">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <a class="nav-link" href="/Html/index.html">Home</a>
        <a class="nav-link" href="/Html/highlights.html">Highlights</a>
        <a class="nav-link" href="/Html/comp.html">Competition</a>
        <a class="nav-link" href="/Html/nyheter.html">Nyheter</a>
        <a class="nav-link" href="/Html/statistik.html">Statistik</a>
        <a class="nav-link" href="/Html/gs.html">Ghost car</a>
        <a class="nav-link" href="/Html/bana.html">Banor</a>
        <a class="nav-link" href="/Html/result.html">Resultat</a>
      </div>
    </div>
  </div>
</nav>`