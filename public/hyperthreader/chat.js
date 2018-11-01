function smartThreadID(root, message) {
    // pick longest word from message
    threadname = "";
    k = message.split(" ");
    while ((z = k.pop()) != undefined) {
        if (z.length > threadname.length) {
            threadname = z;
        }
    }
    //trim to 5 letters
    threadname = threadname.slice(0, 5)
    _threadname = threadname;
    subseq = 0;
    //check for uniqueness
    while ($(".tid:contains(" + threadname + ")").length) {
        subseq++;
        threadname = _threadname + subseq;
    }
    return threadname;
}

function sendMessage(user, root, message, mname,metadata) {
    if (!mname && dbroot) {
        mname=Date.now().toString() + user;
        dbroot.doc(mname).set({
            user: user,
            root: root,
            message: message
        });
    }
    toput = $("#chatbox")[0];
    if (root.length > 1 && $(".tid:contains(" + root.slice(1) + ")").length) {
        toput = $(".tid:contains(" + root.slice(1) + ")")[0].parentElement.parentElement;
    }
    trd=document.createElement("span");
    trd.classList.add("thread");
    trd.dataset.dbid=mname;
    if (metadata=="isImage"){
        trd.innerHTML=`<span class="msg"><span class="user">` + user + `:</span><img src='`+message+`'><span class="tid">>` + smartThreadID(toput, message) + `</span>`;
    }else{
        
        trd.innerHTML=`<span class="msg"><span class="user">` + user + `:</span><span class="innermsg">` + message + `</span><span class="tid">>` + smartThreadID(toput, message) + `</span>`;
    }
    $(toput).append(trd);
    //$(toput).children()[$(toput).children().length - 1].scrollIntoView();
    //some other form of alert
    reappend_ehere();
    return mname;
}

function loadMessage(data,name) {
    sendMessage(data.user, data.root, data.message, name,data.metadata);
}

function updateMessage(data,id){
    if (data.metadata=="isImage")$("[data-dbid='"+id+"']").children(".msg").children(".innermsg")[0].innerHTML="<img src='"+data.message+"'>";
}
var dbroot;

function reappend_ehere() {
    //deexpand parent element
    root = $("#ehere")[0];
    while (root.parentElement.classList.contains("subVisible")) {
        root.parentElement.classList.remove("subVisible");
        root = root.parentElement;
    }

    newroot = $("#textbox")[0].placeholder.slice(1);
    if (newroot == ">") {
        $("#chatbox").append($("#ehere")[0]);
    } else {
        $($(".tid").filter(
            (i, e) => {
                return $(e).text() === newroot;
            }
        ).slice(0, 1)[0].parentElement.parentElement).append($("#ehere")[0]);
    }
    $("#ehere")[0].parentElement.scrollIntoView();
    root = $("#ehere")[0];
    while (root.parentElement.classList.contains("thread")) {
        root.parentElement.classList.add("subVisible");
        root = root.parentElement;
    }
    $("#ehere")[0].scrollIntoViewIfNeeded();
    $("#chatscreen").show();
}
var storeRoot;

function initialiseConversation(name) {
    document.title = name;
    $("#titlebar").text(name)
    $("#textbox")[0].placeholder = "@>";
    db.collection('hyperthreader').doc(name).get().then((doc) => {
        if (doc.exists) {
            //load the doc messages
            dbroot = db.collection('hyperthreader').doc(name).collection('messages');
            dbroot.onSnapshot((shot) => {
                shot.docChanges().forEach((change) => {
                    if (change.type == "added") {
                        if (change.doc.metadata.hasPendingWrites) return;
                        loadMessage(change.doc.data(),change.doc.id);
                        //add a new message to the chat.
                    }else if (change.type=="modified"){
                        updateMessage(change.doc.data(),change.doc.id);
                    }
                })
            })
            reappend_ehere();
            //set storage to appropriate storage
            storeRoot = storage.ref().child("hyperthreader").child(name);
        }
    })
}
$(() => {
    $("#textbox").on("keyup", (e) => {
        cbox = e.currentTarget;
        cbox.style.backgroundColor = "white";

        if (e.key == "ArrowUp") {
            preThread = $("#ehere")[0].previousElementSibling;
            if (!preThread) return; //do nothing
            while (preThread && preThread.classList.contains("msg")) {
                preThread = preThread.parentElement.previousElementSibling;
            }
            if (!preThread) return; //do nothing if no previous thread - we are at root.
            while ($(preThread).children().find(".thread").length > 0) {
                preThread = $(preThread).children().find(".thread").last()[0];
            }
            cbox.placeholder = "@" + $(preThread).children(".msg").children(".tid")[0].innerText;
            reappend_ehere();
        }
        if (e.key == "ArrowDown") {
            root = $("#ehere")[0];
            preThread = root.nextElementSibling;
            while (!preThread) {
                if (root.parentElement.id == "chatbox") {
                    cbox.placeholder = "@>";
                    reappend_ehere();
                    return;
                } else {
                    root = root.parentElement;
                    preThread = root.nextElementSibling;
                }
            }
            cbox.placeholder = "@" + $(preThread).children(".msg").children(".tid")[0].innerText;
            reappend_ehere();
            //either a message the root chatbox
        }
        if (e.key == "Enter") {
            if (cbox.value[0] != ">" && cbox.value != "") {
                sendMessage($("#username").text(), cbox.placeholder.slice(1), $("#textbox")[0].value);
                cbox.value = "";
            } else if (cbox.value[0] == ">" && cbox.value != "") {
                //probably autocomplete so we have a valid identifier
                newroot = cbox.value.split(":")[0];
                if ($(".tid").filter((i, e) => {
                        return $(e).text() === newroot;
                    }).length || newroot == ">") { //// if there is a valid identifier:
                    kai = cbox.value.split(':');
                    cbox.placeholder = "@" + kai.shift();
                    if (kai.length) {
                        sendMessage($("#username").text(), cbox.placeholder.slice(1), kai.join(":"));
                    }
                    reappend_ehere();
                    cbox.value = "";
                } else {
                    // show an error message
                }
            }

        }
        if (cbox.value.length > 0 && cbox.value[0] == ">") {
            $("#hoverbox").empty();
            newroot = cbox.value.split(":")[0];
            $(".tid:contains(" + newroot + ")").each((i, e) => {
                $("#hoverbox").append(`<p>` + e.innerText + `<\p>`);
            });
            if ($(".tid:contains(" + newroot + ")").length == 0 && newroot.length > 1) {
                cbox.style.backgroundColor = "coral";
            }
            //populate hoverbox with a bunch of relevant divs.
            $("#hoverbox").show();
            //change root; show popup div.
        } else {
            $("#hoverbox").hide();

        }
    })


    $("#filebox").on("change", (e) => {
        console.log(e);
        if (e.currentTarget.files.length) {
            //wait for the user to hit enter before sending
            cbox=$("#textbox")[0];
            (function(){
            let name=sendMessage($("#username").text(), cbox.placeholder.slice(1), "Sending picture...");
            storeRoot.child(Date.now().toString()).put(e.currentTarget.files[0]).then((fs) => {
                fs.ref.getDownloadURL().then((url) => {
                    dbroot.doc(name).update({message:url,metadata:"isImage"});
                    //$("#propic")[0].src = url;

                })
            })})();
        }
        /*return firebase.storage().ref(filePath).put(file).then(function(fileSnapshot) {
        // 3 - Generate a public URL for the file.
        return fileSnapshot.ref.getDownloadURL().then((url) => {
          // 4 - Update the chat message placeholder with the image's URL.
          return messageRef.update({
            imageUrl: url,
            storageUri: fileSnapshot.metadata.fullPath
          });
        });*/
    })
});

$(() => {
    /*var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // Start loading the page.*/
    k = new URLSearchParams(window.location.search);
    if (k.has("room")) initialiseConversation(k.get("room"));
    else {
        //take a peekaboo at the user's config and figure out which room should be loaded. Load a dummy room for now.
        window.location.href = "index.html";
    }
    /*
    }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    });*/
})