$(document).ready(() => {
    $("#todolist").on("keyup", ".template input", (e) => {
        if (e.keyCode == 13) {
            newNode = $("#todolist tr.template")[0].cloneNode(true)
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
            $("#todolist tr.template input").each((i, e) => {
                e.value = "";
                e.style.color = "black";
                e.style.background = "white";
            })
            if (rootcl) {
                rootcl.doc(newNode.dataset.taskgroup).set(toWebObj(newNode));
            }
            $("#todolist").removeClass("searchfilter");
            newInstance=$(newNode).find("[data-role='"+e.currentTarget.dataset.role+"']")[0];
            date_reparse($(newNode).find("[data-role='date']")[0]);
            newInstance.focus();
            newInstance.scrollIntoViewIfNeeded();
            $("#nothingLeft").hide();
        }
    })
    /*$("#todolist tr.template input[data-role='name']").on("keyup",(e)=>{
        if (e.currentTarget.value!=""){
            cval=e.currentTarget.value;
            
        }else{
            $("#todolist").removeClass("searchfilter");
        }
    })*/

    $("#todolist").on("click", "tr:not(.template) button.remove", (e) => {
        if (rootcl) {
            rootcl.doc(e.currentTarget.parentElement.parentElement.dataset.taskgroup).delete();
        }
        $("#todolist_db textarea[data-taskgroup='" + e.currentTarget.parentElement.dataset.taskgroup + "']").remove();
        $(e.currentTarget.parentElement.parentElement).remove();
        if ($("#todolist tr:not(.template)").length>0)$("#nothingLeft").show();
        //push a deleted onto the changelog
    })

    $("#todolist tr.template button.remove").on("click", (e) => {
        $("#todolist tr.template input").each((i, e) => {
            e.value = ""
        });

    })

    $("#todolist").on("keypress", "[data-role='date']", (e) => {
        if (e.currentTarget.parentElement.classList.contains("template")) return;
        if (e.keyCode == 13) {
            date_reparse(e.currentTarget);
        }
    })
    $("#todolist").on("keypress", "tr:not(.template) input", (e) => {
        if (e.keyCode == 13) {
            e.currentTarget.blur();
            //$("#todolist_db textarea").hide();
            //date_reparse(e.currentTarget);
        }
    })
    $("#todolist").on("focus", "tr", (e) => {
        // retract the previous textarea
        if (!e.currentTarget.classList.contains("template")) {
            $("#todolist_db textarea").hide();
            $("textarea[data-taskgroup='" + e.currentTarget.dataset.taskgroup + "']").show();
        }
    })
    //autoload and shenanigans
})