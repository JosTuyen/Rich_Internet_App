"use strict";
	var Board = function(){
		//n rand 8...12: pusher rand bottomrow facing N
		//tgt edge
		//square content is weight :0,1,2,3 with p=0,2,1,1
		var n;
		var targ,bob;
		var listValue;

		n = 8+Math.floor(Math.random()*5); //Generate table size
		targ = {"r":0, "c":0};
		bob = {"r":0, "c":0};
		//Generate new board
		var b = [];
		listValue = [1,1,2,3,0,0,0,0,0,0];
		for(var r = 0;r < n;r++){
			var col =[];
			for(var c = 0; c < n;c++){
				var idx = Math.floor(Math.random()*listValue.length);
				col[c]=listValue[idx];
			}
			b[r] = col;
		}
		bob.c = Math.floor(Math.random()*n);
		targ.c = Math.floor(Math.random()*n);
		targ.r = Math.floor(Math.random()*n);
		function isWin() {
			return targ.r === bob.r && targ.c === bob.c;
		}
		Board.prototype.getWon = function () {
			return{"hasWon":isWin()}
		};
		Board.prototype.getData = function () {
			return{"targ":targ, "bob":bob, "n":n, "b":b};
		};
	};

	function showBoard(brd) {
		var direc = 0;
		var direction = ["^",">","v","<"];
		var viewText = "";
		var data = brd.getData();
		for(var r = data.n-1; r >= 0; r--){
			for(var c = 0; c < data.n; c++){
				if(r === data.targ.r && c === data.targ.c)
					viewText += "T  ";
				else if( r === data.bob.r && c === data.bob.c)
					viewText += direction[direc]+"  ";
				else
					viewText += data.b[r][c]+"  ";
			}
			viewText += "<br>";
		}
		document.getElementById("board").innerHTML = viewText;
	}

	window.onload = function(){
		var brd = new Board();
		showBoard(brd);
	};
