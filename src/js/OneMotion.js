function OneMotion ($el, opts) {
    this.$el = $el;

    this.x = 0;
    this.y = 0;

    this.config({
        xProperty: 'margin-left',
        yProperty: 'margin-top',
        minDiff: 0.1,
        clock: 25,
        friction: 0.5
    });

    if (opts) {
        this.config(opts);
    }
}

OneMotion.prototype.config = function (opts) {
    opts = opts || {};

    this.xProperty = opts.xProperty || this.xProperty;
    this.yProperty = opts.yProperty || this.yProperty;
    this.minDiff = isNaN(opts.minDiff) ? this.minDiff : opts.minDiff;
    this.clock = isNaN(opts.clock) ? this.clock : opts.clock;
    this.friction = isNaN(opts.friction) ? this.friction : opts.friction;

    this.topWall = (opts.topWall !== undefined) ? opts.topWall : this.topWall;
    this.rightWall = (opts.rightWall !== undefined) ? opts.rightWall : this.rightWall;
    this.bottomWall = (opts.bottomWall !== undefined) ? opts.bottomWall : this.bottomWall;
    this.leftWall = (opts.leftWall !== undefined) ? opts.leftWall : this.leftWall;
};

OneMotion.prototype.run = function (opts) {
    opts = opts || {};
    this.config(opts);

    var rad = opts.rad || (Math.PI * 2 * 0.75);
    var power = opts.power || 1;

    var xProperty = this.xProperty;
    var yProperty = this.yProperty;
    var minDiff = this.minDiff;
    var clock = this.clock;
    var friction = this.friction;

    var topWall = this.topWall;
    var rightWall = this.rightWall;
    var bottomWall = this.bottomWall;
    var leftWall = this.leftWall;

    var rate = 1000 / clock;

    var self = this;
    var $el = this.$el;

    function inc() {
        self.x += Math.cos(rad) * power / rate;
        self.y += Math.sin(rad) * power / rate;
    }

    if (this.loop) {
        clearInterval(this.loop);
    }

    this.loop = setInterval(function () {
        inc();

        var css = {};
        css[xProperty] = self.x + 'px';
        css[yProperty] = self.y + 'px';
        $el.css(css);

        if (self.x < leftWall && Math.cos(rad) < 0) {
            rad = Math.PI - rad;
        } else if (self.x > rightWall && Math.cos(rad) > 0) {
            rad = Math.PI - rad;
        } else if (self.y < topWall && Math.sin(rad) < 0) {
            rad = -rad;
        } else if (self.y > bottomWall && Math.sin(rad) > 0) {
            rad = -rad;
        }
        
        power *= Math.pow(friction, 1 / rate);

        if (power < minDiff) {
            clearInterval(self.loop);
        }
    }, clock);
};
