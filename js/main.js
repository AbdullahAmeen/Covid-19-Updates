
// Set the map view by using the L.map funciton. 
var map = L.map('map').setView([37.8, -96], 4);

//Here I am going to add multiple tiles to my map as base maps. Giving users the options to select a base map of thier choice.

var key = 'cKCnQalXEAt2mhner6ln'; // this tile is taken from Maptiler
var streetsmap = L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,{
        maxZoom: 22,
        minZoom: 1,
        attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\ <spam class='attributes'> MapTiler | </spam>  \u003ca href=\"https://www.google.com/maps\" target=\"_blank\"\u003e\ <spam class='attributes '> Google Maps |</spam>\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"  &nbsp;<a href=\"https://www.worldometers.info/coronavirus/country/us/\" target=\"_blank\"> <spam class='attributes'>Data Source :Worldometer</spam> </a> |&nbsp Analyzed and Mapped By: Abdullah Ameen | Date: 12/31/2022 ",
        crossOrigin: true
      }).addTo(map);

// This is taken from google map (Satellite base map)
var googlemap = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 22,
    minZoom: 1,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

// Water color tile from Leaflet Providers Preview

var Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	subdomains: 'abcd',
    maxZoom: 22,
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
}).addTo(map);

//Adding geoJason and dispay information in popup
function coivd19cases (feature, layer) {
  layer.bindPopup ("<span class='headings'>State: </span>" + feature.properties.NAME +"<br>" + 
  "<span class='headings'>Total Population: </span>" + feature.properties.Population +"<br>" + 
  "<span class='headings'>Total Covid-19 Cases: </span>" + feature.properties.Covid19Cas +"<br>" + 
  "<span class='headings'>Total Recovered: </span>" + feature.properties.Recovered +"<br>" +
   "<span class='headings'>Total Deaths: </span>" + feature.properties.DethTotal +"<br>" + "<span class='headings'> Death Rate: </span>"+
   feature.properties.MortalityR.toFixed(2)+"% " + "<small class='smalltext'> (Total Deaths)/(Total Cases) * 100</small>" )

};

// Making the Choropleth map

function getColor(d) {
		return d > 3000000 ? '#7a0177' :
          d > 2000000 ? '#ae017e' :
          d > 900000  ? '#dd3497' :
          d > 700000  ? '#f768a1' :
          d > 400000  ? '#fa9fb5' :
          d > 150000  ? '#fcc5c0' :
                        '#feebe2';
	}
function style(feature) {
		return {
			weight: 1,
			opacity: 1,
			color: 'white',
			fillOpacity: 0.8,
			fillColor: getColor(feature.properties.Covid19Cas)
		};
	}

//Adding legend to the map.
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [""],
        labels = ["images/Legend.png class='legend'"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            grades[i] + (" <img src="+ labels[i]) +'<br>';
    }

    return div;
};

legend.addTo(map);


// Layer controle and adding geojason
var states = L.geoJson(statepopulation1, {style:style,
   onEachFeature:coivd19cases,
   
  
}).addTo(map);



// Layer Controller
var overlays = {
    "Covid-19 Cases": states,
};

var baseLayers = {
    "Google Map": googlemap,
    "Water Color": Watercolor,
    "Map Tiler": streetsmap   
};

//Adding Scale to the map
L.control.scale({
    metric:false,
    imperial:true

}).addTo(map);

//Adding north arrow to the map

var north = L.control({position: "bottomleft"});
north.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    div.innerHTML = '<img src="images/north-arrow.png" class="northarrow">';
    return div;
}
north.addTo(map);

L.control.layers(overlays, baseLayers,{collapsed:false}).addTo(map);

function highlightLayer(feature) {
    map._layers['name'+LayerID].setStyle(highlight);
}