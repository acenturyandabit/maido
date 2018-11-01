function makeNewTask() {
    newNode = $("#todolist span.template")[0].cloneNode(true)
    newNode.classList.remove('pintotop');
    newNode.classList.remove('template');
    $(newNode).find("button").text("Remove")
    newNode.dataset.taskgroup = guid();
    $(newNode).find("*").each((i, e) => {
        e.dataset.taskgroup = newNode.dataset.taskgroup
    })
    $("#todolist").append(newNode);
    dbox = $("#todolist_db .template")[0].cloneNode(true);
    dbox.classList.remove("template");
    dbox.dataset.taskgroup = newNode.dataset.taskgroup;
    $("#todolist_db").append(dbox);
    first_sort();
    //$(newNode).find("." + e.currentTarget.classList[0]).focus()
    //$(newNode).find("." + e.currentTarget.classList[0])[0].setSelectionRange(1, 1)
    $("#todolist span.template input").each((i, e) => {
        e.value = "";
        e.style.color = "black";
        e.style.background = "white";
    })
    if (rootcl) {
        rootcl.doc(newNode.dataset.taskgroup).set(toWebObj(newNode));
    }
    $("#todolist").removeClass("searchfilter");
    newInstance = $(newNode).find("[data-role='" + lastFocused.dataset.role + "']")[0];
    date_reparse($(newNode).find("[data-role='date']")[0]);
    newInstance.focus();
    newInstance.scrollIntoViewIfNeeded();
    $("#nothingLeft").hide();
    return newNode;
}
$(document).ready(() => {
    $("#todolist").on("keyup", ".template input", (e) => {
        if (e.keyCode == 13) {
            makeNewTask();
        }lastFocused=e.currentTarget;
    })
    /*$("#todolist span.template input[data-role='name']").on("keyup",(e)=>{
        if (e.currentTarget.value!=""){
            cval=e.currentTarget.value;
            
        }else{
            $("#todolist").removeClass("searchfilter");
        }
    })*/
    $("#todolist").on("click", "span:not(.template) button.remove", (e) => {
        if (rootcl) {
            rootcl.doc(e.currentTarget.parentElement.parentElement.dataset.taskgroup).delete();
        }
        $("#todolist_db textarea[data-taskgroup='" + e.currentTarget.parentElement.dataset.taskgroup + "']").remove();
        $(e.currentTarget.parentElement).remove();
        if ($("#todolist span:not(.template)").length == 0) $("#nothingLeft").show();
        else $("#nothingLeft").hide();
        //push a deleted onto the changelog
    })

    $("#todolist span.template button.remove").on("click", (e) => {
        //now a subtask button
        /*
        $("#todolist span.template input").each((i, e) => {
            e.value = ""
        });*/
        if ($("#todolist_db textarea:visible").length) {
            parent=$("#todolist_db textarea:visible")[0].dataset.taskgroup;
            nt=makeNewTask();
            if(parent){
                $("#todolist span[data-taskgroup='"+parent+"']").append(nt);
            }
            nt.scrollIntoViewIfNeeded();
        }

    })

    $("#todolist").on("keypress", "[data-role='date']", (e) => {
        if (e.currentTarget.parentElement.classList.contains("template")) return;
        if (e.keyCode == 13) {
            date_reparse(e.currentTarget);
        }
    })
    $("#todolist").on("keypress", "span:not(.template) input", (e) => {
        if (e.keyCode == 13) {
            e.currentTarget.blur();
            //$("#todolist_db textarea").hide();
            //date_reparse(e.currentTarget);
        }
    })
    $("#todolist").on("focus", "span", (e) => {
        // retract the previous textarea
        if (!e.currentTarget.classList.contains("template")) {
            $("#todolist_db textarea").hide();
            $("textarea[data-taskgroup='" + e.currentTarget.dataset.taskgroup + "']").show();
        }
    })

})


/////////////Drag and drop to order
var dragting;
$(() => {
    $("#todolist").on("drag", "span", (ev) => {
        dragting = ev.target.dataset.taskgroup;
    })
    $("#todolist").on("dragleave", "span", (ev) => {
        ev.preventDefault();
        ev.currentTarget.style["border-bottom"] = "";
        ev.currentTarget.style["border-top"] = "";
        ev.currentTarget.style.background = "";
    })
    $("#todolist").on("dragover", "span", (ev) => {
        ev.preventDefault();
        ev.currentTarget.style.background = "grey";
        if (ev.pageX - $(ev.currentTarget).offset().left > ev.currentTarget.offsetWidth / 3) {
            ev.currentTarget.style["border-bottom"] = "5px solid green";
            ev.currentTarget.style["border-top"] = "";
        } else if (ev.pageY - $(ev.currentTarget).offset().top > ev.currentTarget.offsetHeight / 3) {
            ev.currentTarget.style["border-bottom"] = "5px solid red";
            ev.currentTarget.style["border-top"] = "";
        } else {
            ev.currentTarget.style["border-top"] = "5px solid blue";
            ev.currentTarget.style["border-bottom"] = "";
        }
    })
    $("#todolist").on("drop", "span", (ev) => {
        ev.preventDefault();
        ev.currentTarget.style["border-bottom"] = "";
        ev.currentTarget.style["border-top"] = "";
        ev.currentTarget.style.background = "";
        //check if the target has an id
        toDrop = $("span[data-taskgroup='" + dragting + "'")[0];
        target = ev.currentTarget;
        if (ev.pageX - $(ev.currentTarget).offset().left > ev.currentTarget.offsetWidth / 3) {
            $(target).append(toDrop);
        } else if (ev.offsetY > ev.currentTarget.offsetHeight / 2) {
            nuid = assertID(target);
            $(toDrop).find("[data-role='date']")[0].value += " after:" + nuid;
        } else {
            nuid = assertID(target);
            $(toDrop).find("[data-role='date']")[0].value += " before:" + nuid;
        }
        first_sort();

    })
});

function assertID(span) {
    if (!$(target).find("[data-role='date']")[0].dataset.id) {
        assID = Date.now();
        $(span).find("[data-role='date']")[0].dataset.id = nuid;
        $(span).find("[data-role='date']")[0].value += " id:" + nuid;
    } else {
        assdID = $(span).find("[data-role='date']")[0].dataset.id;
    }
    return assdID;
}