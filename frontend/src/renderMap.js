// PAGE ELEMENTS
const popup = document.querySelector(".popup-overlay");
const closeBtn = document.querySelector(".close-btn");
const sidebar = document.querySelector("sidebar-container");
const sidebarContent = document.querySelector(".sidebar-content");

async function loadPlaceInfo() {
  const res = await fetch('./places.json')
  return res.json()
}

// Click Handler
function getInfo(info) {
  clear()
  const Header = document.createElement("h3");
  Header.innerHTML = info.place;
  sidebarContent.appendChild(Header);

  if (info.leader != undefined) {
    const Leader = document.createElement("h4");
    Leader.innerHTML = info.leader;
    sidebarContent.appendChild(Leader);
  }

  const Content = document.createElement("p");
  Content.innerHTML = info.description;
  sidebarContent.appendChild(Content);
}

// Clears sidebar
function clear() {
  sidebarContent.innerHTML = "";
}

// Event listeners
closeBtn.addEventListener("click", () => {
  clear();
  const placeholder = document.createElement("p");
  placeholder.innerHTML =
    "<em>Click a place on the map to begin exploring Morthia!</em>";
  placeholder.classList.add("placeholder");
  sidebarContent.appendChild(placeholder);
});

// leaflet
async function renderMap(imgPath, mapHeight, mapWidth) {
  //const placesInfo = await loadPlaceInfo()

  var map = L.map("map", {
    crs: L.CRS.Simple,
    minZoom: -5,
    maxZoom: 0.5,
    zoomSnap: 0.5,
    attributionControl: false,
  });

  var bounds = [
    [0, 0],
    [mapHeight, mapWidth],
  ];
  var image = ('../../backend/images/Morthia-Web-Official.jpg').addTo(map);
  map.fitBounds(bounds);
  //image.getElement().style.border = "4px double white";
  image.getElement().style.boxSizing = "border-box";

  /*
    for (const placeInfo of Object.values(placesInfo)) {
      // draw rect from coords
      if (placeInfo.coords) {
        L.rectangle(placeInfo.coords, { color: 'transparent' })
          .on('click', () => getInfo(placeInfo))
          .on('hover', () => console.log('hover'))
          .addTo(map)
      }
    } */

}

