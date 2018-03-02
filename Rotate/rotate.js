"use strict";

window.onload = function () {
  var graphic = document.getElementById('graphic');
	var ctx = graphic.getContext("2d");
  var img = new Image();
  img.src = 'giraffe.png';
  ctx.lineWidth = 5;
  ctx.height = 500;
  ctx.width = 500;
  ctx.fillRect = (20,20,50,50);
  //ctx.lineTo(300,300);
  //ctx.lineTo(200,300);
  ctx.strokeStyle = "#ff3333";

  img.onload = function () {
    ctx.drawImage(img,200,200);
    ctx.beginPath();
    ctx.moveTo(200,200);
    ctx.lineTo(300,200);
    ctx.stroke();
  }
  ctx.moveTo(200,200);
  ctx.lineTo(300,200);
  ctx.stroke();
  document.getElementById('content').innerHTML = "Click";
};
