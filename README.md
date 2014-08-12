# OneMotion

Lightweight physics engine for DOM animation.

## install

```
bower install OneMotion
```

## usage

See [demo page](http://fnobi.github.io/OneMotion/demo/) also.

```javascript
// get jQuery objects for target elements
var $sample1 = $('.sample');

// init OneMotion
var motion1 = new OneMotion($sample1, {
    // css properties to use as x and y
    xProperty: 'left', 
    yProperty: 'top',

    // set reflection
    topWall: 0,
    rightWall: 500,
    bottomWall: 500,
    leftWall: 0
});

// set events
$sample1.on('click', function () {
    // run to random direction
    motion1.run({
        rad: (Math.PI * 2) * Math.random(),
        power: 500
    });
});


```