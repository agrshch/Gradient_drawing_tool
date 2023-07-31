let gradientShader,
    dataShader,
    data,
    CNV,
    CNV_DIV,
    A = [-1,-1,-1],
    B = [-1,-1,-1],
    segmentCounter = 0,
    clickIsBlocked = false;

let colors1 = [
  255,0,0,1,
  0,0,255,1,
  255,255,0,0.5,
  // 130,200,0,1,
  // 0,100,125,1,
  // 25,0,120,0.5
];

// let index = 1;

function preload(){
  dataShader = loadShader('./basic.vert', './datatexture.frag');
  gradientShader = loadShader('./basic.vert', './gradient.frag');
}

function setup() {
  CNV_DIV = select('#canvas_div');
  CNV = createCanvas(CNV_DIV.width, CNV_DIV.height, WEBGL);
  CNV.parent(CNV_DIV);
  CNV.mousePressed(()=> segmentCounter++);

  data = createGraphics(CNV_DIV.width, CNV_DIV.height, WEBGL);
  data.background(255,255,0);
  data.noStroke();

  let clearButton = select('#clear_btn');
  clearButton.mousePressed(()=> {
    data.background(255,255,0);
    A=[-1,-1,-1];
    B=[-1,-1,-2];
    redraw();
  })

  let saveButton = select('#save_btn');
  saveButton.mousePressed(()=> {
    save('gradient.png');
  })

  select('#startColor').input(()=>redraw());
  select('#endColor').input(()=>redraw());
  select('#midColor').input(()=>redraw());
  select('#midPos').input(()=>redraw());

  noLoop();
}

function draw() {
  

  data.shader(dataShader);
  dataShader.setUniform('u_prevState',data);
  dataShader.setUniform('u_ptA',A);
  dataShader.setUniform('u_ptB',B);
  dataShader.setUniform('u_res',[width,height]);
  dataShader.setUniform('u_colorIndex',0);
  data.rect(-data.width/2,-data.height/2,data.width,data.height);

  // translate(-width/2, -height/2);
  // image(data,0,0);

  let startColHex = select('#startColor').value();
  let startColRGB = hexToRgb(startColHex);
  startColRGB.push(1);
  console.log(startColRGB)

  let endColHex = select('#endColor').value();
  let endColRGB = hexToRgb(endColHex);
  endColRGB.push(1);
  console.log(endColRGB)

  let midColHex = select('#midColor').value();
  let midColRGB = hexToRgb(midColHex);
  midColRGB.push(select('#midPos').value());
  console.log(midColRGB)

  let colors = [];
  colors.push(...startColRGB);
  colors.push(...endColRGB);
  colors.push(...midColRGB);
  console.log(colors)
  console.log(colors1)


  background(255);
  translate(-width/2, -height/2);
  noStroke();
  shader(gradientShader);
  gradientShader.setUniform('u_data', data);
  gradientShader.setUniform('u_colors', colors);
  rect(0,0,width,height);
}

// function keyPressed() {
//   if (key == ' ') save('Gradient_drawing.jpg');
// }

function windowResized(){
  resizeCanvas(CNV_DIV.width, CNV_DIV.height);
  redraw();
}

function mouseDragged(){
  if(mouseX<0 || mouseX>width || mouseY<0 || mouseY>height) return; //mouse isn't over canvas, return
  A = B;
  B = [mouseX,mouseY,segmentCounter];
  // console.log(`X: ${A[0]}, ${B[0]}, Y: ${A[1]}, ${B[1]}`)
  // console.log(`deltaX = ${A[0]-B[0]}, deltaY = ${A[1]-B[1]}`)
  redraw();
  return false;
}

function hexToRgb(hex) {
  // Ensure the hex color starts with #
  if (hex.charAt(0) === '#') {
      hex = hex.substr(1);
  }

  // Parse hex color code for each channel
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  return [r, g, b];
}
