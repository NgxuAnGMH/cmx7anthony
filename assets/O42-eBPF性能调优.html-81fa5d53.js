import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o as t,c as i,a as e,b as a,e as s,d as r}from"./app-cdabc73c.js";const c="/assets/f29f75cd0463cbfebe4bcb51fe26b7fd-c9730fee.jpg",l="/assets/90a7yy5cb28484accf70e728db45cf72-a8db51a5.jpg",d="/assets/3708eacc7748526eb296f25b78502b94-ed9b5ffe.jpg",u="/assets/f867e849f0d4edb531ed9c00defbf8ab-9284f875.jpg",m="/assets/821a839ef3c8de99108a984289c0bbba-b07f5af6.jpg",b="/assets/b43379b6bfdcd3c2eeb01c16a3c4b3b4-5fe29f98.png",h="/assets/348d5e0ca7d18d936198d7d83fec858f-7dc8afa3.jpg",k={},f=e("h1",{id:"_42-性能调优-性能调优工具ebpf和调优方法",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_42-性能调优-性能调优工具ebpf和调优方法","aria-hidden":"true"},"#"),a(" 42｜性能调优：性能调优工具eBPF和调优方法")],-1),P=e("p",null,"你好，我是 LMOS。",-1),B=e("p",null,"在之前的学习中，我们了解到了很多计算机基础相关的知识，也学过了 iostat 等观察系统运行状态的命令。但在我们的实际工程中，排查分析一些具体的性能优化问题或者定位一些故障时，可能需要在不同的命令间来回切换、反复排查。",-1),g=e("p",null,[e("u",null,"那么有没有一款工具可以贯穿操作系统的各个模块，帮我们准确分析运行的程序、系统的运行细节呢"),a("？当然有，答案就是 "),e("mark",null,"eBPF"),a("。")],-1),F=e("h2",{id:"从-bpf-到-ebpf",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#从-bpf-到-ebpf","aria-hidden":"true"},"#"),a(" 从 BPF 到 eBPF")],-1),_={href:"https://www.tcpdump.org/papers/bpf-usenix93.pdf",target:"_blank",rel:"noopener noreferrer"},v=r('<p>为了让内核态能够高效率地处理数据包，这套机制引入了<u>一套只有 2 个 32 位寄存器、16 个内存位和 32 个指令集的<mark>轻量级虚拟机</mark>，包过滤技术的性能因此提升了 20 多倍</u>。</p><p>因为这套方案设计的太好用了，后来在 1997 年的时候，Linux 操作系统从 Linux2.1.75 版本开始，就把 BPF 合并到了内核中了。</p><p>早期的 BPF 的架构是这样子的：</p><img src="'+c+'" alt="img" style="zoom:25%;"><p>（图片出自上述论文）</p><p>从这张架构图中我们可以看出，<em>当数据报文从<u>设备驱动(link-level driver)</u>上传输过来之后，首先会被分流到 <u>BPF(阴影单元)</u>，这时候 BPF 会执行<u>内部的过滤逻辑(filter)</u>处理数据报文</em>，当然这个处理逻辑也是可以灵活自定义的。</p><p>然后，BPF 就会把处理好的数据报文(借助<u>缓冲区buffer</u>中转)传给对应的用户程序。如果某些设备驱动发过来的数据, <em>找不到对应的 BPF 处理逻辑的话，则会由<u>正常的协议栈(protocol stack)</u>来处理</em>。</p><p>听完这段原理，你会不会觉得，<strong>这是一个只适合抓包分析网络数据的机制</strong>？</p><p>没错，早期的时候 BPF 机制，确实也是用在 <mark>tcpdump</mark> 之类的抓包分析工具上的。只是后来随着技术的发展，BPF 机制也有了升级扩展，不但加入了 <mark>JIT 即时编译技术</mark>来提升性能，还引入了如 <mark>Seccomp</mark> 之类的安全机制。</p><p>这么优秀灵活的机制只用来分析网络数据，未免大材小用。所以，后来 2014 年的时候 Alexei Starovoitov 和 Daniel Borkmann 沿着这条路，设计出了更强大的 eBPF 机制。</p><p>eBPF 不仅仅能实现传统的数据报文过滤，<em>还把自己变成了一个<u>运行在操作系统内核中的</u>沙盒，基于它可以在<u>不修改内核代码、不加载额外的内核模块的</u>前提下</em>，安全、高效地扩展内核的功能。有了它，我们就可以让<mark>自己的程序</mark>站在操作系统内核的“<code>上帝视角</code>”，<u>随时灵活地监控调整程序的运行状态，堪称神器</u>。</p><p>讲了这么多，有没有勾起你对 eBPF 的好奇？那么让我们先来看一下 eBPF 的架构简图吧：</p><img src="'+l+`" alt="img" style="zoom:33%;"><p>首先，我们编写好的 <mark>BPF 程序</mark>会被 <mark>Clang、LLVM 等工具</mark>编译成 <mark>BPF 的字节码</mark>（因为 BPF 程序并不是普通的 ELF 程序，<u>而是要运行在虚拟机中的字节码</u>）。eBPF 程序中还会包含<strong>配置的事件源</strong>，所谓事件源其实就是<strong>一些需要 hook 的挂载点</strong>。</p><p><mark>加载器</mark>会在程序运行前通过 <u>eBPF 系统调用</u> 加载到<mark>内核</mark>，这时候<mark>验证器</mark>会验证字节码的安全性，比如校验循环次数必须在有限时间内结束等。<em>当校验通过后，<u>一旦挂载的事件发生</u>，回调到你的<mark>字节码</mark>，就会在 <mark>eBPF 虚拟机</mark>中执行字节码中的逻辑了</em>。</p><h2 id="如何使用-ebpf" tabindex="-1"><a class="header-anchor" href="#如何使用-ebpf" aria-hidden="true">#</a> 如何使用 eBPF</h2><p>接下来我们说说怎么使用 eBPF。我们需要在 Ubuntu 20.04 系统上执行 <code>sudo apt-get install -y bpftrace</code> 命令安装 <mark>bpftrace</mark> 工具。</p><p>然后编写后面这段 man.go 测试代码：</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token keyword">package</span> main

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">println</span><span class="token punctuation">(</span><span class="token function">sum</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">sum</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token builtin">int</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> a <span class="token operator">+</span> b
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来，我们要执行 <code>go build -gcflags=“-l” ./main.go</code> 命令关闭内联优化编译代码。因为如果内联优化了的话，很可能 Go 的编译器会在编译期消除函数调用，这样我们的 eBPF 就会找不到函数对应的探针了。</p><p>下一步，我们使用 <mark>bpftrace</mark> 监控这个函数调用，就会发现下面的输出：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>shell<span class="token operator">&gt;</span> bpftrace <span class="token parameter variable">-e</span> <span class="token string">&#39;
    uprobe:./main:main.sum {printf(&quot;a: %d b: %d\\n&quot;, reg(&quot;ax&quot;), reg(&quot;bx&quot;))}
    uretprobe:./main:main.sum {printf(&quot;retval: %d\\n&quot;, retval)}
&#39;</span>
a: <span class="token number">3</span> b: <span class="token number">5</span>
retval: <span class="token number">8</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你看，我们写的代码一行都没改，eBPF 却帮我们把程序运行中的变量捕获出来了，是不是很神奇？那么 eBPF 是怎么实现这么神奇的功能的呢？这个问题，你听我讲完 eBPF 的原理就明白了。</p><h2 id="ebpf-的核心原理" tabindex="-1"><a class="header-anchor" href="#ebpf-的核心原理" aria-hidden="true">#</a> eBPF 的核心原理</h2><p>在讲解 eBPF 的原理之前，我们先来看看 eBPF 的整体架构图。根据架构图一步步了解核心原理。</p><p>eBPF 整体结构图如下：</p><img src="`+d+'" alt="img" style="zoom:50%;"><p>我们对照结构图分析一下 eBPF 的工作原理。</p><h3 id="_1-用户态-内核态" tabindex="-1"><a class="header-anchor" href="#_1-用户态-内核态" aria-hidden="true">#</a> 1 用户态 &amp; 内核态</h3><p>eBPF 分为两部分，分别是<strong>运行在用户空间的程序</strong>和<strong>运行在内核空间的程序</strong>。</p><ol><li><strong>用户空间程序</strong>负责把 <u>BPF 字节码</u> (通过<mark>用户态的加载器</mark>、再经过<mark>内核态的验证器</mark>)<br><u>加载到</u><strong>内核空间的 eBPF 虚拟机</strong>中，并在需要的时候<u>读取内核返回的各种事件信息、统计信息</u>；</li><li>而<strong>内核中的 BPF 虚拟机</strong>负责<em>执行和监控<u>内核中的特定事件</u></em>，<br><u>如果需要传递数据</u>，就将执行结果通过 <mark>BPF map</mark> 或 <mark>perf 缓冲区中的 perf-events</mark> <u>发送至用户空间</u>。</li></ol><h3 id="_2-通过bpf-map双向通信" tabindex="-1"><a class="header-anchor" href="#_2-通过bpf-map双向通信" aria-hidden="true">#</a> 2 通过BPF-Map双向通信</h3><p>那这两部分是怎么“沟通”的呢？两者可以使用 <mark>BPF map 数据结构</mark>实现<em>双向的数据通信</em>（上图右下角的 BPF MAP），这为<mark>内核中运行的 BPF 字节码程序</mark><em>提供了更灵活的控制能力和数据交换能力</em>。</p><h3 id="_3-内核中-自定义程序如何编织内核代码" tabindex="-1"><a class="header-anchor" href="#_3-内核中-自定义程序如何编织内核代码" aria-hidden="true">#</a> 3 内核中：自定义程序如何编织内核代码</h3><p><em>内核中</em><mark>用户空间程序</mark>与 <mark>BPF 字节码</mark>交互的主要过程是这样的：</p><ol><li>首先，我们可以使用 <strong>LLVM 或 GCC 工具</strong>，将程序从 <mark>BPF 代码</mark>编译为 <mark>BPF 字节码</mark>。</li><li>然后我们通过 <mark>Loader 加载器</mark>，将字节码加载到内核中。</li><li>内核使用<mark>验证组件</mark>，是用来保证执行字节码的安全性，避免内核异常的。</li><li><em>在确认字节码安全执行后</em>，<mark>加载器</mark>会加载<u>相应的内核模块</u>。</li></ol><h3 id="_4-bpf程序类型" tabindex="-1"><a class="header-anchor" href="#_4-bpf程序类型" aria-hidden="true">#</a> 4 BPF程序类型</h3><p>BPF 程序的类型包括：kprobes、uprobes、tracepoint、perf_events 几种，具体含义如下：</p><ol><li><code>kprobes</code>：是一种<strong>在内核中实现动态追踪</strong>的机制，<br> 可以跟踪 <u>Linux 内核中的函数<em>入口或返回点</em></u>， <ul><li>但这套 ABI 接口并不稳定。</li><li>不同的内核版本的变化带来的 ABI 差异，有可能会导致跟踪失败。</li></ul></li><li><code>uprobes</code>：用来实现<strong>用户态程序 动态追踪</strong>的机制。<br> 与 kprobes 类似，区别在于跟踪的函数是<u>用户程序中的函数</u>而已。</li><li><code>tracepoints</code>：内核中的<strong>静态跟踪</strong>。Tracepoints 是内核开发者维护的 tracepoint， <ul><li>可以提供稳定的 ABI 接口，<br> 但是由于开发者维护，数量和场景可能会受到限制。</li></ul></li><li><code>perf_events</code>：<strong>定时采样</strong>处理器中的性能监控计数寄存器（Performance Monitor Counter）。</li></ol><p>所以看到这里，你可能看出门道了，原来 eBPF 能用上帝视角观察各种程序，关键就在于“<code>内核中有自己人</code>”。</p><p>eBPF 虚拟机则是相当于<code>一个在内核中的、安全的“后门”</code>，而在虚拟机上运行的 BPF 字节码程序可以使用 <strong>BPF map 数据结构和 perf-event</strong> 这两种机制，将测量数据“偷偷”传递到用户空间。</p><h2 id="ebpf-还能应用在哪里" tabindex="-1"><a class="header-anchor" href="#ebpf-还能应用在哪里" aria-hidden="true">#</a> eBPF 还能应用在哪里？</h2><p>由于 eBPF 强大的扩展能力，目前业界已经有很多项目用它来实现生产环境中的<em>观测、调试、性能优化、动态扩展等</em>功能了。</p><p>我们都知道，开源项目是工程师的技术学习宝藏，通过学习开源项目，我们可以学习到业界最前沿的工程应用实战思路。接下来我就给你介绍一些基于 eBPF 的优秀开源项目吧。</p><h3 id="cilium" tabindex="-1"><a class="header-anchor" href="#cilium" aria-hidden="true">#</a> Cilium</h3><p>Cilium 是一个为 Kubernetes 集群和其他容器编排平台等云原生环境提供网络、安全和可观察性的开源项目。</p><p>Cilium 的基础当然也是 eBPF 啦，它能够将安全逻辑、可见性逻辑和网络控制等逻辑动态插入 Linux 内核，十分强大。基于这些扩展出的内核能力，Cilium 可以提供像高性能网络、多集群和多云能力、高级负载平衡、透明加密、网络安全能力、透明可观察性等很多能力。</p><p>看到这里，可能熟悉后端的小伙伴就好奇了：“我们明明也可以用 Wireshark、tcpdump 之类的工具来分析网络，也可以基于 K8S 的 Pod 机制，轻松实现 Sidecar 架构模式，以此透明地扩展容器的功能，那么我们为什么还要用 Cilium 呢？”</p><p>其实，在现代分布式系统架构中，不仅仅有传统的 TCP 协议、HTTP 协议，<em>还会引入像 GRPC、QUIC 等比较新的协议</em>。同时，随着分布式系统规模的增加，<em>会引入很多类似于 Kafka、Elasticsearch、Redis 之类的各种中间件</em>，<u>这也使得传统的抓包分析工具越来越捉襟见肘</u>。</p><p>基于 Pod 的 Sidecar 架构模式中容器本质也是运行在用户态的进程，所以免不了增加用户态 / 内核切换、拷贝等操作带来的开销。</p><p>而 Cilium 则是<u>基于 eBPF，直接把这些逻辑动态的扩展到了内核中，所以性能会远高于传统的方法</u>，你可以对照下面的架构图看一看。</p><img src="'+u+'" alt="img" style="zoom:25%;"><p>从图中我们可以看得出，Cilium 使用了 eBPF 机制，<u>在 Linux 内核中直接扩展出了<em>对容器中的各种网络协议的观测能力</em></u>。这样既实现了高性能对系统进行观测，<strong>又扩展更多字节码程序，进而支持更多种类的协议</strong>。</p><h3 id="falco" tabindex="-1"><a class="header-anchor" href="#falco" aria-hidden="true">#</a> Falco</h3><p>你听说过“容器逃逸”这种黑客攻击手段么？这种攻击手法可以让运行在容器沙盒中的恶意程序跳出沙盒攻击到宿主机中，从而实现突破限制、获得更高的权限的目的。比如著名的 CVE-2019-5736、CVE-2019-14271、脏牛等就是典型的容器逃逸漏洞。</p><p>如果你对容器的了解还不深入，可能觉得奇怪。容器不是类似于一台“虚拟机”么？不是说容器内外是隔离的，容器内的操作不会影响容器外么？那这类逃逸的攻击方式又要怎么防御呢？</p><p>其实，<u>每一个运行中的容器只是同一个宿主机上不同的进程</u>，特殊的地方是用 namespace、cgroup、UnionFS 之类的技术手段，<u>给容器中的每个进程创造出一种独占一台机器的假象</u>。</p>',57),x=e("em",null,"但实际上他们都共用了同一套操作系统内核",-1),w={href:"https://time.geekbang.org/column/article/408927",target:"_blank",rel:"noopener noreferrer"},C=r('<p>那么这类问题是不是就无解了呢？显然不是，Falco 这个项目就是为解决这类安全问题而生的。</p><img src="'+m+'" alt="img" style="zoom:25%;"><p><strong>Falco 的核心思想是，把自己定位成<u>一个嵌入到 Linux 内核中的监控摄像头</u>，实时监控各种 Linux 系统调用的行为，并根据<u>其不同的调用、参数及调用进程的属性</u>来触发警告</strong>。</p><p>Falco 可以检测的范围非常广，比如：</p><ol><li><p>容器内运行的 Shell</p></li><li><p>服务器进程产生意外类型的子进程</p></li><li><p>敏感文件读取（如 /etc/shadow）</p></li><li><p>非设备文件写入至 /dev</p></li><li><p>系统的标准二进制文件（如 ls）产生出站流量</p></li></ol><p>有了这些能力之后，Falco 就可以根据安全策略，来决定什么时候是安全的行为，什么时候是异常的攻击行为，从而做到防患于未然，提升系统的安全性。</p><h3 id="ebpf-for-windows" tabindex="-1"><a class="header-anchor" href="#ebpf-for-windows" aria-hidden="true">#</a> eBPF for Windows</h3>',7),L={href:"https://cloudblogs.microsoft.com/opensource/2021/05/10/making-ebpf-work-on-windows/",target:"_blank",rel:"noopener noreferrer"},y=r('<p>这个设计也是比较巧妙的，eBPF 工具链编译出的字节码，首先会发到用户态的静态验证器来进行验证。当验证字节码通过了验证之后，就会被加载到 Windows NT 内核中，这时候，eBPF 程序就可以 hook 调用 eBPFshim 模块来提供暴露的各种 API 了。这样，Windows 系统也就拥有了 eBPF 的强大的动态扩展能力了。</p><p>整个过程如下图所示:</p><img src="'+b+'" alt="img" style="zoom:80%;"><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾" aria-hidden="true">#</a> 重点回顾</h2><p>今天我们学习了 eBPF 的形成历史、设计思想和核心原理。了解了 eBPF 是怎么做到像乐高积木一样，灵活动态地扩展内核功能。另外，我还给你分享了 eBPF 在业界比较优秀的开源实践项目。</p><p>这节课的要点我梳理了导图，供你参考。</p><figure><img src="'+h+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>如果今天讲的内容你只能记住一件事，那请记住：<em>eBPF 是如何把“自己人”送进内核，最终和“自己人”里应外合、传递各种信息的思路</em>。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题" aria-hidden="true">#</a> 思考题</h2><p>请你思考一下，eBPF 如果被误用，有没有可能带来新的安全问题呢？</p><p>期待你在留言区和我交流互动，也推荐你把这节课，分享给更多朋友。</p><blockquote><p>eBPF有访问内核的权限，如果被误用，后果不堪设想，所以要谨慎合理的使用eBPF。<br> 作者回复: 是的 很危险</p><hr><p>eBPF 对系统有侵入性吗，是类似于Agent技术么<br> 作者回复: 有啊</p><hr><p>eBPF通过安全认证等尽可能排除无用的干扰，但问题是也增加了复杂度。<br> 也就是eBPF应该在关键时候用，而不是频繁的滥用。滥用容易增加系统的复杂度！技术是中性的，有时解决一个问题也容易增加新的问题！越复杂就越容易出错，普通电脑大不了关机重启，但是对数据库电脑，应该是能减则减。性能和稳定兼顾（就比如双11数据库电脑哪怕停几分钟就是大损失）<br> 作者回复: 是的，你学到了</p><hr><p>请教老师两个问题：<br> Q1：BPF比协议栈还优先获取数据报吗？<br> 文中有“当数据报文从设备驱动上传输过来之后，首先会被分流到 BPF”，从这句话看，数据先到BPF，然后到协议栈，是这样吗？</p><p>Q2：协议栈会不处理数据吗？<br> 文中有“如果某些设备驱动发过来的数据, 找不到对应的 BPF 处理逻辑的话，则会由正常的协议栈来处理。”，<br> 从这句话看，如果BPF处理，则协议栈就不处理，是这样吗？（我的理解是：协议栈肯定要处理，BPF是<br> 辅助处理的<br> 作者回复: Q1：是的<br> Q2 有ebpf 处理 栈议栈就不会处理了</p></blockquote>',12);function S(q,A){const n=p("ExternalLinkIcon");return t(),i("div",null,[f,P,B,g,F,e("p",null,[a("eBPF 是怎么来的，还要从 1992 年说起。当年伯克利实验室的 Steven McCanne 和 Van Jacobso 为了解决高性能的抓包、分析网络数据包的问题，在 BSD 操作系统上设计出了一种叫做伯克利数据包过滤器（BSD Packet Filter）的机制，并发表了《The BSD Packet Filter:A New Architecture for User-level Packet Capture》这篇论文（"),e("a",_,[a("论文链接在这里"),s(n)]),a("）。")]),v,e("p",null,[a("这意味着运行在同一台机器上的每个容器，虽然从表面上看他们是互相隔离的，"),x,a("。这也就为容器安全埋下了隐患。容器实现机制的更多内容，你有兴趣的话，可以看看第一季里"),e("a",w,[a("第四十四节课"),s(n)]),a("的讲解。")]),C,e("p",null,[a("微软也发现了 eBPF 的强大功能和潜力，"),e("a",L,[a("在2021 年 5 月的时候微软也发布了 eBPF for Windows这个项目"),s(n)]),a("，用于在 Windows 10 和 Windows Server 2019 或者之后的版本上支持运行 eBPF 程序。")]),y])}const I=o(k,[["render",S],["__file","O42-eBPF性能调优.html.vue"]]);export{I as default};
