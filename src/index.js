//----------
// Config
//----------
const file =
    //"./shaders/shadertoy/seascape-port.glsl"
    "./shaders/shadertoy/supernova-port.glsl"
    //"./shaders/shadertoy/seascape.glsl"



//----------
// Vertex Shaders
//----------
const vertexShaderBare = ` 
void main() {
    gl_Position = vec4(position, 1.0);
}`

const vertexShader = `
attribute vec3 in_Position;
varying vec2 fragCoord;
varying vec2 vUv; 
void main()
{
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    fragCoord = position.xy;
}
`

//----------
// Setup
//----------
//Error handler
;
(function() {
    console.error = function(message) {
        if ('7' in arguments) {
            $("#error").html("<h3>Shader failed to compile</h3><ul>")
            $("#error").append(arguments[7].replace(/ERROR: \\d+:(\\d+)/g, function(m, c) { return "<li>Line " + String(Number(c)); })); //- ${line_offset}
            $("#error").append("</ul>");
        }
    };
})();

//----------
//Setup ThreeJS Scene
//----------
var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false });
var camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, 1, 1000);
var clock = new THREE.Clock();
var resolution = new THREE.Vector3(canvas.clientWidth, canvas.clientHeight, 1.0);
var channelResolution = new THREE.Vector3(128.0, 128.0, 0.0);
var mouse = new THREE.Vector4(0, 0, 0, 0);
var controls = new THREE.OrbitControls(camera);
//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(0, 0, 4);
controls.update();
//Todo ? Texturescripts?
//${textureScript}




//----------
// Loader
//----------
request(file)
    .then(function(result) {
        addShader(result)
    })




/**
 * Function to add a Shadertoy / Mainstream GLSL Shader to Three JS
 * 
 * @param {any} shader 
 * @param {any} shadertoy 
 */
function addShader(shader, shadertoy) {

    fragmentShader = `    
    uniform vec3        iResolution;
    //uniform float       iGlobalTime;
    uniform float       iTime;
    uniform float       iTimeDelta;
    uniform int         iFrame;
    uniform float       iChannelTime[4];
    //uniform vec3        iChannelResolution[4];
    uniform vec4        iMouse;
    uniform sampler2D   iChannel0;
    uniform sampler2D   iChannel1;
    uniform sampler2D   iChannel2;
    uniform sampler2D   iChannel3;
//                  uniform vec4        iDate;
//                  uniform float       iSampleRate;

void mainImage( out vec4 fragColor, in vec2 fragCoord );

${shader}


`

    //Add shadertoy mocks?
    if (shadertoy) {
        fragmentShader += `// Shadertoy mock
    //note that gl_FragCoord replaces fragCoord and gl_FragColor replaces fragColor in the original demo.
    
    void main(void) {
        vec4 color = vec4(0.0,0.0,0.0,1.0);
        mainImage( color, gl_FragCoord.xy );
        color.w = 1.0;
    }`
    }

    // From shadertoy effect.js
    // if( this.mIs20 ) 
    // this.mImagePassFooter += "\nout vec4 outColor;\n";
    // this.mImagePassFooter += "\nvoid main( void )" +
    // "{" +
    // "vec4 color = vec4(0.0,0.0,0.0,1.0);" +
    // "mainImage( color, gl_FragCoord.xy );" +
    // "color.w = 1.0;";
    // if( this.mIs20 ) 
    // this.mImagePassFooter +=  "outColor = color;}";
    // else
    // this.mImagePassFooter +=  "gl_FragColor = color;}";

    console.log(fragmentShader)

    var shader = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        depthWrite: false,
        depthTest: false,
        uniforms: {
            iResolution: { type: "v3", value: resolution },
            //iGlobalTime: { type: "f", value: 0.0 },
            iTimeDelta: { type: "f", value: 0.0 },
            iTime: { type: "f", value: 0.0 },
            iFrame: { type: "i", value: 0 },
            iChannelTime: { type: "fv1", value: [0., 0., 0., 0.] },
            // iChannelResolution: { type: "v3v", value:
            //     [channelResolution, channelResolution, channelResolution, channelResolution]   
            // },
            iMouse: { type: "v4", value: mouse },
        }
    });
    var quad = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        shader
    );
    scene.add(quad);

    //Add renderer
    render();

    function render() {
        requestAnimationFrame(render);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            resolution = new THREE.Vector3(canvas.clientWidth, canvas.clientHeight, 1.0);
        }

        //Update shader uniforms
        //shader.uniforms['iResolution'].value = resolution;
        //shader.uniforms['iGlobalTime'].value = clock.getElapsedTime();
        shader.uniforms['iTime'].value = clock.getElapsedTime();
        shader.uniforms['iTimeDelta'].value = clock.getDelta();
        shader.uniforms['iFrame'].value = 0;
        shader.uniforms['iMouse'].value = mouse;
        renderer.render(scene, camera);
    }
}





// Promise.all([
//     request("./shaders/metaballs.glsl"),
//     //request("./shaders/pink.frag")
// ])
// .then(function(shaders) {

// })


//-------------
//Promise XMLHttpRequest
//-------------
function request(url, method) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method || "GET", url);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function() {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}