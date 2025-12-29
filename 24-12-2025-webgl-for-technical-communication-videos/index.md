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

Next, we create our JavaScript gluecode to create and upload the shader programs, attributes, and uniforms.
