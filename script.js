var car=[];
var food = [];
var poison = [];
var mr = 0.01;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    for (var i = 0; i < 50; ++i) {
        car[i] = new Vehicle(random(50, window.innerWidth-50), random(50, window.innerHeight-50));
    }

    for (var i = 0; i < 40; ++i) {
        food.push(createVector(random(50, window.innerWidth - 50), random(50, window.innerHeight - 50)));
    }

    for (var i = 0; i < 10; ++i) {
        poison.push(createVector(random(50, window.innerWidth - 50), random(50, window.innerHeight - 50)));
    }
}

function draw() {
    background(255);
    var target = new createVector(mouseX, mouseY);

    if (random(1) < 0.05) {
        food.push(createVector(random(1, window.innerWidth), random(1, window.innerHeight)));
    }

    if (random(1) < 0.01) {
        poison.push(createVector(random(1, window.innerWidth), random(1, window.innerHeight)));
    }
    
    for (var i = 0; i < food.length; ++i) {
        noStroke();
        fill(23, 150, 30);
        ellipse(food[i].x, food[i].y, 20, 20);
    }

    
    for (var i = 0; i < poison.length; ++i) {
        noStroke();
        fill(150, 10, 150);
        ellipse(poison[i].x, poison[i].y, 20, 20);
    }

    for (var i = car.length-1; i >= 0; --i) {
        car[i].display();
        car[i].behaviour(food, poison);
        //car.eat(poison);
        // car.seek(target);
        car[i].boundary();
        car[i].update();

        var newCar = car[i].clone();
        if (newCar != null) {
            car.push(newCar);
        }

        if (car[i].dead()) {
            car.splice(i, 1);
        }
    }
}

function Vehicle(x, y,dna) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 6;
    this.maxspeed = 5;
    this.maxforce = 0.5;
    this.health = 1;

    this.dna = [];

    if (!dna) {
        this.dna[0] = random(-2, 2);  // food weight
        this.dna[1] = random(-2, 2);  //poison wight
        this.dna[2] = random(0, 200);    // food perception
        this.dna[3] = random(0, 200);  //poison perception
    }
    else {
        this.dna = dna;
    }

    this.clone = function () {
        if (random(1) < 0.001) {
            return new Vehicle(this.position.x, this.position.y, this.dna);
        }
        else {
            return null;
        }
    }

    this.behaviour=function(good,bad){
        var steerG=this.eat(good,0.1,this.dna[2]);
        var steerB=this.eat(bad,-0.5,this.dna[3]);

        steerG.mult(this.dna[0]);
        steerB.mult(this.dna[1]);

        this.applyForce(steerG);
        this.applyForce(steerB);
    }

    this.update = function () {
        this.health -= 0.002;
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelerationelertion to 0 each cycle
        this.acceleration.mult(0);
    }

    this.boundary = function () {
        var d = 25;
        var desired = null;

        if (this.position.x < d) {
            desired = createVector(this.maxspeed, this.velocity.y);
        } else if (this.position.x > window.innerWidth - d) {
            desired = createVector(-this.maxspeed, this.velocity.y);
        }

        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.maxspeed);
        } else if (this.position.y > window.innerHeight - d) {
            desired = createVector(this.velocity.x, -this.maxspeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxspeed);
            var steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }

    // A method that calculates a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    this.seek = function (target) {

        var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

        // Scale to maximum speed
        desired.setMag(this.maxspeed);

        // Steering = Desired minus velocity
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force

        return steer;
    }

    this.eat = function (list,nutrition,perception) {
        var record = 200000000;
        var closestIndex = -1;
        for (var i = 0; i < list.length; ++i) {
            var d = this.position.dist(list[i]);

            if (d < this.maxspeed) {
                this.health += nutrition;
                list.splice(closestIndex, 1);
                --i;
            }


            else if (d < record && d < perception) {
                closestIndex = i;
                record=d;
            }
        }

        if (record < 20) {
            this.health += nutrition;
            list.splice(closestIndex, 1);
        }

        else if(closestIndex>-1){
            return this.seek(list[closestIndex]);
        }

        return createVector(0, 0);
    }

    this.dead = function () {
        return this.health < 0;
    }

    this.applyForce = function (force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }

    this.display = function () {
        // Draw a triangle rotated in the direction of velocity
        var angle = this.velocity.heading() + PI / 2;

        push();
        translate(this.position.x, this.position.y);
        rotate(angle);
        noFill();
        stroke(0, 255, 0);
        line(0, 0, 0, -this.dna[0] * 25);
        ellipse(0, 0, this.dna[2] * 2);
        stroke(255, 0, 0);
        line(0, 0, 0, -this.dna[1] * 25);
        ellipse(0, 0, this.dna[3] * 2);

        var gr = color(0, 255, 0);
        var rd = color(255, 0, 0);
        var col = lerpColor(rd, gr, this.health);

        fill(col);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }
}