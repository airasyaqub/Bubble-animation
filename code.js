$(document).ready(function() {
	// body... 
	var canvas=$('canvas');
	//canvas.attr({'width':window.innerWidth,'height':window.innerHeight});
	canvas[0].width=window.innerWidth;
	canvas[0].height=window.innerHeight;
	var c=$("canvas")[0].getContext('2d');

	function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

	var mouse={
		x:undefined,
		y:undefined
	};

	$(window).resize(function(){
    	canvas[0].width=window.innerWidth;
    	canvas[0].height=window.innerHeight;
    	init();
	});

	$(window).mousemove(function(event){
    		mouse.x=event.pageX;
    		mouse.y=event.pageY;
		});

	var colorArray=['blue','black','yellow','orange','red'];
	function particle(x,y,radius){
		this.x=x;
		this.y=y;
		this.radius=radius;
		this.color=colorArray[Math.floor(Math.random()*colorArray.length)];;
		this.velocity={
			x:getRandomInt(-2,2),
		   	y:getRandomInt(-2,2)
		};
		this.mass=1;

		this.draw=function(){
			c.beginPath();
			c.arc(this.x,this.y,this.radius,0*Math.PI,2*Math.PI,false);
			c.fillStyle=this.color;
			//c.strokeStyle=this.color;
			c.fill();
			c.stroke();
		};


		this.update=function(particles){

			for(var i=0;i<particles.length;i++){
				if(this===particles[i]){continue;}
				if(getDistance(this.x,this.y,particles[i].x,particles[i].y)-(radius+particles[i].radius)<0){
					resolveCollision(this,particles[i]);
				}
			}


			if(this.x+this.radius>=innerWidth||this.x-this.radius<=0){
				this.velocity.x=-this.velocity.x;
			}
			if(this.y+this.radius>=innerHeight||this.y-this.radius<=0){
				this.velocity.y=-this.velocity.y;
			}

			this.x+=this.velocity.x;
			this.y+=this.velocity.y;

			this.draw();
		};
	}


	function getDistance(x1,y1,x2,y2){
		var xDist=x1-x2;
		var yDist=y1-y2;
		return Math.sqrt(Math.pow(xDist,2)+Math.pow(yDist,2));
	}

	function getRandomInt(min, max) {
  		min = Math.ceil(min);
  		max = Math.floor(max);
  		return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}


	var particles=[];
	var x;
	var y;
	var radius;
	var color;
	init();
	function init(){
		//console.log(particles);
		for (var i = 0; i < 100; i++) {
			 radius=15;
			 x=getRandomInt(radius,innerWidth-radius);
			 y=getRandomInt(radius,innerHeight-radius);
			 color='blue';
			 //console.log(i);
			if (i!=0){
				for (var j = 0; j < particles.length; j++) {
					//console.log(particles[j].radius);
					if( getDistance(x,y,particles[j].x,particles[j].y)-(radius+particles[j].radius)<0){
						x=getRandomInt(radius,innerWidth-radius);
			 			y=getRandomInt(radius,innerHeight-radius);
						j=-1;
					}
				}
			}
			particles.push(new particle(x,y,radius,color));
		}


	}
	
	

	function animate(){
		requestAnimationFrame(animate);
		c.clearRect(0,0,innerWidth,innerHeight);
		particles.forEach( function(element, index) {
			element.update(particles);
		});
	}

		requestAnimationFrame(animate);
});