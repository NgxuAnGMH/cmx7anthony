import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as n,c as p,a as e,b as a,e as m,d as s}from"./app-cdabc73c.js";const d="/assets/d107e645e1f849ebcafab0e4d4b73a9d-a3551beb.png",i="/assets/912a6b83c639ae06b61a56327488916b-b2ced4db.png",c="/assets/e09b64e035a3b1bd664b0584a7b52fbf-7520c797.jpeg",h="/assets/9c30f8d93270a9563154aa732b9c9f8e-d4465b22.jpeg",k="/assets/6cbf5f5f4275bc053fabcd3480304a35-f6572c4e.jpeg",l={},g=s('<h1 id="_34-理解虚拟机-你在云上拿到的计算机是什么样的" tabindex="-1"><a class="header-anchor" href="#_34-理解虚拟机-你在云上拿到的计算机是什么样的" aria-hidden="true">#</a> 34 | 理解虚拟机：你在云上拿到的计算机是什么样的？</h1><p>上世纪 60 年代，计算机还是异常昂贵的设备，实际的计算机使用需求要面临两个挑战。第一，计算机特别昂贵，我们要尽可能地让计算机忙起来，一直不断地去处理一些计算任务。第二，很多工程师想要用上计算机，但是没有能力自己花钱买一台，所以呢，我们要让很多人可以共用一台计算机。</p><h2 id="缘起分时系统" tabindex="-1"><a class="header-anchor" href="#缘起分时系统" aria-hidden="true">#</a> 缘起分时系统</h2><p>为了应对这两个问题，<code>分时系统</code>的计算机就应运而生了。</p><p>无论是个人用户，还是一个小公司或者小机构，你都不需要花大价钱自己去买一台电脑。你只需要买一个输入输出的终端，就好像一套鼠标、键盘、显示器这样的设备，然后通过电话线，连到放在大公司机房里面的计算机就好了。这台计算机，会自动给程序或任务分配计算时间。你只需要为你花费的“计算时间”和使用的电话线路付费就可以了。比方说，比尔·盖茨中学时候用的学校的计算机，就是 GE 的分时系统。</p><img src="'+d+'" alt="img" style="zoom:25%;"><p>图片来源</p><p>图片里面的“计算机”其实只是一个终端而已，并没有计算能力，要通过电话线连接到实际的计算机上，才能完成运算</p><h2 id="从-黑色星期五-到公有云" tabindex="-1"><a class="header-anchor" href="#从-黑色星期五-到公有云" aria-hidden="true">#</a> 从“黑色星期五”到公有云</h2><p>现代公有云上的系统级虚拟机能够快速发展，其实和分时系统的设计思路是一脉相承的，这其实就是来自于电商巨头亚马逊大量富余的计算能力。</p><p>和国内有“双十一”一样，美国会有感恩节的“黑色星期五（Black Friday）”和“网络星期一（Cyber Monday）”，这样一年一度的大型电商促销活动。几天的活动期间，会有大量的用户进入亚马逊这样的网站，看商品、下订单、买东西。这个时候，整个亚马逊需要的服务器计算资源可能是平时的数十倍。</p><p>于是，亚马逊会按照“黑色星期五”和“网络星期一”的用户访问量，来准备服务器资源。这个就带来了一个问题，那就是在一年的 365 天里，有 360 天这些服务器资源是大量空闲的。要知道，这个空闲的服务器数量不是一台两台，也不是几十几百台。根据媒体的估算，亚马逊的云服务器 AWS 在 2014 年就已经超过了 150 万台，到了 2019 年的今天，估计已经有超过千万台的服务器。</p><p>平时有这么多闲着的服务器实在是太浪费了，所以，亚马逊就想把这些服务器给租出去。出租物理服务器当然是可行的，但是却不太容易自动化，也不太容易面向中小客户。</p><p>直接出租物理服务器，意味着亚马逊只能进行服务器的“整租”，这样大部分中小客户就不愿意了。为了节约数据中心的空间，亚马逊实际用的物理服务器，大部分多半是强劲的高端 8 核乃至 12 核的服务器。想要租用这些服务器的中小公司，起步往往只需要 1 个 CPU 核心乃至更少资源的服务器。一次性要他们去租一整台服务器，就好像刚毕业想要租个单间，结果你非要整租个别墅给他。</p><p>这个“整租”的问题，还发生在“时间”层面。物理服务器里面装好的系统和应用，不租了而要再给其他人使用，就必须清空里面已经装好的程序和数据，得做一次“重装”。如果我们只是暂时不用这个服务器了，过一段时间又要租这个服务器，数据中心服务商就不得不先重装整个系统，然后租给别人。等别人不用了，再重装系统租给你，特别地麻烦。</p><p>其实，对于想要租用服务器的用户来说，最好的体验不是租房子，而是住酒店。我住一天，我就付一天的钱。这次是全家出门，一次多定几间酒店房间就好啦。</p><p>而这样的需求，<em>用虚拟机技术来实现</em>，再好不过了。虚拟机技术，<em>使得我们可以在一台物理服务器上</em>，同时运行多个虚拟服务器，<em>并且可以动态去分配</em>，每个虚拟服务器占用的资源。对于不运行的虚拟服务器，我们也可以把这个虚拟服务器“关闭”。这个“关闭”了的服务器，就和一个被关掉的物理服务器一样，它不会再占用实际的服务器资源。但是，<em>当我们重新打开这个虚拟服务器的时候</em>，里面的数据和应用都在，不需要再重新安装一次。</p><h2 id="虚拟机的技术变迁" tabindex="-1"><a class="header-anchor" href="#虚拟机的技术变迁" aria-hidden="true">#</a> 虚拟机的技术变迁</h2><p>那虚拟机技术到底是怎么一回事呢？下面我带你具体来看一看，它的技术变迁过程，好让你能更加了解虚拟机，从而更好地使用它。</p><p><strong>虚拟机</strong>（Virtual Machine）技术，其实就是指在现有硬件的操作系统上，能够<strong>模拟</strong>一个计算机系统的技术。而模拟一个计算机系统，最简单的办法，其实不能算是虚拟机技术，而是一个模拟器（Emulator）。</p><h3 id="解释型虚拟机" tabindex="-1"><a class="header-anchor" href="#解释型虚拟机" aria-hidden="true">#</a> 解释型虚拟机</h3><p>要模拟一个计算机系统，最简单的办法，<em>就是兼容这个计算机系统的指令集</em>。我们可以开发一个应用程序，跑在我们的操作系统上。这个应用程序呢，<em>可以识别</em>我们想要模拟的、计算机系统的程序格式和指令，<em>然后一条条去解释执行</em>。</p><p>在这个过程中，我们把原先的操作系统叫作<strong>宿主机</strong>（Host），把能够有能力去模拟指令执行的软件，叫作<strong>模拟器</strong>（Emulator），而实际运行在模拟器上被“虚拟”出来的系统呢，我们叫<strong>客户机</strong>（Guest VM）。</p><p>这个方式，其实和运行 Java 程序的 Java 虚拟机很像。只不过，Java 虚拟机运行的是 <code>Java 自己定义发明的中间代码</code>，而不是一个特定的计算机系统的指令。</p><p>这种解释执行另一个系统的方式，有没有真实的应用案例呢？当然是有的，如果你是一个 Android 开发人员，你在开发机上跑的 Android 模拟器，其实就是这种方式。如果你喜欢玩一些老游戏，可以注意研究一下，很多能在 Windows 下运行的游戏机模拟器，用的也是类似的方式。</p><p>**这种解释执行方式的最大的优势就是，<em>模拟的系统可以跨硬件</em>。**比如，Android 手机用的 CPU 是 ARM 的，而我们的开发机用的是 Intel X86 的，两边的 CPU 指令集都不一样，<em>但是一样可以正常运行</em>。如果你想玩的街机游戏，里面的硬件早就已经停产了，那你自然只能选择 MAME 这样的模拟器。</p><img src="'+i+'" alt="img" style="zoom:25%;"><p>图片来源</p><p>MAME 模拟器的界面</p><p>不过这个方式也有两个明显的缺陷。</p><ul><li>第一个是，<strong>我们做不到精确的“模拟”</strong>。很多的老旧的硬件的程序运行，要依赖特定的电路乃至电路特有的时钟频率，想要通过软件达到 100% 模拟是很难做到的。</li><li>第二个缺陷就更麻烦了，那就是这种解释执行的方式，<strong>性能实在太差了</strong>。因为我们并不是直接把指令交给 CPU 去执行的，而是要经过各种解释和翻译工作。</li></ul><p>所以，虽然模拟器这样的形式有它的实际用途。甚至为了解决性能问题，也有类似于 Java 当中的 JIT 这样的“编译优化”的办法，<code>把本来解释执行的指令，编译成 Host 可以直接运行的指令</code>。但是，<em>这个性能还是不能让人满意</em>。毕竟，我们本来是想要把空余的计算资源租用出去的。如果我们空出来的计算能力算是个大平层，结果经过模拟器之后能够租出去的计算能力就变成了一个格子间，<em>那我们就划不来了</em>。</p><h3 id="type-1-和-type-2-虚拟机的性能提升" tabindex="-1"><a class="header-anchor" href="#type-1-和-type-2-虚拟机的性能提升" aria-hidden="true">#</a> Type-1 和 Type-2：虚拟机的性能提升</h3><p>所以，我们希望我们的虚拟化技术，能够克服上面的模拟器方式的两个缺陷。同时，我们可以放弃掉模拟器方式能做到的跨硬件平台的这个能力。因为毕竟对于我们想要做的云服务里的“服务器租赁”业务来说，中小客户想要租的也是一个 x86 的服务器。而另外一方面，<em>他们希望这个租用的服务器用起来，和直接买一台或者租一台物理服务器没有区别</em>。作为出租方的我们，<em>也希望服务器不要因为用了虚拟化技术，而在中间损耗掉太多的性能</em>。</p><p>所以，首先我们需要一个“全虚拟化”的技术，也就是说，我们可以在现有的物理服务器的硬件和操作系统上，去跑一个完整的、不需要做任何修改的客户机操作系统（Guest OS）。那么，我们怎么在一个操作系统上，再去跑多个完整的操作系统呢？答案就是，我们自己做软件开发中很常用的一个解决方案，<code>就是加入一个中间层</code>。在虚拟机技术里面，这个中间层就叫作<strong>虚拟机监视器</strong>，英文叫 VMM（Virtual Machine Manager）或者 Hypervisor。</p><img src="'+c+'" alt="img" style="zoom:25%;"><p>如果说我们<mark>宿主机的 OS</mark> 是房东的话，这个<mark>虚拟机监视器</mark>呢，就好像一个二房东。我们运行的虚拟机，都不是直接和房东打交道，而是要和这个二房东打交道。我们跑在上面的虚拟机呢，会把整个的硬件特征都映射到虚拟机环境里，这包括整个完整的 <mark>CPU 指令集</mark>、<mark>I/O 操作</mark>、<mark>中断</mark>等等。</p><p>既然要通过虚拟机监视器这个二房东，我们实际的指令是怎么落到硬件上去实际执行的呢？这里有两种办法，也就是 Type-1 和 Type-2 这两种类型的虚拟机。</p><h4 id="type2-个人电脑" tabindex="-1"><a class="header-anchor" href="#type2-个人电脑" aria-hidden="true">#</a> Type2：个人电脑</h4><p>我们先来看 Type-2 类型的虚拟机。在 Type-2 虚拟机里，我们上面说的<mark>虚拟机监视器</mark>好像一个运行在操作系统上的<mark>软件</mark>。你的客户机的操作系统呢，<em>把最终到硬件的所有指令</em>，都发送给<mark>虚拟机监视器</mark>。而虚拟机监视器，又会把这些指令再交给<mark>宿主机的操作系统</mark>去执行。</p><p>那这时候你就会问了，这和上面的模拟器看起来没有那么大分别啊？看起来，<em>我们只是把在<mark>模拟器</mark>里的指令翻译工作，挪到了<mark>虚拟机监视器</mark>里</em>。没错，Type-2 型的虚拟机，<strong>更多是用在我们日常的个人电脑里</strong>，而不是用在数据中心里。</p><h4 id="type1-数据中心" tabindex="-1"><a class="header-anchor" href="#type1-数据中心" aria-hidden="true">#</a> Type1：数据中心</h4><p>在数据中心里面用的虚拟机，我们通常叫作 Type-1 型的虚拟机。这个时候，<strong>客户机的指令</strong>交给<mark>虚拟机监视器</mark>之后呢，<em>不再需要通过宿主机的操作系统</em>，才能调用硬件，<em>而是可以直接由<mark>虚拟机监视器</mark>去调用硬件</em>。</p><p>另外，在数据中心里面，我们并不需要在 Intel x86 上面去跑一个 ARM 的程序（<em>不需要跨硬件</em>），而是直接在 x86 上虚拟一个 x86 硬件的计算机和操作系统。所以，我们的指令不需要做什么翻译工作，可以直接往下传递执行就好了，所以指令的执行效率也会很高。</p><p>所以，在 Type-1 型的虚拟机里，我们的<mark>虚拟机监视器</mark>其实<strong>并不是</strong>一个操作系统之上的应用层程序，<em>而是一个嵌入在操作系统内核里面的一部分</em>。无论是 KVM、XEN 还是微软自家的 Hyper-V，其实都是<em>系统级的程序</em>。</p><img src="'+h+'" alt="img" style="zoom:25%;"><p><strong>因为虚拟机监视器需要直接和硬件打交道，所以它也需要包含能够直接操作硬件的驱动程序。<em>所以 Type-1 的虚拟机监视器更大一些，同时兼容性也不能像 Type-2 型那么好</em></strong>。不过，因为它一般都是部署在我们的数据中心里面，硬件完全是统一可控的，这倒不是一个问题了。</p><h3 id="docker-新时代的最佳选择" tabindex="-1"><a class="header-anchor" href="#docker-新时代的最佳选择" aria-hidden="true">#</a> Docker：新时代的最佳选择？</h3><p>虽然，Type-1 型的虚拟机看起来已经没有什么硬件损耗。但是，这里面还是有<em>一个浪费的资源</em>。在我们实际的物理机上，我们可能同时运行了多个的虚拟机，而这<em>每一个虚拟机</em>，都运行了<em>一个属于自己的单独的操作系统</em>。</p><p>多运行一个操作系统，意味着我们要多消耗一些资源在 CPU、内存乃至磁盘空间上。<strong>那我们能不能不要多运行的这个操作系统呢</strong>？</p><p>其实是可以的。<em>因为我们想要的未必是一个完整的、独立的、全虚拟化的虚拟机</em>。我们很多时候想要租用的不是“独立服务器”，<em>而是独立的计算资源</em>。在服务器领域，我们开发的程序都是跑在 Linux 上的。其实我们并不需要一个独立的操作系统，只要一个能够进行资源和环境隔离的“<mark>独立空间</mark>”就好了。那么，能够满足这个需求的解决方案，就是过去几年特别火热的 Docker 技术。使用 Docker 来搭建微服务，可以说是过去两年大型互联网公司的必经之路了。</p><img src="'+k+'" alt="img" style="zoom:25%;"><p>在实践的服务器端的开发中，虽然我们的<mark>应用环境</mark>需要<strong>各种各样不同的依赖</strong>，可能是不同的 PHP 或者 Python 的版本，可能是操作系统里面不同的系统库，但是通常来说，我们其实都是跑在 Linux 内核上的。通过 Docker，我们不再需要在操作系统上再跑一个操作系统，而只需要通过<mark>容器编排工具</mark>，比如 Kubernetes 或者 Docker Swarm，能够进行<strong>各个应用之间的环境和资源隔离</strong>就好了。</p><p>这种隔离资源的方式呢，也有人称之为“操作系统级虚拟机”，好和上面的全虚拟化虚拟机对应起来。不过严格来说，Docker 并不能算是一种虚拟机技术，而只能算是一种<code>资源隔离的技术</code>而已。</p><h2 id="总结延伸" tabindex="-1"><a class="header-anchor" href="#总结延伸" aria-hidden="true">#</a> 总结延伸</h2><p>这一讲，我从最古老的分时系统讲起，介绍了虚拟机的相关技术。我们现在的云服务平台上，你能够租到的服务器其实都是虚拟机，而不是物理机。而正是虚拟机技术的出现，使得整个云服务生态得以出现。</p><p>虚拟机是模拟一个计算机系统的技术，而其中最简单的办法叫<mark>模拟器</mark>。我们日常在 PC 上进行 Android 开发，其实就是在使用这样的模拟器技术。不过模拟器技术在性能上实在不行，所以我们才有了虚拟化这样的技术。</p><p>在宿主机的操作系统上，运行一个<mark>虚拟机监视器</mark>，然后再在虚拟机监视器上运行客户机的操作系统，这就是现代的虚拟化技术。这里的虚拟化技术可以分成 Type-1 和 Type-2 这两种类型。</p><p><mark>Type-1 类型</mark>的虚拟化机，实际的指令不需要再通过宿主机的操作系统，而可以直接通过虚拟机监视器访问硬件，<em>所以性能比 Type-2 要好</em>。而 <mark>Type-2 类型</mark>的虚拟机，所有的指令需要经历客户机操作系统、虚拟机监视器、宿主机操作系统，所以性能上要慢上不少。不过因为经历了宿主机操作系统的一次“翻译”过程，<em>它的硬件兼容性往往会更好一些</em>。</p><p>今天，即使是 Type-1 型的虚拟机技术，我们也会觉得有一些性能浪费。我们常常在同一个物理机上，跑上 8 个、10 个的虚拟机。而且这些虚拟机的操作系统，其实都是同一个 Linux Kernel 的版本。于是，<mark>轻量级的 Docker 技术</mark>就进入了我们的视野。Docker 也被很多人称之为“操作系统级”的虚拟机技术。不过 Docker 并没有再单独运行一个客户机的操作系统，而是直接运行在宿主机操作系统的内核之上。所以，Docker 也是现在流行的微服务架构底层的基础设施。</p><h2 id="推荐阅读" tabindex="-1"><a class="header-anchor" href="#推荐阅读" aria-hidden="true">#</a> 推荐阅读</h2><p>又到了阅读英文文章的时间了。想要更多了解虚拟机、Docker 这些相关技术的概念和知识，特别是进一步理解 Docker 的细节，你可以去读一读 FreeCodeCamp 里的A Beginner-Friendly Introduction to Containers, VMs and Docker这篇文章。</p><h2 id="课后思考" tabindex="-1"><a class="header-anchor" href="#课后思考" aria-hidden="true">#</a> 课后思考</h2><p>我们在程序开发过程中，除了会用今天讲到的系统级虚拟机之外，还会常常遇到 Java 虚拟机这样的进程级虚拟机。那么，JVM 这个进程级虚拟机是为了解决什么问题而出现的呢？今天我们讲到的系统级虚拟机发展历程中的各种优化手段，有哪些是 JVM 中也可以通用的呢？</p><p>欢迎留言和我分享你的疑惑和见解。如果有收获，你也可以把今天的文章分享给你朋友。</p>',65),b=e("p",null,"JVM的两个核心优化，第一个是通过编译成中间语言，在实际解释器执行的时候简化了中间语言到机器指令的难度。第二个是JIT技术，也就是通过收集程序运行中反复执行的中间代码，直接编译成机器指令来执行，加速执行速度。JVM并不能解决减少指令操作，和计算CPU的计算时间问题。 本质上，JVM是操作系统上的一个应用程序，为了实现跨平台，甚至有可能会在特定的硬件上增加一些指令操作，增加CPU的计算时间。",-1),y={href:"https://www.freecodecamp.org/news/a-beginner-friendly-introduction-to-containers-vms-and-docker-79a9e3e119b/",target:"_blank",rel:"noopener noreferrer"},_=e("p",null,"JVM主要应该是解决跨平台问题，即一次编码，处处运行。从优化的角度，解释执行会损耗效率，可以通过jit编译成本地机器码运行提高执行效率。 Java程序最初是通过解释器（Interpreter）进行解释执行的，这样java程序启动时不会感觉太慢；启动并运行后，当虚拟机发现某个方法或代码块的运行特别频繁时，就会把这些代码认定为“热点代码”。为了提高热点代码的执行效率，在运行时，虚拟机将会把这些代码编译成与本地平台相关的机器码，并进行各种层次的优化，完成这个任务的编译器称为即时编译器（Just In Time Compiler，JIT编译器）。",-1);function u(f,x){const r=t("ExternalLinkIcon");return n(),p("div",null,[g,e("blockquote",null,[b,e("p",null,[a("可结合此篇享用："),e("a",y,[a("https://www.freecodecamp.org/news/a-beginner-friendly-introduction-to-containers-vms-and-docker-79a9e3e119b/"),m(r)])]),_])])}const J=o(l,[["render",u],["__file","E34-理解虚拟机.html.vue"]]);export{J as default};
