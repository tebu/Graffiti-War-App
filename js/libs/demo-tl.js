jQuery(function(){
	$("#slider").chopSlider({
		/* Slide Element */
		slide : ".slide",
		/* Controlers */
		nextTrigger : "#right",
		prevTrigger : "#left",
		hideTriggers : true,
		sliderPagination : ".slider-pagination",
		/* Captions */
		useCaptions : true,
		everyCaptionIn : ".sl-descr",
		showCaptionIn : "#venue-text",
		captionTransform : " ",
		/* Autoplay */
		autoplay : false,
		autoplayDelay : 6000,
		/* Default Parameters */
		t2D :  csTransitions['half'][3],
/*		t3D : csTransitions['3DBlocks'][0],*/
		/* For Mobile Devices */
		mobile: csTransitions['mobile']['random'],
		/* For Old and IE Browsers */
		noCSS3:csTransitions['noCSS3']['random'],
		onStart: function(){ /* Do Something*/ },
		onEnd: function(){ /* Do Something*/ }
	})

})

