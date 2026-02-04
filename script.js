// Horloge
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

// Météo
async function getWeather() {
    const apiKey = 'TA_CLE_OPENWEATHER';
    const city = 'Antibes';
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C - ${data.weather[0].main}`;
    } catch {
        document.getElementById('temp').innerText = "18°C (Mode démo)";
    }
}
getWeather();