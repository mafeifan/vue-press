## 场景
服务端每1分钟给客户端发消息，会造成一个问题，新来的订阅者最极端情况可能无法第一时间获取到信息，需要等1分钟。这样对体验非常不友好。

如何做到订阅后立马收到消息呢？

其实也简单，让服务器保留最后一条最新消息就行了，发送端发送消息的时候带上一个标志，服务端收到后，会把消息存储起来

**保留消息存在的意义是为了订阅者能够立即收到消息而无须等待发布者发布下一条消息。**

## 保留消息

#### 发送一条保留消息
从开发者的角度来说，发送一条保留消息是最简单直接的办法。你只需要将一条MQTT发布消息的保留标志（retained flag）置为true。每一个典型的客户端库文件都提供了一个简单方法来实现此操作。

对于paho客户端，发送时候带上`-r`参数就行了

`paho_c_pub -t presence --connection ws://192.168.100.1:8083/mqtt -r -m "test223334567"`

如果是用mqttx客户端发送，勾选retain即可
![](https://pek3b.qingstor.com/hexo-blog/hexo-blog/20210716111540.png)

如果你是用MQTT X broker，我们可以设置保留的消息的存储类型，存到内存还是硬盘，保留数量，保留时间等等
[文档](https://docs.emqx.cn/broker/v4.3/advanced/retained.html#%E7%AE%80%E4%BB%8B)

#### 删除一条保留消息
还有一种很简单的方法来删除某个主题的保留消息：只需要发送一个零字节的保留消息到你想清空消息的主题。broker将会删除保留消息，并且订阅者也不会再收到保留消息，因为每个新的保留消息都会覆盖上一个。


## 参考

https://www.jianshu.com/p/701ef52c62fd

https://www.emqx.cn/blog/message-retention-and-message-expiration-interval-of-emqx-mqtt5-broker

https://www.hivemq.com/blog/mqtt-essentials-part-8-retained-messages/

https://docs.emqx.cn/broker/v4.3/advanced/retained.html#%E7%AE%80%E4%BB%8B
