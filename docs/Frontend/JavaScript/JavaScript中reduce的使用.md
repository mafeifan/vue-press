## reduce() 方法

reduce 方法是对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。

reducer 函数接收4个参数:

* Accumulator (acc) (累计器)
* Current Value (cur) (当前值)
* Current Index (idx) (当前索引)
* Source Array (src) (源数组)

## 语法

`arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])`


## 举例

1. 计算数组中每个元素出现的次数
```javascript
let names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

let nameNum = names.reduce((res, cur)=>{
    if (cur in res){
        res[cur]++
    } else{
        res[cur] = 1 
    }
    return res
},{})


// { Alice: 1 }
// { Alice: 1, Bob: 1 }
// { Alice: 1, Bob: 1, Tiff: 1 }
// { Alice: 1, Bob: 1, Tiff: 1, Bruce: 1 }
// { Alice: 2, Bob: 1, Tiff: 1, Bruce: 1 }


// {Alice: 2, Bob: 1, Tiff: 1, Bruce: 1}
console.log(nameNum); 
```

2. 对象里的属性求和
```javascript
var result = [
    {
        subject: 'math',
        score: 10
    },
    {
        subject: 'chinese',
        score: 20
    },
    {
        subject: 'english',
        score: 30
    }
];

var sum = result.reduce(function(prev, cur) {
    return cur.score + prev;
}, 0);

console.log(sum) // 60
```

3. 来个稍微复杂的例子

已知,源数据，三列分别表示 中心编号，受试者代码，受试结果

```
var data = [
  ['CHN001', 'CHN001014', true ],
  ['CHN002', 'CHN002001', true ],
  ['CHN002', 'CHN002001', false ],
  ['CHN002', 'CHN002002', true ],
  ['CHN002', 'CHN002002', false ],
  ['CHN002', 'CHN002003', true ],
  ['CHN002', 'CHN002004', true ],
  ['CHN002', 'CHN002005', true ],
  ['CHN002', 'CHN002007', false ],
  ['CHN002', 'CHN002008', false ],
  ['CHN003', 'CHN003001', true ],
  ['CHN003', 'CHN003001', false ],
  ['CHN005', 'CHN005001', true ],
  ['CHN005', 'CHN005001', false ],
  ['CHN005', 'CHN005002', true ],
  ['CHN005', 'CHN005003', true ],
  ['CHN005', 'CHN005004', true ],
  ['CHN007', 'CHN007001', true ],
  ['CHN007', 'CHN007001', false ],
  ['CHN007', 'CHN007001', false ],
  ['CHN007', 'CHN007002', true ],
  ['CHN007', 'CHN007003', true ],
  ['CHN007', 'CHN007003', false ],
  ['CHN007', 'CHN007004', true ],
  ['CHN007', 'CHN007004', true ],
  ['CHN007', 'CHN007004', false ],
  ['CHN007', 'CHN007007', true ],
  ['CHN007', 'CHN007008', true ],
  ['CHN007', 'CHN007009', false ]
]
```

**要求：**
按照，中心编号和受试者代码分组，
比如 CHN005 下面包含了4个受试者，为CHN005001，CHN005002，CHN005003，CHN005004
```
  ['CHN005', 'CHN005001', true ],
  ['CHN005', 'CHN005001', false ],
  ['CHN005', 'CHN005002', true ],
  ['CHN005', 'CHN005003', true ],
  ['CHN005', 'CHN005004', true ],
```
CHN005001 下面又有两条记录，只有同时都是true，才按累加1处理
```
  ['CHN005', 'CHN005001', true ],
  ['CHN005', 'CHN005001', false ],
```
所以 CHN005001 为0
CHN005002，CHN005003，CHN005004都为1，最终

CHN005结果 为3

**期望输出结果：**
```
"CHN001"	"1"
"CHN002"	"3"
"CHN005"	"3"
"CHN007"	"4"
```

求解：

```
function computeScore(list) {
  const results = list.reduce((res, [no,code,result]) => {
    res[no] = res[no]||{};
    res[no][code] = (typeof res[no][code] == 'undefined' ? true : res[no][code])&&result;
    return res;
  }, {});
  
  return Object.keys(results).reduce((res,key) => {
    res[key] = Object.values(results[key]).reduce((acc,bol) => acc+bol,0)
    return res;
  }, {})
}
```

第一步消重
第二步累加个数
