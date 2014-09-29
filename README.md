jQuery lightSlider
=============


Demo
----------------
[JQuery lightSlider demo](http://sachinchoolur.github.io/lightslider/)

Description
----------------
JQuery lightSlider is a lightweight responsive Content slider with carousel thumbnails navigation ( 7KB minified )

Changelog
----------------
### Added ###
+   Separate settings per breakpoints. 
+   RTL support.
+   AdaptiveHeight.
+   Vertical mode
+   MouseDrag support for desktop browsers.
+   Improved swipe support.
+   Slide item instead of slideWidth.
+   ThumbItem instead of thumbwidth.

### Removed ###
+   slidewidth. 
+   minslide
+   maxslide

Main Features
----------------
+    Fully responsive - will adapt to any device.
+    Separate settings per breakpoint.
+    Gallery mode to create an image slideshow with thumbnails
+    Supports swipe and mouseDrag
+    Add or remove slides dynamically.
+    Small file size (7kb) (minified), fully themed, simple to implement.
+    CSS transitions with jQuery fallback.
+    Full callback API and public methods.
+    Auto play and auto loop to create a content carousel.
+    Keyboard, arrows and dots navigation.
+    Chrome, Safari, Firefox, Opera, IE7+, IOS, Android, windows phone.
+    Slide and Fade Effects.
+    Vertical Slide, Adaptiveheight, Rtl support...
+    Multiple instances on one page.
+    Slide anything (youtube, vimeo , google map ...)



How to use lightSlider?
--------------------

### The code ###
add the Following code to the &lt;head&gt; of your document.
```html
<link type="text/css" rel="stylesheet" href="css/lightSlider.css" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="js/lightSlider.js"></script>
    // Do not include both lightSlider.js and lightSlider.min.js
```
### HTML Structure ###
```html
<ul id="lightSlider">
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
        $("#lightSlider").lightSlider();
    });
</script>
```
### Play with settings ###
```html
<script type="text/javascript">
    $(document).ready(function() {
        $("#lightSlider").lightSlider({
        item: 3,
        slideMove: 1,
        slideMargin: 10,

        class: '',
        mode: "slide",
        useCSS: true,
        easing: 'ease', //'ex cubic-bezier(0.25, 0, 0.25, 1)',//

        speed: 400, //ms'
        auto: false,
        loop: false,
        pause: 2000,

        keyPress: true,
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
        freeMove:false,
        swipeThreshold: 40,

        responsive : [],

        onBeforeStart: function () {},
        onSliderLoad: function () {},
        onBeforeSlide: function () {},
        onAfterSlide: function () {},
        onBeforeNextSlide: function () {},
        onBeforePrevSlide: function () {}
    });
    });
</script>
```
### Public methods ###
```html
<script type="text/javascript">
    $(document).ready(function() {
        var slider = $("#lightSlider").lightSlider();
        slider.goToSlide(3);
        slider.goToPrevSlide();
        slider.goToNextSlide();
        slider.getCurrentSlideCount();
        slider.refresh();
        slider.play(); 
        slider.pause();
    });
</script>
```
### sachi77n@gmail.com ###
Email me if you have any questions or feedbacks regarding lightslider or [lightGallery](https://github.com/sachinchoolur/lightGallery)
