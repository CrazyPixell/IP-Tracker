'use strict';
const ipField = document.querySelector('.ip-tracker__ip');
const nameField = document.querySelector('.ip-tracker__name');
const locationField = document.querySelector('.ip-tracker__location');
const timezoneField = document.querySelector('.ip-tracker__timezone');
const ispField = document.querySelector('.ip-tracker__isp');

const mapInit = (lat, lng) => {
  let map = document.querySelector('#map');
  if (map != null) {
    map._leaflet_id = null;
  }

  map = L.map('map').setView([lat, lng], 13);

  L.tileLayer(
    'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  )
    .remove()
    .addTo(map);

  const icon = L.icon({
    iconUrl: '../images/icon-location.svg',
    iconSize: [25, 35],
  });

  const popup = L.popup({
    maxWidth: 100,
    maxHeight: 100,
  }).setContent('<p class="popup">It,s here</p>');

  L.marker([lat, lng], { icon: icon }).addTo(map).bindPopup(popup).openPopup();
};

const trackIP = async (searchRequest = 'google.com') => {
  try {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_TuzEWR9bw22YS0ETgnbhK1RQE5Z98&domain=${searchRequest}`
    );

    if (!res.ok) throw new Error('Invalid input. Try again, please');
    const resData = await res.json();

    const data = {
      lat: resData.location.lat,
      lng: resData.location.lng,
      ip: resData.ip,
      name: resData.as.domain,
      location: resData.location.city,
      timezone: resData.location.timezone,
      isp: resData.isp,
    };

    console.log(data);

    ipField.textContent = data.ip;
    nameField.textContent = data.name;
    locationField.textContent = data.location;
    timezoneField.textContent = data.timezone;
    ispField.textContent = data.isp;

    mapInit(data.lat, data.lng);
  } catch (err) {
    console.error(err);
    document.getElementById('map').textContent = err.message;
  }
};

const inputTracker = document.getElementById('ip-tracker-search');

trackIP();
inputTracker.addEventListener('change', e => {
  trackIP(e.target.value);
});
