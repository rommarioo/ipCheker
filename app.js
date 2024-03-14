const button = document.querySelector("button");
const input = document.querySelector("#search");
const mapConteiner = document.querySelector(".map");
const er = document.querySelector(".error");
let x = 0;
let y = 0;
let map = null;

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
      }
    );

    const content = document.createElement("div");
    content.classList.add("marker");
    const marker = new YMapMarker(
      {
        coordinates: [x, y],
        draggable: false,
      },
      content
    );
    console.log(map);
    map
      .addChild(new YMapDefaultSchemeLayer())
      .addChild(new YMapDefaultFeaturesLayer({ zIndex: 1800 }))
      .addChild(marker);

    mapConteiner.style.opacity = 1;
  } catch (error) {
    setTimeout(() => {
      location.reload(true);
    }, 1000);

    input.value = "";
    er.style.opacity = 1;
    er.textContent = "Incorrect adress (enter by type xxx.xxx.xxx.xxx)";
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
    const res = await fetch(`http://ip-api.com/json/${addres}`);
    const data = await res.json();
    x = data.lon;
    y = data.lat;
    console.log(data);
    initMap(x, y);
  } catch (error) {
    setTimeout(() => {
      location.reload(true);
    }, 1000);

    input.value = "";
    er.style.opacity = 1;
    er.textContent = "Incorrect adress ";
  }
}

button.addEventListener("click", () => {
  if (!map) {
    const value = input.value;
    fetchIpLocation(value);
  } else {
    destroyMap();
  }
});
