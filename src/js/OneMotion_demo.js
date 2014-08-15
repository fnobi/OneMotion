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
    leftWall: -sample1OffsetX
});

var motion2 = new OneMotion($sample2, {
    // set sticky
    stickyX: 0,
    stickyY: 0
});

// set events
$sample1.on('click', function () {
    // run to random direction
    motion1.run({
        rad: (Math.PI * 2) * Math.random(),
        power: 500
    });
});

$sample2.on('click', function () {
    // run to random direction
    motion2.run({
        rad: (Math.PI * 2) * Math.random(),
        power: 1000
    });
});

