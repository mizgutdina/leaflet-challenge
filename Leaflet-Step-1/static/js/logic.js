queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerColor (depth) {
    //var depth = depthValue //feature.geometry.coordinates[2]; //feature.properties.mag;
        if (depth >= 90.0) {
          return  "#FF0000" ; 
        } 
        else if (depth >= 70.0) {
            return   "#FF4500" ;
          } 
        else if (depth >= 50.0) {
          return   "#FFA500" ;
        } 
        else if (depth >= 30.0) {
          return   "#FFFF00" ;
        } 
        else if (depth >= 10.0) {
            return  "#9ACD32";
          } 
        else {
          return "#008000" ;
        }
}
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);

    
  });
  

  function createFeatures(earthquakeData) {
    function markerSize(magnitude) {
        if (magnitude === 0) {
            return 1
        }
        return magnitude * 5 //can ommit "else"
    };

    // function markerColor (depth) {
    //     //var depth = depthValue //feature.geometry.coordinates[2]; //feature.properties.mag;
    //         if (depth >= 90.0) {
    //           return  "#FF0000" ; 
    //         } 
    //         else if (depth >= 70.0) {
    //             return   "#FF4500" ;
    //           } 
    //         else if (depth >= 50.0) {
    //           return   "#FFA500" ;
    //         } 
    //         else if (depth >= 30.0) {
    //           return   "#FFFF00" ;
    //         } 
    //         else if (depth >= 10.0) {
    //             return  "#9ACD32";
    //           } 
    //         else {
    //           return "#008000" ;
    //         }
    // }
    // function setStyle (feature) {
    //     return {
    //         radius: markerSize(feature.properties.mag),
    //         fillColor: markerColor(feature.geometry.coordinates[2]),
    //         color: "#000",
    //         weight: 1,
    //         opacity: 1,
    //         fillOpacity: 0.8
    //     }
    // }

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }


    //pointToLayer
    // var geojsonMarkerOptions = {
    //     //radius: markerSize(feature.properties.mag), //markerSize(feature.properties.mag),
        
    //     //fillColor: "#ff7800",
    //     // color: "#000",
    //     weight: 1,
    //     opacity: 1,
    //     fillOpacity: 0.8
    // };

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng) //, geojsonMarkerOptions);
        },

        style: function(feature) {
            //return { setStyle}
            return {
                radius: markerSize(feature.properties.mag),
             fillColor: markerColor(feature.geometry.coordinates[2]),
             color: "#808080",
             weight: 0.3,
             opacity: 1,
             fillOpacity: 0.8
            }
          },
        onEachFeature: onEachFeature,  
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
  
    // Define streetmap and darkmap layers
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/satellite-streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satellite": satellitemap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [satellitemap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  // Set up the legend
        var legend = L.control({ position: "bottomright" });
        legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [-10, 10, 30, 50, 70, 90]//geojson.options.limits;
        //var colors = ["#008000", "#9ACD32","#FFFF00", "#FFA500","#FF4500", "#FF0000"]  //geojson.options.colors;
        // var labels = [];

        for (var i=0; i < grades.length; i++) {
             div.innerHTML += "<i style='background-color: " + markerColor (grades[i]) + "'> &nbsp;&nbsp;&nbsp;&nbsp;</i> " //colors[i]
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
};
  // Adding legend to the map
 legend.addTo(myMap);
    
  }
  
//useful link: https://gis.stackexchange.com/questions/193161/add-legend-to-leaflet-map
//Leaflet.js on legend https://leafletjs.com/examples/choropleth/ 