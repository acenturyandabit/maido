function _qrosstalk(divRoot) {
  //TODO: verify dependencies

  //initialise everything
  //TODO: make new video element instead of relying on existing.
  vd = document.createElement("video");
  vd.style.display = "none";
  divRoot.appendChild(vd);
  this.scanner = new Instascan.Scanner({
    video: vd
  });
  let ptr = this;
  this.scanner.addListener("scan", function (content) {
    ptr.update(content);
  });
  let scnr = this.scanner;
  let cam;
  Instascan.Camera.getCameras()
    .then(function (cameras) {
      if (cameras.length > 0) {
        cam = cameras[0];
        //TODO: ask user to pick starting cam

      } else {
        console.error("No cameras found.");
      }
    })
    .catch(function (e) {
      console.error(e);
    });
  this.qrc = new QRCode(divRoot, {
    text: "#hello#",
    width: window.innerHeight / 2,
    height: window.innerHeight / 2
  });
  //qrc.clear();

  this.tx = () => {
    this.qrc.clear();
    let msg = "";
    msg += this.Rcv + "#";
    msg += this.tpos + "#";
    msg += this.toSend.length + "#";
    msg += this.toSend.slice(this.tpos, this.tpos + 150);
    this.qrc.makeCode(msg);
  };
  this.send = msg => {
    this.toSend = msg;
    transmitter = setInterval(this.tx, 200);
    scnr.start(cam);
  };
  this.receive = () => {
    this.toSend = "";
    transmitter = setInterval(this.tx, 200);
    scnr.start(cam);
  };
  //TODO: transcieve function

  this.tpos = 0;
  this.toSend = ``;
  this.msg = "";
  this.Rcv = 0;
  this.update = msg => {
    bits = msg.split("#");
    j = bits.splice(3, bits.length);
    j = j.join("#");
    this.tpos = Number(bits[0]);
    if (Number(bits[1]) > this.Rcv) {
      //wait a bit. we lost the connection :/
    } else {
      this.msg = this.msg.slice(0, Number(bits[1]));
      this.msg += j;
      this.Rcv = Number(bits[1]) + j.length;
    }
    this.fire("gotChunk", j);
    if (this.tpos == this.toSend.length && this.Rcv == Number(bits[2])) {
      this.tx(); //send a goodbye
      //wait a bit
      setTimeout(() => {
        clearInterval(transmitter);
        this.fire("done", this.msg);
        this.cleanup();
      }, 1000);

      return 1;
    }
    return 0;
  };
  this.eventHandlers = {};
  this.on = (e, f) => {
    if (!this.eventHandlers[e]) this.eventHandlers[e] = [];
    this.eventHandlers[e].push(f);
  };
  this.fire = (e, a) => {
    if (this.eventHandlers[e]) {
      this.eventHandlers[e].forEach((v, i) => {
        v(a);
      });
    }
  };

  this.cleanup = () => {
    scnr.stop();
    try {
      clearInterval(transmitter);
    } catch (e) {

    }

  }
}