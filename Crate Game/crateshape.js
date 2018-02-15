"use strict";
(function(){
	var Board = function(){
		var n = 8;
		var b = [[1,4,9,2],[0,0,0,1],[2,1,0,0],[3,2,4,1]];
		this.toString = function(){
			var out = "";
			for(var r=0;r<4;r++){
				for(var c=0;c<4;c++) out =  out + " " + b[r][c];
				out=out+'\n';
			}
			return  "n="+ n + '\n'+out; 
		};
	};
	var brd = new Board();
	window.onclick = function(){
		var input = prompt(""+brd);
	};
})();


