# OneMotion

Lightweight physics engine for DOM animation.

## install

```
bower install one-motion
```

```
npm install one-motion
```

## usage

See [demo page](http://fnobi.github.io/OneMotion/demo/) also.

```javascript
// get jQuery objects for target elements
var $sample1 = $('.sample1');
var $sample2 = $('.sample2');

var reflectBoxWidth = $(window).width();
var reflectBoxHeight = $(window).height();
var sample1OffsetX = $sample1.get(0).offsetLeft;
var sample1OffsetY = $sample1.get(0).offsetTop;

// init OneMotion
var motion1 = new OneMotion($sample1, {
    // set reflection
    topWall: -sample1OffsetY,
    rightWall: reflectBoxWidth - sample1OffsetX,
    bottomWall: reflectBoxHeight - sample1OffsetY,
    leftWall: -sample1OffsetX,

    width: $sample1.width(),
    height: $sample1.height(),

    // rotate to heading direction
    rotateProperty: 'transform'
});

var motion2 = new OneMotion($sample2, {
    // set sticky
    stickyX: 0,
    stickyY: 0
});

// set events
$sample1.on('click', function () {
    // hit to random direction
    motion1.hit({
        rad: (Math.PI * 2) * Math.random(),
        power: 500
    });
});

$sample2.on('click', function () {
    // hit to random direction
    motion2.hit({
        rad: (Math.PI * 2) * Math.random(),
        power: 1000
    });
});

// motion tracker with event-trigger
motion1.on('put', function () {
    console.log('[%d, %d]', this.x, this.y);
});

// reset button
$('.reset').on('click', function (e) {
    e.preventDefault();
    
    motion1.stop();
    motion1.put(0, 0);

    motion2.stop();
    motion2.put(0, 0);
});


```