export const domElements = {
    mapContainer: document.getElementById("map")
};
/**
 * [someFunction description]
 * @param  {[String]} arg1 [description]
 * @param  {[Node]} arg2 [description]
 * @return {[type]}      [description]
 */

export const commD = ['atm', "bank", "hospital", "police", "school", "university", "bar", "kiosk", "pharmacy", "restaurant", "saloon", "supermarket"
]

/**
 *  Load Google Maps script
 * @return {HTMLScriptElement} Will call the intialize map function
 */
export function loadGMapScript() {
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    return script;
}

/**
 * Create a legend 
 * It lays on the right top corner of a map
 * @return {Node} On this we append layers and their toogle buttons
 */
export const createLegend = () => {
    const legend = document.createElement("div");
    legend.setAttribute("id", "legend");
    legend.innerHTML = `<h3>Map Legend</h3>`;
    return legend;
}


/**
 * 
 * @param {Node} legend 
 * @return {Node} With appended Essential Layers Section
 */
export const createEsLayers = (legend) => {
    const essentialLayers = document.createElement("div");
    essentialLayers.className = "essentialLayers";
    legend.appendChild(essentialLayers);

    return essentialLayers;
}

/**
 *  Map Layers Panel
 * @param {Node} legend 
 * @return {HTMLDivElement}
 */
export const createMapLayers = (legend) => {
    const mapLayers = document.createElement("div");
    mapLayers.innerHTML = '<h5 class="accordion">Map Layers</h5>';
    mapLayers.className = "mapLayers";
    legend.appendChild(mapLayers);

    return mapLayers;
}

/**
 * Vertical stacked menu, place the items here
 * @param {HTMLDivElement} mapLayers 
 * @return {HTMLDivElement}
 */
export const createMapLayAcc = (mapLayers) => {
    const mapLayersAccordion = document.createElement("div");
    mapLayersAccordion.className = "accordion-content";
    mapLayers.append(mapLayersAccordion);

    return mapLayersAccordion;
}

/**
 * Points of interest container
 * @param {HTMLDivElement} legend 
 * @return {HTMLDivElement}
 */
export const createPoiLayers = (legend) => {
    const poiLayers = document.createElement("div");
    poiLayers.innerHTML = '<h5 class="accordion">POIs</h5>';
    poiLayers.className = "poiLayers";
    legend.appendChild(poiLayers);

    return poiLayers;
}

/**
 * POIs accordion
 * @param {HTMLDivElement} poiLayers 
 * @return {HTMLDivElement}
 */
export const createPoiLayAcc = (poiLayers) => {
    const poiLayersAccordion = document.createElement("div");
    poiLayersAccordion.className = "accordion-content";
    poiLayers.appendChild(poiLayersAccordion);

    return poiLayersAccordion;
}
/**
 * Panel on the left of a map 
 * we place certain text elements needed
 * @return {HTMLDivElement}
 */
export const createInfoTab = () => {
    const infoTab = document.createElement("div");
    infoTab.setAttribute("id", "infoTab");
    infoTab.innerHTML = `<h3>More Info</h3><div class="info"></div>`;

    return infoTab;
}

/**
 * This panel will show direction on a map
 * @return {HTMLDivElement}
 */
export const createDirectionsPanel = () => {
    const directionsPanel = document.createElement("div");
    directionsPanel.className = "directionsPanel";
    directionsPanel.innerHTML =
        `<h3>Directions</h3>
     <span class="closeBtn closeDirPanel">&times;</span>`;

    return directionsPanel;
}



export const addTrafficLayer = () => {
    const trafficLayer = new google.maps.TrafficLayer();

    let div = document.createElement("div");
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