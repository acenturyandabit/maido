function showCamera() {
    //setup the camera. No point doing it before the user actually uses it.
    /* Setting up the constraint */
    var facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
    var constraints = {
        audio: false,
        video: {
            facingMode: facingMode
        }
    };
    let video = $("#v_camera")[0];
    video.play();
    /* Stream it to video element */

    $('#camera').show();
    let ls;
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function success(stream) {
            video.srcObject = stream;
            ls=stream;
            vw = stream.getVideoTracks()[0].getSettings().width;
            vh = stream.getVideoTracks()[0].getSettings().height;
        });

    $(() => {
        $("#camera").on("click", () => {
            c = document.createElement("canvas");
            ctx = c.getContext('2d');
            ctx.drawImage(video, 0, 0, vw, vh, 0, 0, 200, 100);
            c.toBlob((blob) => {
                (function () {
                    let name = sendMessage(
                        userdata.uid,
                        "Sending picture...",
                        undefined,
                        "none"
                    );
                    storeRoot
                        .child(Date.now().toString())
                        .put(blob)
                        .then(fs => {
                            fs.ref.getDownloadURL().then(url => {
                                msgroot.doc(name).update({
                                    message: url,
                                    metadata: "isImage"
                                });
                                //$("#propic")[0].src = url;
                            });
                        });
                })();
            });
            video.pause();
            video.src="";
            ls.getTracks()[0].stop();
            $("#camera").hide();
        })
    })
}