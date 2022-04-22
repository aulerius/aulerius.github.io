p5.disableFriendlyErrors = true;
let logo;

let x;
let y;
let logo_width;
let logo_height;
let xspeed;
let yspeed;

function preload(){
  loadImage("main.gif",function(loadedImage){logo = loadedImage});
  //print(logo);
}

function setup() {
  
  frameRate(60);
  logo_width = 280;
  if(logo!=undefined) {logo_height = logo_width/logo.width * logo.height}
  else {logo_height = logo_width*0.6}
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
  if(logo!=undefined) {logo(logo,x,y,logo_width,logo_height)}
  else {rect(x,y,logo_width,logo_height)}

  
  x = x + xspeed;
  y = y + yspeed;
  
  if (x+logo_width>=windowWidth || x<=0){xspeed=-xspeed}

  if (y+logo_height>=windowHeight || y<=0){yspeed=-yspeed}
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  x = random(0,windowWidth-logo_width);
  y = random(0,windowHeight-logo_height);
  background(0);
}
