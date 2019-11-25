module.exports = {
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
          // {text: 'React', link: '/React/'}
        ]
      },
      {
        text: 'Backend',
        items: [
          {text: 'Laravel', link: '/Laravel/'},
        ]
      },
      {
        text: 'WOW',
        items: [
          {text: '游戏', link: '/_WOW/'},
          {text: '截图', link: '/_WOW/screenshots/'},
          {text: '德鲁伊', link: '/_WOW/Druid/'},
        ],
        link: '/_WOW/'
      },
      {
        text: 'Demo',
        link: '/_DEMO/'
      },
      {text: 'Home', link: '/'},

    ],
    sidebar: {
      '/HTML5/': [
        ['CSS3实现未知宽高元素的垂直居中和水平居中', 'CSS3 实现未知宽高元素的垂直居中和水平居中'],
        ['巧解checkbox未选中不提交数据', '巧解checkbox未选中不提交数据'],
      ],

      '/Laravel/': [
        '',
        ['Model/Laravel-model-tips.md', 'Model/使用技巧'],
        ['Model/Laravel-Fix-non-object.md', 'Model/避免 Trying to get property of non-object 错误的几种方法'],
        ['Model/Laravel-useful-attribute.md', 'Model/模型常用属性'],
        ['Laravel-echo构建实时应用.md', 'Laravel-echo构建实时应用'],
        ['Doc/Laravel-事件的使用.md', 'Laravel-事件的使用'],
        ['Doc/Laravel-使用简单的方法跟踪用户是否在线.md', 'Laravel-使用简单的方法跟踪用户是否在线'],
        ['Doc/Laravel-实现多语言切换.md', 'Laravel-实现多语言切换'],
      ],

      // fallback
      '/': [
        '',        /* / */
        'HTML5',
        'Laravel'    /* /about.html */
      ]
    }
  }
};
