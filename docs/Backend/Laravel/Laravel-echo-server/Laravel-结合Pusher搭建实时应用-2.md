接上篇优化，我们使用Laravel的方式改造

首先编辑`.env`，修改广播驱动为pusher
```
# BROADCAST_DRIVER=log
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=1122467
PUSHER_APP_KEY=7b7a4b68e07138fc3b11
PUSHER_APP_SECRET=af7******aadbc26a4
PUSHER_APP_CLUSTER=ap3
MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

前端创建一个vue组件，用来显示实时信息
resources/js/components/ExampleComponent.vue

```vue
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Example Component</div>

                    <div class="card-body">
                        <ul>
                            <li v-for="item in items" :key="item.name">{{ item.name }} -- {{item.data}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            items: []
        }
    },
    mounted() {
        let that = this;
        // task-event 频道名
        // TaskEvent 是类名，我们还没创建，现在去创建
        Echo.channel('task-event')
            .listen('TaskEvent', (e) => {
                console.log(e);
                that.items.push(e)
            });
    }
}
</script>

```

resources/js/app.js
`Vue.component('example-component', require('./components/ExampleComponent.vue').default);`

后端

`php artisan make:event TaskEvent`

打开 `app/Events/TaskEvent.php` 并编辑


```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $task;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($task)
    {
        //
        $this->task = $task;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('task-event');
    }

    public function broadcastWith()
    {
        return $this->task;
    }
}

```

添加一条测试路由

routes/web.php
```
Route::get('/task/demo', function () {
    event(new \App\Events\TaskEvent(['name' => 'foo', 'data' => rand(1000, 9999)]));
});
```
