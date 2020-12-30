# d3_pro
# 						起点小说数据统计

## 简介

本项目用于起点小说中文网的小说月票排行统计与展示，主要分为两部分：数据获取和数据展示。

**数据获取**：为python爬虫爬取起点中文网的小说排行榜及各个小说的详细信息，生成JSON格式文件保存相关数据。目前只取前一百名使用。

**数据展示**：基于d3.js（v6版本）的前端页面，主页面包括：小说排名的条形图、每本小说的详细信息旭日图、百本小说词云展示、小说搜索功能；



## 具体实现

### 数据爬虫：

主要为xpath和beautiful soup，获取起点小说月票排行榜页面https://www.qidian.com/rank/yuepiao?page=1，改变page值切换页面，获取五页一百本小说数据，同时针对反爬虫的字体问题，根据对应链接去下载字体后再映射为正常数据。保存为json文件，格式如下

```
{
	"rank": "1",
    "name": "万族之劫",
    "author": "老鹰吃小鸡",
    "types": "都市",
    "status": "连载",
    "intro": "我是这诸天万族的劫...！",
    "update": "最新更新 第748章 陨落如雨（求订阅）",
    "date": "2020-11-10 11:36",
    "tickets": "42602"
}
```

对于小说具体信息，进入每本小说的详情页面，获取打赏推荐、粉丝榜、标签、作家信息和基本信息五方面数据保存生成json文件。格式如下：

```
{
        "name": "书籍信息",
        "children": [
            {
                "name": "基本信息",
                "children": [...]
            },
            {
                "name": "标签",
                "children": [...]
            },
            {
                "name": "粉丝榜",
                "children": [...]
            },
            {
                "name": "作家信息",
                "children": [...]             
            },
            {
                "name": "打赏推荐",
                "children": [...]
        
    },
```



### 前端页面：

主要为d3.v6.js与原生JS，包括两个d3的插件：**d3.layout.cloud.js**和**d3-v6-tip.js**，分别用于词云和标签展示，css部分使用了bulma框架（仅用于部分）和font-awesome.css（用于图标和部分元素）



## 示例

**Demo**演示：http://101.37.12.39/

![image-20201230134228161](.\image\image-20201230134228161.png)

![image-20201230134349106](.\image\image-20201230134349106.png)



## 运行环境

- 开发语言：python3、JS
- 系统：Windows



## 使用说明与环境

1. pip install 安装python所需环境

   ```
   pip install -r requirements.txt
   ```

   

2. 通过运行GetData\spider\get_qidian.py生成所需的json数据

3. 导入json数据到gallery文件目录下并覆盖

4. 打开index.html即可
