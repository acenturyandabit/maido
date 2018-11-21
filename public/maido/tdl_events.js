function _todolist() {
    this.events = {
            add: [],
            remove: [],
            dateChange: [],
            new: []
        },
        this.fire = function (e, args) {
            if (this.events[e]) {
                this.events[e].forEach((f, i) => {
                    try{
                        f(args)
                    }catch (e){
                        console.log(e);
                    }
                });
            }
        }
    this.on = function (e, f) {
        _e = e.split(',');
        _e.forEach((i) => {
            if (!this.events[i]) this.events[e] = [];
            this.events[i].push(f);
        })

    }
    this.lastSave={};
    this.registerAndTryLoad=function(f){
        this.on("load",f);
        //get the last stored file and send it to the function.
        f(this.lastSave);
        
    }
};
todolist = new _todolist();

//listMetaUpdate - on local as well as web load
//tagChange
todolist.on("load",(d)=>{
    todolist.lastSave=d;
})