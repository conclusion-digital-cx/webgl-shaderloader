Porting shadertoy to run native

Code from 
---
https://github.com/stevensona/shader-toy/blob/master/src/extension.ts

https://www.reddit.com/r/vscode/comments/4uatxa/ive_created_a_live_glsl_shader_previewer_for/


Todo
---
- Make a library 
- some nice examples
- Accept shadertoy shaders without need to port


Porting Shadertoy Shaders
---
Rename 
    void mainImage( out vec4 fragColor, in vec2 fragCoord ) { 
to 
    void main()


fragColor to gl_FragColor
fragCoord to gl_FragCoord
