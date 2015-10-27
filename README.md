![license](https://img.shields.io/npm/l/lightslider.svg)
![travis](https://travis-ci.org/sachinchoolur/lightslider.svg?branch=master)
![bower](https://img.shields.io/bower/v/lightslider.svg)
![npm](https://img.shields.io/npm/v/lightslider.svg)

jQuery lightSlider
=============


Demo
----------------
[JQuery lightSlider demo](http://sachinchoolur.github.io/lightslider/)

Description
----------------
JQuery lightSlider is a lightweight responsive Content slider with carousel thumbnails navigation

Main Features
----------------
+    Fully responsive - will adapt to any device.
+    Separate settings per breakpoint.
+    Gallery mode to create an image slideshow with thumbnails
+    Supports swipe and mouseDrag
+    Add or remove slides dynamically.
+    Small file size, fully themed, simple to implement.
+    CSS transitions with jQuery fallback.
+    Full callback API and public methods.
+    Auto play and infinite loop to create a content carousel.
+    Keyboard, arrows and dots navigation.
+    Chrome, Safari, Firefox, Opera, IE7+, IOS, Android, windows phone.
+    Slide and Fade Effects.
+    Auto width, Vertical Slide, Adaptiveheight, Rtl support...
+    Multiple instances on one page.
+    Slide anything (youtube, vimeo , google map ...)



How to use lightSlider?
--------------------

### Bower

You can Install lightslider using the [Bower](http://bower.io) package manager.

```sh
$ bower install lightslider
```

### npm

You can also find lightslider on [npm](http://npmjs.org).

```sh
$ npm install lightslider
```

### The code ###
add the Following code to the &lt;head&gt; of your document.
```html
<link type="text/css" rel="stylesheet" href="css/lightslider.css" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="js/lightslider.js"></script>
    // Do not include both lightslider.js and lightslider.min.js
```
### HTML Structure ###
```html
<ul id="light-slider">
    <li>
        <h3>First Slide</h3>
        <p>Lorem ipsum Cupidatat quis pariatur anim.</p>
    </li>
    <li>
        <h3>Second Slide</h3>
        <p>Lorem ipsum Excepteur amet adipisicing fugiat velit nisi.</p>
    </li>
    ...
</ul>
```
### Call lightSlider! ###
```html
<script type="text/javascript">
    $(document).ready(function() {
        $("#light-slider").lightSlider();
    });
</script>
```
### Play with settings ###
```html
<script type="text/javascript">
    $(document).ready(function() {
        $("#light-slider").lightSlider({
            item: 3,
            autoWidth: false,
            slideMove: 1, // slidemove will be 1 if loop is true
            slideMargin: 10,

            addClass: '',
            mode: "slide",
            useCSS: true,
            cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',//
            easing: 'linear', //'for jquery animation',////

            speed: 400, //ms'
            auto: false,
            pauseOnHover: false,
            loop: false,
            slideEndAnimation: true,
            pause: 2000,

            keyPress: false,
            controls: true,
            prevHtml: '',
            nextHtml: '',

            rtl:false,
            adaptiveHeight:false,

            vertical:false,
            verticalHeight:500,
            vThumbWidth:100,

            thumbItem:10,
            pager: true,
            gallery: false,
            galleryMargin: 5,
            thumbMargin: 5,
            currentPagerPosition: 'middle',

            enableTouch:true,
            enableDrag:true,
            freeMove:true,
            swipeThreshold: 40,

            responsive : [],

            onBeforeStart: function (el) {},
            onSliderLoad: function (el) {},
            onBeforeSlide: function (el) {},
            onAfterSlide: function (el) {},
            onBeforeNextSlide: function (el) {},
            onBeforePrevSlide: function (el) {}
        });
    });
</script>
```
### Public methods ###
```html
<script type="text/javascript">
    $(document).ready(function() {
        var slider = $("#light-slider").lightSlider();
        slider.goToSlide(3);
        slider.goToPrevSlide();
        slider.goToNextSlide();
        slider.getCurrentSlideCount();
        slider.refresh();
        slider.play();
        slider.pause();
        slider.destroy();
    });
</script>
```
### Report an Issue ###
If you think you might have found a bug or if you have a feature suggestion please use github [issue tracker](https://github.com/sachinchoolur/lightslider/issues/new). Also please try to add a jsfiddle that demonstrates your problem 

If you need any help with implementing lightslider in your project or if have you any personal support requests i requset you to please use [stackoverflow](https://stackoverflow.com/) instead of github issue tracker


If you like lightSlider support me by staring this repository or tweet about this project.
[@sachinchoolur](https://twitter.com/sachinchoolur)

#### [guidelines for contributors](https://github.com/sachinchoolur/lightslider/blob/master/contributing.md)

#### MIT © [Sachin](https://twitter.com/sachinchoolur)

