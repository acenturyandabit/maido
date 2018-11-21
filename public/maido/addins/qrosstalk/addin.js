addins.qrosstalk = new function(){
  let ptr = this;
  this.init = function () {
    //add 3 relevant scripts
    $("head").append(
      `<script src='addins/qrosstalk/instascan.min.js'></script><script src='addins/qrosstalk/qrcode.min.js'></script><script src='addins/qrosstalk/qrosstalk.js'></script>`
    );
    //add a new dialog
    $("body").append(
      `<div class="dialog" id="qrosstalk_dialog">
        <div style="display: flex; height: 100%;">
            <div class="inner_dialog">
                <div id="qrossbox">
                </div>
                <p id="qross_status">Waiting for other transciever...</p>
            </div>
        </div>
    </div>
        `
    );
    $("head").append(
      `<style>
      #qrosstalk_dialog{
        background:white;
        
      }
      #qrosstalk_dialog img{
        margin: auto;
      }
      #qrosstalk_dialog div.inner_dialog{
        width:auto;
        margin-top:0;
        background: white;
        padding: 30px;
        color: black;
      }
      </style>
        `
    );
    //add action button to transfer tasks and recieve tasks
    $(".maiTitle li:contains('Actions')>div").append(
      `<a onclick="addins.qrosstalk.send()">Send via QR</a>
      <a onclick="addins.qrosstalk.recv()">Recieve via QR</a>`
    );
    ptr.qrosstalk = new _qrosstalk($("#qrossbox")[0]);
    ptr.qrosstalk.on("done", (response) => {
      if (this.mode=="recv")loadFromString(response);
      ptr.qrosstalk.cleanup();
      $("#qrosstalk_dialog").hide();
    });
    ptr.qrosstalk.on("gotChunk",()=>{
      $("#qross_status").text(ptr.qrosstalk.tpos+"/"+ptr.qrosstalk.toSend.length);
    })
    $("body").on('keyup', /*'.dialog',*/ (e) => {
      if (e.keyCode == 27) {
        ptr.qrosstalk.cleanup();
      }
    })
  };
  this.send = function () {
    this.mode="send";
    $("#qrosstalk_dialog").show();
    ptr.qrosstalk.send(getSaveString());
  };

  this.recv = function () {
    this.mode="recv";
    $("#qrosstalk_dialog").show();
    ptr.qrosstalk.receive();
  };
  //if user hits esc, close down qrosstalk.
}