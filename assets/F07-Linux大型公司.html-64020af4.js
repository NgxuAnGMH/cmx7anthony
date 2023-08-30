import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{o as d,c as r,d as e}from"./app-cdabc73c.js";const a={},o=e('<h1 id="linux系统-大型公司" tabindex="-1"><a class="header-anchor" href="#linux系统-大型公司" aria-hidden="true">#</a> Linux系统 - 大型公司</h1><table><thead><tr><th>大型公司</th><th>操作系统</th><th>解释</th></tr></thead><tbody><tr><td>老板元老</td><td>系统内核</td><td>系统启动时就诞生了祖宗进程</td></tr><tr><td>管理手段</td><td>内核数据结构</td><td>内核通过一系列数据结构管理各个部分</td></tr><tr><td>BIOS</td><td>创业指导手册</td><td>只读的, 任何一个运行在(符合标准的)架构平台上的操作系统, <br>都会先执行 BIOS(基本输入输出系统) 里的程序.</td></tr><tr><td>客户对接员</td><td>输入设备驱动</td><td>输入设备对应客户需求</td></tr><tr><td>结果交付员</td><td>输出设备驱动</td><td>输出设备对应交付形式</td></tr><tr><td>项目计划书</td><td>软件程序</td><td>本地文件中的代码程序, 可以是高级语言的文件格式 .java .go<br> (经编译转化成二进制文件/可执行文件)</td></tr><tr><td>统一办事厅</td><td>系统调用</td><td>可以区分用户态/内核态 - <br>项目(找老板元老)请求公司资源(系统内核)的统一入口</td></tr><tr><td>停下来处理</td><td>中断</td><td>中断事件中断信号中断门, 系统调用是通过发送中断进行</td></tr><tr><td>Glibc中介</td><td>系统级库</td><td>系统调用的整合封装</td></tr><tr><td>项目执行中</td><td>进程</td><td>最初始需要加载[LOAD代码段数据段]: <br>来自二进制&amp;可执行文件/PE/ELF/Mach-O/JVM字节码 <br>(稍微区分执行器: 1原生操作系统 2独立的虚拟机)<br>而后随着程序运行时/动态地扩展和收缩:<br> [VAS 虚拟地址空间] [堆] [共享库数据/动态静态链接] [栈]</td></tr><tr><td>项目分步走</td><td>线程</td><td>分步走 <br>1. 可以是一步接一步顺序进行 <br>2. 也可以是分成多步同时进行</td></tr><tr><td>独立的空间</td><td>VAS 虚拟地址空间</td><td>[低] 1LOAD代码段数据段 2线程共享堆 3共享库数据/动态静态链接 <br>4 线程私有栈 5只读的内核数据&amp;加速系统调用 6内核管理的数据结构 [高]</td></tr><tr><td>项目管理部</td><td>进程管理系统</td><td>对执行中的项目(进程)进行生命周期和资源管理</td></tr><tr><td>会议室管理</td><td>内存管理系统</td><td>对执行中的项目(进程)使用的会议室(内存)进行管理分配回收隔离</td></tr><tr><td>资料档案库</td><td>文件管理系统</td><td>不同介质不同格式 ---&gt; <br>对公司所有项目(程序)使用的文档资料(文件)进行管理</td></tr><tr><td>对外合作部</td><td>网络通信系统</td><td>和其他公司(Linux主机)合作沟通项目(进程通信) - <br>网络协议栈和收发网络包</td></tr></tbody></table><blockquote><p>线程不是进程的子集。进程是项目，线程是项目的执行。项目包含资源，也会有一个默认主线程来执行这个项目，也可以创建多个线程来执行这个项目</p></blockquote>',3),c=[o];function n(b,h){return d(),r("div",null,c)}const l=t(a,[["render",n],["__file","F07-Linux大型公司.html.vue"]]);export{l as default};
