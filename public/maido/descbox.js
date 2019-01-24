editors = {};

editors['description'] = {
    fromData: function (data, div) {
        div.classList.add('description');
        $(div).append(`<textarea
        class="template"
            placeholder="Description..."
            ></textarea>`);
        if (data) {
            if (data.text) {
                $(div).find("textarea")[0].value = data.text;
            } else {
                $(div).find("textarea")[0].value = data.text.toString();
            }
        }
    },
    toData: function (div) {
        return {
            text: $(div).find("textarea")[0].value
        };
    },
    init: function () {
        $("head").append(
            `<style>
            .description textarea{
                width: 100%;
                height: 90vh;
                word-wrap: break-word;
            }
            </style>`
        )
    }
}
$(() => {
    for (e in editors) {
        editors[e].init();
    }
    //context menu for adding or removing displays
    $("body").on("contextmenu", "#todolist_db>div", (e) => {
        if ($(e.target).is("#todolist_db>div>div") || $(e.target).is("#todolist_db>div>div>p")) {
            //e.clientX, e.clientY;
            e.preventDefault();
        }
    })

    //focusing items
    $("#todolist").on("focus", "span", (e) => {
        // retract the previous description box
        $("#todolist_db>div").hide();
        $("span").removeClass("selected");
        if (!e.currentTarget.classList.contains("template")) {
            todolist.fire('selected',e.currentTarget);
            $("#todolist_db>div[data-taskgroup='" + e.currentTarget.dataset.taskgroup + "']").show();
            e.currentTarget.classList.add("selected");
            $("#calendarView").hide();
            return false;
        }else{
            $("#calendarView").show();
        }
    })

})