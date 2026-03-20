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