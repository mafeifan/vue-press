## [Git：如何为项目设置自己的user name/email](https://www.cnblogs.com/larryzeal/p/5846858.html)

设置git全局设置：
git config --global user.name "your_name" 
 

git config --global user.email  "your_email"


针对每个项目，单独设置用户名和邮箱，设置方法如下：
git config user.name "your_name" 
git config user.email "your_email"


在项目根目录下查找  *.git/config* 。

打开，添加如下内容（值换成你自己的名字和邮箱）即可：

[user]
    name = Larry
    email = larry_zeal@163.com</pre>
