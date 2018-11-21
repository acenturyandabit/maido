////////////////////// UI handling //////////////////////
var thredr = new Proxy({}, {
    set: function (obj, prop, v) {
        if (prop == "currentThread") {
            $(".threadName").text(v);
        }
        obj[prop] = v;
    }
});

$(document).ready(() => {
    $("body").on('keyup', /*'.dialog',*/ (e) => {
        if (e.keyCode == 27) $(".dialog").hide()
    })
});

$(() => {
    $("#sidebar").on("click", "div[data-tid]", e => {
        showThread(e.currentTarget.dataset.tid);
    });
    thredr.currentThread = "main";
});

function showThread(t) {
    thredr.currentThread = t;
    $(".msg").hide();
    $(".msg[data-" + t + "]").show();
}

////////////////////////data and data storage /////////////////////////
var storeRoot;
var msgroot;
var thrdroot;
var userRoot;

function loadMessages() {
    db.collection("hyperthreader")
        .doc(roomName)
        .get()
        .then(doc => {
            if (!doc.exists) {
                msgroot = db
                    .collection("hyperthreader")
                    .doc(roomName)
                    .collection("messages");
                //create a new room, if appropriate authorisation.
                db.collection("hyperthreader")
                    .doc(roomName)
                    .set({
                        onlineUsers: []
                    });
                db.collection("hyperthreader")
                    .doc(roomName)
                    .collection("threads")
                    .doc("main")
                    .set({
                        prettyName: "main"
                    });
            }
            //ensure userdata exists.
            db.collection("hyperthreader")
                .doc(roomName)
                .collection("users")
                .doc(userdata.uid)
                .get()
                .then(d => {
                    if (!d.exists) {
                        db.collection("hyperthreader")
                            .doc(roomName)
                            .collection("users")
                            .doc(userdata.uid)
                            .set({
                                prettyName: userdata.prettyName
                            });
                    }
                });
            //create/open a storage bucket.
            storeRoot = storage
                .ref()
                .child("hyperthreader")
                .child(roomName);
            $(".titlebar").text(roomName);
            msgroot = db
                .collection("hyperthreader")
                .doc(roomName)
                .collection("messages");
            msgroot.onSnapshot(shot => {
                shot.docChanges().forEach(change => {
                    function loadMessage(data, id) {
                        try {
                            if ($(".msg[data-mid='" + id + "']").length == 0) {
                                newItem = $.parseHTML(
                                    `<div class='msg' data-mid='` +
                                    id + `' data-uid='` + data.uid +
                                    `' data-date='` + data.t + `'>
                            <span>` +
                                    userdata.others[data.uid].prettyName +
                                    `:</span><span>` +
                                    data.msg +
                                    `</span>
                            <span>:: ` + new Date(data.t).toLocaleTimeString() + `</span>
                            </div>`
                                )[0];
                            } else {
                                newItem = $(".msg[data-mid='" + id + "']")[0];
                            }
                            if (data.threads) {
                                for (i in data.threads) {
                                    newItem.dataset[i] = 1;
                                }
                            }
                            if (data.metadata == "isImage")
                                newItem.children[1].innerHTML =
                                "<img src='" + data.message + "'>";
                            //tactfully put it into the box. Go backwards from the last message until you find a message earlier than it, and put it behind that message.

                            wasAppended = false;
                            $("#chatbox div.msg").sort((a, b) => {
                                return b.dataset.date - a.dataset.date
                            }).each((i, e) => {
                                if (Number(e.dataset.date) < Number(data.t)) {
                                    $(e).after(newItem);
                                    wasAppended = true;
                                    return false;
                                }
                            })
                            if (!wasAppended){
                                $("#chatbox").append(newItem);
                            } 
                            if (data.threads && data.threads[thredr.currentThread]) {
                                $(newItem).show();
                                //show it.
                            } else {
                                $(newItem).hide();
                                //put a blink on the thread indicator.
                            }
                        } catch (e) {
                            setTimeout(function () {
                                loadMessage(data, id);
                            }, 300);
                        }
                    }
                    loadMessage(change.doc.data(), change.doc.id);
                });
            });
            thrdroot = db
                .collection("hyperthreader")
                .doc(roomName)
                .collection("threads");
            thrdroot.onSnapshot(shot => {
                shot.docChanges().forEach(change => {
                    //if (change.doc.metadata.hasPendingWrites) return;
                    let data = change.doc.data();
                    let id = change.doc.id;
                    if ($(".thread [data-tid='" + id + "']").length > 0) {
                        kai = $(".thread [data-tid='" + id + "']")[0];
                        //update prettyname, etc.
                        kai.children[0].innerText = data.prettyName;
                    } else {
                        newItem = $.parseHTML(
                            `<div class='thread' data-tid='` +
                            id +
                            `'>
                        <span class='prettyName'>` +
                            data.prettyName +
                            `</span>`
                        )[0];
                        $("em:contains('Recent threads')")
                            .parent()
                            .append(newItem);
                    }
                });
            });
            userRoot = db
                .collection("hyperthreader")
                .doc(roomName)
                .collection("users");
            userRoot.onSnapshot(shot => {
                shot.docChanges().forEach(change => {
                    //if (change.doc.metadata.hasPendingWrites) return;
                    userdata.others[change.doc.id] = change.doc.data();
                    $(`div.msg[data-uid="` + change.doc.id + `"]>span:nth-child(1)`).text(userdata.others[change.doc.id].prettyName + ":");
                });
            });
        });
}

//////////////////////////// Local user sending information /////////////////////////////////

//sendmessage: fired when LOCAL USER sends a message.
function sendMessage(user, message, mname, metadata) {
    chrono_id = user + Date.now();
    newItem = {
        uid: user,
        msg: message,
        t: Date.now(),
        meta: metadata,
        threads: {},
        primary_thread: thredr.currentThread
    };
    newItem.threads[thredr.currentThread] = 1;
    if (!mname) {
        //new message
        msgroot.doc(chrono_id).set(newItem);
    } else {
        msgroot.doc(mname).update(newItem);
    }
    //loadMessage(newItem, chrono_id);
    return chrono_id;
}

//changing username
$(() => {
    $("#username").on("input", e => {
        userRoot.doc(userdata.uid).update({
            prettyName: userdata.prettyName
        });
        localStorage.setItem('userdata', JSON.stringify(userdata.saveableData()));
    });
});

function deselect() {
    $(".msg.selected").removeClass("selected");
    $(".floatyButtons").hide();
}

function fork() {
    //generate new thread ID
    tid = puid();
    // add selected messages to thread
    $(".msg.selected").each((i, e) => {
        e.dataset[tid] = 1;
        msg_up_ob = {
            primary_thread: tid
        };
        msg_up_ob["threads." + tid] = 1;
        msgroot.doc(e.dataset.mid).update(msg_up_ob);
    });
    //send thread information
    thrdroot.doc(String(tid)).set({
        prettyName: tid
    });
    // set current thread as active
    showThread(tid);
    //show thread in sidebar

    //deselect.
    deselect();
}

$(() => {
    $("#textbox").on("keyup", e => {
        cbox = e.currentTarget;
        cbox.style.backgroundColor = "white";
        if (e.key == "Enter") {
            if (cbox.value != "") {
                if ($("#chatbox>div:visible").length > 0) {
                    pm = $("#chatbox>div:visible").last()[0].dataset.mid;
                } else {
                    pm = "";
                }
                sendMessage(userdata.uid, $("#textbox")[0].value, undefined, "none");
                cbox.value = "";
            }
        }
    });
    $("#chatbox").on("click", "div.msg", e => {
        e.currentTarget.classList.add("selected");
        fb = $(".floatyButtons")[0];
        fb.style.left = e.pageX;
        fb.style.top = e.pageY;
        $(".floatyButtons").show();
    });
    $("#filebox").on("change", e => {
        console.log(e);
        if (e.currentTarget.files.length) {
            //wait for the user to hit enter before sending
            cbox = $("#textbox")[0];
            (function () {
                let name = sendMessage(
                    userdata.uid,
                    "Sending picture...",
                    undefined,
                    "none"
                );
                storeRoot
                    .child(Date.now().toString())
                    .put(e.currentTarget.files[0])
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
        }
    });
});