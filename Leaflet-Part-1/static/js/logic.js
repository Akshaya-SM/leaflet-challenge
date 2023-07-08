// Use the url to pull the data for All Earthquakes form past 7 days as JSON file
const earthquakeUrl= 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

function createMap(eqLocatons){

    // Adding the title layer to the map:
    let worldMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Setting a Base Map object to worldMap:
    let baseMap = {
        "World Map" : worldMap
    };

    // Create Overlay object to show the Earthquake loctions 
    let overlayMap = {
        "Earthquakes" : eqLocatons
    };

    // Create myMap 
       let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [worldMap, eqLocatons ]
    });

    // Set the map control to toggle on and off the eqlocations.
    // Add the layer control to the map.
    L.control.layers(baseMap, overlayMap, {
        collapsed: false
    }).addTo(myMap);

    // Legend 
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
        
        var div = L.DomUtil.create('div', 'info legend');
        //labels = ['<strong>Depth:<br></strong>'];
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];


        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<div style="background:' + getColor(grades[i] + 1) + '"></div> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
      
          return div; 
    }

    legend.addTo(myMap);

}

function createMarkers(response) {

    let earthquakes = response.features;
    let eqMarkers = [];

    // Loop through the each earthquake and get their coordinates 
    for (i= 0; i< earthquakes.length ; i++ ){

        let earthquake =  earthquakes[i];
        let eqColor = getColor(earthquake.geometry.coordinates[2]);

        // Add each earthquake coordinates to a list 
        // Create a circle Marker for each earthquake loctations on the myMap.
        let eqMarker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            color : "black",
            fillColor : eqColor,
            weight: 1,
            fillOpacity: 0.75,
            radius: earthquake.properties.mag * 10000 

        }).bindPopup("<h3> Location: " + earthquake.properties.place + 
                    "</h3><h3>Mag: " + earthquake.properties.mag + 
                    "</h3><h3>Depth: " + earthquake.geometry.coordinates[2] + 
                    "</h3><a href=" + earthquake.properties.url + ">URL</a>");

        eqMarkers.push(eqMarker);

    };

    // call createMap function to create the map
    createMap(L.layerGroup(eqMarkers));

}

function getColor(color) {
    return  color > 90 ? '#FF0000' : 
            color > 70 ? '#BD0026' : 
            color > 50 ? '#eded24' : 
            color > 30 ? '#fca828' :  
            color > 10 ? '#58f235' :  
            '#FEB24C'; 

}

// get geojson for all the earthquakes in last week.
d3.json(earthquakeUrl).then(createMarkers);

