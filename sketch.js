// p5.disableFriendlyErrors = true;

let myShader;
let COLS = 800;
let breakPoints = [];
let threshold = 1;
let wasPreviouslyPressed = false;
let clickIsBlocked = false;

let customShape;

function preload(){
  myShader = loadShader('./basic.vert', './gradient.frag');
  // customShape = loadImage('./Sample text.svg');//, populateFromSVG, customShape);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noLoop();
  noStroke();

  let colSlider = createSlider(1,1000,COLS,1);
  colSlider.position(20, 30);
  colSlider.changed(changeCols);
  colSlider.mouseOver(blockClicks);
  colSlider.mouseOut(unblockClicks);

  let clearButton = createButton('clear');
  clearButton.position(20, 70);
  clearButton.mousePressed(wipe,breakPoints);
  clearButton.mouseOver(blockClicks);
  clearButton.mouseOut(unblockClicks);
}

function draw() {
  background(255);
  translate(-width/2, -height/2);

  //draw rects
  let w = width/COLS;
  for (let i=0; i < COLS; i++){
    //check if there are any breakpoints in the colomn. store findings into array
    let currentBP = [];
    for (let bp of breakPoints) if (bp.x > i*w && bp.x < (i+1)*w) currentBP.push(bp);
    if(currentBP.length > 0) {
      currentBP.sort( (a,b) => a.y - b.y );
      let y = 0;
      let prevPoint = new p5.Vector(0,-1000);
      for (let bp of currentBP){
        if (bp.y - prevPoint.y < w/2) continue;
        let h = bp.y - y;
        shader(myShader);
        rect(i*w, y, w, h);
        y = bp.y;
        prevPoint = bp;
      }
      shader(myShader);
      rect(i*w, y, w, height - y);
    } else {
      shader(myShader);
      rect(i*w,0,w,height);
    }
  }


  // if (mouseIsPressed === true){
  //   push();
  //   noFill();
  //   stroke(0,255,0);
  //   strokeWeight(4);
  //   beginShape();
  //   for (let p of breakPoints) point(p.x,p.y);
  //   endShape();
  //   pop();
  // }
}

function keyPressed() {
  if (key == ' ') save('Gradient_mosaic.jpg');
  if (key == '1') pixelDensity(1); redraw();
  if (key == '2') pixelDensity(2); redraw();
  if (key == '3') pixelDensity(3); redraw();
  if (key == '4') pixelDensity(4); redraw();
  if (key == '5') pixelDensity(5); redraw();
  if (key == '6') pixelDensity(6); redraw();
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function changeCols(){
  COLS = floor(this.value());
  redraw();
}

//add breakPoints
function mousePressed(){
  if(clickIsBlocked)return;
  breakPoints.push(new p5.Vector(mouseX, mouseY));
  console.log('pressed');
  redraw();
  wasPreviouslyPressed = true;
}

function mouseDragged(){
  if(clickIsBlocked)return;
  //проверить была ли кнопка зажата в предыдущем фрейме. если нет, поставить точку
  if (!wasPreviouslyPressed) {
    breakPoints.push(new p5.Vector(mouseX, mouseY));
    wasPreviouslyPressed = true;
    redraw();
    return;
  }

  //если да, посмотреть где стоит предыдущая точка в массиве, проверить расстояние от нее до курсора;
  let prev = breakPoints.at(-1);
  let curr = new p5.Vector(mouseX, mouseY);
  let d = distSquared(prev, curr);

  //если расстояние меньше порогового — ничего не делаем.
  if (dist < threshold*threshold) return;

  //если больше — смотрим на округленное значение расстояние/порог и рисуем столько точек, сколько наокругляли
  let number = Math.round(sqrt(d)/threshold);
  let step = 1/number;
  for (let i = step; i <= 1; i+=step){
    i = constrain(i,0,1);
    breakPoints.push(p5.Vector.lerp(prev, curr, i));
  }

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

function wipe(values){
  breakPoints = [];
}

function blockClicks(){
  clickIsBlocked = true;
}

function unblockClicks(){
  clickIsBlocked = false;
}
