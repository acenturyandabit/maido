var vis;
addins.timeline = new function () {

    this.init = function () {
        if (!vis) {
            $(".maiTitle li:contains('View')>div").append(
                `<a onclick="toggleTimeline()">Toggle timeline</a>`
            );
            $("head").append(
                `
            <link href="addins/vis.min.css" rel="stylesheet" type="text/css">
            <script id="vis" src="addins/vis.min.js"></script>
            `
            );
            $("body>ul").after(
                `<div id="timeline_container" style="display:none; z-index:-1">

                </div>`
            )
            /*$.getScript("vis.min.js", () => {
                //Create a dataset with all current tasks

                //

                //add event handlers for clicking the floaty tasks

            });*/

        }

        function tlContinue() {
            if (!vis) {
                setTimeout(tlContinue, 400);
                return;
                //Create a dataset with all current tasks

                //

                //add event handlers for clicking the floaty tasks
            }
            var container = $("#timeline_container")[0];
            _timelineItems = [];
            $("#todolist>span").each((i, e) => {
                d = extractDate(e);
                if (d != -1) {
                    _timelineItems.push({
                        id: e.dataset.taskgroup,
                        content: $(e).find("[data-role='name']")[0].value,
                        start: new Date(d)
                    });
                }
            })
            timelineItems = new vis.DataSet(_timelineItems);
            var options = {
                height: "10%",
                /*rollingMode: {
                    follow: true
                }*/
            };
            var timeline = new vis.Timeline(container, timelineItems, options);
            timeline.on('select', (e) => {
                //console.log(Object.keys[e.items]);
                focusItem(e.items[0]);
            })
        }
        tlContinue();
        todolist.on('dateChange',(e) => {
            timelineItems.update({
                id: e.currentTarget.dataset.taskgroup,
                start: new Date(extractDate(e.currentTarget.parentElement))
            })
        });
        $("#todolist").on('keyup', "input[data-role='name']", (e) => {
            timelineItems.update({
                id: e.currentTarget.dataset.taskgroup,
                content: e.currentTarget.value
            })
        })
        todolist.on('remove', (e) => {
            timelineItems.remove(e.currentTarget.parentElement.dataset.taskgroup);
        })
        /*
        todolist.on('add', (e) => {
            d = extractDate(e);
            if (d != -1) {
                timelineItems.add([{
                    id: e.dataset.taskgroup,
                    content: $(e).find("[data-role='name']")[0].value,
                    start: new Date(d)
                }]);
            }

        })*/
        ////add function for clearing everything.
    }
};

function toggleTimeline() {
    $("#timeline_container").toggle();
}