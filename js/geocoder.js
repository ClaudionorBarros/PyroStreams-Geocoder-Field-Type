var geocoder, map, marker, field_slug;

function initialize(form_slug) {
  field_slug = form_slug;
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(40, -100);
	var mapOptions = {
		zoom: 3,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById(field_slug+'_map'), mapOptions);
}

function mapLocation() {
	var address = $('#'+field_slug+'_input').val();
	if (!address) {
		return;
	}

	geocoder.geocode({ 'address': address }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (marker) {
				marker.setMap(null);
			}

			loc = results[0].geometry.location;
			$('#'+field_slug).val(loc.toUrlValue());
			$('#'+field_slug+'_msg').removeClass('msg_error').text('');
			map.setCenter(loc);
			map.setZoom(9);
			marker = new google.maps.Marker({
				map: map,
				title: address,
				position: loc
			});
		} else {
		  $('#'+field_slug+'_msg').addClass('msg_error').text('Obtaining location failed: '+status);
		}
	});
}

$(document).ready(function() {
	initialize();
	$('#{$data['form_slug']}_input')
		.data('timeout', null)
		.keyup(function() {
			clearTimeout($(this).data('timeout'));
			$(this).data('timeout', setTimeout(mapLocation, 600));
		});
});

