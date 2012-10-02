//TODO: Registration + Login





document.addEventListener("deviceready", onDeviceReady, false);


// iosSlider - rotating banner (http://www.iosscripts.com/iosslider/)
$(document).ready(function() {

	$('.iosSlider').iosSlider({
		scrollbar: false,
		snapToChildren: true,
		desktopClickDrag: true,
		scrollbarLocation: 'top',
		scrollbarMargin: '10px 10px 0 10px',
		scrollbarBorderRadius: '0',
		responsiveSlideWidth: true,
		navSlideSelector: $('.iosSliderButtons .button'),
		infiniteSlider: false,
		startAtSlide: '1',
		onSlideChange: slideContentChange,
		onSlideComplete: slideContentComplete,
		onSliderLoaded: slideContentLoaded
	});
	
	function slideContentChange(args) {
		
		/* indicator */
		$(args.sliderObject).parent().find('.iosSliderButtons .button').removeClass('selected');
		$(args.sliderObject).parent().find('.iosSliderButtons .button:eq(' + args.currentSlideNumber + ')').addClass('selected');
		
	}
	
	function slideContentComplete(args) {
		
		/* animation */
		$(args.sliderObject).find('.text1, .text2').attr('style', '');
		
		$(args.currentSlideObject).children('.text1').animate({
			right: '100px',
			opacity: '1'
		}, 400, 'easeOutQuint');
		
		$(args.currentSlideObject).children('.text2').delay(200).animate({
			right: '50px',
			opacity: '1'
		}, 400, 'easeOutQuint');
		
	}
	
	function slideContentLoaded(args) {
		
		/* animation */
		$(args.sliderObject).find('.text1, .text2').attr('style', '');
		
		$(args.currentSlideObject).children('.text1').animate({
			right: '100px',
			opacity: '1'
		}, 400, 'easeOutQuint');
		
		$(args.currentSlideObject).children('.text2').delay(200).animate({
			right: '50px',
			opacity: '1'
		}, 400, 'easeOutQuint');
		
		/* indicator */
		$(args.sliderObject).parent().find('.iosSliderButtons .button').removeClass('selected');
		$(args.sliderObject).parent().find('.iosSliderButtons .button:eq(' + args.currentSlideNumber + ')').addClass('selected');
		
	}
	
});


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

	$('#index').live('touchmove', function(event){
		console.log("You ain't scroll!");
		event.preventDefault();

	});
	$('#spray').live('touchmove', function(event){
		console.log("You ain't scroll!");
		event.preventDefault();
	});

	$('#slider').live("tap", function(){
		$.mobile.changePage("spray.html");
	});
	
	$('#spray').live("pagebeforeshow", function(){
		console.log("PageChange Fired!");
		spray();
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
			$('#slider').append('<div class="slide"> <img src="img/locations/arts_entertainment.png" alt="Arts & Entertainment"  /> </div>');
			break;	
		case 'College & Education':
			$('#slider').append('<div class="slide"> <img src="img/locations/education.png" alt="College & Education" /> </div>');
			break;
		case 'Bar':
			$('#slider').append('<div class="slide"> <img src="img/locations/bar.png" alt="Bar" /> </div>');
			break;
		case 'Food':
			$('#slider').append('<div class="slide"> <img src="img/locations/food.png" alt="Food"  /> </div>');
			break;		
		case 'Shop & Service':
			$('#slider').append('<div class="slide"> <img src="img/locations/shops.png" alt="Shops & Service" /> </div>');
			break;						
		case 'Nightlife Spot':
			$('#slider').append('<div class="slide"> <img src="img/locations/nightlife.png" alt="Nightlife Spot" /> </div>');
			break;		            
		case 'Great Outdoors':
			$('#slider').append('<div class="slide"> <img src="img/outdoors.png" alt="Great Outdoors"  /> </div>');
			break;		            
		case 'Travel & Transport':
			$('#slider').append('<div class="slide"> <img src="img/locations/travel.png" alt="Travel & Transport"  /> </div>');
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
	
	$("p#progress").delay(2000).fadeIn(1000);
	$("p#progress").delay(14000).fadeOut(200);	
	$("p#finished").delay(17000).fadeIn(1000);
	$("#cancel").delay(15000).fadeOut(200);
	$("#proceed").css("display", "none");
	$("#proceed").delay(16000).fadeIn(500);
	$("#spray-burst").css("display", "none");
	$("#spray-burst").delay(4000).fadeIn(10000);
	$("#spray-burst2").css("display", "none");
	$("#spray-burst2").delay(6000).fadeIn(10000);
	$("#spray-can").click(function () {
		  $(this).effect("shake", { times:10 }, 100);
	});
	
	var beepOne = $("#beep-one")[0];
	$("#spray-can")
		.click(function () {
			beepOne.play();
		});
		
	$(document).ready(function() {
		$('.progress .bar').progressbar({
			  transition_delay: 1500,
			  display_text: 1
		});          
	});
}

// Modal box for showing help etc.
$(document).ready(function() {
	$("#tip-trigger").leanModal({ top : 200, overlay : 0.8, closeButton: ".modal_close" });
	$("#tip-trigger2").leanModal({ top : 200, overlay : 0.8, closeButton: ".modal_close" });
});

$(document).ready(function($) {
       $('.accordion dd').hide();
       $('.accordion dt a').click(function(){
          if ($(this).hasClass('selected')) {
               $(this).removeClass('selected');
               $(this).parent().next().slideUp();
          } else {
               $('.accordion dt a').removeClass('selected');
               $(this).addClass('selected');
               $('.accordion dd').slideUp();
               $(this).parent().next().slideDown();
          }
          return false;
       });
});

$(document).ready(function() { 
    // call the tablesorter plugin 
    $("table").tablesorter({ 
        // sort on the first column and third column, order asc 
        sortList: [[0,0]] ,
		 headers: { 1: { sorter: false} }
    }); 
});




/*$(document).ready(function() { 
$("#back")
      .click(function() {
            history.back();
            return false;
      });
});*/

/*var myScroll;
function loaded() {
	myScroll = new iScroll('scroller-wrapper');
}

var myScroll2;
function loaded2() {
	myScroll2 = new iScroll('scroller-wrapper2');
}

$( '#leaderboard-gangs' ).live( 'pagebeforeshow',loaded);

$( '#leaderboard-players' ).live( 'pagebeforeshow',loaded2);*/



$(document).bind("mobileinit", function() {
  $.support.touchOverflow = true;
  $.mobile.touchOverflowEnabled = true;
});



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