$(document).ready(function() {
  const amenityIds = {};

  $('input[type="checkbox"]').change(function() {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');

    if (this.checked) {
      amenityIds[amenityId] = amenityName;
    } else {
      delete amenityIds[amenityId];
    }

    const amenityList = Object.values(amenityIds).join(', ');
    $('#api_amenities').text(amenityList);
  });

  // Check the status of the API
  $.get('http://0.0.0.0:5001/api/v1/status/', function(data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // Request http://0.0.0.0:5001/api/v1/places_search/
  // Description of this endpoint here. If this endpoint is not available, you will have to add it to the API (you can work all together for creating this endpoint)
  // Send a POST request with Content-Type: application/json and an empty dictionary in the body - cURL version: curl "http://0.0.0.0:5001/api/v1/places_search" -XPOST -H "Content-Type: application/json" -d '{}'
  // Loop into the result of the request and create an article tag representing a Place in the section.places. (you can remove the Owner tag in the place description)
  // The final result must be the same as previously, but now, places are loaded from the front-end, not from the back-end!

  $.post('http://0.0.0.0:5001/api/v1/places_search/', {}, function(data) {
    if (data.status === 200) {
      const places = data.places;
      for (const place of places) {
        const article = `
          <article>
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">${place.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${place.max_guest} Guest${place.max_guest != 1 ? 's' : ''}</div>
              <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms != 1 ? 's' : ''}</div>
              <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms != 1 ? 's' : ''}</div>
            </div>
            <div class="user">
              <b>Owner:</b> ${place.user.first_name} ${place.user.last_name}
            </div>
            <div class="description">
              ${place.description}
            </div>
          </article>
        `;
        $('#places').append(article);
      }
    } else {
      console.log('Error:', data.message);
    }
  });
});
