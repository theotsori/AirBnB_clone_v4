$(document).ready(function () {
  const amenityIds = {};

  $('input[type="checkbox"]').change(function () {
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
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // Handle the search button click event
  $('#search_button').click(function () {
    const requestData = {
      amenities: Object.keys(amenityIds)
    };

    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify(requestData),
      success: function (data) {
        if (data.status === 200) {
          const places = data.places;
          $('#places').empty();
          for (const place of places) {
            const article = `
              <article>
                <div class="title_box">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">${place.price_by_night}</div>
                </div>
                <div class="information">
                  <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                  <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                  <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
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
      }
    });
  });
});
