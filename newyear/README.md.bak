parallax.js
===========

目前移动端涌现了很多滚动视差效果的案例，多应用于企业招聘、活动邀请及产品宣传中，形式新颖，让人印象深刻。不过细细观察，就能发现虽然细节都有小创新，但实现原理殊途同归的。基于此，为满足快速实现并提升效率的目的，开发了这个移动端的滚动视差插件。

![QQ钱包大闸蟹众筹](https://raw.githubusercontent.com/hahnzhu/parallax.js/master/assets/gif/dazhaxie.gif) 
![WE大会](https://raw.githubusercontent.com/hahnzhu/parallax.js/master/assets/gif/we.gif)

我把视差滚动效果归于两类，第一类是基于鼠标滚轮/手指触摸的逐帧动画，第二类是分屏动画（即一屏一屏翻阅）。前者动画细节丰富，互动性强，但是容易让用户感觉疲劳失去耐性，同时效果不易把控；后者分屏翻阅可以快速浏览内容，实现起来也相对简单。考虑到移动端屏幕尺寸以及操作媒介（手指）不同，分屏动画是最理想的，此插件也仅专注于此。

parallax.js 特效组件已加入 FrozenUI 中，[详情猛击](https://github.com/frozenui/frozenui)

---

### 一、使用

#### 1、HTML ####

```html

<!-- 这里的每个标签和每个类都是必须的 -->
<div class="wrapper">
	<div class="pages">
		
		<!-- 第一屏 -->
		<div class="page">
		   	<!-- anything you want.... -->
		</div>
	
		<!-- 第二屏 -->
		<div class="page">
		</div>
	
		<!-- 第三屏 -->
		<div class="page">
		</div>

		...

	</div>
</div>
```

CSS 引用：
```css
<link rel="stylesheet" href="path/to/parallax.css" />

/* 如果需要使用内置动画，需要引用下面的内容 */
<link rel="stylesheet" href="path/to/parallax-animation.css" />
```

JS 引用：
```js
<script src="path/to/zepto.min.js"></script>
<script src="path/to/parallax.js"></script>
<script>
  $('.pages').parallax();
</script>
```

### 二、定制
```js
<script>

// 下面的都是默认属性
$('.pages').parallax({
	direction: 'vertical', 	// horizontal (水平翻页)
	swipeAnim: 'default', 	// cover (切换效果)
	drag:      true,		// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
	loading:   false,		// 有无加载页
	indicator: false,		// 有无指示点
	arrow:     false,		// 有无指示箭头
	/*
	 * 翻页后立即执行
	 * {int} 		index: 第几页
	 * {DOMElement} element: 当前页节点
	 * {String}		directation: forward(前翻)、backward(后翻)、stay(保持原页)
	 */
	onchange: function(index, element, direction) {
		// code here...
	},
	/*
	 * 横竖屏检测
	 * {String}		orientation: landscape / protrait
	 */
	orientationchange: function(orientation) {
		
	}

});

</script>
```

#### 具体参数演示
```js
// DEMO1(默认)
<script>
$('.pages').parallax({
	loading:   false,
	indicator: false,
	arrow:     false
});
</script>
```

__DEMO1__

![DEMO1](https://raw.githubusercontent.com/hahnzhu/parallax.js/master/assets/gif/demo1.gif)


```js
// DEMO2
<script>
$('.pages').parallax({
	loading:   true,
	indicator: true,
	arrow:     true
});
</script>
```

__DEMO2__

![DEMO2](https://raw.githubusercontent.com/hahnzhu/parallax.js/master/assets/gif/demo2.gif)

```js
// DEMO3
<script>
$('.pages').parallax({
	direction: 'horizontal',
	loading:   true,
	indicator: true,
	arrow:     true
});
</script>
```
__DEMO3__

![DEMO3](https://raw.githubusercontent.com/hahnzhu/parallax.js/master/assets/gif/demo3.gif)


```js
// DEMO4(默认)
<script>
$('.pages').parallax({
	swipeAnim: 'default'
});
</script>
```

__DEMO4__

![DEMO4](https://raw.githubusercontent.com/hahnzhu/parallax.js/master/assets/gif/demo4.gif)

```js
// DEMO5
<script>
$('.pages').parallax({
	swipeAnim: 'cover'
});
</script>
```

__DEMO5__

![DEMO5](https://raw.githubusercontent.com/hahnzhu/parallax.js/master/assets/gif/demo5.gif)



### 三、DOM 接口

```html
<div class="wrapper">

	<!-- 初始化后自动添加 direction、swipeAnim、direction 类，其中 direction 在翻页的过程中才会添加。 -->
	<div class="pages vertical/horizontal  default/cover  forward/backward">
		
		<!-- 为 page 添加 data-id，当前 page 会自动添加 current 类(翻页后立即添加) -->
		<section data-id="1" class="current">
			...
		</section>

		<section data-id="2">
			...
		</section>
	</div>
</div>
		
```


### 四、内置动画
有四种内置动画，分别是 `slideToTop/Bottom/Left/Right`、 `fadeInToTop/Bottom/Left/Right`、 `followSlide` 和 `fadeIn/Out`，动画参数可通过 `data-animation`、 `data-duration`、 `data-delay` 和 `data-timing-function` 进行配置。

`data-duration` 默认值为 500ms，`data-delay` 默认为0，`data-timing-function` 默认值为 ease.

可看以下实例：

__EXAMPLE__

![EXAMPLE](https://raw.githubusercontent.com/hahnzhu/parallax.js/master/assets/gif/example.gif)

```html
<div class="wrapper">
	<div class="pages">

		<!-- 第一屏 -->
		<section class="page">
			<div class="box1" data-animation="slideToBottom" data-timing-function="ease-in"></div>
			<div class="box2" data-animation="slideToTop" data-delay="300" data-timing-function="ease-out"></div>
			<div class="box3" data-animation="slideToRight" data-delay="600" data-timing-function="linear"></div>
			<div class="box4" data-animation="slideToLeft" data-delay="900" data-timing-function="cubic-bezier(.12,.73,.62,1.38)"></div>
		</section>

        <!-- 第二屏 -->
		<section class="page">
			<div class="box1" data-animation="followSlide" data-duration="1000"></div>
			<div class="box2" data-animation="followSlide" data-delay="200" data-duration="1000"></div>
			<div class="box3" data-animation="followSlide" data-delay="400" data-duration="1000"></div>
			<div class="box4" data-animation="followSlide" data-delay="600" data-duration="1000"></div>
		</section>

        <!-- 第三屏 -->
		<section class="page">
			<div class="box1" data-animation="fadeInToBottom"></div>
			<div class="box2" data-animation="fadeInToTop" data-delay="200"></div>
			<div class="box3" data-animation="fadeInToLeft" data-delay="400"></div>
			<div class="box4" data-animation="fadeInToRight" data-delay="600"></div>
		</section>

		<!-- 第四屏 -->
		<section class="page">
			<div class="box1" data-animation="fadeIn"></div>
			<div class="box2" data-animation="fadeOut" data-delay="800"></div>
		</section>

	</div>
</div>
```

CSS：
```css
/* custom */
section[data-id="1"] {
	background-color: #3498db;
}
section[data-id="2"] {
	background-color: #40d47e;
}
section[data-id="3"] {
	background-color: #ff8c81;
}
section[data-id="4"] {
	background-color: #3498db;
}
.box1 {
	width: 100px;
	height: 200px;
	background-color: #ecf0f1;
	position: absolute;
	left: 160px; top: 126px;
}
.box2 {
	width: 200px;
	height: 100px;
	background-color: #8e44ad;
	position: absolute;
	left: 60px; top: 226px;
}
.box3 {
	width: 100px;
	height: 100px;
	background-color: #34495e;
	position: absolute;
	left: 160px; top: 226px;
}
.box4 {
	width: 50px;
	height: 50px;
	background-color: #e74c3c;
	position: absolute;
	left: 185px; top: 250px;
}
```

注：followSlide 效果会根据翻页方向的不同而改变，如下：

![followSlide1](https://raw.githubusercontent.com/hahnzhu/parallax.js/master/assets/gif/followSlide1.gif) &nbsp;&nbsp;&nbsp;&nbsp;
![followSlide2](https://raw.githubusercontent.com/hahnzhu/parallax.js/master/assets/gif/followSlide2.gif)



---

## License

Parallax.js is released under the [the MIT license](opensource.org/licenses/mit-license.php).
