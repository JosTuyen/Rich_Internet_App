"use strict";
	var Board = function(){
		//n rand 8...12: pusher rand bottomrow facing N
		//tgt edge
		//square content is weight :0,1,2,3 with p=0,2,1,1
		var dir = 0;
		var rDirec = [-1,0,1,0];
		var cDirec = [0,1,0,-1];
		//Generate table size, position of target & bob
		var n = 8+Math.floor(Math.random()*5);
		var targ = {"r":0, "c":0};
		var bobc, bobr;
		bobr = n-1;
		bobc = Math.floor(Math.random()*(n-1));
		targ.c = Math.floor(Math.random()*(n-2)+1);
		targ.r = Math.floor(Math.random()*(n-2)+1);
		//Generate new board
		var b = [];
		var listValue = [1,1,2,3,0,0,0,0,0,0];
		for(var r = 0;r < n;r++){
			var col =[];
			for(var c = 0; c < n;c++){
				var idx = Math.floor(Math.random()*listValue.length);
				col[c]=listValue[idx];
			}
			b[r] = col;
		}

		function getWeight(r,c){
			var weight = 0;
			if(typeof[b[r][c]]==='number')
				while(c<n && r < n && c >= 0 && r>=0){
					weight += b[r][c];
					switch (dir) {
						case 0: c++;
							break;
						case 1: r++;
							break;
						case 2: c--;
							break;
						default: r--;
					}
			}
			return weight;
		}

		function isWin() {
			return targ.r === bobr && targ.c === bobc;//Use the origin instead of current value
		}

		function canMove(r,c) {
			var overWeight = getWeight(r, c)>3;
			var boundLimit;
			while(r+rDirec[dir]!=0, c+cDirec[dir]!=0){
				r += rDirec[dir];
				c += cDirec[dir];
				if(r<0 || c<0 || r===n || c===n){
					boundLimit = false;
					break;
				}
			}
			return !overWeight && boundLimit;
		}

		function count(r, c) {
			var numStep = 0;
			while(r+rDirec[dir]!=0, c+cDirec[dir]!=0){
				r += rDirec[dir];
				c += cDirec[dir];
				numStep ++;
			}
			return numStep;
		}

		Board.prototype.move = function (command) {
			var illegal = false;
			var ret = this.getData();

			switch (command) {
				case 119: this.dir = 0; //Up - w
					break;
				case 100: this.dir = 1; //Right - d
					break;
				case 115: this.dir = 2; //Down - s
					break;
				case 97: this.dir = 3; //Left - a
					break;
				default:
					illegal = true;
			}

			if(illegal || canMove(bobr, bobc, dir) || isWin()) return ret;
			var totalStep = count(bobr, bobc);
			while(totalStep>0) {
				var r = bobr + totalStep*rDirec[this.dir];
				var c = bobc + totalStep*cDirec[this.dir];
				b[r+rDirec][c+cDirec] = b[r][c];
				totalStep--;
			}
			bobr = r + rDirec[this.dir];
			bobc = c + cDirec[this.dir];
		};
		//Access methods
		Board.prototype.getWon = function () {
			return{"hasWon":isWin()}
		};
		Board.prototype.getData = function () {
			return{"targ":targ, "bobc":bobc, "bobr":bobr, "n":n, "b":b, "dir":dir};
		};
	};
//            =====================Show on the browser=======================
	function showBoard(brd) {
		var direction = ["^",">","v","<"];
		var viewText = "";
		var data = brd.getData();
		for(var r = 0; r < data.n; r++){
			for(var c = 0; c < data.n; c++){
				if(r === data.targ.r && c === data.targ.c)
					viewText += "T  ";
				else if( r === data.bobr && c === data.bobc)
					viewText += direction[data.dir]+"  ";
				else
					viewText += data.b[r][c]+"  ";
			}
			viewText += "<br>";
		}
		document.getElementById("board").innerHTML = viewText;
	}

	window.onload = function(){
		var brd = new Board();
		document.onkeypress =  function (ev){
        var key = ev.keyCode;
        var ret = brd.move(key);
        showBoard(brd);
    };
		showBoard(brd);
	};
