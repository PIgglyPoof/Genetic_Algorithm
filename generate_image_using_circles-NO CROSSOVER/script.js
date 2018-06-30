var numPolygon = 50;
var sidePolygon = 4;
var parent = [];
var fitnessParent = 999999999;
var fitnessChild = 0;
var width;
var height;
var noOfCircle = 50;
var circles = [noOfCircle];
var mutation = 0.1;
var generation = 1;
var mutationIndex = 0;
var gen = document.getElementById("generation");
var positionOLD;
var colorsOLD;
var radiusOLD;
var img;


function preload() {
    img = loadImage("https://i.imgur.com/jqWUxiI.jpg");
    pixelDensity(1);
}



function setup() {
    width=img.width;
    height=img.height;
    createCanvas(width, height);

    for (var i = 0; i < noOfCircle; ++i) {
        circles[i] = new Circle();
        circles[i].assignValue();
    }

    gen.textContent = generation;

    reDraw();

    /* SOME TEST STUFF
    loadPixels();
    img.loadPixels();
    for (var i = 0; i < (width ) * (height) * 4 ; i += 4) {
        pixels[i] = 255-img.pixels[i];
        pixels[i + 1] = 255-img.pixels[i+1];
        pixels[i + 2] = 255-img.pixels[i+2];
    }

    updatePixels();
    */

    /*
    loadPixels();
    for (var i = 0; i <= (img.width) * (img.height) * 4 ; i += 4) {
        pixels[i] = parent[i];
        pixels[i + 1] = parent[i + 1];
        pixels[i + 2] = parent[i + 2];
        pixels[i + 3] = parent[i + 3];

    }
    updatePixels();
    */
}

function reDraw() {
    background(255);

    storeBeforeMutation(circles[mutationIndex]);

    circles[mutationIndex].mutation();

    noStroke();

    if (circles[mutationIndex].checkMutation) {

        for (var i = 0; i < noOfCircle; ++i) {
            circles[i].showCircle();
        }

        fitnessChild = calculateFitness();

        if (fitnessChild < fitnessParent) {
            fitnessParent = fitnessChild;
            ++generation;
            console.log("poke");
        }
        else {
            console.log("poke2");
            revertToOld(circles[mutationIndex]);
        }

        circles[mutationIndex].checkMutation = false;

        gen.textContent = generation + ' ' + fitnessParent + ' ' + fitnessChild;

        ++mutationIndex;
        if (mutationIndex == noOfCircle)
            mutationIndex = 0;
    }

    setTimeout(reDraw);
}



var Circle=function(){

    this.position=[2];
    this.colors = [4];
    this.radius;
    this.checkMutation = false;

    // assign random values
    this.assignValue = function () {

        this.radius = Math.floor(random(width));

        this.position = [Math.floor(random(width)),Math.floor(random(height))];

        for (var i = 0; i < 3; ++i) {
            this.colors[i] = 255;
        }

        this.colors[3] = 80;

    }

    // display circles
    this.showCircle = function () {
        fill(this.colors[0], this.colors[1], this.colors[2], this.colors[3]);
        ellipse(this.position[0], this.position[1], this.radius);
    }


    // mutation
    this.mutation = function () {

        if (random() < mutation) {
            this.radius = Math.floor(random(width));
            this.checkMutation = true;
        }
        
      
        if (random() < mutation) {
            this.position[0] = Math.floor(random(width));
            this.checkMutation = true;
        }

        if (random() < mutation) {
            this.position[1] = Math.floor(random(height));
            this.checkMutation = true;
        }
       
        for (var i = 0; i < 3; ++i) {
            if (random() < mutation) {
                this.colors[i] = Math.floor(random(256));
                this.checkMutation = true;
            }
        }
        
    }

}


function storeBeforeMutation(circle) {
    positionOLD = circle.position.slice();
    colorsOLD = circle.colors.slice();
    radiusOLD = circle.radius;
}

function revertToOld(circle) {
    circle.position = positionOLD.slice();
    circle.colors = colorsOLD.slice();
    circle.radius = radiusOLD;
}


// calculate fitness
function calculateFitness() {
    var fitness=0;
    loadPixels();
    img.loadPixels();
    for (var i = 0; i < (img.width) * (img.height) * 4 ; i += 4) {
        fitness += ((pixels[i] - img.pixels[i]) * (pixels[i] - img.pixels[i]) + (pixels[i + 1] - img.pixels[i + 1]) * (pixels[i + 1] - img.pixels[i + 1]) + (pixels[i + 2] - img.pixels[i + 2]) * (pixels[i + 2] - img.pixels[i + 2])) / 100000;
    }
    updatePixels();
    return fitness;
}