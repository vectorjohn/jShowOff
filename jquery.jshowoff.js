/*

Title:		jShowOff: a jQuery Content Rotator Plugin
Author:		Erik Kallevig
Version:	0.1.0
Website:	http://ekallevig.com/jshowoff
License: 	Dual licensed under the MIT and GPL licenses.

jShowOff Options

speed : 		time each slide is shown [integer, milliseconds]
changeSpeed : 	speed of transition [integer, milliseconds]
controls : 		whether to create & display controls (Previous, Next, Play/Pause) [boolean, defaults to true]
links : 		whether to create & display numeric links to each slide [boolean, defaults to true]
autoPlay : 		whether to start playing immediately [boolean, defaults to true]

*/

(function($) {


	$.fn.jshowoff = function(settings) {

		// default variable values
		var config = {
			speed : 3000,
			changeSpeed : 600,
			controls : true,
			links : true,
			autoPlay : true
		};
	
		// merge default variables with custom variables, modifying 'config'
		if (settings) $.extend(config, settings);
		
		// create slideshow for each matching element invoked by jshowoff()
		this.each(function() {
			
			var cont = this;
			var gallery = $(this).children('div').remove();
			var timer = '';
			var counter = 0;
			var preloaded = [];

			function start() {
				$(cont).append('<div id="jshowoff"></div>');
				$(gallery[0]).clone().appendTo('#jshowoff');
				preload();
				if(config.controls){ addControls(); if(config.autoPlay==false){ $('#jshowoff-play').addClass('jshowoff-paused').text('Play'); } }
				if(config.links){ addLinks(); $('#jshowoff-slidelinks a').eq(0).addClass('jshowoff-active'); }
				$('<div id="jshowoff-cache"></div>').appendTo(cont);
				$(gallery).each(function(){$(this).appendTo($('#jshowoff-cache')).hide();});
				if(config.autoPlay && gallery.length>1) { timer = setTimeout( function(){play();}, config.speed ); };
				if(gallery.length<1){ $('#jshowoff').append('<p>For jShowOff to work, add child &lt;div&gt;\'s to &lt;div id="'+cont.id+'"&gt;</p>'); }
			};
			
			function transitionTo(gallery,index) {
				if((counter >= gallery.length) || (index >= gallery.length)) { counter = 0; }
				else if((counter < 0) || (index < 0)) { counter = gallery.length-1; }
				else { counter = index; }
				$(gallery[counter]).clone().appendTo('#jshowoff').hide().fadeIn(config.changeSpeed);
				if($('#jshowoff div').length>1){$('#jshowoff div:first').css('position','absolute').fadeOut(config.changeSpeed,function(){$(this).remove();}); };
				if(config.links){ $('#jshowoff-slidelinks a.jshowoff-active').removeClass('jshowoff-active'); $('#jshowoff-slidelinks a').eq(counter).addClass('jshowoff-active'); }
			};
			
			function addControls() {
				$(cont).append('<p id="jshowoff-controls"><a id="jshowoff-prev" href="#null">Previous</a> <a id="jshowoff-next" href="#null">Next</a> <a id="jshowoff-play" href="#null">Pause</a></p>');
				$('#jshowoff-controls a').each(function(){
					switch(this.id){
						case 'jshowoff-play' : $(this).click(function(){ updatePlayPause(); return false; } ); break;
						case 'jshowoff-prev' : $(this).click(function(){ previous(); return false; }); break;
						case 'jshowoff-next' : $(this).click(function(){ next(); return false; }); break;
					}
				});
			};

			function updatePlayPause() {
				if(isPlaying()){ pause(); $('#jshowoff-play').text('Play').toggleClass('jshowoff-paused'); }
				else { play(); $('#jshowoff-play').text('Pause').toggleClass('jshowoff-paused'); };
			};
			
			function isPlaying(){
				if($('#jshowoff-play').hasClass('jshowoff-paused')){ return false; }
				else { return true; };
			};
		
			function play() {
				if(!isBusy()){
					counter++;
					transitionTo(gallery,counter);
					clearTimeout(timer);
					timer = setTimeout(function(){ play(gallery); },config.speed);
				}
			};
		
			function pause() {
				clearTimeout(timer);
				$('<p id="jshowoff-pausetext">Pause</p>').css({ fontSize:'12px', color:'#fff', textAlign:'center', position:'absolute', top:'35%', lineHeight:'100%', width:'100%' }).appendTo('#jshowoff').animate({ fontSize:'85px', top:'25%', opacity:0 }, {duration:300,complete:function(){$(this).remove();}});
			};
			
			function stopit() {
				clearTimeout(timer);
			};
		
			function next() {
				goToAndPause(counter+1);
			};
		
			function previous() {
				goToAndPause(counter-1);
			};
			
			function isBusy() {
				return $('#jshowoff div').length>1 ? true : false;
			};
		
			function goToAndPause(index) {
				$('#jshowoff div').stop(true);
				stopit();
				$('#jshowoff-play').text('Play').addClass('jshowoff-paused');
				if((counter != index) || ((counter == index) && isBusy())){
					if(isBusy()) $('#jshowoff div:first').remove();
					transitionTo(gallery,index);
				}
			};
			
			function addLinks() {
				$(cont).append('<p id="jshowoff-slidelinks"></p>');
				$.each(gallery, function(i, val) {
					$('<a class="jshowoff-slidelink-'+i+'" href="#null">'+(i+1)+'</a>').bind('click', {index:i}, function(e){ goToAndPause(e.data.index); return false; }).appendTo('#jshowoff-slidelinks');
				});
			};			

			function preload() {
				$(gallery).each(function(i){
					$(this).find('img').each(function(i){
						preloaded[i] = $('<img>').attr('src',$(this).attr('src'));					
					});
				});
			};
			
			start();	
	
	
	
		// end .each
		});
	
		return this;

	// end .jshowoff
	};

// end closure
})(jQuery);