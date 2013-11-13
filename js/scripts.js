// Specifies a function to be executed when the DOM is fully loaded.
$(document).ready(function() {

	// Main function to run.
	var main = function(lat, lon) {
		// Loads the JSON-encoded data from the server using a GET HTTP request.
		$.getJSON('data.php', function(data) {
			// Creates an object variable with all the data from the array, including
			// the geographic coordinates that specify the building.
			var ul = {
				name: 'Library',
				id: 'ul',
				status: data.Library.status,
				pcs: {
					available: data.Library.available,
					total: data.Library.total
				},
				coords: {
					lat: 50.792470,
					lon: -1.098845
				}
			};

			// Creates an object variable with all the data from the array, including
			// the geographic coordinates that specify the building.
			var pk = {
				name: 'Park',
				id: 'pk',
				status: data.Park.status,
				pcs: {
					available: data.Park.available,
					total: data.Park.total
				},
				coords: {
					lat: 50.797570,
					lon: -1.094108
				}
			};

			// Creates an object variable with all the data from the array, including
			// the geographic coordinates that specify the building.
			var po = {
				name: 'Portland',
				id: 'po',
				status: data.Portland.status,
				pcs: {
					available: data.Portland.available,
					total: data.Portland.total
				},
				coords: {
					lat: 50.798454,
					lon: -1.099490
				}
			};

			// Creates an object variable with all the data from the array, including
			// the geographic coordinates that specify the building.
			var ag = {
				name: 'Anglesea',
				id: 'ag',
				status: data.Anglesea.status,
				pcs: {
					available: data.Anglesea.available,
					total: data.Anglesea.total
				},
				coords: {
					lat: 50.797709,
					lon: -1.096582
				}
			};

			// Creates an array variable with all the data from all the objects.
			var buildings = [ul, pk, po, ag];

			// Loops through all the buildings in the array.
			for (var i = 0; i < buildings.length; i++) {
				// Creates a local variable for the current building.
				var building = buildings[i];
				
				// Gets the availability of the PCs available in the building.
				var availability = building.pcs.available + ' / ' + building.pcs.total + ' Available';

				if (building.status === 2) {
					// Gets the percentage of available PCS in the building.
					var percentage = (building.pcs.available / building.pcs.total) * 100
					// Tidies up the percentage and adds a percentage symbol.
					var percentagePretty = Math.floor(percentage) + '%';

					// Changes the text in the availability paragraph for the building.
					$('#' + building.id + ' p').html(availability + '<span>' + percentagePretty + '</span>');

					// Creates an HSL colour so as to keep the tone and just change the hue.
					var colour = 'hsl(' + percentage + ', 60%, 60%)';

					// Sets the width of the percentage bar to the percentage of available PCs.
					$('#' + building.id + ' .percent').css('width', percentagePretty);
					// Sets the colour of the percentage bar to the HSL colour.
					$('#' + building.id + ' .percent').css('background', colour);
				} else {
					// Resets the width of the percentage bar to the percentage of available PCs.
					$('#' + building.id + ' .percent').css('width', '0');

					// Changes the text in the availability paragraph for the building.
					$('#' + building.id + ' p').html('Closed');
				}

				// Checks that the latitude and longitude are not empty.
				if (lat != '' && lon != '') {
					// Runs the function to get the distance in kilometres.
					geo(building.id, building);
				}
			}

			// Checks that the latitude and longitude are not empty.
			if (lat != '' && lon != '') {
				// Sets the first building in the array as the closest by default.
				var closest_building = buildings[0];

				// Loops through all the buildings.
				for (var j = 0; j < buildings.length; j++) {
					// Sets the current building in a variable.
					var building = buildings[j];

					// Checks if the building is open and if it's closer to
					// the user's location that the current closest building.
					if (building.status == 2 && building.distance < closest_building.distance) {
						// Sets the current building as the new closest building.
						closest_building = building;
					}
				}

				// Removes any existing inline elements in the heading of all buildings.
				$('h1 span').remove();

				// Checks if an inline element inside the heading of the building exists.
				if ($('#' + closest_building.id + ' h1 span').length !== 0) {
					// Changes the text in the inline element accordingly.
					$('#' + closest_building.id + ' h1 span').html('(Closest)');
				} else {
					// Creates an inline element with the according text.
					$('#' + closest_building.id + ' h1').append('<span>(Closest)</span>');
				}
			}
		});
	};

	// Runs the main function once geolocation variables are received.
	var start = function(lat, lon) {
		// Runs the function for a first time with the geolocation variables.
		main(lat, lon);

		// Runs the function again every 5 seconds.
		setInterval(function() {
			main(lat, lon);
		}, 5000);
	};

	// Sets the PositionOptions to be used to get the user's current location.
	var options = {
		enableHighAccuracy: true,
		maximumAge: 0
	};
	
	// Callback function that takes a Position object as its sole input parameter.
	var success = function(pos) {
		// Creates a variable that gets the coordinates from the input parameter.
		var current = pos.coords;

		// Passes the coordinates to the variables created earlier.
		lat = current.latitude;
		lon = current.longitude;

		// Runs the start function with the geolocation variables received.
		start(lat, lon);
	};

	// Callback that takes a PositionError object as its sole input parameter.
	var error = function(err) {
		// Prints out a warning if something goes wrong.
		console.warn('ERROR(' + err.code + '): ' + err.message);

		// Runs the start function with no geolocation.
		start('', '');
	};

	// Gets the distance in kilometres and returns it on the building availability.
	var geo = function(id, building) {
		building.distance = latlontokm(lat, lon, building.coords.lat, building.coords.lon);
		$('#' + id + ' p span').append(' &bull; ' + building.distance.toString().substring(0, 4) + 'km');	
	};

	// Gets the difference in kilometres for the two destinations.
	var latlontokm = function(lat1, lon1, lat2, lon2) {
		var R = 6371;
		var dLat = deg2rad(lat2-lat1);
		var dLon = deg2rad(lon2-lon1); 
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;
		return d;
	};

	// Converts degrees to radius.
	var deg2rad = function(deg) {
		return deg * (Math.PI/180);
	};

	// Runs the main function without geolocation.
	main('', '');

	// Sets the default values for the latitude and longitude variables.
	var lat = '';
	var lon = '';

	// Uses a geolocation method to get the current position of the device.
	navigator.geolocation.getCurrentPosition(success, error, options);
});