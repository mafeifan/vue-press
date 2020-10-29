当有大量的pipeline项目构建任务，有很多代码是重复的，这时需要提取和复用共同的逻辑。
其实pipeline本质就是一个Groovy脚本，所以可以在pipeline中自定义函数，并使用Groovy语言自带的特性。
比如下面的Jenkinsfile，我们自定义了一个 createVersion 函数，并使用了内置的Date类。
```groovy
pipeline {
    agent any
    
    stages {
        stage ('build') {
            steps {
                // 输出 201907-4
                echo "${createVersion(BUILD_NUMBER)}"
            }
        }
    }
}

def createVersion(String BUILD_NUMBER) {
    return new Date().format('yyyyMM') + "-${BUILD_NUMBER}"
}
```

还有一种更优雅的写法，将变量定义在environment内
```groovy
pipeline {
    agent any
    
    environment {
       _version = createVersion()
    }
    
    stages {
        stage ('build') {
            steps {
                echo "${_version}"
            }
        }
    }
}

def createVersion() {
    return new Date().format('yyyyMM') + "-${env.BUILD_NUMBER}"
}
```

#### 使用共享库
大致流程：
1. 新建个Groovy仓库，里面包含共享库代码

这里已经建好 [jenkins-shared-library](https://github.com/mafeifan/jenkins-shared-library)，文件结构如下：
> ![image.png](https://hexo-blog.pek3b.qingstor.com/upload_images/71414-3cbd29a376ce5773.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

vars 目录下的全局变量可以直接在pipeline中使用，即当写`sayHello('world')`，实际调用的是`sayHello.groovy`中的call函数

src 目录是标准的Java源码结构，目录中的类被称为类库(Library class)，而 `@Library('global-shared-library@master')` 就是一次性静态加载src目录下所有代码到classpath中。

::: tip
src目录中的类，可以使用Groovy中的@Grab注解，自动下载第三方依赖包
:::

2. Jenkins 管理后台配置仓库地址和版本等
进入 Jenkins 的Manage Jenkins -> Configure System -> Global Pipeline Libraries 配置页面

> ![image.png](https://hexo-blog.pek3b.qingstor.com/upload_images/71414-54128b9572a8a015.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


3. Jenkins 项目的pipeline中引入共享库(可以指定仓库版本和具体class)
新建一pipeline类型的job。
Pipeline内容如下:
```groovy
@Library('global-shared-library@master') _
pipeline {
    agent any
    
    environment {
       _version = createVersion()
    }
    
    stages {
        stage ('build') {
            steps {
                script {
                    def util = new com.mafeifan.Utils()
                    def version = util.createVersion("${BUILD_NUMBER}")
                    echo "${version}"
                    sayHello 'yes'
                    echo "${_version}"
                }
            }
        }
    }
}

def createVersion() {
    return new Date().format('yyyyMM') + "-${env.BUILD_NUMBER}"
}
```
查看构建日志，发现Jenkins首先拉取共享库代码，执行成功。
> ![image.png](https://hexo-blog.pek3b.qingstor.com/upload_images/71414-6ab66c2595a6266a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 使用共享库实现Pipeline模板
// vars/generatePipeline.groovy
```groovy
def call(String lang) {
  if (lang == 'go') {
    pipeline {
      agent any
       stages {
         stage ('set go path') {
            steps {
               echo "GO path is ready"
            }
         }
       }
    } 
  } else if (lang == 'java') {
    pipeline {
      agent any
       stages {
         stage ('clean install') {
            steps {
               sh "mvn clean install"
            }
         }
       }
    } 
  }
  // 其他语言
}
```

使用时，Jenkinsfile 只有两行
```groovy
@Library['global-shared-library'] _
generatePipeline('go')
```

如果大多数项目都是标准化的，可以利用共享库的pipeline模块技术来降低维护成本。

这里只是抛砖引玉，想写出更强大的共享库需要多了解Groovy。

::: tip
优先考虑使用自定义函数，如果此函数出现在了至少三个项目中，考虑移到共享库里，当发现项目的pipeline非常相似，考虑使用pipeline模块。
:::

### 参考
[https://jenkins.io/zh/doc/book/pipeline/shared-libraries/](https://jenkins.io/zh/doc/book/pipeline/shared-libraries/)
