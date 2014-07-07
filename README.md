# OneMotion

Lightweight physics engine for DOM animation.

## install

```
bower install OneMotion
```

## usage

```javascript
var $el = $('.sample');
var motion = new OneMotion($el, {
    xProperty: 'top',
    yProperty: 'left'
});

$el.on('click', function () {
    motion.run({
        rad: (Math.PI * 2) * 0.5,
        power: 10
    });
});


```