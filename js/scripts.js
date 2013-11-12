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
				$('#' + building.id + ' p').html('Closed');
			}
		}
	});

});