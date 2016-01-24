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
var statesArray = [];
var cityData;
var placesArray;

$(document).ready(function() {

    //$.get("http://localhost:5984/travelcities/_design/citiesView/_view/citiesView#",function(data)
    $.get("http://127.0.0.1:5984/travelcities/_design/citiesLatLngView/_view/citiesLatLngView", function (data) {
       console.log("jQuery Response::" + data);      // Database data received in cityData

        
        cityData = jQuery.parseJSON( data );
        //console.log("jQuery Response::"+cityData);
        //console.log("Content ::" +cityData.rows[0].value);
        
        for (var i=0; i<cityData.total_rows; i++) {
            statesArray[i] = cityData.rows[i].key;
        }
       console.log(statesArray);            // City array loaded here
    } );
    
    $("#cityname").keyup(function() {
       searchSuggest();
    });
    
    $("#Search").click(function() {
    document.getElementById('formBreak').innerHTML="";

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

 function extractDomain(url) {
            var domain;
            if (typeof url ==='undefined'){
                return;
            }
                
            //find & remove protocol (http, ftp, etc.) and get domain
            if (url.indexOf("://") > -1) {
                domain = url.split('/')[2];
            }
            else {
                domain = url.split('/')[0];
            }

            //find & remove port number
            domain = domain.split(':')[0];

            return domain;
 }
       

function setDivInfo(place){
var img;
    //console.log(place);
   if(typeof place.photos!=='undefined'){
       console.log(place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200}));
       //img=document.createElement('<span class="images"><img src="'+place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200})+'"></span><br/>');
       img=place.photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200});
   }
    //console.log(data);  
    //});
    //if(place.photos[0].html_attributions){
    //console.log(place.photos[0].html_attributions[0]);}
    $("#formBreak").append('<div class="placesDiv" id=\"'+place.name+'\">'
                           +'<img src='+img+' alt="blahblhab">'
                           +'<span class="placename">'+place.name+'</span><br/>'
                           //+img
                           +'<span class="type">'+(place.types[0]).replace(/_/g," ")+'</span><br/>'
                           +'<span class="number">Contact Number: '+place.international_phone_number+'</span><br/>'
                           +'<span class="website">Website: <a href="'+place.website+'" target="_new" ">'+extractDomain(place.website)+'</a></span><br/>'
                           +'<span class="url">Google Maps: <a href="'+place.url+'" target="_new""><i class="glyphicon glyphicon-link"></i></a></span><br/>' 
                           +'<span class="rating">Rating: '+place.rating+' </span>'
                           +'<button class="addButton btn btn-primary">Add</button></div>');
    
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


