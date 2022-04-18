let logo;

let x;
let y;
let logo_width;
let logo_height;
let xspeed;
let yspeed;

function preload(){
  logo = loadImage("main.gif");
  
}

function setup() {
  frameRate(60);
  logo_width = 200;
  logo_height = logo_width/logo.width * logo.height;
  createCanvas(windowWidth, windowHeight);
  x = random(0,windowWidth-logo_width);
  y = random(0,windowHeight-logo_height);
  xspeed = 3;
  yspeed = 3;
  background(0);
}



function draw() {
  blendMode(BLEND);
  background('rgba(0,0,0, 0.15)');
  blendMode(ADD);
  image(logo,x,y,logo_width,logo_height);
  
  x = x + xspeed;
  y = y + yspeed;
  
  if (x+logo_width>=windowWidth || x<=0){xspeed=-xspeed}

  if (y+logo_height>=windowHeight || y<=0){yspeed=-yspeed}
  
}
