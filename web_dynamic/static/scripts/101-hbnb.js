$(document).ready(function () {
  const amenityIds = {};
  const stateIds = {};
  const cityIds = {};

  $('input[type="checkbox"]').change(function () {
    const amenityId = $(this).attr('data-id');
    const amenityName = $(this).attr('data-name');
    const stateId = $(this).attr('data-state-id');
    const cityId = $(this).attr('data-city-id');

    if (this.checked) {
      amenityIds[amenityId] = amenityName;
      stateIds[stateId] = stateId;
      cityIds[cityId] = cityId;
    } else {
      delete amenityIds[amenityId];
      delete stateIds[stateId];
      delete cityIds[cityId];
    }

    const amenityList = Object.values(amenityIds).join(', ');
    const stateList = Object.values(stateIds).join(', ');
    const cityList = Object.values(cityIds).join(', ');
    $('#api_amenities').text(amenityList);
    $('#api_states').text(stateList);
    $('#api_cities').text(cityList);
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
      amenities: Object.keys(amenityIds),
      states: Object.keys(stateIds),
      cities: Object.keys(cityIds)
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
                <div class="reviews">
                  <h3>Reviews</h3>
                  <span class="toggle-reviews">show</span>
                  <ul class="review-list"></ul>
                </div>
              </article>
            `;
            $('#places').append(article);
          }

          // Handle the toggle reviews button click event
          $('.toggle-reviews').click(function () {
            const $reviewList = $(this).siblings('.review-list');
            const placeId = $(this).closest('article').attr('data-id');
            if ($reviewList.is(':visible')) {
              // If reviews are visible, hide them and change the text to "Show Reviews"
              $reviewList.hide();
              $(this).text('Show Reviews');
            } else {
              // If reviews are hidden, fetch and display them and change the text to "Hide Reviews"
              $.ajax({
                type: 'GET',
                url: `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`,
                success: function (data) {
                  const reviews = data.reviews;
                  $reviewList.empty();
                  for (const review of reviews) {
                    const $review = $('<li></li>').text(review.text);
                    $reviewList.append($review);
                  }
                  $reviewList.show();
                  $(this).text('Hide Reviews');
                }.bind(this),
                error: function () {
                  console.log('Error fetching reviews');
                }
              });
            }
          });
        }
      }
    });
  });
});
