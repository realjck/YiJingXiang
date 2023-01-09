/*
********************
Yi Jing Xiang
Author: realjck
v0.92
********************
*/

// touch?
function watchForHover() {
  // lastTouchTime is used for ignoring emulated mousemove events
  let lastTouchTime = 0;

  function enableHover() {
    if (new Date() - lastTouchTime < 500) return;
    document.body.classList.add('hasHover');
  }

  function disableHover() {
    document.body.classList.remove('hasHover');
  }

  function updateLastTouchTime() {
    lastTouchTime = new Date();
  }

  document.addEventListener('touchstart', updateLastTouchTime, true);
  document.addEventListener('touchstart', disableHover, true);
  document.addEventListener('mousemove', enableHover, true);

  enableHover();
}

watchForHover();

// Init swiper
var swiper = new Swiper('.swiper', {
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	}
});

// Init lang
var lang = "en";
if (localStorage.getItem("YiJingXiang_lang")){
	lang = localStorage.getItem("YiJingXiang_lang");
}
SwitchLang(lang);

function SwitchLang(_lang){
	
	lang = _lang;
	
	$("#bt-lang-en, #bt-lang-fr").removeClass("active");
	$("#bt-lang-"+lang).addClass("active");
	
	localStorage.setItem("YiJingXiang_lang", lang);

	$("#baseline").html(UI_TEXTS[lang]["baseline"]);
	$("#consigne").html(UI_TEXTS[lang]["consigne"]);
	$("#book-text").html(UI_TEXTS[lang]["book"]);

	if(hexagram1 != null){
		UpdateHexagramsTexts();
	}
}

$("#bt-lang-en").on("click", function(e){
	SwitchLang("en");
});
$("#bt-lang-fr").on("click", function(e){
	SwitchLang("fr");
});

// Yi-King Tirage
var yiking = ""; // string for wengu ex 679866
var hexagram1, hexagram2;

$("#bt-back").on("click", InitYiking);
 
function InitYiking(){
	yiking = "";
	
	$("#consigne").show();
	$(".bar").remove();
	$("#coins").show();
	$("#bt-back").hide();
	
	swiper.slideTo(1, 500);
	
	setTimeout(function(){
		$("#result1").hide();
		$("#result2").hide();
		$("#end").hide();
		swiper.update();
	}, 500);
	
	PlaySound("back");
}

$("#coin-yang").on("click", function(e){
	AddBar("yang");
});
$("#coin-yin").on("click", function(e){
	AddBar("yin");
});
$("#coin-yang-mut").on("click", function(e){
	AddBar("yang-mut");
});
$("#coin-yin-mut").on("click", function(e){
	AddBar("yin-mut");
});

function AddBar(bar){
	
	$("#bt-back").show();
	$("#consigne").hide();
	
	$('<div class="bar bar-'+bar+'"></div>').insertAfter("#coins").hide().fadeIn();
	
	switch(bar){
		case "yin-mut": yiking += "6"; break;
		case "yang": yiking += "7"; break;
		case "yin": yiking += "8"; break;
		case "yang-mut": yiking += "9"; break;
	}
	if (yiking.length == 6){
		$("#coins").hide();
		
		hexagram1 = yiking.replace(/6/g, "0").replace(/7/g, "1").replace(/8/g, "0").replace(/9/g, "1");
		hexagram2 = yiking.replace(/6/g, "1").replace(/7/g, "1").replace(/8/g, "0").replace(/9/g, "0");

		// images
		$("#result1 .img-bottom").css("background-image", "url('assets/images/"+hexagram1.substring(0,3)+".jpg'");
		$("#result1 .img-top").css("background-image", "url('assets/images/"+hexagram1.substring(3)+".jpg'");
		$("#result2 .img-bottom").css("background-image", "url('assets/images/"+hexagram2.substring(0,3)+".jpg'");
		$("#result2 .img-top").css("background-image", "url('assets/images/"+hexagram2.substring(3)+".jpg'");
		
		UpdateHexagramsTexts();
		
		$("#result1").show();
		if (hexagram1 != hexagram2){
			$("#result2").show();
		}
		$("#end").show();
		
		swiper.update();
		
		setTimeout(function(){
			swiper.slideTo(2, 1200);
		}, 500);
		PlaySound("yiking");
	} else {
		PlaySound("coin"+Math.ceil(Math.random()*4));
	}
}
function UpdateHexagramsTexts(){
	$("#result1 .hexagram-text").html(HEXAGRAMS_TEXTS[lang][hexagram1]);
	$("#result2 .hexagram-text").html(HEXAGRAMS_TEXTS[lang][hexagram2]);	
}

// open link
$("#book-image").on("click", function(e){
	var hexatext = HEXAGRAMS_TEXTS[lang][hexagram1];
	var num = hexatext.substr(0, hexatext.indexOf("."));
	var url = "http://wengu.tartarie.com/wg/wengu.php?l=Yijing&tire="+yiking+"&no="+num+"&lang="+lang;
	window.open(url, '_blank').focus();
});

// sound
var sound = "1";
if (localStorage.getItem("YiJingXiang_sound")){
	sound = localStorage.getItem("YiJingXiang_sound");
}
ApplyButtonSound();

function ApplyButtonSound(){
	if (sound == "1"){
		$("#bt-sound").addClass("active");
	} else {
		$("#bt-sound").removeClass("active");
	}
	localStorage.setItem("YiJingXiang_sound", sound);
}
$("#bt-sound").on("click", function(e){
	if (sound =="1"){
		sound = "0";
	} else {
		sound = "1";
	}
	ApplyButtonSound();
});

function PlaySound(src){
	if (sound == "1"){
		var audioElement = document.createElement('audio');
		audioElement.setAttribute('src', 'assets/sounds/'+src+'.mp3');
		audioElement.play();
	}
}

// preload

var elementsLoaded = 0;

preloadXHR([
    'assets/images/000.jpg',
	'assets/images/001.jpg',
	'assets/images/011.jpg',
	'assets/images/111.jpg',
	'assets/images/010.jpg',
	'assets/images/110.jpg',
	'assets/images/100.jpg',
	'assets/images/101.jpg',
	'assets/sounds/back.mp3',
	'assets/sounds/coin1.mp3',
	'assets/sounds/coin2.mp3',
	'assets/sounds/coin3.mp3',
	'assets/sounds/coin4.mp3',
	'assets/sounds/yiking.mp3',
]);

function preloadXHR(assetsAr){
	for (i=0; i<assetsAr.length; i++){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', assetsAr[i]);
		xhr.send('');
		xhr.onload = function(e) {
		  elementsLoaded++;
		  console.log(elementsLoaded);
		}
	}
}
