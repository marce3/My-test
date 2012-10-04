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

$(document).ready(function(){
	app.initialise();
	
	var paper = Raphael(0, 0, "100%", "100%");
	var paper_center_x = $('svg:first').width() / 2;
	var paper_center_y = $('svg:first').height() / 2;
	var outer_circle_r = (749 / 2);
	var elements_to_spin = [];

	//add elements to paper, order of adding is z index?
	var outer_circle = paper.image('images/wheel21.png', (paper_center_x - outer_circle_r), (paper_center_y - outer_circle_r), (outer_circle_r * 2), (outer_circle_r * 2));
	var inner_circle = paper.image('inner_wheel.png', (paper_center_x - outer_circle_r), (paper_center_y - outer_circle_r), (outer_circle_r * 2), (outer_circle_r * 2));
	//var spokes = paper.image('spokes.png', (paper_center_x - outer_circle_r), (paper_center_y - outer_circle_r), (outer_circle_r * 2), (outer_circle_r * 2));
	
        
	//add drag mask
	var drag_mask_circle = paper.circle(paper_center_x, paper_center_y, outer_circle_r);
	
	//wedge test
	var wedge = paper.path( wedge_stuff.get_path(paper_center_x, paper_center_y, outer_circle_r, 0,  (360 / 13) ) ); //THIS IS TOTALLY GUESSED, NEED TO CALCULATED IT LATER ON!!!!
	wedge.attr("fill", "#0066A2");
	wedge.attr("stroke-width", 0);
	//animations.scale_out([wedge]);
	wedge.transform('s0,0,'+ paper_center_x +','+ paper_center_y);
	
	//dot for clicking...
	var inner_dot = paper.circle(paper_center_x, paper_center_y, 55); //x y radus
	
        var structuring = paper.text(paper_center_x, paper_center_y - 350, "Finance");
        structuring.attr('fill','#ffffff');
        structuring.attr('font-size','26');
        
        
        
	//to spin array
	elements_to_spin.push(outer_circle);
	//elements_to_spin.push(structuring);
	elements_to_spin.push(inner_dot);
	elements_to_spin.push(drag_mask_circle);
	
	//tmp drag mask, will be fully trans at end
	//drag_mask_circle.attr("fill", "90-#f00:5-#00f:95");
	drag_mask_circle.attr("fill", "#FFFFFF");
	drag_mask_circle.attr("stroke-width", 0);
	drag_mask_circle.attr('transform', "r0");
	drag_mask_circle.attr('opacity', 0);
        
        
	//see yourself inner dot
	inner_dot.attr("fill", "#ffffff");
	inner_dot.attr("stroke-width", 0);
	
	//for touching and spinning
	var touch_count = 0;
	var prev_x = undefined;
	var prev_y = undefined;
	var which_way = 1;
	var remember_c = 0;
	var tmp_running_angle = 0;
	
	//scale in test
	animations.scale_out(elements_to_spin.concat(inner_circle));
	//animations.scale_in([outer_circle, drag_mask_circle, inner_dot, structuring]);
	//end
        
        $('#skip-intro').click(function(){
            $('#intro').fadeOut(2000,function(){
                $('svg').css('display','block');
                animations.scale_in([outer_circle, drag_mask_circle, inner_dot, structuring]);
            });
        });
        
        $('#start').click(function(){
            $('#intro').fadeOut(2000,function(){
                $('svg').css('display','block');
                animations.scale_in([outer_circle, drag_mask_circle, inner_dot, structuring]);
            });
        });
	
	
	//touch events
	drag_mask_circle.touchmove(function(e){
		e.preventDefault();
		
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
                        
                        structuring.attr('transform', ("r"+tmp_running_angle+","+paper_center_x+","+paper_center_y));
		}
		
		prev_x = e.pageX;
		prev_y = e.pageY;
		touch_count++;
	});
	
	drag_mask_circle.touchend(function(e){
		//momentum
		if( remember_c != undefined ){
			//remember_c
			
			var ease_incrament = (5 * remember_c);
			
			if(which_way === 1){
				tmp_running_angle = tmp_running_angle + ease_incrament;
			}else{
				tmp_running_angle = tmp_running_angle - ease_incrament;
			}
			
			//drag_mask_circle.animate({transform:('r' + tmp_running_angle)}, 500, '>');
			if(remember_c > 3){
				for (x in elements_to_spin){
				  elements_to_spin[x].animate({transform:('r' + tmp_running_angle)}, ((remember_c * 18) + 500), '>');
				}
                                structuring.animate({transform:('r' + tmp_running_angle+","+paper_center_x+","+paper_center_y)}, ((remember_c * 18) + 500), '>');
			}
		}
		
		//reset count to stop jumping & reset c for momentum
		touch_count = 0;
		remember_c = 0;
	});
	
	
	//click center
	var dot_click = 0;
	inner_dot.click(function(){
		if(dot_click === 0){
			animations.scale_in([inner_circle]);
			elements_to_spin.push(inner_circle);
		}
		
		if(dot_click === 1){
			wedge_stuff.build_in(wedge, paper_center_x, paper_center_y, elements_to_spin);
		}
		
		dot_click++;
	});
        
        structuring.click(function(){
            alert("r" + tmp_running_angle +",10,10");
        });


 
});

























