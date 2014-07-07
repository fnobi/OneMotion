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

    var rate = 1000 / clock;

    var self = this;
    var $el = this.$el;

    this.loop = setInterval(function () {
        self.x += Math.cos(rad) * power / rate;
        self.y += Math.sin(rad) * power / rate;

        var css = {};
        css[xProperty] = self.x + 'px';
        css[yProperty] = self.y + 'px';
        $el.css(css);

        power *= Math.pow(friction, 1 / rate);

        if (power < minDiff) {
            clearInterval(self.loop);
        }
    }, clock);
};
