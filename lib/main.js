var tetra = {
	rows: 0,
	cols: 0,

	// Each line represents the space block fills in a 4x4 space from each rotation
	// You can create your own blocks here
	pieces: [
		// T
		[ [[1,1,1,0],[0,1,0,0],[0,0,0,0],[0,0,0,0]],
		  [[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
		  [[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
		  [[0,1,0,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]]
		],
		// |
		[
		  [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
		  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
		  [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
		  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]]
		],
		// L
		[
		  [[0,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,0,0]],
		  [[0,0,0,0],[1,1,1,0],[1,0,0,0],[0,0,0,0]],
		  [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]],
		  [[0,0,0,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]]
		],
		// J
		[
		  [[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
		  [[0,1,1,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],
		  [[0,0,0,0],[1,1,1,0],[0,0,1,0],[0,0,0,0]],
		  [[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,0,0,0]]
		],
		// Z
		[
		  [[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
		  [[0,1,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]],
		  [[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
		  [[0,1,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]]
		],
		// S
		[
		  [[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]], 
		  [[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],
		  [[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]],
		  [[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]]
		],
		// Square
		[
		  [[1,1,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],
		  [[1,1,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],
		  [[1,1,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],
		  [[1,1,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]]
		]
	],
	timer: null,
	speed: null,
	grid: null,
	rowpoints: null,
	levelpoints: null,
	timeinc: null,

	defaults: {
		rowpoints: 10,
		levelpoints: 100, 
		timeinc: 25,
		timer: null,
		speed: 300,
		grid: null
	},

	game: {

		active: null,
		level: null,
		score: null,

		defaults: {
			active: false,
			level: 1,
			score: 0
		},

		init: function(){
			// restore defaults
			$.extend(tetra, tetra.defaults);
			$.extend(tetra.game, tetra.game.defaults);
			$.extend(tetra.piece, tetra.piece.defaults);

			tetra.Control.init();
			tetra.display.reset();
			tetra.screen.draw();
		},

		main: function(){
			if (tetra.piece.activepiece === null){
				tetra.piece.newpiece();
			}
			else{
				tetra.piece.displayblock(0,1);
			}
			tetra.screen.draw();
		},

		stop: function(){
			tetra.game.active = false;
			clearInterval(tetra.timer);
		},

		start: function(){
			tetra.game.active = true;
			tetra.display.reset();
			tetra.timer = setInterval(function(){tetra.game.main();}, tetra.speed);
		},

		pause: function(){
			tetra.game.active = false;
			clearInterval(tetra.timer);
		},

		resume: function(){
			tetra.game.active = true;
			tetra.timer = setInterval(function(){tetra.game.main();}, tetra.speed);
		},

		restart: function(){
			tetra.game.init();
			tetra.game.start();
		},

		scorecrunch: function(){
			tetra.game.score += tetra.rowpoints;
			if (tetra.game.score > tetra.game.level*tetra.levelpoints){
				tetra.game.newlevel();
			}
		},

		newlevel: function(){
			tetra.game.level++;
			tetra.speed -= tetra.timeinc;
			clearInterval(tetra.timer);
			tetra.timer = setInterval(function(){tetra.game.main();}, tetra.speed);
		},

		lost: function(){
			tetra.game.active = false;
			clearInterval(tetra.timer);
			tetra.piece.nextpiece = null;
			tetra.screen.draw();
		}
	},

	// Arrow keys
	Control: {
		initialised: false,

		init: function (){
			if (tetra.Control.initialised !== true){
				if ($.browser.mozilla) {
				    $(document).keypress(tetra.Control.keypress);
				} else {
				    $(document).keydown(tetra.Control.keypress);
				}
				tetra.Control.initialised = true;
			}
		},

		keypress: function(e){
			e.preventDefault();
			switch(e.keyCode){
				case 37: tetra.Control.left();  break;
				case 39: tetra.Control.right(); break;
				case 40: tetra.Control.down();  break;
				case 38: tetra.Control.toggle();    break;
			}
		},

		left: function(){
			if (tetra.game.active === true){
				tetra.piece.displayblock(-1,0);
				tetra.screen.draw();
			}
		},

		right: function(){
			if (tetra.game.active === true){
				tetra.piece.displayblock(1,0);
				tetra.screen.draw();
			}
		},

		down: function(){
			if (tetra.game.active === true){
				tetra.piece.displayblock(0,1);
				tetra.screen.draw();
			}
		},

		toggle: function(){
			if (tetra.game.active === true){
				tetra.piece.toggle();
				tetra.screen.draw();
			}
		}
	},


	// Form pieces & behaviors
	piece: {
		xpos: null,
		ypos: null,
		activepiece: null,
		nextpiece: null,
		piecetoggle: null,

		defaults: {
			nextpiece: null,
			activepiece: null,
			piecetoggle: 0,
			xpos: null,
			ypos: null
		},

		newpiece: function(){
			tetra.piece.activepiece = (tetra.piece.nextpiece === null) ? Math.floor(Math.random()*(tetra.pieces.length)) : tetra.piece.nextpiece;
			tetra.piece.nextpiece = Math.floor(Math.random()*(tetra.pieces.length));
			tetra.piece.xpos = tetra.piece.ypos = null;
			tetra.piece.piecetoggle = 0;
			
			// blocks are slightly biased against spawning on the right wall, but this avoids all placement glitches with T piece
			var xstart = Math.floor(Math.random() * tetra.cols) - 4;
			if (xstart < 0)
				xstart = 0;
			
			if (tetra.piece.curposition(xstart, 0) !== true){
				tetra.game.lost();
				return false;
			}
			tetra.screen.drawnext();
			
			tetra.piece.move(xstart, 0);
			
			var randdir = Math.floor((Math.random()*4));
			// Forms a random direction
			while (randdir > 0) {
				tetra.Control.toggle();
				randdir--;
			}
		},

		displayblock: function(xmove,ymove){
			if (tetra.piece.activepiece === null){
				return false;
			}
			var x = tetra.piece.xpos + xmove;
			var y = tetra.piece.ypos + ymove;
			var curpos = tetra.piece.curposition(x,y);
			if (curpos !== true){
				if (curpos == "x"){
					x = tetra.piece.xpos;
					curpos = tetra.piece.curposition(x,y);
					if (curpos !== true){
						tetra.piece.move(x,y);
						return true;
					}
				}
				if(curpos == "y"){
					if (y === 0){
						tetra.game.lost();
						return false;
					}
					else{
						tetra.piece.placepiece();
						return true;
					}
				}
			}
			tetra.piece.move(x,y);
			return true;
		},

		curposition: function(x,y){

			if (tetra.piece.activepiece === null){
				return false;
			}

			
			var curgame = $.extend(true, [], tetra.grid.slice());
			tetra.display.deletepiece(curgame);

			for (var i = 0; i < 4; i++){
				for (var j = 0; j < 4; j++){
					if (tetra.pieces[tetra.piece.activepiece][tetra.piece.piecetoggle][i][j] == 1){

						// check new position is within the bounds of the grid
						if ((i+y) >= tetra.rows){
							return "y";
						}
						if ((j+x) < 0 || (j+x) >= tetra.cols){
							return "x";
						}

						// check new position doesn't collide with any docked pieces
						if (curgame[i+y][j+x] !== 0){
							if (tetra.piece.xpos != x){
								// would the piece collide if wasn't moved in x direction?
								if(curgame[i+y][j+tetra.piece.xpos] === 0){
									return "x";
								}
							}
							return "y";
						}
					}
				}
			}
			return true;
		},

		move: function(x,y){
			// reset piece's old position on the grid
			if(tetra.piece.xpos !== null && tetra.piece.ypos !== null){
				for (var i = 0; i < 4; i++){
					for (var j = 0; j < 4; j++){
						if (tetra.pieces[tetra.piece.activepiece][tetra.piece.piecetoggle][i][j] !== 0){
							tetra.display.changeblock(j+tetra.piece.xpos, i+tetra.piece.ypos, -1);
						}
					}
				}
			}
			// update piece's new position on the grid
			for (var i = 0; i < 4; i++){
				for (var j = 0; j < 4; j++){
					if (tetra.pieces[tetra.piece.activepiece][tetra.piece.piecetoggle][i][j] !== 0){
						tetra.display.changeblock(j+x, i+y, tetra.piece.activepiece);
					}
				}
			}
			tetra.piece.xpos = x;
			tetra.piece.ypos = y;
		},

		placepiece: function(){
			tetra.piece.activepiece = tetra.piece.xpos = tetra.piece.ypos = null;
			tetra.display.wintest();
		},

		toggle: function(){
			if (tetra.piece.activepiece !== null){
				tetra.display.deletepiece(tetra.grid);
				var originalToggle = tetra.piece.piecetoggle;
				tetra.piece.piecetoggle++;
				if (tetra.piece.piecetoggle >= 4){
					tetra.piece.piecetoggle = 0;
				}
				if(tetra.piece.curposition(tetra.piece.xpos, tetra.piece.ypos) !== true){
					tetra.piece.piecetoggle = originalToggle;
				}
				tetra.piece.move(tetra.piece.xpos, tetra.piece.ypos);
			}
		}
	},

	display: {

		reset: function(){
			tetra.grid = [];
			for (var i = 0; i < tetra.rows; i++){
				tetra.grid[i] = [];
				for (var j = 0; j < tetra.cols; j++){
					tetra.grid[i][j] = 0;
				}
			}
		},

		changeblock: function(x,y,val){
			if (x<0 || x >= tetra.cols || y<0 || y >= tetra.rows){
				return false;
			}
			else{
				tetra.grid[y][x] = val+1;
			}
			return true;
		},

		deletepiece: function(grid){
			if(tetra.piece.xpos !== null && tetra.piece.ypos !== null){
				for (var i = 0; i < 4; i++){
					for (var j = 0; j < 4; j++){
						if (tetra.pieces[tetra.piece.activepiece][tetra.piece.piecetoggle][i][j] !== 0){
							grid[i+tetra.piece.ypos][j+tetra.piece.xpos] = 0;
						}
					}
				}
			}
		},

		wintest: function(){

			if (tetra.piece.activepiece !== null){
				return false;
			}

			var isComplete;
			for (var i = 0; i < tetra.rows; i++){
				isComplete = true;
				for (var j = 0; j < tetra.cols; j++){
					if (tetra.grid[i][j] === 0){
						isComplete = false;
						break;
					}
				}
				if (isComplete){
					tetra.display.deleterow(i);
					tetra.game.scorecrunch();
				}
			}
		},

		deleterow: function(row){
			for (var i = row; i >= 0; i--){
				for (var j = 0; j < tetra.cols; j++){
					if (i===0){
						tetra.grid[0][j] = 0;
					}
					else{
						tetra.grid[i][j] = tetra.grid[i-1][j];
					}
				}
			}
		}
	},

	// Draw game with jQuery
	screen: {
		draw: function(){
			var html = "<table>";
			for (var i=0; i<tetra.rows; i++){
				html += "<tr>";
				for (var j=0; j<tetra.cols; j++){
					html += "<td class='b"+tetra.grid[i][j]+"'></td>";
				}
				html += "</tr>";
			}
			html += "</table>";
			$("#tetra").html(html);
		},

		drawnext: function(){
			var html = "";
			for (var i = 0; i < 4; i++){
				html += "<tr>";
					for (var j = 0; j < 4; j++){
						if (tetra.piece.nextpiece !== null && tetra.pieces[tetra.piece.nextpiece][0][i][j] !== 0){
							html += "<td class='b"+(tetra.piece.nextpiece +1)+"'></td>";
						}
						else{
							html += "<td class='b0'></td>";
						}
					}
				html += "</tr>";
			}
			$("#nextpiece").html(html);
		}
	},
	
	popFront: function() {
		$('#tetracont').css('opacity', '1');
		$('#curl').fadeOut('slow');
		$('#content').fadeOut('slow');
		$('#close').fadeIn('slow');
	},
	
	popBack: function() {
		$('#tetracont').css('opacity', '0.8');
		$('#curl').fadeIn('slow');
		$('#content').fadeIn('slow');
		$('#close').fadeOut('slow');
	}

};

$(document).ready(function(){
	// Change block size depending on window size, remove 1 for clipping
	tetra.rows = Math.floor($(window).height() / 37) - 1;
	tetra.cols = Math.floor($(window).width() / 38);
	
	// Start game
	tetra.game.init();
	tetra.game.start();

	// Create peel
	$( '#target' ).fold({side: 'right', directory: 'lib'});
});