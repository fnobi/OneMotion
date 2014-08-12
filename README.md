# OneMotion

Lightweight physics engine for DOM animation.

## install

```
bower install OneMotion
```

## usage

See [demo page](http://fnobi.github.io/OneMotion/demo/) also.

```javascript
var $el = $('.sample');
var motion = new OneMotion($el, {
    xProperty: 'top',
    yProperty: 'left'
});

$el.on('click', function () {
    // jump to random direction
    motion.run({
        rad: (Math.PI * 2) * Math.random(),
        power: 200
    });
});


```