### 场景

比如Order订单表的发货状态发生了变化，当变为已付款要给相关角色发送邮件通知。

### 事件系统
本质上实现方式是观察者订阅者,和JS中的AddListener和类似

### 原生实现事件类
```php
class Event 
{ 
    protected static $listens = array(); 

    /**
     * [listen 注册监听事件]
     * @param [string]   $event    [事件名]
     * @param [callback] $callback [事件内容]
     * @param [bool] $once [是否是一次性事件，默认false]
     */
    public static function listen($event, $callback, $once=false){ 
        if(!is_callable($callback)) return false; 
        self::$listens[$event][] = array('callback'=>$callback, 'once'=>$once); 
        return true; 
    } 

    // 一次性事件
    public static function one($event, $callback){ 
        return self::listen($event, $callback, true); 
    } 

    public static function remove($event, $index=null){ 
        if(is_null($index)) 
            unset(self::$listens[$event]); 
        else
            unset(self::$listens[$event][$index]); 
    } 

    public static function trigger(){ 
        // 没有参数(传递事件) 退出
        if(!func_num_args()) return; 
        // 事件名的数组
        $args  = func_get_args(); 
        // 将函数名(callback)赋给 $event
        $event = array_shift($args);
        // 检测事件是否被注册过，没有则退出
        if(!isset(self::$listens[$event])) return false; 
        foreach( self::$listens[$event] as $index=>$listen){ 
            $callback = $listen['callback']; 
            $listen['once'] && self::remove($event, $index); 
            call_user_func_array($callback, $args); 
        } 
    } 
}

```

这个类包含了事件的注册，触发及移除方法。

下面添加一个事件，事件名叫walk，事件的动作就是输出 "I am walking...n" ，执行后。该事件会存储在 `$listens` 这个数组中。

```php
Event::listen('walk', function($a='',$b=''){ 
    echo "I am walking...n" .$a .$b; 
}); 
```

触发walk事件

`Event::trigger('walk');`

也可以传参数进去

`Event::trigger('walk','~~~','!!!'); `

如果不移除该事件，触发一次就会执行一次。

而一次性事件执行过一次就会被销毁。再次调用没有任何反应。

```php
Event::one('walkOnce', function(){ 
    echo "run...once"; 
}); 

Event::trigger('walkOnce',true);

// 因为已经执行过了，再次调用返回了false
Event::trigger('walkOnce');
```

### Laravel 中的事件系统

所有事件类放在`app/Events`目录下
所有监听器放在`app/Listeners`目录下

一个事件可以包含多个监听器

打开 `app/Providers/EventServiceProvider.php`

```php
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'App\Events\SomeEvent' => [
            'App\Listeners\EventListener',
        ],
    ];
```

执行 `php artisan event:generate` 会根据上面的定义生成相关类文件

### 运用 Riot Merch


Riot/Sku/Controllers/SkuController.php
```php
    public function store(CreateSkuRequest $request)
    {
        try {
            $input = $request->all();
            
            $sku = $this->repository->create($input);

            event(new SkuCreated($sku));

            return $this->sendResponse($sku, 'Sku saved successfully.');
        } catch (\Exception $e)
        {
            return $this->sendError($e->getMessage());
        }
    }
```


app/Events/SkuEvents/SkuCreated.php

```php
<?php

namespace App\Events\SkuEvents;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Queue\SerializesModels;
use Riot\Sku\Models\Sku;

class SkuCreated
{
    use InteractsWithSockets, SerializesModels;

    public $sku = null;

    /**
     * Create a new event instance.
     *
     * SkuUpdated constructor.
     * @param Sku $sku
     * @param string $type
     */
    public function __construct(Sku $sku, string $type = '')
    {
        $this->sku = $sku;
    }

}

```

app/Providers/EventServiceProvider.php

```php
<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        'App\Events\SkuEvents\SkuCreated' => [
            'App\Listeners\SkuListeners\RiotVerifySkuCreatedPusher',
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
    }
}


```

Listener 具体逻辑
主要是同步SKU信息
```php
<?php

namespace App\Listeners\SkuListeners;

use App\Events\SkuEvents\SkuCreated;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Events\SkuEvents\SkuUpdated as SkuUpdatedEvent;
use Riot\Sku\Jobs\PushCreatedSkuInfo;

class RiotVerifySkuCreatedPusher
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param SkuCreated $event
     * @return void
     */
    public function handle(SkuCreated $event)
    {
        $sku = $event->sku;

        if ($sku) {
            dispatch(new PushCreatedSkuInfo($sku));
        }
    }
}

```

### 参考
https://www.cnblogs.com/sgm4231/p/9820794.html
