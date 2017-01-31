---
layout:     post
title:      "撸Azure羊毛之Azure Search"
subtitle:   "论免费使用Azure Search为Jekyll提供全文搜索能力的正确姿势"
author:     "Hollis Yao"
header-img: ""
catalog: true
categories: 
    - Azure
published:  true   				# default true 设置 “false” 后，文章不会显示
tags:
    - Azure Search
    - Jekyll
---
> *2017年我最重要的目标之一就是**坚持**写博客。*

作为一个（自诩😝）全栈攻城狮，写博客这么一件稀松平常的事情，也不能写得太平常了。

首先，要构建一个适合Geeker的高逼格的个人博客，一定不是博客园、CSDN，也不是现在比较流行的简书。所以，在死了很多脑细胞之后，最终选定了Github+Jekyll，来构建高效、静态的独立个人站点，并且用最适合码字的Markdown书写。

当然，因为这是一个静态博客的平台，为了让它能有各种动态酷炫的效果，我也是操碎心了，虽然借用了别人的模板，但也是爬了各种坑，到最后，还添加了我需要的分类、搜索、草稿文章标识等功能。

然而，程序猿总是有点洁癖和强迫症的，lunr.js的搜索对中文的支持实在是不堪，在没有服务器端的支持下，只能对中文进行简单搜索，还是无法支持中文分词。转念一想，我软有一个这么强大的搜索服务，为什么不能做一个整合呢。再一研究，居然免费版也足够我使用，心动不如行动，于是乎，就有了我这第一篇博客。

#### Azure背景简述
Azure分为全球版和中国版，都有很多免费使用的方式，足够大家针对开发、测试和小型应用场景。以下渠道可以试用Azure：  
1. 全球版，免费注册，送200美金额度；中国版，一元注册试用账号，1500元人民币额度。  
2. MSDN订阅可以免费获取全球版25美金/月的额度。  
3. 微软员工可以免费获取全球版150美金/月的额度。  
目前Azure Search只在全球版Azure提供，将来也会进入中国。

#### 创建Azure Search服务
打开浏览器，输入portal.azure.com，进入Azure全球版管理门户，登陆之后，进入主界面，依次按照下图所示点击
![](/img/posts/Azure-Search-1.jpg)
在新建搜索服务输入相关信息，确保选中免费定价级别的服务即可，检查输入信息完毕之后，点击创建，稍等片刻，搜索服务即创建完成。
![](/img/posts/Azure-Search-2.jpg)

#### 准备要搜索的数据
为了让Azure Search能搜索全站的文章，我们必须把所有文章的数据集合到一个文件中。Jekyll有一个官方插件jekyll-feed，可以把所有文章用一个RSS形式整理起来，作为一个RSS订阅给用户使用。但是，这里面生成的RSS文件，对于文章正文内容只有摘要，没有全部内容，所以我们需要略微改写。参考了[all.xml](https://github.com/anthonychu/jekyll-azure-search-demo/blob/master/jekyll-rss-feed/all.xml "all.xml"),再根据我的博客配置情况作了修改：
1. 禁止了集成config.xml全局设置
2. 修正了两个bug

``` xml
---
layout: null #禁用掉全局模板页的设置, added by Hollis Yao
---

<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
	<channel>
		<title>{{ site.title | xml_escape }}</title>
		<description>{% if site.description %}{{ site.description | xml_escape }}{% endif %}</description>		
		<link>{{ site.url }}</link>
		<atom:link href="{{ site.url }}/feed/rss/" rel="self" type="application/rss+xml" />
		{% for post in site.posts %}
			<item>
				<title>{{ post.title | xml_escape }}</title>
			{% if post.author %}
				<dc:creator>{{ post.author | xml_escape }}</dc:creator>
			{% endif %}
				<description>{{ post.content | xml_escape }}</description>
				<pubDate>{{ post.date | date: "%a, %d %b %Y %H:%M:%S %z" }}</pubDate>
				<link>{{ site.url }}{{ post.url }}</link>
				<guid isPermaLink="true">{{ site.url }}{{ post.url }}</guid>
			{% for category in post.categories %}
				<category>{{ category }}</category>
			{% endfor %}
			</item>
		{% endfor %}
	</channel>
</rss>
```

要使用Azure Search，就必须先为它建立索引结构。
让我们先了解一下Azure Search
可通过两种方法在数据中填充索引。 第一种方法是使用 Azure 搜索 REST API 或 .NET SDK 将数据手动推送至索引。 第二种方法是将支持的数据源指向索引，让 Azure 搜索自动提取数据。


#### 将数据上传到Azure Search



#### 配置Azure Search










>参考资料：
>
>- [Add Search to a Jekyll Blog for Free with Azure Search](http://anthonychu.ca/post/add-search-to-jekyll-blog-free-azure-search/ "Add Search to a Jekyll Blog for Free with Azure Search")
