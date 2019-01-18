function cameraManager(div) {
    let _this = this;
    /* Create the video element*/
    let video = document.createElement("video");
    video.setAttribute("playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.style["max-width"] = "100%";
    video.style["max-height"] = "100%";
    video.style["width"] = "auto";
    video.style["height"] = "auto";
    /* Setting up the constraint */
    let facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
    let constraints = {
        audio: false,
        video: {
            facingMode: facingMode
        }
    };
    /* Stream it to video element */
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function success(stream) {
            video.srcObject = stream;
            _this.vw = stream.getVideoTracks()[0].getSettings().width;
            _this.vh = stream.getVideoTracks()[0].getSettings().height;
        });
    div.appendChild(video);
    ////// EVENTS API TEMPLATE /////
    if (this.events==undefined){
        this.events = [];
    }
    this.on = function (e, f) {
        if (this.events[e])this.events[e].push(f);
        else this.events[e]=[f];
    }
    this.fire = function (e, args) {
        if (this.events[e]) this.events[e].forEach((i) => {
            try {
                i(args)
            } catch (e) {
                console.log(e);
            }
        })
    }
    // for people who like it old school
    this.addEventListener=function(e,f){
        this.on(e,f);
    }
    //////END EVENTS API TEMPLATE/////
    div.addEventListener("click", (e) => {
        c = document.createElement("canvas");
        c.width=_this.vw;
        c.height=_this.vh;
        ctx = c.getContext('2d');
        ctx.drawImage(video, 0, 0, _this.vw, _this.vh, 0, 0, _this.vw, _this.vh);
        _this.fire('photo',c);
    })
}