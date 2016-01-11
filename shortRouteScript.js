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
        $.get("http://127.0.0.1:5984/travelcities/_design/"+dbStr+"/_view/"+dbStr,function(data){
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
                $("#formBreak").append('<div class="placesDiv id=\"'+key+'\"><span>'+placesArray[key]+'</span></div>');
            }

        }); 
    });
});

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


