p5.disableFriendlyErrors = true;
let logo;

let x;
let y;
let logo_scale = 0.16;
let logo_speed = 0.012;
let logo_width;
let logo_height;
let xspeed;
let yspeed;
let myFile;

let timeOutFunctionId;

function preload(){
  loadImage("https://a101cinema.info/main.gif",loadedImage);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  background(0);
  logo_width = updatescale(logo_scale);
  updatelogoHeight();
  x = random(0,windowWidth-logo_width);
  y = random(0,windowHeight-logo_height);
  xspeed = logo_width*logo_speed;
  yspeed = logo_width*logo_speed;
}



function draw() {
  blendMode(BLEND);
  background('rgba(0,0,0, 0.15)');
  blendMode(ADD);
  if(logo!=undefined) {image(logo,x,y,logo_width,logo_height)}
  else {rect(x,y,logo_width,logo_height)}

  x = x + xspeed*deltaTime*0.05;
  y = y + yspeed*deltaTime*0.05;
  
  if (x+logo_width>=windowWidth || x<=0){xspeed=-xspeed}

  if (y+logo_height>=windowHeight || y<=0){yspeed=-yspeed}
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  clearTimeout(timeOutFunctionId);
  timeOutFunctionId = setTimeout(updatecanvas, 200);
}
function updatecanvas(){
  logo_width = updatescale(logo_scale, 0);
  updatelogoHeight()
  if((x+logo_width>=windowWidth || x<=0) || (y+logo_height>=windowHeight || y<=0)){
    x = random(0,windowWidth-logo_width);
    y = random(0,windowHeight-logo_height);
  }
  xspeed = logo_width*logo_speed*Math.sign(xspeed);
  yspeed = logo_width*logo_speed*Math.sign(yspeed);
}

function updatescale(scale_ratio, bias){
  updatelogoHeight();
  if (windowWidth > windowHeight){
    return scale_ratio * windowWidth}
  else{
    return scale_ratio * windowHeight}
}

function updatelogoHeight(){
  if(logo!=undefined){
    logo_height = logo_width/logo.width * logo.height}
  else{
    logo_height = logo_width*0.6}
}

function loadedImage(img){
  logo = img;
  logo_width = updatescale(logo_scale, 0);
  updatelogoHeight();
}

