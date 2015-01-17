// Specifies a function to be executed when the DOM is fully loaded.
$(document).ready(function() {

	// Main function to run.
	var main = function(lat, lon, acc) {
		// Prints out the latitude, longitude and accuracy in the console.
		console.log('Latitude: ' + lat + '\r\n' + 'Longitude: ' + lon + '\r\n' + 'Accuracy: ' + acc);
		// Loads the JSON-encoded data from the server using a GET HTTP request.
		$.getJSON('http://ssd.api.port.ac.uk/v1/buildings/openaccess?access_token=bd368b12-4aed-4f5e-8797-3aa9cfe21395&callback=?', function (openaccess) {
			// Sets the open access areas.
			var oaa = openaccess;
			// Loads the JSON-encoded data from the server using a GET HTTP request.
			$.getJSON('http://ssd.api.port.ac.uk/v1/buildings?access_token=bd368b12-4aed-4f5e-8797-3aa9cfe21395&callback=?', function (buildings) {
				// Loops through all the open access areas in the array.
				for (var i = 0; i < openaccess.length; i++) {
					// Loops through all the buildings in the array.
					for (var j = 0; j < buildings.length; j++) {
						// Checks if the open access area and building references are the same.
						if (openaccess[i].building.reference == buildings[j].reference) {
							// Construct array as required.
							oaa[i]['name'] = openaccess[i].building.name;
							oaa[i]['reference'] = openaccess[i].building.reference;
							oaa[i]['latitude'] = buildings[j].latitude;
							oaa[i]['longitude'] = buildings[j].longitude;
						}
					}
					// Creates a local variable for the current building.
				}
				// Loops through all the open access areas in the array.
				for (var k = 0; k < oaa.length; k++) {
					var openacc = oaa[k];
					// Gets the availability of the PCs available in the building.
					var availability = 'Available: ' + (openacc.total - openacc.in_use) + ' / ' + openacc.total;

					// Checks if the building is open.
					if (openacc.open) {
						// Gets the percentage of available PCS in the building.
						var percentage = (openacc.total - openacc.in_use) / openacc.total * 100;
						// Tidies up the percentage and adds a percentage symbol.
						var percentagePretty = Math.floor(percentage) + '%';

						// Creates an HSL colour so as to keep the tone and just change the hue.
						var colour = 'hsl(' + percentage + ', 60%, 60%)';

						// Sets the width of the percentage bar to the percentage of available PCs.
						$('#' + openacc.reference + ' .percent').css('width', percentagePretty);
						$('#' + openacc.reference + ' .percent').text(percentagePretty);
						// Sets the colour of the percentage bar to the HSL colour.
						$('#' + openacc.reference + ' .percent').css('background', colour);

						// Checks if the inline element in the paragraph exists.
						if ($('#' + openacc.reference + ' p span').length === 0) {
							// Changes the text in the availability paragraph for the building.
							$('#' + openacc.reference + ' p').html(availability + '<span>&nbsp;</span>');
						}
					} else {
						// Resets the width of the percentage bar to the percentage of available PCs.
						$('#' + openacc.reference + ' .percent').css('width', '0');

						// Changes the text in the availability paragraph for the building.
						$('#' + openacc.reference + ' p').html('Closed');
					}

					// Checks that the latitude and longitude are not empty and the
					// accuracy is at a maximum of 150.
					if (lat != '' && lon != '') {
						// Runs the function to get the distance in kilometres.
						geo(openacc.reference, openacc);

						// Checks if the inline element in the heading exists.
						if ($('#' + openacc.reference + ' h1 span').length === 0) {
							// Creates a link that navigates the user from their current location to the building.
							$('#' + openacc.reference + ' h1').append('<span><a href="https://www.google.com/maps?saddr=' + lat + ',+' + lon + '&daddr=' + openacc.latitude + ',+' + openacc.longitude + '&hl=en&mra=ls&t=m&z=17" target="_blank">MAP</a></span>');
						}
					} else {
						// Checks if the inline element in the heading exists.
						if ($('#' + openacc.reference + ' h1 span').length === 0) {
							// Creates a link that pinpoints to the building's location.
							$('#' + openacc.reference + ' h1').append('<span><a href="https://www.google.com/maps?q=' + openacc.latitude + ',+' + openacc.longitude + '&hl=en&t=m&z=16" target="_blank">MAP</a></span>');
						}
					}
				}

				// Checks that the latitude and longitude are not empty and that the
				// accuracy is at a maximum of 150.
				if (lat != '' && lon != '') {
					// Sets the first building in the array as the closest by default.
					var closest_building = oaa[0];

					// Loops through all the buildings.
					for (var l = 0; l < oaa.length; l++) {
						// Sets the current building in a variable.
						var building = oaa[l];

						// Checks if the building is open and if it's closer to
						// the user's location that the current closest building.
						if (building.open && building.distance < closest_building.distance) {
							// Sets the current building as the new closest building.
							closest_building = building;
						}
					}

					// Changes the text in the inline element accordingly.
					$('#' + closest_building.reference + ' p span').html('<strong>' + $('#' + closest_building.reference + ' p span').text() + '</strong>');
				}
			});
		});
	};

	// Runs the main function once geolocation variables are received.
	var start = function(lat, lon, acc) {
		// Runs the function for a first time with the geolocation variables.
		main(lat, lon, acc);

		// Runs the function again every 5 seconds.
		setInterval(function() {
			main(lat, lon, acc);
		}, 2000);
	};

	// Sets the PositionOptions to be used to get the user's current location.
	var options = {
		enableHighAccuracy: true,
		maximumAge: 0
	};
	
	// Callback function that takes a Position object as its sole input parameter.
	var success = function(pos) {
		// Clears the timeout of the fail timer.
		clearTimeout(fail_timeout);
		// Creates a variable that gets the coordinates from the input parameter.
		var current = pos.coords;

		// Passes the coordinates to the variables created earlier.
		lat = current.latitude;
		lon = current.longitude;
		acc = current.accuracy;

		// Runs the start function with the geolocation variables received.
		start(lat, lon, acc);
	};

	// Callback that takes a PositionError object as its sole input parameter.
	var error = function(err) {
		// Clears the timeout of the fail timer.
		clearTimeout(fail_timeout);
		// Runs the start function with no geolocation.
		start('', '', '');
	};

	// Gets the distance in kilometres and returns it on the building availability.
	var geo = function(id, building) {
		building.distance = latlontokm(lat, lon, building.latitude, building.longitude);
		var dist = building.distance.toString().substr(0, building.distance.toString().indexOf('.'));
		var time = dist / 0.7;
		var hours = Math.floor(time / 3600);
		var minutes = Math.floor(time / 60);
		$('#' + id + ' p span').html(dist + 'm  &bull; ETA: ' + minutes + 'm');
	};

	// Gets the difference in kilometres for the two destinations.
	var latlontokm = function(lat1, lon1, lat2, lon2) {
		var R = 6371;
		var dLat = deg2rad(lat2-lat1);
		var dLon = deg2rad(lon2-lon1); 
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;
		return d * 1000;
	};

	// Converts degrees to radius.
	var deg2rad = function(deg) {
		return deg * (Math.PI/180);
	};

	// Runs the function without geolocation while we are awaiting confirmation
	// for using geolocation.
	var fail = function() {
		start('', '', '');
	};

	// Sets the default values for the latitude, longitude and accuracy variables.
	var lat = '';
	var lon = '';
	var acc = '';

	// Runs a timer while we are waiting for the user to allow geolocation.
	var fail_timeout = setTimeout(function() { fail(); }, 2000);

	// Checks if geolocation is available on this device.
	if (navigator.geolocation) {
		// Uses a geolocation method to get the current position of the device.
		navigator.geolocation.getCurrentPosition(success, error, options);
	} else {
		// Runs the function without geolocation.
		console.dir('Geolocation is not supported by this browser');
		fail();
	}
});