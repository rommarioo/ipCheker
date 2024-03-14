const button = document.querySelector(".button");
const input = document.querySelector("#search");
const mapConteiner = document.querySelector(".map");
const er = document.querySelector(".error");
let x = 0;
let y = 0;
let map = null;

getIpUser();

input.addEventListener("input", function (e) {
  const reg = new RegExp("[^0-9+.]", "g");
  this.value = this.value.replace(reg, "");
});
///
async function initMap(x, y) {
  try {
    await ymaps3.ready;

    const {
      YMap,
      YMapDefaultSchemeLayer,
      YMapMarker,
      YMapDefaultFeaturesLayer,
    } = ymaps3;
    er.style.opacity = 0;
    button.textContent = "Delete map";
    map = new YMap(
      document.querySelector("#map"),

      {
        location: {
          center: [x, y],
          zoom: 12,
        },
        zoomRange: { min: 12, max: 13 },
      }
    );

    const content = document.createElement("div");
    content.classList.add("marker");
    const marker = new YMapMarker(
      {
        coordinates: [x, y],
      },
      content
    );
    console.log(marker);
    map
      .addChild(new YMapDefaultSchemeLayer())
      .addChild(new YMapDefaultFeaturesLayer({ zIndex: 1800 }))
      .addChild(marker);

    mapConteiner.style.opacity = 1;
  } catch (error) {
    // setTimeout(() => {
    //   location.reload(true);
    // }, 1000);

    input.value = "";
    er.style.opacity = 1;
    er.innerHTML = "Incorrect adress<br> (enter by type xxx.xxx.xxx.xxx)";
  }
}
function destroyMap() {
  map.destroy();
  map = null;
  mapConteiner.style.opacity = 0;
  button.textContent = "Search ";
}

async function fetchIpLocation(addres) {
  try {
    const res = await fetch(`https://ipapi.co/${addres}/json/`);
    const data = await res.json();
    x = data.longitude;
    y = data.latitude;
    console.log(data);
    initMap(x, y);
  } catch (error) {
    setTimeout(() => {
      location.reload(true);
    }, 1000);

    input.value = "";
    er.style.opacity = 1;
    erinnerHTML = "Incorrect adress<br> (enter by type xxx.xxx.xxx.xxx)";
  }
}
async function getIpUser() {
  const res = await fetch("https://ipapi.co/json/");
  const userIp = await res.json();
  input.placeholder = `Your IP: ${userIp.ip}`;
  console.log(userIp.ip);
}

button.addEventListener("click", () => {
  if (!map) {
    const value = input.value;
    fetchIpLocation(value);
  } else {
    destroyMap();
  }
});
