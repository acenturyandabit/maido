editors = {};

editors['description'] = {
    fromData: function (data, div) {
        div.dataset.editorType = 'description';
        div.classList.add('description');
        $(div).append(`<textarea
        class="template"
            placeholder="Description..."
            ></textarea>`);
        if (data) {
            if (data.text) {
                $(div).find("textarea")[0].value = data.text;
            } else {
                $(div).find("textarea")[0].value = data.toString();
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
            }
            </style>`
        )
    }
}
$(()=>{
    for (e in editors){
        editors[e].init();
    }
})