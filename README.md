jQuery lightSlider
=============


Demo
----------------
[JQuery lightSlider demo](http://sachinchoolur.github.io/lightslider/)

Description
----------------
JQuery lightSlider is a lightweight responsive Content slider ( 5KB minified )

Main Features
----------------

+   Responsive layout.
+   Supports touch devices and swiping.
+   Semantic and easy to use markup.
+   CSS transitions with jQuery fallback.
+   Lightweight (6kb) (minified).
+   Chrome, Safari, Firefox, Opera, IE7+, IOS, Android, windows phone.
+   Slide and Fade Effects.
+   Multiple instances on one page.
+   Image Gallery suport.


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
        slideWidth:270,
        slideMargin:0,
        slideMove:1,
        minSlide:1,
        maxSlide:8,
         
        pager:true,
        controls:true,
        prevHtml:'',
        nextHtml:'',
        keyPress:true,
        thumbWidth:50,
        thumbMargin:3,
        gallery:false,
        currentPagerPosition:'middle',
        useCSS:true,
        auto: false,
        pause: 2000,
        loop:true,
        easing: '',
        speed: 1000,
        mode:"slide",
        swipeThreshold:10,
         
        onBeforeStart: function(){},
        onSliderLoad: function() {},
        onBefroreSlide:function(){},
        onAfterSlide:function(){},
        onBeforeNextSlide: function(){},
        onBeforePrevSlide: function(){}
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
    });
</script>
```