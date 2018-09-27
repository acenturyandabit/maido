function _maidocore() {
    var self = this;
    this.savecache = [];
    this.logSaveTime = [];
    this.logSaveDelta = [60000]
    this.logSavePattern = [10, 6, 24, 7, 4, 12];
    // initialise on first run-these will be overwritten from cache.
    for (i in this.logSavePattern) {
        this.savecache.push([]);
        this.logSaveTime.push(Date.now())
        if (i > 0) this.logSaveDelta[i] = this.logSaveDelta[i - 1] * this.logSavePattern[i - 1]
    }
    Object.assign(this,JSON.parse(window.localStorage.getItem('maido-core')))
    this.pushSaveCache = function (timeStamp) {
        this.savecache[0].push(timestamp);
        while (this.savecache[0].length > this.logSavePattern[0]) {
            it = this.savecache[0].shift();
            localStorage.removeItem(it);
        }

    }
    this.saveCacheUpdate = function () {
        for (i = 1; i < self.logSavePattern.length; i++) {
            if (Date.now() - self.logSaveTime[i] >= self.logSaveDelta[i]) {
                self.savecache[i].push(self.savecache[i - 1][0])
                if (self.savecache[i].length > self.logSavePattern[i]) {
                    it = self.savecache[i].shift();
                    localStorage.removeItem(it);
                }
                self.logSaveTime[i] = Date.now()
            }
        }
        localStorage.setItem('maido-core', JSON.stringify(this))
        console.log("maidocore updated save cache");
    }
    setInterval(function () {
        self.saveCacheUpdate()
    }, 60000);
}
maidocore = new _maidocore();