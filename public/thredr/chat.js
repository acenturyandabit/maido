function loadMessages() {
    db.collection('hyperthreader').doc(roomName).get().then((doc) => {
        if (doc.exists) {

        } else {
            msgroot = db.collection('hyperthreader').doc(roomName).collection('messages');
            //create a new room, if appropriate authorisation.
            db.collection('hyperthreader').doc(roomName).set({
                "onlineUsers": []
            });
            //db.collection('hyperthreader').doc(roomName).collection('messages').add("Hello world!");
        }
        msgroot = db.collection('hyperthreader').doc(roomName).collection('messages');
        msgroot.onSnapshot((shot) => {
            shot.docChanges().forEach((change) => {
                if (change.type == "added") {
                    if (change.doc.metadata.hasPendingWrites) return;
                    loadMessage(change.doc.data(), change.doc.id);
                    //add a new message to the chat.
                } else if (change.type == "modified") {
                    updateMessage(change.doc.data(), change.doc.id);
                }
            })
        })
    })
}


var currentThread = "main";
//sendmessage: fired when LOCAL USER sends a message.
function sendMessage(user, prev, message, mname, metadata) {
    chrono_id = user + Date.now();
    newItem = {
        uid: user,
        msg: message,
        p: prev,
        meta: metadata,
        thread: currentThread
    };
    if (!mname) {
        //new message
        msgroot.doc(chrono_id).set(newItem);
    } else {
        msgroot.doc(mname).update(newItem);
    }
    loadMessage(newItem, chrono_id);
    /*
    if (metadata == "isImage") {
        trd.innerHTML = `<span class="msg"><span class="user">` + user + `:</span><img src='` + message + `'><span class="tid">>` + smartThreadID(toput, message) + `</span>`;
    } else {

        trd.innerHTML = `<span class="msg"><span class="user">` + user + `:</span><span class="innermsg">` + message + `</span><span class="tid">>` + smartThreadID(toput, message) + `</span>`;
    }*/
}

//loadMessage: fired when message recieved from server.
function loadMessage(data, id) {
    newItem = $.parseHTML(
        `<div class='msg' data-mid='` + id + `'>
        <span>` + data.uid + `</span><span>` + data.msg + `</span>
        <span>timestamp</span>
        </div>`
    )[0];
    //put it after its previous item.
    if (data.p != "") {
        function tryAppendlist(_newItem, prev) {
            if ($("#chatbox div[data-mid='" + prev + "'] ").length > 0) {
                $("#chatbox div[data-mid='" + prev + "'] ").after(_newItem);
            } else {
                setTimeout(()=>{tryAppendlist(_newItem,prev)},300);
            }
        }
        tryAppendlist(newItem,data.p);
    } else {
        $("#chatbox").append(newItem);
    }
    if (currentThread == data.thread) {
        $(newItem).show();
        //show it.
    } else {
        $(newItem).hide();
    }
    // create a div for the message, and hide it. 
    // if it is the last message of the current thread, then show it.
    // if message is the final message of a thread, then so be it. 
    // otherwise we need to figure out which thread it belongs to. 
}

/*
//update images.
function updateMessage(data, id) {
    if (data.metadata == "isImage") $("[data-dbid='" + id + "']").children(".msg").children(".innermsg")[0].innerHTML = "<img src='" + data.message + "'>";
}*/

var storeRoot;

$(() => {
    $("#textbox").on("keyup", (e) => {
        cbox = e.currentTarget;
        cbox.style.backgroundColor = "white";
        if (e.key == "Enter") {
            if (cbox.value != "") {
                if ($("#chatbox>div:visible").length > 0) {
                    pm = $("#chatbox>div:visible").last()[0].dataset.mid;
                } else {
                    pm = "";
                }
                sendMessage(userdata.uid, pm, $("#textbox")[0].value, undefined, "none");
                cbox.value = "";
            }
        }
    })
    /*
        $("#filebox").on("change", (e) => {
            console.log(e);
            if (e.currentTarget.files.length) {
                //wait for the user to hit enter before sending
                cbox = $("#textbox")[0];
                (function () {
                    let name = sendMessage($("#username").text(), cbox.placeholder.slice(1), "Sending picture...");
                    storeRoot.child(Date.now().toString()).put(e.currentTarget.files[0]).then((fs) => {
                        fs.ref.getDownloadURL().then((url) => {
                            dbroot.doc(name).update({
                                message: url,
                                metadata: "isImage"
                            });
                            //$("#propic")[0].src = url;

                        })
                    })
                })();
            }
            //return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
            // 3 - Generate a public URL for the file.
            //return fileSnapshot.ref.getDownloadURL().then((url) => {
              // 4 - Update the chat message placeholder with the image's URL.
              //return messageRef.update({
                //imageUrl: url,
                //storageUri: fileSnapshot.metadata.fullPath
              //});
            //});
        })*/
});