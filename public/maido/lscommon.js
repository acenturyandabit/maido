function loadFromString(str) {
    data = JSON.parse(str);
    $("#todolist tr:not(.pintotop)").remove()
    for (d in data) {
        loadSingleEntry(d,data[d])
    }
}

function loadSingleEntry(id, data) {
    //console.log(id,data);
    newNode = $("#todolist tr.template")[0].cloneNode(true)
    newNode.classList.remove('pintotop');
    newNode.classList.remove('template');
    newNode.dataset.taskgroup = id;
    $(newNode).find("*").each((i, e) => {
        e.dataset.taskgroup = newNode.dataset.taskgroup
    })
    for (p in data) {
        e = $(newNode).find("[data-role*='" + p + "']")[0]
        if (e) {
            if (e.tagName == 'INPUT' || e.tagName == 'TEXTAREA') e.value = data[p];
            if (e.tagName == 'BUTTON') e.innerHTML = data[p];
        }
    }
    for (f in precheck) {
        precheck[f](newNode);
    }
    $("#todolist").append(newNode)
}