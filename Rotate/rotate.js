"use strict";

window.onload = function () {
  var graphic = document.getElementById('graphic');
  var ctx = graphic.getContext("2d");
  var img = new Image();
  var state = true;
  img.src = "ace.jpg";
  graphic.height = 450;
  graphic.width = 450;
  ctx.lineWidth = 3;
  ctx.fillStyle = "#ff80ff";
  ctx.fillRect(0,0,450,450);
  ctx.strokeRect(150,150,150,150);
  ctx.clearRect(150,150,150,150);

  img.onload = function () {
    ctx.drawImage(img,185,165,80,120);
    document.onclick = function () {
      state = !state;
      var rotating = setInterval(function () {
        ctx.clearRect(185,165,80,120);
        ctx.translate(225,225);
        if(!state) ctx.rotate(Math.PI/180);
        ctx.translate(-225,-225);
        ctx.drawImage(img,185,165,80,120);
        if(state)  clearInterval(rotating);
      },6);
    };
  };
};
