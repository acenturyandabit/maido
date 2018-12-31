function guid() {
    let pool="1234567890qwertyuiopasdfghjklzxcvbnm";
    do{
        tguid="";
        for (i=0;i<4;i++)tguid+=pool[Math.floor(Math.random()*pool.length)];
    }while ($("[data-taskgroup='"+tguid+"']").length>0);
    return tguid;
}




function makeNewTask() {
    newNode = $("#todolist span.template")[0].cloneNode(true);
    newNode.classList.remove('pintotop');
    newNode.classList.remove('template');
    $(newNode).find("button").text("Remove");
    newNode.dataset.taskgroup = guid();
    $(newNode).find("*").each((i, e) => {
        e.dataset.taskgroup = newNode.dataset.taskgroup
    })
    $("#todolist").append(newNode);
    $("#todolist_db").append("<div data-taskgroup='"+newNode.dataset.taskgroup+"'></div>");
    div=$("#todolist_db div[data-taskgroup='"+newNode.dataset.taskgroup+"']")[0];
    $(div).append("<div></div>");
    editors['descbox'].fromData(undefined,div.children[0]);
    first_sort();
    $("#todolist span.template input").each((i, e) => {
        e.value = "";
        e.style.color = "black";
        e.style.background = "white";
    })
    $("#todolist").removeClass("searchfilter");
    newInstance = $(newNode).find("[data-role='" + lastFocused.dataset.role + "']")[0];
    date_reparse($(newNode).find("[data-role='date']")[0]);
    newInstance.focus();
    newInstance.scrollIntoViewIfNeeded();

    return newNode;
}

todolist.on('add', () => {
    $("#nothingLeft").hide();

})

$(document).ready(() => {
    //adding new tasks
    $("#todolist").on("keyup", ".template input", (e) => {
        if (e.keyCode == 13) {
            nn = makeNewTask();
            todolist.fire('add', nn);
        }
        lastFocused = e.currentTarget;
    })

    $("#todolist").on("click", "span:not(.template) button.remove", (e) => {
        todolist.fire('remove', e.currentTarget.parentElement);
        $("#todolist_db div[data-taskgroup='" + e.currentTarget.parentElement.dataset.taskgroup + "']").remove();
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
        if ($("#todolist_db>div:visible").length) {
            parent = $("#todolist_db>div:visible")[0].dataset.taskgroup;
            nt = makeNewTask();
            if (parent) {
                $("#todolist span[data-taskgroup='" + parent + "']").append(nt);
            }
            nt.scrollIntoViewIfNeeded();
        }

    })

    $("#todolist").on("keypress", "[data-role='date']", (e) => {
        if (e.currentTarget.parentElement.classList.contains("template")) return;
        if (e.keyCode == 13) {
            date_reparse(e.currentTarget);
            todolist.fire('dateChange', e);
        }
    })
    $("#todolist").on("keypress", "span:not(.template) input", (e) => {
        if (e.keyCode == 13) {
            e.currentTarget.blur();
        }
    })
    $("#todolist").on("focus", "span", (e) => {
        // retract the previous description box
        $("#todolist_db>div").hide();
        if (!e.currentTarget.classList.contains("template")) {
            todolist.fire('selected',e.currentTarget);
            $("#todolist_db>div[data-taskgroup='" + e.currentTarget.dataset.taskgroup + "']").show();
            
            return false;
        }
    })

})


/////////////Drag and drop to order
var dragting;
$(() => {
    $("#todolist").on("drag", "span:not(.template)", (ev) => {
        dragting = ev.target.dataset.taskgroup;
    })
    $("#todolist").on("dragleave", "span:not(.template)", (ev) => {
        ev.preventDefault();
        ev.currentTarget.style["border-bottom"] = "";
        ev.currentTarget.style["border-top"] = "";
        ev.currentTarget.style.background = "";
    })
    $("#todolist").on("dragover", "span:not(.template)", (ev) => {
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
    $("#todolist").on("drop", "span:not(.template)", (ev) => {
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
            $(target.parentElement).append(toDrop);
        } else {
            nuid = assertID(target);
            $(toDrop).find("[data-role='date']")[0].value += " before:" + nuid;
            $(target.parentElement).append(toDrop);
        }
        first_sort();

    })
});

function assertID(span) {
    assdID=extractID(span);
    if (assdID==-1) {
        assdID = Date.now();
        $(span).find("[data-role='date']")[0].value += " id:" + assdID;
    }
    return assdID;
}


///////////SEARCH
$(document).ready(() => {

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    #todolist.searchfilter span:not(.pintotop){
        display:none;
    }
    #todolist.searchfilter span.searchvisible{
        display:block;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);

    $("#searchbar").on("keyup", () => {
        cval = $("#searchbar")[0].value
        if (cval == "") {
            $("#todolist").removeClass("searchfilter");
        } else {
            $("#todolist").addClass("searchfilter");
            $("#todolist span").removeClass("searchvisible");
            cvals = cval.split(" ");
            for (i = 0; i < cvals.length; i++)
                if (cvals[i] == "") cvals.splice(i, 1)
            $("#todolist span").each((i, e) => {
                for (term of cvals) {
                    term = term.toLowerCase()
                    innerText = "";
                    $(e).find("input,textarea").each((_i, _e) => {
                        innerText += _e.value
                    })
                    if (innerText.toLowerCase().includes(term)) {
                        $(e).addClass("searchvisible");
                    }
                }
            })

        }
    })
})

function focusItem(taskgroup) {
    $("span[data-taskgroup='" + taskgroup + "'] input[data-role='name']").focus();
    $("#todolist_db>div").hide();
    $("#todolist_db>div[data-taskgroup='" + taskgroup + "']").show();
}

function unloadAll() {
    //also incorporate disconnecting from the network.
    $("#todolist span:not(.pintotop)").remove();
    $("#todolist_db>div:not(.template)").remove();
    $("#title")[0].innerText = "Untitled list";
    $("#nothingLeft").show();
    todolist.events['new'].forEach((f, i) => {
        f()
    });
}



//----------More random UI stuff----------//
$(()=>{
    $(".gear").on("click",()=>{
        $("ul.title li:not(.olocalOnly):not(:first-child)").toggle();
    })
})