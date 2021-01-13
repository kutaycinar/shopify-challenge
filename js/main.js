var nominations = [];

$(document).ready(function() {

	// Search on document ready
	search_results();

	// Live search using a 250 milisecond throttle
	$("#search").on("keyup", _.debounce(function(e) {
		search_results();
	}, 250));

	// OMDB API Search Function
	function search_results() {

		// Get entered name from search box
		var search = $('#search').val();

		// AJAX call to get movies
		$.ajax({
			url: "http://www.omdbapi.com/?apikey=504a7614",
			data: {
				"s": search
			},
			type: 'GET',
			success: function(res) {

				// Empty movies
				$('#suggestion-list').html("");

				// Populate movies (1-10)
				var name, year, btn, id;
				for (var movie in res.Search) {
					name = res.Search[movie].Title.substring(0, 40);
					if (res.Search[movie].Title.length > 40)
						name = name.concat('...&nbsp');
					else
						name = name.concat('&nbsp');
					year = res.Search[movie].Year;
					id = res.Search[movie].imdbID;
					btn = '<button id="n_' + id + '"data-datan="' + name + ' <i>(' + year + ')</i>" type="button" class="btn btn-success btn-sm nominate">nominate</button>';

					// Append to suggestion list
					$('#suggestion-list').append('<li>' + name + '<i>(' + year + ')</i>' + btn + '</li>');

					// Disable nominate button if already nominated
					if (nominations.includes(id)) {
						$("#n_" + id).attr('disabled', true);
					}
				}
			}
		});
	}
});

// Nominate button function
$(document).on('click', '.nominate', function() {

	// Limit 5 nominations
	if (nominations.length < 5) {

		// Movie variables
		var name = $(this).data('datan');
		var id = this.id.substring(2);
		var btn = '<button id="r_' + id + '" type="button" class="btn btn-danger btn-sm remove">remove</button>';

		// Add movie to nominations
		nominations.push(id);

		// Disable nominate button
		$(this).attr('disabled', true);

		// Add to nomination list
		$('#nomination-list').append('<li>' + name + btn + '</li>');

	} else {
		alert("You can only add up to 5 nominations.");
	}
});

// Remove button function
$(document).on('click', '.remove', function() {

	var id = this.id.substring(2);

	// Delete movie from nominations
	nominations = _.without(nominations, id)

	// Enable nominate button if movie is displayed
	$("#n_" + id).removeAttr("disabled");

	// Delete list item
	$(this).closest('li').remove();
});