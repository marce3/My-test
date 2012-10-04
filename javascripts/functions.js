$(document).ready(function(){
    $('#intro-slide-1 .left-bar').delay(2000).animate({'left':'-202px'},1000);
    $('#intro-slide-1 .right-bar').delay(2000).animate({'left':'660px'},1000, function(){
        $('#intro-slide-1 p').css('display','block');
    });
    $('#explore').delay(3000).fadeIn(1);
    $('svg').css('display','none');
    $('#top-segment-image').rotate(337);
    $('#top-segment-image').scale(0.1);
    $('#white-circle').scale(0.1);
    $('#see-yourself-working-in').scale(0.1);
    $('#see-yourself-working-in').css('display','none');
    $('#skip-slide-2').fadeOut(1);
    introSlide1Done = false;
    introSlide2Done = false;
    introSlide3Done = false;
    introSlide4Done = false;
    introSlide5Done = false;
    introSlide6Done = false;
    introSlide7Done = false;
});

var slide3Intro;
var slide4Intro;
var slide5Intro;
var slide6Intro;

var delay = 0;

$('#explore').click(function(){
    if(introSlide1Done == false){
        reset();
        if(closingStage0 == false && startScreen == true){
            startScreen = false;
            $('#go-back').attr('class','stage-0');
            introSlide7B(5000);
            $(this).css('display','none');
        }
        introSlide1Done = true;
    }
});

function introSlide2(delay){
    if(introSlide2Done == false){
        
        $('#logo img').css('display','block');
        reset();
        $('#intro-slide-1 .left-bar').animate({'left':'84px'},1000);
        $('#intro-slide-1 .right-bar').animate({'left':'378px'},1000, function(){
            $('#intro-slide-1').css('display','none');
            $('#intro-slide-2').css('display','block');
            $('.bar-middle').animate({height:'256px'},500, function(){
                $('#intro-slide-2 .content p').css('display','block');
            });
            $('#intro-slide-2').animate({'marginTop':'-45px'},500);
            $('#intro-slide-2 .left-bar').delay(500).animate({'left':'-202px'},1000);

            $('#intro-slide-2 .right-bar').delay(500).animate({'left':'647px'},1000, function(){

                slide3Intro=setTimeout(function(){
                    introSlide3(3750);
                },delay);

                $('#skip-slide-2').fadeIn(1).delay(3750).fadeOut(1);
            });
        });
        introSlide2Done = true;
    }
}

function introSlide3(delay){
    
    if(introSlide3Done == false){
        //$('#skip-slide-2').delay(delay).fadeOut(1);
        
        reset();
        $('#intro-slide-2 .left-bar').animate({'left':'84px'},1000);
        $('#intro-slide-2 .right-bar').animate({'left':'378px'},1000, function(){
            $('#intro-slide-2').css('display','none');
            $('#intro-slide-3').css('display','block');
            $('.bar-middle').animate({height:'256px'},500, function(){
                $('#intro-slide-3 .content p').css('display','block');
            });
            $('#intro-slide-3').animate({'marginTop':'-45px'},500);
            $('#intro-slide-3 .left-bar').delay(500).animate({'left':'-202px'},1000);
            $('#intro-slide-3 .right-bar').delay(500).animate({'left':'642px'},1000, function(){

                slide4Intro=setTimeout(function(){
                    introSlide4(3750);
                },delay);
                $('#skip-slide-3').fadeIn(1).delay(3750).fadeOut(1);
            });
        });
        introSlide3Done = true;
    }
    
}

function introSlide4(delay){
    
    if(introSlide4Done == false){
        
        reset();
        //$('#skip-slide-3').delay(delay).fadeOut(1);
        $('#intro-slide-3 .left-bar').animate({'left':'84px'},1000);
        $('#intro-slide-3 .right-bar').animate({'left':'378px'},1000, function(){
            $('#intro-slide-3').css('display','none');
            $('#intro-slide-4').css('display','block');
            $('.bar-middle').animate({height:'291px'},500, function(){
                $('#intro-slide-4 .content p').css('display','block');
            });
            $('#intro-slide-4').animate({'marginTop':'-60px'},500);
            $('#intro-slide-4 .left-bar').delay(500).animate({'left':'-147px'},1000);
            $('#intro-slide-4 .right-bar').delay(500).animate({'left':'599px'},1000, function(){

                slide5Intro=setTimeout(function(){
                    introSlide5(3750);
                },delay);
                $('#skip-slide-4').fadeIn(1).delay(3750).fadeOut(1);
            });
        });
        introSlide4Done = true;
    }
}

function introSlide5(delay){
    
    if(introSlide5Done == false){
        
        reset();
        $('#intro-slide-4 p').fadeIn(1000);
        //$('#skip-slide-4').delay(delay).fadeOut(1);
        $('#intro-slide-4 .left-bar').animate({'left':'84px'},1000);
        $('#intro-slide-4 .right-bar').animate({'left':'378px'},1000, function(){

            $('#intro-slide-4').css('display','none');
            $('#intro-slide-5').css('display','block');
            $('.bar-middle').animate({height:'218px'},500, function(){
                $('#intro-slide-5 .content p').css('display','block');
            });
            $('#intro-slide-5').animate({'marginTop':'-26px'},500);
            $('#intro-slide-5 .left-bar').delay(500).animate({'left':'-202px'},1000);
            $('#intro-slide-5 .right-bar').delay(500).animate({'left':'656px'},1000, function(){

                slide6Intro=setTimeout(function(){
                    introSlide6(3750);
                },delay);
                $('#skip-slide-5').fadeIn(1).delay(3750).fadeOut(1);
            });
        });
        introSlide5Done = true;
    }
}

function introSlide6(delay){
    
    if(introSlide6Done == false){
        
        reset();
        $('#intro-slide-5 p').fadeIn(0);
        //$('#skip-slide-5').delay(delay).fadeOut(1);
        $('#intro-slide-5 .left-bar').animate({'left':'84px'},1000);
        $('#intro-slide-5 .right-bar').animate({'left':'378px'},1000, function(){
            $('#intro-slide-5').css('display','none');
            $('#intro-slide-6').css('display','block');
            $('.bar-middle').animate({height:'291px'},500, function(){
                $('#intro-slide-6 .content p').css('display','block');
            });
            $('#intro-slide-6').animate({'marginTop':'-60px'},500);
            $('#intro-slide-6 .left-bar').delay(500).animate({'left':'-147px'},1000);
            $('#intro-slide-6 .right-bar').delay(500).animate({'left':'599px'},1000, function(){

                slide7Intro=setTimeout(function(){
                    introSlide7(3750);
                },delay);
                $('#skip-slide-6').fadeIn(1).delay(3750).fadeOut(1);
            });
        });
        introSlide6Done = true;
    }
}        

function introSlide7(delay){
    
    if(introSlide7Done == false){
        
        reset();
        $('#intro-slide-6 p').fadeIn(0);
        //$('#skip-slide-6').delay(delay).fadeOut(1);
        $('#intro-slide-6 .left-bar').animate({'left':'84px'},1000);
        $('#intro-slide-6 .right-bar').animate({'left':'378px'},1000, function(){
            $('#intro-slide-6').css('display','none');
            $('#intro-slide-7').css('display','block');

            //$('.left-bar img').animate({height:'460px'},1000);
            $('.bar-middle').animate({height:'370px'},500, function(){
                $('#intro-slide-7 .content p').css('display','block');
            });
            $('#intro-slide-7').animate({'marginTop':'-100px'},500);


            $('#intro-slide-7 .left-bar').delay(500).animate({'left':'-202px'},1000);
            $('#intro-slide-7 .right-bar').delay(500).animate({'left':'642px'},1000, function(){
                $('#intro-slide-7 #start').fadeIn(0);
                //$('#intro-slide-7 .left-bar').delay(5000).animate({'left':'0px'},500);
                //$('#intro-slide-7 .right-bar').delay(5000).animate({'left':'187px'},500, function(){

                //});
            });
        });
        introSlide7Done = true;
    }
    
}

function introSlide7B(delay){
    
    if(introSlide7Done == false){
        
        reset();
        $('#intro-slide-1 .left-bar').animate({'left':'84px'},1000);
        $('#intro-slide-1 .right-bar').animate({'left':'378px'},1000, function(){
            $('#intro-slide-1').css('display','none');
            $('#intro-slide-7').css('display','block');

            //$('.left-bar img').animate({height:'460px'},1000);
            $('.bar-middle').animate({height:'370px'},500, function(){
                $('#intro-slide-7 .content p').css('display','block');
                
            });
            $('#intro-slide-7').animate({'marginTop':'-100px'},500);


            $('#intro-slide-7 .left-bar').delay(500).animate({'left':'-202px'},1000);
            $('#intro-slide-7 .right-bar').delay(500).animate({'left':'642px'},1000, function(){
                $('#intro-slide-7 #start').fadeIn(0);
                $('#intro-slide-1').css('display','none');
                //$('#intro-slide-7 .left-bar').delay(5000).animate({'left':'0px'},500);
                //$('#intro-slide-7 .right-bar').delay(5000).animate({'left':'187px'},500, function(){

                //});
            });
        });
        introSlide7Done = true;
    }
    
}


$('#skip-slide-2').click(function(){
    
    $(this).css('display','none');
    clearTimeout(slide3Intro);
    introSlide3(3750);
    reset();
});

$('#skip-slide-3').click(function(){
    
    $(this).css('display','none');
    clearTimeout(slide4Intro);
    introSlide4(3750);
    reset();
});

$('#skip-slide-4').click(function(){
    
    $(this).css('display','none');
    clearTimeout(slide5Intro);
    introSlide5(3750);
    reset();
});

$('#skip-slide-5').click(function(){
    
    $(this).css('display','none');
    clearTimeout(slide6Intro);
    introSlide6(3750);
    reset();
});

$('#skip-slide-6').click(function(){
    
    $(this).css('display','none');
    clearTimeout(slide7Intro);
    introSlide7(3750);
    reset();
});