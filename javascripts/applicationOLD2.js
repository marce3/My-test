var allowSpin = false;
var spinning = false;
var current_segment = undefined;
var disableClicks = false;
var animating = false;
var startScreen = true;
var skipFilm = true;
var counter = 90;
var stageZeroTimer;
var infoBoxTimer;
var closingStage0 = false;

var app = {
	initialise: function() {
		app.log('initialised');
	},
	
	log: function(message) {
		if(typeof console != 'undefined') console.log(message);
	}

};

var maths_things = {
	distance_between_two_points: function(x1, x2, y1, y2){
		x1 = parseFloat(x1);
		x2 = parseFloat(x2);
		y1 = parseFloat(y1);
		y2 = parseFloat(y2);
		var xx1=Math.pow((x2-x1),2);
		var yy1=Math.pow((y2-y1),2);
		return Math.round(Math.sqrt((parseFloat(xx1)+parseFloat(yy1)))*10000)/10000;
	},
	
	solves_angles: function(a, b, c){ // Returns angle C
		var temp = (a * a + b * b - c * c) / (2 * a * b);
		if (temp >= -1 && temp <= 1){
			return maths_things.radius_to_deg(Math.acos(temp));
		}else{
			app.log("No solution to solve angles");
			return 0;
		}
	},
	
	radius_to_deg: function(x){
		return x / Math.PI * 180;
	},
	
	//clockwise or anticlickwise
	which_way: function(center_x, center_y, curr_x, curr_y, prev_x, prev_y){
		//apprently this is a  cross product of two vectors
		product = (prev_x- center_x) * (curr_y - center_y) - (curr_x - center_x) * (prev_y - center_y);
		//get sign of product
		return product && product / Math.abs(product);
	}
	
};

var animations = {
	scale_in: function(elements_to_scale_in){
		for (x in elements_to_scale_in){
			elements_to_scale_in[x].animate({transform:('s1')}, 2000, 'bounce');
		}
        
	},
	
	scale_out: function(elements_to_scale_out){
		for (x in elements_to_scale_out){
			elements_to_scale_out[x].transform('s0');
		}
	}
}

var wedge_stuff = {
	get_path: function(cx, cy, r, startAngle, endAngle, params){
		var rad = Math.PI / 180;

		var plus = 77; //THIS SHOULD BE CALCULATED
		startAngle = startAngle + plus
		endAngle = endAngle + plus
		var x1 = cx + r * Math.cos(-startAngle * rad),
	            x2 = cx + r * Math.cos(-endAngle * rad),
	            y1 = cy + r * Math.sin(-startAngle * rad),
	            y2 = cy + r * Math.sin(-endAngle * rad);
		return ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"];
	},
	
	build_in: function(wedge, paper_center_x, paper_center_y, elements_to_spin){
		
		//jump to a secions, we'll just make it up for now...
		for (x in elements_to_spin){
			elements_to_spin[x].transform('s1');
			elements_to_spin[x].animate({transform:('s1,R' + 90)}, 1500);
		}
		
		wedge.animate({transform:('s1,1,'+ paper_center_x +','+ paper_center_y)}, 600, '>');
	}
};


$(document).on("touchmove", function(e){
	e.preventDefault();
});


// jQuery no-double-tap-zooms

(function($) {
 var IS_IOS = /iphone|ipad/i.test(navigator.userAgent);
 $.fn.nodoubletapzoom = function() {
 if (IS_IOS)
 $(this).bind('touchstart', function preventZoom(e) {
              var t2 = e.timeStamp
              , t1 = $(this).data('lastTouch') || t2
              , dt = t2 - t1
              , fingers = e.originalEvent.touches.length;
              $(this).data('lastTouch', t2);
              if (!dt || dt > 500 || fingers > 1) return; // not double-tap
              
              e.preventDefault(); // double tap - prevent the zoom
              // also synthesize click events we just swallowed up
              $(this).trigger('click').trigger('click');
              });
 };
 })(jQuery);



$(document).ready(function(){
    
        $('body').nodoubletapzoom();

                  
        document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
                  
        //var restartTimer=setInterval(function(){restart()},5000);
        
        $('#go-to-start').click(function(){
            reset();
            $('#intro-slide-1 p').css('display','none');
            $('#intro-slide-2').css('display','none');
            $('#intro-slide-3').css('display','none');
            $('#intro-slide-4').css('display','none');
            $('#intro-slide-5').css('display','none');
            $('#intro-slide-6').css('display','none');
            $('#intro-slide-7').css('display','none');
            
            clearTimeout(slide3Intro);
            clearTimeout(slide4Intro);
            clearTimeout(slide5Intro);
            animating = true;
            disableClicks = true;
            allowSpin = true;
             $('#skip-to-film').fadeOut(1);
             $('#skip-to-profile').fadeOut(1);
            $('#logo').delay(3000).fadeIn(3000);
            if($('#go-back').attr('class') == 'stage-1'){
                closeStage1();
            }
            if($('#go-back').attr('class') == 'stage-2'){
                closeStage2();
            }

            if($('#go-back').attr('class') == 'stage-3'){
                closeStage3();     
            }
            
            if($('#go-back').attr('class') != 'stage-0'){
                stageZeroTimer = setTimeout(function(){
                        closeStage1();  
                        closeStage0();
                    }, 4000);
            }
            
            if($('#go-back').attr('class') == 'stage-0'){
                closeStage0();
            }
        });
        
        //SET AUTO RESTART
        
        window.timerFired = function() {
                  
                  
                  reset();
                  if($('#go-back').attr('class') != 'stage-start'){
                  $('#intro-slide-1 p').css('display','none');
                  $('#intro-slide-2').css('display','none');
                  $('#intro-slide-3').css('display','none');
                  $('#intro-slide-4').css('display','none');
                  $('#intro-slide-5').css('display','none');
                  $('#intro-slide-6').css('display','none');
                  $('#intro-slide-7').css('display','none');
                  
                  clearTimeout(slide3Intro);
                  clearTimeout(slide4Intro);
                  clearTimeout(slide5Intro);
                  animating = true;
                  disableClicks = true;
                  allowSpin = true;
                  $('#skip-to-film').fadeOut(1);
                  $('#skip-to-profile').fadeOut(1);
                  $('#logo').delay(3000).fadeIn(3000);
                  if($('#go-back').attr('class') == 'stage-1'){
                  closeStage1();
                  }
                  if($('#go-back').attr('class') == 'stage-2'){
                  closeStage2();
                  }
                  
                  if($('#go-back').attr('class') == 'stage-3'){
                  closeStage3();
                  }
                  
                  if($('#go-back').attr('class') != 'stage-0'){
                  stageZeroTimer = setTimeout(function(){
                                              closeStage1();
                                              closeStage0();
                                              }, 4000);
                  }
                  
                  if($('#go-back').attr('class') == 'stage-0'){
                  closeStage0();
                  }
                  }
        };
        
        //window.myTimer = setTimeout(timerFired, 30000);
        //window.myTimer2 = setInterval(countTimer(counter), 1000);
        
        var int = self.setInterval(function(){
                            counter = counter - 1;
                            if(counter < 0){
                                
                                if($('#structure-video-2').length){
                                    
                                    counter = 90;
                                    if(!($('#structure-video-2')[0].paused || $('#structure-video-2')[0].ended || $('#structure-video-2')[0].seeking || $('#structure-video-2')[0].readyState < $('#structure-video-2')[0].HAVE_FUTURE_DATA)){
                                        counter = 90;
                                    }else{
                                        timerFired();
                                    }
                                }else{
                                    timerFired();
                                }
                            }
                            $('#counter').val(counter);
                        },1000);
        
        
        window.reset = function() {
            //clearTimeout(stageZeroTimer);
            //clearTimeout(infoBoxTimer);
            //clearTimeout(window.myTimer);
            //window.myTimer = setTimeout(timerFired, 30000);
            counter = 90;
        };

        
	app.initialise();
	
	var paper = Raphael(0, 0, "100%", "100%");
	var paper_center_x = $('svg:first').width() / 2;
	var paper_center_y = $('svg:first').height() / 2;
	var outer_circle_r = (700 / 2);
	var elements_to_spin = [];
        var elements_to_scale = [];
        var segment_buttons = [];

        var outer_shadow = paper.image('images/wheel-shadow.png', (paper_center_x - outer_circle_r-10), (paper_center_y - outer_circle_r-10), (outer_circle_r * 2 + 25), (outer_circle_r * 2 + 25));
	//add elements to paper, order of adding is z index?
	var outer_circle = paper.image('images/wheel27.png', (paper_center_x - outer_circle_r), (paper_center_y - outer_circle_r), (outer_circle_r * 2), (outer_circle_r * 2));
	var inner_ring = paper.image('images/inner-ring.png', (paper_center_x - outer_circle_r + 63), (paper_center_y - outer_circle_r + 63), (outer_circle_r * 2 - 120), (outer_circle_r * 2 - 120));

	//add drag mask
	var drag_mask_circle = paper.circle(paper_center_x, paper_center_y, outer_circle_r);
	
        //Segment buttons
        var finance = paper.image('images/finance-box.png', (paper_center_x-75), (paper_center_y - 350), 150, 85);
        var sales = paper.image('images/sales-box.png', (paper_center_x+260), (paper_center_y - 140), 90, 140);
        var event = paper.image('images/event-box.png', (paper_center_x+75), (paper_center_y - 330), 130, 85);
        var compliance = paper.image('images/compliance-box.png', (paper_center_x+195), (paper_center_y - 250), 120, 105);
        var investment = paper.image('images/investment-box.png', (paper_center_x+263), (paper_center_y - 0), 84, 135);
        var research = paper.image('images/research-box.png', (paper_center_x+208), (paper_center_y + 145), 90, 107);
        var trading = paper.image('images/trading-box.png', (paper_center_x+68), (paper_center_y + 235), 130, 98);
        var technology = paper.image('images/technology-box.png', (paper_center_x-60), (paper_center_y + 273), 120, 80);
        var treasury = paper.image('images/treasury-box.png', (paper_center_x-195), (paper_center_y + 243), 130, 94);
        var prime = paper.image('images/prime-box.png', (paper_center_x-305), (paper_center_y + 145), 110, 112);
        var quantitive = paper.image('images/quantitive-box.png', (paper_center_x-354), (paper_center_y + 4), 95, 133);
        var structuring = paper.image('images/structuring-box.png', (paper_center_x-347), (paper_center_y - 133), 80, 132);
        var risk = paper.image('images/risk-box.png', (paper_center_x-297), (paper_center_y - 247), 90, 106);
        var operations = paper.image('images/operations-box.png', (paper_center_x-200), (paper_center_y - 330), 130, 91);
    
        segment_buttons.push(finance);
        segment_buttons.push(sales);
        segment_buttons.push(event);
        segment_buttons.push(compliance);
        segment_buttons.push(investment);
        segment_buttons.push(research);
        segment_buttons.push(trading);
        segment_buttons.push(technology);
        segment_buttons.push(treasury);
        segment_buttons.push(prime);
        segment_buttons.push(quantitive);
        segment_buttons.push(structuring);
        segment_buttons.push(risk);
        segment_buttons.push(operations);
                  
        for(x in segment_buttons){
            segment_buttons[x].hide();
        }
                  
	//to spin array
	elements_to_spin.push(outer_circle);
	elements_to_scale.push(outer_shadow);
	elements_to_scale.push(inner_ring);
	elements_to_spin.push(drag_mask_circle);
	
	
	//tmp drag mask, will be fully trans at end
	//drag_mask_circle.attr("fill", "90-#f00:5-#00f:95");
	drag_mask_circle.attr("fill", "#FFFFFF");
	drag_mask_circle.attr("stroke-width", 0);
	drag_mask_circle.attr('transform', "r0");
	drag_mask_circle.attr('opacity', 0);
	
	//for touching and spinning
	var touch_count = 0;
	var prev_x = undefined;
	var prev_y = undefined;
	var which_way = 1;
	var remember_c = 0;
	var tmp_running_angle = 0;
	
	//scale in test
	animations.scale_out(elements_to_spin);
	animations.scale_out(elements_to_scale);
	
        
        
        
        
        //touch vars
        var curX = 0;
        var curY = 0;
        var startX = 0;
        var startY = 0;
        var endX = 0;
        var endY = 0;
        var swipeLength = 0;
        var minLength = 10;
        
	//touch events

    function spinWheel(e){
    
        if(allowSpin == true && disableClicks == false){
            
            spinning = true;
            e.preventDefault();
            reset();
            if(touch_count > 0){
                  
                  var curr_x = e.pageX;
                  var curr_y = e.pageY;
                  
                  which_way = maths_things.which_way(paper_center_x, paper_center_y, curr_x, curr_y, prev_x, prev_y);
                  
                  //get sides of the triangle
                  var a = maths_things.distance_between_two_points(paper_center_x, prev_x, paper_center_y, prev_y);
                  var b = maths_things.distance_between_two_points(curr_x, paper_center_x, curr_y, paper_center_y);
                  var c = maths_things.distance_between_two_points(curr_x, prev_x, curr_y, prev_y);
                  
                  //get angle C, for the SSS sides of the triangel a, b, c
                  var angle = maths_things.solves_angles(a,b,c);
                  remember_c = c;
                  
                  if( which_way === 1){
                    tmp_running_angle = tmp_running_angle + angle;
                  }else{
                    tmp_running_angle = tmp_running_angle - angle;
                  }
                  
                  //drag_mask_circle.attr('transform', ("r" + tmp_running_angle));
                  for (x in elements_to_spin){
                    elements_to_spin[x].attr('transform', ("r" + tmp_running_angle));
                  }
                  
                  for (x in segment_buttons){
                    segment_buttons[x].attr('transform', ("r"+tmp_running_angle+","+paper_center_x+","+paper_center_y));
                  }
                  
            }
                  
            prev_x = e.pageX;
            prev_y = e.pageY;
            touch_count++;
        }
    }
        
    drag_mask_circle.touchmove(function(e){
        if(allowSpin == true && disableClicks == false){
            spinWheel(e);
        }
        
    });
	
    function spinWheelEnd(e){
    
        //momentum
        if( remember_c != undefined ){
            //remember_c
                  
            var ease_incrament = (2.5 * remember_c);
                  
            //drag_mask_circle.animate({transform:('r' + tmp_running_angle)}, 500, '>');
            if(remember_c > 3){
	
	            if(which_way === 1){
	                tmp_running_angle = tmp_running_angle + ease_incrament;
	            }else{
	                tmp_running_angle = tmp_running_angle - ease_incrament;
	            }

                for (x in elements_to_spin){
                  elements_to_spin[x].animate({transform:('r' + tmp_running_angle)}, ((remember_c * 18) + 500), 'cubic-bezier(0.405,0.755,0.345,0.980)', function(){
                      spinning = false;
                                              
                  });
                }
                  
                for (x in segment_buttons){
                  segment_buttons[x].animate({transform:('r' + tmp_running_angle+","+paper_center_x+","+paper_center_y)}, ((remember_c * 18) + 500), 'cubic-bezier(0.405,0.755,0.345,0.980)');
                }
            }
        }
        spinning = false;
        //reset count to stop jumping & reset c for momentum
        touch_count = 0;
        remember_c = 0;
        reset();
    }
                  
    drag_mask_circle.touchend(function(e){
                              
        
        spinWheelEnd(e);
		
                
    });
        
    function touchCancel(event) {
        // reset the variables back to default values
        startX = 0;
        startY = 0;
        curX = 0;
        curY = 0;
        swipeLength = 0;
    }
        


    $('#skip-intro').click(function(){
        animating = true;
        reset();
        
        introSlide1Done = false;
        introSlide2Done = false;
        introSlide3Done = false;
        introSlide4Done = false;
        introSlide5Done = false;
        introSlide6Done = false;
        introSlide7Done = false;
        
        $('#go-back').attr('class','stage-1');
        startScreen = false;
        //$(this).fadeOut('slow');
        $('#intro').fadeOut(2000,function(){
            $('svg').css('display','block');
            $('#white-circle').css('display','block');
            $('#see-yourself-working-in').css('display','block');

            animations.scale_in([outer_circle,outer_shadow, drag_mask_circle, inner_ring]);

            for(x in segment_buttons){
                segment_buttons[x].animate({transform:('s1')}, 2000, 'bounce');
            }



            $('#white-circle').animate({scale:'1'}, {
                                                duration: 2000,
                                       specialEasing: {
                                       scale: 'easeOutBounce'
                                       },
                                    complete: function() {
                                                //$('#go-back').fadeIn('slow');
                                                $('#go-to-start').fadeIn('slow');
                                    }

                                });

            $('#see-yourself-working-in').animate({scale:'1'}, {
                                        duration: 2000,
                                        specialEasing: {
                                            scale: 'easeOutBounce'
                                        },
                                        complete: function() {

                                        }

                                });

            infoBoxTimer = setTimeout(function(){
                $('#info-box').css('display','block');
                $('#info-box-text').css('display','block');
                $('#see-yourself-working-in').css('display','block');

                for (x in elements_to_spin){
                    elements_to_spin[x].animate({transform:('r0s1')}, ((remember_c * 18) + 500), '>');
                }

                for(x in segment_buttons){
                    segment_buttons[x].animate({transform:('r0s1'+","+paper_center_x+","+paper_center_y)}, ((remember_c * 18) + 500), '>');
                }
                animating = false;
                allowSpin = true;
                spinning = false;
                disableClicks = false;
                reset();
            },2000);



        });

    });
        
    $('#info-box').click(function(){
        reset();
        $('#info-box').css('display','none');
        $('#info-box-text').css('display','none');
        allowSpin = true;


        for(x in segment_buttons){
            segment_buttons[x].show();
        }



    });
        
    $('#start').click(function(){
        
        //if(disableClicks == false){
            
            animating = true;
            reset();
            $('#go-back').attr('class','stage-1');

            $('#intro').fadeOut(2000,function(){
                $('svg').css('display','block');
                $('#white-circle').css('display','block');
                $('#see-yourself-working-in').css('display','block');
                animations.scale_in([outer_circle, outer_shadow, drag_mask_circle, inner_ring]);

                for(x in segment_buttons){
                    segment_buttons[x].animate({transform:('s1')}, 2000, 'bounce');
                }

                $('#white-circle').animate({scale:'1'}, {
                                        duration: 2000,
                                        specialEasing: {
                                            scale: 'easeOutBounce'
                                        },
                                        complete: function() {
                                                       //$('#go-back').fadeIn('slow');    
                                                       $('#go-to-start').fadeIn('slow');    
                                        }

                                    });

                $('#see-yourself-working-in').animate({scale:'1'}, {
                                                    duration: 2000,
                                                    specialEasing: {
                                                        scale: 'easeOutBounce'
                                                    },
                                                    complete: function() {
                                                        reset();
                                                    }

                                                });
                

                /*infoBoxTimer = setTimeout(function(){
                    $('#info-box').css('display','block');
                    $('#info-box-text').css('display','block');
                    $('#see-yourself-working-in').css('display','block');
                    animating = false;
                    
                    allowSpin = true;
                    spinning = false;
                    disableClicks = false;
                    
                },2000);*/
                
                
                
                infoBoxTimer = setTimeout(function(){
                    $('#info-box').css('display','block');
                    $('#info-box-text').css('display','block');
                    $('#see-yourself-working-in').css('display','block');

                    for (x in elements_to_spin){
                        elements_to_spin[x].animate({transform:('r0s1')}, ((remember_c * 18) + 500), '>');
                    }

                    for(x in segment_buttons){
                        segment_buttons[x].animate({transform:('r0s1'+","+paper_center_x+","+paper_center_y)}, ((remember_c * 18) + 500), '>');
                    }
                    animating = false;
                    allowSpin = true;
                    spinning = false;
                    disableClicks = false;
                    reset();
                },2000);
                
                

            });
        //}
    });       
           
        
    function spin(rotateDegrees, segment){
        
        //if(disableClicks == false){
			tmp_running_angle = rotateDegrees;
            animating = true;
            reset();
            allowSpin = false;
            $('#go-back').attr('class','stage-2');
            $('#go-back').css('display','none');
            $('#go-to-start').css('display','none');

            for (x in elements_to_spin){
                elements_to_spin[x].animate({transform:('r'+rotateDegrees)}, ((remember_c * 18) + 500), '>');
            }

            for(x in segment_buttons){
                segment_buttons[x].animate({transform:('r'+rotateDegrees+","+paper_center_x+","+paper_center_y)}, ((remember_c * 18) + 500), '>');
            }

            $('#white-circle').delay(500).animate({marginTop:'220px', scale:'1.3'}, {
                                                    duration: 500,
                                                    complete: function() {

                                                    }

            });

            $('#see-yourself-working-in').delay(500).animate({marginTop:'220px', scale:'1.3'}, {
                                                            duration: 500,
                                                            complete: function() {

                                                            }

            });



            //outer_circle.animate({transform:('s1.3')}, 2000);

            $('svg').delay(500).animate({marginTop:'220px'}, {
                                            duration: 500,
                                            complete: function() {

                                                $('#top-segment-image').css('display','block');
                                                $('#top-segment-image').animate({scale:1.3, top:'30px',left:'42.2%'}, {
                                                                        duration: 2000,
                                                                        complete: function() {
                                                                            $('#'+segment+'-text').fadeIn('slow');
                                                                            $('#'+segment+'-more-button').fadeIn('slow');
                                                                            $('#'+segment+'-more').css('z-index',20);
                                                                            $('#go-back').css('display','block');
                                                                            $('#go-to-start').css('display','block');
                                                                            animating = false;
                                                                            reset();
                                                                        }
                                                });

                                            }

            });

        //}

    }
                  
    var slideButtonsHTML = '<div class="clear"></div><img src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';
    var slideButtonsBackHTML = '<div class="clear"></div><img style="margin-top:365px; margin-left:204px;" src="images/left-arrow.jpg" class="slide-back" /><div class="clear"></div>';
    var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 251px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';


    var Slide1RightAdjuster = 0;
    var Slide2RightAdjuster = 0;
    var Slide3RightAdjuster = 0;
                  
    for(x in segment_buttons){
        segment_buttons[x].click(function(e){
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        });

        segment_buttons[x].touchmove(function(e){
            curX = e.touches[0].pageX;
            curY = e.touches[0].pageY;

            spinWheel(e);

        });
    }
        
        finance.touchend(function(e){
            if(disableClicks == false){
                

                if((curX == 0)){

                    if(allowSpin == true){
                        if(spinning == false){
                        spin(0, 'finance');
                        current_segment = "finance";

                        var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 234px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';

                        Slide1RightAdjuster = 40;
                        Slide2RightAdjuster = 40;
                        Slide3RightAdjuster = 40;
                        $('.screen-1 .text p').html('Whether it’s the reporting of our financial performance, the management of a robust control environment, or partnering with the business to facilitate new products, Finance helps govern one of the world’s largest investment banks.' + slideButtonsForwardHTML);
                        $('.screen-2 .text p').html('The function is organised into four teams: Product Control, Financial Control, Financial Decision Support and Tax.'+'<div class="clear"></div><img style="margin-left:179px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                        $('.screen-3 .text p').html('If you’re a proactive problem solver with an analytical mind, who can work well under pressure as part of a team, Finance will give you many opportunities to excel. '+'<div class="clear"></div><img style="margin-left:183px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                        $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:349px; position:absolute; left:5px; top:43px;" class="video-slide" style="width:620px; height:349px;"><video id="structure-video-2" width="620" height="349" controls="controls"><source src="videos/finance.mov" ></video></div>' + slideButtonsBackHTML);
                        slideButtons();
                        }
                    }
                }else{

                    spinWheelEnd(e);

                }

                curX = 0;
                endX = 0;
                endY = 0;
            }
        });
        
        
               
        /*finance.click(function(){
            if(allowSpin == true){
                if(spinning == false){
                spin(1, 'finance');
                current_segment = "finance";
                
                Slide1RightAdjuster = 40;
                Slide2RightAdjuster = 40;
                Slide3RightAdjuster = 40;
                $('.screen-1 .text p').html('Whether it’s the reporting of our financial performance, the management of a robust control environment, or partnering with the business to facilitate new products, Finance helps govern one of the world’s largest investment banks.' + '<div class="clear"></div><img style="margin-left: 268px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                $('.screen-2 .text p').html('The function is organised into four teams: Product Control, Financial Control, Financial Decision Support and Tax.'+'<div class="clear"></div><img style="margin-left:190px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                $('.screen-3 .text p').html('If you’re a proactive problem solver with an analytical mind, who can work well under pressure as part of a team, Finance will give you many opportunities to excel. '+'<div class="clear"></div><img style="margin-left:190px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:402px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
        });*/
                  
        
        /*sales.click(function(){
            if(allowSpin == true){
                if(spinning == false){
                spin(283,'sales');
                current_segment = "sales";
                
                Slide1RightAdjuster = 19;
                Slide2RightAdjuster = 13;
                Slide3RightAdjuster = 73;
                $('.screen-1 .text p').html('In Sales, we need to understand our clients’ financial and technical needs to provide the best solutions, and to execute these solutions to the highest standards of client service.' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('Our Sales team forges close relationships with clients, and plays a critical role in the organisation’s momentum and future growth.'+slideButtonsHTML);
                $('.screen-3 .text p').html('To succeed in Sales you’ll need excellent communication skills and high levels of numeracy.'+'<div class="clear"></div><img style="margin-left:175px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:502px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
            
        });*/
                  
        sales.touchend(function(e){
                                   
            if(disableClicks == false){              
                                   
                if((curX == 0)){

                    if(allowSpin == true){
                           if(spinning == false){
                           spin(283,'sales');
                           current_segment = "sales";

                          var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 242px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';

                           Slide1RightAdjuster = 19;
                           Slide2RightAdjuster = 13;
                           Slide3RightAdjuster = 73;
                           $('.screen-1 .text p').html('In Sales, we need to understand our clients’ financial and technical needs to provide the best solutions, and to execute these solutions to the highest standards of client service.' + slideButtonsForwardHTML);
                           $('.screen-2 .text p').html('Our Sales team forges close relationships with clients, and plays a critical role in the organisation’s momentum and future growth.'+'<div class="clear"></div><img style="margin-left:193px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                           $('.screen-3 .text p').html('To succeed in Sales you’ll need excellent communication skills and high levels of numeracy.'+'<div class="clear"></div><img style="margin-left:166px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                           $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:349px; position:absolute; left:5px; top:43px;" class="video-slide" style="width:620px; height:349px;"><video id="structure-video-2" width="620" height="349" controls="controls"><source src="videos/sales.mov" ></video></div>' + slideButtonsBackHTML);
                           slideButtons();
                           }
                    }
                }else{

                    spinWheelEnd(e);

                }

                curX = 0;
                endX = 0;
                endY = 0;
            }
                                   
        });
                  
                  
        /*
        event.click(function(){
            if(allowSpin == true){
                if(spinning == false){
                spin(335,'event');
                current_segment = "event";
                Slide1RightAdjuster = 12;
                Slide2RightAdjuster = 8;
                Slide3RightAdjuster = 5;
                $('.screen-1 .text p').html('Event and Roadshow Marketing is responsible for creating and delivering event marketing solutions and managing client relationships by advising on and delivering a programme of conferences and events. ' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('The division ensures brand compliance, as well as the highest levels of client service, project management, quality, efficiency, and cost control.'+slideButtonsHTML);
                $('.screen-3 .text p').html('You’ll need to be able to remain professional, calm, patient and flexible under pressure whilst juggling several projects simultaneously. As you will be working on events in a variety of different locations, additional languages and cultural awareness will give you an added advantage.'+slideButtonsHTML);
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:380px; position:absolute; left:0;top:45px;" class="video-slide"><video id="structure-video-2" width="620" height="380" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
               
        });
             */     
        event.touchend(function(e){
            if(disableClicks == false){
                                 if((curX == 0)){
                                 
                                 if(allowSpin == true){
                                 if(spinning == false){
                                    spin(335,'event');
                                    current_segment = "event";
                                    
                                    var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 245px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';
                                    
                                    Slide1RightAdjuster = 12;
                                    Slide2RightAdjuster = 8;
                                    Slide3RightAdjuster = 5;
                                    $('.screen-1 .text p').html('Event and Roadshow Marketing is responsible for creating and delivering event marketing solutions and managing client relationships by advising on and delivering a programme of conferences and events. ' + slideButtonsForwardHTML);
                                    $('.screen-2 .text p').html('The division ensures brand compliance, as well as the highest levels of client service, project management, quality, efficiency, and cost control.'+'<div class="clear"></div><img style="margin-left:196px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                                    $('.screen-3 .text p').html('You’ll need to be able to remain professional, calm, patient and flexible under pressure whilst juggling several projects simultaneously. As you will be working on events in a variety of different locations, additional languages and cultural awareness will give you an added advantage.'+'<div class="clear"></div><img style="margin-left:197px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                                    $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:349px; position:absolute; left:5px; top:43px;" class="video-slide" style="width:620px; height:349px;"><video id="structure-video-2" width="620" height="349" controls="controls"><source src="videos/event.mov" ></video></div>' + slideButtonsBackHTML);
                                    slideButtons();
                                 }
                       }
                                 }else{
                                 
                                 spinWheelEnd(e);
                                 
                                 }
                                 
                                 curX = 0;
                                 endX = 0;
                                 endY = 0;
            }               
        });
                  
        
        /*compliance.click(function(){
            if(allowSpin == true){
                if(spinning == false){
                spin(309,'compliance');
                current_segment = "compliance";
                Slide1RightAdjuster = 37;
                Slide2RightAdjuster = 23;
                Slide3RightAdjuster = 25;
                $('.screen-1 .text p').html('Compliance provides expert advice that enables our organisation to comply with the myriad of multi-jurisdictional laws and regulations that govern our industry. The function works closely with our business leaders to help them fulfill our regulatory supervisory responsibilities.' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('Our Compliance team also works closely with regulators and our business peers to drive improvements in regulatory and industry standards.'+slideButtonsHTML);
                $('.screen-3 .text p').html('If you are a team player who can proactively investigate and resolve problems – and also have the confidence to state your position – you have the ingredients to build a successful career with us.'+slideButtonsHTML);
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:502px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
              
            
        });*/
                  
        compliance.touchend(function(e){
            if(disableClicks == false){
                                 
                                 
                                 
                                 if((curX == 0)){
                                 
                                 if(allowSpin == true){
                       if(spinning == false){
                       spin(309,'compliance');
                       current_segment = "compliance";
                       
                       var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 234.5px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';
                       
                       Slide1RightAdjuster = 37;
                       Slide2RightAdjuster = 23;
                       Slide3RightAdjuster = 25;
                       $('.screen-1 .text p').html('Compliance provides expert advice that enables our organisation to comply with the myriad of multi-jurisdictional laws and regulations that govern our industry. The function works closely with our business leaders to help them fulfill our regulatory supervisory responsibilities.' + slideButtonsForwardHTML);
                       $('.screen-2 .text p').html('Our Compliance team also works closely with regulators and our business peers to drive improvements in regulatory and industry standards.'+'<div class="clear"></div><img style="margin-left:186px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                       $('.screen-3 .text p').html('If you are a team player who can proactively investigate and resolve problems – and also have the confidence to state your position – you have the ingredients to build a successful career with us.'+'<div class="clear"></div><img style="margin-left:190px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                       $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:349px; position:absolute; left:5px; top:43px;" class="video-slide" style="width:620px; height:349px;"><video id="structure-video-2" width="620" height="349" controls="controls"><source src="videos/compliance.mov" ></video></div>' + slideButtonsBackHTML);
                       slideButtons();
                       }
                                 }
                                 }else{
                                 
                                 spinWheelEnd(e);
                                 
                                 }
                                 
                                 curX = 0;
                                 endX = 0;
                                 endY = 0;
            }               
        });
                  
                  
        
        /*investment.click(function(){
            if(allowSpin == true){
                if(spinning == false){
                spin(258,'investment');
                current_segment = "investment";
                Slide1RightAdjuster = 61;
                Slide2RightAdjuster = 39;
                Slide3RightAdjuster = 20;
                $('.screen-1 .text p').html('Our Investment Banking Division provides comprehensive financial advisory, capital raising and risk management services to corporations, governments and financial institutions worldwide.' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('Initially you’ll be learning financial modelling and analytical techniques, and will develop product and sector expertise and capital markets knowledge to deliver ideas and solutions to clients.'+'<div class="clear"></div><img style="margin-left:195px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                $('.screen-3 .text p').html('To succeed here, you’ll need strong relationship building, numerical and analytical skills.'+slideButtonsHTML);
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:502px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
              
            
        });*/
                  
        investment.touchend(function(e){
            if(disableClicks == false){
                                      
                                      
                                      
                                      if((curX == 0)){
                                      
                                      if(allowSpin == true){
                            if(spinning == false){
                            spin(258,'investment');
                            current_segment = "investment";
                            
                            var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 225px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';
                            
                            Slide1RightAdjuster = 61;
                            Slide2RightAdjuster = 39;
                            Slide3RightAdjuster = 0;
                            $('.screen-1 .text p').html('Our Investment Banking Division provides comprehensive financial advisory, capital raising and risk management services to corporations, governments and financial institutions worldwide.' + slideButtonsForwardHTML);
                            $('.screen-2 .text p').html('Initially you’ll be learning financial modelling and analytical techniques, and will develop product and sector expertise and capital markets knowledge to deliver ideas and solutions to clients.'+'<div class="clear"></div><img style="margin-left:179px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                            $('.screen-3 .text p').html('To succeed here, you’ll need strong relationship building, numerical and analytical skills.'+'<div class="clear"></div><img style="margin-left:196px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                            $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:349px; position:absolute; left:5px; top:43px;" class="video-slide" style="width:620px; height:349px;"><video id="structure-video-2" width="620" height="349" controls="controls"><source src="videos/investment.mov" ></video></div>' + slideButtonsBackHTML);
                            slideButtons();
                            }
                                      }
                                      }else{
                                      
                                      spinWheelEnd(e);
                                      
                                      }
                                      
                                      curX = 0;
                                      endX = 0;
                                      endY = 0;
            }                      
        });
                  
        research.touchend(function(e){
             if(disableClicks == false){                  
                                      //alert(startX + ' - ' +curX);
                                      
                                      
                                      if((curX == 0)){
                                      
                                      if(allowSpin == true){
                          if(spinning == false){
                          spin(232,'research');
                          current_segment = "research";
                          
                          var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 236px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';
                          
                          Slide1RightAdjuster = 30;
                          Slide2RightAdjuster = 9;
                          Slide3RightAdjuster = 13;
                          $('.screen-1 .text p').html('Research provides an incisive, responsive analysis of financial markets to empower our business and drive market strategies for our clients and traders.' + slideButtonsForwardHTML);
                          $('.screen-2 .text p').html('Research is structured through four key teams: Credit Research, Economics and Market Strategy Research, Equity Research and Index, Portfolio and Risk Solutions.'+'<div class="clear"></div><img style="margin-left:195px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                          $('.screen-3 .text p').html('To communicate your results and ideas effectively here, you’ll need well-developed analytical, quantitative and interpersonal skills.'+'<div class="clear"></div><img style="margin-left:196px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                          $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:349px; position:absolute; left:5px; top:43px;" class="video-slide" style="width:620px; height:349px;"><video id="structure-video-2" width="620" height="349" controls="controls"><source src="videos/research.mov" ></video></div>' + slideButtonsBackHTML);
                          slideButtons();
                          }
                                      }
                                      }else{
                                      
                                      spinWheelEnd(e);
                                      
                                      }
                                      
                                      curX = 0;
                                      endX = 0;
                                      endY = 0;
             }                    
        });
                  
                  
        
        /*research.click(function(){
            if(allowSpin == true){
                if(spinning == false){
                spin(232,'research');
                current_segment = "research";
                Slide1RightAdjuster = 30;
                Slide2RightAdjuster = 9;
                Slide3RightAdjuster = 13;
                $('.screen-1 .text p').html('Research provides an incisive, responsive analysis of financial markets to empower our business and drive market strategies for our clients and traders.' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('Research is structured through four key teams: Credit Research, Economics and Market Strategy Research, Equity Research and Index, Portfolio and Risk Solutions.'+slideButtonsHTML);
                $('.screen-3 .text p').html('To communicate your results and ideas effectively here, you’ll need well-developed analytical, quantitative and interpersonal skills.'+slideButtonsHTML);
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:502px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
        });*/
                  
        trading.touchend(function(e){
            if(disableClicks == false){
                                    //alert(startX + ' - ' +curX);
                                    
                                    
                                    if((curX == 0)){
                                    
                                    if(allowSpin == true){
                         if(spinning == false){
                         spin(206,'trading');
                         current_segment = "trading";
                         
                         var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 251px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';
                         
                         Slide1RightAdjuster = 9;
                         Slide2RightAdjuster = 44;
                         Slide3RightAdjuster = 13;
                         $('.screen-1 .text p').html('Our traders buy and sell financial instruments, quoting ‘bid and offer’ prices to clients and counterparties on request. They add value by thinking on their feet, knowing where liquidity lies and building strong relationships to exceed client needs.' + slideButtonsForwardHTML);
                         $('.screen-2 .text p').html('You’ll need to be a quick, accurate <br/>decision-maker with a strong yet measured appetite for risk.'+'<div class="clear"></div><img style="margin-left:185px;" src="images/left-arrow.jpg" class="slide-back" /><img  src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                         $('.screen-3 .text p').html('As well as demonstrating motivation and resilience, you’ll need to operate well in a team environment and keep a cool head in stressful situations.'+'<div class="clear"></div><img style="margin-left:195px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                         $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:349px; position:absolute; left:5px; top:43px;" class="video-slide" style="width:620px; height:349px;"><video id="structure-video-2" width="620" height="349" controls="controls"><source src="videos/trading.mov" ></video></div>' + slideButtonsBackHTML);
                         slideButtons();
                         }
                                    }
                                    }else{
                                    
                                    spinWheelEnd(e);
                                    
                                    }
                                    
                                    curX = 0;
                                    endX = 0;
                                    endY = 0;
            }                   
        });
        
        /*trading.click(function(){
            if(allowSpin == true){
                if(spinning == false){
                spin(206,'trading');
                current_segment = "trading";
                Slide1RightAdjuster = 9;
                Slide2RightAdjuster = 33;
                Slide3RightAdjuster = 13;
                $('.screen-1 .text p').html('Our traders buy and sell financial instruments, quoting ‘bid and offer’ prices to clients and counterparties on request. They add value by thinking on their feet, knowing where liquidity lies and building strong relationships to exceed client needs.' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('You’ll need to be a quick, accurate decision-maker with a strong yet measured appetite for risk.'+slideButtonsHTML);
                $('.screen-3 .text p').html('As well as demonstrating motivation and resilience, you’ll need to operate well in a team environment and keep a cool head in stressful situations.'+slideButtonsHTML);
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:502px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
        });*/
        
        technology.touchend(function(e){
            if(disableClicks == false){
                                   //alert(startX + ' - ' +curX);
                                   
                                   
                                   if((curX == 0)){
                                   
                                   if(allowSpin == true){
                            if(spinning == false){
                            spin(181,'technology');
                            current_segment = "technology";
                            
                            var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 241px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';
                            
                            Slide1RightAdjuster = 19;
                            Slide2RightAdjuster = 18;
                            Slide3RightAdjuster = 8;
                            $('.screen-1 .text p').html('Technology is a well-respected and valued function at Barclays  – comprising 7,000 specialists who use their skills to enhance our internal infrastructure.' + slideButtonsForwardHTML);
                            $('.screen-2 .text p').html('You could be working closely with traders and finance professionals to create and maintain powerful trading and analytical systems, support new products and enhance strategic decision-making.'+'<div class="clear"></div><img style="margin-left:190px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                            $('.screen-3 .text p').html('If you have an interest in finance, plus a degree in Computer Science, Maths, Physics, Chemistry, or an engineering-related subject, this is an area where you can really make your mark.'+'<div class="clear"></div><img style="margin-left:197px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                            $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:349px; position:absolute; left:5px; top:43px;" class="video-slide" style="width:620px; height:349px;"><video id="structure-video-2" width="620" height="349" controls="controls"><source src="videos/technology.mov" ></video></div>' + slideButtonsBackHTML);
                            slideButtons();
                            }
                                   }
                                   }else{
                                   
                                   spinWheelEnd(e);
                                   
                                   }
                                   
                                   curX = 0;
                                   endX = 0;
                                   endY = 0;
            }                  
        });
                  
        /*technology.click(function(){
            if(allowSpin == true){
                if(spinning == false){
                spin(181,'technology');
                current_segment = "technology";
                Slide1RightAdjuster = 19;
                Slide2RightAdjuster = 18;
                Slide3RightAdjuster = 8;
                $('.screen-1 .text p').html('Technology is a well-respected and valued function at Barclays  – comprising 7,000 specialists who use their skills to enhance our internal infrastructure.' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('You could be working closely with traders and finance professionals to create and maintain powerful trading and analytical systems, support new products and enhance strategic decision-making.'+slideButtonsHTML);
                $('.screen-3 .text p').html('If you have an interest in finance, plus a degree in Computer Science, Maths, Physics, Chemistry, or an engineering-related subject, this is an area where you can really make your mark.'+slideButtonsHTML);
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:502px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
        });*/
        
        treasury.touchend(function(e){
            if(disableClicks == false){
                                      //alert(startX + ' - ' +curX);
                                      
                                      
                                      if((curX == 0)){
                                      
                                      if(allowSpin == true){
                          if(spinning == false){
                            spin(155,'treasury');
                            skipFilm = false;
                            current_segment = "treasury";
                             //$('#wrapper .text').height(890);
                             
                            content = $('#treasury-interview').html();

                            var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 235px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';

                            Slide1RightAdjuster = 31;
                            Slide2RightAdjuster = 9;
                            Slide3RightAdjuster = 34;
                            $('.screen-1 .text p').html('The Treasury function ensures that Barclays remains financially secure by managing the organisation’s liquidity, capital and balance sheet requirements.' + slideButtonsForwardHTML);
                            $('.screen-2 .text p').html('It’s a function that draws on a diverse range of skills, and is made-up of five key areas: Execution Services, Investment Function, Funding & Liquidity Management, Asset Liability Management & Funds Transfer Pricing and Capital Management.'+'<div class="clear"></div><img style="margin-left:197px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                            $('.screen-3 .text p').html('Working in Treasury, you will translate your interest in macro-economics, risk management and the financial markets into trading and policy views.'+'<div class="clear"></div><img style="margin-left:180px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward2" /><div class="clear"></div>');
                            $('.screen-5 .text p').html('<div id="scroller" style="margin: 0px auto; width: 620px; height: auto; position: absolute; left: 5px; top: 10px; overflow: hidden; display: block; margin-top: -55px;margin-left: -28px;" class="video-slide">'+content+'</div>' + '<div class="clear"></div><div class="clear"></div>');
                            slideButtons();
                          }
                                      }
                                      }else{
                                      
                                      spinWheelEnd(e);
                                      
                                      }
                                      
                                      curX = 0;
                                      endX = 0;
                                      endY = 0;
            }                       
        });
                  
        /*treasury.click(function(){
            if(allowSpin == true){
                if(spinning == false){
                spin(155,'treasury');
                current_segment = "treasury";
                Slide1RightAdjuster = 31;
                Slide2RightAdjuster = 9;
                Slide3RightAdjuster = 4;
                $('.screen-1 .text p').html('The Treasury function ensures that Barclays remains financially secure by managing the organisation’s liquidity, capital and balance sheet requirements.' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('It’s a function that draws on a diverse range of skills, and is made-up of five key areas: Execution Services, Investment Function, Funding & Liquidity Management, Asset Liability Management & Funds Transfer Pricing and Capital Management.'+slideButtonsHTML);
                $('.screen-3 .text p').html('Working in Treasury, you will translate your interest in macro-economics, risk management and the financial markets into trading and policy views.'+slideButtonsHTML);
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:502px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
        });*/
        
        prime.touchend(function(e){
            if(disableClicks == false){
                                    //alert(startX + ' - ' +curX);
                                    
                                    
                                    if((curX == 0)){
                                    
                                    if(allowSpin == true){
                       if(allowSpin == true){
                       spin(129,'prime');
                       current_segment = "prime";
                       
                       var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 232px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';
                       
                       Slide1RightAdjuster = 31;
                       Slide2RightAdjuster = 16;
                       Slide3RightAdjuster = 3;
                       $('.screen-1 .text p').html('Prime Services is a collateralised lending service that supports efficient leverage and short-selling strategies for hedge funds and institutional clients globally.' + slideButtonsForwardHTML);
                       $('.screen-2 .text p').html('Our fully integrated Equities and Fixed Income approach delivers the entire breadth of the Barclays franchise to clients worldwide.'+'<div class="clear"></div><img style="margin-left:192px" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                       $('.screen-3 .text p').html('We look for confident, resourceful self-starters with strong team-playing skills and an ability to work effectively under pressure. You’ll also need excellent relationship management and organisational skills, combined with an enthusiastic and proactive approach to problem solving.'+'<div class="clear"></div><img style="margin-left:197px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                       $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:349px; position:absolute; left:5px; top:43px;" class="video-slide" style="width:620px; height:349px;"><video id="structure-video-2" width="620" height="349" controls="controls"><source src="videos/prime.mov" ></video></div>' + slideButtonsBackHTML);
                       slideButtons();
                       }
                                    }
                                    }else{
                                    
                                    spinWheelEnd(e);
                                    
                                    }
                                    
                                    curX = 0;
                                    endX = 0;
                                    endY = 0;
            }                      
        });
                  
        /*prime.click(function(){
            if(spinning == false){
            if(allowSpin == true){
                spin(129,'prime');
                current_segment = "prime";
                Slide1RightAdjuster = 31;
                Slide2RightAdjuster = 16;
                Slide3RightAdjuster = 3;
                $('.screen-1 .text p').html('Prime Services is a collateralised lending service that supports efficient leverage and short-selling strategies for hedge funds and institutional clients globally.' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('Our fully integrated Equities and Fixed Income approach delivers the entire breadth of the Barclays franchise to clients worldwide.'+slideButtonsHTML);
                $('.screen-3 .text p').html('We look for confident, resourceful self-starters with strong team-playing skills and an ability to work effectively under pressure. You’ll also need excellent relationship management and organisational skills, combined with an enthusiastic and proactive approach to problem solving.'+slideButtonsHTML);
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:502px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
            }
            }
            
        });*/
        
        quantitive.touchend(function(e){
            if(disableClicks == false){
                                 //alert(startX + ' - ' +curX);
                                 
                                 
                                 if((curX == 0)){
                                 
                                 if(allowSpin == true){
                       if(spinning == false){
                       spin(103,'quantitive');
                       current_segment = "quantitive";
                       skipFilm = false;
                       var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 251px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';
                       
                       Slide1RightAdjuster = 30;
                       Slide2RightAdjuster = 56;
                       Slide3RightAdjuster = 3;
                       
                       //$('#wrapper .text').height(1450);
                       
                       content = $('#quantitive-interview').html();
                       
                       $('.screen-1 .text p').html('The Quantitative Analytics team thrives on developing new approaches to help the business generate revenue and manage the firm’s capital base.' + slideButtonsForwardHTML);
                       $('.screen-2 .text p').html('The group works closely with its partners, providing modelling, analytics and expert quantitative advice across all trading asset classes and risk management functions. '+'<div class="clear"></div><img style="margin-left:171px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                       $('.screen-3 .text p').html('These intensely mathematical roles require an advanced degree in subjects such as Physics or Mathematics. Logical thinking, problem solving, mathematical, interpersonal and programming skills are all essential. '+'<div class="clear"></div><img src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward2" /><div class="clear"></div>');
                       //$('.screen-4 .text p').html('<div id="scroller" style="margin: 0px auto; width: 620px; height: 815px; position: absolute; left: 5px; top: 10px; overflow: hidden; display: block; margin-top: -55px;margin-left: -28px;" class="video-slide">'+content+'</div>' + '<div class="transparent"></div><div class="clear"></div><img style="margin-top:415px; margin-left:204px;" src="images/left-arrow.jpg" class="slide-back" /><div class="clear"></div>');
                       $('.screen-5 .text p').html('<div id="scroller" style="margin: 0px auto; width: 620px; height: auto; position: absolute; left: 5px; top: 10px; overflow: hidden; display: block; margin-top: -55px;margin-left: -28px;" class="video-slide">'+content+'</div>' + '<div class="clear"></div><div class="clear"></div>');
                       slideButtons();
                       }
                                 }
                                 }else{
                                 
                                 spinWheelEnd(e);
                                 
                                 }
                                 
                                 curX = 0;
                                 endX = 0;
                                 endY = 0;
            }                     
        });
                  
        /*quantitive.click(function(){
            if(allowSpin == true){
                if(spinning == false){
                spin(103,'quantitive');
                current_segment = "quantitive";
                Slide1RightAdjuster = 30;
                Slide2RightAdjuster = 56;
                Slide3RightAdjuster = 3;
                $('.screen-1 .text p').html('The Quantitative Analytics team thrives on developing new approaches to help the business generate revenue and manage the firm’s capital base.' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('The group works closely with its partners, providing modelling, analytics and expert quantitative advice across all trading asset classes and risk management functions. '+'<div class="clear"></div><img style="margin-left:180px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                $('.screen-3 .text p').html('These intensely mathematical roles require an advanced degree in subjects such as Physics or Mathematics. Logical thinking, problem solving, mathematical, interpersonal and programming skills are all essential. '+slideButtonsHTML);
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:502px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
             
            
        });*/
        
        structuring.touchend(function(e){
            if(disableClicks == false){
                                      //alert(startX + ' - ' +curX);
                                      
                                      
                                      if((curX == 0)){
                                      
                                      if(allowSpin == true){
                             if(spinning == false){
                             spin(78,'structuring');
                             current_segment = "structuring";
                             
                             var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 243.5px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';
                             
                             Slide1RightAdjuster = 3;
                             Slide2RightAdjuster = 1;
                             Slide3RightAdjuster = 2;
                             $('.screen-1 .text p').html('Working in partnership with sales-people, traders, research analysts and quantitative analysts, our structuring business develops and delivers customised products and solutions to investors and financial institutions.' + slideButtonsForwardHTML);
                             $('.screen-2 .text p').html('You’ll have very strong analytical abilities, and if you specialise in product development, you’ll have advanced qualifications in subjects such as engineering and financial markets.'+'<div class="clear"></div><img style="margin-left:200px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                             $('.screen-3 .text p').html('You’ll also need communication, marketing and relationship building skills, plus keen attention to detail.'+'<div class="clear"></div><img style="margin-left:196px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                             $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:349px; position:absolute; left:5px; top:43px;" class="video-slide" style="width:620px; height:349px;"><video id="structure-video-2" width="620" height="349" controls="controls"><source src="videos/structuring.mov" ></video></div>' + slideButtonsBackHTML);
                             slideButtons();
                             }
                                      }
                                      }else{
                                      
                                      spinWheelEnd(e);
                                      
                                      }
                                      
                                      curX = 0;
                                      endX = 0;
                                      endY = 0;
            }                        
        });
                  
        /*structuring.click(function(){
            
            if(allowSpin == true){
                if(spinning == false){
                spin(78,'structuring');
                current_segment = "structuring";
                Slide1RightAdjuster = 3;
                Slide2RightAdjuster = 1;
                Slide3RightAdjuster = 2;
                $('.screen-1 .text p').html('Working in partnership with sales-people, traders, research analysts and quantitative analysts, our structuring business develops and delivers customised products and solutions to investors and financial institutions.' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('You’ll have very strong analytical abilities, and if you specialise in product development, you’ll have advanced qualifications in subjects such as engineering and financial markets.'+slideButtonsHTML);
                $('.screen-3 .text p').html('You’ll also need communication, marketing and relationship building skills, plus keen attention to detail.'+slideButtonsHTML);
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:502px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
              
            
        });*/
        
        risk.touchend(function(e){
            if(disableClicks == false){
                                       //alert(startX + ' - ' +curX);
                                       
                                       
                                       if((curX == 0)){
                                       
                                       if(allowSpin == true){
                      if(spinning == false){
                      spin(52,'risk');
                      current_segment = "risk";
                      
                      var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 243.5px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';
                      
                      Slide1RightAdjuster = 13;
                      Slide2RightAdjuster = 23;
                      Slide3RightAdjuster = 3;
                      $('.screen-1 .text p').html('Effective risk management requires strong collaboration, across teams and locations. The Risk function includes Market, Credit, Contingent, Settlement and Operational Risk teams, as well as Portfolio, Infrastructure and Governance teams.' + slideButtonsForwardHTML);
                      $('.screen-2 .text p').html('The teams work together to deliver a comprehensive risk management framework.'+'<div class="clear"></div><img style="margin-left:193px" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                      $('.screen-3 .text p').html('We recruit candidates from both numerical and non-numerical degree disciplines, because we value the combination of qualitative and quantitative approaches and the benefits that diverse perspectives and backgrounds bring to effective risk management.'+'<div class="clear"></div><img style="margin-left:195px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                      $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:349px; position:absolute; left:5px; top:43px;" class="video-slide" style="width:620px; height:349px;"><video id="structure-video-2" width="620" height="349" controls="controls"><source src="videos/risk.mov" ></video></div>' + slideButtonsBackHTML);
                      slideButtons();
                      }
                                       }
                                       }else{
                                       
                                       spinWheelEnd(e);
                                       
                                       }
                                       
                                       curX = 0;
                                       endX = 0;
                                       endY = 0;
            }                          
        });
                  
        /*risk.click(function(){
            
            if(allowSpin == true){
                if(spinning == false){
                spin(52,'risk');
                current_segment = "risk";
                Slide1RightAdjuster = 13;
                Slide2RightAdjuster = 23;
                Slide3RightAdjuster = 3;
                $('.screen-1 .text p').html('Effective risk management requires strong collaboration, across teams and locations. The Risk function includes Market, Credit, Contingent, Settlement and Operational Risk teams, as well as Portfolio, Infrastructure and Governance teams.' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('The teams work together to deliver a comprehensive risk management framework.'+slideButtonsHTML);
                $('.screen-3 .text p').html('We recruit candidates from both numerical and non-numerical degree disciplines, because we value the combination of qualitative and quantitative approaches and the benefits that diverse perspectives and backgrounds bring to effective risk management.'+slideButtonsHTML);
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:502px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
            
        });*/
        
        operations.click(function(e){
            //if(disableClicks == false){
                                //alert(startX + ' - ' +curX);
                                
                                
                                if((curX == 0)){
                                
                                if(allowSpin == true){
                            if(spinning == false){
                            spin(26,'operations');
                            current_segment = "operations";
                            
                            var slideButtonsForwardHTML = '<div class="clear"></div><img style="margin-left: 243px;" src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>';
                            
                            Slide1RightAdjuster = 16;
                            Slide2RightAdjuster = 30;
                            Slide3RightAdjuster = 0;
                            $('.screen-1 .text p').html('Operations ensures that our trades get to the right client and to the right account, at the right time, and cover the full spectrum of financial products, from bonds and equities to swaps and options.' + slideButtonsForwardHTML);
                            $('.screen-2 .text p').html('The environment we operate within is continually changing, and Operations plays a key role in driving market initiatives and regulatory changes.'+'<div class="clear"></div><img style="margin-left:184px;" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                            $('.screen-3 .text p').html('Teams here focus on managing risk, identifying and delivering improvements to business processes, and working with clients and vendors to secure a key commercial advantage. Successful Operations professionals demonstrate numeracy, strong problem solving and people skills.'+'<div class="clear"></div><img style="margin-left:200px" src="images/left-arrow.jpg" class="slide-back" /><img src="images/right-arrow.jpg" class="slide-forward" /><div class="clear"></div>');
                            $('.screen-4 .text p').html('<div style="margin:0 auto; width:620px; height:349px; position:absolute; left:5px; top:43px;" class="video-slide" style="width:620px; height:349px;"><video id="structure-video-2" width="620" height="349" controls="controls"><source src="videos/operations.mov" ></video></div>' + slideButtonsBackHTML);
                            slideButtons();
                            }
                                }
                                }else{
                                
                                spinWheelEnd(e);
                                
                                }
                                
                                curX = 0;
                                endX = 0;
                                endY = 0;
            //}
        });
                  
        /*operations.click(function(){
            
            if(allowSpin == true){
                if(spinning == false){
                spin(26,'operations');
                current_segment = "operations";
                Slide1RightAdjuster = 16;
                Slide2RightAdjuster = 30;
                Slide3RightAdjuster = 0;
                $('.screen-1 .text p').html('Operations ensures that our trades get to the right client and to the right account, at the right time, and cover the full spectrum of financial products, from bonds and equities to swaps and options.' + slideButtonsForwardHTML);
                $('.screen-2 .text p').html('The environment we operate within is continually changing, and Operations plays a key role in driving market initiatives and regulatory changes.'+slideButtonsHTML);
                $('.screen-3 .text p').html('Teams here focus on managing risk, identifying and delivering improvements to business processes, and working with clients and vendors to secure a key commercial advantage. Successful Operations professionals demonstrate numeracy, strong problem solving and people skills.'+slideButtonsHTML);
                $('.screen-4 .text p').html('<div style="margin:0 auto; width:502px; height:260px;" class="video-slide" style="width:502px; height:260px;"><video id="structure-video-2" width="402" height="226" controls="controls"><source src="images/karishma.mov" ></video></div>' + slideButtonsBackHTML);
                slideButtons();
                }
            }
            
        });*/
        
        $('#finance-more-button').click(function(){
            moreText('finance');
        });
        
        $('#sales-more-button').click(function(){
            moreText('sales');
        });
        
        $('#event-more-button').click(function(){
            moreText('event');
        });
        
        $('#compliance-more-button').click(function(){
            moreText('compliance');
        });
        
        $('#investment-more-button').click(function(){
            moreText('investment');
        });
        
        $('#research-more-button').click(function(){
            moreText('research');
        });
        
        $('#trading-more-button').click(function(){
            moreText('trading');
        });
        
        $('#technology-more-button').click(function(){
            moreText('technology');
        });
        
        $('#treasury-more-button').click(function(){
            moreText('treasury');
        });
        
        $('#prime-more-button').click(function(){
            moreText('prime');
        });
        
        $('#quantitive-more-button').click(function(){
            moreText('quantitive');
        });
        
        $('#structuring-more-button').click(function(){
            moreText('structuring');
        });
        
        $('#risk-more-button').click(function(){
            moreText('risk');
        });
        
        $('#operations-more-button').click(function(){
            moreText('operations');
        });
                  
    var firstTime = false;           
    function moreText(segment){
        if(disableClicks == false){
            animating = true;
            reset();
            firstTime = true;
            $('#go-back').css('display','none');
            $('#go-to-start').css('display','none');
            $('#logo').fadeOut('slow');
            //$('#go-back').fadeOut('slow');
            $('#see-yourself-working-in').fadeOut('slow');
            $('#'+segment+'-more-button').css('display','none');
            $('#'+segment+'-text').fadeOut('slow', function(){
                $('#top-segment-image').animate({left: '34%', top: '300px', scale:0.1}, {
                                        duration: 2000,
                                        complete: function() {
                                            $(this).css('display','none');

                                            $('svg').animate({marginTop:'220px'}, {
                                                    duration: 500,
                                                    complete: function() {

                                                        /*$('svg').animate({scale:1.5},{
                                                                duration:500,
                                                                complete: function() {

                                                                }
                                                        });*/

                                                    }
                                            });

                                            $('#white-circle').animate({marginTop:'0px'}, {
                                                                duration: 500,
                                                                complete: function() {

                                                                    $('#white-circle').animate({scale:1.5},{
                                                                                        duration:500,
                                                                                        complete: function() {

                                                                                        }
                                                                    });

                                                                    $('#see-yourself-working-in').css('display','none');

                                                                    $('#white-circle').animate({scale: '6.3'}, {
                                                                                               duration: 2000,
                                                                                               complete: function() {
                                                                                                    $('#finance-slides.middle-section').fadeIn('slow',function(){
                                                                                                    $('#go-back').removeClass('stage-2');
                                                                                                    $('#go-back').attr('class','stage-3');
                                                                                                    startSlide(1, 'finance-slides');
                                                                                                    //$('#go-back').css('display','block');
                                                                                                    //$('#go-to-start').css('display','block');
                                                                                                    reset();
                                                                                                });
                                                                    }
                                                                    });

                                                                }
                                            });


                                    }
                                });


                                $('#top-segment-image').animate({scale:'0.1', left: '227px', top: '96px'}, {
                                                            duration: 2000,
                                                            complete: function() {
                                                                $(this).css('display','none');
                                                                $(this).css('left','34%');
                                                                $(this).css('top','300px');

                                                            }
                                });

            });
        }
    }
                  
                  
        
        var slide1Right;
        var slide2Right;
        var slide3Right;
        var slide4Right;
        var slide1Left;
        var slide2Left;
        var slide3Left;
        var slide4Left;
        
        function startSlide(slide, segmentID){
            if(disableClicks == false){
                if(slide == 1){
                    slide1(segmentID);
                }

                if(slide == 2){
                    slide2(segmentID);
                }

                if(slide == 3){
                    slide3(segmentID);
                }

                if(slide == 4){
                    slide4(segmentID);
                }
                
                if(slide == 5){
                    slide5(segmentID);
                }
            }
        }



        function slide1(segmentID){
            if(disableClicks == false){
                reset();

                $('.screen-1').css('display','block');
                $('#'+segmentID+' .screen-1 .text').stop(true,true).css('display','block');
                $('#'+segmentID+' .screen-1 .left-bar').css('display','block');
                $('#'+segmentID+' .screen-1 .right-bar').css('display','block');

                $('.screen-2').css('display','none');
                $('.screen-3').css('display','none');
                $('.screen-4').css('display','none');

                $('#slide-number').val(1);
                $('#'+segmentID+' .screen-1').fadeIn('1');

                //slide1 resposition
                $('#'+segmentID+' .screen-1 .right-bar').animate({left:'303px'},{
                                duration: 1000,
                                complete: function(){

                                }

                            });
                $('#'+segmentID+' .screen-1 .left-bar').animate({left:'0px'},{
                            duration: 1000,
                            complete: function(){

                            }
                });
                //end reposition

                positionSlide =  390 - $('.screen-1').height() / 2 - 50;



                /*$('#finance-slides').delay(500).animate({top: positionSlide +'px'},{
                    duration: 500,
                    complete: function(){
                        alert('done');
                    }
                });*/
                if(firstTime){
                    nextImageHeight = 0;
                }else{
                    nextImageHeight = 41;
                }

                firstTime = false;

                barHeight = $('.screen-1 .text p').height() + 110  + nextImageHeight;



                $('.screen .bar-middle').animate({height:barHeight+'px'},{
                                duration: 500,
                                complete: function(){

                                }

                            });

                rightbarPosition = 603 - Slide1RightAdjuster;

                slidePosition = (585 - rightbarPosition) / 2 + 46;

                newRightbarPosition = rightbarPosition + (slidePosition - 46);

                $('#finance-slides').stop(true,true).animate({top: positionSlide +'px'},{
                    duration: 500,
                    complete: function(){

                    }

                });

                $('.screen-1 p').stop(true,true).animate({marginLeft:slidePosition+'px'},{
                    duration: 500,
                    complete: function(){

                    }

                });

                $('#'+segmentID+' .screen-1 .right-bar').stop(true,true).delay(500).animate({left:newRightbarPosition+'px'},{
                    duration: 1000,
                    complete: function(){


                    /*slide1Right=setInterval(function(){
                        $('#'+segmentID+' .screen-1 .right-bar').animate({left:'305px'},{
                                duration: 1000,
                                complete: function(){
                                    if($('#slide-number').val() == '1'){
                                        slide2(segmentID);
                                    }
                                }

                            });
                    },6000);*/ 



                    }

                });

                leftBarPos = slidePosition - 30 - 268  - 17;;

                $('#'+segmentID+' .screen-1 .left-bar').stop(true,true).delay(500).animate({left:leftBarPos+'px'},{
                    duration: 1000,
                    complete: function(){
                        $('#go-back').css('display','block');
                        $('#go-to-start').css('display','block');
                        if(skipFilm){
                            $('#skip-to-film').css('display','block');
                            
                        }else{
                            $('#skip-to-profile').css('display','block');
                        }
                        animating = false;
                        /*slide1Left=setInterval(function(){
                            $('#'+segmentID+' .screen-1 .left-bar').animate({left:'-2px'},{
                                duration: 1000,
                                complete: function(){

                                }

                            });
                        },6000);*/
                        reset();
                        
                        $('.slide-forward').css('display','block');
                        $('.slide-forward2').css('display','block');
                        $('.slide-back').css('display','block');
                        
                    }

                });
            }
        }

        function slide2(segmentID){
            if(disableClicks == false){
            reset();
            $('.screen-2').css('display','block');
            $('#'+segmentID+' .screen-2 .right-bar').css('display','block');
            $('#'+segmentID+' .screen-2 .left-bar').css('display','block');
            
            $('.screen-1').css('display','none');
            $('.screen-3').css('display','none');
            $('.screen-4').css('display','none');
            
            $('#'+segmentID+' .screen-1 .left-bar').css('display','none');
            $('#'+segmentID+' .screen-1 .right-bar').css('display','none');
            
            $('#'+segmentID+' .screen-1 .text').css('display','none');
            $('#'+segmentID+' .screen-2 .text').css('display','none');
            $('#'+segmentID+' .screen-1').css('display','none');
            $('#'+segmentID+' .screen-2 .text').css('display','block');
            $('#slide-number').val(2);
            //slide1 resposition
            $('#'+segmentID+' .screen-2 .right-bar').animate({left:'303px'},{
                            duration: 1000,
                            complete: function(){
                                
                            }

                        });
            $('#'+segmentID+' .screen-2 .left-bar').animate({left:'0px'},{
                        duration: 1000,
                        complete: function(){

                        }
            });
            //end reposition
            $('#'+segmentID+' .screen-2').fadeIn('1');
            positionSlide =  390 - $('.screen-2').height() / 2 - 50;
            
            
            barHeight = $('.screen-2 .text p').height() + 110 + 41;
            
            $('.screen .bar-middle').animate({height:barHeight+'px'},{
                            duration: 500,
                            complete: function(){
                                
                            }

                        });


            

            rightbarPosition = 603 - Slide2RightAdjuster;

            slidePosition = ((585 - rightbarPosition) / 2) + 46;
            
            newRightbarPosition = rightbarPosition + (slidePosition - 46);

            $('#finance-slides').stop(true,true).animate({top: positionSlide +'px'},{
                duration: 500,
                complete: function(){

                }

            });
            
            $('.screen-2 p').stop(true,true).delay(0).animate({marginLeft:slidePosition+'px'},{
                duration: 500,
                complete: function(){

                }

            });

            $('#'+segmentID+' .screen-2 .right-bar').stop(true,true).delay(500).animate({left:newRightbarPosition+'px'},{
                duration: 1000,
                complete: function(){
                    $('#go-back').css('display','block');
                    $('#go-to-start').css('display','block');
                    
                    if(skipFilm){
                        $('#skip-to-film').css('display','block');
                        
                    }else{
                        $('#skip-to-profile').css('display','block');
                    }
                    //$('#structure-video')[0].play();
                    animating = false;

                    /*slide2Right=setInterval(function(){
                            $('#'+segmentID+' .screen-2 .text').css('display','none');
                            $('#'+segmentID+' .screen-2 .right-bar').animate({left:'305px'},{
                                    duration: 1000,
                                    complete: function(){
                                        if($('#slide-number').val() == '2'){
                                            slide3(segmentID);
                                            $('#'+segmentID+' .screen-2 .text').css('display','none');
                                        }
                                    }

                                });
                    },10000);*/
                    
                    $('.slide-forward').css('display','block');
                    $('.slide-forward2').css('display','block');
                    $('.slide-back').css('display','block');
                    
                }

            });
            
            leftBarPos = slidePosition - 30 - 268 - 17;
            
            $('#'+segmentID+' .screen-2 .left-bar').stop(true,true).delay(500).animate({left:leftBarPos+'px'},{
                duration: 1000,
                complete: function(){

                    reset();
                    /*slide2Left=setInterval(function(){
                        $('#'+segmentID+' .screen-2 .left-bar').animate({left:'-2px'},{
                            duration: 1000,
                            complete: function(){

                            }

                        });
                    },10000);*/
                    
                }

            });
            }
        }

        function slide3(segmentID){
            if(disableClicks == false){
            reset();
            $('.screen-3').css('display','block');
            $('#'+segmentID+' .screen-3 .right-bar').css('display','block');
            $('#'+segmentID+' .screen-3 .left-bar').css('display','block');
            
            $('.screen-1').css('display','none');
            $('.screen-2').css('display','none');
            $('.screen-4').css('display','none');
            
            $('#'+segmentID+' .screen-2 .left-bar').delay(100).css('display','none');
            $('#'+segmentID+' .screen-2 .right-bar').delay(100).css('display','none');
            $('#'+segmentID+' .screen-2 .text').css('display','none');
            $('#'+segmentID+' .screen-2').css('display','none');
            $('#'+segmentID+' .screen-3 .text').css('display','block');

            $('#slide-number').val(3);
            $('#'+segmentID+' .screen-3').fadeIn('1');
            
            positionSlide =  390 - $('.screen-3').height() / 2 - 50;
            
            barHeight = $('.screen-3 .text p').height() + 110 + 41;
            
            $('.screen .bar-middle').animate({height:barHeight+'px'},{
                            duration: 500,
                            complete: function(){
                                
                            }

                        });
            
            //slide resposition
            $('#'+segmentID+' .screen-3 .right-bar').animate({left:'303px'},{
                            duration: 1000,
                            complete: function(){
                                
                            }

                        });
            $('#'+segmentID+' .screen-3 .left-bar').animate({left:'0px'},{
                        duration: 1000,
                        complete: function(){

                        }
            });
            //end reposition
            
            rightbarPosition = 603 - Slide3RightAdjuster;
            
            slidePosition = ((585 - rightbarPosition) / 2) + 46;
            
            newRightbarPosition = rightbarPosition + (slidePosition - 46);
            
            $('#finance-slides').stop(true,true).animate({top: positionSlide +'px'},{
                duration: 500,
                complete: function(){

                }

            });
            
            $('.screen-3 p').stop(true,true).delay(0).animate({marginLeft:slidePosition+'px'},{
                duration: 500,
                complete: function(){

                }

            });

            $('#'+segmentID+' .screen-3 .right-bar').stop(true,true).delay(500).animate({left:newRightbarPosition+'px'},{
                duration: 1000,
                complete: function(){
                    animating = false;
                    /*slide3Right=setInterval(function(){
                            $('#'+segmentID+' .screen-3 .right-bar').animate({left:'305px'},{
                                    duration: 1000,
                                    complete: function(){
                                        if($('#slide-number').val() == '3'){
                                            slide4(segmentID);
                                        }
                                    }

                                });
                    },6000);*/
                    reset();
                }

            });
            
            leftBarPos = slidePosition - 30 - 268 - 17;
            
            $('#'+segmentID+' .screen-3 .left-bar').stop(true,true).delay(500).animate({left:leftBarPos+'px'},{
                duration: 1000,
                complete: function(){
                    $('#go-back').css('display','block');
                    $('#go-to-start').css('display','block');
                    if(skipFilm){
                        $('#skip-to-film').css('display','block');
                    }else{
                        $('#skip-to-profile').css('display','block');
                    }
                    
                    $('.slide-forward2').css('display','block');
                    $('.slide-forward').css('display','block');
                    $('.slide-forward2').css('display','block');
                    $('.slide-back').css('display','block');
                    /*slide3Left=setInterval(function(){
                        $('#'+segmentID+' .screen-3 .left-bar').animate({left:'-2px'},{
                            duration: 1000,
                            complete: function(){

                            }

                        });
                    },6000);*/

                }

            });
            }
        }

        function slide4(segmentID){
            
            
            
            if(disableClicks == false){
                
            //reset();
            $('#structure-video-2').css('display','block');
            counter = 210;
                  
            //clearTimeout(window.myTimer);
            //window.myTimer = setTimeout(timerFired, 210000);
            
            $('.screen-4').css('display','block');
            $('#'+segmentID+' .screen-4 .right-bar').css('display','block');
            $('#'+segmentID+' .screen-4 .left-bar').css('display','block');
            
            $('.screen-1').css('display','none');
            $('.screen-2').css('display','none');
            $('.screen-3').css('display','none');
            
            $('#'+segmentID+' .screen-3 .left-bar').css('display','none');
            $('#'+segmentID+' .screen-3 .right-bar').css('display','none');
            $('#'+segmentID+' .screen-3').css('display','none');
            $('#'+segmentID+' .screen-3 .text').css('display','none');
            $('#'+segmentID+' .screen-4 .text').css('display','none');

            $('#slide-number').val(4);
            //$('#'+segmentID+' .screen-4').fadeIn('1');
            
            
            
            positionSlide =  390 - 411 / 2 - 50;
            slidePosition = 0;
            
            //alert('here1');
            
            $('#finance-slides').animate({
                top:  '134px'
              }, 500, function() {
                
              });
            
            
            $('#finance-slides').delay(750).animate({marginLeft:slidePosition+'px'},{
                duration: 500,
                complete: function(){
                    
                }

            });
            
            
            
            
            
            barHeight = 301 + 110 + 41;
            
            $('.screen .bar-middle').animate({height:barHeight+'px'},{
                            duration: 500,
                            complete: function(){
                                
                            }

                        });
            
            //document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
            //$('#structure-video-2').touchmove(function(e){e.preventDefault();});
                  
            
                  
            //slide resposition
            //$('#'+segmentID+' .screen-4 .right-bar').fadeIn('slow');
            //$('#'+segmentID+' .screen-4 .left-bar').fadeIn('slow');
            $('#'+segmentID+' .screen-4 .right-bar').animate({left:'303px'},{
                            duration: 1000,
                            complete: function(){
                                
                            }

                        });
            $('#'+segmentID+' .screen-4 .left-bar').animate({left:'0px'},{
                        duration: 1000,
                        complete: function(){

                        }
            });
            //end reposition
            
            $('#'+segmentID+' .screen-4 .right-bar').stop(true,true).delay(500).animate({left:'603px'},{
                duration: 1000,
                complete: function(){
                    $(this).fadeOut('slow');
                    $('#'+segmentID+' .screen-4 .text').delay(2000).fadeIn(1000, function(){
                        
                        
                    });
                    
                    setTimeout(function(){
                        
                        activateTouchArea('structure-video-2');
                        
                        $('#structure-video-2')[0].play();
                    }, 1000);
                    
                    
                    
                    $('#go-back').css('display','block');
                    $('#go-to-start').css('display','block');
                    animating = false;
                    /*slide4Right=setInterval(function(){
                        $('#'+segmentID+' .screen-4 .text').css('display','none');

                        $('#'+segmentID+' .screen-4 .right-bar').animate({left:'305px'},{
                            duration: 1000,
                            complete: function(){
                                if($('#slide-number').val() == '4'){
                                    endSlideShow();
                                    $('#'+segmentID+' .screen-4').css('display','none');
                                }
                            }

                        });
                    },168000);*/

                }

            });
            
                  
            $('#'+segmentID+' .screen-4 .left-bar').stop(true,true).delay(500).animate({left:'-268px'},{
                duration: 1000,
                complete: function(){
                    $(this).fadeOut('slow');
                    
                    $('.slide-forward').css('display','block');
                    $('.slide-forward2').css('display','block');
                    $('.slide-back').css('display','block');
                    $('#structure-video').css('display','block');
                    $('#structure-video-2').css('display','block');
                    
                    //reset();
                    /*slide4Left=setInterval(function(){
                        $('#'+segmentID+' .screen-4 .left-bar').animate({left:'-2px'},{
                            duration: 1000,
                            complete: function(){

                            }

                        });
                    },168000);*/

                }

            });
            
            }
            
        }
        
        function slide5(segmentID){
            
            
            
            if(disableClicks == false){
                
            
            $('.script-back').css('display','none');
            $('#scroller').css('display','block');
            //reset();
            counter = 210;
            //clearTimeout(window.myTimer);
            //window.myTimer = setTimeout(timerFired, 210000);
            
            $('.screen-5').css('display','block');
            $('#'+segmentID+' .screen-5 .right-bar').css('display','block');
            $('#'+segmentID+' .screen-5 .left-bar').css('display','block');
            
            $('.screen-1').css('display','none');
            $('.screen-2').css('display','none');
            $('.screen-3').css('display','none');
            
            $('#'+segmentID+' .screen-3 .left-bar').css('display','none');
            $('#'+segmentID+' .screen-3 .right-bar').css('display','none');
            $('#'+segmentID+' .screen-3').css('display','none');
            $('#'+segmentID+' .screen-3 .text').css('display','none');
            $('#'+segmentID+' .screen-5 .text').css('display','none');

            $('#slide-number').val(5);
            //$('#'+segmentID+' .screen-4').fadeIn('1');
            
            
            
            positionSlide =  390 - 411 / 2 - 50;
            slidePosition = 0;
            
            //alert('here1');
            
            $('#finance-slides').animate({
                top:  '134px'
              }, 500, function() {
                
              });
            
            
            $('#finance-slides').delay(750).animate({marginLeft:slidePosition+'px'},{
                duration: 500,
                complete: function(){
                    
                }

            });
            
            
            
            
            
            barHeight = 301 + 110 + 41;
            
            $('.screen .bar-middle').animate({height:barHeight+'px'},{
                            duration: 500,
                            complete: function(){
                                
                            }

                        });
            
            //document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
            //$('#structure-video-2').touchmove(function(e){e.preventDefault();});
                  
            
                  
            //slide resposition
            //$('#'+segmentID+' .screen-4 .right-bar').fadeIn('slow');
            //$('#'+segmentID+' .screen-4 .left-bar').fadeIn('slow');
            $('#'+segmentID+' .screen-5 .right-bar').animate({left:'303px'},{
                            duration: 1000,
                            complete: function(){
                                
                            }

                        });
            $('#'+segmentID+' .screen-5 .left-bar').animate({left:'0px'},{
                        duration: 1000,
                        complete: function(){

                        }
            });
            //end reposition
            
            $('#'+segmentID+' .screen-5 .right-bar').stop(true,true).delay(500).animate({left:'603px'},{
                duration: 1000,
                complete: function(){
                    $(this).fadeOut('slow');
                    $('#'+segmentID+' .screen-5 .text').delay(2000).fadeIn(1000, function(){
                        scrollContent.refresh();
                        
                        $('.script-back').css('display','block');
                        
                        
                    });
                    
                    $('#go-back').css('display','block');
                    $('#go-to-start').css('display','block');
                    animating = false;
                    /*slide4Right=setInterval(function(){
                        $('#'+segmentID+' .screen-4 .text').css('display','none');

                        $('#'+segmentID+' .screen-4 .right-bar').animate({left:'305px'},{
                            duration: 1000,
                            complete: function(){
                                if($('#slide-number').val() == '4'){
                                    endSlideShow();
                                    $('#'+segmentID+' .screen-4').css('display','none');
                                }
                            }

                        });
                    },168000);*/

                }

            });
            $('#'+segmentID+' .screen-5 .left-bar').stop(true,true).delay(500).animate({left:'-268px'},{
                duration: 1000,
                complete: function(){
                    $(this).fadeOut('slow');
                    $('.slide-forward').css('display','block');
                    $('.slide-forward2').css('display','block');
                    $('.slide-back').css('display','block');
                    $('#structure-video').css('display','block');
                    $('#structure-video-2').css('display','block');
                    //reset();
                    /*slide4Left=setInterval(function(){
                        $('#'+segmentID+' .screen-4 .left-bar').animate({left:'-2px'},{
                            duration: 1000,
                            complete: function(){

                            }

                        });
                    },168000);*/

                }

            });
            
            }
            
        }

        function endSlideShow(){
            if(disableClicks == false){
            clearTimeout(slide1Right);
            clearTimeout(slide2Right);
            clearTimeout(slide3Right);
            clearTimeout(slide4Right);
            clearTimeout(slide1Left);
            clearTimeout(slide2Left);
            clearTimeout(slide3Left);
            clearTimeout(slide4Left);
            $('#go-back').removeClass('stage-2');
            $('#go-back').removeClass('stage-3');
            $('.screen-1').css('display','none');
            $('.screen-2').css('display','none');
            $('.screen-3').css('display','none');
            $('.screen-4').css('display','none');

            $('.text').css('display','none');
            
            $('.screen-1').stop();
            $('.screen-2').stop();
            $('.screen-3').stop();
            $('.screen-4').stop();
            $('#structure-video-2')[0].stop();
            $('.middle-section .left-bar').css('left','1.5px');
            $('.middle-section .right-bar').css('left','376.5px');

            $('#white-circle').animate({scale: '1'}, {
                duration: 10,
                complete: function() {

                    $('svg').animate({marginTop:'0px'}, {
                            duration: 1000,
                            complete: function() {

                            }
                    });

                    $('#see-yourself-working-in').animate({marginTop:'0px',scale:'1'}, {
                            duration: 1000,
                            complete: function() {
                                $('#see-yourself-working-in').fadeIn('slow');
                            }
                    });
                    $('#white-circle').animate({marginTop: '0px'},{
                                    duration: 1000,
                                    complete: function(){
                                        allowSpin = true;
                                        $('#logo').fadeIn('slow');
                                        animating = false;
                                        reset();
                                    }
                    });
                }
            });
                  
                  
                  
            $('.middle-section').fadeOut('slow');
                  
                  
             
            //$('#go-back').fadeIn('slow'); 
            $('#go-to-start').fadeIn('slow'); 


            blockAnimation = false;  
            }
        }
        
var previousSlide = 0; 
slideButtons();
function slideButtons(){
    
    $('.slide-forward').click(function(){
        if(disableClicks == false){
            reset();
            
        animating = true;
        $('#go-back').css('display','none');
        $('#skip-to-film').css('display','none');
        $('#skip-to-profile').css('display','none');
        $('#go-to-start').css('display','none');
        $('.slide-forward').css('display','none');
        $('.slide-forward2').css('display','none');
        $('.slide-back').css('display','none');
        clearTimeout(slide1Right);
        clearTimeout(slide2Right);
        clearTimeout(slide3Right);
        clearTimeout(slide4Right);
        clearTimeout(slide1Left);
        clearTimeout(slide2Left);
        clearTimeout(slide3Left);
        clearTimeout(slide4Left);



        $('#structure-video').css('display','none');
        $('#structure-video-2').css('display','none');

        $(this).parent().parent().prev().animate({left:'0px'},{
            duration: 1000,
            complete: function() {
                
                $('.screen').css('display','none');


               

                $('.text').css('display','none');

                $('.screen-1').stop();
                $('.screen-2').stop();
                $('.screen-3').stop();
                $('.screen-4').stop();

                var id = $(this).parent().parent().parent().attr('id');

                var slideNameArray = $(this).parent().attr('class').split(' ');
                var slideNumberArray = slideNameArray[0].split('-');


                $('#slide-number').val(parseInt(parseInt(slideNumberArray[1]) + parseInt(1)));
                startSlide($('#slide-number').val(), id);
                
            }
        });
        $('.right-bar').animate({left:'303px'},1000,function(){
            //reset();
        });

        }
    });
    
    $('.slide-forward2').click(function(){
        if(disableClicks == false){
            reset();
            $('.slide-forward2').css('display','none');
        animating = true;
        $('#go-back').css('display','none');
        $('#skip-to-film').css('display','none');
        $('#skip-to-profile').css('display','none');
        $('#go-to-start').css('display','none');
        $('.slide-forward').css('display','none');
        $('.slide-forward2').css('display','none');
        $('.slide-back').css('display','none');
        clearTimeout(slide1Right);
        clearTimeout(slide2Right);
        clearTimeout(slide3Right);
        clearTimeout(slide4Right);
        clearTimeout(slide1Left);
        clearTimeout(slide2Left);
        clearTimeout(slide3Left);
        clearTimeout(slide4Left);



        $('#structure-video').css('display','none');
        $('#structure-video-2').css('display','none');

        $(this).parent().parent().prev().animate({left:'0px'},{
            duration: 1000,
            complete: function() {
                
                $('.screen').css('display','none');


               

                $('.text').css('display','none');

                $('.screen-1').stop();
                $('.screen-2').stop();
                $('.screen-3').stop();
                $('.screen-4').stop();

                var id = $(this).parent().parent().parent().attr('id');

                var slideNameArray = $(this).parent().attr('class').split(' ');
                var slideNumberArray = slideNameArray[0].split('-');


                $('#slide-number').val(parseInt(parseInt(slideNumberArray[1]) + parseInt(2)));
                startSlide(5, id);
                
            }
        });
        $('.right-bar').animate({left:'303px'},1000,function(){
            //reset();
        });

        }
    });

    $('.slide-back').click(function(){
        if(disableClicks == false){
            
        animating = true;
        $('#go-back').css('display','none');
        $('#skip-to-film').css('display','none');
        $('#skip-to-profile').css('display','none');
        $('#go-to-start').css('display','none');
        $('.slide-forward').css('display','none');
        $('.slide-forward2').css('display','none');
        $('.slide-back').css('display','none');
        /*clearTimeout(slide1Right);
        clearTimeout(slide2Right);
        clearTimeout(slide3Right);
        clearTimeout(slide4Right);
        clearTimeout(slide1Left);
        clearTimeout(slide2Left);
        clearTimeout(slide3Left);
        clearTimeout(slide4Left);*/
        if($('#structure-video-2').length){
            $('#structure-video-2')[0].pause();
        }
        $('#structure-video').css('display','none');
        $('#structure-video-2').css('display','none');
        $('#scroller').css('display','none');

        $(this).parent().parent().prev().animate({left:'0px'},{
            duration: 1000,
            complete: function() {
                $('.screen').fadeOut('1');
                $('.screen-1').stop();
                $('.screen-2').stop();
                $('.screen-3').stop();
                $('.screen-4').stop();
                /*$('.screen-1').css('display','none');
                $('.screen-2').css('display','none');
                $('.screen-3').css('display','none');
                $('.screen-4').css('display','none');*/
                $('.screen-5').css('display','none');
                $('.text').css('display','none');

                var id = $(this).parent().parent().parent().attr('id');

                var slideNameArray = $(this).parent().attr('class').split(' ');
                var slideNumberArray = slideNameArray[0].split('-');

                

                $('#slide-number').val(parseInt(parseInt(slideNumberArray[1]) - parseInt(1)));



                startSlide($('#slide-number').val(), id);
                
            }
        });
        $('.right-bar').animate({left:'303px'},1000,function(){
            //reset();
        });
        }

    });
    
    $('.script-back').click(function(){
        if(disableClicks == false){
            reset();
            animating = true;
            $('#go-back').css('display','none');
            $('#skip-to-film').css('display','none');
            $('#skip-to-profile').css('display','none');
            $('#go-to-start').css('display','none');
            $('.slide-forward').css('display','none');
            $('.slide-forward2').css('display','none');
            $('.slide-back').css('display','none');
            /*clearTimeout(slide1Right);
            clearTimeout(slide2Right);
            clearTimeout(slide3Right);
            clearTimeout(slide4Right);
            clearTimeout(slide1Left);
            clearTimeout(slide2Left);
            clearTimeout(slide3Left);
            clearTimeout(slide4Left);*/
            if($('#structure-video-2').length){
                $('#structure-video-2')[0].pause();
            }
            $('#structure-video').css('display','none');
            $('#structure-video-2').css('display','none');
            $('#scroller').css('display','none');


            $('.screen').fadeOut('1');
            $('.screen-1').stop();
            $('.screen-2').stop();
            $('.screen-3').stop();
            $('.screen-4').stop();
            $('.screen-5').stop();
            $('.screen-5').css('display','none');
            $('.text').css('display','none');

            var id = $(this).parent().parent().attr('id');
            

            $('#slide-number').val(parseInt(3));



            startSlide($('#slide-number').val(), id);
            

        
        }

    });
}

$('#skip-to-profile').click(function(){
    if(disableClicks == false){
        reset();
    animating = true;
    $('#go-back').css('display','none');
    $('#skip-to-film').css('display','none');
    $('#skip-to-profile').css('display','none');
    $('#go-to-start').css('display','none');
    $('.slide-forward').css('display','none');
    $('.slide-forward2').css('display','none');
    $('.slide-back').css('display','none');
    clearTimeout(slide1Right);
    clearTimeout(slide2Right);
    clearTimeout(slide3Right);
    clearTimeout(slide4Right);
    clearTimeout(slide1Left);
    clearTimeout(slide2Left);
    clearTimeout(slide3Left);
    clearTimeout(slide4Left);



    $('#structure-video').css('display','none');
    $('#structure-video-2').css('display','none');

    slide = $('#slide-number').val();

    $('.screen-'+slide+' .left-bar').animate({left:'0px'},{
        duration: 1000,
        complete: function() {

            $('.screen').css('display','none');


            $('.screen-1').css('display','none');
            $('.screen-2').css('display','none');
            $('.screen-3').css('display','none');
            $('.screen-4').css('display','none');

            $('.text').css('display','none');

            $('.screen-1').stop();
            $('.screen-2').stop();
            $('.screen-3').stop();
            $('.screen-4').stop();


            $('#slide-number').val(4);
            
            startSlide(5, 'finance-slides');
            $('.slide-forward').css('display','block');
            $('.slide-forward2').css('display','block');
            $('.slide-back').css('display','block');
            //$('#structure-video').css('display','block');
            //$('#structure-video-2').css('display','block');
        }
    });
    $('.right-bar').animate({left:'303px'},1000,function(){
        //reset();
    });
    }
});

$('#skip-to-film').click(function(){
    if(disableClicks == false){
        reset();
    animating = true;
    $('#go-back').css('display','none');
    $('#skip-to-film').css('display','none');
    $('#skip-to-profile').css('display','none');
    $('#go-to-start').css('display','none');
    $('.slide-forward').css('display','none');
    $('.slide-forward2').css('display','none');
    $('.slide-back').css('display','none');
    clearTimeout(slide1Right);
    clearTimeout(slide2Right);
    clearTimeout(slide3Right);
    clearTimeout(slide4Right);
    clearTimeout(slide1Left);
    clearTimeout(slide2Left);
    clearTimeout(slide3Left);
    clearTimeout(slide4Left);



    $('#structure-video').css('display','none');
    $('#structure-video-2').css('display','none');

    slide = $('#slide-number').val();

    $('.screen-'+slide+' .left-bar').animate({left:'0px'},{
        duration: 1000,
        complete: function() {

            $('.screen').css('display','none');


            $('.screen-1').css('display','none');
            $('.screen-2').css('display','none');
            $('.screen-3').css('display','none');
            $('.screen-4').css('display','none');

            $('.text').css('display','none');

            $('.screen-1').stop();
            $('.screen-2').stop();
            $('.screen-3').stop();
            $('.screen-4').stop();


            $('#slide-number').val(4);
            
            startSlide(4, 'finance-slides');
            $('.slide-forward').css('display','block');
            $('.slide-forward2').css('display','block');
            $('.slide-back').css('display','block');
            $('#structure-video').css('display','block');
            $('#structure-video-2').css('display','block');
        }
    });
    $('.right-bar').animate({left:'303px'},1000,function(){
        //reset();
    });
    }
});

    $('#go-back').click(function(){
        if(disableClicks == false){
            animating = true;
              goBack();   
              
        }
    });
    
    
    
    function goBack(){
        reset();
        $('#explore').css('display','none');
        $('#logo').delay(3000).fadeIn(3000);
        $('#go-back').fadeOut('slow');
        $('#go-to-start').fadeOut('slow');
        $('#skip-to-film').fadeOut(1);
        $('#skip-to-profile').fadeOut(1);
        if($('#go-back').attr('class') == 'stage-1'){
            closeStage1();
            closeStage0();
        }
                        
        if($('#go-back').attr('class') == 'stage-2'){
            closeStage2();
        }
                   
        if($('#go-back').attr('class') == 'stage-3'){
            closeStage3();     
        }
    }  
    
    function closeStage0(){
        
        if(startScreen == false){
            
            
            
            closingStage0 = true;
            animating = true;
            clearTimeout(stageZeroTimer);
            clearTimeout(infoBoxTimer);
            //clearTimeout(window.myTimer);
            $('#skip-to-film').css('display','none');
            $('#skip-to-profile').css('display','none');
            $('#intro-slide-1 .left-bar').css('left','84px');
            $('#intro-slide-1 .right-bar').css('left','378px');
            $('#intro-slide-1').css('display','block');
            $('#intro-slide-1').css('margin-top','0px');
            $('#intro-slide-2').css('display','none');
            $('#intro-slide-2 .content p').css('display','none');
            $('#intro-slide-2 .left-bar').css('left','84px');
            $('#intro-slide-2 .right-bar').css('left','378px');
            $('#intro-slide-2').css('margin-top','0px');
            $('#intro-slide-3').css('display','none');
            $('#intro-slide-3').css('margin-top','-39px');
            $('#intro-slide-3 .left-bar').css('left','84px');
            $('#intro-slide-3 .right-bar').css('left','378px');
            $('#intro-slide-4').css('display','none');
            $('#intro-slide-4').css('margin-top','-66px');
            $('#intro-slide-4 .left-bar').css('left','84px');
            $('#intro-slide-4 .right-bar').css('left','378px');
            $('#intro-slide-5').css('display','none');
            $('#intro-slide-5').css('margin-top','-66px');
            $('#intro-slide-5 .left-bar').css('left','84px');
            $('#intro-slide-5 .right-bar').css('left','378px');
            $('#intro-slide-6').css('display','none');
            $('#intro-slide-6').css('margin-top','-26px');
            $('#intro-slide-6 .left-bar').css('left','84px');
            $('#intro-slide-6 .right-bar').css('left','378px');
            $('#intro-slide-7').css('display','none');
            $('#intro-slide-7').css('margin-top','0px');
            $('#intro-slide-7 #start').css('display','none');
            $('#intro-slide-7 .left-bar').css('left','84px');
            $('#intro-slide-7 .right-bar').css('left','378px');
            $('#intro-slide-7 .content p').css('display','none');
            $('.bar-middle').css('height','154px');
            $('#intro-slide-1 .left-bar').delay(2000).animate({'left':'-202px'},1000);
            $('#intro-slide-1 .right-bar').delay(2000).animate({'left':'660px'},1000, function(){
                animating = false; closingStage0 = false;
                introSlide1Done = false;
                introSlide2Done = false;
                introSlide3Done = false;
                introSlide4Done = false;
                introSlide5Done = false;
                introSlide6Done = false;
                introSlide7Done = false;
                
            });
            //$('#explore').delay(3000).css('display','block');
            $('#see-yourself-working-in').css('display','none');
            $('#white-circle').css('display','none');
            $('#info-box').css('display','none');
            $('#info-box-text').css('display','none');
            $('svg').css('display','none');
            $('#intro').fadeIn('slow',function(){
                $('#intro-slide-1 p').css('display','block');
                $('#explore').css('display','block');
            });
            
            $('#info-box').css('display','none');
            $('#info-box-text').css('display','none');
            $('#go-back').removeClass('stage-0');
            $('#go-back').css('display','none');
            $('#go-to-start').css('display','none');
            $('#go-back').attr('class','stage-start');
            disableClicks = false;
            startScreen = true;
            allowSpin = false;
        }
    }
    
    function closeStage1(){
        reset();
        $('#skip-to-film').css('display','none');
        $('#skip-to-profile').css('display','none');
        outer_circle.transform('s0');
        outer_shadow.transform('s0');
        inner_ring.transform('s0');
        drag_mask_circle.transform('s0');
        finance.transform('s0');
        finance.hide();
        
        for(x in segment_buttons){
            segment_buttons[x].hide();
        }
        
        $('#white-circle').css('display','none');
        $('#see-yourself-working-in').css('display','none');
        $('#white-circle').scale(0.1);
        $('#see-yourself-working-in').scale(0.1);
 
        $('#see-yourself-working-in').css('display','none');
        $('svg').css('display','none');
        //$('#intro').fadeIn('slow');

        $('#go-back').attr('class','stage-0');
        $('#info-box').css('display','none');
        $('#info-box-text').css('display','none');
        $('#go-back').removeClass('stage-1');
        $('#go-back').css('display','none');
        $('#go-to-start').css('display','none');
        
    }
    
    
    function closeStage2(){
        reset();
        $('#go-back').css('display','none');
        $('#skip-to-film').css('display','none');
        $('#skip-to-profile').css('display','none');
        $('#go-to-start').css('display','none');
        $('#'+current_segment+'-more-button').fadeOut('slow');
        $('#'+current_segment+'-text').fadeOut(100, function(){
                $('#top-segment-image').animate({scale:'0.1', left: '34%', top: '300px'}, {
                duration: 2000,
                complete: function() {
                    $(this).css('display','none');
                    //$(this).css('left','33.9%');
                    //$(this).css('top','100px');


                    clearTimeout(slide1Right);
                    clearTimeout(slide2Right);
                    clearTimeout(slide3Right);
                    clearTimeout(slide4Right);
                    clearTimeout(slide1Left);
                    clearTimeout(slide2Left);
                    clearTimeout(slide3Left);
                    clearTimeout(slide4Left);
                    
                    $('.screen-1').css('display','none');
                    $('.screen-2').css('display','none');
                    $('.screen-3').css('display','none');
                    $('.screen-4').css('display','none');

                    $('.text').css('display','none');

                    $('.screen-1').stop();
                    $('.screen-2').stop();
                    $('.screen-3').stop();
                    $('.screen-4').stop();

                    $('.middle-section .left-bar').css('left','1.5px');
                    $('.middle-section .right-bar').css('left','376.5px');



                    $('svg').animate({marginTop:'0px'}, {
                                    duration: 1000,
                                    complete: function() {

                                    }
                    });

                    $('#see-yourself-working-in').animate({marginTop:'0px',scale:'1'}, {
                                                            duration: 1000,
                                                            complete: function() {
                                                            $('#see-yourself-working-in').fadeIn('slow');
                                                                reset();
                                                            }
                                                            });
                    $('#white-circle').animate({scale:1, marginTop: '0px'},{
                                                duration: 1000,
                                                complete: function(){
                                                    
                                                    $('#go-back').removeClass('stage-2');
                                                    $('#go-back').removeClass('stage-3');
                                                    $('#go-back').attr('class','stage-1');
                                                    //$('#go-back').fadeIn('slow');
                                                    $('#go-to-start').fadeIn('slow');
                                                    allowSpin = true;
                                                }
                                                });




                    $('.middle-section').fadeOut('slow');

                }
            });
        });
        
        
        
    }

    function closeStage3(){
        
        reset();
        $('#go-back').css('display','none');
        $('#go-to-start').css('display','none');
        $('#skip-to-film').css('display','none');
        $('#skip-to-profile').css('display','none');
        
        if($('#structure-video-2').length && $('#slide-number').val() == 4){
            $('#structure-video-2')[0].pause();
            $('#structure-video-2')[0].webkitExitFullScreen();
            
            //delete($('#structure-video-2'));
            //$('.video-slide').remove();
            
            $('.video-slide').children().filter("video").each(function(){
                this.pause();
                delete(this);
                $(this).remove();
            });
            $('.video-slide').empty();

            
            //CollectGarbage();
        }
        skipFilm = true;

        clearTimeout(slide1Right);
        clearTimeout(slide2Right);
        clearTimeout(slide3Right);
        clearTimeout(slide4Right);
        clearTimeout(slide1Left);
        clearTimeout(slide2Left);
        clearTimeout(slide3Left);
        clearTimeout(slide4Left);
        
        $('.screen-1').css('display','none');
        $('.screen-2').css('display','none');
        $('.screen-3').css('display','none');
        $('.screen-4').css('display','none');
        $('.screen-5').css('display','none');

        $('.text').css('display','none');

        $('.screen-1').stop();
        $('.screen-2').stop();
        $('.screen-3').stop();
        $('.screen-4').stop();

        $('.middle-section .left-bar').css('left','1.5px');
        $('.middle-section .right-bar').css('left','376.5px');
        
        $('#white-circle').animate({scale: '1.5'}, {
                                    duration: 1000,
                                    complete: function() {
                                        
                                    $('svg').animate({marginTop:'0px'}, {
                                                    duration: 1000,
                                                    complete: function() {
                                                        
                                                    }
                                                    });

                                    $('#see-yourself-working-in').animate({marginTop:'0px',scale:'1'}, {
                                                                            duration: 1000,
                                                                            complete: function() {
                                                                            $('#see-yourself-working-in').fadeIn('slow');
                                                                                reset();
                                                                            }
                                                                            });
                                    $('#white-circle').animate({scale:1, marginTop: '0px'},{
                                                                duration: 1000,
                                                                complete: function(){
                                                                    $('#go-back').removeClass('stage-2');
                                                                    $('#go-back').removeClass('stage-3');
                                                                    $('#go-back').attr('class','stage-1');
                                                                    //$('#go-back').fadeIn('slow');
                                                                    $('#go-to-start').fadeIn('slow');
                                                                    allowSpin = true;
                                                                    scrollContent.refresh();
                                                                }
                                                                });
                                    }
                                    });



        $('.middle-section').fadeOut('slow');
        
        
        }
    
    $('#button').click(function(){
        
        scrollContent.refresh();
        
    });
    
    function activateTouchArea(elementID){  
	/* make sure our screen doesn't scroll when we move the "touchable area" */  
	var element = document.getElementById(elementID);  
	element.addEventListener("touchstart", touchStart2, false);
                  
   }
    
    function touchStart2(event) {
	event.preventDefault();
    event.stopPropagation();
    return false;
   }
                  
    $('#counter').click(function(){
        activateTouchArea('structure-video-2');
        
    });

});

























