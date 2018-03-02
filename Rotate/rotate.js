"use strict";
class Rotation {
  constructor(){
    this.a = "a";
    this.b = "b";
  }
  draw(){
    var graphic = document.getElementById('graphic');
    var ctx = graphic.getContext('2d');
    var img1 = new Image();
    var img2 = new Image();
    var img3 = new Image();
    var img4 = new Image();
    var array = [img1, img2, img3, img4, ""];
    var sources = ['1.png','2.png','3.png','4.png'];
    for (var i = 0; i < 4; i++) {
      array[i].src = sources[i];
    }
    var img5 = new Image();
    img5.src = 'crocodile.png';
    img1.onload = function () {
      for (var i = 0; i < 4; i++) {
        ctx.drawImage(array[i],40*i,40*i);
      }
      img2.src = '3.png';
      ctx.drawImage(img2,40,0);
      ctx.drawImage(img5,40,80,35,35);
    }


    /*ctx.translate(46,46);
    ctx.rotate((Math.PI / 180) * 90);
    ctx.translate(-46,-46);
    img.onload = function () {
      ctx.drawImage(img,30,30);
    };*/
  }
}

window.onload = function () {
  var rot = new Rotation();
  rot.draw()
  document.getElementById('content').innerHTML = "something"+rot.a+rot.b;
};
