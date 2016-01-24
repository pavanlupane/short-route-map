/****** JavaScript Code for couchDB data fetch (optional)******/
//    var cityData = httpGet("http://localhost:5984/travelcities/_design/citiesView/_view/citiesView");
//    console.log(cityData);
//    function httpGet(Url)
//        {
//            var xmlHttp = new XMLHttpRequest();
//            xmlHttp.open( "GET", Url, false ); // false for synchronous request
//            xmlHttp.send( null );
//            return xmlHttp.responseText;
//        }

/****** jQuery Code for couchDB data fetch******/
var statesArray = new Array();
var cityData;
var placesArray;

$(document).ready(function() {
    //$.get("http://localhost:5984/travelcities/_design/citiesView/_view/citiesView#",function(data)
    $.get("http://127.0.0.1:5984/travelcities/_design/citiesLatLngView/_view/citiesLatLngView",function(data){
       console.log("jQuery Response::"+data);      // Database data received in cityData

        
        cityData = jQuery.parseJSON( data );
        //console.log("jQuery Response::"+cityData);
        //console.log("Content ::" +cityData.rows[0].value);
        
        for (var i=0; i<cityData.total_rows; i++) {
            statesArray[i] = cityData.rows[i].key;
        }
       console.log(statesArray);            // City array loaded here
    });
    
    $("#cityname").keyup(function() {
       searchSuggest();
    });
    
    $("#Search").click(function() {
        //**** On Search code ****//
        var dbStr = $("#cityname").val();
        dbStr = dbStr.replace(/\s/g, '');
        dbStr+="Places";
        console.log(dbStr);
        $.get("http://localhost:5984/travelcities/_design/"+dbStr+"/_view/"+dbStr,function(data){
           console.log("jQuery Response::"+data);      // Database data received in cityData

            //Parse the data
            var cityPlacesData = jQuery.parseJSON( data );
            console.log("jQuery Response::"+cityPlacesData.rows[0].value);
            //fetch places array object
            for(key in cityPlacesData.rows[0].value){
                placesArray = cityPlacesData.rows[0].value[key];
            }
            //Create an array of place name :: Place key
            for (key in placesArray){
                //console.log(placesArray[key]);
                getPlacesInfo(placesArray[key]);
            }
            //getPlacesInfo("ChIJlaOcbiG_woARZMl0UJaNYAc");
        }); 
    });
});
function setDivInfo(place){
    console.log(place);
    $("#formBreak").append('<div class="placesDiv id=\"'+place.name+'\">'
                           +'<span class="placename">'+place.name+'</span>'
                           +'<span class="type">'+place.types[0]+'</span>'
                           +'<span class="number">Contact Number: '+place.international_phone_number+'</span>'
                           +'<span class="website">Website: <a href="'+place.website+'" target="_new" ">'+place.website+'</a></span>'
                           +'<span class="url"><a href="'+place.url+'" target="_new"">Google Maps Url</a></span>'
                           +'<span class="rating">Contact Number: '+place.rating+'</span>'
                           +'<button class="addButton">Add</button></div>');
}
function getPlacesInfo(myPlaceId){
    //console.log("Key is :: "+myPlaceId);
    var request = {
      placeId: myPlaceId
    };

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback);
    
    function callback(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        //console.log(place.geometry.location.lat());
        //console.log(place.geometry.location.lng());
        setDivInfo(place);
      }
    }
}

function myMaps(myPlaceId,lats,lngs){
    
        initMap();
      function initMap() {
        console.log("Inside the init map!");
        var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: lats, lng: lngs},
        zoom: 15
      });

      var infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);

      service.getDetails({
        placeId: myPlaceId
      }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
          });
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
              'Place ID: ' + place.place_id + '<br>' +
              place.formatted_address + '</div>');
            infowindow.open(map, this);
          });
        }
      });
}
    
    
}
function searchSuggest() {
    //console.log(statesArray);
	var str = document.getElementById("cityname").value;
	if (str != "") {
        $("#popups").show();
		document.getElementById("popups").innerHTML = "";
	
		for (var i=0; i<statesArray.length; i++) {
			var thisState = statesArray[i].nodeValue;
	
			if (statesArray[i].toLowerCase().indexOf(str.toLowerCase()) == 0) {
				var tempDiv = document.createElement("div");
				tempDiv.innerHTML = statesArray[i];
				tempDiv.onclick = makeChoice;
				tempDiv.className = "suggestions";
				document.getElementById("popups").appendChild(tempDiv);
			}
		}
		var foundCt = document.getElementById("popups").childNodes.length;
		//if (foundCt == 0) {
			//document.getElementById("cityname").className = "error";
		//}
		/*if (foundCt == 1) {
			document.getElementById("cityname").value = document.getElementById("popups").firstChild.innerHTML;
			document.getElementById("popups").innerHTML = "";
		}*/
	}
    
    /*********hides popups div on null entry************/
    if (str == "") {
        $("#popups").hide();
    }
}

function makeChoice(evt) {
	var thisDiv = (evt) ? evt.target : window.event.srcElement;
	document.getElementById("cityname").value = thisDiv.innerHTML;
	 $("#popups").hide();
}


