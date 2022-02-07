/* wow  */
wow = new WOW({
	mobile: false
});
wow.init();


if (history.scrollRestoration) {
	history.scrollRestoration = 'manual';
} else {
	window.onbeforeunload = function () {
			window.scrollTo(0, 0);
	}
}

// main main main main main main main main main main main main main main main

// animazione CS
$(window).on('load', function() {

  setTimeout(function() {
  $('section.apertura').addClass("is-ready is-revealed");
  }, 100);
});

var initialImgTranform = null;


$(document).ready(function() {
	// hamburger menu
	var forEach=function(t,o,r){if("[object Object]"===Object.prototype.toString.call(t))for(var c in t)Object.prototype.hasOwnProperty.call(t,c)&&o.call(r,t[c],c,t);else for(var e=0,l=t.length;l>e;e++)o.call(r,t[e],e,t)};

	var hamburgers = document.querySelectorAll(".hamburger");
	if (hamburgers.length > 0) {
		forEach(hamburgers, function(hamburger) {
			hamburger.addEventListener("click", function() {
				this.classList.toggle("is-active");
			}, false);
		});
	}

	$(".img").click(function(event){
		event.stopPropagation();
		if (!$('.ring .img').hasClass('dragging') || $('.ring .img').hasClass('dragStart')) {
			var ringRotation = $('.ring')[0].style.transform
			for (let s of ringRotation.split(/rotateY\([ ]*([0-9.]+)[ ]*deg\)/g)) {
				if (s)
					var degrees = s
			}
			while (Math.abs(degrees) >= 360) {
				degrees = degrees % 360 
			}
			if (!$(event.target).hasClass("bigger")) {
				$('.ring .img.bigger').css('transform', initialImgTranform) 
				$('.ring .img.bigger').removeClass('bigger')
			}
			initialImgTranform = $(event.target)[0].style.transform
			$(event.target).addClass('transition')
			$(event.target).addClass('bigger')
			console.log('scale(1.2) rotateY(-(' + degrees + 'deg))');
			$(event.target).css('transform', 'scale(1.1) rotateY(' + -degrees + 'deg)')	
		}
	});


	$('body').on('click', function() {
		if ($('.ring .img.bigger')) {
			$('.ring .img.bigger').css('transform', initialImgTranform)
			$('.ring .img.bigger').removeClass('bigger')
		}
	});

});

function scrollElementIntoView(el) {
	const yOffset = -30; 
	const element = document.getElementById($(el).attr("data-attr"));
	const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

	window.scrollTo({top: y, behavior: 'smooth'});
	toolslide.close();
	$('#toolslide .hamburger').removeClass('is-active')
	$('body').removeClass('stopScroll')
}

let xPos = 0;

gsap.timeline()
    .set('.ring', { rotationY:180, cursor:'grab' }) //set initial rotationY so the parallax jump happens off screen
    .set('.img',  { // apply transform rotations to each image
      rotateY: (i)=> i*-36,
      transformOrigin: '50% 50% 500px',
      z: -500,
      backgroundImage:(i)=>'url(img/job'+(i)+'.jpeg)',
      backgroundPosition:(i)=>getBgPos(i),
      backfaceVisibility:'hidden'
    })    
    .from('.img', {
      duration:1.5,
      y:200,
      opacity:0,
      stagger:0.1,
      ease:'expo'
    })
    .add(()=>{
      $('.img').on('mouseenter', (e)=>{
        let current = e.currentTarget;
        gsap.to('.img', {opacity:(i,t)=>(t==current)? 1:0.5, ease:'power3'})
      })
      $('.img').on('mouseleave', (e)=>{
        gsap.to('.img', {opacity:1, ease:'power2.inOut'})
      })
    }, '-=0.5')

$(window).on('mousedown touchstart', dragStart);
$(window).on('mouseup touchend', dragEnd);
      

function dragStart(e){ 
	$('.ring .img').addClass('dragStart')
	setTimeout(() => {
		$('.ring .img').removeClass('dragStart')		
	}, 200);
  if (e.touches) e.clientX = e.touches[0].clientX;
  xPos = Math.round(e.clientX);
  gsap.set('.ring', {cursor:'grabbing'})
  $(window).on('mousemove touchmove', drag);
	if ($('.ring .img.bigger')) {
		$('.ring .img.bigger').css('transform', initialImgTranform)
		$('.ring .img.bigger').removeClass('bigger')
	}
}


function drag(e){
  if (e.touches) e.clientX = e.touches[0].clientX;    

  gsap.to('.ring', {
    rotationY: '-=' +( (Math.round(e.clientX)-xPos)%360 ),
    onUpdate:()=>{ gsap.set('.img', { backgroundPosition:(i)=>getBgPos(i) }) }
  });
  
  xPos = Math.round(e.clientX);
}

function dragEnd(e){
  $(window).off('mousemove touchmove', drag);
  gsap.set('.ring', {cursor:'grab'});
	$('.ring .img').addClass('dragging')
	setTimeout(() => {
		$('.ring .img').removeClass('dragging')		
	}, 200);

}

function getBgPos(i){ //returns the background-position string to create parallax movement in each image
  return ( 100-gsap.utils.wrap(0,360,gsap.getProperty('.ring', 'rotationY')-180-i*36)/360*500 )+'px 0px';
}



