import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as e,d as p}from"./app-cdabc73c.js";const r="/assets/5d9290f08847685d65bc3edd88242855-0c2c8c22.jpg",o="/assets/1ef05750bc9ff87a3330104802965335-c7f7338e.jpeg",t="/assets/7bf96d3c8e3a82cdac9c7629b81fa368-e9f6ee81.png",l="/assets/aa9d074d9819f0eb513e11014a5772c0-dbf71591.jpg",s="/assets/3c506edf93b15341da3db658e9970773-13981667.jpg",c="/assets/6234738aac8d5897449e1a541d557090-fca9dcb8.jpg",i="/assets/80e152fe768e3cb4c84be62ad8d6d07f-413a2e0b.jpg",d={},m=p('<h1 id="_31-输入与输出-如何建立售前售后生态体系" tabindex="-1"><a class="header-anchor" href="#_31-输入与输出-如何建立售前售后生态体系" aria-hidden="true">#</a> 31 | 输入与输出：如何建立售前售后生态体系？</h1><p>到这一节，操作系统作为一家外包公司，里面最核心的职能部门差不多都凑齐了。我们有了项目管理部门（进程管理），有为了维护项目执行期间数据的会议室管理部门（内存管理），有项目执行完毕后归档的档案库管理部门（文件系统）。</p><p>这一节，我们来规划一下这家公司的售前售后生态体系（输入输出系统）。这里你需要注意“生态”两个字，我们不仅仅是招聘一些售前和售后员工，而是应该建立一套体系让供应商，让渠道帮着我们卖，形成一个生态。</p><p>计算机系统的输入和输出系统都有哪些呢？我们能举出来的，例如<strong>键盘、鼠标、显示器、<code>网卡</code>、硬盘、打印机、CD/DVD 等</strong>等，多种多样。这样，当然方便用户使用了，但是对于操作系统来讲，却是一件复杂的事情，因为这么多设备，形状、用法、功能都不一样，怎么才能统一管理起来呢？</p><h2 id="用设备控制器屏蔽设备差异" tabindex="-1"><a class="header-anchor" href="#用设备控制器屏蔽设备差异" aria-hidden="true">#</a> 用设备控制器屏蔽设备差异</h2><p>这有点像一家公司要做 To B 的生意，发现客户多种多样，众口难调，不同的地域不一样，不同的行业不一样。如果你不懂某个地方的规矩，根本卖不出去东西；如果你不懂某个具体行业的使用场景，也无法满足客户的需求。怎么办呢？一般公司采取的策略就是建立生态，设置很多代理商，让各个地区和各个行业的代理商帮你屏蔽这些差异化。你和代理商之间只要进行简单的标准产品交付就可以了。</p><p>计算机系统也是这样的，CPU 并不直接和设备打交道，它们中间有一个叫作==<strong>设备控制器</strong>（Device Control Unit）<mark>的组件，例如硬盘有磁盘控制器、USB 有 USB 控制器、显示器有视频控制器等。这些控制器就像</mark>代理商==一样，它们知道如何应对硬盘、鼠标、键盘、显示器的行为</p><blockquote><p>如果你是一家大公司，你的代理商往往是小公司。<strong>控制器其实有点儿像一台小电脑</strong>。它有它的芯片，类似小 CPU，执行自己的逻辑。它也有它的寄存器。</p><p><strong>这样 CPU 就可以<code>通过写这些寄存器</code>，对控制器下发指令，通过读这些寄存器，查看控制器对于设备的操作状态</strong>。</p><p>CPU 对于寄存器的读写，可比直接控制硬件，<strong>要标准和轻松很多</strong>。这就相当于你和代理商的标准产品交付。</p></blockquote><h2 id="块设备-字符设备" tabindex="-1"><a class="header-anchor" href="#块设备-字符设备" aria-hidden="true">#</a> 块设备/字符设备</h2><p>输入输出设备我们大致可以分为两类：<strong>块设备</strong>（Block Device）和<strong>字符设备</strong>（Character Device）。</p><ul><li><p>块设备将信息存储在<mark>固定大小的块</mark>中，每个块<strong>都有自己的地址</strong>。硬盘就是常见的块设备。</p><ul><li>由于块设备传输的数据量比较大，控制器里往往会有缓冲区。</li><li>CPU 写入缓冲区的数据攒够一部分，才会发给设备。CPU 读取的数据，也需要在缓冲区攒够一部分，才拷贝到内存。</li></ul></li><li><p>字符设备发送或接收的是<mark>字节流</mark>。而不用考虑任何块结构，<strong>没有办法寻址</strong>。鼠标就是常见的字符设备。</p></li></ul><hr><p>这个也比较好理解，代理商我们也可以分成两种。一种是<strong>集成商模式</strong>，也就是说没有客户的时候，代理商不会在你这里采购产品，每次它遇到一个客户的时候，会带上你，共同应标。你出标准产品，地域的和行业的差异，它来搞定。这有点儿像<mark>字符设备</mark>。另外一种是<strong>代购代销模式</strong>，也就是说从你这里批量采购一批产品，然后没卖完之前，基本就不会找你了。这有点儿像<mark>块设备</mark>。</p><h2 id="cpu与设备通信" tabindex="-1"><a class="header-anchor" href="#cpu与设备通信" aria-hidden="true">#</a> CPU与设备通信</h2><p>CPU 如何同控制器的寄存器和数据缓冲区进行通信呢？</p><h3 id="io端口-数据缓冲区" tabindex="-1"><a class="header-anchor" href="#io端口-数据缓冲区" aria-hidden="true">#</a> IO端口/数据缓冲区</h3><ul><li>每个控制寄存器被分配一个 <mark>I/O 端口</mark>，我们可以通过特殊的汇编指令（例如 in/out 类似的指令）操作这些寄存器。</li><li><mark>数据缓冲区</mark>，可内存映射 I/O，可以分配一段内存空间给它，就像读写内存一样读写数据缓冲区。 <ul><li>如果你去看内存空间的话，有一个原来我们没有讲过的区域 <code>ioremap</code>，就是做这个的。</li></ul></li></ul><p>这有点儿像，如果你要给你的代理商下一个任务，或者询问订单的状态，直接打电话联系他们的负责人就可以了。如果你需要和代理商做大量的交互，共同讨论应标方案，那电话说太麻烦了，你可以把代理商拉到你们公司来，你们直接在一个会议室里面出方案。</p><h3 id="轮询机制-硬件中断" tabindex="-1"><a class="header-anchor" href="#轮询机制-硬件中断" aria-hidden="true">#</a> 轮询机制/硬件中断</h3><p>对于 CPU 来讲，这些外部设备都有自己的大脑，可以自行处理一些事情，但是有个问题是，当你给设备发了一个指令，让它读取一些数据，它读完的时候，怎么通知你呢？</p><p>控制器的寄存器一般会有状态标志位，可以通过检测状态标志位，来确定输入或者输出操作是否完成。</p><ol><li>第一种方式就是<strong>轮询等待</strong>，就是一直查，一直查，直到完成。当然这种方式很不好，</li><li>于是我们有了第二种方式，就是可以通过<strong>中断</strong>的方式，通知操作系统输入输出操作已经完成。</li><li>为了响应中断，我们一般会有<mark>一个硬件的中断控制器</mark>，<br> 2. 当设备完成任务后<mark>触发中断到</mark>中断控制器，中断控制器就通知 CPU，一个中断产生了，CPU 需要停下当前手里的事情来处理中断。</li></ol><p>这就像代理商有了新客户，客户有了新需求，客户交付完毕等事件，都需要有一种机制通知你们公司，在哪里呢？当然是在办事大厅呀。如果你问，不对呀，办事大厅不是处理系统调用的么？还记得 32 位系统调用是通过 INT 产生软中断触发的么？这就统一起来了，中断有两种，</p><ol><li>一种<strong>软中断</strong>，例如代码调用 INT 指令触发，</li><li>一种是<strong>硬件中断</strong>，就是硬件通过中断控制器触发的。</li></ol><p>所以将中断作为办事大厅的一项服务，没有什么问题。</p><img src="'+r+'" alt="img" style="zoom:25%;"><h3 id="dma方式" tabindex="-1"><a class="header-anchor" href="#dma方式" aria-hidden="true">#</a> DMA方式</h3><p>有的设备需要读取或者写入大量数据。如果所有过程都让 CPU 协调的话，就需要占用 CPU 大量的时间，比方说，磁盘就是这样的。这种类型的设备需要支持 DMA 功能，也就是说，允许设备在 CPU 不参与的情况下，能够自行完成对内存的读写。实现 DMA 机制需要有个 DMA 控制器帮你的 CPU 来做协调，就像下面这个图中显示的一样。</p><p>CPU 只需要对 <mark>DMA 控制器</mark>下指令，说它想读取多少数据，放在内存的某个地方就可以了，接下来 DMA 控制器会发指令给磁盘控制器，读取磁盘上的数据到指定的内存位置，传输完毕之后，DMA 控制器发中断通知 CPU 指令完成，CPU 就可以直接用内存里面现成的数据了。还记得咱们讲内存的时候，有个 DMA 区域，就是这个作用。</p><p>DMA 有点儿像一些比较大的代理商，不但能够帮你代购代销，而且自己有能力售前、售后和技术支持，实施部署都能自己搞定。</p><img src="'+o+'" alt="img" style="zoom:25%;"><h2 id="用驱动程序屏蔽设备控制器差异" tabindex="-1"><a class="header-anchor" href="#用驱动程序屏蔽设备控制器差异" aria-hidden="true">#</a> 用驱动程序屏蔽设备控制器差异</h2><p>虽然代理商机制能够帮我们屏蔽<strong>很多设备的细节</strong>，但是从上面的描述我们可以看出，由于<strong>每种设备的控制器的寄存器、缓冲区等使用模式，指令都不同</strong>，所以对于操作系统这家公司来讲，需要有个部门专门对接代理商，向其他部门屏蔽代理商的差异，类似公司的渠道管理部门。</p><p>那什么才是操作系统的渠道管理部门呢？就是<mark>用来对接各个设备控制器的<strong>设备驱动程序</strong></mark>。</p><p>这里需要注意的是，<mark>设备控制器</mark>不属于操作系统的一部分，但是<mark>设备驱动程序</mark>属于操作系统的一部分。操作系统的内核代码可以像调用本地代码一样调用驱动程序的代码，而驱动程序的代码需要<strong>发出特殊的面向设备控制器的指令</strong>，才能操作设备控制器。</p><p>设备驱动程序中是一些面向特殊设备控制器的代码。不同的设备不同。但是对于操作系统其它部分的代码而言，<strong>设备驱动程序应该有统一的接口</strong>。就像下面图中的一样，<strong>不同的设备驱动程序，可以以同样的方式接入操作系统</strong>，而操作系统的其它部分的代码，也可以无视不同设备的区别，<strong>以同样的接口调用设备驱动程序</strong>。</p><p>接下来两节，我们会讲字符设备驱动程序和块设备驱动程序的模型，从那里我们也可以看出，所有设备驱动程序都要，按照同样的规则，实现同样的方法。</p><img src="'+t+'" alt="img" style="zoom:33%;"><h2 id="设备中断处理流程" tabindex="-1"><a class="header-anchor" href="#设备中断处理流程" aria-hidden="true">#</a> 设备中断处理流程</h2><p>上面咱们说了，设备做完了事情要通过<mark>中断</mark>来通知操作系统。那操作系统就需要有一个地方处理这个中断，既然设备驱动程序是用来对接设备控制器的，<strong>中断处理也应该在设备驱动里面完成</strong>。</p><p>然而中断的触发最终会到达 CPU，会中断操作系统当前运行的程序，所以操作系统也要有一个统一的流程来处理中断，使得不同设备的中断使用统一的流程。</p><p>一般的流程是，一个设备驱动程序初始化的时候，要先注册一个该设备的中断处理函数。咱们讲进程切换的时候说过，中断返回的那一刻是进程切换的时机。不知道你还记不记得，<strong>中断的时候，触发的函数是 <code>do_IRQ</code></strong>。这个函数是<mark>中断处理的统一入口</mark>。在这个函数里面，我们可以找到<mark>设备驱动程序注册的中断处理函数 Handler</mark>，然后执行它进行中断处理。</p><img src="'+l+'" alt="img" style="zoom:25%;"><h2 id="通用设备层-通用块层" tabindex="-1"><a class="header-anchor" href="#通用设备层-通用块层" aria-hidden="true">#</a> 通用设备层/通用块层</h2><p>另外，对于块设备来讲，在驱动程序之上，文件系统之下，还需要一层<strong>通用设备层</strong>。比如咱们上一章讲的文件系统，里面的逻辑和磁盘设备没有什么关系，可以说是通用的逻辑。在写文件的最底层，我们看到了 BIO 字眼的函数，但是好像和设备驱动也没有什么关系。是的，因为块设备类型非常多，而 Linux 操作系统里面一切是文件。我们也不想文件系统以下，就直接对接各种各样的块设备驱动程序，这样会使得文件系统的复杂度非常高。所以，我们在中间加了一层<mark>通用块层</mark>，<strong>将与块设备相关的通用逻辑放在这一层，维护与设备无关的块的大小，然后通用块层下面对接各种各样的驱动程序</strong>。</p><h2 id="系统分层图" tabindex="-1"><a class="header-anchor" href="#系统分层图" aria-hidden="true">#</a> 系统分层图</h2><img src="'+s+`" alt="img" style="zoom:25%;"><h2 id="用文件系统接口屏蔽驱动程序的差异" tabindex="-1"><a class="header-anchor" href="#用文件系统接口屏蔽驱动程序的差异" aria-hidden="true">#</a> 用文件系统接口屏蔽驱动程序的差异</h2><p>上面我们从硬件设备到设备控制器，到驱动程序，到通用块层，到文件系统，层层屏蔽不同的设备的差别，最终到这里涉及对用户使用接口，也要统一。</p><p>虽然我们操作设备，都是基于<mark>文件系统的接口</mark>，也要有一个统一的标准。</p><p>首先要统一的是设备名称。所有设备都在 /dev/ 文件夹下面创建一个特殊的设备文件。这个设备特殊文件也有 inode，但是它不关联到硬盘或任何其他存储介质上的数据，而是建立了与某个设备驱动程序的连接。</p><p>硬盘设备这里有一点绕。假设是 /dev/sdb，这是一个设备文件。这个文件本身和硬盘上的文件系统没有任何关系。这个设备本身也不对应硬盘上的任何一个文件，/dev/sdb 其实是在一个特殊的文件系统 devtmpfs 中。但是当我们将 /dev/sdb 格式化成一个文件系统 ext4 的时候，就会将它 mount 到一个路径下面。例如在 /mnt/sdb 下面。这个时候 /dev/sdb 还是一个设备文件在特殊文件系统 devtmpfs 中，而 /mnt/sdb 下面的文件才是在 ext4 文件系统中，只不过这个设备是在 /dev/sdb 设备上的。</p><p>这里我们只关心设备文件，当我们用 ls -l 在 /dev 下面执行的时候，就会有这样的结果。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span> <span class="token directive keyword">ls</span> <span class="token expression"><span class="token operator">-</span>l</span></span>
crw<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">-</span> <span class="token number">1</span> root root      <span class="token number">5</span><span class="token punctuation">,</span>   <span class="token number">1</span> Dec <span class="token number">14</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">53</span> console
crw<span class="token operator">-</span>r<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">-</span> <span class="token number">1</span> root kmem      <span class="token number">1</span><span class="token punctuation">,</span>   <span class="token number">1</span> Dec <span class="token number">14</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">53</span> mem
crw<span class="token operator">-</span>rw<span class="token operator">-</span>rw<span class="token operator">-</span> <span class="token number">1</span> root root      <span class="token number">1</span><span class="token punctuation">,</span>   <span class="token number">3</span> Dec <span class="token number">14</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">53</span> null
crw<span class="token operator">-</span>r<span class="token operator">--</span><span class="token operator">--</span><span class="token operator">-</span> <span class="token number">1</span> root kmem      <span class="token number">1</span><span class="token punctuation">,</span>   <span class="token number">4</span> Dec <span class="token number">14</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">53</span> port
crw<span class="token operator">-</span>rw<span class="token operator">-</span>rw<span class="token operator">-</span> <span class="token number">1</span> root root      <span class="token number">1</span><span class="token punctuation">,</span>   <span class="token number">8</span> Dec <span class="token number">14</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">53</span> random
crw<span class="token operator">--</span>w<span class="token operator">--</span><span class="token operator">--</span> <span class="token number">1</span> root tty       <span class="token number">4</span><span class="token punctuation">,</span>   <span class="token number">0</span> Dec <span class="token number">14</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">53</span> tty0
crw<span class="token operator">--</span>w<span class="token operator">--</span><span class="token operator">--</span> <span class="token number">1</span> root tty       <span class="token number">4</span><span class="token punctuation">,</span>   <span class="token number">1</span> Dec <span class="token number">14</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">53</span> tty1
crw<span class="token operator">-</span>rw<span class="token operator">-</span>rw<span class="token operator">-</span> <span class="token number">1</span> root root      <span class="token number">1</span><span class="token punctuation">,</span>   <span class="token number">9</span> Dec <span class="token number">14</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">53</span> urandom
brw<span class="token operator">-</span>rw<span class="token operator">--</span><span class="token operator">--</span> <span class="token number">1</span> root disk    <span class="token number">253</span><span class="token punctuation">,</span>   <span class="token number">0</span> Dec <span class="token number">31</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">18</span> vda
brw<span class="token operator">-</span>rw<span class="token operator">--</span><span class="token operator">--</span> <span class="token number">1</span> root disk    <span class="token number">253</span><span class="token punctuation">,</span>   <span class="token number">1</span> Dec <span class="token number">31</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">19</span> vda1
brw<span class="token operator">-</span>rw<span class="token operator">--</span><span class="token operator">--</span> <span class="token number">1</span> root disk    <span class="token number">253</span><span class="token punctuation">,</span>  <span class="token number">16</span> Dec <span class="token number">14</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">53</span> vdb
brw<span class="token operator">-</span>rw<span class="token operator">--</span><span class="token operator">--</span> <span class="token number">1</span> root disk    <span class="token number">253</span><span class="token punctuation">,</span>  <span class="token number">32</span> Jan  <span class="token number">2</span> <span class="token number">11</span><span class="token operator">:</span><span class="token number">24</span> vdc
crw<span class="token operator">-</span>rw<span class="token operator">-</span>rw<span class="token operator">-</span> <span class="token number">1</span> root root      <span class="token number">1</span><span class="token punctuation">,</span>   <span class="token number">5</span> Dec <span class="token number">14</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">53</span> zero
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于设备文件，ls 出来的内容和我们原来讲过的稍有不同。</p><p>首先是第一位字符。如果是字符设备文件，则以 c 开头，如果是块设备文件，则以 b 开头。其次是这里面的两个号，一个是主设备号，一个是次设备号。主设备号定位设备驱动程序，次设备号作为参数传给启动程序，选择相应的单元。</p><p>从上面的列表我们可以看出来，mem、null、random、urandom、zero 都是用同样的主设备号 1，也就是它们使用同样的字符设备驱动，而 vda、vda1、vdb、vdc 也是同样的主设备号，也就是它们使用同样的块设备驱动。</p><p>有了设备文件，我们就可以使用对于文件的操作命令和 API 来操作文件了。例如，使用 cat 命令，可以读取 /dev/random 和 /dev/urandom 的数据流，可以用 od 命令转换为十六进制后查看。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>cat <span class="token operator">/</span>dev<span class="token operator">/</span>urandom <span class="token operator">|</span> od <span class="token operator">-</span>x
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这里还是要明确一下，如果用文件的操作作用于 /dev/sdb 的话，会无法操作文件系统上的文件，操作的这个设备。</p><p>如果 Linux 操作系统新添加了一个设备，应该做哪些事情呢？就像咱们使用 Windows 的时候，如果新添加了一种设备，首先要看这个设备有没有相应的驱动。如果没有就需要安装一个驱动，等驱动安装好了，设备就在 Windows 的设备列表中显示出来了。</p><p>在 Linux 上面，如果一个新的设备从来没有加载过驱动，也需要安装驱动。Linux 的驱动程序已经被写成和操作系统有标准接口的代码，可以看成一个标准的内核模块。在 Linux 里面，安装驱动程序，其实就是加载一个内核模块。</p><p>我们可以用命令 lsmod，查看有没有加载过相应的内核模块。这个列表很长，我这里列举了其中一部分。可以看到，这里面有网络和文件系统的驱动。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span> <span class="token directive keyword">lsmod</span></span>
Module                  Size  Used by
iptable_filter         <span class="token number">12810</span>  <span class="token number">1</span>
bridge                <span class="token number">146976</span>  <span class="token number">1</span> br_netfilter
vfat                   <span class="token number">17461</span>  <span class="token number">0</span>
fat                    <span class="token number">65950</span>  <span class="token number">1</span> vfat
ext4                  <span class="token number">571716</span>  <span class="token number">1</span>
cirrus                 <span class="token number">24383</span>  <span class="token number">1</span>
crct10dif_pclmul       <span class="token number">14307</span>  <span class="token number">0</span>
crct10dif_common       <span class="token number">12595</span>  <span class="token number">1</span> crct10dif_pclmul
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果没有安装过相应的驱动，可以通过 insmod 安装内核模块。内核模块的后缀一般是 ko。</p><p>例如，我们要加载 openvswitch 的驱动，就要通过下面的命令：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>insmod openvswitch<span class="token punctuation">.</span>ko
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>一旦有了驱动，我们就可以通过命令 mknod 在 /dev 文件夹下面创建设备文件，就像下面这样：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>mknod filename type major minor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>其中 filename 就是 /dev 下面的设备名称，type 就是 c 为字符设备，b 为块设备，major 就是主设备号，minor 就是次设备号。一旦执行了这个命令，新创建的设备文件就和上面加载过的驱动关联起来，这个时候就可以通过操作设备文件来操作驱动程序，从而操作设备。</p><p>你可能会问，人家 Windows 都说插上设备后，一旦安装了驱动，就直接在设备列表中出来了，你这里怎么还要人来执行命令创建呀，能不能智能一点？</p><p>当然可以，这里就要用到另一个管理设备的文件系统，也就是 /sys 路径下面的 sysfs 文件系统。它把实际连接到系统上的设备和总线组成了一个分层的文件系统。这个文件系统是当前系统上实际的设备数的真实反映。</p><p>在 /sys 路径下有下列的文件夹：</p><ul><li>/sys/devices 是内核对系统中所有设备的分层次的表示；</li><li>/sys/dev 目录下一个 char 文件夹，一个 block 文件夹，分别维护一个按字符设备和块设备的主次号码 (major:minor) 链接到真实的设备 (/sys/devices 下) 的符号链接文件；</li><li>/sys/block 是系统中当前所有的块设备；</li><li>/sys/module 有系统中所有模块的信息。</li></ul><p>有了 sysfs 以后，我们还需要一个守护进程 udev。当一个设备新插入系统的时候，内核会检测到这个设备，并会创建一个内核对象 kobject 。 这个对象通过 sysfs 文件系统展现到用户层，同时内核还向用户空间发送一个热插拔消息。udevd 会监听这些消息，在 /dev 中创建对应的文件。</p><img src="`+c+'" alt="img" style="zoom:25%;"><p>有了文件系统接口之后，我们不但可以通过文件系统的命令行操作设备，也可以通过程序，调用 read、write 函数，像读写文件一样操作设备。但是有些任务只使用读写很难完成，例如检查特定于设备的功能和属性，超出了通用文件系统的限制。所以，对于设备来讲，还有一种接口称为 ioctl，表示输入输出控制接口，是用于配置和修改特定设备属性的通用接口，这个我们后面几节会详细说。</p><h2 id="总结时刻" tabindex="-1"><a class="header-anchor" href="#总结时刻" aria-hidden="true">#</a> 总结时刻</h2><p>这一节，我们讲了输入与输出设备的管理，内容比较多。输入输出设备就像管理代理商一样。因为代理商复杂多变，代理商管理也同样复杂多变，需要层层屏蔽差异化的部分，给上层提供标准化的部分，最终到用户态，给用户提供了基于文件系统的统一的接口。</p><img src="'+i+'" alt="img" style="zoom:25%;"><img src="'+s+'" alt="img" style="zoom:25%;"><h2 id="课堂练习" tabindex="-1"><a class="header-anchor" href="#课堂练习" aria-hidden="true">#</a> 课堂练习</h2><p>如果你手头的 Linux 是一台物理机，试着插进一块 U 盘，看文件系统中设备的变化。如果你没有 Linux 物理机，可以使用公有云的云主机，添加一块硬盘，看文件系统中设备的变化。</p><p>欢迎留言和我分享你的疑惑和见解 ，也欢迎可以收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p><h2 id="课后讨论" tabindex="-1"><a class="header-anchor" href="#课后讨论" aria-hidden="true">#</a> 课后讨论</h2><ul><li>用设备控制器屏蔽设备差异</li><li>I/O 设备多种多样, 通过设备控制器范文设备( 类似代理商 ) <ul><li>控制器像小电脑, 有芯片和寄存器, CPU 可通过读写寄存器访问设备</li><li>I/O 设备可分为两类: 块设备, 信息存于块中, 有自己的地址, 例如硬盘; 字符设备, 信息为字节流, 无法寻址, 例如鼠标.</li><li>块设备控制器有缓冲区, 数据缓冲区即内存映射 I/O; 控制器寄存器有 I/O 端口, 可通过汇编指令操作.</li><li>如何通知设备操作已完成:</li><li>轮询检测控制器寄存器的状态标志位 <ul><li>中断通知, 通过硬件中断控制器通知 CPU; ( 而软中断是在代码中调用 INT, 可触发系统调用 )</li></ul></li><li>DMA 功能, 设备在 CPU 不参与下, 自行完成内存读写; 由 DMA 协调控制磁盘控制器, 并发送中断通知 CPU 操作完成</li></ul></li><li>驱动程序屏蔽设备控制器差异</li><li>设备控制器不属于操作系统的一部分; 而驱动程序属于, 可以被内核代码调用. <ul><li>驱动程序应有统一的接口, 中断处理也在驱动里完成</li><li>驱动初始化时, 注册中断处理函数; 中断统一出发 do_IRQ, 其找到注册的中断处理函数并执行</li><li>对于块设备, 驱动与文件系统之间需要通用设备层; 通用设备层实现与块设备相关的通用逻辑, 位于与设备无关的操作</li></ul></li><li>用文件系统接口屏蔽驱动程序的差异</li><li>统一设备名称, 设备在 /dev/ 下有特殊设备文件, 其有 inode 但不关联存储介质数据, 只建立与驱动的连接; /dev/ 是在 devtmpfs 文件系统下, c→字符设备文件, b→块设备文件; 设备号: 主设备号(驱动程序), 次设备号(相应的单元); 可对设备文件使用文件的操作命令 <ul><li>添加新设备, 需要安装驱动( Linux 中即加载一个内核模块 ), 用 lsmod 查看加载的内核模块, 可通过 insmod 安装; 有了驱动, 可用 mkmod 在 /dev/ 下创建设备文件.</li><li>或 /sys/sysfs 中是实际设备数的反映</li><li>/sys/devices 所有设备层次结构 <ul><li>/sys/dev char block 中用设备号链接到 /sys/devices 中</li><li>/sys/block 所有块设备</li></ul></li><li>守护进程 udev</li><li>内核检测到新设备插入, 或创建 kobject 对象, 通过 sysfs 展现给用户, 并发送热插拔消息, udev 监听到消息并在 /dev/ 中创建设备文件 <ul><li>ioctl 可用于配置和修改设备信息.</li></ul></li></ul></li></ul><p>直接读写操作/dev/sdb是操作的裸设备吗？也就是这时候的读入和写出的数据都不经过文件系统？<br> 直接读写/dev/sdb1具有相同的效果吧，只不过sdb代表整块硬盘，sdb1只代表一个分区，但是他们都是裸设备？<br> 只有操作文件才会经过文件系统层吗？<br> 作者回复: 是的，读写操作/dev/sdb是操作的裸设备，所以读写他没啥意义。也不经过文件系统。只有mount之后，才走文件系统层</p><p>老师，可不可以这么理解。假设硬盘被格式化为ext 文件系统。如果我们直接读写裸设备，相当于绕过ext文件系统的这部分代码直接让驱动程序指挥硬盘。当然这种指挥由于没有一定的规则，没有什么意义。而把文件系统挂载到某个目录下后，我们访问这个目录，相当于特定于ext文件系统的这部分代码代替我们刚才的“瞎指挥”，还是通过驱动程序操作裸设备，现在由于有了特定文件系统的规则，所以就能读写文件了。 这么理解文件系统 驱动程序 裸设备之间的关系，对吗？<br> 作者回复: 是的，裸写肯定会写坏</p><p>/dev 下的文件和设备驱动程序关联，通过对/dev 下的文件进行api操作可以和设备互动<br> 作者回复: 是的</p><p>在Linux正常运行的过程中，如果用 int 0x80来调用系统调用，是否要走文中所画的通用中断处理流程？<br> 作者回复: 要的</p><p>ls -all 命令用的好多，这个块设备和字符设备之前只是一个概念。现在其实可以理解块设备就是类似于硬盘这种存储类的，而字符流类似于我们用的触屏，鼠标等更面向用户的输入输出设备。<br> 作者回复: 对的</p><p>/dev/sdb这个设备文件是在devtmpfs文件系统上的，假设将这个设备挂载到/mnt/sdb目录下，这个时候读写这个硬盘上的文件时，最终是否还会通过/dev/sdb设备文件来找到设备驱动程序？毕竟读写文件最底层也是操作具体的磁盘。<br> 作者回复: 对的，这比较绕，后面会讲，这里涉及到三个文件系统，倒腾过来倒腾过去</p><p>二刷：DMA解放了CPU，而DNA自己需要通过驱动程序来与设备进行交互，因为DMA不可能知道具体的设备控制相关的指令（主要是因为硬件的地址线有多少根，数据线有多少根，控制引脚等等差异-猜测）。等设备完成任务后向DMA确认，DMA再向CPU发起中断。这样，设备管理器应当是保含两部分：1. 与设备的通信代码. 2. 中断处理程序（便于CPU按照需要对设备进行善后工作？）<br> 不知道理解的对不对，望大佬货老师解答一下</p><p>硬件-&gt;设备控制器-&gt;中断处理器-&gt;设备驱动程序-&gt;通用设备层（这一层可以算进操作系统）</p><p>在高速SSD设备上面创建文件系统，读写文件的速度非常慢。而通过/dev目录下的设备文件去读写SSD时，能发挥出他的性能。</p>',95),u=[m];function k(b,v){return a(),e("div",null,u)}const f=n(d,[["render",k],["__file","K31-IO设备管理流程结构.html.vue"]]);export{f as default};
