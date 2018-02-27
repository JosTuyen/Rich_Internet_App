"use strict";
	var Board = function(){
		//n rand 8...12: pusher rand bottomrow facing N
		//tgt edge
		//square content is weight :0,1,2,3 with p=0,2,1,1
		var state = 0;
		var moves = 0;
		var rDirec = [-1,0,1,0];
		var cDirec = [0,1,0,-1];
		//Generate table size, position of target & bob
		var n = 8+Math.floor(Math.random()*5);
		var targ = {"r":0, "c":0, "wt":0};
		var bob = {"r":0, "c":0, "dir":0, "origin":0};
		bob.r = n-1;
		bob.origin = bob.c = Math.floor(Math.random()*(n-1));
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
		targ.wt = b[targ.r][targ.c] = Math.floor(Math.random()*3)+1;
		b[bob.r][bob.c] = 0;

		function legalRC(r,c) {
			return r>=0, c>=0, r<n, c<n;
		}

		function isWin() {
			return targ.r === n-1 && targ.c === bob.origin;//Use the origin instead of current value
		}

		function count(dr, dc, wtLimit) {
			var r = bob.r + dr;
			var c = bob.c + dc;
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
				case 120: var tempDir = 4; //Explode - x
					break;
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
			if(tempDir === 4){
				var r = bob.r + rDirec[bob.dir];
				var c = bob.c + cDirec[bob.dir];
				if(legalRC(r,c) && b[r][c] !== 0 && !(r===targ.r && c===targ.c)){
					b[r][c] = 0;
					moves += 100;
					ret.kind = "explode";
					return ret;
				}else {return ret;}
			}
			else if( tempDir === bob.dir || (4 + tempDir - bob.dir) % 4 === 2){
					var wtLimit = (tempDir === bob.dir) ? 3 : 0;    //can push crates backing up
					var ct = count(rDirec[tempDir], cDirec[tempDir],wtLimit);
					if(ct < 0) return {"illegal":true};
					while(ct >= 0){
							var r = bob.r + ct * rDirec[tempDir];
							var c = bob.c + ct * cDirec[tempDir];
							if(r === targ.r && c === targ.c){
								targ.r += rDirec[tempDir];
								targ.c += cDirec[tempDir];
							}
							b[r + rDirec[tempDir]][c + cDirec[tempDir]] = b[r][c];
							ct--;
					}
					bob.r += rDirec[tempDir]; bob.c += cDirec[tempDir];
					moves ++;
					if(targ.r === n-1 && targ.c === bob.origin) state = 1; //victory
					if( tempDir === bob.dir){
							ret.kind = "push";
							return ret;
					}else{
							ret.kind = "back";
							return ret;
					}
			}else{
					bob.dir = tempDir;
					moves ++;
					ret.kind = "turn";
					return ret;
			}
		};
		//Access methods
		Board.prototype.getWon = function () {
			return state === 1;
		};
		Board.prototype.getMoves = function (){ return moves; };
		Board.prototype.getData = function () {
			return{"targ":targ, "bobc":bob.c, "bobr":bob.r, "n":n, "b":b, "dir":bob.dir
						 ,"origin":bob.origin, "targWt":targ.wt};
		};
	};
//            =====================Show on the browser=======================
	function showBoard(brd) {
		var direction = ["^",">","v","<"];
		var listTarg = ["A","B","C"];
		var listWage = [" ","1","2","3"];
		var viewText = "";
		var data = brd.getData();
		//==================drawTable================
		var graphic = document.getElementById('graphic');
		var table = graphic.getContext("2d");
		graphic.width = data.n*40;
		graphic.height = data.n*40;
		table.font = "20px Courier";
		table.lineWidth = 2;
		for(var s = 1; s<=data.n; s++){
			table.moveTo(s*40,0);
			table.lineTo(s*40,data.n*40);
			table.moveTo(0,s*40);
			table.lineTo(data.n*40,s*40);
			table.stroke();
		}
		//=================fillColor==================
		for(var r = 0; r < data.n; r++){
			for(var c = 0; c < data.n; c++){
				if(r === data.targ.r && c === data.targ.c){
					table.fillStyle = "#33cc33";
					table.fillRect(40*c,40*r,40*(c+1),40*(r+1));
				}
				else if( r === data.bobr && c === data.bobc){
					table.fillStyle = "#80dfff";
					table.fillRect(40*c,40*r,40*(c+1),40*(r+1));
				}
				else{
					switch (data.b[r][c]) {
						case 1:
							table.fillStyle = "#d24dff";
							break;
						case 2:
							table.fillStyle = "#9900cc";
							break;
						case 3:
							table.fillStyle = "#39004d";
							break;
						default:
							table.fillStyle = "#ebb3ff";
					}
					table.fillRect(40*c,40*r,40*(c+1),40*(r+1));
				}
			}
		}
		table.stroke();
		//=================fillData===========================
		table.strokeStyle = "#6666ff";
		for(var r = 0; r < data.n; r++){
			for(var c = 0; c < data.n; c++){
				if(r === data.targ.r && c === data.targ.c)
					table.strokeText(listTarg[data.targWt-1],40*c+13,40*r+27);
				else if( r === data.bobr && c === data.bobc)
					table.strokeText(direction[data.dir],40*c+13,40*r+27);
				else
					table.strokeText(listWage[data.b[r][c]],40*c+13,40*r+27);
			}
		}

		document.getElementById("moves").innerHTML = "Moves: "+brd.getMoves();

	}

	window.onload = function(){
		var brd = new Board();
		var start = true;
		var t;
		var count = 0;
		document.onkeypress =  function (ev){
			if(start){
				timeCount();
				start = false;
			}
			if(brd.getWon()) clearTimeout(t);
			if(brd.getWon()) {
				var r = confirm("You Won!\nYour moves is "+brd.getMoves()
												+"\nYour time is "+ Math.floor(count / 3600) +
												":" + checkTime(Math.floor(count / 60)) +
												":" + checkTime(count % 60)
												+"\nDo you want to play a new game?");
				if (r == true) {
					location.reload();
				}
			}
        var key = ev.keyCode;
        var ret = brd.move(key);
        showBoard(brd);
    };
		showBoard(brd);
		//Calculate time and showClock
		function timeCount() {
			count += 1;
			var h = Math.floor(count / 3600);
	    var m = Math.floor(count / 60);
	    var s = count % 60;
			m = checkTime(m);
			s = checkTime(s);
	    document.getElementById('txt').innerHTML =
	    "Time: "+ h + ":" + m + ":" + s;
			t = setTimeout(timeCount, 1000);
		}
	};
// add zero in front of numbers < 10
function checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}
