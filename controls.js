function setupControls(){
  // width/height
  let w = select('#width');
  let h = select('#height');
  w.changed(()=>{
    w.value(constrain(w.value(),100,3840));
    calcCnvSize();
    resizeCanvas(cnvW,cnvH);
    clearDataTexture();
    redraw();
  })
  h.changed(()=>{
    h.value(constrain(h.value(),100,3840));
    calcCnvSize();
    resizeCanvas(cnvW,cnvH);
    clearDataTexture();
    redraw();
  })

  //svg
  select('#svgInput').changed(loadSVG);


  //top color stop
  let topCol = select('#topColor');
  let topColText = select('#topColorTxt');
  topCol.input(()=>{
    topColText.value(topCol.value());
    redraw();
  })
  topColText.changed(()=>{
    topColText.value(fixHash(topColText.value())); //fixes missing #
    if(isValidHexCode(topColText.value())){
      topCol.value(topColText.value());
      redraw();
    } else {
      topColText.value('#ERR')
    }
  })
  topColText.input(()=>{
    if(topColText.value()==='')topColText.value('#');
  })

  //bottom color stop
  let botCol = select('#botColor');
  let botColText = select('#botColorTxt');
  botCol.input(()=>{
    botColText.value(botCol.value());
    redraw();
  })
  botColText.changed(()=>{
    botColText.value(fixHash(botColText.value())); //fixes missing #
    if(isValidHexCode(botColText.value())){
      botCol.value(botColText.value());
      redraw();
    } else {
      botColText.value('#ERR')
    }
  })
  botColText.input(()=>{
    if(botColText.value()==='')botColText.value('#');
  })

  //middle color stop
  let midCheck = select('#mid_check');
  let midCol = select('#midColor');
  let midColText = select('#midColorTxt');
  let midPos = select('#midPos');
  let midPosText = select('#midPosTxt');
  
  midCol.input(()=>{
    midColText.value(midCol.value());
    redraw();
  })
  midColText.changed(()=>{
    midColText.value(fixHash(midColText.value())); //fixes missing #
    if(isValidHexCode(midColText.value())){
      midCol.value(midColText.value());
      redraw();
    } else {
      midColText.value('#ERR')
    }
  })
  midColText.input(()=>{
    if(midColText.value()==='')midColText.value('#');
  })
  //slider change
  midPos.input(()=>{
    redraw();
  })


  // react on checking unchecking
  midCheck.changed(()=>{
    if(midCheck.checked()){
      //enable color picker, slider, two text fields
      midCol.removeAttribute("disabled");
      midColText.removeAttribute("disabled");
      midPos.removeAttribute("disabled");
      redraw();
    } else {
      //disable color picker, slider, two text fields
      midCol.attribute("disabled", true);
      midColText.attribute("disabled", true);
      midPos.attribute("disabled", true);   
      redraw();
    }
  })

  select('#grain_check').changed(()=>redraw());

  select('#undo_btn').mousePressed(ctrlZ);
  select('#undo_btn').mouseReleased(()=> select('#undo_btn').attribute("disabled", ''));

  let clearButton = select('#clear_btn');
  clearButton.mousePressed(()=> {
    clearDataTexture();
    redraw();
  })

  let saveButton = select('#save_btn');
  saveButton.mousePressed(()=> {
    let timestamp = `${year()}_${month()}_${day()}_${hour()}_${minute()}_${second()}`;
    if(width > select('#width').value()){
      let out = createGraphics(select('#width').value(), select('#height').value());
      let outTex = get();
      out.pixelDensity(1);
      out.image(outTex,0,0,out.width, out.height);
      out.save(`small_gradientor_${timestamp}.jpg`);
      out.clear();
      out.remove();
      out = null;
    } else {
      currentTex.autoSized = false;
      prevTex.autoSized = false;
      backupTex.autoSized = false;
      resizeCanvas(select('#width').value(), select('#height').value());
      let prevPD = pixelDensity();
      
      pixelDensity(1);
      redraw();
      save(`gradientor_${timestamp}.jpg`);
      resizeCanvas(cnvW, cnvH);
      pixelDensity(prevPD);
      currentTex.autoSized = true;
      prevTex.autoSized = true;
      backupTex.autoSized = true;
      redraw();
    }
  })

}

function isValidHexCode(hexCode) {
  const regexp = /^#([0-9A-Fa-f]{6})$/;
  return regexp.test(hexCode);
}

function fixHash(hexCode) {
  if (hexCode.charAt(0) !== '#') hexCode = '#' + hexCode;
  return hexCode;
}

function clearDataTexture(){
  ctrlS(); // no idead why but saving before drawing cures weird glitches
  currentTex.draw(()=>background(255,255,0));
  prevTex.draw   (()=>background(255,255,0));
  backupTex.draw (()=>background(255,255,0));
  select('#undo_btn').attribute("disabled", '');
  // ctrlS();
  A=[-1,-1,-1];
  B=[-1,-1,-2];

  let fileInput = document.getElementById('svgInput');
  fileInput.value = "";
  isDrawingSVG = false;
}