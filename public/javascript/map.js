mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: Coordinate, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

// console.log(Coordinate);

//  Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(Coordinate) // lat lon of geometry
  .addTo(map);

const popup = new mapboxgl.Popup()
  .setLngLat(Coordinate)
  .setHTML("<p><b>Exact location provided after booking</b></p>")
  .addTo(map);
