let gradientShader,dataShader,
    dataTexture,
    CNV,cnvW,cnvH,
    A = [-1,-1,-1],//coordinates of current line segment
    B = [-1,-1,-1],//coordinates of current line segment
    segmentCounter = 0,
    clickIsBlocked = false;
    // topColHEX,botColHEX,midColHEX,
    // topColRGB,botColRGB,midColRGB
    

function preload(){
  dataShader = loadShader('./basic.vert', './datatexture.frag');
  gradientShader = loadShader('./basic.vert', './gradient.frag');
}

function setup() {
  setupControls();
  calcCnvSize();
  CNV = createCanvas(cnvW, cnvH, WEBGL);
  CNV.parent(select('#canvas_div'));
  CNV.mousePressed(()=> segmentCounter++);

  dataTexture = createGraphics(cnvW, cnvH, WEBGL);
  dataTexture.background(255,255,0);
  dataTexture.noStroke();

  noLoop();
}

function draw() {
  dataTexture.shader(dataShader);
  dataShader.setUniform('u_prevState',dataTexture);
  dataShader.setUniform('u_ptA',A);
  dataShader.setUniform('u_ptB',B);
  dataShader.setUniform('u_res',[width,height]);
  dataShader.setUniform('u_colorIndex',0);
  dataTexture.rect(-dataTexture.width/2,-dataTexture.height/2,dataTexture.width,dataTexture.height);

  let topColHEX = select('#topColor').value();
  let topColRGB = hexToRgb(topColHEX);
  topColRGB.push(1);

  let botColHEX = select('#botColor').value();
  let botColRGB = hexToRgb(botColHEX);
  botColRGB.push(1);

  let midColHEX = select('#midColor').value();
  let midColRGB = hexToRgb(midColHEX);
  midColRGB.push(select('#midPos').value());
  if(!select('#mid_check').checked()) midColRGB = [-1,-1,-1,-1]; //delete middle colorstop if disabled

  let colors = [];
  colors.push(...topColRGB);
  colors.push(...botColRGB);
  colors.push(...midColRGB);

  background(255);
  translate(-width/2, -height/2);
  noStroke();
  shader(gradientShader);
  gradientShader.setUniform('u_data', dataTexture);
  gradientShader.setUniform('u_colors', colors);
  rect(0,0,width,height);
}

function windowResized(){
  calcCnvSize();
  // resizeCanvas(cnvW, cnvH);
  // redraw();
}

function mouseDragged(){
  if(mouseX<0 || mouseX>width || mouseY<0 || mouseY>height) return; //mouse isn't over canvas, return
  A = B;
  B = [mouseX,mouseY,segmentCounter];
  redraw();
  return false;
}

function hexToRgb(hex) {
  if (hex.charAt(0) === '#') hex = hex.substr(1);
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}

function calcCnvSize(){
  let settingDivW = select('#settings_div').width;
  let maxH = windowHeight-40;
  let maxW = windowWidth-settingDivW-40;
  let k1 = maxH/maxW;
  let k = select('#height').value() / select('#width').value();
  if(k1>k){
    cnvW = maxW;
    cnvH = cnvW*k;
  } else {
    cnvH = maxH;
    cnvW = cnvH/k;
  }
}