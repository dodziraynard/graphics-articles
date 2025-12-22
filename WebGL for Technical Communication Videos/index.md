# WebGL for Technical Communication Videos

In the my previous article, I explained why editor for technical videos and how I concluded on using Rust and WebGL2.
In this article, we'd explore the setup and draw our first object on the canvas.
First of all, WebGL is a Javascript API so we can't interact with it directly from Rust. Also, browsers aren't designed to run arbitrary binaries so we need a way to enable a browser to run our Rust code. That leads us to Web Assembly.

Below is the architecture that we'll end up with but in this article we're going to focus on the last block: Drawing Geometry Using WebGL.
![Ideal Architecture](image.png)


The purpose of these articles is not to teach any of these specific technologies but how to compose and put them together to achieve our goal of a web baseed technical video tool. During my journey, I found these articles: https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html and https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API helpful. I'd recommended learning WebGL from here if you're completely new to it.

