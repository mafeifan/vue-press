Laravel UI 源码分析

laravel/ui 是一个composer包，可以生成登录/注册代码的脚手架，使用方法叫[文档](https://learnku.com/docs/laravel/6.x/frontend/5149#writing-javascript
)

源码结构：

![](https://pek3b.qingstor.com/hexo-blog/hexo-blog/20201103174100.png)

原理比较简单，提供一些命令
```
// 生成基本脚手架
php artisan ui bootstrap
php artisan ui vue
php artisan ui react

// 生成 登录/注册 脚手架...
php artisan ui bootstrap --auth
php artisan ui vue --auth
php artisan ui react --auth
```

比如，执行`php artisan ui vue`会复制源码目录中的`Presets/vue-stubs/`相关文件到到项目目录的resources底下

源码分析 UiServiceProvider
这个文件没啥说的，明显注册服务
```php
<?php

namespace Laravel\Ui;

use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class UiServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register the package services.
     *
     * @return void
     */
    public function register()
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                AuthCommand::class,
                UiCommand::class,
            ]);
        }
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [
            AuthCommand::class,
            UiCommand::class,
        ];
    }
}

```


UiCommand.php

核心文件，描述命令和发生的内容
```php
<?php

namespace Laravel\Ui;

use Illuminate\Console\Command;
use InvalidArgumentException;

class UiCommand extends Command
{
    /**
     * The console command signature.
     *
     * @var string
     */
    protected $signature = 'ui
                    { type : The preset type (bootstrap, vue, react) }
                    { --auth : Install authentication UI scaffolding }
                    { --option=* : Pass an option to the preset command }';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Swap the front-end scaffolding for the application';

    /**
     * Execute the console command.
     *
     * @return void
     *
     * @throws \InvalidArgumentException
     */
    public function handle()
    {
        // 
        if (static::hasMacro($this->argument('type'))) {
            return call_user_func(static::$macros[$this->argument('type')], $this);
        }

        if (! in_array($this->argument('type'), ['bootstrap', 'vue', 'react'])) {
            throw new InvalidArgumentException('Invalid preset.');
        }

        $this->{$this->argument('type')}();

        if ($this->option('auth')) {
            $this->call('ui:auth');
        }
    }

    /**
     * Install the "bootstrap" preset.
     *
     * @return void
     */
    protected function bootstrap()
    {
        Presets\Bootstrap::install();

        $this->info('Bootstrap scaffolding installed successfully.');
        $this->comment('Please run "npm install && npm run dev" to compile your fresh scaffolding.');
    }

    /**
     * Install the "vue" preset.
     *
     * @return void
     */
    protected function vue()
    {
        Presets\Bootstrap::install();
        Presets\Vue::install();

        $this->info('Vue scaffolding installed successfully.');
        $this->comment('Please run "npm install && npm run dev" to compile your fresh scaffolding.');
    }

    /**
     * Install the "react" preset.
     *
     * @return void
     */
    protected function react()
    {
        Presets\Bootstrap::install();
        Presets\React::install();

        $this->info('React scaffolding installed successfully.');
        $this->comment('Please run "npm install && npm run dev" to compile your fresh scaffolding.');
    }
}

```


## 参考

https://learnku.com/articles/2769/laravel-pipeline-realization-of-the-principle-of-single-component
https://segmentfault.com/a/1190000022566835
