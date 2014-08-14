function OneMotion ($el, opts) {
    this.$el = $el;

    this.x = 0;
    this.y = 0;

    this.config({
        xProperty: 'margin-left',
        yProperty: 'margin-top',
        minDiff: 0.1,
        clock: 25,
        friction: 0.2,
        stickyPower: 3
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

    this.topWall = isNaN(opts.topWall) ? this.topWall : opts.topWall;
    this.rightWall = isNaN(opts.rightWall) ? this.rightWall : opts.rightWall;
    this.bottomWall = isNaN(opts.bottomWall) ? this.bottomWall : opts.bottomWall;
    this.leftWall = isNaN(opts.leftWall) ? this.leftWall : opts.leftWall;

    this.stickyX = isNaN(opts.stickyX) ? this.stickyX : opts.stickyX;
    this.stickyY = isNaN(opts.stickyY) ? this.stickyY : opts.stickyY;
    this.stickyPower = isNaN(opts.stickyPower) ? this.stickyPower : opts.stickyPower;
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

    var stickyX = this.stickyX;
    var stickyY = this.stickyY;
    var stickyPower = this.stickyPower;

    var rate = 1000 / clock;

    var self = this;
    var $el = this.$el;

    function inc() {
        self.x += Math.cos(rad) * power / rate;
        self.y += Math.sin(rad) * power / rate;
    }

    function vectorAdd (rad1, power1, rad2, power2) {
        var x1 = Math.cos(rad1) * power1;
        var y1 = Math.sin(rad1) * power1;
        var x2 = Math.cos(rad2) * power2;
        var y2 = Math.sin(rad2) * power2;

        return {
            power: Math.sqrt(Math.pow(x1 + x2, 2) + Math.pow(y1 + y2, 2)),
            rad: Math.atan2(y1 + y2, x1 + x2)
        };
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

        if (!isNaN(stickyX) && !isNaN(stickyY) && !isNaN(stickyPower)) {
            var xDistance = (stickyX - self.x);
            var yDistance = (stickyY - self.y);
            var stickyRad = Math.atan2(yDistance, xDistance);
            var vector = vectorAdd(rad, power, stickyRad, (
                stickyPower * Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
            ));
            rad = vector.rad;
            power = vector.power;
        }
        
        power *= Math.pow(friction, 1 / rate);

        if (power < minDiff) {
            clearInterval(self.loop);
        }
    }, clock);
};
