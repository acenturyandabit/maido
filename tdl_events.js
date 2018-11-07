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
                    f(args)
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
};
todolist = new _todolist();

//listMetaUpdate - on local as well as web load
//tagChange