//TODO: Registration + Login

document.addEventListener("deviceready", onDeviceReady, false);




var socket;
var protocol = new Protocol();
var user = new User(1234567890, "pippo", "Yellowpants");

//This should work only on the  browser
$(document).ready(function(){
	// Now safe to use the PhoneGap API
		console.log("The device is ready.");
		initializeEvents();
		startWebsocket();
});


//This should work only on the  mobile

function onDeviceReady() {
// Now safe to use the PhoneGap API
	console.log("The device is ready.");
	initializeEvents();
	startWebsocket();
}


/** Interaction events**/

var initializeEvents = function() {


	$('#slider').live("tap", function(){
		spray();
		$.mobile.changePage("spray.html");
	});
	
}




var startWebsocket = function() {
	
	// new socket
	console.log("Attempting to create a websocket...");
	socket = new WebSocket('ws://vm0063.virtues.fi');
	//socket = new WebSocket('ws://echo.websocket.org');
	
	// push a message after the connection is established.
	socket.onopen = function() {
		console.log("Connected to the websocket server");
		var msg = protocol.add(user);
		socket.send(msg);
		getLocation();
	};

	socket.onmessage = function(msg) {
		console.log(JSON.stringify(msg));
	};
	
	socket.onerror = function(err) {
		console.log(err);
	};
	
	
	// alert close event
	socket.onclose = function() {
		var msg = protocol.remove(user);
		socket.send(msg);
	};

	
}



var getLocation = function() {
	console.log("Getting device location...");
	wpid = navigator.geolocation.watchPosition(onGPSSuccess, onGPSError, {enableHighAccuracy: true});
}


var onGPSError = function (err) {
	console.log(err);
}

var onGPSSuccess = function(pos) {

	var localization = new Localization(pos.coords.latitude, pos.coords.longitude);
	console.log("I got the location!: Lat: " + localization.lat+ ", Lon: " +localization.lon);
	
	
	var msg = protocol.move(user, localization);
	socket.send(msg);
	
	getVenues(localization.lat, localization.lon);
}


var getVenues = function(lat, lon) {
	$('.slide-descriptions').empty();
	$('#slider').empty();
	var endpoint = 'https://api.foursquare.com/v2/venues/explore';
	var params = {
		ll:lat+","+lon,
		radius:1000,
		client_id:'GAN1ZFEIKRIN30ZMZ5DTSAVM05SRX0KSMN2DXVUK020NCO2Z',
		client_secret:'3X5OAHHIW4WXNZLZ3GD5BQ1AY2MBITEL3SXOBY3IHXNQ31K4',
		v:'20120705'
	};

	$.getJSON(endpoint, params, function(res){
			var venues = res.response.groups[0].items;
			console.log("I found " +res.response.groups[0].items.length+ " venues");
			getCategories(venues);
	});
}

var addVenue = function (name, category) {
	$('.slide-descriptions').append('<div class="sl-descr">'+name+'</div>');
	switch (category){
		case 'Arts & Entertainment':
			$('#slider').append('<div class="slide"> <img src="img/arts_entertainment.png" alt="Arts & Entertainment"  /> </div>');
			break;	
		case 'College & Education':
			$('#slider').append('<div class="slide"> <img src="img/education.png" alt="College & Education" /> </div>');
			break;
		case 'Bar':
			$('#slider').append('<div class="slide"> <img src="img/bar.png" alt="Bar" /> </div>');
			break;
		case 'Food':
			$('#slider').append('<div class="slide"> <img src="img/food.png" alt="Food"  /> </div>');
			break;		
		case 'Shop & Service':
			$('#slider').append('<div class="slide"> <img src="img/shops.png" alt="Shops & Service" /> </div>');
			break;						
		case 'Nightlife Spot':
			$('#slider').append('<div class="slide"> <img src="img/nightlife.png" alt="Nightlife Spot" /> </div>');
			break;		            
		case 'Great Outdoors':
			$('#slider').append('<div class="slide"> <img src="img/outdoors.png" alt="Great Outdoors"  /> </div>');
			break;		            
		case 'Travel & Transport':
			$('#slider').append('<div class="slide"> <img src="img/travel.png" alt="Travel & Transport"  /> </div>');
			break;	
		default :
			console.log("Category not found for: " + name + " " + category);	
	}

}




var getCategories = function(venues) {
	var categories = '';
	var endpoint = 'https://api.foursquare.com/v2/venues/categories';
	var params = {
		client_id:'GAN1ZFEIKRIN30ZMZ5DTSAVM05SRX0KSMN2DXVUK020NCO2Z',
		client_secret:'3X5OAHHIW4WXNZLZ3GD5BQ1AY2MBITEL3SXOBY3IHXNQ31K4',
		v:'20120705'
	};
	
	$.getJSON(endpoint, params, function(res){
			categories = res.response.categories;
			
			for(v in venues){
				for (cat in categories) {
					for (subcat in categories[cat].categories) {
						//console.log(categories[cat].categories[subcat].name);
						if (categories[cat].categories[subcat].name == venues[v].venue.categories[0].name)
							addVenue(venues[v].venue.name, categories[cat].name );
					}
				}
				
			}
			//$('#slider').children(":first").addClass("cs-activeSlide");
			//$('.slide-descriptions').children(":first").addClass("cs-activeSlide");
			$.chopSlider.slide({slideTo:1});

	
	});
}






/** Spray.html **/



var spray = function() {
	
	var venue = new Venue(12434, "Puistola");
	var msg = protocol.spray(user, venue);
	socket.send(msg);
	
	$("p#tip").delay(5000).fadeIn(500);
	$("p#tip").delay(2000).fadeOut(500);
	$("p#progress").delay(2000).fadeIn(1000);
	$("p#progress").delay(8000).fadeOut(500);	
	$("p#finished").delay(12000).fadeIn(1000);
	
	$("#cancel").delay(9000).fadeOut(200);
	$("#proceed").css("display", "none");
	$("#proceed").delay(13000).fadeIn(500);
	$("#spray-burst").css("display", "none");
	$("#spray-burst").fadeIn(10000);
	$("#spray-burst2").css("display", "none");
	$("#spray-burst2").fadeIn(10000);
		
	
	$("#spray-can").click(function () {
	      $(this).effect("shake", { times:10 }, 100);
	});
	
	var beepOne = $("#beep-one")[0];
	$("#spray-can")
		.click(function () {
			beepOne.play();
		});
}



/** Utilities ***/

function haversine(lon1, lat1, lon2, lat2) {
	var R = 6371; // km
	var dLat = toRad(lat2 - lat1);
	var dLon = toRad(lon2 - lon1);
	var lat1 = toRad(lat1);
	var lat2 = toRad(lat2);

	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d * 1000;
}



function toRad(deg) {
	return deg * Math.PI / 180;
}