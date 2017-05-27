$(document).ready(settingUpGame);

var hubertMoves = 0; var playerMoves = 0; var hubertScore = 0; var playerScore = 0; var hubertID; var playerID;
var $location = $('#grid .row .box');

function keepingScore(player){
	if(player === 'comp') {
		hubertScore++;
	}
	if (player === 'user') {
		playerScore++;
	}
	$('#score p span[score="comp"]').html('Hubert: ' + hubertScore);
	$('#score p span[score="user"]').html('Player: ' + playerScore);
	return;
}

function rematchGame(winner){
	$('#turn').css('display','none');

	$('#reset').css({
		display:'block',
		height: '200px'
	});
	$('#grid').css('padding-top','0px');
	$('#reset p span[rematch="yes"]').one('click', function(event) {
		// Reset number of moves
		hubertMoves = 0;	
		playerMoves = 0;
		$('#reset').css('display','none');
		// $('#grid').css('padding-top','200px');
		// Reset what is on the grid
		$location.off();
		$('#grid .row .box span').attr('symbol','empty').html('');
		// Winner starts next game
		if (winner === 'user') {
			currPlayer(playerID);
			return;
		} else {
			hubert(hubertID);
			currPlayer(playerID);
			return;
		}
		return;
	});
	$('#reset p span[rematch="no"]').one('click', function(event) {
		hubertScore = 0;
		playerScore = 0;
		$('#score p span[score="comp"]').html('Hubert: ' + hubertScore);
		$('#score p span[score="user"]').html('Player: ' + playerScore);
		resetBoard();
	});
	return;
}

function resetBoard() {
	// Reset variables
	hubertMoves = 0;
	playerMoves = 0;
	hubertID;
	playerID;
	// Remove display
	$('#reset').css('display','none');
	// Reset what is on the grid
	$('#grid').css('padding-top', '0px');
	$location.off();
	$('#grid .row .box span').attr('symbol','empty').html('');
	$(".setup").off('click');
	settingUpGame();
	$('.setup').css('display', 'block');
	return;
}

function whosTurnItIs(turn) {
	$('#turn').css({
		display: 'block',
		height: '200px',
		fontSize: '32px',
		paddingTop: '50px'
	});
	if(turn === playerID) {
		$('#turn p').html(`It is <em>your </em> turn to play...`);
	}
	if(turn === hubertID) {
		$('#turn p').html("It is Hubert's turn to play...");
	}
}

// Identifying symbol to currPlayer & AI and who begins 
function settingUpGame() {
	var times = '<i class="fa fa-times fa-3x"></i>';
	var circle = '<i class="fa fa-circle-o fa-3x"></i>';
	// currPlayer chooses symbol at the begining of game
	$('.setup').one("click", function(event) {
		$('div.setup').css('display','none');
		playerID = event.target.outerHTML;
		if(playerID === times) {
			hubertID = circle;
		} else if(playerID === circle) {
			hubertID = times;
		}
		// Dedicing who start first
		if(getRandomNum(0,1) == 1) {
			currPlayer(playerID);
		} else {
			hubert(hubertID);
			currPlayer(playerID);
		}
	});	
}

// User turn
function currPlayer(symbol) {
	whosTurnItIs(symbol);
	console.log($location);
	$location.one("click", function(event) {
		countNumberOfMoves('user');
		var boxId = 'div#' + event.target.id + ' span';
		$(boxId).html(symbol);
		$(boxId).attr('symbol', 'user');
		if(winningCombinations('user')) {
			keepingScore('user');
			$('#turn p').html(`You won!!`).css({
				display: 'block',
				height: '200px',
				fontFamily: "'Fredericka the Great', cursive",
				fontSize: '50px',
				letterSpacing: '10px'
			});
			setTimeout(function(){
				rematchGame('user')
			},3000);
			return;
		} else if (isTieGame()){
			$('#turn p').html(`It's a tie!!`).css({
				display: 'block',
				height: '200px',
				fontFamily: "'Fredericka the Great', cursive",
				fontSize: '50px'
			});
			setTimeout(function(){
				rematchGame('user')
			},3000);
			return;
		}
		whosTurnItIs(hubertID);
		setTimeout(function() {
			hubert(hubertID)
		},2000);
	});
}

// Getting AI position for turn
function hubert(symbol) {
	whosTurnItIs(symbol);
	console.log('huberts turn starts');
	console.log(symbol);
	var boxId;
	// Computer may pick any position in the grid, as long as 'symbol' has the 'empty' attribute
	var position = getRandomNum(1,9);
	switch(true) {
		case position === 1:
		boxId = '#one span';
		break;
		case position === 2:
		boxId = '#two span';
		break;
		case position === 3:
		boxId = '#three span';
		break;
		case position === 4:
		boxId = '#four span';
		break;
		case position === 5:
		boxId = '#five span';
		break;
		case position === 6:
		boxId = '#six span';
		break;
		case position === 7:
		boxId = '#seven span';
		break;
		case position === 8:
		boxId = '#eight span';
		break;
		case position === 9:
		boxId = '#nine span';
		break;
	}
	if($(boxId).attr('symbol') !== "empty") {
		return hubert(hubertID);
	}
	$(boxId).html(symbol);
	$(boxId).attr('symbol', 'comp');
	countNumberOfMoves('comp');
	if(winningCombinations('comp')) {
		keepingScore('comp');
		rematchGame('comp');
		console.log('Hubert wins');
		return;
	}
	if(isTieGame()){
		rematchGame('comp');
		return;
	}
	whosTurnItIs(playerID);
	return;
}

function winningCombinations(player) {
	switch(true) {
		case $('#one span').attr('symbol') === player && $('#five span').attr('symbol') === player && $('#nine span').attr('symbol') === player:
		return true;
		break;
		case $('#one span').attr('symbol') === player && $('#two span').attr('symbol') === player && $('#three span').attr('symbol') === player:
		return true;
		break;
		case $('#one span').attr('symbol') === player && $('#four span').attr('symbol') === player && $('#seven span').attr('symbol') === player:
		return true;
		break;
		case $('#two span').attr('symbol') === player && $('#five span').attr('symbol') === player && $('#eight span').attr('symbol') === player:
		return true;
		break;
		case $('#four span').attr('symbol') === player && $('#five span').attr('symbol') === player && $('#six span').attr('symbol') === player:
		return true;
		break;
		case $('#three span').attr('symbol') === player && $('#six span').attr('symbol') === player && $('#nine span').attr('symbol') === player:
		return true;
		break;
		case $('#three span').attr('symbol') === player && $('#five span').attr('symbol') === player && $('#seven span').attr('symbol') === player:
		return true;
		break;
		case $('#seven span').attr('symbol') === player && $('#eight span').attr('symbol') === player && $('#nine span').attr('symbol') === player:
		return true;
		break;

		default:
		return false;
	}
}

function isTieGame() {
	if(playerMoves + hubertMoves === 9 && !winningCombinations('user') && !winningCombinations('comp')) {
		$('#container').css({
			backgroundColor: 'rgba(5,5,5,0.5)',
			zIndex: '10'
		});
	}
}

// Count number of moves at each turn
function countNumberOfMoves(turn) {
	if(turn === 'comp') {
		return hubertMoves++;
	}
	if (turn === 'user') {
		return playerMoves++;
	}
}

// Get random position
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
