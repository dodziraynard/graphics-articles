# WebGL for Technical Communication Videos

In the my previous article, I explained why editor for technical videos and how I concluded on using Rust and WebGL2.
In this article, we'd explore the setup and draw our first object on the canvas.
First of all, WebGL is a Javascript API so we can't interact with it directly from Rust. Also, browsers aren't designed to run arbitrary binaries so we need a way to enable a browser to run our Rust code. That leads us to Web Assembly.

Below is the architecture that we'll end up with but in this article we're going to focus on the last block: Drawing Geometry Using WebGL.
![Ideal Architecture](image.png)


The purpose of these articles is not to teach any of these specific technologies but how to compose and put them together to achieve our goal of a web baseed technical video tool. During my journey, I found these articles: https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html and https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API helpful. I'd recommended learning WebGL from here if you're completely new to it.

We interact with WebGL via webgl context of the html canvas element. WebGL has the concept shaders. A shader is a program that runs on the GPU. There're two types of shaders in WebGL:1.  vertex shader for defining the boundaries of the shape we want to draw. The vertex shader program is executed for each vertex of the shape we want to draw. 2. fragment shader paints the covered region defined by the vertex shader. The fragment shader program is executed for each pixel that falls within the covered region defined by the vertex shader.

To draw an object on the screen, we first create basic hmtl template with a canvas element. Defined our vertex and fragment shader programs and upload them into the GPU alongside with any parameters ie., attributes and uniforms.

Attributes are used to specify how to pull data out of your buffers and provide them to your vertex shader.
Uniforms are global variables you set on the GPU before you execute your shader program.

Below is our html template with a linked js script:
```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebGL Canvas</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f0f0f0;
        }
        canvas {
            border: 1px solid #333;
            background-color: white;
        }
    </style>
</head>
<body>
    <canvas id="canvas" width="800" height="600"></canvas>
    <script src="script.js"></script>
</body>
</html>
```

Next, we create our JavaScript gluecode to create and upload the shader programs, attributes, and uniforms. Well commented out for crarity. 
```js
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
const normalise = false; // don't normalise the data
const stride = 0;        // 0 = move forward size * sizeof(type) each iteration
const offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalise, stride, offset);

// Draw the triangle
const primitiveType = gl.TRIANGLES;
const drawOffset = 0;
const count = 3;
gl.drawArrays(primitiveType, drawOffset, count);

```

## Output
![Output](screenshot.png)

## Conclusion
With this we're able to draw a simple red triangle on the canvas using WebGL, JavaScript, and HTML.
