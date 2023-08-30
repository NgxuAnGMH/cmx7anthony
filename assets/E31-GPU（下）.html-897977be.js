import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as m,o as s,c as d,a as r,b as e,e as n,d as a}from"./app-cdabc73c.js";const c="/assets/1d098ce5b2c779392c8d3a33636673c3-859b579b.png",p="/assets/2724f76ffa4222eae01521cd2dffd16d-6fd632df.jpeg",i="/assets/dab4ed01f50995d82e6e5d970b54c693-3a42280b.jpeg",g="/assets/4c153ac45915fbf3985d24b092894b9d-481a4bcc.jpeg",P="/assets/3d0859652adf9e3c0305e8e8517b47ac-3f73e88f.jpeg",U="/assets/3d7ce9c053815f6a32a6fbf6f7fb9628-e4df4d68.jpeg",h="/assets/c971c34e0456dea9e4a87857880bb5b8-58ec2f94.jpeg",G="/assets/14d05a43f559cecff2b0813e8d5bdde2-c4892c1c.png",l={},k=a('<h1 id="_31-gpu-下-为什么深度学习需要使用gpu" tabindex="-1"><a class="header-anchor" href="#_31-gpu-下-为什么深度学习需要使用gpu" aria-hidden="true">#</a> 31 | GPU（下）：为什么深度学习需要使用GPU？</h1><p>上一讲，我带你一起看了三维图形在计算机里的渲染过程。这个渲染过程，分成了<mark>顶点处理</mark>、<mark>图元处理</mark>、 <mark>栅格化</mark>、<mark>片段处理</mark>，以及最后的<mark>像素操作</mark>。这一连串的过程，也被称之为<strong>图形流水线</strong>或者<strong>渲染管线</strong>。</p><p>因为要实时计算渲染的像素特别地多，<em>图形加速卡</em>登上了历史的舞台。通过 3dFx 的 Voodoo 或者 NVidia 的 TNT 这样的图形加速卡，<em>CPU 就不需要再去处理一个个像素点的图元处理、栅格化和片段处理这些操作</em>。而 3D 游戏也是从这个时代发展起来的。</p><p>你可以看这张图，这是“古墓丽影”游戏的多边形建模的变化。这个变化，则是从 1996 年到 2016 年，这 20 年来显卡的进步带来的。</p><figure><img src="'+c+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>图片来源</p><h2 id="shader-的诞生和可编程图形处理器" tabindex="-1"><a class="header-anchor" href="#shader-的诞生和可编程图形处理器" aria-hidden="true">#</a> Shader 的诞生和可编程图形处理器</h2><p>不知道你有没有发现，在 Voodoo 和 TNT <em>显卡的渲染管线里面，没有“<code>顶点处理</code>“这个步骤</em>。在当时，把多边形的顶点进行线性变化，转化到我们的屏幕的坐标系的工作还是由 CPU 完成的。<em>所以，CPU 的性能越好，能够支持的多边形也就越多，对应的多边形建模的效果自然也就越像真人</em>。而 3D 游戏的多边形性能也受限于我们 CPU 的性能。无论你的显卡有多快，<em>如果 CPU 不行，3D 画面一样还是不行</em>。</p><p>所以，1999 年 NVidia 推出的 GeForce 256 显卡，<em>就把顶点处理的计算能力，也从 CPU 里挪到了显卡里</em>。不过，这对于想要做好 3D 游戏的程序员们还不够，即使到了 GeForce 256。整个图形渲染过程都是在硬件里面固定的管线来完成的。<em>程序员们在加速卡上能做的事情呢，只有改配置来实现不同的图形渲染效果</em>。如果通过改配置做不到，我们就没有什么办法了。</p><p>这个时候，<em>程序员希望我们的 <code>GPU 也能有一定的可编程能力</code></em>。这个编程能力不是像 CPU 那样，有非常通用的指令，可以进行任何你希望的操作，而是在整个的<strong>渲染管线</strong>（Graphics Pipeline）的一些特别步骤，<em>能够自己去定义处理数据的算法或者操作</em>。于是，从 2001 年的 Direct3D 8.0 开始，微软第一次引入了<strong>可编程管线</strong>（Programable Function Pipeline）的概念。</p><img src="'+p+'" alt="img" style="zoom:25%;"><p>早期的可编程管线的 GPU，提供了单独的顶点处理和片段处理（像素处理）的着色器</p><p><em>一开始的可编程管线呢</em>，仅限于<code>顶点处理</code>（Vertex Processing）和<code>片段处理</code>（Fragment Processing）部分。比起原来只能通过显卡和 Direct3D 这样的图形接口提供的固定配置，<em>程序员们终于也可以开始在图形效果上开始大显身手了</em>。</p><p>这些可以编程的接口，我们称之为 <strong>Shader</strong>，中文名称就是<strong>着色器</strong>。之所以叫“着色器”，是因为一开始这些“可编程”的接口，<em>只能修改顶点处理和片段处理部分的程序逻辑</em>。我们用这些接口来做的，也主要是<em>光照、亮度、颜色等等</em>的处理，所以叫着色器。</p><p>这个时候的 GPU，有两类 Shader，也就是 <code>Vertex</code> Shader 和 <em>Fragment</em> Shader。我们在上一讲看到，在进行<code>顶点处理</code>的时候，我们操作的是多边形的<code>顶点</code>；在<em>片段操作</em>的时候，我们操作的是屏幕上的<em>像素点</em>。对于<code>顶点</code>的操作，通常比<em>片段</em>要复杂一些。<strong>所以一开始</strong>，这两类 Shader 都是独立的硬件电路，也各自有独立的编程接口。因为这么做，硬件设计起来更加简单，一块 GPU 上也能容纳下更多的 Shader。</p><p>不过呢，大家很快发现，虽然我们在顶点处理和片段处理上的具体逻辑不太一样，<strong>但是里面用到的指令集可以用同一套</strong>。而且，虽然把 Vertex Shader 和 Fragment Shader 分开，可以减少硬件设计的复杂程度，<strong>但是也带来了一种浪费，有一半 Shader 始终没有被使用</strong>。</p><ul><li>在整个渲染管线里，Vertext Shader 运行的时候，Fragment Shader 停在那里什么也没干。</li><li>Fragment Shader 在运行的时候，Vertext Shader 也停在那里发呆。</li></ul><p>本来 GPU 就不便宜，结果设计的电路有一半时间是闲着的。喜欢精打细算抠出每一分性能的硬件工程师当然受不了了。于是，<strong>统一着色器架构</strong>（Unified Shader Architecture）就应运而生了。</p><p>既然大家用的指令集是一样的，那不如就在 GPU 里面放<em>很多个一样的 Shader 硬件电路，<code>然后通过统一调度</code>，把<code>顶点处理、图元处理、片段处理</code>这些任务，都交给这些 Shader 去处理</em>，让整个 GPU 尽可能地忙起来。这样的设计，就是我们现代 GPU 的设计，就是统一着色器架构。</p><p>有意思的是，这样的 GPU 并不是先在 PC 里面出现的，<em>而是来自于一台游戏机</em>，就是微软的 XBox 360。后来，这个架构才被用到 ATI 和 NVidia 的显卡里。这个时候的“<strong>着色器</strong>”的作用，其实已经和它的名字关系不大了，<em>而是变成了一个通用的抽象计算模块的名字</em>。</p><p>正是因为 Shader 变成<mark>一个“通用”的模块</mark>，才有了把 GPU 拿来做<mark>各种通用计算</mark>的用法，也就是 <strong>GPGPU</strong>（<code>General-Purpose Computing on Graphics Processing Units</code>，<em>通用图形处理器</em>）。而正是因为 GPU 可以拿来做各种通用的计算，才有了过去 10 年深度学习的火热。</p><img src="'+i+'" alt="img" style="zoom:25%;"><h2 id="现代-gpu-的三个核心创意" tabindex="-1"><a class="header-anchor" href="#现代-gpu-的三个核心创意" aria-hidden="true">#</a> 现代 GPU 的三个核心创意</h2><p>讲完了现代 GPU 的进化史，那么接下来，我们就来看看，为什么现代的 GPU 在图形渲染、深度学习上能那么快。</p><h3 id="芯片瘦身" tabindex="-1"><a class="header-anchor" href="#芯片瘦身" aria-hidden="true">#</a> 芯片瘦身</h3><p>我们先来回顾一下，之前花了很多讲仔细讲解的<em>现代 CPU</em>。现代 CPU 里的晶体管变得越来越多，越来越复杂，其实<em>已经不是用来实现“计算”这个核心功能</em>，而是拿来实现处理<mark>乱序执行</mark>、进行<mark>分支预测</mark>，以及我们之后要在存储器讲的<mark>高速缓存</mark>部分。</p><p><em>而在 GPU 里，这些电路就显得有点多余了</em>，GPU 的整个处理过程是一个<code>流式处理</code>（Stream Processing）的过程。因为没有那么多分支条件，或者复杂的依赖关系，我们可以把 GPU 里<em>这些对应的电路都可以去掉</em>，做一次小小的瘦身，只留下==<strong>取指令</strong><mark>、</mark><strong>指令译码</strong><mark>、</mark><strong>ALU</strong>== 以及<mark>执行这些计算需要的<strong>寄存器</strong>和<strong>缓存</strong>（也叫<strong>执行上下文</strong>）<mark>就好了。一般来说，我们会把这些电路抽象成三个部分，就是下面图里的</mark><strong>取指令</strong><mark>和</mark><strong>指令译码</strong></mark>、<mark><strong>ALU</strong></mark> 和==<strong>执行上下文</strong>==。</p><img src="'+g+'" alt="img" style="zoom:25%;"><h3 id="多核并行和-simt" tabindex="-1"><a class="header-anchor" href="#多核并行和-simt" aria-hidden="true">#</a> 多核并行和 SIMT</h3><p>这样一来，<em>我们的 GPU 电路就比 CPU 简单很多了</em>。于是，我们就可以在一个 GPU 里面，<em>塞很多个这样并行的 GPU 电路来实现计算</em>，就好像 CPU 里面的多核 CPU 一样。和 CPU 不同的是，我们不需要单独去实现什么多线程的计算。<em>因为 GPU 的运算是天然并行的</em>（硬件电路天然就是并行的）。</p><img src="'+P+'" alt="img" style="zoom:25%;"><p>我们在上一讲里面其实已经看到，无论是对多边形里的顶点进行处理，还是屏幕里面的每一个像素进行处理，每个点的计算都是独立的。<em>所以，简单地添加多核的 GPU，就能做到并行加速</em>。不过光这样加速还是不够，工程师们觉得，性能还有进一步被压榨的空间。</p><p>我们在第 27 讲里面讲过，CPU 里有一种叫作 <code>SIMD 的处理技术</code>。这个技术是说，<em>在做向量计算的时候</em>，我们要执行的指令是一样的，<em>只是同一个指令的数据有所不同而已。<code>在 GPU 的渲染管线里</code></em>，这个技术可就大有用处了。</p><h3 id="不同的alu-不同的上下文" tabindex="-1"><a class="header-anchor" href="#不同的alu-不同的上下文" aria-hidden="true">#</a> ##不同的ALU+不同的上下文</h3><p>无论是顶点去进行线性变换，还是屏幕上临近像素点的光照和上色，<em>都是在用<code>相同的指令流程</code>进行计算</em>。所以，GPU 就借鉴了 CPU 里面的 SIMD，用了一种叫作**<code>SIMT</code>（Single Instruction，Multiple Threads）的技术**。SIMT 呢，比 SIMD 更加灵活。在 SIMD 里面，CPU 一次性取出了固定长度的多个数据，放到寄存器里面，用一个指令去执行。<em>而 SIMT，可以把多条数据，交给不同的线程（<code>ALU+上下文</code>）去处理</em>。</p><p>各个线程里面执行的*<code>指令流程是一样的</code>，但是可能根据数据的不同，走到不同的条件分支*。这样，相同的代码和相同的流程，可能执行不同的具体的指令。这个线程走到的是 if 的条件分支，另外一个线程走到的就是 else 的条件分支了。</p><p>于是，我们的 GPU 设计就可以进一步进化，也就是在<mark>取指令</mark>和<mark>指令译码</mark>的阶段，<strong><mark>取出的指令</mark>可以给到<mark>后面多个不同的 ALU（<em>不同的线程</em>）</mark> 并行进行运算</strong>。这样，我们的一个 GPU 的核里，<em>就可以放下更多的 ALU，同时进行更多的并行运算了</em>。</p><img src="'+U+'" alt="img" style="zoom:25%;"><h3 id="gpu-里的-超线程" tabindex="-1"><a class="header-anchor" href="#gpu-里的-超线程" aria-hidden="true">#</a> GPU 里的“超线程”</h3><p>虽然 GPU 里面的主要以数值计算为主。不过既然已经是一个“通用计算”的架构了，GPU 里面也避免不了会有 if…else 这样的条件分支。但是，在 GPU 里我们可没有 CPU 这样的分支预测的电路。这些电路在上面“芯片瘦身”的时候，就已经被我们砍掉了。</p><p>所以，GPU 里的指令，可能会遇到和 CPU 类似的“流水线停顿”问题。想到流水线停顿，你应该就能记起，我们之前在 CPU 里面讲过<code>超线程技术</code>。在 GPU 上，我们一样可以做类似的事情，<em>也就是遇到停顿的时候，调度一些别的计算任务给当前的 ALU</em>。</p><p>和超线程一样，既然要调度一个不同的任务过来，<em>我们就需要针对这个任务</em>，提供更多的<strong>执行上下文</strong>。所以，一个 Core 里面的<strong>执行上下文</strong>的数量，需要比 ALU 多。</p><blockquote><p>比如，在一个物理 CPU 核心内部，<em>会有双份的</em> <mark>PC 寄存器</mark>、<mark>指令寄存器</mark>乃至<mark>条件码寄存器</mark>。这样，这个 CPU 核心<em>就可以维护两条并行的指令的状态</em>。在外面看起来，似乎有两个逻辑层面的 CPU 在同时运行。所以，超线程技术一般也被叫作<strong>同时多线程</strong>（<code>Simultaneous Multi-Threading</code>，简称 <code>SMT</code>）技术。</p></blockquote><figure><img src="'+h+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><h2 id="gpu-在深度学习上的性能差异" tabindex="-1"><a class="header-anchor" href="#gpu-在深度学习上的性能差异" aria-hidden="true">#</a> GPU 在深度学习上的性能差异</h2><p>在通过<mark>芯片瘦身</mark>、<mark>SIMT</mark> 以及<mark>更多的执行上下文</mark>，我们就有了<em>一个更擅长并行进行暴力运算的 GPU</em>。这样的芯片，也正适合我们今天的深度学习的使用场景。</p><p>一方面，GPU 是一个可以进行“通用计算”的框架，我们可以通过编程，在 GPU 上实现不同的算法。另一方面，现在的深度学习计算，都是超大的向量和矩阵，海量的训练样本的计算。<em>整个计算过程中，没有复杂的逻辑和分支，非常适合 GPU 这样并行、计算能力强的架构</em>。</p><p>我们去看 NVidia 2080 显卡的技术规格，就可以算出，它到底有多大的计算能力。</p><p>2080 一共有 46 个 <mark>SM</mark>（<code>Streaming Multiprocessor</code>，<strong>流式处理器</strong>），这个 SM 相当于 GPU 里面的 GPU Core，所以你可以认为这是一个 46 核的 GPU，有 46 个<mark>取指令</mark><mark>指令译码</mark>的<strong>渲染管线</strong>。每个 SM 里面有 64 个 Cuda Core。你可以认为，这里的 <strong>Cuda Core</strong> 就是我们上面说的 <strong>ALU 的数量</strong>或者 <strong>Pixel Shader 的数量</strong>，46x64 呢一共就有 2944 个 Shader。然后，还有 184 个 TMU，TMU 就是 Texture Mapping Unit，也就是用来做纹理映射的计算单元，它也可以认为是<strong>另一种类型的 Shader</strong>。</p><img src="'+G+'" alt="img" style="zoom:25%;"><p>图片来源</p><p>2080 Super 显卡有 48 个 SM，比普通版的 2080 多 2 个。每个 SM（SM 也就是 GPU Core）里有 64 个 Cuda Core，也就是 Shader</p><p>2080 的主频是 1515MHz，如果自动超频（Boost）的话，可以到 1700MHz。而 NVidia 的显卡，根据硬件架构的设计，每个时钟周期可以执行两条指令。所以，能做的浮点数运算的能力，就是：</p><p>（2944 + 184）× 1700 MHz × 2 = 10.06 TFLOPS</p><p>对照一下官方的技术规格，正好就是 10.07TFLOPS。</p><p>那么，最新的 Intel i9 9900K 的性能是多少呢？不到 1TFLOPS。而 2080 显卡和 9900K 的价格却是差不多的。所以，在实际进行深度学习的过程中，<em>用 GPU 所花费的时间，往往能减少一到两个数量级</em>。而大型的深度学习模型计算，<em>往往又是多卡并行</em>，要花上几天乃至几个月。这个时候，用 CPU 显然就不合适了。</p><p>今天，随着 GPGPU 的推出，GPU 已经不只是一个图形计算设备，<em>更是一个用来做数值计算的好工具了</em>。同样，也是因为 GPU 的快速发展，<em>带来了过去 10 年深度学习的繁荣</em>。</p><h2 id="总结延伸" tabindex="-1"><a class="header-anchor" href="#总结延伸" aria-hidden="true">#</a> 总结延伸</h2><p>这一讲里面，我们讲了，<code>GPU 一开始是没有“可编程”能力的</code>，程序员们只能够通过配置来设计需要用到的图形渲染效果。<code>随着“可编程管线”的出现</code>，程序员们可以在顶点处理和片段处理去实现自己的算法。为了进一步去提升 GPU 硬件里面的芯片利用率，微软在 XBox 360 里面，第一次引入了“统一着色器架构”，<code>使得 GPU 变成了一个有“通用计算”能力的架构</code>。</p><p>接着，我们从一个 CPU 的硬件电路出发，去掉了对 GPU 没有什么用的分支预测和乱序执行电路，<em>来进行瘦身</em>。之后，基于渲染管线里面顶点处理和片段处理就是<em>天然可以并行的了。我们在 GPU 里面可以加上很多个核</em>。</p><p>又因为我们的渲染管线里面，整个指令流程是相同的，我们又引入了和 CPU 里的 SIMD 类似的 <strong>SIMT 架构</strong>。这个改动，进一步增加了 GPU 里面的 <strong>ALU 的数量</strong>。最后，为了能够让 GPU 不要遭遇流水线停顿，我们又在同一个 GPU 的计算核里面，<strong>加上了更多的执行上下文，<code>让 GPU 始终保持繁忙</code></strong>。</p><p>GPU 里面的<em>多核、多 ALU，加上多 Context，使得它的并行能力极强</em>。同样架构的 GPU，如果光是做数值计算的话，算力在同样价格的 CPU 的十倍以上。而这个强大计算能力，以及“统一着色器架构”，使得 GPU 非常适合进行<code>深度学习</code>的计算模式，<strong>也就是海量计算，容易并行，并且没有太多的控制分支逻辑</strong>。</p><p>使用 GPU 进行深度学习，往往能够把深度学习算法的训练时间，<em>缩短一个，乃至两个数量级</em>。而 GPU 现在也越来越多地用在各种科学计算和机器学习上，而不仅仅是用在图形渲染上了。</p><h2 id="推荐阅读" tabindex="-1"><a class="header-anchor" href="#推荐阅读" aria-hidden="true">#</a> 推荐阅读</h2>',64),u={href:"http://haifux.org/lectures/267/Introduction-to-GPUs.pdf",target:"_blank",rel:"noopener noreferrer"},f=a('<h2 id="课后思考" tabindex="-1"><a class="header-anchor" href="#课后思考" aria-hidden="true">#</a> 课后思考</h2><p>上面我给你算了 NVidia 2080 显卡的 FLOPS，你可以尝试算一下 9900K CPU 的 FLOPS。</p><p>欢迎在留言区写下你的答案，你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><blockquote><p>原来着色器，ALU和cuda core其实是同一个东西。那个ppt很给力，谢谢<br> 由此看出，CPU适合做逻辑复杂、小量数据、IO密集这三类运算。<br> 只要数据量大，即使逻辑复杂，还是值得研究可编程的专门硬件来提高效率，正如GPU的出现。<br> IO密集型的场景，由于内存、网卡、硬盘与CPU之间的速率差异，更适合借助中断机制用异步方式实现，提高总体的吞吐率。并借助高速缓存和超线程，进一步提升吞吐率，Web服务就是这种场景。</p><p>这章真好，通俗地讲出了GPU硬件发展以及为什么适合深度学习应用。对体系结构只有一些概念性理解的软件工程师，也能很好地接收Get到。</p><p>最新版的GPU Turing架构，加入了Tensor Core，面向深度学习，直接支持矩阵乘法这种相对复杂的运算</p><p>技术都是螺旋式发展的，正如: 游戏的发展 —&gt; GPU技术升级 -&gt; 深度学习发展</p></blockquote>',4);function S(C,b){const o=m("ExternalLinkIcon");return s(),d("div",null,[k,r("p",null,[e("关于现代 GPU 的工作原理，你可以仔细阅读一下 "),r("a",u,[e("haifux.org 上的这个PPT"),n(o)]),e("，里面图文并茂地解释了现代 GPU 的架构设计的思路。")]),f])}const M=t(l,[["render",S],["__file","E31-GPU（下）.html.vue"]]);export{M as default};
