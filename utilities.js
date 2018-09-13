
var map;
var markers = [];

// get the location of the first bus and plot it
var getAndPlotFirstBus = function(){
	clearMarkers();
	var busLocations = getBusLocations();
	addMarkers(busLocations.vehicle[0]);
};

// get the location of all the buses and plot them
var getAndPlotAllBuses = function(){
	clearMarkers();
	var busLocations = getBusLocations();
	for (var j = 0; j< busLocations.vehicle.length; j++)
	{
		addMarkers(busLocations.vehicle[j]);
	}
	console.log("Bus schedule as of " + new Date());
};

// get the location of all the buses and plot them every 15 seconds
var getAndPlotAllBusesWithTimer = function(){
	clearMarkers();
	setInterval(getAndPlotAllBuses, 15000);
}

var getBusLocations = function(){
	var url = 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=mbta&r=1&t=0';

	// make xhr request
	var xhReq = new XMLHttpRequest();
	xhReq.open('GET', url, false);
	xhReq.send(null);
	var serverResponse = xhReq.responseText;

	// create object from response
	var locations = JSON.parse(serverResponse);
	return locations;
};

var init = function(){
	var latlng = new google.maps.LatLng(42.353350, -71.091525);
	var myOptions = {
		zoom : 14,
		center : latlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
  	map = new google.maps.Map(document.getElementById('map'), myOptions);
};

// Adds markers to the map and into array
var addMarkers = function(bus){

	var marker = getMarker(bus.id);		
	if (marker){
		moveMarker(marker,bus);
	}
	else{
		addMarker(bus);			
	}

};

var addMarker = function(bus){
	var marker = new google.maps.Marker({
	  	position: new google.maps.LatLng(bus.lat,bus.lon),
	    icon: { 
	        path:google.maps.SymbolPath.CIRCLE,
	        fillColor: 'rgba(' +  Math.floor(Math.random()*255) + ', ' +
							Math.floor(Math.random()*255) + ', ' +
							Math.floor(Math.random()*255) + ',  1)',
	        fillOpacity: 1,
	        scale:7,
	        strokeWeight:1
	    },
		map: map,
		title: bus.id
	});
	markers.push(marker);
};


var moveMarker = function(marker,bus) {
    var newLatlng = new google.maps.LatLng(bus.lat,bus.lon);
    marker.setPosition( newLatlng );
};

var getMarker = function (id){
	var marker = markers.find(function(item){
		return item.title === id;
	});
	return marker;
};



// Removes the markers from the map and clear the array
var clearMarkers = function() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}

// create map instance
init();	


