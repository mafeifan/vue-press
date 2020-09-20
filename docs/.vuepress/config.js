module.exports = {
  // https://v1.vuepress.vuejs.org/zh/plugin/official/plugin-medium-zoom.html#
  plugins: [
    [
      'vuepress-plugin-zooming',
      {
        delay: 500,
        options: {
          bgColor: 'black',
          zIndex: 10000,
        },
      },
    ],
  ],
  title: 'mafeifan 的技术博客',
  description: '生命在于试错和积累',
  port: '8099',
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  themeConfig: {
    lastUpdated: '上次更新',
    activeHeaderLinks: true,
    editLinks: true,
    docsDir: 'docs',
    editLinkText: '在 GitHub 上编辑此页',
    smoothScroll: true,  // 启用页面滚动效果
    // sidebar: 'auto',
    nav: [
      {
        text: 'DevOps',
        items: [
          {text: 'Jenkins', link: '/Jenkins/Jenkins2-学习系列1----使用Docker方式安装最新版Jenkins'},
          {text: 'Docker', link: '/Docker/Docker-学习系列1-使用-Docker-快速实现多版本PHP切换'},
          {text: 'Ansible', link: '/Ansible/Ansible-2----1-介绍与使用场景'},
          {text: 'Linux', link: '/Linux/SSH--技巧'}
        ]
      },
      {
        text: 'Frontend',
        items: [
          {text: 'Html & CSS', link: '/HTML5/'},
          {text: 'Javascript动画', link: '/Javascript-animate/'},
          {text: 'Angular', link: '/Angular/'},
          // {text: 'React', link: '/React/'}
        ]
      },
      {
        text: 'Backend',
        items: [{
          text: 'Laravel',
          items: [
            {text: 'Model', link: '/Laravel-model/Laravel-model-tips'},
            {text: '类库使用', link: '/Laravel-3rd-party/Laravel-常用第三方类库'},
            {text: '开发收集', link: '/Laravel-feature/Laravel-best-practices'},
          ]
        }],
      },
      /*
      {
        text: 'WOW',
        items: [
          {text: '截图', link: '/_WOW/screenshots/'},
        ],
        link: '/_WOW/'
      },
      */
      {
        text: 'Demo',
        link: '/_DEMO/'
      },
      {
        text: 'Home', link: '/'
      },
    ],

    sidebar: {
      '/Jenkins/': [
        ['Jenkins2-学习系列1----使用Docker方式安装最新版Jenkins', '1 使用Docker方式安装最新版Jenkins'],
        ['Jenkins2-学习系列2----Pipeline-介绍及基础', '2 Pipeline 介绍及基础'],
        ['Jenkins2-学习系列3----Groovy语法介绍', '3 Groovy语法介绍'],
        ['Jenkins2-学习系列4----Pipeline-post-部分', '4 Pipeline post 部分'],
        ['Jenkins2-学习系列5----Pipeline-中的指令', '5 Pipeline 中的指令'],
        ['Jenkins2-学习系列6----环境变量', '6 环境变量'],
        ['Jenkins2-学习系列7----构建工具', '7 构建工具'],
        ['Jenkins2-学习系列8----实战-使用-Generic-Webhook-Trigger-插件自动构建个人博客', '8 实战: 使用 Generic Webhook Trigger 插件自动构建个人博客'],
        ['Jenkins2-学习系列9----Generic-Webhook-Trigger-插件详讲', '9 Generic-Webhook-Trigger 插件详讲'],
        ['Jenkins2-学习系列10----多分支pipeline构建', '10 多分支pipeline构建'],
        ['Jenkins2-学习系列11----参数化构建', '11 参数化构建'],
        ['Jenkins2-学习系列12----创建和使用共享库', '12 创建和使用共享库'],
        ['Jenkins2-学习系列13----邮件和Slack通知', '13 邮件和Slack通知'],
        ['Jenkins2-学习系列14----使用-Config-File-Provider-添加邮件模板', '14 使用 Config-File-Provider 添加邮件模板'],
        ['Jenkins2-学习系列15----声明式Pipeline补充', '15 声明式Pipeline补充'],
        ['Jenkins2-学习系列16----Jenkins权限控制插件（Role-based-Authorization-Strategy）', '16 Jenkins权限控制插件(Role-based-Authorization-Strategy)'],
        ['Jenkins2-学习系列17----制品管理', '17 制品管理'],
        ['Jenkins2-学习系列18----凭证管理', '18 凭证管理'],
        ['Jenkins2-学习系列19----使用-Script-Console-批量修改Jenkins任务', '19 使用 Script-Console 批量修改Jenkins任务'],
        ['Jenkins2-学习系列20----通过SSH方法添加Slave节点', '20 通过SSH方法添加Slave节点'],
        ['Jenkins2-学习系列21----通过JNLP协议添加Slave节点', '21 通过JNLP协议添加Slave节点'],
        ['Jenkins2-学习系列22----pipeline-中-agent-使用介绍', '22 pipeline 中 agent 使用介绍'],
        ['Jenkins2-学习系列23----Jenkins-定期备份', '23 Jenkins 定期备份'],
        ['Jenkins2-学习系列24----Electron-应用的流水线设计', '24 Electron-应用的流水线设计'],
        ['Jenkins2-学习系列25----添加-Docker-Cloud-并构建镜像', '25 添加 Docker Cloud 并构建镜像'],
        ['Jenkins2-学习系列26----使用阿里云容器镜像服务', '26 使用阿里云容器镜像服务'],
        ['Jenkins2-学习系列27----pipeline-中-Docker-操作', '27 pipeline 中 Docker 操作'],
        ['Jenkins2-学习系列28----优化多分支流水线任务', '28 优化多分支流水线任务'],
        ['Jenkins2-学习系列29----安装指定版本插件', '29 安装指定版本插件'],
        ['Jenkins2-学习系列30----从Jenkins迁移到GitHub Actions', '30 从Jenkins迁移到GitHub Actions'],
        ['Jenkins-学习资源', 'Jenkins资源收集'],
        ['Jenkins-sh-step', 'Jenkins内置sh详讲'],
      ],

      '/Docker/': [
        ['Dockerfile-中的-COPY-与-ADD-命令', 'Dockerfile 中的 COPY 与 ADD 命令'],
        ['Docker-学习系列1-使用-Docker-快速实现多版本PHP切换', '1 使用-Docker-快速实现多版本PHP切换'],
        ['Docker-学习系列2--保存对容器的修改', '2 保存对容器的修改'],
        ['Docker-学习系列3--提交并分享自己的镜像', '3 提交并分享自己的镜像'],
        ['Docker-学习系列4---简单总结-docker-curriculum', '4 简单总结 docker-curriculum'],
        ['Docker-学习系列5--nginx-容器', '5 Nginx-容器'],
        ['Docker-学习系列6--Docker-Compose-中的环境变量使用注意事项', '6 Docker Compose 中的环境变量使用注意事项'],
        ['Docker-学习系列7-容器化Node项目', '7 容器化Node项目'],
        ['Docker-学习系列8-结合daocloud实现持续集成', '8 结合daocloud实现持续集成'],
        ['Docker-学习系列9-Docker的技术原理介绍', '9 Docker的技术原理介绍'],
        ['Docker-学习系列10-开源图形化管理系统', '10 开源图形化管理系统'],
        ['Docker-学习系列11-多阶段镜像构建', '11 多阶段镜像构建'],
        ['Docker-学习系列12-轻松实现-MySQL-主从同步', '12 轻松实现MySQL主从同步'],
        ['Docker-学习系列13-实现-基于pxc-的mysql-多节点主主同步', '13 实现基于pxc的mysql多节点主主同步'],
        ['Docker-学习系列14-使用haproxy实现mysql集群的负载均衡', '14 使用haproxy实现mysql集群的负载均衡'],
        ['Docker-学习系列15-Docker使用xdebug配合PHPStorm调试PHP', '15 Docker使用xdebug配合PHPStorm调试PHP'],
        ['Docker-学习系列16-使用过程的一些经验总结', '16 使用过程的一些经验总结'],
        ['Docker-学习系列17-镜像和容器的导入导出', '17 镜像和容器的导入导出'],
        ['Docker-学习系列18-关于PHP5-6', '18 关于PHP5.6'],
        ['Docker-学习系列19-容器化Angular项目', '19 容器化Angular项目'],
        ['Docker-学习系列20-工具推荐，dive--分析镜像层的工具', '20 工具推荐，dive--分析镜像层的工具'],
        ['Docker-学习系列21-配置远程访问Docker', '21 配置远程访问Docker'],
        ['Docker-学习系列22-Docker-Layer-Caching.md', '22 Docker-Layer-Caching.md'],
        ['Docker-学习系列23-推荐一款自动更新 Docker 镜像与容器的神器 Watchtower.md', '23 推荐一款自动更新 Docker 镜像与容器的神器 Watchtower'],
        ['Docker-及-docker-compose-使用总结', 'docker 及 docker-compose 使用总结'],
        ['Docker-学习资源', 'Docker 一些相关资源'],
      ],

      '/Ansible/': [
        ['Ansible-2----1-介绍与使用场景', '1 介绍与使用场景'],
        ['Ansible-2----2-安装与配置', '2 安装与配置'],
        ['Ansible-2----3-配置文件', '3 配置文件'],
        ['Ansible-2----4-常用模块及常用API', '4 常用模块及常用API'],
        ['Ansible-2----5-playbook-语法', '5 playbook 语法'],
        ['Ansible-2----6-playbook-管理', '6 playbook 管理'],
      ],

      '/Linux/': [
        ['SSH--技巧', 'SSH--技巧']
      ],

      '/HTML5/': [
        ['CSS3实现未知宽高元素的垂直居中和水平居中', 'CSS3 实现未知宽高元素的垂直居中和水平居中'],
        ['巧解checkbox未选中不提交数据', '巧解checkbox未选中不提交数据'],
        ['禁止内部元素的事件响应', '禁止内部元素的事件响应'],
      ],

      '/Javascript/': [
        ['说下js中的bind', '说下js中的bind']
      ],

      '/Angular/': [
        ['Angular-共享数据', 'Angular-共享数据']
      ],

      '/Laravel-core/': [
        ['Laravel-pipeline.md', 'Laravel Pipeline管道'],
        ['Laravel-tap.md', 'Laravel tap'],
      ],

      '/Laravel-feature/': [
        ['Laravel-best-practices.md', 'Laravel 开发最佳实践'],
        ['Laravel-translate功能.md', 'Laravel结合VueJs多语言处理'],
        ['Laravel-实现多语言切换.md', 'Laravel-实现多语言切换'],
        ['Laravel-记录邮件发送日志.md', 'Laravel-记录邮件发送日志'],
        ['Laravel-事件的使用1.md', 'Laravel-事件的使用1'],
        ['Laravel-事件的使用2.md', 'Laravel-事件的使用2'],
        ['Laravel-view-composers.md', 'Laravel 视图合成器的使用场景'],
        ['Laravel-collection.md', 'Laravel 集合与实例'],
        ['Laravel-使用简单的方法跟踪用户是否在线.md', 'Laravel-使用简单的方法跟踪用户是否在线'],
      ],

      '/Laravel-model/': [
        ['Laravel-model-tips.md', 'Laravel model使用技巧'],
        ['Laravel-Fix-non-object.md', '避免 Trying to get property of non-object 错误的几种方法'],
        ['Laravel-useful-attribute.md', '模型常用属性'],
        ['Laravel-Eloquent-提示和技巧.md', 'Eloquent提示和技巧'],
      ],

      '/Laravel-3rd-party/': [
        ['Laravel-常用第三方类库.md', 'Laravel-常用第三方类库'],
        ['Laravel-echo构建实时应用.md', 'Laravel-echo构建实时应用'],
        ['Laravel-mix.md', 'Laravel Mix介绍'],
        ['Laravel-snappy生成PDF', 'Laravel-snappy生成PDF'],
        ['Laravel-ingnition.md', 'Laravel Ignition介绍'],
        ['Laravel-multitenancy.md', 'Laravel 多租户解决方案'],
      ],

      // fallback
      '/': [
        '',
        ['/Jenkins/', 'Jenkins2系列'],
        ['/Javascript-animate/', 'Javascript动画'],
        ['/Docker/', 'Docker系列'],
        ['/HTML5/', 'HTML5&CSS3'],
        ['/Laravel/', 'Laravel系列'],
      ]
    }
  }
};
