function photobooth(div) {
    //make a wrapper
    this.div = document.createElement("div")
    this.div.innerHTML =
        `
    <div class="camera" style="position:relative;">
        <div class="cameraNode" style="position: absolute"></div>
        <div class="cameraOverlay" style="position: absolute"></div>
    </div>
    <div class="Result" style="position:relative;">
        <div class="cameraNode" style="position: absolute"></div>
        <div class="cameraOverlay" style="position: absolute"></div>
    </div>
    `;
    div.appendChild(this.div)
    this.camman = new cameraManager(this.div.children[0].children[0]);
    
}