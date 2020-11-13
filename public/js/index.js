let map;
let infoWindow;
var directionsService;
var directionsRenderer;
const mapContainer = document.getElementById("map");

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
infoTab.innerHTML = `<h3>More Info</h3><div class="info"></div>`;

const directionsPanel = document.createElement("div");
directionsPanel.className = "directionsPanel";
directionsPanel.innerHTML = ` 
            <h3>Directions</h3>
            <span class="closeBtn closeDirPanel">&times;</span>
            `;

const commD = [
  "bank",
  "hospital",
  "police",
  "school",
  "university",
  "bar",
  "petrolStation",
  "grocery",
  "kiosk",
  "pharmacy",
  "restaraunt",
  "saloon",
  "supermarket",
];

function initMap() {
  // set the zoom, scale, street view and full screen controls
  // also create a custom map style
  const mapOptions = {
    zoom: 12,
    center: { lat: -1.28333, lng: 36.816667 },
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
  fetchMobileUploads();
  fetchData();

  // initialize directions service
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
}

async function fetchData() {
  let response = await fetch("/api/billboards/");
  if (response.ok) {
    data = await response.json();
    addOverlays(data);
  } else {
    alert(
      "Something went wrong while fetching data. Error: " + response.status
    );
  }
}

async function fetchMobileUploads() {
  // we need to make a request for mobile uploads within
  // the past one week from today(2 dates)
  const today = new Date();
  let lastHr = today.getHours() - 1 + ":00:00";
  let thisHr = today.getHours() + ":00:00";

  var todayDate = new Date().toISOString().slice(0,10);
  var yesDate = today.setDate(today.getDate() - 1);
  const yesterDate = new Date(yesDate).toISOString().slice(0,10);

  // const yester = today.setDate(today.getDate() - 1);
  // const yesterDate = new Date(yester).toLocaleDateString('en-US').split('/').join('-')
  const todaysDate = new Date().toLocaleDateString('en-US').split("/").join("-");
  
  const url = `https://bi.predictiveanalytics.co.ke/api/all-deliveries?start=${yesterDate}&end=${todayDate}`;

  const newUrl = `https://bi.predictiveanalytics.co.ke/api/all-deliveries?start=${yesterDate}&end=${todaysDate}`;
  console.log(url);
  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "X-Requested-With",
    },
  });
  if (response.ok) {
    mobileData = await response.json();
    getmobileMarkers(mobileData.data);

  } else {
    alert(
      "Something went wrong while fetching Mobile Uploads. Error: " +
      response.status
    );
  }
}

function addOverlays(data) {
  addBillboards(data.billboard);
  addAtm(data.atm);
  addTrafficLayer();
  nairobiSublWMS();
  addNairobiUberSpeeds();
  addugPopProj();
  addGhanaPopulation();
  for (const [key, value] of Object.entries(data)) {
    if (commD.includes(key)) {
      add(key, value);
    }
  }
  setTimeout(loader, 100);
  addAromakare();
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
      "http://play.predictiveanalytics.co.ke:8080/geoserver/Predictive/wms?" +
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

function nairobiSublWMS() {
  const wmsLayer = "Predictive:nairobisublocations";
  const key = () => {
    info = infoTab.querySelector(".info");
    info.innerHTML = `
        <div class="sublocLegend">
            <div>Census Population 2019</div>
            <div><span class="subColor" style="background-color:#fcfbfd;"></span>743 - 6783</div>
            <div><span class="subColor" style="background-color:#f1eff7;"></span>6783 - 9882</div>
            <div><span class="subColor" style="background-color:#e0e0ee;"></span>9882 - 13901</div>
            <div><span class="subColor" style="background-color:#c9cae3;"></span>13901 - 19082</div>
            <div><span class="subColor" style="background-color:#b0afd4;"></span>19082 - 23712</div>
            <div><span class="subColor" style="background-color:#9692c4;"></span>23712 - 28932</div>
            <div><span class="subColor" style="background-color:#7c76b6;"></span>28932 - 31603</div>
            <div><span class="subColor" style="background-color:#66499f;"></span>31603 - 40523</div>
            <div><span class="subColor" style="background-color:#552a91;"></span>40523 - 60613</div>
            <div><span class="subColor" style="background-color:#3f007d;"></span>60613 - 88039</div>
        </div>
        `;
  };
  const nrbtile = getTiles(wmsLayer);

  const nairobisublocations = new google.maps.ImageMapType({
    getTileUrl: nrbtile,
    minZoom: 0,
    maxZoom: 19,
    opacity: 1.0,
    alt: "Nairobi County Sublocations Population 2019",
    name: "nrbtile",
    isPng: true,
    tileSize: new google.maps.Size(256, 256),
  });

  div = document.createElement("div");
  div.innerHTML = `Nairobi Sublocations<input id="sublCheck" type="checkbox" />`;
  mapLayersAccordion.appendChild(div);
  legend.addEventListener("change", (e) => {
    if (e.target.matches("#sublCheck")) {
      cb = document.getElementById("sublCheck");
      // if on
      if (cb.checked) {
        map.overlayMapTypes.setAt(0, nairobisublocations);
        key();
      }
      if (!cb.checked) {
        // if off
        map.overlayMapTypes.removeAt(0);
        infoTab.querySelector(".info").innerHTML = "";
      }
    }
  });
}

function addNairobiUberSpeeds() {
  const wmsLayer = "	Predictive:nairobi roads travel speeds February";
  const key = () => {
    info = infoTab.querySelector(".info");
    info.innerHTML = `
        <div class="sublocLegend">
            <div>February 2020 Speeds in Kph</div>
            <div><span class="rdspeed" style="background-color:#9e0142;"></span>2 - 11.8</div>
            <div><span class="rdspeed" style="background-color:#d53e4f;"></span>11.8 - 21.6</div>
            <div><span class="rdspeed" style="background-color:#f46d43;"></span>21.6 - 31.4</div>
            <div><span class="rdspeed" style="background-color:#fdae61;"></span>31.4 - 41.2</div>
            <div><span class="rdspeed" style="background-color:#fee08b;"></span>41.2 - 51</div>
            <div><span class="rdspeed" style="background-color:#e6f598;"></span>51 - 60.8</div>
            <div><span class="rdspeed" style="background-color:#abdda4;"></span>60.8 - 70.6</div>
            <div><span class="rdspeed" style="background-color:#66c2a5;"></span>70.6 - 80.4</div>
            <div><span class="rdspeed" style="background-color:#3288bd;"></span>80.4 - 90.2</div>
            <div><span class="rdspeed" style="background-color:#5e4fa2;"></span>90.2 - 100</div>
        </div>
        `;
  };
  const uberspeedstile = getTiles(wmsLayer);

  const uberspeeds = new google.maps.ImageMapType({
    getTileUrl: uberspeedstile,
    minZoom: 0,
    maxZoom: 19,
    opacity: 1.0,
    alt: "Nairobi roads travel speeds February",
    name: "uberspeedstile",
    isPng: true,
    tileSize: new google.maps.Size(256, 256),
  });

  div = document.createElement("div");
  div.innerHTML = `Nairobi Travel Speeds<input id="uberCheck" type="checkbox" />`;
  mapLayersAccordion.appendChild(div);
  legend.addEventListener("change", (e) => {
    if (e.target.matches("#uberCheck")) {
      cb = document.getElementById("uberCheck");
      // if on
      if (cb.checked) {
        map.overlayMapTypes.setAt(3, uberspeeds);
        key();
      }
      if (!cb.checked) {
        // if off
        map.overlayMapTypes.removeAt(3);
        infoTab.querySelector(".info").innerHTML = "";
      }
    }
  });
}

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
function addAromakare() {
  data = [
    { 'latitude': -0.098448, 'longitude': 34.752505, 'name': 'Ngegeways enterprises' },
    { 'latitude': -1.146621, 'longitude': 36.960354, 'name': 'Visha Beauty' },
    { 'latitude': 1.259872, 'longitude': 35.098961, 'name': 'Jirreh Beauty & Cosmetics' },
    { 'latitude': -1.035376, 'longitude': 37.076715, 'name': 'Boston Cosmetics' },
    { 'latitude': -0.285305, 'longitude': 36.073529, 'name': 'East Africa cosmetics' },
    { 'latitude': -0.975436, 'longitude': 37.604000, 'name': 'Suzzy starlight salon' },
    { 'latitude': -3.214486, 'longitude': 40.115525, 'name': 'Kyasuleni cosmetics' },
    { 'latitude': -0.423632, 'longitude': 36.953541, 'name': 'Sawa Sawa Cosmetics' },
    { 'latitude': 0.559708, 'longitude': 34.560841, 'name': 'Bungles Beauty' },
    { 'latitude': -1.429003, 'longitude': 36.685849, 'name': 'Sunshine Beauty' },
    { 'latitude': -3.393657, 'longitude': 37.673599, 'name': 'Joy Beauty Shop' },
    { 'latitude': -1.280645, 'longitude': 36.963532, 'name': 'Masccarah Cosmetics' },
    { 'latitude': -1.289929, 'longitude': 36.744615, 'name': 'Ideala Enterprises' },
    { 'latitude': 0.515176, 'longitude': 35.273740, 'name': 'H.M Eldo Varieties' },
    { 'latitude': 0.335238, 'longitude': 34.488517, 'name': 'Mumias Beauty Centre' },
    { 'latitude': -1.780010, 'longitude': 37.627130, 'name': 'Patkam Enterprises' },
    { 'latitude': -0.934136, 'longitude': 38.058724, 'name': 'Royal Beauty and cosmetics' },
    { 'latitude': -1.282149, 'longitude': 36.825728, 'name': 'Maxim Beauty' },
    { 'latitude': -1.147569, 'longitude': 37.547374, 'name': 'Grajos cosmetics' },
    { 'latitude': -0.098859, 'longitude': 34.752063, 'name': 'GrammarJohn investments' },
    { 'latitude': -1.264439, 'longitude': 36.907984, 'name': 'Asha & Arya Beauty Centre ' },
    { 'latitude': -0.538191, 'longitude': 37.453862, 'name': 'Besco cosmetics' },
    { 'latitude': -0.720135, 'longitude': 37.159467, 'name': 'Starbell Beauty Shop' },
    { 'latitude': 0.518929, 'longitude': 35.271494, 'name': 'Hasmuk Dohia & Sons' },
    { 'latitude': 0.045558, 'longitude': 37.653659, 'name': 'Milan R Shah ' },
    { 'latitude': -4.058182, 'longitude': 39.673990, 'name': 'Super Cosmetics ' },
    { 'latitude': -1.407833, 'longitude': 37.689556, 'name': 'Master beauty shop' },
    { 'latitude': -0.934173, 'longitude': 38.058565, 'name': 'Calypso cosmetics' },
    { 'latitude': -0.285944, 'longitude': 36.074277, 'name': 'Elegant Cosmetics' }
  ]

  const bounds = new google.maps.LatLngBounds();

  const markers = data.map((el) => {
    
    let latlng = new google.maps.LatLng(el.latitude, el.longitude);
    bounds.extend(latlng);
    let contentString =
      "<p>Name: <strong>" +
      el.name +
      "<strong></p>" +
      '<button class="btn end" data-lat=' +
      el.latitude +
      " data-long=" +
      el.longitude +
      " >Go Here</button>" +
      '<button class="btn stop" data-lat=' +
      el.latitude +
      " data-long=" +
      el.longitude +
      " >Add Stop</button>" +
      '<button class="btn start" data-lat=' +
      el.latitude +
      " data-long=" +
      el.longitude +
      " >Start Here</button>";
    let marker = new google.maps.Marker({
      position: latlng,
      icon: { url: `images/newBusiness1.png`, scaledSize: new google.maps.Size(20, 20) },
      optimized: false,
    });
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

  const markerCluster = new MarkerClusterer(map, [], { imagePath: "images/m" });
  div = document.createElement("div");
  div.innerHTML = `<img src='images/newBusiness1.png' alt="aroma" />Aromakare<input id="aromaCheck" type="checkbox">`;
  poiLayersAccordion.appendChild(div);
  legend.addEventListener("change", (e) => {
    if (e.target.matches("#aromaCheck")) {
      cb = document.getElementById("aromaCheck");
      // if on
      if (cb.checked) {
        markerCluster.addMarkers(markers);
        map.fitBounds(bounds);
        map.panToBounds(bounds);
      }
      if (!cb.checked) {
        // if off
        markerCluster.removeMarkers(markers);
      }
    }
  });
}
function add(key, value) {
  const bounds = new google.maps.LatLngBounds();

  // create a markers array
  const markers = value.map((el) => {
    // the x and y of the marker
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
  const markerCluster = new MarkerClusterer(map, [], { imagePath: "images/m" });

  div = document.createElement("div");
  div.innerHTML = `<img src='${iconUrl}' alt="${key}"/> ${key}<input id="${key}Checked" type="checkbox" />`;
  poiLayersAccordion.appendChild(div);
  legend.addEventListener("change", (e) => {
    cb = document.getElementById(`${key}Checked`);
    // if on
    if (cb.checked) {
      markerCluster.addMarkers(markers);
      map.fitBounds(bounds);
      map.panToBounds(bounds);
    }
    if (!cb.checked) {
      // if off
      markerCluster.removeMarkers(markers);
    }
  });
}

function addBillboards(data) {
  const bounds = new google.maps.LatLngBounds();

  const markers = data.map((el) => {
    let latlng = new google.maps.LatLng(el.lat, el.long);
    bounds.extend(latlng);
    let contentString =
      '<div class ="infoWindow">' +
      "<div>" +
      "Name: <b>" +
      parseData(el.billboardi) +
      "</b></div>" +
      "<div>" +
      "Route: <b>" +
      parseData(el.routename) +
      "</b></div>" +
      "<div>" +
      "Size: <b>" +
      parseData(el.size) +
      "</b></div>" +
      "<div>" +
      "Visibility: <b>" +
      parseData(el.visibility) +
      "</b> </div>" +
      "<div>" +
      "Medium: <b>" +
      parseData(el.selectmedi) +
      "</b> </div>" +
      "<div>" +
      "Traffic: <b>" +
      parseData(el.traffic) +
      "</b> </div>" +
      "</div>" +
      '<img class="billboardImage" alt="billboard photo" src=' +
      el.photo +
      ">" +
      '<button class="btn end" data-lat=' +
      el.latitude +
      " data-long=" +
      el.longitude +
      " >Go Here</button>" +
      '<button class="btn stop" data-lat=' +
      el.latitude +
      " data-long=" +
      el.longitude +
      " >Add Stop</button>" +
      '<button class="btn start" data-lat=' +
      el.latitude +
      " data-long=" +
      el.longitude +
      " >Start Here</button>";

    let marker = new google.maps.Marker({
      position: latlng,
      icon: {
        url: `images/marker.png`,
        scaledSize: new google.maps.Size(20, 20),
      },
      optimized: false,
    });
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

  const markerCluster = new MarkerClusterer(map, markers, { imagePath: "images/m" });

  div = document.createElement("div");
  div.innerHTML = `<img src='images/marker.png' alt='billboard' /> Billboards <input id="billboardChecked" checked type="checkbox" />`;
  essentialLayers.appendChild(div);
  legend.addEventListener("change", (e) => {
    if (e.target.matches("#billboardChecked")) {
      cb = document.getElementById("billboardChecked");
      // if on
      if (cb.checked) {
        markerCluster.addMarkers(markers);
        map.fitBounds(bounds);
        map.panToBounds(bounds);
      }
      if (!cb.checked) {
        // if off
        markerCluster.removeMarkers(markers);
      }
    }
  });
}


function addAtm(data) {
  const bounds = new google.maps.LatLngBounds();
  const markers = data.map((el) => {
    latitude = el.geojson.coordinates[1];
    longitude = el.geojson.coordinates[0];
    let latlng = new google.maps.LatLng(latitude, longitude);
    bounds.extend(latlng);
    let contentString =
      "<p>Operator: <strong>" +
      el.operator +
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
      icon: { url: `images/atm.png`, scaledSize: new google.maps.Size(20, 20) },
      optimized: false,
    });
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

  const markerCluster = new MarkerClusterer(map, [], { imagePath: "images/m" });
  div = document.createElement("div");
  div.innerHTML = `<img src='images/atm.png' alt="atm" />ATM<input id="atmCheck" type="checkbox">`;
  poiLayersAccordion.appendChild(div);
  legend.addEventListener("change", (e) => {
    if (e.target.matches("#atmCheck")) {
      cb = document.getElementById("atmCheck");
      // if on
      if (cb.checked) {
        markerCluster.addMarkers(markers);
        map.fitBounds(bounds);
        map.panToBounds(bounds);
      }
      if (!cb.checked) {
        // if off
        markerCluster.removeMarkers(markers);
      }
    }
  });
}

function getmobileMarkers(deliveriesData) {
  mobileMarkersDates = new Object();
  const uploadDates = [];
  const markers = deliveriesData.map((el) => {
    let latlng = new google.maps.LatLng(el.latitude, el.longitude);
    let contentString =
      "Product Name: <b>" +
      parseData(el.product_name) +
      "</b><br/>" +
      "Delivered By: <b>" +
      parseData(el.delivered_by) +
      "</b> <br/>" +
      "Description: <b>" +
      parseData(el.product_description) +
      "</b> <br/>" +
      "Quantity: <b>" +
      parseData(el.quantity) +
      "</b> <br/>" +
      '<img class="billboardImage" alt="delivery photo" src=' +
      el.photo +
      "></img>";
    let marker = new google.maps.Marker({
      position: latlng,
      icon: {
        url: `images/place.png`,
        scaledSize: new google.maps.Size(20, 20),
      },
      optimized: false,
    });
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
    // add list of dates
    if (el.created_at) {
      let date = el.created_at.slice(0, 10);
      if (uploadDates.length == 0) {
        uploadDates.push(date);
      } else {
        if (uploadDates.includes(date) == false) {
          uploadDates.push(date);
        }
      }
    }
    return marker;
  });
  mobileMarkersDates.dates = uploadDates;
  const markerCluster = new MarkerClusterer(map, [], { imagePath: 'images/m' });
  div = document.createElement("div");
  div.innerHTML = `<img src='images/place.png'/>Mobile Uploads<input id="mobileCheck" type="checkbox">`;
  essentialLayers.appendChild(div);
  legend.addEventListener("change", (e) => {
    if (e.target.matches("#mobileCheck")) {
      cb = document.getElementById("mobileCheck");
      // if on
      if (cb.checked) {
        markerCluster.addMarkers(markers);
      }
      if (!cb.checked) {
        // if off
        markerCluster.removeMarkers(markers);
      }
    }
  });
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

function addGhanaPopulation() {
  const key = () => {
    info = infoTab.querySelector(".info");
    info.innerHTML = ` <div class="sublocLegend">
                <div> Ghana Districts Population </div> 
                <div><span class="subColor" style="background-color:#ffffcc;"></span>241 - 99580</div>
                <div><span class="subColor" style="background-color:#e4f4b6;"></span>99580 - 113844</div>
                <div><span class="subColor" style="background-color:#c9e99f;"></span>113844 - 128037</div>
                <div><span class="subColor" style="background-color:#a9dc8e;"></span>128037 - 142836</div>
                <div><span class="subColor" style="background-color:#88cd80;"></span>142836 - 158718</div>
                <div><span class="subColor" style="background-color:#68be71;"></span>158718 - 175951</div>
                <div><span class="subColor" style="background-color:#48af60;"></span>175951 - 199264</div>
                <div><span class="subColor" style="background-color:#2b9d51;"></span>199264 - 242204</div>
                <div><span class="subColor" style="background-color:#158244;"></span>242204 - 304658</div>
                <div><span class="subColor" style="background-color:#006837;"></span>304658 - 2578715</div>
            </div>
            `;
  };
  const ghtile = getTiles("Predictive:ghanapopulation");

  const ghanaDist = new google.maps.ImageMapType({
    getTileUrl: ghtile,
    minZoom: 0,
    maxZoom: 19,
    opacity: 1.0,
    alt: "Ghana Districts Population",
    name: "Ghana Districts",
    isPng: true,
    tileSize: new google.maps.Size(256, 256),
  });

  div = document.createElement("div");
  div.innerHTML = `Ghana Districts <input id="ghCheck" type = "checkbox" />`;
  mapLayersAccordion.appendChild(div);
  legend.addEventListener("change", (e) => {
    if (e.target.matches("#ghCheck")) {
      cb = document.getElementById("ghCheck");
      // if on
      if (cb.checked) {
        map.overlayMapTypes.setAt(2, ghanaDist);
        key();
      }
      if (!cb.checked) {
        // if off
        map.overlayMapTypes.removeAt(2);
        infoTab.querySelector(".info").innerHTML = "";
      }
    }
  });
}

function parseData(val) {
  if (val == null || val == undefined) {
    return "";
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
    // console.log(e);
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
