//app.js: our main javascript file

"use strict";

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
var prevTile;
var currentTile;
var currentImg;
var prevImg;
var tooSoon = false;
var timer;
var endGame
//var startedGame;
//var clickedImg;

var matchesLeft = 8;
var matches = 0
var fail = 0;
var done;
//var clickedData;



console.log(tiles);

/*if (clicked) {
    flipTile(tile, clickedImg)
    oldImg = clickedImg;
    clicked = null;
}*/


function check() {
    if (currentTile.tileNum == prevTile.tileNum) {
        currentTile.matched = true;
        prevTile.matched = true;
        matchesLeft--;
        matches++;
        $('#matched-tiles').text(matches);
        $('#matches-left').text(matchesLeft);
        done = (matches == 8);
        console.log(done);
        console.log('matchesLeft:  ' + matchesLeft + ', matches: ' + matches + ', failed attempts: ' + fail);
        prevTile = null;
        }
        /*clicked.matched = true;
        clicked.flipped = true;
        tile.matched = true;
        tile.flipped = true;
        matchesLeft--;
        matches++;*/
    else {
        fail++;
        $('#wrong-matches').text(fail);
        console.log(fail);
        tooSoon = true;
        console.log(tooSoon);
        window.setTimeout(function () {
            console.log(tooSoon);
            console.log(currentTile);
            console.log(prevTile);
            flipTile(currentTile, currentImg);
            flipTile(prevTile, prevImg);
            prevTile = null;
            tooSoon = false;
            console.log(tooSoon);
        }, 1000);
    }
}

//when document is ready..
$(document).ready(function () {

    //catch click event of start game button
    $('#start-game').click(function () {
        $('#help').click(function () {
            console.log('button has been clicked');
            window.location = 'http://google.com';
        });
        $('#game-board').empty();
        matchesLeft = 8;
        matches = 0
        fail = 0;
        window.clearInterval(timer);
        $('#wrong-matches').text(fail);
        $('#matched-tiles').text(matches);
        $('#matches-left').text(matchesLeft);
        console.log('start game button clicked!');
        tiles = _.shuffle(tiles);
        var selectedTiles = tiles.slice(0, 8);
        var tilePairs = [];
        _.forEach(selectedTiles, function (tile) {
            tilePairs.push(tile);
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);
        console.log(tilePairs);

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

        //get starting milliseconds
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


        $('#game-board img').click(function () {
            if (tooSoon === true) {
                return;
            }

            //console.log(this.alt);
            currentImg = $(this);//referring to the img
            currentTile = currentImg.data('tile');
            if (currentTile.matched == true) {
                return;
            }
            //currentTile.flipped = true;
            //console.log(currentTile);
            // console.log(tile);
            // console.log(tile.tileNum);
            console.log(tooSoon);
            if (!prevTile) {
                flipTile(currentTile, currentImg);
                prevTile = currentTile;
                prevImg = currentImg;
                //console.log(prevTile);
                //clickedData = clickedImg;
            } else if (prevTile === currentTile) {
                return;
            } else {
                console.log("this is the second click");
                flipTile(currentTile, currentImg);
                check();
                window.setTimeout(function () {
                    if (done) {
                        $('#confirm-exit-modal').modal();
                        $('#confirm-exit-button').click(function() {
                            $('#game-board').empty();
                            matchesLeft = 8;
                            matches = 0
                            fail = 0;
                            window.clearInterval(timer);
                        });
                    }
                }, 1000);
                console.log(tooSoon);
                /*clicked = null;
                 clickedData = null;*/
            }
            //flipTile(tile, clickedImg);
            //clicked = tile;
        });


        //start game button click

    });
});//document ready function

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
        //var which = tile.tileNum;
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
        //play(tile, img, which);
    });
    done = (matches == 8);
}




//function stopTimer() {
   // window.clearInterval(timer);
//}

/*function replay() {
    if ()
    if (window.confirm("Do you want to play again?")) {
        $('#game-board').empty();
    }
}*/

//function play(tile, img, which) {
   // if (tile.tileNum =)


//}

//$(#game-board.empty(); - clears the element
//variables for tracking game shouldn't be in click event handler (could be global)
//how do I know when I started a turn? : two clicks, or clicked the first time
//clicking on an image and using data function - need a variable to remember previous tile and should
//be same scope as game trackers - what img and what tile was clicked on
//if ( name of variable) if variable doesnt have a value its the first click of the turn
//otherwise its the second move of the turn. compare the values. we store the first click in a variable
//so if the second click has the same tile num then they match. if they don't match: -increment missed, flip back
//if they match: increment matches, decrement remaining. don't flip back over.
//if flipped property is set to true - ignore click event (just return(?)). reset variables back to null
//or undefined after two clicks on different tiles. if remaining = 0 then congratulate the user and have
//an option to play again which resets all the values. make sure to not let user click another
//tile until the last two tiles have been flipped back over. have boolean set to false, but set it to
//true in setTimeout function and put test in click area and if its true just return