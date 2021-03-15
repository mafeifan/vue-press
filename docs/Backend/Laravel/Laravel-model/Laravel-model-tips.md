收集一些模型的使用技巧


### 1. 嵌套作用域查询

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

### 2. 在 find 方法中指定属性

```php
User::find(1, ['name', 'email']);
User::findOrFail(1, ['name', 'email']);
```

### 3. Clone 一个 Model

```php
$user = User::find(1);
$newUser = $user->replicate();
$newUser->save();
```

### 4. 判断两个 Model 是否相同

```php
$user = User::find(1);
$sameUser = User::find(1);
$diffUser = User::find(2);
$user->is($sameUser); // true
$user->is($diffUser); // false;
```

### 5. 重新加载一个 Model

```php
$user = User::find(1);
$user->name; // 'Peter'
// 如果 name 更新过，比如由 peter 更新为 John
$user->refresh();
$user->name; // John
```

### 6. 加载新的 Model

```php
$user = App\User::first();
$user->name;    // John
//
$updatedUser = $user->fresh(); 
$updatedUser->name;  // Peter
$user->name;    // John
```

### 7. 更新带关联的 Model

在更新关联的时候，使用 push 方法可以更新所有 Model

```php
class User extends Model
{
  public function phone()
  {
    return $this->hasOne('App\Phone');
  }
}
$user = User::first();
$user->name = "Peter";
$user->phone->number = '1234567890';
$user->save(); // 只更新 User Model
$user->push(); // 更新 User 和 Phone Model
```
 
### 8. 自定义软删除字段

Laravel 默认使用 deleted_at 作为软删除字段，我们通过以下方式将 deleted_at 改成 is_deleted

```php
class User extends Model
{
 use SoftDeletes;
  * deleted_at 字段.
  *
  * @var string
  */
 const DELETED_AT = 'is_deleted';
}
```

或者使用访问器

```php
class User extends Model
{
  use SoftDeletes;
  
  public function getDeletedAtColumn(){
    return 'is_deleted';
  }
}
```


### 9. 查询 Model 更改的属性


```php
$user = User::first();
$user->name; // John
$user->name = 'Peter';
$user->save();
 
dd($user->getChanges());
// 输出：
[
 'name' => 'John',
 'updated_at' => '...'
]
```


### 10. 查询 Model 是否已更改

```php
$user = User::first();
$user->name;    // John
$user->isDirty();  // false 
$user->name = 'Peter'; 
$user->isDirty();  // true
$user->getDirty();  // ['name' => 'Peter']
$user->save();   
$user->isDirty();  // false
```

getChanges() 与 getDirty() 的区别

getChanges() 方法用在 save() 方法之后输出结果集

getDirty() 方法用在 save() 方法之前输出结果集

### 11. 查询修改前的 Model 信息

```php
$user = App\User::first();
$user->name;     //John
$user->name = "Peter";   //Peter
$user->getOriginal('name'); //John
$user->getOriginal();   //Original $user record
```

### 12. 使用 withDefault 保持返回格式统一

```php
public function _city()
{
    return $this->hasOne(City::class, 'id', 'city_id');
}
```

比如student和city是一对一关系，如果一个student表中city字段为空，返回的结果可能是

`{name: "jack", _city: null}`

这样会造成的问题是前端如果使用了`student._city.name`会造成undefined等错误。
为了避免可以改为
```php
public function _city()
{
    return $this->hasOne(City::class, 'id', 'city_id')->withDefault([
      'name' => '',
    ]);
}
```
这样即使找不到也不会报错
返回的结果是:
`{name: "jack", _city: {id: null, name: ""}}`
