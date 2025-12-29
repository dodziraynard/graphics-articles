// Get the canvas and WebGL context
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    console.error('WebGL not supported');
    alert('WebGL not supported in this browser');
}

// Vertex shader program
const vertexShaderSource = `
    attribute vec4 a_position;
    void main() {
        gl_Position = a_position;
    }
`;

// Fragment shader program
const fragmentShaderSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
    }
`;

// Function to create and compile a shader
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

// Function to create a program from shaders
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

// Create shaders
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Create program
const program = createProgram(gl, vertexShader, fragmentShader);

// Look up attribute location
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

// Create a buffer for the triangle's positions
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Triangle vertices: (0, 0), (0, 0.6), (0.6, 0)
const positions = [
    0.0, 0.0,
    0.0, 0.6,
    0.6, 0.0
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Use the program
gl.useProgram(program);

// Enable the attribute
gl.enableVertexAttribArray(positionAttributeLocation);

// Bind the position buffer
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer
const size = 2;          // 2 components per iteration
const type = gl.FLOAT;   // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0;        // 0 = move forward size * sizeof(type) each iteration
const offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

// Draw the triangle
const primitiveType = gl.TRIANGLES;
const drawOffset = 0;
const count = 3;
gl.drawArrays(primitiveType, drawOffset, count);
