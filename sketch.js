let gradientShader,dataShader,copyShader,
    currentTex,prevTex,
    backupTex,
    CNV,cnvW,cnvH,
    A = [-1,-1,-1],//coordinates of current line segment
    B = [-1,-1,-1],//coordinates of current line segment
    segmentCounter = 0;

function preload(){
  dataShader = loadShader('./basic.vert', './datatexture.frag');
  gradientShader = loadShader('./basic.vert', './gradient.frag');
  copyShader = loadShader('./basic.vert', './copy.frag');
}

function setup() {
  setupControls();
  calcCnvSize();
  CNV = createCanvas(cnvW, cnvH, WEBGL);
  CNV.parent(select('#canvas_div'));
  
  currentTex = createFramebuffer({ format: FLOAT });
  prevTex = createFramebuffer({ format: FLOAT });
  backupTex = createFramebuffer({ format: FLOAT });
  clearDataTexture();

  CNV.mousePressed(()=> {
    segmentCounter++;
    ctrlS();
  });

  CNV.touchStarted(()=> {
    segmentCounter++;
    ctrlS();
  });
  
  noStroke();
  noLoop();
}

function draw() {
  if (isDrawingSVG){
    let p = PATHS[pathCounter];
    let a = p[ptCounter];
    let b = p[constrain(ptCounter+1, 0, p.length-1)];
    A = [a.x, a.y, pathCounter];
    B = [b.x, b.y, pathCounter];
    ptCounter ++;
    if(ptCounter >= p.length){
      ptCounter = 0;
      pathCounter ++;
    }
    if(pathCounter >= PATHS.length){
      pathCounter = 0;
      ptCounter = 0;
      isDrawingSVG = false;
      noLoop();
    }
  }


  [prevTex,currentTex] = [currentTex,prevTex];

  shader(dataShader);
  dataShader.setUniform('u_prevState',prevTex);
  dataShader.setUniform('u_ptA',A);
  dataShader.setUniform('u_ptB',B);
  dataShader.setUniform('u_res',[width,height]);
  dataShader.setUniform('u_colorIndex',0);
  currentTex.draw(()=>rect(-currentTex.width/2,-currentTex.height/2,currentTex.width,currentTex.height));

  
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
  gradientShader.setUniform('u_data', currentTex);
  gradientShader.setUniform('u_colors', colors);
  gradientShader.setUniform('u_grain', select('#grain_check').checked());
  rect(0,0,width,height);
}

function mouseDragged(){
  if(mouseX<0 || mouseX>width || mouseY<0 || mouseY>height) return; //mouse isn't over canvas, return
  A = B;
  B = [mouseX,mouseY,segmentCounter];
  redraw();
  return false;
}

function mouseReleased(){
  A = [-1,-1,-1];//coordinates of current line segment
  B = [-1,-1,-2];
  segmentCounter++;
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

function ctrlZ(){
  [currentTex,backupTex] = [backupTex,currentTex];
  ctrlS();
  A=[-1,-1,-1];
  B=[-1,-1,-2];
  redraw();
}


function ctrlS(){
  shader(copyShader);
  copyShader.setUniform('u_source',currentTex);
  backupTex.draw(()=>rect(-backupTex.width/2,-backupTex.height/2,backupTex.width,backupTex.height));
  select('#undo_btn').removeAttribute("disabled");
}