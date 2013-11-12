// Specifies a function to be executed when the DOM is fully loaded.
$(document).ready(function() {
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

			var availability = building.pcs.available + ' / ' + building.pcs.total + ' AVAILABLE';
			var percentage = Math.round(building.pcs.available / building.pcs.total * 100) + '%';

			// Changes the text in the availability paragraph for the building.
			$('#' + building.id + ' > p').html(availability + '<span>' + percentage + '</span>');

		}
	});

});