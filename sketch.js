let gradientShader,
    CNV,
    PTS = [],
    segmentCounter = 0,
    clickIsBlocked = false;

function preload(){
  gradientShader = loadShader('./basic.vert', './gradient.frag');
}

function setup() {
  CNV = createCanvas(windowWidth, windowHeight, WEBGL);
  CNV.parent(select('#cnv_div'));
  noLoop();

  let clearButton = createButton('clear');
  // clearButton.parent(select('#settings_div'))
  clearButton.position(20, 20);
  clearButton.mousePressed(()=> PTS=[]);
  clearButton.mouseOver(blockClicks);
  clearButton.mouseOut(unblockClicks);
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
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

//add PTS
function mousePressed(){
  if(clickIsBlocked)return;
  segmentCounter++;
}

function mouseDragged(){
  if(clickIsBlocked)return;
  PTS.push(mouseX, mouseY,segmentCounter);
  redraw();
}

function mouseReleased(){
  redraw();
  wasPreviouslyPressed = false;
}

function distSquared(a,b){
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  return dx*dx + dy*dy;
}


function blockClicks(){
  clickIsBlocked = true;
}

function unblockClicks(){
  clickIsBlocked = false;
}
