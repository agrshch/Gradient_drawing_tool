let gradientShader,
    CNV,
    CNV_DIV,
    PTS = [],
    segmentCounter = 0,
    clickIsBlocked = false;

function preload(){
  gradientShader = loadShader('./basic.vert', './gradient.frag');
}

function setup() {
  CNV_DIV = select('#canvas_div');
  CNV = createCanvas(CNV_DIV.width, CNV_DIV.height, WEBGL);
  CNV.parent(CNV_DIV);
  CNV.mousePressed(()=> segmentCounter++);

  let clearButton = select('#clear_btn');
  clearButton.mousePressed(()=> {PTS=[];redraw()});

  noLoop();
}

function draw() {
  background(255);
  translate(-width/2, -height/2);
  noStroke();
  shader(gradientShader);
  gradientShader.setUniform('u_pts', PTS);
  gradientShader.setUniform('u_pts_n', floor(PTS.length/3));
  gradientShader.setUniform('u_resolution', [width,height]);
  rect(0,0,width,height);
}

function keyPressed() {
  if (key == ' ') save('Gradient_drawing.jpg');
}

function windowResized(){
  resizeCanvas(CNV_DIV.width, CNV_DIV.height);
  redraw();
}

function mouseDragged(){
  if(mouseX<0 || mouseX>width || mouseY<0 || mouseY>height) return false; //mouse isn't over canvas, return
  PTS.push(mouseX, mouseY,segmentCounter);
  redraw();
  return false;
}