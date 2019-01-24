//replace with fireman and filescreen

var filescreen= new _filescreen({
  headprompt:"Maido: Adaptive task tracker",
  documentQueryKeyword:"listname",
  tutorialEnabled: false,
  savePrefix:"maido"
});

var fireman = new _fireman({
  documentQueryKeyword: "listname",
  load: (doc, id) => {
    filescreen.saveRecentDocument(id,false);
    style = document.createElement("style");
    style.innerHTML = `
      .oLocalOnly{
          display:none;
      }
      `;
    doc.onSnapshot(shot => {
      todolist.fire('load', shot.data());
    })
    todolist.rootdoc=doc;
    todolist.rootcl=doc.collection("tasks");

    todolist.rootcl.onSnapshot(shot => {
      shot.docChanges().forEach(function (change) {
        console.log("got sth...");
        if (change.doc.metadata.hasPendingWrites) return; //dont update on local changes.
        if (change.type == "added") {
          console.log("adding...");
          //remoteUpdate(change.doc.data());
          //if change wasnt driven locally...
          //clog.update(change);
          loadSingleEntry(change.doc.id, change.doc.data());
        } else if (change.type == "removed") {
          console.log("removing...");
          $("span[data-taskgroup='" + change.doc.id + "']").remove();
        } else if (change.type == "modified") {
          console.log("changing...");
          remoteUpdate(change.doc.id, change.doc.data());
        }
      });
    });
    //add handlers for when things change
    $("body").on("input:not(.template) propertychange", "[data-role]", e => {
      var mod = {};
      mod[e.currentTarget.dataset.role] = e.currentTarget.value;
      todolist.rootcl.doc(e.currentTarget.dataset.taskgroup).update(mod);
    });
    todolist.on('add', (span) => {
      todolist.rootcl.doc(span.dataset.taskgroup).set(toWebObj(span));
    });
    todolist.on('remove', (span) => {
    todolist.rootcl.doc(span.dataset.taskgroup).delete();
    })
  },
  autocreate: true,
  makeNewDocument: (doc, id) => {
    doc.update({
      name: id
    });
    //redirect to fireman
    fireman.settings.load(doc, id);
  },
  passwall: true,
  autopass: true,
  blank: ()=>{
    filescreen.showSplash();
  },
  offlineKeyword:"offline",
  offlineLoad:(id)=>{
    filescreen.saveRecentDocument(id);
    startLocal(id);
  },
  config: {
    apiKey: "AIzaSyA-sH4oDS4FNyaKX48PSpb1kboGxZsw9BQ",
    authDomain: "backbits-567dd.firebaseapp.com",
    databaseURL: "https://backbits-567dd.firebaseio.com",
    projectId: "backbits-567dd",
    storageBucket: "backbits-567dd.appspot.com",
    messagingSenderId: "894862693076"
  },
  generateDoc: function(db,docName){
    return db.collection("maido").doc(docName);
  }
});


function toWebObj(node) {
  result = {};
  $(node)
    .find("*")
    .each((i, e) => {
      if (e.dataset.role) {
        if (e.tagName == "INPUT" || e.tagName == "TEXTAREA")
          result[e.dataset.role] = e.value;
        if (e.tagName == "BUTTON") result[e.dataset.role] = e.innerText;
      }
    });
  return result;
}

function remoteUpdate(id, data) {
  if ($("span[data-taskgroup='" + id + "']")[0]) {
    for (p in data) {
      e = $("[data-role='" + p + "'][data-taskgroup='" + id + "']")[0];
      if (e) {
        if (e.tagName == "INPUT" || e.tagName == "TEXTAREA") e.value = data[p];
        if (e.tagName == "BUTTON") e.innerHTML = data[p];
      }
    }
    for (f in precheck) {
      precheck[f]($("span[data-taskgroup='" + id + "']"));
    }
  } else {
    loadSingleEntry(id, data);
  }
}