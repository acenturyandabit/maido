$(document).ready(() => {
    $("#todolist").on("keyup", ".initial input", (e) => {
        if (e.keyCode == 13) {
            newNode = $(".initial.template")[0].cloneNode(true)
            newNode.classList.remove('initial');
            newNode.classList.remove('template');
            newNode.dataset.taskgroup = guid();
            $(newNode).find("*").each((i, e) => {
                e.dataset.taskgroup = newNode.dataset.taskgroup
            })
            $("#todolist").append(newNode)
            //$(newNode).find("." + e.currentTarget.classList[0]).focus()
            //$(newNode).find("." + e.currentTarget.classList[0])[0].setSelectionRange(1, 1)
            $(".initial input").each((i, e) => {
                e.value = ""
            })
            if (rootcl) {
                rootcl.doc(newNode.dataset.taskgroup).set(toWebObj(newNode));
            }
        }
    })
    $("#todolist").on("click", "tr:not(.initial) button.remove", (e) => {
        retract_description();
        if (rootcl) {
            rootcl.doc(e.currentTarget.parentElement.parentElement.dataset.taskgroup).delete();
        }
        $(e.currentTarget.parentElement.parentElement).remove();
        //push a deleted onto the changelog

    })

    $("#todolist").on("keypress", "[data-role='date']", (e) => {
        if (e.currentTarget.parentElement.classList.contains("initial")) return;
        if (e.keyCode == 13) {
            date_reparse(e.currentTarget);
        }
    })
    $("#todolist").on("keypress", "tr:not(.initial) input", (e) => {
        if (e.keyCode == 13) {
            e.currentTarget.blur();
            //date_reparse(e.currentTarget);
        }
    })
    $("#todolist").on("focus", "tr", (e) => {
        // retract the previous textarea
        retract_description()
        if (!e.currentTarget.classList.contains("initial")) {
            $(e.currentTarget).find("textarea")[0].style.display = "block";
            $("#todolist_db").append($(e.currentTarget).find("textarea")[0])
        }
    })
    //autoload and shenanigans
})

function retract_description(ghost = false) {
    try {
        otg = $("#todolist_db").children("*")[0].dataset.taskgroup;
        // remove previous copy
        $('td[data-role="ta_stor"][data-taskgroup=' + otg + '] textarea').remove();
        if (ghost) {
            $('td.ta_stor[data-taskgroup=' + otg + ']').append($("#todolist_db").children("*").clone())
            $('td.ta_stor[data-taskgroup=' + otg + ']').children().hide()
        } else {
            $("#todolist_db").children("*")[0].style.display = "none"
            $('td.ta_stor[data-taskgroup=' + otg + ']').append($("#todolist_db").children("*"))
        }
        return otg;
    } catch (_e) {}
}