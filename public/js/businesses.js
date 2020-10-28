var map;
let infoWindow;
var directionsService;
var directionsRenderer;
var mapContainer = document.getElementById("map");

let legend = document.createElement('div');
legend.setAttribute('id', 'legend');
legend.innerHTML = `<h3>Map Legend</h3>`;

const essentialLayers = document.createElement('div');
essentialLayers.className = 'essentialLayers';
legend.appendChild(essentialLayers);

const mapLayers = document.createElement('div');
mapLayers.innerHTML = '<h5 class="accordion">Map Layers</h5>';
mapLayers.className = 'mapLayers';
legend.appendChild(mapLayers);

const mapLayersAccordion = document.createElement('div');
mapLayersAccordion.className = 'accordion-content';
mapLayers.append(mapLayersAccordion);

const poiLayers = document.createElement('div');
poiLayers.innerHTML = '<h5 class="accordion">POIs</h5>';
poiLayers.className = 'poiLayers';
legend.appendChild(poiLayers);
const poiLayersAccordion = document.createElement('div');
poiLayersAccordion.className = 'accordion-content';
poiLayers.appendChild(poiLayersAccordion);

const infoTab = document.createElement('div');
infoTab.setAttribute('id', 'infoTab');
infoTab.innerHTML = `<h3>More Info</h3><div class="info"></div>`;

const directionsPanel = document.createElement('div');
directionsPanel.className = 'directionsPanel';
directionsPanel.innerHTML = ` 
            <h3>Directions</h3>
            <span class="closeBtn closeDirPanel">&times;</span>
            `;

const commD = [
    'bank', 'hospital', 'police', 'school', 'university',
    'bar', 'petrolStation', 'grocery', 'kiosk', 'pharmacy',
    'restaraunt', 'saloon', 'supermarket'
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
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        fullscreenControl: true,
        styles: [
            { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] },
            { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] },
            { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
            { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] },
            { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] },
            { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
            { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] },
            { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#80DEEA" }, { "visibility": "on" }] }
        ]
    };

    map = new google.maps.Map(mapContainer, mapOptions);
    infoWindow = new google.maps.InfoWindow;
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(infoTab);

    var input = document.getElementById('searchInput');
    var autocomplete = new google.maps.places.Autocomplete(input, { bounds: defaultBounds });
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-4.47166, 33.97559),
        new google.maps.LatLng(3.93726, 41.85688));

    autocomplete.bindTo('bounds', map);

    var businessesListCont = document.querySelector('.businesses-list');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(businessesListCont);

    fetchMobileUploads();
    fetchData();

    // initialize directions service
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

async function fetchData() {
    let response = await fetch('/api/billboards/all');
    if (response.ok) {
        data = await response.json();
        addOverlays(data);
    } else {
        alert('Something went wrong while fetching data. Error: ' + response.status);
    }
}

async function fetchMobileUploads() {
    // we need to make a request for mobile uploads within 
    // the past one week from today(2 dates)
    const today = new Date();
    const oneWkAgo = today.setDate(today.getDate() - 7);
    const oneWkAgoDate = new Date(oneWkAgo).toLocaleDateString('en-GB').split('/').join('-');
    const todaysDate = new Date().toLocaleDateString('en-GB').split('/').join('-');
    const url = `https://bi.predictiveanalytics.co.ke/api/all-deliveries?start=${oneWkAgoDate}&end=${todaysDate}`;
    let response = await fetch(url, {
        method: "GET",
        headers: {
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Headers": "X-Requested-With"
        }
    });
    if (response.ok) {
        mobileData = await response.json();
        getmobileMarkers(mobileData.data);
    } else {
        alert('Something went wrong while fetching Mobile Uploads. Error: ' + response.status);
    }
}

function addOverlays(data) {
    addBillboards(data.billboards);
    addAtm(data.atm);
    addTrafficLayer();
    addNssf(data.nssf);
    nairobiSublWMS();
    addNairobiUberSpeeds()
    addugPopProj();
    addGhanaPopulation();
    for (const [key, value] of Object.entries(data)) {
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
        const top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
        const bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));
        // corrections for the slight shift of the map server
        const deltaX = 0.0013;
        const deltaY = 0.00058;

        // create bounding box string
        const bbox = (top.lng() + deltaX) + "," +
            (bot.lat() + deltaY) + "," +
            (bot.lng() + deltaX) + "," +
            (top.lat() + deltaY);
        const url =
            'http://play.predictiveanalytics.co.ke:8080/geoserver/Predictive/wms?' +
            '&service=WMS' +
            '&version=1.1.0' +
            '&request=GetMap' +
            `&layers=${lyr}` +
            `&bbox=${bbox}` +
            '&bgcolor=0xFFFFFF' +
            '&transparent=true' +
            '&width=256' +
            '&height=256' +
            '&srs=EPSG:4326' +
            '&format=image%2Fpng';
        return url

    }
    return fullURl;
}

const latLonToXY = (lat, lon, zoom) => {
    // Convert to radians
    lat = lat * Math.PI / 180;
    lon = lon * Math.PI / 180;

    var circumference = 256 * Math.pow(2, zoom);
    var falseEasting = circumference / 2.0;
    var falseNorthing = circumference / 2.0;
    var radius = circumference / (2 * Math.PI);

    var point = {
        y: radius / 2.0 * Math.log((1.0 + Math.sin(lat)) / (1.0 - Math.sin(lat))),
        x: radius * lon
    };

    point.x = falseEasting + point.x;
    point.y = falseNorthing - point.y;

    return point;
}

const getTileCoordinates = (lat, lon, zoom) => {
    const point = latLonToXY(lat, lon, zoom);
    const tileXY = {
        x: Math.floor(point.x / 256),
        y: Math.floor(point.y / 256)
    };
    return tileXY;
}

const getTileBoundingBox = (map, tileCoords) => {
    const projection = map.getProjection();
    const zpow = Math.pow(2, map.getZoom());

    const ul = new google.maps.Point(tileCoords.x * 256.0 / zpow, (tileCoords.y + 1) * 256.0 / zpow);
    const lr = new google.maps.Point((tileCoords.x + 1) * 256.0 / zpow, (tileCoords.y) * 256.0 / zpow);
    const ulw = projection.fromPointToLatLng(ul);
    const lrw = projection.fromPointToLatLng(lr);
    // const bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();

    const bbox = {
        latMin: ulw.lat(),
        latMax: lrw.lat(),
        lonMin: ulw.lng(),
        lonMax: lrw.lng()
    };

    return bbox;
}

const latLonToTileXYOffset = (lat, lon, zoom) => {
    point = latLonToXY(lat, lon, zoom);

    const tileOffset = {
        x: point.x % 256,
        y: point.y % 256
    };

    return tileOffset;
}

function nairobiSublWMS() {
    const wmsLayer = 'Predictive:nairobisublocations';
    const key = () => {
        info = infoTab.querySelector('.info')
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
        `
    }
    const nrbtile = getTiles(wmsLayer);

    const nairobisublocations = new google.maps.ImageMapType({
        getTileUrl: nrbtile,
        minZoom: 0,
        maxZoom: 19,
        opacity: 1.0,
        alt: 'Nairobi County Sublocations Population 2019',
        name: 'nrbtile',
        isPng: true,
        tileSize: new google.maps.Size(256, 256)
    });

    div = document.createElement('div');
    div.innerHTML = `Nairobi Sublocations<input id="sublCheck" type="checkbox" />`;
    mapLayersAccordion.appendChild(div);
    legend.addEventListener('change', e => {
        if (e.target.matches('#sublCheck')) {
            cb = document.getElementById('sublCheck')
                // if on
            if (cb.checked) {
                map.overlayMapTypes.setAt(0, nairobisublocations);
                key();
            }
            if (!cb.checked) {
                // if off
                map.overlayMapTypes.removeAt(0);
                infoTab.querySelector('.info').innerHTML = '';
            }
        }
    });

}

function addNairobiUberSpeeds() {
    const wmsLayer = '	Predictive:nairobi roads travel speeds February';
    const key = () => {
        info = infoTab.querySelector('.info')
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
        `
    }
    const uberspeedstile = getTiles(wmsLayer);

    const uberspeeds = new google.maps.ImageMapType({
        getTileUrl: uberspeedstile,
        minZoom: 0,
        maxZoom: 19,
        opacity: 1.0,
        alt: 'Nairobi roads travel speeds February',
        name: 'uberspeedstile',
        isPng: true,
        tileSize: new google.maps.Size(256, 256)
    });

    div = document.createElement('div');
    div.innerHTML = `Nairobi Travel Speeds<input id="uberCheck" type="checkbox" />`;
    mapLayersAccordion.appendChild(div);
    legend.addEventListener('change', e => {
        if (e.target.matches('#uberCheck')) {
            cb = document.getElementById('uberCheck')
                // if on
            if (cb.checked) {
                map.overlayMapTypes.setAt(3, uberspeeds);
                key();
            }
            if (!cb.checked) {
                // if off
                map.overlayMapTypes.removeAt(3);
                infoTab.querySelector('.info').innerHTML = '';
            }
        }
    });
}

function addTrafficLayer() {
    const trafficLayer = new google.maps.TrafficLayer();

    div = document.createElement('div');
    div.innerHTML = `Traffic Layer <input id="trafficChecked" type="checkbox" />`;

    mapLayersAccordion.appendChild(div);
    legend.addEventListener('change', e => {
        if (e.target.matches('#trafficChecked')) {
            cb = document.getElementById(`trafficChecked`)
                // if on
            if (cb.checked) {
                trafficLayer.setMap(map);
            }
            if (!cb.checked) {
                // if off
                trafficLayer.setMap(null);
            }
        }
    })
}

function add(key, value) {
    // create a markers array 
    const markers = value.map(el => {
        // the x and y of the marker
        latitude = el.geojson.coordinates[1];
        longitude = el.geojson.coordinates[0];
        let latlng = new google.maps.LatLng(latitude, longitude);
        iconUrl = `./images/${key}.png`
        let contentString = '<p><strong>' + el.name + '<strong></p>' +
            '<button class="btn end" data-lat=' + latitude + ' data-long=' + longitude + ' >Go Here</button>' +
            '<button class="btn stop" data-lat=' + latitude + ' data-long=' + longitude + ' >Add Stop</button>' +
            '<button class="btn start" data-lat=' + latitude + ' data-long=' + longitude + ' >Start Here</button>';
        let marker = new google.maps.Marker({
            position: latlng,
            icon: { url: iconUrl, scaledSize: new google.maps.Size(20, 20) },
            optimized: false,
        });
        // open a popup on click
        google.maps.event.addListener(marker, 'click', ((marker, el) => {
            return () => {
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);
            }
        })(marker, el));
        return marker
    });
    const markerCluster = new MarkerClusterer(
        map, [], { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' }
    );
    div = document.createElement('div');
    div.innerHTML = `<img src='${iconUrl}' alt="${key}"/> ${key}<input id="${key}Checked" type="checkbox" />`;
    poiLayersAccordion.appendChild(div);
    legend.addEventListener('change', e => {
        cb = document.getElementById(`${key}Checked`)
            // if on
        if (cb.checked) {
            markerCluster.addMarkers(markers)
        }
        if (!cb.checked) {
            // if off
            markerCluster.removeMarkers(markers)
        }
    })
}

async function addBillboards(data) {

    const markers = data.map(el => {
        let latlng = new google.maps.LatLng(el.lat, el.long)
        let contentString =
            '<div class ="infoWindow">' +
            '<div>' + 'Name: <b>' + parseData(el.billboard_id) + '</b></div>' +
            '<div>' + 'Route: <b>' + parseData(el.route_name) + '</b></div>' +
            '<div>' + 'Size: <b>' + parseData(el.size) + '</b></div>' +
            '<div>' + 'Visibility: <b>' + parseData(el.visibility) + '</b> </div>' +
            '<div>' + 'Medium: <b>' + parseData(el.select_medium) + '</b> </div>' +
            '<div>' + 'Traffic: <b>' + parseData(el.traffic) + '</b> </div>' +
            '</div>' +
            '<img class="billboardImage" alt="billboard photo" src=' + el.photo + '>' +
            '<button class="btn end" data-lat=' + el.lat + ' data-long=' + el.long + ' >Go Here</button>' +
            '<button class="btn stop" data-lat=' + el.lat + ' data-long=' + el.long + ' >Add Stop</button>' +
            '<button class="btn start" data-lat=' + el.lat + ' data-long=' + el.long + ' >Start Here</button>';
        let marker = new google.maps.Marker({
            position: latlng,
            icon: { url: `images/marker.png`, scaledSize: new google.maps.Size(20, 20) },
            optimized: false,
        });
        google.maps.event.addListener(marker, 'click', ((marker, el) => {
            return () => {
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);
            }
        })(marker, el));
        return marker
    });
    const markerCluster = new MarkerClusterer(
        map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' }
    )
    div = document.createElement('div');
    div.innerHTML = `<img src='images/marker.png' alt='billboard'/>Billboards<input id="billboardChecked" checked type="checkbox" />`;
    essentialLayers.appendChild(div);
    legend.addEventListener('change', e => {
        if (e.target.matches('#billboardChecked')) {
            cb = document.getElementById('billboardChecked')
                // if on
            if (cb.checked) {
                markerCluster.addMarkers(markers)
            }
            if (!cb.checked) {
                // if off
                markerCluster.removeMarkers(markers)
            }
        }
    })
}

function addAtm(data) {
    const markers = data.map(el => {
        latitude = el.geojson.coordinates[1];
        longitude = el.geojson.coordinates[0]
        let latlng = new google.maps.LatLng(latitude, longitude);
        let contentString = '<p>Operator: <strong>' + el.operator + '<strong></p>' +
            '<button class="btn end" data-lat=' + latitude + ' data-long=' + longitude + ' >Go Here</button>' +
            '<button class="btn stop" data-lat=' + latitude + ' data-long=' + longitude + ' >Add Stop</button>' +
            '<button class="btn start" data-lat=' + latitude + ' data-long=' + longitude + ' >Start Here</button>';
        let marker = new google.maps.Marker({
            position: latlng,
            icon: { url: `images/atm.png`, scaledSize: new google.maps.Size(20, 20) },
            optimized: false,
        });
        google.maps.event.addListener(marker, 'click', ((marker, el) => {
            return () => {
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);
            }
        })(marker, el));
        return marker
    });

    const markerCluster = new MarkerClusterer(
        map, [], { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' }
    )
    div = document.createElement('div');
    div.innerHTML = `<img src='images/atm.png' alt="atm" />ATM<input id="atmCheck" type="checkbox">`;
    poiLayersAccordion.appendChild(div);
    legend.addEventListener('change', e => {
        if (e.target.matches('#atmCheck')) {
            cb = document.getElementById('atmCheck')
                // if on
            if (cb.checked) {
                markerCluster.addMarkers(markers)
            }
            if (!cb.checked) {
                // if off
                markerCluster.removeMarkers(markers)
            }
        }
    })
}

function addNssf(data) {
    const markers = data.map(el => {
        latitude = el.geojson.coordinates[1];
        longitude = el.geojson.coordinates[0];
        let latlng = new google.maps.LatLng(latitude, longitude);

        let contentString =
            '<p><strong>' + el.name + '<strong></p>' +
            '<button class="btn end" data-lat=' + latitude + ' data-long=' + longitude + ' >Go Here</button>' +
            '<button class="btn stop" data-lat=' + latitude + ' data-long=' + longitude + ' >Add Stop</button>' +
            '<button class="btn start" data-lat=' + latitude + ' data-long=' + longitude + ' >Start Here</button>';

        let marker = new google.maps.Marker({
            position: latlng,
            icon: { url: `images/office.png`, scaledSize: new google.maps.Size(20, 20) },
            optimized: false,
        });
        google.maps.event.addListener(marker, 'click', ((marker, el) => {
            return () => {
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);
            }
        })(marker, el));
        return marker
    });
    const markerCluster = new MarkerClusterer(
        map, [], { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' }
    )
    div = document.createElement('div');
    div.innerHTML = `<img src='images/office.png' alt="nssf Offices" />NSSF Offices<input id="nssfChecked" type="checkbox">`;
    poiLayersAccordion.appendChild(div);
    legend.addEventListener('change', e => {
        if (e.target.matches('#nssfChecked')) {
            cb = document.getElementById('nssfChecked')
                // if on
            if (cb.checked) {
                markerCluster.addMarkers(markers)
            }
            if (!cb.checked) {
                // if off
                markerCluster.removeMarkers(markers)
            }
        }

    })
}

function addMetalWorks(data) {
    const markers = data.map(el => {
        latitude = JSON.parse(el.geojson).coordinates[1];
        longitude = JSON.parse(el.geojson).coordinates[0];
        let latlng = new google.maps.LatLng(latitude, longitude);

        let contentString =
            '<p><strong>' + parseData(el.name) + '<strong></p>' +
            '<button class="btn end" data-lat=' + latitude + ' data-long=' + longitude + ' >Go Here</button>' +
            '<button class="btn stop" data-lat=' + latitude + ' data-long=' + longitude + ' >Add Stop</button>' +
            '<button class="btn start" data-lat=' + latitude + ' data-long=' + longitude + ' >Start Here</button>';

        let marker = new google.maps.Marker({
            position: latlng,
            icon: { url: `images/hammer.png`, scaledSize: new google.maps.Size(20, 20) },
            optimized: false,
        });
        google.maps.event.addListener(marker, 'click', ((marker, el) => {
            return () => {
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);
            }
        })(marker, el));
        return marker
    });
    const markerCluster = new MarkerClusterer(
        map, [], { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' }
    )
    div = document.createElement('div');
    div.innerHTML = `<img src='images/hammer.png' alt="Hardware" />Hardware BlackSmiths<input id="hardwareChecked" type="checkbox">`;
    poiLayersAccordion.appendChild(div);
    legend.addEventListener('change', e => {
        if (e.target.matches('#hardwareChecked')) {
            cb = document.getElementById('hardwareChecked')
                // if on
            if (cb.checked) {
                markerCluster.addMarkers(markers)
            }
            if (!cb.checked) {
                // if off
                markerCluster.removeMarkers(markers)
            }
        }

    })
}

function getmobileMarkers(deliveriesData) {
    mobileMarkersDates = new Object();
    const uploadDates = [];
    const markers = deliveriesData.map(el => {
        let latlng = new google.maps.LatLng(el.latitude, el.longitude)
        let contentString =
            'Product Name: <b>' + parseData(el.product_name) + '</b><br/>' +
            'Delivered By: <b>' + parseData(el.delivered_by) + '</b> <br/>' +
            'Description: <b>' + parseData(el.product_description) + '</b> <br/>' +
            'Quantity: <b>' + parseData(el.quantity) + '</b> <br/>' +
            '<img class="billboardImage" alt="delivery photo" src=' + el.photo + '></img>';
        let marker = new google.maps.Marker({
            position: latlng,
            icon: { url: `images/place.png`, scaledSize: new google.maps.Size(20, 20) },
            optimized: false,
        });
        google.maps.event.addListener(marker, 'click', ((marker, el) => {
            return () => {
                infoWindow.setContent(contentString);
                infoWindow.open(map, marker);
            }
        })(marker, el));
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
        return marker
    });
    mobileMarkersDates.dates = uploadDates;
    const markerCluster = new MarkerClusterer(
        map, [], { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' }
    )
    div = document.createElement('div');
    div.innerHTML = `<img src='images/place.png'/>Mobile Uploads<input id="mobileCheck" type="checkbox">`;
    essentialLayers.appendChild(div);
    legend.addEventListener('change', e => {
        if (e.target.matches('#mobileCheck')) {
            cb = document.getElementById('mobileCheck')
                // if on
            if (cb.checked) {
                markerCluster.addMarkers(markers)
            }
            if (!cb.checked) {
                // if off
                markerCluster.removeMarkers(markers)
            }
        }

    })
}

function addugPopProj() {
    const key = () => {
        info = infoTab.querySelector('.info')
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
    }

    const ugtile = getTiles('Predictive:ugsubcountiesprojection')

    const ugPopProj = new google.maps.ImageMapType({
        getTileUrl: ugtile,
        minZoom: 0,
        maxZoom: 19,
        opacity: 1.0,
        alt: 'Uganda Population Projection 2020',
        name: 'ugPopProj',
        isPng: true,
        tileSize: new google.maps.Size(256, 256)
    });

    div = document.createElement('div');
    div.innerHTML = `Uganda Population Projection 2020 <input id="ugPopProjCheck" type="checkbox" />`;
    mapLayersAccordion.appendChild(div);

    legend.addEventListener('change', e => {
        if (e.target.matches('#ugPopProjCheck')) {
            cb = document.getElementById('ugPopProjCheck')
                // if on
            if (cb.checked) {
                map.overlayMapTypes.setAt(1, ugPopProj);
                key();
            }
            if (!cb.checked) {
                // if off
                map.overlayMapTypes.removeAt(1)
                    //   
                infoTab.querySelector('.info').innerHTML = '';
            }
        }
    });
}

function addGhanaPopulation() {
    const key = () => {
        info = infoTab.querySelector('.info');
        info.innerHTML =
            ` <div class="sublocLegend">
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
            `
    }
    const ghtile = getTiles('Predictive:ghanapopulation')

    const ghanaDist = new google.maps.ImageMapType({
        getTileUrl: ghtile,
        minZoom: 0,
        maxZoom: 19,
        opacity: 1.0,
        alt: 'Ghana Districts Population',
        name: 'Ghana Districts',
        isPng: true,
        tileSize: new google.maps.Size(256, 256)
    });

    div = document.createElement('div');
    div.innerHTML = `Ghana Districts <input id="ghCheck" type = "checkbox" />`;
    mapLayersAccordion.appendChild(div);
    legend.addEventListener('change', e => {
        if (e.target.matches('#ghCheck')) {
            cb = document.getElementById('ghCheck')
                // if on
            if (cb.checked) {
                map.overlayMapTypes.setAt(2, ghanaDist);
                key();
            }
            if (!cb.checked) {
                // if off
                map.overlayMapTypes.removeAt(2);
                infoTab.querySelector('.info').innerHTML = '';
            }
        }
    });
}

function parseData(val) {
    if (val == null || val == undefined) {
        return ''
    }
    return val;
}

function parseValues(val) {
    if (val == null || val == undefined) {
        return ''
    }
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//
// create routes
const tracker = new Object();
const stopPoints = [];

mapContainer.addEventListener('click', e => {
    if (e.target.matches('.start')) {
        const lat = parseFloat(e.target.closest('.start').dataset.lat);
        const long = parseFloat(e.target.closest('.start').dataset.long);
        const LatLng = new google.maps.LatLng(lat, long);
        tracker.start = LatLng
        calcRoute(tracker);

    }
    if (e.target.matches('.end')) {
        const lat = parseFloat(e.target.closest('.end').dataset.lat);
        const long = parseFloat(e.target.closest('.end').dataset.long);
        const LatLng = new google.maps.LatLng(lat, long);
        tracker.end = LatLng;
        calcRoute(tracker);
    }
    if (e.target.matches('.stop')) {
        const lat = parseFloat(e.target.closest('.stop').dataset.lat);
        const long = parseFloat(e.target.closest('.stop').dataset.long);
        const LatLng = new google.maps.LatLng(lat, long);
        stopPoints.push({ location: LatLng, stopover: true })
        tracker.stop = stopPoints;
        calcRoute(tracker);
    }
    if (e.target.matches('.accordion')) {
        // console.log(e);
        e.target.classList.toggle('is-open');
        const content = e.target.nextElementSibling;
        if (content.style.maxHeight) {
            // accordion is currently open, so close it
            content.style.maxHeight = null;
        } else {
            // accordion is currently cloed so open it
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }
    if (e.target.matches('.closeDirPanel')) {
        directionsRenderer.setMap(null);
        directionsRenderer = null;
        directionsPanel.parentElement.removeChild(directionsPanel);
    }

});

function calcRoute(tracker) {
    div = document.createElement('div');
    let start, end, waypts;
    if (tracker.start) {
        start = tracker.start;
    }
    if (tracker.end) {
        end = tracker.end;
    }
    if (tracker.stop) {
        if (tracker.stop.length > 8) {
            window.alert('Please Minimize the stop points to 8')
        }
        waypts = tracker.stop
    }
    if (start != undefined && end != undefined) {
        const request = {
            origin: start,
            destination: end,
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        };
        directionsService.route(request, function(response, status) {
            if (status == 'OK') {
                directionsRenderer.setDirections(response);
                directionsRenderer.setPanel(div);
                directionsPanel.appendChild(div);
                map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(directionsPanel);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        });
    }
}

function loader() {
    const loader = document.getElementById("loader")
    const map = document.getElementById("map")
    if (loader) loader.style.display = "none";
    if (map) map.style.display = "block";
}

var businessesDiv = document.querySelector('.businesses-list')
const modalContainer = document.querySelector('.businesses-details');

addBusinessListHTML(businessesList);
addPaginators(paginators);

function addBusinessListHTML(businessesList) {
    // where to place
    const businessesListDiv = document.querySelector('.businesses-list-content');
    // clear the container first
    businessesListDiv.innerHTML = '';
    // the bag to store the html tags
    businessesListHTML = '';
    businessesList.forEach(bus => {
        // append to the bag
        businessesListHTML += `
                <a class="btn bus" data-id="${bus.id}">${bus.name}</a>
            `;
    });
    // set the innerhtml with the bag
    businessesListDiv.innerHTML = businessesListHTML;
}

function addPaginators(paginators) {
    // receive an object 
    // where to be appended
    const pagDiv = document.querySelector('.businesses-list-paginators');
    // clear it
    pagDiv.innerHTML = '';
    // the bag
    let pagHTML = '';
    if (paginators.prev_page_url) pagHTML += `<button data-url='${paginators.prev_page_url}' class="pag">Previous</button>`;
    if (paginators.current_page) pagHTML += `<button>${paginators.current_page}</button>`;
    if (paginators.next_page_url) pagHTML += `<button data-url='${paginators.next_page_url}' class="pag">Next</button>`;

    pagDiv.innerHTML = pagHTML;
}

businessesDiv.addEventListener('click', async(e) => {
    if (e.target.matches('.bus')) addBusinessDetails(e);
    if (e.target.matches('.pag')) fetchBusinessLists(e);
})

window.addEventListener('click', clickOutside)

async function fetchBusinessLists(e) {
    url = e.target.dataset.url;
    const res = await fetch(url);

    if (res.ok) {
        let resData = await res.json();

        const { next_page_url, prev_page_url, current_page, data } = resData;
        const paginatorBtns = { next_page_url, prev_page_url, current_page };
        // add the business categories buttons again
        addBusinessListHTML(resData.data)
            // add the paginators again
        addPaginators(paginatorBtns);
    }
}

async function addBusinessDetails(e) {

    selectedBus = e.target.dataset.id;

    const res = await fetch(`${businessesAPI}=` + selectedBus)
    console.log(res);
    if (res.ok) {
        let jsonData = await res.json()
        jsonData = jsonData.data;

        if (jsonData.length > 0) {

            modalContainer.innerHTML = '';

            jsonData.forEach(data => {
                        htmlString =
                            `
                    <div class="sticky">
                        <a href="#" class="btn" id="shop">Setup Shop</a>
                        <div>
                            <a href="#" class="btn" id="bookmark">Bookmark</a>
                            <button id="closeModal">&times;</button>
                        </div>
                    </div>
                        <div class="modal"> 
                        <h2>${data.name}</h2>
                    <div id='overview'>
                        <h3>Overview</h3>
                        ${data.overview}
                    </div>
                    <div id='facts'>
                        <h3>Facts</h3>
                        ${data.facts ? data.facts : '<p>No info on Facts established yet.</p>'}
                     </div> 
                    <div id='competitors'>  
                        <h3>Competitors</h3>
                        ${data.competition ?
                        `<div id="competition">${data.competition.details}</div>`
                        : '<p>No Info on Competition established yet</p>'}
                    </div>
                    <div id='behaviour'>
                        <h3>Consumer Behaviour</h3>
                        ${data.behaviour ?
                        `<div id="behaviour">${data.behaviour.details}</div>`
                        : '<p>No Info on Consumer Behaviour established yet</p>'}
                    </div>
                    <div id='licences'>    
                        <h3>Licenses</h3>
                        ${data.licenses ?
                        data.licenses.map(license => {
                            return `<div id='license'>
                                <h5>License Name: ${license.name}</h5>
                                <h5>Fee: ${license.fee}</h5>
                                ${license.description}                            
                            </div>`
                        }).join('') : '<p>No Info on Licenses</p>'}
                    </div>
                    <div id='man_powers'>
                        <h3>Man Power</h3>
                        ${data.man_powers ?
                        data.man_power.map(man => {
                            return `<div id='man_power'
                                ${man.details} 
                            </div>`
                        })
                        : '<p>No Info on Man Power</p>'}
                    </div>
                    <div id='stocks'>
                        <h3>Stock</h3>
                        ${data.stocks ?
                        data.stocks.map(stock => {
                            return ` <div id='stock'>
                                    <h5>${stock.name}: ${stock.price}</h5>
                                    ${stock.description} 
                                </div>`;
                        }).join('') : '<p>No Info on Man Power</p>'}
                    </div>
                    <div id='suppliers'>
                        <h3>Supplier</h3>
                        ${data.suppliers ?
                        data.suppliers.map(supplier => {
                            return ` <div id='supplier'>
                            <h5>${supplier.title}</h5>
                                ${supplier.details}
                                </div>
                                `;
                        }).join('') : '<p>No Info on Suppliers</p>'}
                    </div>
                    <h3>Revenue</h3>
                        ${data.revenue ?
                        `<div id="revenue">${data.revenue.details}</div>`
                        : '<p>No info on Revenues established yet.</p>'}
                    <h3> Others</h3 >
                        ${data.others ? data.others : '<p>No More information.</p>'}
                        </div>
                `;

                modalContainer.insertAdjacentHTML('beforeend', htmlString);

            });
            modalContainer.style.display = 'block';

        } else {
            console.log('No Data')
        }
    }
}
modalContainer.addEventListener('click', e => {
    if (e.target.matches('#closeModal')) {
        modalContainer.style.display = 'none';
    }
    if (e.target.matches('#shop')) {
        e.preventDefault()
        // first drop the modal
        // then bring up a search box for places 
        // focus to it
        modalContainer.style.display = 'none';

    }
    if (e.target.matches('#bookmark')) {
        console.log('Haweaeawe')
    }
})
/*
    const closeBtn = document.querySelector('#closeModal');
    const shop = document.querySelector('.shop')
 
    closeBtn.addEventListener('click', e => {
        console.log('asdbjashbdbsa')
        modalContainer.style.display = 'none';
    });
 
    shop.addEventListener('click', e => {
        console.log('Hawau')
    })
    */
function clickOutside(e) {
    if (e.target == modalContainer) {
        modalContainer.style.display = 'none';
    }
}