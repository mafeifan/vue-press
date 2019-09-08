[这篇文章](https://keymetrics.io/2015/03/26/pm2-clustering-made-easy/) 写的不错，通过这篇文章你可以了解node集群的原理及如果使用pm2快速方便的开启集群模式。
## Introduction

As you would probably know, Node.js is a platform built on [Chrome's JavaScript runtime](https://developers.google.com/v8/), gracefully named V8. 
The V8 engine, and hence Node.js, runs in a single-threaded way, therefore, doesn't take advantage of multi-core systems capabilities.
## 介绍
你也许知道，Node.js是一个运行在名叫V8的JavaScript引擎的平台系统。V8本身是单线程运行的，并没有充分利用多核系统能力。
(注：Node执行JS代码运行在V8上，是单线程，但并非真正的单线程架构)
## Node.js cluster module

Luckily enough, Node.js offers the cluster module, which basically will spawn some workers which can all share any TCP connection.

*How does it work ?*

Cluster module will set up a master and then fork your server app as many times as you want it to (also called a worker). 
It communicates with workers via [IPC](http://en.wikipedia.org/wiki/Inter-process_communication) channels and comes with an embedded load-balancer which uses [Round-robin algorithm](http://en.wikipedia.org/wiki/Round-robin_scheduling) to better distribute load among the workers. 
When using Round-robin scheduling policy, the master [accepts()](http://linux.die.net/man/2/accept) all incoming connections and sends the TCP handle for that particular connection to the chosen worker (still via IPC).

*How to use it ?*

The most basic example is the following :
## Node.js的集群模式
幸运的是，Node.js提供了集群模块，简单讲就是复制一些可以共享TCP连接的工作线程。

*工作原理*

集群模块会创建一个master主线程，然后复制任意多份程序并启动，这叫做工作线程。
工作线程通过 [IPC](http://en.wikipedia.org/wiki/Inter-process_communication) 频道进行通信并且使用了 [Round-robin algorithm](http://en.wikipedia.org/wiki/Round-robin_scheduling) 算法进行工作调度以此实现负载均衡。
Round-robin调度策略主要是master主线程负责接收所有的连接并派发给下面的各个工作线程。

*如何使用*

下面是一个很常见的例子：
```
var cluster = require('cluster');  
var http    = require('http');  
var os      = require('os');

var numCPUs = os.cpus().length;

if (cluster.isMaster) {  
  // Master:
  // Let's fork as many workers as you have CPU cores

  for (var i = 0; i < numCPUs; ++i) {
    cluster.fork();
  }
} else {
  // Worker:
  // Let's spawn a HTTP server
  // (Workers can share any TCP connection.
  //  In this case its a HTTP server)

  http.createServer(function(req, res) {
    res.writeHead(200);
    res.end("hello world");
  }).listen(8080);
}
```

Of course, you can spawn as many workers as you wish. You're not limited by the CPU cores number since a worker is nothing more but a child process. 
As you can see, to make it work, you have to wrap your code inside some cluster handling logic and then add some more code to specify the expected behaviour in case your worker dies unexpectedly.

你可以不受CPU核心限制的创建任意多个工作线程。
使用原生方法有些麻烦而且你还需要处理如果某个工作线程挂掉了等额外的逻辑。
(注：通过fork()复制的进程都是独立的进程，有着全新的V8实例)

The PM2 way
Built-in clustering

PM2 internally handles all of the above logic for you so you don't have to change anything in your code. 
The previous code becomes :

PM2的方式
PM2内置了处理上述的逻辑，你不用再写这么多繁琐的代码了。
只需这样一行：
`$ pm2 start app.js -i 4`
`-i <number of workers>` 表示实例程序的个数。就是工作线程。
如果`i`为0表示，会根据当前CPU核心数创建
![image.png](https://upload-images.jianshu.io/upload_images/71414-c07589393166d729.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


Keeping your apps running no matter what

If any of your workers happens to die, PM2 will restart them immediatly so you don't have to worry about that either. 
Or, of course, you can, at any time, restart them manually as follows : 

### 保持你的程序不中断运行
如果有任何工作线程意外挂掉了，PM2会立即重启他们，当前你可以在任何时候重启，只需：
![image.png](https://upload-images.jianshu.io/upload_images/71414-256514707b977d07.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Scaling your cluster in realtime

If you consider that you don't have enough workers or more than needed, you can scale your cluster anytime by hitting pm2 scale <app name> <n> where <n> can be a consistent number which the cluster will scale up or down to. 
It can also be an addition such as pm2 scale app +3 in which case 3 more workers will be added to the cluster.

### 实时调整集群数量
你可以使用命令 `pm2 scale <app name> <n>` 调整你的线程数量，
如 pm2 scale app +3 会在当前基础上加3个工作线程。

![image.png](https://upload-images.jianshu.io/upload_images/71414-6edd29f00d0bfe63.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Updating your apps in production with zero downtime

PM2 reload <app name> feature will restart your workers one by one, and for each worker, wait till the new one has spawned before killing the old one. 
This way, your server keeps running even when you are deploying the new patch straight to production.

You can also use gracefulReload feature which does pretty much the same thing but instead of immediatly killing the worker it will send it a shutdown signal via IPC so it can close ongoing connections or perform some custom tasks before exiting gracefully. 
Example :

### 在生产环境让你的程序永不中断
`PM2 reload <app name>` 命令会一个接一个的重启工作线程，在新的工作线程启动后才结束老的工作线程。
这种方式可以保持你的Node程序始终是运行状态。即使在生产环境下部署了新的代码补丁。

也可以使用gracefulReload命令达到同样的目的，它不会立即结束工作线程，而是通过IPC向它发送关闭信号，这样它就可以关闭正在进行的连接，还可以在退出之前执行一些自定义任务。这种方式更优雅。
```
process.on('message', function(msg) {  
  if (msg === 'shutdown') {
    close_all_connections();
    delete_cache();
    server.close();
    process.exit(0);
  }
});
```
## Conclusion

Cluster module is a powerful tool. It gets even better and easy to use along with PM2. 
Cluster.js was experimental on Node 0.10.x and is considered to be mature and production-ready since Node 0.11.x latest releases and of course Node 0.12.x. 
We strongly suggest you to always use the latest version of Node.js and [PM2](https://github.com/Unitech/PM2/) since both of these projects' contributors are working hard every day to make them better.

Enjoy Node.js' clustering with PM2 !

### 结论
Cluster集群模式非常强悍有用，此功能是在Node 0.10.x 是实验功能，在0.11.x 之后才作为正式发布。
强烈建议你使用最新版本的Node.js和PM2。

