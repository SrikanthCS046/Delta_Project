     mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
        container : 'map', // container ID
        style:'mapbox://styles/mapbox/standard-satellite',
        center:coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    // to add default Marker in a Map
console.log(coordinates);
const marker = new mapboxgl.Marker({color:"red"})
  .setLngLat(coordinates) 
  .setPopup(new mapboxgl.Popup({offset:25})
  .setHTML(`<h5>${listingTitle}</h5><p>Exact Location provided after Booking</p>`))// [longitude, latitude]
  .addTo(map);

//   const popUp=new mapboxgl.Popup({
//     offset:popupOffsets,className:"my-class"
//   })
//   .setLngLat(coordinates)
//   .setHTML("<h1>Exact Location</h1>")
//   .setMaxWidth("200px")
//   .addTo(map);