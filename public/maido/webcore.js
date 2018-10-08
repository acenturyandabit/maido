var urlParams = new URLSearchParams(window.location.search);
var listName = urlParams.get('listname');
var rootcl; // firebase root document collection reference
if (listName && window.location.href.slice(undefined, 4) != "file") {
    style = document.createElement("style")
    style.innerHTML = `
    .oLocalOnly{
        display:none;
    }
    `
    var config = {
        apiKey: "AIzaSyA-sH4oDS4FNyaKX48PSpb1kboGxZsw9BQ",
        authDomain: "backbits-567dd.firebaseapp.com",
        databaseURL: "https://backbits-567dd.firebaseio.com",
        projectId: "backbits-567dd",
        storageBucket: "backbits-567dd.appspot.com",
        messagingSenderId: "894862693076"
    };
    firebase.initializeApp(config);
    // get querystring name of set
    let 
    db = firebase.firestore();
    db.settings({
        timestampsInSnapshots: true
    });
    //db.enablePersistence();
    $(document).ready(() => {
        if (listName) {
            db.collection("maido").doc(listName).get().then((doc) => {
                if (doc.exists) {
                    rootcl = db.collection("maido").doc(listName).collection("tasks");
                    /*rootcl.get().then((shot) => {
                        shot.forEach((doc) => {
                            loadSingleEntry();
                        })
                    });*/
                    rootcl.onSnapshot((shot) => {
                        shot.docChanges().forEach(function (change) {
                            console.log("got sth...");
                            if (change.doc.metadata.hasPendingWrites)return;//dont update on local changes.
                            if (change.type == "added") {
                                console.log("adding...");
                                //remoteUpdate(change.doc.data());
                                //if change wasnt driven locally...
                                //clog.update(change);
                                loadSingleEntry(change.doc.id,change.doc.data())
                            }else if (change.type=="removed"){
                                console.log("removing...")
                                $("tr[data-taskgroup='"+change.doc.id+"']").remove();
                            }else if (change.type=="modified"){
                                console.log("changing...")
                                remoteUpdate(change.doc.id,change.doc.data())
                            }
                        });
                    })
                } else {
                    //Show not found screen
                    $("#dnfDialog").show();
                }
                //add handlers for when things change
                $("body").on("input propertychange", "[data-role]", (e) => {
                    var mod = {};
                    mod[e.currentTarget.dataset.role] = e.currentTarget.value;
                    rootcl.doc(e.currentTarget.dataset.taskgroup).set(mod, {
                        merge: true
                    });
                })

                //adding tasks


            });
        } else {
            //Show not found screen
            $("#dnfDialog").show();
        }
    });
}else{
    startLocal();
}

function toWebObj(node) {
    result = {};
    $(node).find("*").each((i, e) => {
        if (e.dataset.role) {
            if (e.tagName == 'INPUT' || e.tagName == 'TEXTAREA') result[e.dataset.role] = e.value;
            if (e.tagName == 'BUTTON') result[e.dataset.role] = e.innerText;
        }
    })
    return result;
}

function remoteUpdate(id, data) {
    if ($("tr[data-taskgroup='" + id + "']")[0]) {
        for (p in data) {
            e=$("[data-role='"+p+"'][data-taskgroup='" + id + "']")[0]
            if (e) {
                if (e.tagName == 'INPUT' || e.tagName == 'TEXTAREA') e.value = data[p];
                if (e.tagName == 'BUTTON') e.innerHTML = data[p];
            }
        }
        for (f in precheck) {
            precheck[f]($("tr[data-taskgroup='"+id+"']"));
        }
    } else {
        loadSingleEntry(id, data)
    }
}