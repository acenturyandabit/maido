addins.template = new function () {
    this.init = function () {
        //Add action button
        $(".maiTitle li:contains('Actions')>div").append(
            `<a onclick="addins.template.showTemplates()">Show Templates</a>`
        );
        //Add selection / editor dialog
        $("body").append(`
        <div class="dialog" id="template_dialog">
            <div style="display: flex; height: 100%;">
                <div class="inner_dialog">
                    <h1>Templates</h1>
                    <p>Type in the box below to add a new template.</p>
                    <div style="display:flex; flex-direction: row;">
                        <div class="templateNameContainer">
                            
                            <span data-templateid='template' class='template'><input placeholder="Template name..."><button>Use Template</button></span>
                        </div>
                        <div class="templateBoxContainer">
                            <textarea class='template' style="display:none" data-templateid='template'></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `)

        //showtempaltes

        addins.template.showTemplates=function(){
            $("#template_dialog").show();
        }
        //load saved templates
        todolist.registerAndTryLoad((d) => {
            for (i in d.templates) {
                uid=i;
                copy=$("span[data-templateid='template']")[0].cloneNode(true);
                $(copy).find("input")[0].value=d.templates[i].name;
                copy.dataset.templateid=uid;
                $(".templateNameContainer").append(copy);
                copy=$("textarea[data-templateid='template']")[0].cloneNode(true);
                copy.dataset.templateid=uid;
                copy.value=d.templates[i].innerText;
                $(".templateBoxContainer").append(copy);
            }
        })

        //event handling for new templates
        $("span[data-templateid='template'] input").on("keydown",(e)=>{
            uid=guid();
            copy=$("span[data-templateid='template']")[0].cloneNode(true);
            $(copy).find("input")[0].value=$("span[data-templateid='template'] input")[0].value;
            $("span[data-templateid='template'] input")[0].value="";
            copy.dataset.templateid=uid;
            $(".templateNameContainer").append(copy);
            $(copy).find("input").focus();
            copy=$("textarea[data-templateid='template']")[0].cloneNode(true);
            copy.dataset.templateid=uid;
            $(".templateBoxContainer").append(copy);
            $("textarea[data-templateid]").hide();
            $(copy).show();
        })
        //apply templates
        $(".templateNameContainer").on("click","button",(e)=>{
            console.log("henlo!");
            uid=e.currentTarget.parentElement.dataset.templateid;
            toAdd=$("textarea[data-templateid='"+uid+"']")[0].value;
            $("#todolist_db textarea:visible")[0].value+=toAdd;
            $("#template_dialog").hide();
        })

        //show relevant template as appropriate
        $(".templateNameContainer").on("focus","input",(e)=>{
            uid=e.currentTarget.parentElement.dataset.templateid;
            $("textarea[data-templateid]").hide();
            if (uid!='template')$("textarea[data-templateid='"+uid+"']").show();
        })

        //save templates
        todolist.on("save", (d) => {
            d.templates = {};
            $("#template_dialog textarea[data-templateid]").each((i, e) => {
                if (e.dataset["templateid"]!="template")d.templates[e.dataset["templateid"]] = {
                    innerText: e.value,
                    name: $("#template_dialog span[data-templateid='" + e.dataset['templateid'] + "'] input")[0].value
                };
            })
        })
    };
    this.cleanup = function () {};
};