let map;
let infoWindow;
var directionsService;
var directionsRenderer;
const mapContainer = document.getElementById("map");
var bounds, markerCluster, gmarkers = {};
const filters = [];
let billboardMarkers = [];
let overallScore = 0, totalBB = 0;
const billboardTable = document.getElementById('billboardTable');

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
infoTab.innerHTML =
  `<h3>More Info</h3>
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
  'atm',
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
  const mapCentre = { lat: 5.970731, lng: -0.344567 }

  const mapOptions = {
    zoom: 9,
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


  const content =
    `<div class="businessesSuggestion">
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
  let response = await fetch("/api/pois/abonten");
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
  addGhanaPopulation();
  addBillboards(data.billboards);
  addDeliveries(data.deliveries);

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
    return filterScores[filterScoreProp][bbProp.toLowerCase()].score
  } else {
    return 0;
  }
}

function addBillboards(data) {
  const bounds = new google.maps.LatLngBounds();

  var spiderConfig = {
    keepSpiderfied: true,
    event: 'mouseover'
  };
  var markerSpiderfier = new OverlappingMarkerSpiderfier(map, spiderConfig);

  const markers = data.map((el) => {
    totalBB++;
    const iconUrl = `images/billboardColored.png`;
    let score;

    let address = el && parseData(el.address);
    let medium = el && el.medium && parseData(el.medium["characteristic_value"]);
    let site_lighting_illumination = el && el.lighting && parseData(el.lighting["characteristic_value"]);
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
    let condition =
      el && el.condition && parseData(el.condition["characteristic_value"]);
    let visibility =
      el && el.visibility && parseData(el.visibility["characteristic_value"]);
    let traffic =
      el && el.traffic && parseData(el.traffic["characteristic_value"]);
    let traffic_q =
      el && el.traffic_q && parseData(el.traffic_quality["characteristic_value"]);

    let angle = el && el.angle && parseData(el.angle["characteristic_value"]);
    let image = el && parseData(el.image);
    let latitude = el && parseData(el.latitude);
    let longitude = el && parseData(el.longitude);

    score = parseBBProps('site_lighting_illumination', site_lighting_illumination) + parseBBProps('condition', condition) +
      parseBBProps('visibility', visibility) + parseBBProps('height', height) + parseBBProps('traffic', traffic)
      + parseBBProps('traffic_q', traffic_q) + parseBBProps('clutter', clutter)

    el['score'] = score;

    data = {
      site_lighting_illumination, condition, visibility, height, traffic, traffic_q, clutter
    }

    let latlng = new google.maps.LatLng(el.latitude, el.longitude);

    bounds.extend(latlng);
    let contentString =
      '<div class ="infoWindow">' +
      "<div>" +
      "Address: <b>" +
      address +
      "</b></div>" +
      "<div>" +
      "Medium Type: <b>" +
      medium +
      "</b></div>" +
      "<div>" +
      "Lighting: <b>" +
      site_lighting_illumination +
      "</b></div>" +
      "<div>" +
      "Direction: <b>" +
      direction +
      "</b></div>" +
      "<div>" +
      "Faces: <b>" +
      faces +
      "</b> </div>" +
      "<div>" +
      "Clutter: <b>" +
      clutter +
      "</b> </div>" +
      "<div>" +
      "Size: <b>" +
      size +
      "</b> </div>" +
      "<div>" +
      "Orientation: <b>" +
      orientation +
      "</b> </div>" +
      "<div>" +
      "Height: <b>" +
      height +
      "</b> </div>" +
      "<div>" +
      "Road Side: <b>" +
      parseData(side_of_road) +
      "</b> </div>" +
      "<div>" +
      "Angle: <b>" +
      parseData(angle) +
      "</b> </div>" +
      "<div>" +
      "Score: <b>" +
      el.score +
      "</b> </div>" +
      "</div>" +
      '<img class="billboardImage" alt="billboard photo" src=' +
      el.image +
      ">" +
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
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(30, 30),
      },
      optimized: false,
      data
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

    // Adds the Marker to OverlappingMarkerSpiderfier
    markerSpiderfier.addMarker(marker);
    return marker;

  });


  markerSpiderfier.addListener('click', function (marker, e) {
    //infoWindow.setContent(marker.title);
    infoWindow.open(map, marker);
  });

  markerSpiderfier.addListener('spiderfy', function (markers) {
    infoWindow.close();
  });

  billboardMarkers = new MarkerClusterer(map, markers, { imagePath: "images/m" });

  billboardMarkers.setMaxZoom(15);

  billboardTable.style.display = 'block';
  drawBBLegend()

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

        billboardTable.style.display = 'block';

      }
      if (!cb.checked) {
        // if off
        billboardMarkers.removeMarkers(markers);

        billboardTable.style.display = 'none';
        drawBBLegend()
      }
    }
  });


}

function addDeliveries(data) {
  const bounds = new google.maps.LatLngBounds();

  var spiderConfig = {
    keepSpiderfied: true,
    event: 'mouseover'
  };
  var markerSpiderfier = new OverlappingMarkerSpiderfier(map, spiderConfig);

  const markers = data.map(el => {
    let product_name = el && parseData(el.product_name)
    let product_description = el && parseData(el.product_description)
    let total_price = el && parseData(el.total_price)
    let quantity = el && parseData(el.quantity)

    let latlng = new google.maps.LatLng(el.latitude, el.longitude);
    bounds.extend(latlng);

    let contentString =
      '<div class ="infoWindow">' +
      "<div>" +
      "Product Name: <b>" +
      product_name +
      "</b></div>" +
      "<div>" +
      "Product Price: <b>" +
      total_price +
      "</b></div>" +
      "<div>" +
      "Quantity: <b>" +
      quantity +
      "</b></div>" +
      "<div>" +
      "Product Description: <b>" +
      product_description +
      "</b></div>" +
      "</div>" +
      '<img class="billboardImage" alt="Delivery photo" src=' + el.photo + ">" +
      '<button class="btn end" data-lat=' + el.latitude +
      " data-long=" + el.longitude + " >Go Here</button>" +
      '<button class="btn stop" data-lat=' + el.latitude +
      " data-long=" + el.longitude + " >Add Stop</button>" +
      '<button class="btn start" data-lat=' + el.latitude +
      " data-long=" + el.longitude + " >Start Here</button>";

    let marker = new google.maps.Marker({
      position: latlng,
      icon: {
        url: `images/bbAmber.png`,
        scaledSize: new google.maps.Size(30, 30),
      },
      optimized: false,
    });

    google.maps.event.addListener(
      marker, "click", ((marker, el) => {
        return () => {
          infoWindow.setContent(contentString);
          infoWindow.open(map, marker);
        };
      })(marker, el)
    );

    markerSpiderfier.addMarker(marker);
    return marker;
  });

  markerSpiderfier.addListener('click', function (marker, e) {
    //infoWindow.setContent(marker.title);
    infoWindow.open(map, marker);
  });

  markerSpiderfier.addListener('spiderfy', function (markers) {
    infoWindow.close();
  });


  deliveryMarkers = new MarkerClusterer(map, [], { imagePath: "images/m" });
  deliveryMarkers.setMaxZoom(15);


  div = document.createElement("div");
  div.innerHTML = `<img src='images/bbAmber.png' alt='Delivery' /> Deliveries <input id="deliveryChecked" type="checkbox" />`;
  essentialLayers.appendChild(div);


  legend.addEventListener("change", (e) => {
    if (e.target.matches("#deliveryChecked")) {
      cb = document.getElementById("deliveryChecked");
      // if on
      if (cb.checked) {
        deliveryMarkers.addMarkers(markers);
        map.fitBounds(bounds);
        map.panToBounds(bounds);
      }
      if (!cb.checked) {
        // if off
        deliveryMarkers.removeMarkers(markers);
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

poiLayersAccordion.addEventListener('change', (e) => {
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
})


billboardTable.addEventListener('click', e => {
  if (e.target.matches('.category')) {
    // get the id/name of category
    const category = e.target.value
    categorizeBB(category)
  }

  if (e.target.matches('.filter_selector')) {
    const value = e.target.value.trim()
    if (value == "") {
      accumulateFilters(e.target.name.toLowerCase(), "", true)
    } else {
      accumulateFilters(e.target.name.toLowerCase(), value.toLowerCase())
    }
  }
})

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
  const index = filters.findIndex(f => f.name === name);
  drawFilterIcon()
  const scoreBoard = infoTab.querySelector('#score')

  // remove a filter
  if (remove) {
    // user wants to remove a whole filter category
    // thus get the category from the accumulated filters
    // and also get the score of the value previously added 
    // then remove it from the overall score
    if (filters.length > 0) {
      const prevFilterVal = filters[index]['value']
      const prevScore = filterScores[name][prevFilterVal].score
      overallScore -= prevScore
      scoreBoard.innerHTML = overallScore
    }

    filters.splice(index, 1);
    applyFilters()
    updateFilterHtml()
    return;
  }

  // add a filter
  // if name was not found in filters, push.
  if (index < 0) {
    const score = filterScores[name][value].score
    overallScore += score;
    scoreBoard.innerHTML = overallScore

    filters.push({ name: name, value: value });
    applyFilters()
    updateFilterHtml()
    return;
  }

  // update a filter
  // if name was found, update with new value
  const prevScore = filterScores[name][filters[index].value].score
  overallScore -= prevScore;
  const newScore = filterScores[name][value].score
  overallScore += newScore;
  scoreBoard.innerHTML = overallScore

  filters[index].value = value;
  applyFilters()
  updateFilterHtml()
}

// apply all fillters in the filters array
const applyFilters = () => {
  let counter = 0;
  // for each billboard check if it meets the filters 
  billboardMarkers.getMarkers().forEach(bm => {

    const viable = filters.reduce((acc, { name, value }) => {
      return acc && bm.data[`${name}`]?.toLowerCase() === value
    }, true);

    const greyedIcon = {
      url: `./images/billboardGreyed2.png`,
      scaledSize: new google.maps.Size(30, 30)
    };

    const coloredIcon = {
      url: `./images/billboardColored.png`,
      scaledSize: new google.maps.Size(30, 30)
    }

    if (viable) {
      counter++
      bm.setIcon(coloredIcon);
      bm.setAnimation(google.maps.Animation.BOUNCE)
      stopAnimation(bm);
      return;
    }
    bm.setIcon(greyedIcon);

  })
  infoTab.querySelector("#bbCount").innerHTML = counter;
}

function stopAnimation(marker) {
  setTimeout(function () {
    marker.setAnimation(null);
  }, 3000);
}

const filterScores = {
  site_lighting_illumination: {
    backlit: { score: 3, icon: 'bbBacklit1' },
    frontlit: { score: 2, icon: "bbFrontlit1" },
    unlit: { score: 1, icon: "bbNolit" },
  },
  condition: {
    excellent: { score: 4, icon: "bbDgreen" },
    good: { score: 3, icon: "bbLgreen" },
    average: { score: 2, icon: "bbAmber" },
    poor: { score: 1, icon: "bbRed" },
  },
  visibility: {
    excellent: { score: 3, icon: "bbDgreen" },
    good: { score: 2, icon: "bbAmber" },
    poor: { score: 1, icon: "bbRed" },
  },
  height: {
    "eye level": { score: 3, icon: "bbDgreen" },
    moderate: { score: 2, icon: "bbAmber" },
    "too high": { score: 1, icon: "bbRed" },
  },
  traffic: {
    slow: { score: 3, icon: 'bbDgreen' },
    average: { score: 2, icon: 'bbAmber' },
    fast: { score: 1, icon: 'bbRed' },
  },
  traffic_q: {
    heavy: { score: 3, icon: 'bbDgreen' },
    medium: { score: 2, icon: 'bbAmber' },
    light: { score: 1, icon: 'bbRed' }
  },
  clutter: {
    solus: { score: 3, icon: "bbBlue" },
    average: { score: 2, icon: "bbNolit" },
    cluttered: { score: 1, icon: "billboardGreyed1" },
  },
};

function categorizeBB(category) {
  const defaultIcon = {
    url: `./images/billboardColored.png`,
    scaledSize: new google.maps.Size(30, 30)
  }
  billboardMarkers.getMarkers().forEach(bm => {
    for (let [billboardProp, value] of Object.entries(bm.data)) {
      if (billboardProp.toLowerCase() === category.toLowerCase()) {
        if (
          value == null ||
          value == "null" ||
          value == undefined ||
          value == "undefined"
        ) {
          // condition: null/undefined
          bm.setIcon(defaultIcon);
        } else {
          // condition:poor
          if (filterScores[category].hasOwnProperty(value.toLowerCase())) {
            const newIcon = {
              url: `./images/${filterScores[category][value.toLowerCase()]['icon']}.png`,
              scaledSize: new google.maps.Size(30, 30)
            }

            bm.setIcon(newIcon);
            bm.setAnimation(google.maps.Animation.BOUNCE)
            stopAnimation(bm);
          } else {
            bm.setIcon(defaultIcon);
          }
        }
      }
    }
  })
  drawCatIcons(category);
}

function drawCatIcons(category) {
  let html = "";
  for (const [k, v] of Object.entries(filterScores[category])) {
    html +=
      `<div> <h4> ${capitalize(k)} </h4> <img class="billboardCatInfo-img" src="./images/${v.icon}.png"> </div>`;
  }

  infoTab.querySelector(".billboardCatInfo").innerHTML =
    `<h4 class="info-header">Categories Key</h4>
    ${html}
    <div>
      <h4> Value Not Found </h4> <img class="billboardCatInfo-img" src="./images/billboardColored.png">
    </div>`

}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function drawBBLegend() {
  const html = `
      <h4 class="info-header">Filter Key</h4>
      <div><h4>Score:</h4><span id="score">0</span> </div>
      <hr class="hr">
      <div><span id="bbCount">${totalBB}</span> Billboards</div>
      <hr class="hr">
      <div style="text-align:centre;"> Filters </div>
      <div id="filters"></div>
      <hr class="hr">
      <div id="filterIcons"> </div>`

  infoTab.querySelector(".billboardFilInfo").innerHTML = html
}

function updateFilterHtml() {
  // filters :[...filter]
  // filter: {name: value}
  let html = ''
  filters.forEach(({ name, value }) => {
    html += `<div>${capitalize(name)} --- ${capitalize(value)}</div>`
  });
  infoTab.querySelector('#filters').innerHTML = html
}

function drawFilterIcon() {
  infoTab.querySelector('#filterIcons').innerHTML = `
            <div>
            Meets Criteria: <img class="billboardCatInfo-img" src="./images/billboardColored.png">
            </div>
            <div>
            Does not meet Criteria <img class="billboardCatInfo-img" src="./images/billboardGreyed2.png">
            </div>
            `;
}
