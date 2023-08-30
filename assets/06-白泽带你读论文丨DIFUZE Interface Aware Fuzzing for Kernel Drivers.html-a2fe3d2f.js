import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{r as i,o as t,c as o,a as e,b as r,e as s,d as c}from"./app-cdabc73c.js";const l="/assets/640-1691486651831-357-0b3160b0.jpeg",g="/assets/640-1691486651832-358-9a6d3797.jpeg",d={},f=e("h1",{id:"_06-白泽带你读论文丨difuze-interface-aware-fuzzing-for-kernel-drivers",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_06-白泽带你读论文丨difuze-interface-aware-fuzzing-for-kernel-drivers","aria-hidden":"true"},"#"),r(" 06-白泽带你读论文丨DIFUZE: Interface Aware Fuzzing for Kernel Drivers")],-1),z=e("p",null,"DIFUZE: Interface Aware Fuzzing for Kernel Drivers",-1),p={href:"https://github.com/sslab-gatech/deadline",target:"_blank",rel:"noopener noreferrer"},h=c('<p>本文发表在<strong>CCS 2017</strong>，第一作者是来自圣塔芭芭拉大学的Jake Corina。本文的第七作者是来自圣塔芭芭拉大学的Giovanni Vigna。他的团队主要从事漏洞分析，web安全，固件分析，移动平台安全等研究，发表了多篇与安全相关的论文。</p><h2 id="主要内容" tabindex="-1"><a class="header-anchor" href="#主要内容" aria-hidden="true">#</a> <strong>主要内容</strong></h2><p>操作系统内核通过<strong>驱动程序</strong>来管理众多物理设备，而驱动程序多由第三方厂商提供，这些驱动程序也存在着不少的漏洞。<strong>第三方驱动程序</strong>由于定制化，在传输数据的过程中普遍使用自定义的结构体，导致驱动程序输入数据类型结构非常复杂、输入的各个部分约束很强。<strong>ioctl函数</strong>作为管理用户态与内核驱动程序交互的枢纽，也具备上述各种特征。通过ioctl函数可能触发不少漏洞，同时ioctl函数也经常处理复杂、约束强的输入。然而，现有工作对于这样的情况很难处理。不论是利用污点分析还是利用反馈机制的fuzzing工具，在对ioctl()函数的fuzzing上都不能体现出较好的效果，而专门针对kernel的fuzzing工具也没有处理ioctl()接口这样复杂的情况。</p><p>在这个工作中，作者设计并完成了<strong>针对用户态与内核驱动关键接口ioctl()的fuzzing工具DIFUZE</strong>。作者的思路是首先对内核代码进行静态分析，完成interface的recovery，获取interface的关键信息，并基于这些有效的信息去生成更加合理的fuzzing输入，得到一个更好的fuzzing效果。</p><h2 id="主要思路" tabindex="-1"><a class="header-anchor" href="#主要思路" aria-hidden="true">#</a> <strong>主要思路</strong></h2><p>为了完成高效率的fuzzing，我们要求工具产生的输入尽可能的合理，符合接口的规范，因此最重要的工作是我们需要获取到接口输入的有效信息，获取接口允许的输入格式，允许的配对的参数类型。为了完成这个工作，我们需要三类信息来完成对接口输入信息的描述与规范：</p><p><strong>1. Device name</strong></p><p><strong>2. command</strong></p><p><strong>3. command</strong></p><p>可对应的结构体类型。获取到device name我们就能知道device的path等信息；获取到一个device支持的command种类和每种command可能对应的若干结构体，我们就能去构造合理的输入完成对特定device接口的fuzzing。</p><h2 id="设计实现" tabindex="-1"><a class="header-anchor" href="#设计实现" aria-hidden="true">#</a> <strong>设计实现</strong></h2><figure><img src="'+l+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>处理流程</p><p>工具的整个处理流程如上图所示，其中最关键的是interface recovery。<strong>interface recovery</strong>主要包含以下步骤：</p><ol><li>使用GCC及LLVM编译kernel，用于静态分析</li><li>识别驱动为处理交互创建的ioctl_handler函数</li><li>在ioctl_handler函数中分析出设备名信息</li><li>使用Range Analysis搜索判等表达式识别出command常量</li><li>追踪接受了用户态参数的copy_from_user等方法，找到command可以对应的结构体名称，为所有command建立结构体对应表</li><li>搜索整个kernel代码找到所有有效结构体的定义，并转换格式，记录在xml中</li></ol><p>通过interface recovery后，作者能够利用这样有效的信息去生成有效合理的输入，利用已有的优秀kernel fuzzing工具<strong>Syzkaller</strong>和作者完成的一个简单的工具<mark>MangoFuzz</mark>在流行的安卓设备上进行fuzzing测试。当执行过程中出现设备卡住或重启时，我们认为触发了漏洞，并记录下触发漏洞相关的信息。</p><h2 id="实验" tabindex="-1"><a class="header-anchor" href="#实验" aria-hidden="true">#</a> <strong>实验</strong></h2><figure><img src="'+g+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>测试结果</p><p>作者在几大知名厂商的安卓手机上进行了测试。在基于Syzkaller工具的基础上，根据提供接口信息的多少分为若干个级别（从左往右依次是syzkaller base 不提供接口信息，syzkaller+path提供设备路径信息，DIFUZEi提供路径信息和command信息，DIFUZEs提供全部接口信息）进行验证; 同时也在自己的实现的简单的fuzzing 工具MangoFuzz上进行验证(DIFUZEm)，结果如上图所示。</p><p>可以看到，一般的fuzzer无法对ioctl()进行有效的fuzzing，而<strong>当给出的接口信息逐渐变多时，找到的漏洞数量也逐渐变多，效果也越好</strong>。对于Syzkaller 和Mango，两种fuzzer在漏洞的检测上表现出基本相同的效果。表明interface-aware 在fuzzing效果上起到决定性的作用。</p><h2 id="评价" tabindex="-1"><a class="header-anchor" href="#评价" aria-hidden="true">#</a> <strong>评价</strong></h2><p>经过验证，DIFUZE相较于现有的fuzz工具在ioctl()接口上，确实存在着明显的优势。这也是显然的，DIFUZE相较于其他的工具在fuzzing这样一个需要超大信息量的接口上提供了足够的信息，支撑它挖掘出大于其他工具几个数量级的信息量。</p><p>这个工具没有在fuzzing方法上进行优化，而是在fuzzing的对象上进行了详细的分析，完成了一个定制化的interface-aware的fuzzing，提供了一个优秀合理的seed生成，同样完成了较好的漏洞检测。这篇文章给我们提供了一个思路是除了优化fuzzing方法，优化seed 生成也可以显著提升fuzzing效果。</p>',24);function u(_,m){const n=i("ExternalLinkIcon");return t(),o("div",null,[f,z,e("p",null,[r("开源项目地址："),e("a",p,[r("https://github.com/sslab-gatech/deadline"),s(n)])]),h])}const b=a(d,[["render",u],["__file","06-白泽带你读论文丨DIFUZE Interface Aware Fuzzing for Kernel Drivers.html.vue"]]);export{b as default};
