// Initialize WebGL context
const canvas = document.getElementById("webglCanvas");
const gl = canvas.getContext("webgl");
if (!gl) {
  alert("WebGL not supported, please use a modern browser.");
}

// WebGL setup for rendering a line
canvas.width = 600;
canvas.height = 400;
let lineWidth = 2;
const vertices = []; // Array to store all vertices

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

const vsSource = `
        attribute vec2 aPosition;
        uniform float uPointSize;
        void main() {
            gl_PointSize = uPointSize;
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `;
const fsSource = `
        void main() {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
      `;

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
gl.useProgram(shaderProgram);
const aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
const uPointSize = gl.getUniformLocation(shaderProgram, "uPointSize");
gl.uniform1f(uPointSize, lineWidth);

function addSegment(x, y) {
  const normalizedX = (x / canvas.width) * 2 - 1;
  const normalizedY = 1 - (y / canvas.height) * 2;
  vertices.push(normalizedX, normalizedY);
  drawLine();
}

function drawLine() {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.lineWidth(lineWidth);
  gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 2);
}

function addRandomSegment() {
  const randomX = Math.random() * canvas.width;
  const randomY = Math.random() * canvas.height;
  addSegment(randomX, randomY);
}

function addManualSegment() {
  const x = parseFloat(document.getElementById("xCoord").value);
  const y = parseFloat(document.getElementById("yCoord").value);

  if (!isNaN(x) && !isNaN(y) && x >= 0 && x <= 600 && y >= 0 && y <= 400) {
    addSegment(x, y);
  } else {
    alert("Please enter valid coordinates within the canvas range.");
  }
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  addSegment(x, y);
});

document.getElementById("lineWidth").addEventListener("input", (e) => {
  lineWidth = parseFloat(e.target.value);
  gl.uniform1f(uPointSize, lineWidth);
  drawLine();
});

function clearCanvas() {
  vertices.length = 0;
  gl.clear(gl.COLOR_BUFFER_BIT);
}

addSegment(50, 200);
