收集一些模型的使用技巧


1. 嵌套作用域查询

Laravel 支持将查用的查询封装为[作用域](https://learnku.com/docs/laravel/6.x/eloquent/5176#local-scopes)

一bbs网站，首页的列表排序功能，可按照发布时间和回复时间排序

Controller中
```php
    public function index(Request $request, Topic $topic, User $user)
    {
        // scopeWithOrder
        $topics = $topic->withOrder($request->order)
                        ->with('user', 'category')  // 预加载防止 N+1 问题
                        ->paginate(20);


        return view('topics.index', compact('topics'));
    }
```
其中 withOrder 是 本地作用域

Model 中 scopeWithOrder 又包含了两个小作用域
```php
    public function scopeWithOrder($query, $order)
    {
        // 不同的排序，使用不同的数据读取逻辑
        switch ($order) {
            case 'recent':
                $query->recent();
                break;

            default:
                $query->recentReplied();
                break;
        }
    }
    
    public function scopeRecentReplied($query)
    {
        // 当话题有新回复时，我们将编写逻辑来更新话题模型的 reply_count 属性，
        // 此时会自动触发框架对数据模型 updated_at 时间戳的更新
        return $query->orderBy('updated_at', 'desc');
    }

    public function scopeRecent($query)
    {
        // 按照创建时间排序
        return $query->orderBy('created_at', 'desc');
    }
    
```
