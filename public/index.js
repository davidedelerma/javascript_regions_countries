var Map = function( latLng, zoom ){

  this.googleMap = new google.maps.Map(document.getElementById( 'map' ),{
      center: latLng,
      zoom: zoom
  })

  this.addMarker = function(latLng,title) {
    var marker = new google.maps.Marker({
      position: latLng,
      map: this.googleMap,
      title: title
    })
    return marker
  }

  this.addInfoWindow = function(latLng,title){
    var marker=this.addMarker( latLng,title )
    marker.addListener('click',function(){
       var infoWindow = new google.maps.InfoWindow({
        content: this.title
       })
       infoWindow.open(this.map, marker)
    })
  }

}

var GeoLocator = function(){
  //this.map = map;

  this.getCoord = function(){
    navigator.geolocation.getCurrentPosition(function(position){
      pos = {lat: position.coords.latitude, lng: position.coords.longitude};
      getMyCountry(pos);
      var map = new Map(pos,5);
      var marker = new google.maps.Marker({
        position: pos,
        map: map.googleMap
      })
    }.bind(this))
  }
}

var state = {
  countries: []
}

function getMyCountry(pos){

     //extract long and lat
     var lat = pos.lat;
     var lng = pos.lng;
     //concatanate corrent url with long and lat 
     url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=true'
     //start a new request
     var request = new XMLHttpRequest();
     request.open("GET", url);
     request.onload = function(){
       if(request.status === 200) {
         var jsonString = request.responseText;
         var locationObject = JSON.parse(jsonString)
         //create function to filter through address_components to be mroe dynamic...
         var currentCountry = locationObject.results[0].address_components[5].long_name;
         console.log("COUNTRY: ", currentCountry)
         var currCountryBox = document.getElementById('current-country');
         currCountryBox.innerHTML= " "
         var p = document.createElement( 'p' );
         p.innerHTML = "You are in: "+currentCountry;
         currCountryBox.appendChild(p);
       }
     }
     //send request
     request.send( null );
}

window.onload = function(){
  takeCountries();
}

function takeCountries(){

  var url = 'https://restcountries.eu/rest/v1';
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = function(){
    if(request.status === 200){
      var jsonStrin = request.responseText;
      var countries = JSON.parse(jsonStrin);
      state.countries = countries;
      main();
    }
  }
  request.send(null);
}

function main(){
// //CREATE DROPDOWN MENU
//   var dropdown = document.createElement('select');
//   for ( country of countries ) {
//     var option = document.createElement( 'option' );
//     option.value = country.name;
//     option.innerHTML = country.name;
//     dropdown.appendChild( option );
//   }
//   var countryList = document.getElementById('country-list');
//   countryList.appendChild(dropdown);

//CONTESTUAL DROPDOWN

  regionList(state.countries)
  var dropdown = document.createElement('select');
  for (region of regions){
    var optgroup = document.createElement( 'optgroup' );
    optgroup.label = region
    for ( country of state.countries ) {
      if (country.region === region){
        var option = document.createElement( 'option' );
        option.value = country.name;
        option.innerHTML = country.name;
        optgroup.appendChild( option );
      }
    }
    dropdown.appendChild( optgroup );
  }  
  var countryList = document.getElementById('country-list');
  countryList.appendChild(dropdown);

// take selected item and show + show border countries
  dropdown.onchange = function(){
    //find selected item in contestual dropdown
    selectedIndex = dropdown.selectedIndex;
    selectedElement = dropdown.options[selectedIndex].value;
    i=0;
    for (country of state.countries){
      i++
      if(country.name === selectedElement){
        break
      }
    }
    newIndex = i-1;
    //
    //to find item in dropdown menu:
    //selectedItem = dropdown.selectedIndex;
    //
    var center = showSelected(newIndex);
    var map = new Map(center,5);
    string = '<h3>'+state.countries[newIndex].name+'</h3>'+'<p>'+ 'population: '+state.countries[newIndex].population+'</p>'+'<p>'+ 'Capital City:' +state.countries[newIndex].capital+'</p>'
    map.addInfoWindow(center, string);
    persitCountries(newIndex);
    borderingCountries = borderCountries(newIndex);
    displayBorders(borderingCountries);
  }

  var geo = new GeoLocator();
  var button = document.getElementById('get-my-location');
  button.onclick = geo.getCoord;
}



var showSelected = function(countryIndex) {
  var displaybox = document.getElementById('display-box');
  displaybox.innerHTML= " "
  var country = state.countries[countryIndex]
  var center = {lat: country.latlng[0], lng: country.latlng[1]}
  var div = document.createElement( 'div' );
  var p = document.createElement( 'p' );
  p.innerHTML = country.name + ": Population: " + country.population + ", Capital City: " + country.capital;
  div.appendChild(p);
  displaybox.appendChild(div);
  return center;
}

var persitCountries = function(countryIndex){
  var country = state.countries[countryIndex];
  localStorage.setItem('countries_list', JSON.stringify(country));
}

var borderCountries = function(countryIndex){
  var borderingCountries = [];
  var country = state.countries[countryIndex];
  borders = country.borders;  
  if (borders.length>0){
    for (border of borders){
      for (count of state.countries){
        if(border === count.alpha3Code){
          borderingCountries.push(count)
        }
      }
    }
  }
  return borderingCountries;
}

var displayBorders = function(borderingCountries){
  var dispBord = document.getElementById('borders-box');
  dispBord.innerHTML = " "
  for (country of borderingCountries){
    var border = document.createElement( 'p' );
    border.innerHTML = country.name + ": Population: " + country.population + ", Capital City: " + country.capital;
    dispBord.appendChild(border);
  }
}
// CreateSubGroup element;
function regionList(countries){
  regions=[];
  for (country of countries){
    if(!(regions.indexOf(country.region)>=0)){
      regions.push(country.region)
    }
  }
  return regions;
}








