PHP与RabbitMQ消息队列

消息队列（Message Queue）是一种应用间的通信方式，消息发送后可以立即返回，由消息系统来确保消息的可靠传递。消息发布者只管把消息发布到 MQ 中而不用管谁来取，消息使用者只管从 MQ 中取消息而不管是谁发布的。这样发布者和使用者都不用知道对方的存在。

简单的消息队列，我们完全可以使用Redis实现，而相对复杂的需求，比如消息确认、消息持久化、高可用等需要用RabbitMQ这样的大器来做比较合适。

本文我们结合实例给大家讲解使用PHP处理RabbitMQ消息队列的应用。

安装php-amqplib

[php-amqplib](https://github.com/php-amqplib/php-amqplib)是一个纯PHP库，使用它，基于PHP的脚本客户端就可以轻松的连接和操作RabbitMQ。我们使用composer来安装。

`composer require php-amqplib/php-amqplib`

这里用最新的v2.12.1版本

## 示例说明
生产者（Producer）和消费者（Consumer）是消息队列的基本概念，生产者是指生产消息的一方，也是消息发送方，消费者就是消费消息的一方，也是消息接收方，队列就是存储消息的一个缓存区。本文实例将由生产者发送很多消息给消息队列，由多个消费者来消费队列中的消息。我们可以想象这样的场景：皮鞋生产打包打包车间，不断有成品鞋进入传送带（消息队列）等待操作工人（消费者）将皮鞋打包。因为等待打包的鞋子特别多，我们需要安排多个打包工人在传送带两边，及时从传送带取出成品鞋，然后装箱打包。我们要求是要确保工人最后打包好的皮鞋数量一双不少，不能因为打包工人操作慢或者个人原因暂时离开生产线，导致最终打包数不一致。

## 消息发送

生产者将消息发送给队列，至于谁来消费（处理）这些消息，生产者不管。

消息队列（MQ），用来保存消息直到发送给消费者。它是消息的容器，也是消息的终点。一个消息可投入一个或多个队列。消息一直在队列里面，等待消费者连接到这个队列将其取走。

消息到达队列中后，如果没有一个消费者来处理消息的话，我们希望队列中的消息不要丢弃，也就是消息持久化。在生产者和消费者中都要将queue_declare第3个参数设置为true，表示让消息队列持久化。

`$channel->queue_declare($queue, false, true, false, false); `


此外，我们可以确保即使RabbitMQ重启了，消息队列不会丢失，在生产者端设置：`'delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT。`

现在我们建立生产者文件sender.php，我们假设服务端已经安装好RabbitMQ，并且开放好对应端口。

```php
<?php
/**
 * @Author: Helloweba
 * @sender.php
 * @消息生产者-分发任务
 */

require_once __DIR__ . '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

$queue = 'worker';

//$connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
$connection = new AMQPStreamConnection(
    '192.168.0.100', 
    56720, 
    'helloweba',  //user
    'helloweba',  //password
    'test'  //vhost
);
$channel = $connection->channel();

$channel->queue_declare($queue, false, true, false, false); //第3个参数设置为true，表示让消息队列持久化

for ($i = 0; $i < 100; $i++) { 
    $arr = [
        'id' => 'message_' . $i,
        'order_id' => str_replace('.', '' , microtime(true)) . mt_rand(10, 99) . $i,
        'content' => 'helloweba-' . time()
    ];
    $data = json_encode($arr);
    $msg = new AMQPMessage($data, ['delivery_mode' => AMQPMessage::DELIVERY_MODE_PERSISTENT]); ////设置rabbitmq重启后也不会丢失队列，或者设置为'delivery_mode' => 2
    $channel->basic_publish($msg, '', $queue);

    echo 'Send message: ' . $data . PHP_EOL;
}

$channel->close();
$connection->close();
```

上述代码中，我们模拟了生产者向队列中发送了100条订单消息。

## 消息接收

消费者是指完成消息的接收和处理的客户端程序，消费者就如同生产线上的操作工人，他们按照操作规程从传送带上取出产品后有序的完成后续工作任务。

实际项目中，如果消费者处理消息能力不够时，就要开启多个消费者来消费队列中的消息。默认情况下，RabbitMQ将会把队列中的消息平均分配给每个消费者。如果消费者要对分配到的消息任务处理时间很长（耗时任务），那么处理消息任务的时候就有可能会遇到意外。比如某个消费者断电了，或者出故障了，那它正在处理的消息会怎么办？这里就是RabbitMQ的消息确认机制，为了保证数据不丢失，RabbitMQ会将未处理完的消息分配给下一个消费者处理。

此外RabbitMQ还可以设置公平分配消息任务，不会给某个消费者同时分配多个消息处理任务，因为消费者无法同时处理多个消息任务。换句话说，RabbitMQ在处理和确认消息之前，不会向消费者发送新的消息，而是将消息分发给下一个不忙的消费者。

`$channel->basic_qos(null, 1, null); //处理和确认完消息后再消费新的消息`

我们现在建立消费者文件receiver.php，代码如下：

```php
<?php
/**
 * @Author: Helloweba
 * @receiver.php
 * @消息消费者-接收端
 */

require_once __DIR__ . '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;

$queue = 'worker';

//$connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
$connection = new AMQPStreamConnection('192.168.0.100', 56720, 'helloweba', 'helloweba', 'test');
$channel = $connection->channel();

$channel->queue_declare($queue, false, true, false, false);

echo ' [*] Waiting for messages. To exit press CTRL+C' . PHP_EOL;

$callback = function($msg){
    echo " Received message：", $msg->body, PHP_EOL;
    sleep(1);  //模拟耗时执行
    $msg->delivery_info['channel']->basic_ack($msg->delivery_info['delivery_tag']);
};

$channel->basic_qos(null, 1, null); //处理和确认完消息后再消费新的消息
$channel->basic_consume($queue, '', false, false, false, false, $callback); //第4个参数值为false表示启用消息确认

while(count($channel->callbacks)) {
    $channel->wait();
}

$channel->close();
$connection->close();
```

## 模拟测试

现在我们运行多个消费者终端，可以打开多个ssh客户端，client1和client2运行：

`php receive.php`

然后再开个终端，运行生产者：

`php sender.php`

由于消费者是阻塞运行的，他们会一直等待队列中的消息，当有消息就会去取出来处理。我们可以模拟将其中某个客户端中断，即断开某个消费者。然后再看消息是不是被其他消费者接收处理了。同样我们可以模拟将客户端全部重启，看看队列中的消息是否没有丢失。

当client1中断连接RabbitMQ后，再次运行连接RabbitMQ，在client2中看到的消息处理情况，注意看图中的消息id。

client1:
![](https://pek3b.qingstor.com/hexo-blog/hexo-blog/20210315185224.png)

client2:
![](https://pek3b.qingstor.com/hexo-blog/hexo-blog/20210315185326.png)


## 队列属性

* durable 持久化

即指定队列是否是持久化的。使消息持久化，需要队列和消息都是持久化的，并且通常交换机也应该是持久化的。
RabbitMQ的默认交换机“(AMQP default)”是持久化的，对于与其绑定的队列，将队列声明为持久化的队列，并发送持久化的消息，即可将消息持久化。
	
// 重启队列	
rabbitmqctl stop_app
rabbitmqctl start_app

登录Web管理界面，可以看到，队列中依然保存着重启前的消息。队列列表中，特性（Features）列的“D”即表示该队列是持久化的（Durable）。

可以验证，若队列不是持久化的，或发送的消息未设置持久化的属性，在RabbitMQ重启后，消息都会丢失。

* exclusive 排他性

对于排他队列，只有创建它的连接有权访问，连接断开后，排他队列将自动删除。
这种队列适用于一个队列仅对应一个客户端收发消息的场景。在声明队列时，将exclusive参数设置为true即可声明一个排他队列。

进入Web管理界面，Queues中Features列的“Excl”即表明该队列是排他的
