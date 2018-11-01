//detect if another Mai instance is running; if so, alert the user, turn on autosave, and load from localstorage whenever the window is focused.

if (Number(window.localStorage.getItem("maion")) == "1") {
    if (confirm(
            "Another window with Maido is open. If you keep this window open, Maido can try to automatically sync your local tasklist between tabs."
        )==false) {
        setTimeout(() => {
            window.location.href = "about:blank";
        }, 1000);
    } else {
        startMultiTab();
        window.localStorage.setItem("maion",-1);
    }
}

function startMultiTab(){
    window.addEventListener("blur", (e) => {
        saveToBrowser(true);
    });
    window.addEventListener("focus", (e) => {
        loadFromBrowser();
    });
}
$(window).on('beforeunload', function () {
    window.localStorage.setItem("maion", 0);
});
window.addEventListener('storage', (e) => {
    if (e.key == "maion" && e.newValue != "1") {
        if (e.newValue=="0"){
            window.localStorage.setItem("maion", 1);
        }
        if (e.newValue=="-1"){
            startMultiTab()
            window.localStorage.setItem("maion", 1);
        }
    }
})
window.localStorage.setItem("maion", 1)

function showdocs() {
    window.open("docs.html", "blank");
}