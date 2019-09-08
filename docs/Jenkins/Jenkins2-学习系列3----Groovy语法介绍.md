写 pipeline 就是写 Groovy 代码，Jenkins pipeline 其实就是基于Groovy语言实现的一种DSL。
了解一些Groovy语法知识是很有必要的

不想本地安装Groovy环境的话，可以打开 [groovy-playground](https://groovy-playground.appspot.com/) 运行线上groovy代码，查看结果
该网站可能需要会科学上网。

> ![image.png](https://hexo-blog.pek3b.qingstor.com/upload_images/71414-ca84076103ec0b8e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 必要的Groovy语法知识

* 定义变量和方法用def关键字，`def name="jack"`
* 语句最后的分号不是必需的
* 方法调用时可以省略括号
```groovy
def say(String name = "world") {
  return "hi " + name
}
// 调用
say name = "jack"
```
* 双引号支持插值，单引号不会解析变量，原样输出
```groovy
def name = 'world'
// 结果： hello world
print "hello ${name}"
// 结果： hello ${name}
print 'hello ${name}'
```
* 三双引号和三单引号都支持换行，只有三双引号支持插值
```groovy
def foo = """ line one
line two
${name}
"""
```
* 支持闭包
```groovy
// 定义闭包
def codeBlack = {print "hello closure"}
// 闭包当做函数调用
codeBlack
// 闭包可以赋值给变量，或者作为参数传递
def pipeline(closure) {
  closure()
}
pipeline(codeBlack)
```

因为括号是非必需的，下面几种写法结果是一样的，是不是和Jenkins pipeline很像呢
```groovy
pipeline( {print "hello closure"} )
pipeline { 
  print "hello closure"
} 
pipeline codeBlack
```
* 闭包的另一个用法
```groovy
def stage(String name, closure) {
  println name
  closure()
}

// 正在情况下，我们这样使用stage函数

stage("stage name", {
   println "closure"
})

// 最终打印
/*
stage name
closure
*/
// 但是，在Groovy里，可以直接这么写

stage("stage name") {
  print "closure"
}
```
