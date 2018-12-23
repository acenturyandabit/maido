addins.notify = new function () {
    this.init = function () {
        //request notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            this.startNotification();
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    this.startNotification();
                }
            });
        }
    }
    this.startNotification=function(){
        var notification = new Notification("Maido Notifications Ready!");
        setInterval(this.checkNotifyStatus,1000);
    }
    this.checkNotifyStatus=function(){
        $("span[data-taskgroup]").each((i,e)=>{
            if (Math.abs(extractDate(e)-Date.now())<2000){
                var notification = new Notification($(e).find("[data-role=name]")[0].value);
            }
        })
    }
    //make it so that when i modify tag names the tagboxes remain
    this.cleanup = function () {};
};











function notifyMe() {
    // Let's check if the browser supports notifications


    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
}