
let area = document.querySelector("h2");
let time = document.querySelector("#time");
let temp = document.querySelector("#temp");
let wspeed = document.querySelector("#windspeed");
let msg = document.querySelector("#msg");
let loading = document.querySelector(".loading");
let forecast = document.querySelector(".forecast");

document.addEventListener("DOMContentLoaded", (e) => {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            console.log(latitude, longitude)
            console.log(position.coords.accuracy)

            if (position.coords.accuracy > 400000) {


                alert("low accuracy try again")
                loading.style.border = "none"
                loading.style.animation = "none"
                loading.innerHTML = "Try Again.."
                // loading.classList.add("Low accuracy try Again")
                return
            }

            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                .then(res => res.json())
                .then(data => {
                    console.log(data)

                    let addr = data.address;

                    let place =
                        addr.village ||
                        addr.town ||
                        addr.city ||
                        addr.hamlet ||
                        "Unknown";

                    let district = addr.state_district || addr.state || "";

                    area.innerHTML += `${place} - ${district}  <span class="material-symbols-outlined">distance</span> `;
                    // area.innerHTML = data.address.village + " - " + data.address.state_district
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally((f) => {
                    loading.style.display = "none"
                });


            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=auto`)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    time.innerHTML = ` <span class="material-symbols-outlined">calendar_month</span> ${data.current_weather.time.slice(0, 10)} `
                    temp.innerHTML = `  Temp<span class="material-symbols-outlined">heat</span> : ${data.current_weather.temperature} ${data.current_weather_units.temperature}`
                    wspeed.innerHTML = ` Wind<span class="material-symbols-outlined">
air
</span> : ${data.current_weather.windspeed} ${data.current_weather_units.windspeed}`

                    if (data.current_weather.temperature <= 0) {
                        msg.innerHTML = `Its Freezing Today <span class="material-symbols-outlined">snowflake</span>  `
                    }
                    else if (data.current_weather.temperature <= 13) {
                        msg.innerHTML = `Its coldy Today <span class="material-symbols-outlined">mode_heat_off</span>  `
                    }
                    else if (data.current_weather.temperature <= 20) {
                        msg.innerHTML = `Its sunny Today <span class="material-symbols-outlined">sunny</span>  `
                    }

                    else if (data.current_weather.temperature < 28) {
                        msg.innerHTML = `Its Good Today <span class="material-symbols-outlined">clear_day</span>  `
                    }
                    else {
                        msg.innerHTML = `Its Hot Today <span class="material-symbols-outlined">mode_heat</span>  `
                    }

                    let daily = data.daily;
                    let dailyunit = data.daily_units;
                    let forecasthtml = "";

                    for (let i = 1; i < 7; i++) {
                        //  console.log(i)
                        forecasthtml += `
                         <div class="box"> 
                         <p>${daily.time[i]}</p>
                         <p>Min : ${daily.temperature_2m_min[i]} ${dailyunit.temperature_2m_max}</p>
                         <p>Max : ${daily.temperature_2m_max[i]} ${dailyunit.temperature_2m_max}</p>
                         <p>Wind: ${daily.windspeed_10m_max[i]} ${dailyunit.windspeed_10m_max}</p>
                         </div>
                         `
                    }
                    forecast.innerHTML = forecasthtml;


                })
                .catch(error => {
                    console.log(error)
                })


        }, (error) => {
            alert("location acces denied")
            console.log(error)
        })

    }
})
