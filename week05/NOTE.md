# 学习笔记

## 1、CSS计算 | 收集CSS规则

### 环境准备

对css进行语法和词法分析

将css代码变成抽象语法树

```
npm install css
```

### 第一步 收集css规则

```js
let rules = [];
function addCssRules(text){
    var ast = css.parse(text);
 console.log(JSON.stringify(ast,null, "    "));
 rules.push(...ast.stylesheet.rules)
}
```

### 总结

- 遇到style标签时，我们把css规则保存起来
- 这里调用CSS Parser来分析CSS规则
- 这里必须要仔细研究此库分析css规则的格式

## 2、CSS计算 | 添加调用

### 第二步

应用css规则

计算css时机：startTag入栈的时候

```js
function emit(){
	...
  if (token.type === "startTag") {
    ...
		computeCSS(element);
		...
  }
  ...
}
function computeCSS(element) {
    console.log(rules);
    console.log(JSON.stringify(element));
}
```

### 总结

- 当我们创建一个元素后，立即计算css
- 理论上，当我们分析一个元素时，所有CSS规则已经收集完毕
- 在真实浏览器中，可能遇到写在body的style标签。需要重新计算css的情况，这里我们忽略

## 3、CSS计算 | 获取父元素序列

### 第三步

大多数选择器都是和父元素相关的

```js
function computeCSS(element) {
    var elements = stack.slice().reverse();
     
}
```

### 总结

- 在computeCSS函数中，我们必须知道元素的所有父元素才能判断元素与规则是否相匹配

- 我们从上一步骤的stack，可以获取本元素的所有父元素

- 因为我们首先获取的是“当前元素”，所以我们获得和计算父元素匹配的顺序是从内向外

  ```css
  div div #myId
  ```

## 4、CSS计算 | 选择器与元素的匹配

```js
function computeCSS(element) {
    var elements = stack.slice().reverse();
    if (!element.computeStyle) {
        element.conputedStyle = {};
    }
    for (let rule of rules) {
        var selectorParts = rule.selectors[0].split(" ").reverse();
        if (!match(element, selectorParts[0]))
            continue;
        let matched = false;
        var j = 1;
        for (let i = 0; i < elements.length; i++) {
            if (match(element[i], selectorParts[j])) {
                j++;
            }
        }
        if (j >= selectorParts.length)
            matched = true;

        if (marched) {
            //如果匹配到，我们要加入
            console.log("Element", element, "marched rule", rule);
        }
    }
}
```

### 总结

- 选择器也要从当前元素向外排列
- 复杂选择器拆成对单个元素的选择器，用循环匹配父元素队列

## 5、CSS计算 | 计算选择器与元素匹配

```
.a
#a
div
div.a#a //假设class不会写多个
```

```js
function match(element, selector) {
    if (!selector || !element.attributes)
        return false;
    if (selector.charAt(0) == "#") {
        var attr = element.attributes.filter(attr => attr.name === "id")[0]
        if (attr && attr.value === selector.replace("#", ''))
            return true
    } else if (selector.charAt[0] == '.') {
        var attr = element.attributes.filter(attr => attr.name === "id")[0]
        if (attr && attr.value === selector.replace(".", ''))
            return true
     } else {
        if (element.tagName === selector) {
            return true
        }
    }
    return false
}
```

### 总结

- 根据选择器的类型和元素属性，计算是否与当前元素匹配
- 这里仅实现了三种基本选择其，时机的浏览器要处理复合选择器
- 作业：实现复合选择器，实现支持空格的class选择器

```

```

## 6、CSS计算 | 生成computed属性

### 第六步

生成computed 属性

```js
 if (matched) {
            //如果匹配到，我们要加入
            var computedStyle = element.conputedStyle;
            for (var declaration of rule.declarations) {
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {};
                    computedStyle[declaration.property].value = declaration.value;
                }
            }
            console.log("Element", element.computedStyle);
        }
```

### 总结

- 一旦选择匹配，就应用选择器到元素上，形成computedStyle

## 7、CSS计算 | specificity的计算逻辑

选择器优先级处理

```
//  specificity计算逻辑
//specificity 是一个四元组
[0			,0	0,	 0]
inline  id class tag
div div #id
[0,1,0,2] => 一个ID 两个tag
div #my #id
[0,2,0,1] => 两个id 一个tag
```

```js
function specificity(selector) {
    var p = [0, 0, 0];
    var selectorParts = selector.split(" ");
    for (var part of selectorParts) {
        if (part.charAt(0) == "#") {
            p[1] += 1;
        } else if (part.charAt(0) == ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}
```

```js
function compare(sp1, sp2) {
    if (sp1[0] - sp2[0])
        return sp1[0] - sp2[0]
    if (sp1[1] - sp2[1])
        return sp1[1] - sp2[1]
    if (sp1[2] - sp2[2])
        return sp1[2] - sp2[2]
    return sp1[3] - sp2[3]
}
```

```js
if (matched) {
            var sp = specificity(rule.selectors[0])
            var computedStyle = element.conputedStyle;
            for (var declaration of rule.declarations) {
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {};
                    if(!computedStyle[declaration.property].specificity){
                        computedStyle[declaration.property].value = declaration.value;
                        computedStyle[declaration.property].specificity = sp;
                    }
                }
            }
            console.log("Element", computedStyle);
        }
```

### 总结

- CSS规则根据specificity和后来优先规则覆盖
- specificity 是一个四元组，越左边权重越高
- 一个CSS规则的specificity根据包含的简单选择器相加而成

## 8、排版 | 根据浏览器属性进行排版

layout  布局/排版

![image-20200802213007943](/Users/zhangfangfang/Library/Application Support/typora-user-images/image-20200802213007943.png)

```js
//layout.js

function getStyle(element) {
    if (!element.style)
        element.style = {};

    for (let prop in element.computedStyle) {
        var p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
        if (element.style[prop].toString.match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
    }
    return element.style;
}
function layout(element) {
    if (!element.computedStyle)
        return

    var elementStyle = getStyle(element);
    if (elementStyle.display !== 'flex')
        return
    var items = element.children.filter(e => e.type === 'element');
    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
    })

    var style = elementStyle;

    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null
        }
    })

    if (!style.flexDirection || style.flexDirection === 'auto')
        style.flexDirection = 'row'
    if (!style.alignItems || style.alignItems === 'auto')
        style.alignItems = 'row'
    if (!style.justifyContent || style.justifyContent === 'auto')
        style.justifyContent = 'flex-start'
    if (!style.flexWarp || style.flexWarp === 'auto')
        style.flexWarp = 'nowrap'
    if (!style.alignContent || style.alignContent === 'auto')
        style.alignContent = 'stretch'


    var mainSize, mainStart, mainEnd, mainSign, mainBase, crossSize, crossStart, crossEnd, crossSign, crossBase;
    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }
    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }
    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    if (style.flexWarp === 'wrap-reverse') {
        var tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }
}

```

### 

## 9、排版 | 收集元素进行（行）

![image-20200802223618165](/Users/zhangfangfang/Library/Application Support/typora-user-images/image-20200802223618165.png)

- 分行
  - 根据主轴尺寸，把元素分行进
  - 若设置了no-warp， 则强行分配进第一行

<img src="/Users/zhangfangfang/Library/Application Support/typora-user-images/image-20200802223730469.png" alt="image-20200802223730469" style="zoom:33%;" />

```js
 /*
    收集元素进行
    1、根据主轴元素，把元素分进行
    2、若设置了no-wrap，则强行分配进行
    */

    // 如果父元素没有设置主轴尺寸 那么那就进入AtuoMainSize模式 
    let isAutoMainSize = false;
    if(!style[mainSize]){ //Auto sizing
        elementStyle[mainSize] = 0;
        for(let i = 0 ;i<items.length; i++){
            let item = items[i];
            if(itemStyle[mainSize] !== null || itemStyle[mainSize] === item[mainSize])
                elementStyle[mainSize] = elementStyle[mainSize]+item[mainSize];
        }
        isAutoMainSize = true; 
        // style.flexWrap =  'nowrap';
    }

    var flexLine = [];
    var flexLines =[flexLine];

    var mainSpace = elementStyle[mainSize];
    var crossSpace = 0;
    for(let i=0; i<items.length; i++){
        var item = items[i];
        var itemStyle = getStyle(item);

        if(itemStyle[mainSize] === null){
            itemStyle[mainSize] =0;
        }

        if(itemStyle.flex){
            flexLine.push(item);
        }else if(style.flexWrap === 'nowrap' && isAutoMainSize){
            mainSize -= itemStyle[mainSize];
            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)){
                crossSpace = Math.max(crossSpace,itemStyle[crossSize]);
            flexLine.push(item);
            }
        }else{
            if(itemStyle[mainSize]>style[mainSize]){
                itemStyle[mainSize] = style[mainSize];
            }

            if(mainSpace < itemStyle[mainSize]){
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            }else{
                flexLine.push(item)
            }

            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
                mainSize -= itemStyle[mainSize];
        }
    }
    flexLines.mainSpace = mainSpace;

    console.log(items);
```

## 10、排版 | 计算主轴

计算每一行的尺寸

- 计算主轴方向
  - 找出所有Flex元素
  - 把主轴方向的剩余尺寸按照比例分配给这些元素
  - 若剩余空间为负数，所有flex元素为0，等比压缩剩余元素

```js
   flexLine.mainSpace = mainSpace;
    flexLine.crossSpace = crossSpace;

    if (style['flex-wrap'] === 'nowarp' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    //子级在主轴方向位置计算
    if (mainSpace < 0) {
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;
        for (let item of items) {
            let itemStyle = getStyle(item);

            if (item.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] *= scale;

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * items[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach(flexLine => {
            let mainSpace = flexLine.mainSpace;
            let flexTotal = 0;
            for (let item of flexLine) {
                let itemStyle = getStyle(item);
                if (itemStyle.flex !== null && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }

            if (flexTotal > 0) {
                let currentMain = mainBase;
                for (let item of flexLine) {
                    let itemStyle = getStyle(item);

                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }

                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                let justifyContent = style['justify-content'];
                let currentMain, step;

                if (justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                } else if (justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                } else if (justifyContent === 'center') {
                    currentMain = mainSpace / 2 * mainSign + mainBase;
                    step = 0;
                } else if (justifyContent === 'space-between') {
                    step = mainSpace / (flexLine.length - 1) * mainSign;
                    currentMain = mainSpace;
                } else if (justifyContent === 'space-around') {
                    step = mainSpace / flexLine.length * mainSign;
                    currentMain = step / 2 + mainSpace;
                }

                for (let item of flexLine) {
                    let itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }

            }
        })
    }

```

## 11、排版 | 计算交叉轴

- 计算交叉轴方向
  - 根据每一行中最大元素尺寸计算行高
  - 根据行高flex-aign和item-align，确定元素具体位置

```js
  //子级在交叉轴方向位置的计算
    if (!style[crossSize]) {
        crossSpace = 0;
        style[crossSize] = 0;
        for (let flexLine of flexLines) {
            style[crossSize] += flexLine.crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (let flexLine of flexLines) {
            crossSpace -= flexLine.crossSpace;
        }
    }

    if (style['flex-wrap'] === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    let lineSize = style[crossSize] / flexLines.length;
    let step;
    let alignContent = style['align-content'];

    if (alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    } else if (alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    } else if (alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    } else if (alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    } else if (alignContent === 'space-around') {
        step = crossSpace / flexLine.length * crossSign;
        crossBase += step / 2;
    } else if (alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }


    flexLines.forEach((flexLine) => {
        let lineCrossSize = style['align-content'] === 'stretch' ?
            flexLine.crossSpace + crossSpace / flexLines.length : flexLine.crossSpace;

        for (let item of flexLine) {
            let itemStyle = getStyle(item);
            let align = itemStyle['align-self'] || style['align-items'];

            if (!itemStyle[crossSize]) {
                itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
            }

            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            } else if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            } else if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            } else if (align === 'stretch') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * itemStyle[crossSize];
            }
        }

        crossBase += crossSign * (lineCrossSize + step);
    })
```



## 12、渲染｜绘制单个元素

环境准备

```
npm i images
```

```js
		let viewport = images(800, 600);
    render(viewport, dom);
    viewport.save('viewport.jpg');
```

render

```js
const images = require('images');

function render(viewport, element) {
    let style;
    if((style = element.style)) {
        let img = images(style.width, style.height);

        if(style['background-color']) {
            let color = element.style['background-color'] || 'rgb(0,0,0)';
            color.match(/rgb\((\d+),(\d+),(\d+)\)/);
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));
            viewport.draw(img, style.left || 0, style.top || 0);
        }
    } 
}

module.exports = render;

```

### 总结

- 绘制需要依赖一个图形环境
- 我们这里采用了npm包images
- 绘制在一个viewport上进行
- 与绘制相关的属性：background-color, border, background-image 等

## 13、渲染｜绘制DOM树

```js
  if(element.children) {
        for(let child of element.children) {
            render(viewport, child);
        }
    }
```

总结

- 递归调用子元素的绘制方式完成DOM树的绘制
- 忽略一些不需要绘制好的节点
- 实际浏览器中，文字绘制是难点，需要依赖字体库，我们这里忽略
- 实际浏览器中，还会对一些图层做compositing，我们这里也忽略



