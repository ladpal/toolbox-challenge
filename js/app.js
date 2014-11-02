//app.js: our main javascript file

"use strict";


var prevTile;
var currentTile;
var currentImg;
var prevImg;
var tooSoon = false;
var timer;


var matchesLeft = 8;
var matches = 0
var fail = 0;
var done;

//checks to see if there was a match
function check() {
    if (currentTile.tileNum == prevTile.tileNum) {
        currentTile.matched = true;
        prevTile.matched = true;
        matchesLeft--;
        matches++;
        $('#matched-tiles').text(matches);
        $('#matches-left').text(matchesLeft);
        prevTile = null;
    } else {
        fail++;
        $('#wrong-matches').text(fail);
        tooSoon = true;
        window.setTimeout(function () {
            flipTile(currentTile, currentImg);
            flipTile(prevTile, prevImg);
            prevTile = null;
            tooSoon = false;
        }, 1000);
    }
}


//when document is ready..
$(document).ready(function () {
    $('#start-game').click(function () {
        setGameBoard();
        playGame();
        gameInstructions();

    });
});


function playGame() {
    $('#game-board img').click(function () {
        if (tooSoon === true) {
            return;
        }

        currentImg = $(this);//referring to the img
        currentTile = currentImg.data('tile');
        if (currentTile.matched == true) {
            return;
        }

        if (!prevTile) {
            flipTile(currentTile, currentImg);
            prevTile = currentTile;
            prevImg = currentImg;
        } else if (prevTile === currentTile) {
            return;
        } else {
            flipTile(currentTile, currentImg);
            check();
            done = (matches == 8);
            gameOver()
        }
    });
}



function gameOver() {
    if (done) {
        console.log('1');
        window.clearInterval(timer);
        $('#confirm-play-modal').modal();
        $('#confirm-play-again').click(function () {
            console.log('play again button clicked');
            $('#elapsed-seconds').text('0 seconds');
            setGameBoard();
            playGame();
        });
    }
}



function gameInstructions() {
    $('#help').click(function () {
        console.log('button has been clicked');
        window.location = 'http://eduplace.com/ss/act/rules.html';
    });
}



function setGameBoard () {
    done = false;
    prevTile = null;
    currentTile = null;
    currentImg = null;
    prevImg = null;
    $('#game-board').empty();
    matchesLeft = 8;
    matches = 0;
    fail = 0;
    window.clearInterval(timer);
    $('#wrong-matches').text(fail);
    $('#matched-tiles').text(matches);
    $('#matches-left').text(matchesLeft);
    var tiles = [];
    var idx;
    for (idx = 1; idx <= 32; idx++) {
        tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg',
            flipped: false,
            matched: false
        });//push the tiles into a tile array
    }
    tiles = _.shuffle(tiles);
    var selectedTiles = tiles.slice(0, 8);
    var tilePairs = [];
    _.forEach(selectedTiles, function (tile) {
        tilePairs.push(tile);
        tilePairs.push(_.clone(tile));
    });
    tilePairs = _.shuffle(tilePairs);

    var gameBoard = $('#game-board');
    var row = $(document.createElement('div'));
    var img;
    _.forEach(tilePairs, function (tile, elemIndex) {
        if (elemIndex > 0 && 0 == elemIndex % 4) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }
        img = $(document.createElement('img'));
        img.attr({
            src: 'img/gold-star.jpg',
            alt: 'tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img)
    });
    gameBoard.append(row);
    startTimer();
}


function startTimer() {//get starting milliseconds
    var startTime = Date.now();
    timer = window.setInterval(function () {
        var elapsedSeconds = (Date.now() - startTime) / 1000;
        elapsedSeconds = Math.floor(elapsedSeconds);
        if (elapsedSeconds <= 1) {
            $('#elapsed-seconds').text(elapsedSeconds + ' second');
        } else {
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
        }
    }, 1000);
}


function flipTile(tile, img) {
    if (tile.matched) {
        return;
    }
    img.fadeOut(100, function () {
        if (tile.flipped) {
            img.attr('src', 'img/gold-star.jpg');
        } else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
}