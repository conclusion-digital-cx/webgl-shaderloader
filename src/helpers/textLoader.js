function createElementMaterial() {

    var material = new THREE.MeshBasicMaterial(); // create a material

    var loader = new THREE.TextureLoader().load(
        // resource URL
        IMG_MACHINE,
        // Function when resource is loaded
        function(texture) {
            // do something with the texture
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.offset.x = 90 / (2 * Math.PI);
            material.map = texture; // set the material's map when when the texture is loaded
        },
        // Function called when download progresses
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // Function called when download errors
        function(xhr) {
            console.log('An error happened');
        }
    );
    return material; // return the material
}