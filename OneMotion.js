var EventTrigger = new Function ();

EventTrigger.prototype.initEventTrigger = function () {
    this._listeners = {};
};

EventTrigger.prototype.initEventTriggerType = function (type) {
    if (!type) {
        return;
    }
    this._listeners[type] = [];
};

EventTrigger.prototype.hasEventListener = function (type, fn) {
    if (!this.listener) {
        return false;
    }

    if (type && !this.listener[type]) {
        return false;
    }

    return true;
};

EventTrigger.prototype.addListener = function (type, fn) {
    if (!this._listeners) {
        this.initEventTrigger();
    }
    if (!this._listeners[type]) {
        this.initEventTriggerType(type);
    }
    this._listeners[type].push(fn);

    this.emit('newListener', type, fn);
};

EventTrigger.prototype.on = EventTrigger.prototype.addListener;

EventTrigger.prototype.one = function (type, fn) {
    fn._oneTimeListener = true;
    this.addListener(type, fn);
};

EventTrigger.prototype.removeListener = function (type, fn) {
    if (!this._listeners) {
        return;
    }
    if (!this._listeners[type]) {
        return;
    }
    if (isNaN(this._listeners[type].length)) {
        return;
    }

    if (!type) {
        this.initEventTrigger();
        this.emit('removeListener', type, fn);
        return;
    }
    if (!fn) {
        this.initEventTriggerType(type);
        this.emit('removeListener', type, fn);
        return;
    }

    var self = this;
    for (var i = 0; i < this._listeners[type].length; i++) {
        (function (listener, index) {
            if (listener === fn) {
                self._listeners[type].splice(index, 1);
            }
        })(this._listeners[type][i], i);
    }
    this.emit('removeListener', type, fn);
};

EventTrigger.prototype.emit = function (type) {
    if (!this._listeners) {
        return;
    }
    if (!this._listeners[type]) {
        return;
    }
    if (isNaN(this._listeners[type].length)) {
        return;
    }

    var self = this,
        args = [].slice.call(arguments, 1);

    for (var i = 0; i < this._listeners[type].length; i++) {
        (function (listener) {
            listener.apply(self, args);
            if (listener._oneTimeListener) {
                self.removeListener(type, listener);
            }
        })(this._listeners[type][i]);
    }
};

EventTrigger.prototype.listeners = function (type) {
    if (!type) {
        return undefined;
    }
    return this._listeners[type];
};

// jquery style alias
EventTrigger.prototype.trigger = EventTrigger.prototype.emit;
EventTrigger.prototype.off = EventTrigger.prototype.removeListener;


// class method for inheritance
EventTrigger.extend = function (Klass) {
    for (var i in EventTrigger.prototype) {
        if (Klass.prototype[i]) {
            continue;
        }
        Klass.prototype[i] = EventTrigger.prototype[i];
    }
    return Klass;
};

var OneMotion = function ($el, opts) {
    this.$el = $el;

    this.x = 0;
    this.y = 0;

    this.scale = 1;
    this.loop = null;

    this.config({
        xProperty: 'transform',
        yProperty: 'transform',
        headRad: 0,
        minDiff: 0.1,
        clock: 25,
        friction: 0.2,
        stickyPower: 3
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

    this.stickyX = isNaN(opts.stickyX) ? this.stickyX : opts.stickyX;
    this.stickyY = isNaN(opts.stickyY) ? this.stickyY : opts.stickyY;
    this.stickyPower = isNaN(opts.stickyPower) ? this.stickyPower : opts.stickyPower;
};

OneMotion.prototype.hit = function (opts) {
    opts = opts || {};

    var rad = opts.rad || (Math.PI * 2 * 0.75);
    var power = opts.power || 1;

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

    this.stop();

    this.time = 0;

    this.loop = setInterval(function () {
        self.time += clock;

        self.put(
            self.x + Math.cos(rad) * power / rate,
            self.y + Math.sin(rad) * power / rate,
            rad
        );

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
            self.stop();
        }
    }, clock);

    this.trigger('hit');
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
    if (xProperty == 'transform') {
        transformList.push('translateX(' + x + 'px)');
    } else {
        css[xProperty] = x + 'px';
    }
    if (yProperty == 'transform') {
        transformList.push('translateY(' + y + 'px)');
    } else {
        css[yProperty] = y + 'px';
    }
    if (rotateProperty == 'transform') {
        transformList.push('rotate(' + (180 * (rad + headRad) / Math.PI) + 'deg)');
    }
    if (this.scale != 1 && !isNaN(this.scale)) {
        transformList.push('scale(' + this.scale + ')');
    }
    if (transformList.length) {
        var transform = transformList.join(' ');
        css['transform'] = css['-webkit-transform'] = transform;
    }
    $el.css(css);

    this.trigger('put');
};

OneMotion.prototype.stop = function () {
    if (!this.loop) {
        return;
    }
    clearInterval(this.loop);
    this.time = null;
    this.loop = null;
    this.trigger('stop');
};
