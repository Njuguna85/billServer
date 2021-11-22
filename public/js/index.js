let map;
let infoWindow;
var directionsService;
var directionsRenderer;
const mapContainer = document.getElementById("map");
var bounds,
  markerCluster,
  gmarkers = {};
const filters = [];
let billboardMarkers = [];
let overallScore = 0,
  totalBB = 0,
  totalScore = 17;
const billboardTable = document.getElementById("billboardTable");

let legend = document.createElement("div");
legend.setAttribute("id", "legend");
legend.innerHTML = `<h3>Map Legend</h3>`;

const essentialLayers = document.createElement("div");
essentialLayers.className = "essentialLayers";
legend.appendChild(essentialLayers);

const mapLayers = document.createElement("div");
mapLayers.innerHTML = '<h5 class="accordion">Map Layers</h5>';
mapLayers.className = "mapLayers";
legend.appendChild(mapLayers);

const mapLayersAccordion = document.createElement("div");
mapLayersAccordion.className = "accordion-content";
mapLayers.append(mapLayersAccordion);

const poiLayers = document.createElement("div");
poiLayers.innerHTML = '<h5 class="accordion">POIs</h5>';
poiLayers.className = "poiLayers";
legend.appendChild(poiLayers);

const poiLayersAccordion = document.createElement("div");
poiLayersAccordion.className = "accordion-content";
poiLayers.appendChild(poiLayersAccordion);

const infoTab = document.createElement("div");
infoTab.setAttribute("id", "infoTab");
infoTab.innerHTML = `<h3>More Info</h3>
        <div class="info"></div>
        <div class="billboardFilInfo"></div>
        <div class="billboardCatInfo"></div>`;

const directionsPanel = document.createElement("div");
directionsPanel.className = "directionsPanel";
directionsPanel.innerHTML = ` 
            <h3>Directions</h3>
            <span class="closeBtn closeDirPanel">&times;</span>
            `;

const commD = [
  "atm",
  "bank",
  "hospital",
  "police",
  "school",
  "university",
  "bar",
  "kiosk",
  "pharmacy",
  "restaurant",
  "supermarket",
];

function initMap() {
  const mapCentre = { lat: 1.282578, lng: 32.608635 };

  const mapOptions = {
    zoom: 8,
    center: mapCentre,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER,
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP,
    },
    scaleControl: true,
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP,
    },
    fullscreenControl: true,
    styles: [
      {
        featureType: "administrative",
        elementType: "labels.text.fill",
        stylers: [{ color: "#444444" }],
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [{ color: "#f2f2f2" }],
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "road",
        elementType: "all",
        stylers: [{ saturation: -100 }, { lightness: 45 }],
      },
      {
        featureType: "road.highway",
        elementType: "all",
        stylers: [{ visibility: "simplified" }],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [{ color: "#80DEEA" }, { visibility: "on" }],
      },
    ],
  };

  map = new google.maps.Map(mapContainer, mapOptions);
  infoWindow = new google.maps.InfoWindow();
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(infoTab);

  const content = `<div class="businessesSuggestion">
        <h4><bold>Welcome to the landing page. To activate layers:  </h4></bold>
        <p>Pan to the yellow pane on the right</p>
        <p>Click the plus sign (+) to expand</p>
        <p>Check the boxes to activate the layers to be viewed </p>
        </div>`;

  infoWindow.setContent(content);
  infoWindow.setPosition(mapCentre);
  infoWindow.open(map);

  markerCluster = new MarkerClusterer(map, [], { imagePath: "images/m" });

  fetchData();

  // initialize directions service
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  bounds = new google.maps.LatLngBounds();
}

async function fetchData() {
  let response = await fetch("/api/pois/datalytics");
  if (response.ok) {
    data = await response.json();
    addOverlays(data);
  } else {
    alert(
      "Something went wrong while fetching data. Error: " + response.status
    );
  }
}

function addOverlays(data) {
  addTrafficLayer();
  addugPopProj();
  addBillboards(data.billboards);

  for (const [key, value] of Object.entries(data.pois)) {
    if (commD.includes(key)) {
      add(key, value);
    }
  }
  setTimeout(loader, 100);
}

const getTiles = (lyr) => {
  const fullURl = (coord, zoom) => {
    // get map projection
    const proj = map.getProjection();
    const zfactor = Math.pow(2, zoom);
    const top = proj.fromPointToLatLng(
      new google.maps.Point(
        (coord.x * 256) / zfactor,
        (coord.y * 256) / zfactor
      )
    );
    const bot = proj.fromPointToLatLng(
      new google.maps.Point(
        ((coord.x + 1) * 256) / zfactor,
        ((coord.y + 1) * 256) / zfactor
      )
    );
    // corrections for the slight shift of the map server
    const deltaX = 0.0013;
    const deltaY = 0.00058;

    // create bounding box string
    const bbox =
      top.lng() +
      deltaX +
      "," +
      (bot.lat() + deltaY) +
      "," +
      (bot.lng() + deltaX) +
      "," +
      (top.lat() + deltaY);
    const url =
      "https://play.predictiveanalytics.co.ke/geoserver/Predictive/wms?" +
      "&service=WMS" +
      "&version=1.1.0" +
      "&request=GetMap" +
      `&layers=${lyr}` +
      `&bbox=${bbox}` +
      "&bgcolor=0xFFFFFF" +
      "&transparent=true" +
      "&width=256" +
      "&height=256" +
      "&srs=EPSG:4326" +
      "&format=image%2Fpng";
    return url;
  };
  return fullURl;
};

const latLonToXY = (lat, lon, zoom) => {
  // Convert to radians
  lat = (lat * Math.PI) / 180;
  lon = (lon * Math.PI) / 180;

  var circumference = 256 * Math.pow(2, zoom);
  var falseEasting = circumference / 2.0;
  var falseNorthing = circumference / 2.0;
  var radius = circumference / (2 * Math.PI);

  var point = {
    y: (radius / 2.0) * Math.log((1.0 + Math.sin(lat)) / (1.0 - Math.sin(lat))),
    x: radius * lon,
  };

  point.x = falseEasting + point.x;
  point.y = falseNorthing - point.y;

  return point;
};

const getTileCoordinates = (lat, lon, zoom) => {
  const point = latLonToXY(lat, lon, zoom);
  const tileXY = {
    x: Math.floor(point.x / 256),
    y: Math.floor(point.y / 256),
  };
  return tileXY;
};

const getTileBoundingBox = (map, tileCoords) => {
  const projection = map.getProjection();
  const zpow = Math.pow(2, map.getZoom());

  const ul = new google.maps.Point(
    (tileCoords.x * 256.0) / zpow,
    ((tileCoords.y + 1) * 256.0) / zpow
  );
  const lr = new google.maps.Point(
    ((tileCoords.x + 1) * 256.0) / zpow,
    (tileCoords.y * 256.0) / zpow
  );
  const ulw = projection.fromPointToLatLng(ul);
  const lrw = projection.fromPointToLatLng(lr);
  // const bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();

  const bbox = {
    latMin: ulw.lat(),
    latMax: lrw.lat(),
    lonMin: ulw.lng(),
    lonMax: lrw.lng(),
  };

  return bbox;
};

const latLonToTileXYOffset = (lat, lon, zoom) => {
  point = latLonToXY(lat, lon, zoom);

  const tileOffset = {
    x: point.x % 256,
    y: point.y % 256,
  };

  return tileOffset;
};

function addTrafficLayer() {
  const trafficLayer = new google.maps.TrafficLayer();

  div = document.createElement("div");
  div.innerHTML = `Traffic Layer <input id="trafficChecked" type="checkbox" />`;

  mapLayersAccordion.appendChild(div);
  legend.addEventListener("change", (e) => {
    if (e.target.matches("#trafficChecked")) {
      cb = document.getElementById(`trafficChecked`);
      // if on
      if (cb.checked) {
        trafficLayer.setMap(map);
      }
      if (!cb.checked) {
        // if off
        trafficLayer.setMap(null);
      }
    }
  });
}

function add(key, value) {
  // create a markers array
  const markers = value.map((el) => {
    // the x and y of the marker
    el.geojson = JSON.parse(el.geojson);
    latitude = el.geojson.coordinates[1];
    longitude = el.geojson.coordinates[0];
    let latlng = new google.maps.LatLng(latitude, longitude);
    bounds.extend(latlng);
    iconUrl = `./images/${key}.png`;
    let contentString =
      "<p><strong>" +
      el.name +
      "<strong></p>" +
      '<button class="btn end" data-lat=' +
      latitude +
      " data-long=" +
      longitude +
      " >Go Here</button>" +
      '<button class="btn stop" data-lat=' +
      latitude +
      " data-long=" +
      longitude +
      " >Add Stop</button>" +
      '<button class="btn start" data-lat=' +
      latitude +
      " data-long=" +
      longitude +
      " >Start Here</button>";
    let marker = new google.maps.Marker({
      position: latlng,
      icon: { url: iconUrl, scaledSize: new google.maps.Size(20, 20) },
      optimized: false,
    });
    // open a popup on click
    google.maps.event.addListener(
      marker,
      "click",
      ((marker, el) => {
        return () => {
          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);
        };
      })(marker, el)
    );
    return marker;
  });

  gmarkers[key] = markers;

  div = document.createElement("div");
  div.innerHTML = `<img src='${iconUrl}' alt="${key}"/> ${key}<input id="${key}Checked" data-id="${key}" class='poi' type="checkbox" />`;
  poiLayersAccordion.appendChild(div);
}

function parseBBProps(filterScoreProp, bbProp) {
  if (filterScores[filterScoreProp].hasOwnProperty(bbProp?.toLowerCase())) {
    return filterScores[filterScoreProp][bbProp.toLowerCase()].score;
  } else {
    return 0;
  }
}

function addBillboards(data) {
  const bounds = new google.maps.LatLngBounds();

  var spiderConfig = {
    keepSpiderfied: true,
    event: "mouseover",
  };
  var markerSpiderfier = new OverlappingMarkerSpiderfier(map, spiderConfig);

  const markers = data.map((el) => {
    totalBB++;
    const iconUrl = `images/billboardColored.png`;
    let score;

    const { site_lighting_illumination, clutter, height, orientation } =
      parseBbPropNull(el);
    const site_run_up = getNum(el.site_run_up);

    score =
      parseBBProps("site_lighting_illumination", site_lighting_illumination) +
      parseBBProps("height", height) +
      parseBBProps("clutter", clutter) +
      parseBBProps("site_run_up", site_run_up) +
      parseBBProps("orientation", orientation);

    el["score"] = score;

    data = {
      site_lighting_illumination,
      height,
      orientation,
      clutter,
      site_run_up,
    };

    let latlng = new google.maps.LatLng(el.latitude, el.longitude);
    bounds.extend(latlng);
    const contentString = addContentString(el);

    let marker = new google.maps.Marker({
      position: latlng,
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(30, 30),
      },
      optimized: false,
      data,
    });

    google.maps.event.addListener(
      marker,
      "click",
      ((marker, el) => {
        return async () => {
          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);

          const popData = await getPopData(el.longitude, el.latitude);
          addPop(popData[0]);

          const { total } = popData[0];
          oppContact(score, total);
        };
      })(marker, el)
    );

    // Adds the Marker to OverlappingMarkerSpiderfier
    markerSpiderfier.addMarker(marker);
    return marker;
  });

  markerSpiderfier.addListener("click", function (marker, e) {
    infoWindow.open(map, marker);
  });

  markerSpiderfier.addListener("spiderfy", function (markers) {
    infoWindow.close();
  });

  billboardMarkers = new MarkerClusterer(map, markers, {
    imagePath: "images/m",
  });

  billboardMarkers.setMaxZoom(15);

  billboardTable.style.display = "block";
  drawBBLegend();

  div = document.createElement("div");
  div.innerHTML = `<img src='images/marker.png' alt='billboard' /> Billboards <input id="billboardChecked" checked type="checkbox" />`;
  essentialLayers.appendChild(div);
  legend.addEventListener("change", (e) => {
    if (e.target.matches("#billboardChecked")) {
      cb = document.getElementById("billboardChecked");
      // if on
      if (cb.checked) {
        billboardMarkers.addMarkers(markers);
        map.fitBounds(bounds);
        map.panToBounds(bounds);

        billboardTable.style.display = "block";
      }
      if (!cb.checked) {
        // if off
        billboardMarkers.removeMarkers(markers);

        billboardTable.style.display = "none";
        drawBBLegend();
      }
    }
  });
}

function getNum(str) {
  return str.replace(/[^0-9]/g, "");
}

function parseBbPropNull(el) {
  let address = el && parseData(el.address);
  let medium = el && el.medium && parseData(el.medium["characteristic_value"]);
  let site_lighting_illumination =
    el && el.lighting && parseData(el.lighting["characteristic_value"]);
  let direction =
    el && el.direction && parseData(el.direction["characteristic_value"]);
  let faces = el && el.faces && parseData(el.faces["characteristic_value"]);
  let clutter =
    el && el.clutter && parseData(el.clutter["characteristic_value"]);
  let size = el && el.size && parseData(el.size["characteristic_value"]);
  let orientation =
    el && el.orientation && parseData(el.orientation["characteristic_value"]);
  let height = el && el.height && parseData(el.height["characteristic_value"]);
  let side_of_road =
    el && el.side_of_road && parseData(el.side_of_road["characteristic_value"]);
  let score = el.score;
  let latitude = el && parseData(el.latitude);
  let longitude = el && parseData(el.longitude);
  let site_run_up = el && parseData(el.site_run_up);

  return {
    address,
    medium,
    site_lighting_illumination,
    direction,
    faces,
    clutter,
    size,
    orientation,
    height,
    side_of_road,
    latitude,
    longitude,
    score,
    site_run_up,
  };
}

function addContentString(el) {
  const {
    address,
    medium,
    site_lighting_illumination,
    direction,
    faces,
    clutter,
    size,
    orientation,
    height,
    side_of_road,
    latitude,
    longitude,
    score,
    site_run_up,
  } = parseBbPropNull(el);

  const addBbImages = () => {
    let imgString = "";

    for (const img of el.images) {
      imgString += `<img class="billboardImage" alt="billboard photo" src='${img.path}'>`;
    }

    return imgString;
  };

  let html = `
      <div class ="infoWindow">
        <div>Address: <b>${address}</b></div>
        <div>Medium Type: <b>${medium}</b></div>
        <div>Lighting: <b>${site_lighting_illumination}</b></div>
        <div>Direction: <b>${direction}</b></div>
        <div>Faces: <b>${faces}</b></div>
        <div>Clutter: <b>${clutter}</b></div>
        <div>Size: <b>${size}</b></div>
        <div>Orientation: <b>${orientation}</b></div>
        <div>Height: <b>${height}</b></div>
        <div>Site Run Up: <b>${site_run_up}</b></div>
        <div>Road Side: <b>${parseData(side_of_road)}</b></div>
        <div>Visibility Adjustment: <b>${vAdj(score)}</b></div>
        <div id='bbImages'>
          ${addBbImages()}
        </div>
        <button class="btn end" data-lat='${latitude}' data-long='${longitude}'>Go Here</button>
        <button class="btn stop" data-lat='${latitude}' data-long='${longitude}'>Add Stop</button>
        <button class="btn start" data-lat='${latitude}' data-long='${longitude}'>Start Here</button>
        <br/>
        <div id='chart'></div>
      </div>
    `;

  return html;
}

function addugPopProj() {
  const key = () => {
    info = infoTab.querySelector(".info");
    info.innerHTML = `
        <div class="sublocLegend">
            <div>SubCounty Population Projection 2020</div>
            <div><span class="subColor" style="background-color:#f7fbff;"></span>1600 - 9200</div>
            <div><span class="subColor" style="background-color:#e2eef9;"></span>9200 - 12600</div>
            <div><span class="subColor" style="background-color:#cde0f2;"></span>12600 - 15530</div>
            <div><span class="subColor" style="background-color:#b0d2e8;"></span>15530 - 18640</div>
            <div><span class="subColor" style="background-color:#89bfdd;"></span>18640 - 21900</div>
            <div><span class="subColor" style="background-color:#60a6d2;"></span>21900 - 25200</div>
            <div><span class="subColor" style="background-color:#3e8ec4;"></span>25200 - 30400</div>
            <div><span class="subColor" style="background-color:#2172b6;"></span>30400 - 36400</div>
            <div><span class="subColor" style="background-color:#0a549e;"></span>36400 - 47880</div>
            <div><span class="subColor" style="background-color:#08306b;"></span>47880 - 445900</div>
        </div>`;
  };

  const ugtile = getTiles("Predictive:ugsubcountiesprojection");

  const ugPopProj = new google.maps.ImageMapType({
    getTileUrl: ugtile,
    minZoom: 0,
    maxZoom: 19,
    opacity: 1.0,
    alt: "Uganda Population Projection 2020",
    name: "ugPopProj",
    isPng: true,
    tileSize: new google.maps.Size(256, 256),
  });

  div = document.createElement("div");
  div.innerHTML = `Uganda Population Projection 2020 <input id="ugPopProjCheck" type="checkbox" />`;
  mapLayersAccordion.appendChild(div);

  legend.addEventListener("change", (e) => {
    if (e.target.matches("#ugPopProjCheck")) {
      cb = document.getElementById("ugPopProjCheck");
      // if on
      if (cb.checked) {
        map.overlayMapTypes.setAt(1, ugPopProj);
        key();
      }
      if (!cb.checked) {
        // if off
        map.overlayMapTypes.removeAt(1);
        //
        infoTab.querySelector(".info").innerHTML = "";
      }
    }
  });
}

function parseData(val) {
  if (val === null || val === undefined) {
    return "Not captured";
  }
  return val;
}

function parseValues(val) {
  if (val == null || val == undefined) {
    return "";
  }
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//
// create routes
const tracker = new Object();
const stopPoints = [];

mapContainer.addEventListener("click", (e) => {
  if (e.target.matches(".start")) {
    const lat = parseFloat(e.target.closest(".start").dataset.lat);
    const long = parseFloat(e.target.closest(".start").dataset.long);
    const LatLng = new google.maps.LatLng(lat, long);
    tracker.start = LatLng;
    calcRoute(tracker);
  }
  if (e.target.matches(".end")) {
    const lat = parseFloat(e.target.closest(".end").dataset.lat);
    const long = parseFloat(e.target.closest(".end").dataset.long);
    const LatLng = new google.maps.LatLng(lat, long);
    tracker.end = LatLng;
    calcRoute(tracker);
  }
  if (e.target.matches(".stop")) {
    const lat = parseFloat(e.target.closest(".stop").dataset.lat);
    const long = parseFloat(e.target.closest(".stop").dataset.long);
    const LatLng = new google.maps.LatLng(lat, long);
    stopPoints.push({ location: LatLng, stopover: true });
    tracker.stop = stopPoints;
    calcRoute(tracker);
  }
  if (e.target.matches(".accordion")) {
    e.target.classList.toggle("is-open");
    const content = e.target.nextElementSibling;
    if (content.style.maxHeight) {
      // accordion is currently open, so close it
      content.style.maxHeight = null;
    } else {
      // accordion is currently cloed so open it
      content.style.maxHeight = content.scrollHeight + "px";
    }
  }
  if (e.target.matches(".closeDirPanel")) {
    directionsRenderer.setMap(null);
    directionsRenderer = null;
    directionsPanel.parentElement.removeChild(directionsPanel);
  }
});

poiLayersAccordion.addEventListener("change", (e) => {
  if (e.target.matches(".poi")) {
    targetPoi = e.target.dataset.id;
    cb = document.getElementById(`${targetPoi}Checked`);
    if (cb.checked) {
      markerCluster.addMarkers(gmarkers[targetPoi]);
      map.fitBounds(bounds);
      map.panToBounds(bounds);
    }
    if (!cb.checked) {
      markerCluster.removeMarkers(gmarkers[targetPoi]);
    }
  }
});

billboardTable.addEventListener("click", (e) => {
  if (e.target.matches(".category")) {
    // get the id/name of category
    const category = e.target.value;
    categorizeBB(category);
  }

  if (e.target.matches(".filter_selector")) {
    const value = e.target.value.trim();
    if (value == "") {
      accumulateFilters(e.target.name.toLowerCase(), "", true);
    } else {
      accumulateFilters(e.target.name.toLowerCase(), value.toLowerCase());
    }
  }
});

function calcRoute(tracker) {
  div = document.createElement("div");
  let start, end, waypts;
  if (tracker.start) {
    start = tracker.start;
  }
  if (tracker.end) {
    end = tracker.end;
  }
  if (tracker.stop) {
    if (tracker.stop.length > 8) {
      window.alert("Please Minimize the stop points to 8");
    }
    waypts = tracker.stop;
  }
  if (start != undefined && end != undefined) {
    const request = {
      origin: start,
      destination: end,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: "DRIVING",
    };
    directionsService.route(request, function (response, status) {
      if (status == "OK") {
        directionsRenderer.setDirections(response);
        directionsRenderer.setPanel(div);
        directionsPanel.appendChild(div);
        map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
          directionsPanel
        );
      } else {
        window.alert("Directions request failed due to " + status);
      }
    });
  }
}

function loader() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("billboardDetails").style.display = "block";
}

function accumulateFilters(name, value, remove = false) {
  const index = filters.findIndex((f) => f.name === name);
  drawFilterIcon();
  const scoreBoard = infoTab.querySelector("#score");

  // remove a filter
  if (remove) {
    // user wants to remove a whole filter category
    // thus get the category from the accumulated filters
    // and also get the score of the value previously added
    // then remove it from the overall score
    if (filters.length > 0) {
      const prevFilterVal = filters[index]["value"];
      let prevScore;
      if (name === "site_run_up") {
        prevScore = filterScores[name](prevFilterVal)["score"];
        overallScore -= prevScore;
        scoreBoard.innerHTML = vAdj(overallScore);
      } else {
        prevScore = filterScores[name][prevFilterVal].score;
        overallScore -= prevScore;
        scoreBoard.innerHTML = vAdj(overallScore);
      }
    }

    filters.splice(index, 1);
    applyFilters();
    updateFilterHtml();
    return;
  }

  // add a filter
  // if name was not found in filters, push.
  if (index < 0) {
    let score;
    // exception for site_run_up
    if (name === "site_run_up") {
      value = value.split("_")[0];

      score = filterScores[name](value)["score"];
      overallScore += score;
      scoreBoard.innerHTML = vAdj(overallScore);
    } else {
      score = filterScores[name][value].score;
      overallScore += score;
      scoreBoard.innerHTML = vAdj(overallScore);
    }

    filters.push({ name: name, value: value });
    applyFilters();
    updateFilterHtml();
    return;
  }

  // update a filter
  // if name was found, update with new value
  let prevScore;
  if (name === "site_run_up") {
    prevScore = filterScores[name](filters[index].value)["score"];
  } else {
    prevScore = filterScores[name][filters[index].value].score;
  }
  overallScore -= prevScore;

  let newScore;
  if (name === "site_run_up") {
    value = value.split("_")[0];
    newScore = filterScores[name](value)["score"];

    overallScore += newScore;
    scoreBoard.innerHTML = vAdj(overallScore);
  } else {
    newScore = filterScores[name][value].score;
    overallScore += newScore;
    scoreBoard.innerHTML = vAdj(overallScore);
  }
  filters[index].value = value;
  applyFilters();
  updateFilterHtml();
}

function vAdj(score) {
  const per = Math.round((100 * score) / totalScore);
  return `${per}%`;
}

function oppContact(score, totalPop) {
  // need the visibility adjustment  and the population of that area.
  // insert before images div
  const oppCont = (score / totalScore) * totalPop;
  const html = `<div>Opportunity Contact: <b>${Math.round(oppCont)}</b></div>`;
  document.querySelector("#bbImages").insertAdjacentHTML("beforebegin", html);
}

// apply all filters in the filters array
const applyFilters = () => {
  let counter = 0;
  // for each billboard check if it meets the filters
  billboardMarkers.getMarkers().forEach((bm) => {
    const viable = filters.reduce((acc, { name, value }) => {
      if (name === "site_run_up") {
        return acc && siteRunUpBool(value, bm.data[`${name}`]);
      } else {
        return acc && bm.data[`${name}`]?.toLowerCase() === value;
      }
    }, true);

    const greyedIcon = {
      url: `./images/billboardGreyed2.png`,
      scaledSize: new google.maps.Size(30, 30),
    };

    const coloredIcon = {
      url: `./images/billboardColored.png`,
      scaledSize: new google.maps.Size(30, 30),
    };

    if (viable) {
      counter++;
      bm.setIcon(coloredIcon);
      bm.setAnimation(google.maps.Animation.BOUNCE);
      stopAnimation(bm);
      return;
    }
    bm.setIcon(greyedIcon);
  });
  infoTab.querySelector("#bbCount").innerHTML = counter;
};

function siteRunUpBool(prefLength, bmLength) {
  return +bmLength >= prefLength && bmLength <= +prefLength + 49;
}

function stopAnimation(marker) {
  setTimeout(function () {
    marker.setAnimation(null);
  }, 3000);
}

const filterScores = {
  site_lighting_illumination: {
    backlit: { score: 3, icon: "bbBacklit1" },
    frontlit: { score: 2, icon: "bbFrontlit1" },
    unlit: { score: 1, icon: "bbNolit" },
  },
  height: {
    "eye level": { score: 3, icon: "bbDgreen" },
    moderate: { score: 2, icon: "bbAmber" },
    "too high": { score: 1, icon: "bbRed" },
  },
  clutter: {
    solus: { score: 3, icon: "bbBlue" },
    average: { score: 2, icon: "bbNolit" },
    cluttered: { score: 1, icon: "billboardGreyed1" },
  },
  site_run_up: function (length) {
    length = parseInt(length);
    if (length >= 0 && length <= 50) {
      return { score: 1, icon: "bbNolit" };
    }
    if (length >= 51 && length <= 100) {
      return { score: 2, icon: "bbRed" };
    }
    if (length >= 101 && length <= 150) {
      return { score: 3, icon: "bbAmber" };
    }
    if (length >= 151 && length <= 200) {
      return { score: 4, icon: "bbDgreen" };
    }
    if (length > 200) {
      return { score: 5, icon: "bbBlue" };
    }
  },
  orientation: {
    landscape: { score: 3, icon: "bbDgreen" },
    portrait: { score: 2, icon: "bbAmber" },
    square: { score: 1, icon: "bbRed" },
  },
};

function categorizeBB(category) {
  const defaultIcon = {
    url: `./images/billboardColored.png`,
    scaledSize: new google.maps.Size(30, 30),
  };

  billboardMarkers.getMarkers().forEach((bm) => {
    for (let [billboardProp, value] of Object.entries(bm.data)) {
      if (billboardProp.toLowerCase() === category.toLowerCase()) {
        if (
          value == null ||
          value == "null" ||
          value == undefined ||
          value == "undefined"
        ) {
          return bm.setIcon(defaultIcon);
        }

        // exception for site_run_up
        if (category === "site_run_up") {
          if (filterScores[category](value)) {
            const { icon } = filterScores[category](value);

            const newIcon = {
              url: `./images/${icon}.png`,
              scaledSize: new google.maps.Size(30, 30),
            };

            bm.setIcon(newIcon);
            bm.setAnimation(google.maps.Animation.BOUNCE);
            stopAnimation(bm);
            return;
          }
        }

        if (filterScores[category].hasOwnProperty(value.toLowerCase())) {
          const newIcon = {
            url: `./images/${
              filterScores[category][value.toLowerCase()]["icon"]
            }.png`,
            scaledSize: new google.maps.Size(30, 30),
          };

          bm.setIcon(newIcon);
          bm.setAnimation(google.maps.Animation.BOUNCE);
          stopAnimation(bm);
        } else {
          bm.setIcon(defaultIcon);
        }
      }
    }
  });
  drawCatIcons(category);
}

function drawCatIcons(category) {
  if (category === "site_run_up") {
    const distances = {
      "0-50m": 25,
      "51-100m": 75,
      "101-150m": 125,
      "151-200m": 175,
      "200+": 225,
    };

    let html = "";
    for (const [range, dist] of Object.entries(distances)) {
      const { icon } = filterScores[category](dist);
      html += `<div> 
          <h4> ${range} </h4> 
          <img class="billboardCatInfo-img" src="./images/${icon}.png"> 
        </div>`;
    }

    infoTab.querySelector(
      ".billboardCatInfo"
    ).innerHTML = `<h4 class="info-header">Categories Key</h4>
          ${html}
          <div>
            <h4> Value Not Found </h4> <img class="billboardCatInfo-img" src="./images/billboardColored.png">
        </div>`;
  } else {
    let html = "";
    for (const [k, v] of Object.entries(filterScores[category])) {
      html += `<div> <h4> ${capitalize(
        k
      )} </h4> <img class="billboardCatInfo-img" src="./images/${
        v.icon
      }.png"> </div>`;
    }

    infoTab.querySelector(
      ".billboardCatInfo"
    ).innerHTML = `<h4 class="info-header">Categories Key</h4>
    ${html}
    <div>
      <h4> Value Not Found </h4> <img class="billboardCatInfo-img" src="./images/billboardColored.png">
    </div>`;
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function drawBBLegend() {
  const html = `
      <h4 class="info-header">Filter Key</h4>
      <div><h4>Visibility Adjustment:</h4><span id="score">0</span> </div>
      <hr class="hr">
      <div><span id="bbCount">${totalBB}</span> Billboards</div>
      <hr class="hr">
      <div style="text-align:centre;"> Filters </div>
      <div id="filters"></div>
      <hr class="hr">
      <div id="filterIcons"> </div>`;

  infoTab.querySelector(".billboardFilInfo").innerHTML = html;
}

function updateFilterHtml() {
  // filters :[...filter]
  // filter: {name: value}
  let html = "";
  filters.forEach(({ name, value }) => {
    html += `<div>${capitalize(name)} --- ${capitalize(value)}</div>`;
  });
  infoTab.querySelector("#filters").innerHTML = html;
}

function drawFilterIcon() {
  infoTab.querySelector("#filterIcons").innerHTML = `
    <div>
      Meets Criteria:
      <img class="billboardCatInfo-img" src="./images/billboardColored.png">
    </div>
    <div>
      Does not meet Criteria
      <img class="billboardCatInfo-img" src="./images/billboardGreyed2.png">
    </div>
`;
}

async function getPopData(long, lat) {
  let response;

  response = await fetch(`/api/pois/pop/${long}/${lat}`);

  if (response.ok) {
    return (popData = await response.json());
  }
}

function addPop(popData) {
  const imgCont = document.querySelector("#bbImages");
  if (popData) {
    const popString = `
    <div>Sub County: <b>${popData.subcounty}</b></div>
    <div>District: <b>${popData.district}</b></div>
    <div>Male Population: <b>${popData.male}</b></div>
    <div>Female Population: <b>${popData.female}</b></div>
    <div>Total Population: <b>${popData.total}</b></div>`;

    imgCont.insertAdjacentHTML("beforebegin", popString);
  } else {
    imgCont.insertAdjacentHTML(
      "beforebegin",
      `<div>No Population Estimates available at the moment</div>`
    );
  }
}
