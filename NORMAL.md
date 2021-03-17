##  样式
### 模板布局、样式命名
```
模板命名样式命名
<template>
    <div>
        
        <!-- search-pannel  是搜索面板 -->
        <div class="search-pannel">
            ·····
        </div>
        
        <!-- main-container 是包裹table面板的层，用于 main-pannel 超出时，显示滚动条 -->
        <div class='main-container-search'>
        
            <!-- mian-pannel  是table面板 -->
            <div class="mian-pannel">
                ······
            </div>

        </div>
    </div>
<template>
```

## 样式说明
```
<!-- 
    搜索面板的样式  统一为  search-pannel
 -->
.search-pannel{
    xxxxx
}

<!-- 
    内容包裹层   统一为  main-pannel
 -->
.main-pannel{
    xxxxx
}

<!-- 
    mian-conteiner  是包裹右侧内容（template）的区块,此类的
 -->
.mian-container{
    height: calc(100vh -  84px);   //   84px = 64-20;    header的高度和 内容的padding值
    background: white;
    overflow-y: auto;
}


<!-- 
    mian-container-search  包裹层  是用于  有搜索的情况
 -->

.mian-container-search{
    height: calc(100vh -  168px);   //   84px = 64-30-74;header的高度和 内容的padding值-搜索面板的高度
    background: white;
    overflow-y: auto;
}
```

>  注意： 在模板里面的样式 一定要加   scoped



#  路由与模板命名
>  原则上路由和模板名称一致，最好能做到和接口名一致，方便查找

```
<!-- 
    
 -->
```


