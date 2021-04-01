## 什么是rabbitmq？

rabbitmq是基于AMQP协议的消息队列

## 什么是AMQP 0-9-1？
AMQP 0-9-1是高级消息队列协议，是一种消息传递协议，它使符合要求的客户端应用程序能够与符合要求的消息传递中间件代理进行通信

##  rabbitmq概念
	
| 名称        | 含义|
| ----------- | -----|
| Broker      | 代理消息的服务器，具体指的是消息队列服务器实体 |
| Virtual Host      | 虚拟主机，对于多租户共享的服务器，为了实现用户间隔离彼此互不影响，broker里可以开设多个Virtual Host，用作不同用户的权限分离，相当于namespace命名空间或可以理解为mysql中的数据库 |
| Connection      | client(publisher／consumer)和broker之间的TCP连接。断开连接的操作只会在client进行，Broker不会断开连接，除非出现网络故障或broker服务出现问题 |
| Channel      | 消息通道，在Connection里，可建立多个channel，每个channel代表一个会话任务,channel之间彼此隔离，client和broker通过channel id识别channel |
| Exchange      | 交换机，使消息按照指定规则，路由到具体队列 |
| Queue      | 消息队列，存放消息的载体，等待消费者取出 |
| Binding      | 绑定，把exchange和queue按照路由规则绑定起来 |	
| Routing Key      | 路由关键字，exchange根据这个关键字进行消息投递 |	
| Producer     | 消息生产者，就是创建投递消息的程序 |			
| Consumer     | 消息消费者，就是获取消息的程序 |			
	
	
## 工作流程


> ![image.png](https://www.jmsite.cn/wp-content/uploads/2019/01/hello-world-example-routing.png)

1. publisher请求创建一个Connection，连接到Broker，打开一个channel
2. publisher声明一个exchange，并设置相关属性
3. publisher声明一个queue，并设置相关属性
4. publisher使用routing key，在exchange和queue之间建立好绑定关系
5. publisher投递消息到exchange
6. exchange通过routing key和绑定关系，将消息投递到queue
7. queue将消息分发给consumer
8. consumer获取到消息后进行消息确认或处理完成后消息确认，queue删除消息


## 交换机类型
|交换机类型 |	预声明的默认名称 |
| ----------- | -----|
|Direct exchange（直连交换机）|	(Empty string) and amq.direct|
|Fanout exchange（扇型交换机）|	amq.fanout|
|Topic exchange（主题交换机）	|   amq.topic|
|Headers exchange（头交换机） |	amq.match (and amq.headers in RabbitMQ)|
	
## 交换机属性
|属性名	|含义|
| ----------- | -----|
|Name(名称)	|交换机名称|
|Durability(持久)|	Broker重启后，交换机是否还存在|
|Auto-delete(自动删除)	|当所有与之绑定的消息队列都完成了对此交换机的使用后，删掉它|
|Arguments(参数)	|可选，由插件和特定于代理的功能使用|

## 直连交换(单播)
队列通过路由键routing key(如k=R)绑定到交换机
当有新消息投递到直接交换时，如果k=R，交换机将其投递到使用k=R绑定的队列
> ![image.png](https://www.jmsite.cn/wp-content/uploads/2019/01/exchange-direct.png)

## 扇形交换(广播)
扇形交换将消息路由到绑定到它的所有队列，并忽略routing key
> ![image.png](https://www.jmsite.cn/wp-content/uploads/2019/01/exchange-fanout.png)

## 主题交换(多播)
主题交换基于消息路由键routing key，与交换机和队列间的绑定routing key进行匹配，将消息路由到一个或多个队列，主题交换通常用于实现类似各种发布/订阅模式。主题交换通常用于消息的多播路由

## 头交换机(多播)
头交换机通过消息的headers属性和与交换机绑定的routing key进行匹配，将消息路由到一个或多个队列，当"x-match"设置为“any”时，消息头的任意一个值被匹配就可以满足条件，而当"x-match"设置为“all”的时候，就需要消息头的所有值都匹配成功。

## 队列
队列存储着即将被应用消费掉的消息。队列跟交换机共享某些属性，但是队列也有一些另外的属性。

|名称|	含义|
| ----------- | -----|
|Name(名称)	|队列名称|
|Durable(持久)	|Broker重启后，队列是否继续存在|
|Exclusive(独占)	|仅由一个连接使用，当该连接关闭时将删除队列|
|Auto-delete(自动删除)|	当最后一个consumer断开连接后自动删除|
|Arguments	|可选参数|

## 队列名称
队列名称可以由client(publisher／consumer)定义，也可以由Broker定义，当需要Broker定义队列名称时，队列名称传空字符串即可，后续操作时队列名称也需传空字符串，队列的名字为utf-8编码， 最长不超过255字节，队列名称以“amq”开头的是保留名称，供Broker内部使用，强行使用将返回403错误码

## 队列持久
持久队列存储到磁盘，因此可以在Broker重新启动后继续运行。不持久的队列称为暂存队列。并非所有场景都要求队列持久。

## 绑定
绑定是交换机将消息路由给队列所遵循的规则

## 消息确认
当队列接到consumer的消息确认时将删除消息，消息确认分为两种：
1.consumer获取消息后自动确认
2.consumer获取消息后手动确认，或处理完成后手动确认

## 拒绝消息
consumer获取消息后如果处理失败，应该通知队列此消息被拒绝，并通知队列该消息是删除还是继续存放在队列，当队列只有一个consumer时，继续存放队列可能会造成队列和消费者间的死循环

## 预读取消息
对于存在多个consumer的队列，在consumer确认消息之前，设置可以向consumer分发消息的数量，可以简单的实现类似复杂均衡

## 消息属性
|属性名	|含义|
| ----------- | -----|
|Content type	|内容类型|
|Content encoding	|编码|
|Routing key	|路由键|
|Delivery mode	|投递模式（持久化 或 非持久化）|
|Message priority	|消息优先级|
|Message publishing timestamp	|发布时间戳|
|Expiration period	|消息有效期|
|Publisher application id	|Publisher的ID|
