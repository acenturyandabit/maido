function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    // also pad it
    c = ((r << 16) | (g << 8) | b).toString(16);
    while (c.length < 6) {
        c = "0" + c;
    }
    c = "#" + c;
    return c;
}


function randcol() {
    var output = "#";
    var ac_char = "0123456789abcdef";
    for (var i = 0; i < 6; i++) {
        output += ac_char[Math.floor(Math.random() * 17)];
    }
    return output;
}
var tanks = [];
var bullets = [];
$(() => {
    body = $("body")[0];
    c = $('canvas.main')[0];
    c.width = body.clientWidth;
    c.height = body.clientHeight;
    ctx = c.getContext('2d');
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, c.width, c.height);
    //background
    b = $('canvas.back')[0];
    b.width = body.clientWidth;
    b.height = body.clientHeight;
    btx = b.getContext('2d');
    btx.fillStyle = "#000000";
    btx.fillRect(0, 0, b.width, b.height);
    
    regenerateBackground();
    setInterval(regenerateBackground, 10000);


    
    for (i = 0; i < 3; i++) tanks.push(new tank());
    //update and draw cycle
    function renderAll() {
        //clear ctx
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, c.width, c.height);
        //draw on background
        ctx.drawImage(b, 0, 0);
        window.requestAnimationFrame(renderAll);
        tanks.forEach((v, i) => {
            v.update();
            v.render();
        })
        bullets.forEach((v, i) => {
            v.update();
            v.render();
        })
    }
    window.requestAnimationFrame(renderAll);

    // event cycle
    $("body").on('keydown', (e) => {
        switch (e.key) {
            case "j":
                tanks[0].x--;
                break;
            case "l":
                tanks[0].x++;
                break;
            case "i":
                tanks[0].power-=0.1;
                break;
            case "k":
                tanks[0].power+=0.1;
                break;
            case "u":
                tanks[0].angle--;
                break;
            case "o":
                tanks[0].angle--;
                break;
            case " ":
                tanks[0].fire();
        }
    })
})

function regenerateBackground() {
    btx.fillStyle = "#feffff";
    for (i = 0; i < 10; i++) btx.fillRect(Math.random() * b.width, Math.random() * b.height, 100, 100);
    btx.fillRect(0, b.height/2, b.width, b.height/2);
}

function getBackgroundPixel(x, y) {
    d = btx.getImageData(x, y, 1, 1).data;
    return rgbToHex(d[0], d[1], d[2]);
}

function tank() {
    this.color = randcol();
    this.power=0;
    this.angle=0;
    this.fire=function(){
        bullets.push(new bullet(this.x,this.y,Math.cos(this.angle/180*Math.PI)*this.power,Math.sin(this.angle/180*Math.PI)*this.power));
    };
    this.respawn = function () {
        this.x = Math.random() * b.width;
        this.y = Math.random() * b.height;
        this.hp = 100;
    }
    this.respawn();
    this.damage = function (amt) {
        this.hp -= amt;
        if (this.hp < 0) this.respawn();
    }
    this.update = function () {
        //check damage
        if (getBackgroundPixel(this.x, this.y) == "#ff0000") this.damage(1);
        //check falling
        if (getBackgroundPixel(this.x, this.y + 1) == "#000000") this.y++;
        //check rising
        if (getBackgroundPixel(this.x, this.y) != "#000000") this.y--;
    }
    this.render = function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - 3, this.y - 3, 6, 6);
    }
}

function bullet(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        return true;
    }
    this.render = function () {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.x, this.y, 1, 1);
    }
}