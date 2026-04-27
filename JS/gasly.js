fetch("https://api.openf1.org/v1/drivers?driver_number=10&session_key=latest")
  .then(res => res.json())
  .then(data => {

    const driver = data[0];

    document.getElementById("driver-name").textContent = driver.full_name;
    document.getElementById("driver-number").textContent = driver.driver_number;
    document.getElementById("team-name").textContent = driver.team_name;
    document.getElementById("country").textContent = driver.country_code;
    document.getElementById("headshot-url").src = driver.headshot_url;
  })
  .catch(err => {
    console.error("Fel:", err);
  });