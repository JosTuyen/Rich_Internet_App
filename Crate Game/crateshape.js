"use strict";
	var Board = function(){
		//n rand 8...12: pusher rand bottomrow facing N
		//tgt edge
		//square content is weight :0,1,2,3 with p=0,2,1,1
		var state = 0;
		var score = 0;
		var dir = 0;
		var rDirec = [-1,0,1,0];
		var cDirec = [0,1,0,-1];
		//Generate table size, position of target & bob
		var n = 8+Math.floor(Math.random()*5);
		var targ = {"r":0, "c":0};
		var bobc, bobr;
		var origin;
		bobr = n-1;
		origin = bobc = Math.floor(Math.random()*(n-1));
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
		b[targ.r][targ.c] = 1;
		b[bobr][bobc] = 0;

		function legalRC(r,c) {
			return r>=0, c>=0, r<n, c<n;
		}

		function isWin() {
			return targ.r === n-1 && targ.c === origin;//Use the origin instead of current value
		}

		function count(dr, dc, wtLimit) {
			var r = bobr + dr;
			var c = bobc + dc;
			var tot=0;  //total push weight
			var q = 0;  //num crates being pushed
			while( legalRC(r,c) ){
					tot = tot +b[r][c];
					if(tot>wtLimit) return -1;
					if(b[r][c]===0) return q;
					q = q+1;
					r=r+dr; c=c+dc;
			}
			return -1;
		}

		Board.prototype.move = function (command) {
			var ret = this.getData();
			ret.kind = "illegal";
			if(this.getWon()) return ret;

			switch (command) {
				case 119: var tempDir = 0; //Up - w
					break;
				case 100: var tempDir = 1; //Right - d
					break;
				case 115: var tempDir = 2; //Down - s
					break;
				case 97: var tempDir = 3; //Left - a
					break;
				default:
					return ret;
			}

			if( tempDir === dir || (4 + tempDir - dir) % 4 === 2){
					var wtLimit = (tempDir === dir) ? 3 : 0;    //can push crates backing up
					var ct = count(rDirec[tempDir], cDirec[tempDir],wtLimit);   //returns 0 if just bob, up to 3 for bob&3 crates, -1
					if(ct < 0) return {"illegal":true};
					var amt = ct;//Do what???
					while(ct >= 0){
							var r = bobr + ct * rDirec[tempDir];
							var c = bobc + ct * cDirec[tempDir];
							if(r === targ.r && c === targ.c){
								targ.r += rDirec[tempDir];
								targ.c += cDirec[tempDir];
							}
							b[r + rDirec[tempDir]][c + cDirec[tempDir]] = b[r][c];
							ct--;
					}
					bobr += rDirec[tempDir]; bobc += cDirec[tempDir];
					score ++;
					if(targ.r === n-1 && targ.c === origin) state = 1; //victory
					if( tempDir === dir){
							ret.kind = "push";
							ret.amt = amt;
							return ret;
					}else{
							ret.kind = "back";
							return ret;
					}
			}else{
					dir = tempDir;
					score ++;
					ret.kind = "turn";
					return ret;
			}
		};
		//Access methods
		Board.prototype.getWon = function () {
			return state === 1;
		};
		Board.prototype.getScore = function (){ return score; };
		Board.prototype.getData = function () {
			return{"targ":targ, "bobc":bobc, "bobr":bobr, "n":n, "b":b, "dir":dir
						 ,"origin":origin};
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
				if(brd.getWon()) {
					var r = confirm("You Won! Do you want to play a new game");
					if (r == true) {
						location.reload();
					}
				}
    };
		showBoard(brd);
	};
