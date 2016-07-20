
var state = {
  countries: []
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
  dropdown.onchange= function(){
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
    showSelected(newIndex);
    persitCountries(newIndex);
    borderingCountries = borderCountries(newIndex);
    displayBorders(borderingCountries);
  }
}



var showSelected = function(countryIndex) {
  var displaybox = document.getElementById('display-box');
  displaybox.innerHTML= " "
  var country = state.countries[countryIndex]
  var div = document.createElement( 'div' );
  var p = document.createElement( 'p' );
  p.innerHTML = country.name + ": Population: " + country.population + ", Capital City: " + country.capital;
  div.appendChild(p);
  displaybox.appendChild(div);
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








