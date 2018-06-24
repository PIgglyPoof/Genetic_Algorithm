// JavaScript source code
var popMax = 200;
var population = [popMax];
var string = "pokemon";
var mutation = 0.01;
var generation = 0;

var gen = document.getElementById("generation");
var muta = document.getElementById("mutation");
var stringHead = document.getElementById("bestString");

muta.textContent = mutation;


window.setTimeout(function () {


    for (var i = 0; i < popMax; ++i) {
        population[i] = new DNA(createString(string.length));
    }

    setup();

    function setup() {

        var maxScore = 0
        var maxIdx = 0 //index for string of maximum score

        console.log("Ittsy bitsey pigey");

        for (var i = 0; i < popMax; ++i) {

            var check = population[i].score;

            if (check > maxScore) {
                maxScore = check;
                maxIdx = i;
            }

            if (check === string.length) {

                stringHead.textContent = population[i].phrase;
                return;

            }
        }

        console.log("Ittsy bitsey pigey");
        ++generation;

        stringHead.textContent = population[maxIdx].phrase;
        gen.textContent = generation;
        setTimeout(mating, 10);

    }


    function countScore(phrase,index) {
        var score = 0;
        for (var i = 0; i < string.length; ++i) {
            if (string[i] == phrase[i]) {
                ++score;
            }
        }
        return score;
    }

    //Create a Random Char
    function getChar() {
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy z";
        return possible.charAt(Math.floor(Math.random() * possible.length));
    }

    function DNA(Phrase,index) {
        this.phrase = Phrase;
        this.score = countScore(Phrase,index);
    }

    // Create Random String
    function createString(maxSize) {
        var text = "";
        for (var i = 0; i < maxSize; ++i) {
            text += getChar();
        }
        return text;
    }

    // generating next generation
    function mating() {
        console.log("Ittsy bitsey pigey");


        var temporary = [popMax];
        var arr = [];
        for (var i = 0; i < popMax; ++i) {
            for (var j = 0; j < population[i].score ; ++j) {
                arr.push(i);
            }
        }


        console.log("Ittsy bitsey pigey");
        for (var i = 0; i < popMax; ++i) {
            var a = Math.floor(Math.random() * arr.length);
            var b = Math.floor(Math.random() * arr.length);
            temporary[i] = new DNA(reproduce(population[arr[a]].phrase, population[arr[b]].phrase));
        }


        population = [popMax];
        population = temporary;
        console.log("Ittsy bitsey pigey");

        setup();

    }


    // crossover and mutation
    function reproduce(a, b) {

        // newStr after cross over
        var newStr = a.substring(0, Math.floor(a.length / 2)) + b.substring(Math.floor(a.length / 2), a.length);

        newStr = newStr.split("");

        for (var i = 0; i < string.length; ++i) {
            if (newStr[i] != string[i]) {

                if (Math.random() < mutation)
                    newStr[i] = getChar();
            }
        }

        newStr = newStr.join("");

        return newStr;

    }


}, 2000);
