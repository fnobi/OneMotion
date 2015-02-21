var OneMotion = function ($el, opts) {
    this.$el = $el;

    this.x = 0;
    this.y = 0;

    this.loop = null;

    this.config({
        xProperty: 'translate',
        yProperty: 'translate',
        headRad: 0,
        minDiff: 0.1,
        clock: 25,
        friction: 0.2,
        stickyPower: 3,
        width: 0,
        height: 0
    });

    if (opts) {
        this.config(opts);
    }
};
OneMotion = EventTrigger.extend(OneMotion);

OneMotion.prototype.config = function (opts) {
    opts = opts || {};

    this.xProperty = opts.xProperty || this.xProperty;
    this.yProperty = opts.yProperty || this.yProperty;
    this.rotateProperty = opts.rotateProperty || this.rotateProperty;
    
    this.minDiff = isNaN(opts.minDiff) ? this.minDiff : opts.minDiff;
    this.clock = isNaN(opts.clock) ? this.clock : opts.clock;
    this.friction = isNaN(opts.friction) ? this.friction : opts.friction;
    this.headRad = isNaN(opts.headRad) ? this.headRad : opts.headRad;

    this.topWall = isNaN(opts.topWall) ? this.topWall : opts.topWall;
    this.rightWall = isNaN(opts.rightWall) ? this.rightWall : opts.rightWall;
    this.bottomWall = isNaN(opts.bottomWall) ? this.bottomWall : opts.bottomWall;
    this.leftWall = isNaN(opts.leftWall) ? this.leftWall : opts.leftWall;

    this.width = isNaN(opts.width) ? this.width : opts.width;
    this.height = isNaN(opts.height) ? this.height : opts.height;

    this.stickyX = isNaN(opts.stickyX) ? this.stickyX : opts.stickyX;
    this.stickyY = isNaN(opts.stickyY) ? this.stickyY : opts.stickyY;
    this.stickyPower = isNaN(opts.stickyPower) ? this.stickyPower : opts.stickyPower;

    this.drawManually = !!opts.drawManually;
};

OneMotion.prototype.hit = function (opts) {
    opts = opts || {};
    var rad = opts.rad || (Math.PI * 2 * 0.75);
    var power = opts.power || 1;

    // TODO: 既存のradとpowerとの掛け合わせ
    this.rad = rad;
    this.power = power;

    this.stop();
    this.time = 0;

    this.trigger('hit');

    if (!this.drawManually) {
        var instance = this;
        var clock = this.clock;
        this.loop = setInterval(function () {
            instance.draw(clock);
        }, clock);
    }
};

OneMotion.prototype.draw = function (delta) {
    var minDiff = this.minDiff;
    var friction = this.friction;

    var topWall = this.topWall;
    var rightWall = this.rightWall;
    var bottomWall = this.bottomWall;
    var leftWall = this.leftWall;

    var width = this.width;
    var height = this.height;

    var stickyX = this.stickyX;
    var stickyY = this.stickyY;
    var stickyPower = this.stickyPower;

    var rate = 1000 / delta;

    this.time += delta;

    this.put(
        this.x + Math.cos(this.rad) * this.power / rate,
        this.y + Math.sin(this.rad) * this.power / rate,
        this.rad
    );

    if (this.x < leftWall && Math.cos(this.rad) < 0) {
        this.rad = Math.PI - this.rad;
    } else if (this.x + width > rightWall && Math.cos(this.rad) > 0) {
        this.rad = Math.PI - this.rad;
    } else if (this.y < topWall && Math.sin(this.rad) < 0) {
        this.rad = -this.rad;
    } else if (this.y + height > bottomWall && Math.sin(this.rad) > 0) {
        this.rad = -this.rad;
    }

    if (!isNaN(stickyX) && !isNaN(stickyY) && !isNaN(stickyPower)) {
        var xDistance = (stickyX - this.x);
        var yDistance = (stickyY - this.y);
        var stickyRad = Math.atan2(yDistance, xDistance);
        var vector = OneMotion.vectorAdd(this.rad, this.power, stickyRad, (
            stickyPower * Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
        ));
        this.rad = vector.rad;
        this.power = vector.power;
    }
    
    this.power *= Math.pow(friction, 1 / rate);

    if (this.power < minDiff) {
        this.stop();
    }
};

OneMotion.prototype.put = function (x, y, rad) {
    rad = isNaN(rad) ? 0 : rad;

    var $el = this.$el;
    var xProperty = this.xProperty;
    var yProperty = this.yProperty;
    var rotateProperty = this.rotateProperty;
    var headRad = this.headRad;

    this.x = x;
    this.y = y;

    var css = {};
    var transformList = [];
    if (xProperty == 'translate') {
        transformList.push('translateX(' + x + 'px)');
    } else {
        css[xProperty] = x + 'px';
    }
    if (yProperty == 'translate') {
        transformList.push('translateY(' + y + 'px)');
    } else {
        css[yProperty] = y + 'px';
    }
    if (rotateProperty == 'transform') {
        transformList.push('rotate(' + (180 * (rad + headRad) / Math.PI) + 'deg)');
    }
    if (transformList.length) {
        var transform = transformList.join(' ');
        css['transform'] = css['-webkit-transform'] = transform;
    }
    $el.css(css);

    this.trigger('put');
};

OneMotion.prototype.stop = function () {
    if (!this.drawManually) {
        if (this.loop) {
            clearInterval(this.loop);
        }
    }
    this.time = null;
    this.loop = null;
    this.trigger('stop');
};

OneMotion.vectorAdd = function (rad1, power1, rad2, power2) {
    var x1 = Math.cos(rad1) * power1;
    var y1 = Math.sin(rad1) * power1;
    var x2 = Math.cos(rad2) * power2;
    var y2 = Math.sin(rad2) * power2;

    return {
        power: Math.sqrt(Math.pow(x1 + x2, 2) + Math.pow(y1 + y2, 2)),
        rad: Math.atan2(y1 + y2, x1 + x2)
    };
};

