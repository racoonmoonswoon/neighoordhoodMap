var map;
var markers = [];
var infoWindow;
var currentMark;

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: {lat: 38.607523, lng: -90.225898},
    zoom: 16,
    streetViewControl: false
  });
}

function mapError(){
  alert("Google Map Error. Failed to Load");
}

function geocodeAddress(address, i){
  var geocoder = new google.maps.Geocoder();
  var resultlat = null;
  var resultlng = null;
  geocoder.geocode({address: address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      resultlat = results[0].geometry.location.lat();
      resultlng = results[0].geometry.location.lng();
      //send coordinates to our places array
      setCoord(resultlat, resultlng, i);

      //create a marker
      createMarker(i);

    } else {
      alert('Geocode was not successful: ' + status);
    }
  });
}

function createMarker(id){
  //create a marker and push to markers array
  var marker = new google.maps.Marker({
    map: map,
    position: places[id].latlong,
    title: places[id].name,
    animation: google.maps.Animation.DROP,
    id: id
  });

  markers.push(marker);

  //add an infoWindow to the marker
  infoWindow = new google.maps.InfoWindow();

  //event listener for closing infowindow
  infoWindow.addListener('closeclick', function(){
    viewModel.placeList().forEach(function(place){
      if(currentMark.id === place.id){
         place.visible(false);
      }
    });
  });

  //event listener for marker click
  marker.addListener('click', function(){
    currentMark = this;

    viewModel.placeList().forEach(function(place){
      if(currentMark.id === place.id){
        viewModel.showInfo(place);
      }
    });
  });
}


function fillWindow(marker, window) {
  if (window.marker != marker) {
    window.marker = marker;
  }
  window.setContent('<div class="markerTitle">' + marker.title + '</div><br><div id="pano"></div>');
  window.open(map, marker);
}


function toggleBounce(marker){
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function(){ marker.setAnimation(null); }, 750);

}

function showPano(position){

  var panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: position,
        pov: {
          heading: 34,
          pitch: 10
        }
      });
  map.setStreetView(panorama);
}
