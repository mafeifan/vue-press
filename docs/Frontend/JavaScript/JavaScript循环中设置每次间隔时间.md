1. 使用setTimeout
```
for(let i = 0 ; i < 5 ; i++){
  setTimeout(function(){
    console.log(i);
  }, i * 1000);
}
```


2. 结合promise写法
```
function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

for(let i = 0 ; i < 5 ; i++){
  sleep(i * 1000).then(() => {
    console.log(i);
  })
}
```
