document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.querySelector('.landing-page__create-sprite');
  const app = document.querySelector('.app');
  const landingPage = document.querySelector('.landing-page');
  const loadApp = function () {
    app.style.display = 'block';
    landingPage.style.display = 'none';
  }
  startButton.addEventListener('click', loadApp);

  const currColor = document.querySelector('.currColor');
  const prevColor = document.querySelector('.prevColor');
  const chooseColor = document.querySelector('.chooseColor');
  const colorFromInput = document.querySelector('.pick');
  const colorPicker = function (event) {
    if (currColor.value != colorFromInput.value) {
      prevColor.value = currColor.value;
      currColor.value = colorFromInput.value;
      context.strokeStyle = event.target.value;
      context.fillStyle = event.target.value;
    }
  }
  chooseColor.addEventListener('change', colorPicker, false);

  const paintBucket = document.querySelector('.paintBucket');
  const paintCanvas = function () {
    context.fillStyle = currColor.value;
    context.fillRect(0, 0, canvas.width, canvas.height);
    //let imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    frameContextArray[selectedFrameIndex].drawImage(canvas, 0, 0, canvas.width / 2, canvas.height / 2);
    animate();
  }
  paintBucket.addEventListener('click', paintCanvas);

  const eraser = document.querySelector('.menu__eraser');
  const erase = function () {
    context.strokeStyle = '#d1d1d1';
    context.fillStyle = '#d1d1d1';
  }
  eraser.addEventListener('click', erase);

  const pen = document.querySelector('.menu__pen');
  const drawPen = function () {
    context.strokeStyle = currColor.value;
    context.fillStyle = currColor.value;
  }
  pen.addEventListener('click', drawPen);

  const KeyboardEvent = {
    P: 80,
    E: 69,
    F: 70,
    B: 66
  }

  document.addEventListener('keypress', (e) => {
    if (e.keyCode === KeyboardEvent.P) drawPen();
    else if (e.keyCode === KeyboardEvent.E) erase();
    else if (e.keyCode === KeyboardEvent.B) paintCanvas();
    else if (e.keyCode === KeyboardEvent.F) addNewFrame();

  });

  let canvasArray = [];
  let frameContextArray = [];

  const canvas = document.querySelector('.canvas');

  const start = 0;
  const end = Math.PI * 2;
  const radius = 1;
  let frameContextIndex = 0;
  let selectedFrameIndex = 0;
  let dragging = false;
  const context = canvas.getContext('2d');
  canvas.width = 550;
  canvas.height = 500;
  context.lineWidth = radius * 10;
  context.lineCap = 'square';

  canvasArray.push(canvas);

  const frame = document.querySelector('.frame');
  frame.width = 150;
  frame.height = 150;
  const frameContext = frame.getContext('2d');
  const frames = document.querySelector('.frames');
  frameContextArray.push(frameContext);

  const putPoint = function (e) {
    if (dragging) {
      context.lineTo(e.offsetX, e.offsetY);
      context.stroke();
      context.beginPath();
      context.arc(e.offsetX, e.offsetY, radius, start, end);
      context.fill();
      context.beginPath();
      context.moveTo(e.offsetX, e.offsetY);
    }
  }

  const engage = function (e) {
    dragging = true;
    putPoint(e);
  }

  const disengage = function () {
    dragging = false;
    context.beginPath();
    var scale = Math.min(frame.width / canvas.width, frame.height / canvas.height);
    var x = (frame.width / 2) - (canvas.width / 2) * scale;
    var y = (frame.height / 2) - (canvas.height / 2) * scale;
    frameContextArray[selectedFrameIndex].drawImage(context.canvas, x, y, canvas.width * scale, canvas.height * scale);
    requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousedown', engage);
  canvas.addEventListener('mousemove', putPoint);
  canvas.addEventListener('mouseup', disengage);

  const addFrameButton = document.querySelector('.addFrame');
  const addNewFrame = function () {
    del = false;
    frameContextIndex += 1;
    selectedFrameIndex = frameContextIndex;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const frameWrapper = document.createElement('div');
    frameWrapper.className = 'frame__wrapper';
    const frame = document.createElement('canvas');
    frame.className = 'frame';
    const controlIcons = document.createElement('div');
    controlIcons.className = 'icons__wrapper';
    controlIcons.innerHTML = '<i class="fas fa-trash-alt delete"></i><i class="fas fa-copy icon copy"></i>';
    frames.appendChild(frameWrapper);
    frameWrapper.appendChild(frame);
    frameWrapper.appendChild(controlIcons);
    const frameContext = frame.getContext('2d');
    frameContextArray.push(frameContext);
  }
  addFrameButton.addEventListener('click', addNewFrame);

  const animationCanvas = document.querySelector('.animation');
  const animationContext = animationCanvas.getContext('2d');
  animationCanvas.width = 200;
  animationCanvas.height = 200;

  const fps = document.querySelector('.fps');
  const fpsNum = document.querySelector('.fpsNum');
  fps.addEventListener('input', () => {
    fpsNum.value = fps.value;
  });
  fpsNum.addEventListener('input', () => {
    fps.value = fpsNum.value;
  });

  const animate = function () {
    for (let i = 0; i < frameContextArray.length; i++) {
      let timeoutId = setTimeout(function () {
        if (frameContextArray.length == 0) {
          return;
        }
        else if (!frameContextArray[i]) {
          requestAnimationFrame(animate);
          let framesData = frameContextArray[0].getImageData(0, 0, frame.width, frame.height);
          animationContext.putImageData(framesData, 0, 0);
        }
        else {
          /* var scale = Math.max(animationCanvas.width / frame.width, animationCanvas.height / frame.height);
          var x = (animationCanvas.width / 2) - (frame.width / 2) * scale;
          var y = (animationCanvas.height / 2) - (frame.height / 2) * scale;
          animationContext.drawImage(frameContextArray[i].canvas, x, y, frame.width * scale, frame.height * scale);
         */
          let framesData = frameContextArray[i].getImageData(0, 0, frame.width, frame.height);
          animationContext.putImageData(framesData, 0, 0);
          requestAnimationFrame(animate);
        }
        fps.addEventListener('input', () => {
          clearTimeout(timeoutId);
          requestAnimationFrame(animate);
        });
        fpsNum.addEventListener('input', () => {
          clearTimeout(timeoutId);
          requestAnimationFrame(animate);
        });
        /*addFrameButton.addEventListener('click', () => {
            clearTimeout(timeoutId);
            requestAnimationFrame(animate);
        });*/
      }, 1000 / fps.value);
    }
  }

  const chooseFrame = function (e) {
    const frameWrapper = document.querySelectorAll('.frame');
    for (let i = 0; i < frameWrapper.length; i++) {
      frameWrapper[i].index = i;
    }
    if (e.target && e.target.nodeName == 'CANVAS') {
      context.clearRect(0, 0, canvas.width, canvas.height);
      e.target.style.border = "2px solid yellow";
      var scale = Math.max(canvas.width / frame.width, canvas.height / frame.height);
      var x = (canvas.width / 2) - (frame.width / 2) * scale;
      var y = (canvas.height / 2) - (frame.height / 2) * scale;
      context.drawImage(frameContextArray[e.target.index].canvas, x, y, frame.width * scale, frame.height * scale);
      selectedFrameIndex = e.target.index;
    }
  }
  frames.addEventListener('click', chooseFrame);

  const frameControls = function (e) {
    const frameWrapper = document.querySelectorAll('.frame__wrapper');
    for (let i = 0; i < frameWrapper.length; i++) {
      frameWrapper[i].index = i;
    }
    if (e.target && e.target.className == 'fas fa-trash-alt delete') {
      e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
      frameContextArray.splice(e.target.parentNode.parentNode.index, 1);
      frameContextIndex -= 1;
      del = true;
    }
    else if (e.target && e.target.className == 'fas fa-copy icon copy') {
      //context.clearRect(0, 0, canvas.width, canvas.height);
      const frameWrapper = document.createElement('div');
      frameWrapper.className = 'frame__wrapper';
      const frame = document.createElement('canvas');
      frame.className = 'frame';
      const controlIcons = document.createElement('div');
      controlIcons.className = 'icons__wrapper';
      controlIcons.innerHTML = '<i class="fas fa-trash-alt delete"></i><i class="fas fa-copy icon copy"></i>';
      frames.appendChild(frameWrapper);
      /* var template = _.template(document.getElementById('menu-template').innerHTML, );
      var del = template({delete: 'fas fa-trash-alt delete'});
      const copy = template({copy: 'fas fa-copy icon copy'});
      */
      frameWrapper.appendChild(frame);
      frameWrapper.appendChild(controlIcons);
      const copiedFrameContext = frame.getContext('2d');
      let imgData = frameContextArray[e.target.parentNode.parentNode.index].getImageData(0, 0, frame.width, frame.height);
      copiedFrameContext.putImageData(imgData, 0, 0);
      context.putImageData(imgData, 0, 0, frame.width, frame.height, 0, 0, canvas.width, canvas.height);
      frameContextArray.push(copiedFrameContext);
      frameContextIndex += 1;
      selectedFrameIndex = frameContextIndex;
    }
  }
  const icons = document.querySelector('.icons__wrapper');
  frames.addEventListener('click', frameControls);

  const fullScreen = function (element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitrequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullscreen) {
      element.mozRequestFullScreen();
    }
  }

  const fullScreenIcon = document.querySelector('.expand');
  fullScreenIcon.addEventListener('click', function () {
    fullScreen(animationCanvas);
  });

  const toolSize = document.querySelector('.menu__tool-size');
  const setToolSize = function (e) {
    switch (e.target.className) {
      case 'fas fa-square unit1':
        context.lineWidth = 16;
        break;
      case 'fas fa-square unit2':
        context.lineWidth = 26;
        break;
      case 'fas fa-square unit3':
        context.lineWidth = 36;
        break;
      case 'fas fa-square unit4':
        context.lineWidth = 46;
        break;
    }
  }
  toolSize.addEventListener('click', setToolSize);

  const slides = $('.frames')
  slides.sortable({
    axis: 'y',
    revert: 300,
    placeholder: 'sortable-placeholder',
    cursor: 'move',
    tolerance: 'pointer',
    start: function () {
      slides.addClass('sorting');
    },
    stop: function () {
      slides
        .addClass('sort-stop')
        .removeClass('sorting');
      setTimeout(function () {
        slides.removeClass('sort-stop');
      }, 310);
    }
  });
});
