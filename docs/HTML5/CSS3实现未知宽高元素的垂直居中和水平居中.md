其实在平常的一些布局中也经常有要实现元素的垂直居中和水平居中的的需要，下面来写几种css/css3实现的未知宽高元素的水平和垂直居中的写法

ps：不考虑兼容问题（下次会写js实现元素的水平and垂直居中 ）

### css3的transform
```css
.box {
    /* 设置元素绝对定位 */
    position: absolute;
    top: 50%;
    left: 50%;
    /* css3   transform 实现 */
    transform: translate(-50%, -50%);
}
```

### flex盒子布局
```css
.box {
    /* 弹性盒模型 */    
    display: flex;
    /* 主轴居中对齐 */
    justify-content: center;
    /* 侧轴居中对齐 */    
    align-items: center;  
}
```

### display的table-cell  
```css
.box{
    /* 让元素渲染为表格单元格 */
    display: table-cell;
    /* 设置文本水平居中 */
    text-align: center; 
    /* 设置文本垂直居中 */
    vertical-align: middle; 
}    
```
