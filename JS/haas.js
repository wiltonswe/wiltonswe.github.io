fetch("https://api.openf1.org/v1/championship_teams?session_key=latest&team_name=Haas")
  .then(response => response.json())
  .then(data => {

    const team = data[0];

    if (!team) {
      console.log("Ingen data hittades");
      return;
    }

    document.getElementById("team-name").textContent = team.team_name;
    document.getElementById("points").textContent = team.points_current;
    document.getElementById("position").textContent = team.position_current;
    document.getElementById("points-start").textContent = team.points_start;
    document.getElementById("position-start").textContent = team.position_start;

  })
  .catch(err => {
    console.error("Fel:", err);
  });