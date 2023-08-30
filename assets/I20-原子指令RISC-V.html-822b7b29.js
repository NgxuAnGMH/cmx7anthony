import{_ as l}from"./plugin-vue_export-helper-c27b6911.js";import{r as d,o as r,c,a as n,b as s,e,d as i}from"./app-cdabc73c.js";const t="/assets/63dd2d2589ac474ceb0e85125013e7yy-deddf495.jpg",v="/assets/5e442ac8534cb7fde44f1093ae975c65-6fe0f4ab.jpg",o="/assets/c061912fd5d68b00bc456ce040ce980a-197c94e8.jpg",p="/assets/39559e50b805e88c4facd4e94e2d950b-238b54b3.jpg",u="/assets/f477aab470a5bc4219c3c8ab0yy0f317-dab7703d.jpg",m="/assets/13c2d631c9d0474c399d0b4233652974-54a694aa.jpg",b="/assets/d446903195a61cc8fddd5f9326e53a98-718b0840.jpg",g="/assets/81306a794e7d25434da842a490dea514-46616f8d.jpg",k={},x=n("h1",{id:"_20-risc-v指令精讲-五-原子指令实现与调试",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#_20-risc-v指令精讲-五-原子指令实现与调试","aria-hidden":"true"},"#"),s(" 20｜RISC-V指令精讲（五）：原子指令实现与调试")],-1),_=n("p",null,"你好，我是 LMOS。",-1),h=n("p",null,"通过前面的课程，我们学过了 RISC-V 的各种跳转指令以及这些指令的各种变形，并且了解了它们的机器编码。",-1),f=n("p",null,"今天，我们开始学习 RISC-V 下的原子指令，原子指令是 RISC-V 的指令扩展，命名为 ‘A’。这个扩展指令中包含两部分，分别是 LR/SC 指令和 AMO 指令。",-1),C=n("p",null,"我们先搞明白为什么需要原子指令，什么情况用得上它们。再分别学习和对比 LR/SC 指令与 AMO 指令，另外，我还会让你知道这些指令各自的使用场景是什么。",-1),S={href:"https://gitee.com/lmos/Geek-time-computer-foundation/tree/master/lesson20",target:"_blank",rel:"noopener noreferrer"},w=i(`<h3 id="为什么需要原子指令" tabindex="-1"><a class="header-anchor" href="#为什么需要原子指令" aria-hidden="true">#</a> 为什么需要原子指令</h3><p>你对学生时代上的物理课还有什么印象么？那时候我们就接触过“原子”这个概念了。“原子”是物质的最小组成，即原子是不可分割的。虽然到现在科学家已经发现在原子内部有更小的成分，但是在广义上原子仍然保持“不可分割”的语义。</p><p>那么在芯片中的原子指令是什么呢？它延续了“不可分割”这个含义，表示<strong>该指令的执行是不可分割的，完成的操作不会被其它外部事件打断。</strong></p><p>我们结合一段代码，来了解原子指令的具体作用和使用场景。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//全局变量A
int A = 0;
//线程A执行的函数
void thread_a()
{
    A++;
    printf(&quot;ThreadA A is:%d\\n&quot;，A);
    return;
}
//线程B执行的函数
void thread_b()
{
    A++;
    printf(&quot;ThreadB A is:%d\\n&quot;，A);
    return;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上两个函数，分别由不同的线程运行，都是对全局变量 A 加 1 后打印出来。让我们暂停一下想想看，你认为程序的打印结果是什么？</p><p>也许你的判断是两种情况，即输出 A 值 1、 2；A 值：2、2。但你把代码跑一下试试，就会发现结果出乎意料。除了前面两种情况，还多了一个可能：A 值：1、1。这就很奇怪了，为什么出现这种情况呢？</p><p>原因便是 A++ 不是原子指令实现的不可分割操作，它可以转化为后面这样的 CPU 指令形式。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>load reg，A    #加载A变量到寄存器
Add reg，1    #对寄存器+1
store A，reg   #储存寄存器到A变量
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们已经看到了，A++ 被转换成了三条指令，有可能线程 A 执行了上面第一行指令，线程 B 也执行了上面第一行指令，这时就会出现线程 A、B 都输出 1 的情况。其本质原因是，这三条指令是独立、可分割的。</p><p>解决这个问题的方案不止一种。我们可以使用操作系统的**线程同步机制，**让线程 A 和线程 B 串行执行，即 thread_a 函数执行完成了，再执行 thread_b 函数。另一种方案是使用原子指令，<strong>利用原子指令来保证对变量 A 执行的操作</strong>，也就是加载、计算、储存这三步是不可分割的，即一条指令能原子地完成这三大步骤。</p><p>现实中，小到多个线程共享全局变量，大到多个程序访问同一个文件，都需要保证数据的一致性。对于变量可以使用原子指令，而文件可以利用原子指令实现文件锁，来同步各个进程对文件的读写。这就是原子指令存在的价值。</p><p>为了实现这些原子操作，一款 CPU 在设计实现时，就要考虑提供完成这些功能的指令，RISC-V 也不例外，原子指令是现代 CPU 中不可或缺的一种指令，除非你的 CPU 是单个核心，没有 cache，且不运行操作系统。显然，RISC-V 架构的 CPU，不是那种类型的 CPU。</p><p>搞清楚了为什么需要原子指令，我们接下来就去看看，RISC-V 究竟提供了哪些原子指令？</p><h3 id="lr-sc-指令" tabindex="-1"><a class="header-anchor" href="#lr-sc-指令" aria-hidden="true">#</a> LR/SC 指令</h3><p>首先 RISC-V 提供了 LR/SC 指令。这虽然是两条指令，但却是一对好“搭档”，它们需要配合才能实现原子操作，缺一不可。看到后面，你就会知道这是为什么了，我们先从这两条指令用在哪里说起。</p><p>在原子的比较并交换操作中，常常会用到 LR/SC 指令，这个操作在各种加锁算法中应用广泛。我们先来看看这两条指令各自执行了什么操作。</p><p>LR 指令是个缩写，全名是 Load Reserved，即保留加载；而 SC 指令的缩写展开是 Store Conditional，即条件存储。</p><p>我们先来看看它们在汇编代码中的书写形式，如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>lr.{w/d}.{aqrl} rd，(rs1)
#lr是保留加载指令
#{可选内容}W（32位）、D（64位）
#aqrl为内存顺序，一般使用默认的
#rd为目标寄存器
#rs1为源寄存器1
    
sc.{w/d}.{aqrl} rd，rs2，(rs1)
#sc是条件储存指令
#{可选内容}W（32位）、D（64位）
#aqrl为内存顺序，一般使用默认的
#rd为目标寄存器
#rs1为源寄存器1
#rs2为源寄存器2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中，rd、rs1、rs2 可以是任何通用寄存器。“{}&quot;中的内容不是必须填写的，汇编器能根据当前的运行环境自动设置。</p><p>LR 指令和 SC 指令完成的操作，用伪代码可以这样描述：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//lr指令
rd = [rs1]
reservation_set(cur_hart)
//sc指令
if (is_reserved(rs1)) {
    *rs1 = rs2
    rd = 0
} else
    rd = 1
clean_reservation_set(cur_hart)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>观察上述伪代码，我们先看看 LR 指令做了什么：rs1 寄存器的数据就是内存地址，指定了 LR 指令从哪里读取数据。LR 会从该地址上加载一个 32 位或者 64 位的数据，存放到 rd 寄存器中。这个地址需要 32 位或者 64 位对齐，加载之后会设置当前 CPU hart（RISC-V 中的核心）读取该地址的保留位。</p><p>而 SC 指令则是先判断 rs1 中对应地址里的保留位（reservation set）有没有被设置。如果被设置了，则把 rs2 的数据写入 rs1 为地址上的内存中，并在 rd 中写入 0；否则将向 rd 中写入一个非零值，这个值并不一定是 1，最后清除当前对应 CPU hart（RISC-V 中的核心）在该地址上设置的保留位。</p><p>从上面的描述，我们发现，SC 指令不一定执行成功，只有满足后面这四个条件，它才能执行成功：</p>`,26),R={href:"http://1.LR",target:"_blank",rel:"noopener noreferrer"},L={href:"http://2.LR",target:"_blank",rel:"noopener noreferrer"},A={href:"http://3.LR",target:"_blank",rel:"noopener noreferrer"},y={href:"http://4.LR",target:"_blank",rel:"noopener noreferrer"},q=i(`<p>而这些条件正是 LR/SC 指令保持原子性的关键所在。</p><p>下面我们一起写代码验证一下。为了方便调试，我们的代码组织结构还是从写一个 main.c 文件开始，然后在其中写上 main 函数，因为这是链接器所需要的。接着我们写一个 lrsc.S 文件，并在里面用汇编写上 lrsc_ins 函数，这些操作在前面课程中我们已经反复做过了。</p><p>代码如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.globl lrsc_ins
#a0内存地址
#a1预期值
#a2所需值
#a0返回值，如果成功，则为0！否则为1
lrsc_ins:
cas:
    lr.w t0，(a0)       #加载以前的值
    bne t0，a1，fail    #不相等则跳转到fail
    sc.w a0，a2，(a0)   #尝试更新
    jr ra               #返回
fail:
    li a0，1            #a0 = 1
    jr ra               #返回
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，lrsc_ins 函数就写好了。</p><p>我结合上面的代码再带你理解一下：这个函数首先通过 LR 指令把 a0 中的数据（也就是地址信息）加载到 t0 中，如果 t0 和 a1 不相等，则跳转到 fail 处，将 a0 置 1 并返回；否则继续顺序执行，通过 SC 指令将 a2 的数据写入到 a0 为地址的内存中，写入成功则将 a0 置 0，不成功则置为非零。SC 指令执行成功与否，要看是否满足上面那 4 个条件，最后返回。</p><p>我们在 main.c 文件中声明一下这两个函数并调用它，再用 VSCode 打开工程目录，按下“F5”键调试一下，如下所示：</p><figure><img src="`+t+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图是执行“lr.w t0，(a0)”指令后的状态。下一步我们将执行 bne 比较指令，继续做两步单步调试，目的是执行 SC 指令，如下所示：</p><figure><img src="'+v+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图是执行“sc.w a0，a2，(a0)”指令后的状态。由于 SC 指令执行时满足上述四大条件，所以 SC 会把 a2 的内容写入 a0 为地址的内存中，并将 a0 置 0，最后返回到 main 函数中，如下所示：</p><figure><img src="'+o+`" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图描述的过程是，main 函数调用 lrsc_ins 函数后，然后调用 printf 输出返回的结果，在终端中的输出为 result:0，val:1。这个结果在我们的预料之中，也验证了 LR/SC 指令正如我们前面所描述的那样。</p><p>通过这种 LR/SC 指令的组合，确实可以实现原子的比较并交换的操作，在计算机行业中也称为 <strong>CAS 指令</strong>。这种 CAS 指令是实现系统中各种同步锁的基础设施，这也是为什么我在写代码时，同时使用 lrsc_ins 和 cas 两个标号的用意。</p><p>我们再看一个例子加深印象，代码如下所示：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">int</span> <span class="token function">cas</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token operator">*</span> lock<span class="token punctuation">,</span> <span class="token keyword">int</span> cmp<span class="token punctuation">,</span> <span class="token keyword">int</span> lockval<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 声明cas函数</span>
<span class="token keyword">int</span> lock <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token comment">//初始化锁</span>
<span class="token keyword">void</span> <span class="token function">LockInit</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token operator">*</span> lock<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token operator">*</span>lock <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//加锁</span>
<span class="token keyword">int</span> <span class="token function">Lock</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token operator">*</span> lock<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">int</span> status<span class="token punctuation">;</span>
    status <span class="token operator">=</span> <span class="token function">cas</span><span class="token punctuation">(</span>lock<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span>status <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token number">1</span><span class="token punctuation">;</span><span class="token comment">//加锁成功</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">//加锁失败</span>
<span class="token punctuation">}</span>
<span class="token comment">//解锁</span>
<span class="token keyword">int</span> <span class="token function">UnLock</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token operator">*</span> lock<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">int</span> status<span class="token punctuation">;</span>
    status <span class="token operator">=</span> <span class="token function">cas</span><span class="token punctuation">(</span>lock<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span>status <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token number">1</span><span class="token punctuation">;</span><span class="token comment">//解锁成功</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">//解锁失败</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码是一个加解锁的例子，返回 1 表示加、解锁操作成功；返回 0 表示加、解锁操作失败；lock 为 0 表示解锁状态，为 1 则表示上锁状态。加、解锁操作最关键的点在于<strong>这个操作是原子的，不能被打断，而这正是 LR/SC 指令的作用所在。</strong></p><p>经过刚刚的调试，LR/SC 指令的功能细节我们已经心中有数了。现在我们继续一起看看它的二进制数据。</p><p>打开终端，切换到工程目录下，输入命令：riscv64-unknown-elf-objdump -d ./main.elf &gt; ./main.ins，就会得到 main.elf 的反汇编数据文件 main.ins。我们打开这个文件，就会看到它们的二进制数据，如下所示：</p><figure><img src="`+p+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>我们一起看看上图中的反汇编代码，这里编译器为了节约内存，使用了一些压缩指令，也就是 RISC-V 的 C 类扩展指令。</p><p>比如 ret 的机器码是 0x8082，li a0，1 的机器码为 0x4505，它们只占用 16 位编码，即二字节。</p><p>上图机器码与汇编语句的对应关系如下表所示：</p><figure><img src="'+u+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>让我们继续一起来拆分一下 LR、SC 指令的各位段的数据，看看它是如何编码的。对照后面的示意图你更容易理解：</p><figure><img src="'+m+`" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>LR/SC 指令的操作码和功能码都是相同的，它们俩是靠 27 位~31 位来区分的。其它的寄存器位段在前面的课程中已经介绍得相当详细了，而 aq-rl 位段是用来设置计算储存顺序的，使用默认的就行，这里我们就不深入研究了。</p><h3 id="amo-指令" tabindex="-1"><a class="header-anchor" href="#amo-指令" aria-hidden="true">#</a> AMO 指令</h3><p>前面，我们通过例子演示了 LR/SC 指令如何实现锁的功能。基于此，我们给操作对象加锁，就能执行更多逻辑上的“原子”操作。但这方式也存在问题，实现起来很复杂，对于单体变量，使用这种方式代价很大。</p><p>因此 AMO 类的指令应运而生。这也是一类原子指令，它们相比 LR/SC 指令用起来更方便。因为也属于原子指令，所以每个指令完成的操作同样是不可分割，不能被外部事件打断的。</p><p><strong>AMO 是 Atomic Memory Operation 的缩写，即原子内存操作。AMO 指令又分为几类，分别是原子交换指令、原子加法指令、原子逻辑指令和原子取大小值指令。</strong></p><p>大部分调试指令的操作，我们都在前几节课里学过了，这里我们不再深入调试，只是用这些指令来写一些可执行的代码，方便我们了解其原理就行了。调试过程和前面的一样。你自己有兴趣可以自己动手调试。</p><p>首先我们来看看原子交换指令，它能执行寄存器和内存中的数据交换，并保证该操作的原子性，其汇编代码形式如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>amoswap.{w/d}.{aqrl} rd,rs2,(rs1)
#amoswap是原子交换指令
#{可选内容}W（32位）、D（64位）
#aqrl为内存顺序，一般使用默认的
#rd为目标寄存器
#rs1为源寄存器1
#rs2为源寄存器2 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中 rd、rs1、rs2 可以是任何通用寄存器。“{}&quot;中的可以不必填写，汇编器能根据当前的运行环境自动设置。</p><p>我们用伪代码来描述一下 amoswap 指令完成的操作，你会看得更清楚。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//amoswap
rd = *rs1
*rs1 = rs2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>观察上述伪代码，amoswap 指令是把 rs1 中的数据当成内存地址，加载了该地址上一个 32 位或者 64 位的数据到 rd 寄存器中。然后把 rs2 中的数据，写入到 rs1 指向的内存单元中，实现 rs2 与内存单元的数据交换，该地址需要 32 位或者 64 位对齐。这两步操作是原子的、不可分割的。</p><p>下面，我们在工程目录中建立一个 amo.S 文件，并在其中用汇编写上 amoswap_ins 函数，代码如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.globl amoswap_ins
#a0内存地址
#a1将要交换的值
#a0返回值
amoswap_ins:
    amoswap.w a0, a1, (a0)  #原子交换a0=[a0]=a1
    jr ra                   #返回
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们直接看代码里的 amoswap_ins 函数，其中 amoswap 指令的作用是，把 a0 地址处的内存值读取到 a0 中，然后把 a1 的值写入 a0 中的地址处的内存中，完成了原子交换操作。你可以自己进入工程调试一下。</p><p>接着我们来看看原子加法指令，这类指令能把寄存器和内存中的数据相加，并把相加结果写到内存里，然后返回内存原有的值。原子加法指令的汇编代码形式如下所示。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>amoadd.{w/d}.{aqrl} rd,rs2,(rs1)
#amoadd是原子加法指令
#{可选内容}W（32位）、D（64位）
#aqrl为内存顺序，一般使用默认的
#rd为目标寄存器
#rs1为源寄存器1
#rs2为源寄存器2 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中除了指令符和原子交换指令不同，其它都是一样的，amoadd 指令完成的操作用伪代码描述如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//amoadd
rd = *rs1
*rs1 = *rs1 + rs2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们观察一下 amoadd 指令都做了什么。它把 rs1 中的数据当成了内存地址，先把该地址上一个 32 位或者 64 位的数据，读到 rd 寄存器中。然后把 rs2 的数据与 rs1 指向的内存单元里的数据相加，结果写入到该地址的内存单元中，该地址仍需要 32 位或者 64 位对齐。这两步操作是不可分割的。</p><p>下面我们在 amo.S 文件中用汇编写上 amoadd_ins 函数，代码如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.globl amoadd_ins
#a0内存地址
#a1相加的值
#a0返回值
amoadd_ins:
    amoadd.w a0, a1, (a0)  #原子相加a0=[a0] [a0]=[a0] + a1
    jr ra                  #返回
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中，amoadd_ins 函数中的 amoadd 指令，把 a0 中的地址处的内存值读取到 a0 中，然后把 a1 的值与 a0 中的地址处的内存中的数据相加，结果写入该地址的内存单元中，这操作是原子执行的，完成了原子加法操作。指令的调试你可以课后自己练一练。</p><p>我们继续研究原子逻辑操作指令，一共有三条，分别是原子与、原子或、原子异或。它们和之前的逻辑指令功能相同，只不过它们在保证原子性的同时，还能直接对内存地址中的数据进行操作。</p><p>原子逻辑操作指令的汇编代码形式如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>amoand.{w/d}.{aqrl} rd,rs2,(rs1)
amoor.{w/d}.{aqrl} rd,rs2,(rs1)
amoxor.{w/d}.{aqrl} rd,rs2,(rs1)
#amoand是原子按位与指令
#amoor是原子按位或指令
#amoxor是原子按位异或指令
#{可选内容}W（32位）、D（64位）
#aqrl为内存顺序，一般使用默认的
#rd为目标寄存器
#rs1为源寄存器1
#rs2为源寄存器2 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中三条指令，除了指令符不同，其它是一样的，rd、rs1、rs2 可以是任何通用寄存器。“{}&quot;中的可以不必填写，汇编器能根据当前的运行环境自动设置。</p><p>amoand、amoor、amoxor 三条指令各自完成的操作，我们分别用伪代码描述一下，如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//amoand
rd = *rs1
*rs1 = *rs1 &amp; rs2
//amoor
rd = *rs1
*rs1 = *rs1 | rs2
//amoxor
rd = *rs1
*rs1 = *rs1 ^ rs2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的伪代码中，都是把 rs1 中数据当成地址，把该地址内存单元中的数据读取到 rd 中，然后进行相应的按位与、或、异或操作，最后把结果写入该地址的内存单元中。这些操作是不可分割的，且地址必须对齐到处理器位宽。</p><p>下面我们在 amo.S 文件中用汇编写上三个函数，代码如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.globl amoand_ins
#a0内存地址
#a1相与的值
#a0返回值
amoand_ins:
    amoand.w a0, a1, (a0)   #原子相与a0 = [a0] [a0] = [a0] &amp; a1
    jr ra                   #返回

.globl amoor_ins
#a0内存地址
#a1相或的值
#a0返回值
amoor_ins:
    amoor.w a0, a1, (a0)    #原子相或a0 = [a0] [a0] = [a0] | a1
    jr ra                   #返回

.globl amoxor_ins
#a0内存地址
#a1相异或的值
#a0返回值
amoxor_ins:
    amoxor.w a0, a1, (a0)   #原子相异或a0 = [a0] [a0] = [a0] ^ a1
    jr ra                   #返回
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这段代码中，amoand_ins、amoor_ins、amoxor_ins 三个函数，都是把 a0 中数据作为地址，把该地址内存单元中的值读取到 a0 中。然后，再对 a1 的值与该地址内存单元中的数据进行与、或、异或操作，把结果写入该地址的内存单元中，这样就完成了原子与、或、异或操作。调试的思路和前面指令一样，我就不重复了。</p><p>最后，我们来看看原子取大小值的指令，它包括无符号数和有符号数版本，一共是四条指令，分别是：原子有符号取大值指令、原子无符号取大值指令、原子有符号取小值指令、原子无符号取小值指令。</p><p>汇编代码形式如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>amomax.{w/d}.{aqrl} rd,rs2,(rs1)
amomaxu.{w/d}.{aqrl} rd,rs2,(rs1)
amomin.{w/d}.{aqrl} rd,rs2,(rs1)
amominu.{w/d}.{aqrl} rd,rs2,(rs1)
#amomax是原子有符号取大值指令
#amomaxu是原子无符号取大值指令
#amomin是原子有符号取小值指令
#amominu是原子无符号取小值指令
#{可选内容}W（32位）、D（64位）
#aqrl为内存顺序，一般使用默认的
#rd为目标寄存器
#rs1为源寄存器1
#rs2为源寄存器2 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中四条指令，除了指令符不同，其它内容是一样的。</p><p>我们用伪代码来描述一下 amomax、amomaxu、amomin、amominu 四条指令各自完成的操作，形式如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>max(a,b)
{
    if(a &gt; b)
        return a;
    else
        return b;
}
min(a,b)
{
    if(a &lt; b)
        return a;
    else
        return b;
}
exts(a)
{
    return 扩展符号(a)
}
//amomax
rd = *rs1
*rs1 = max(exts(*rs1),exts(rs2))
//amomaxu
rd = *rs1
*rs1 = *rs1 = max(*rs1,rs2)
//amomin
rd = *rs1
*rs1 = min(exts(*rs1),exts(rs2))
//amominu
rd = *rs1
*rs1 = *rs1 = min(*rs1,rs2)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>观察上面的伪代码，我们可以看到 max 函数可以返回两数之间的大数、min 函数可以返回两数之间的小数，exts 函数负责处理数据的符号。</p><p>我们对比学习这几条指令，理解起来更容易。上面的 amomax、amomaxu 指令都是把 rs1 中数据当成地址，把该地址内存单元中的数据读取到 rd 中，然后与 rs2 进行比较。最后，把两者之间大的那个数值写入该地址的内存单元中，区别是比较时的数据有无符号。</p><p>而 amomin、amominu 指令则是把 rs1 中数据当成地址，把该地址内存单元中的数据读取到 rd 中，然后与 rs2 进行比较，最后把两者之间小的数值写入该地址的内存单元中。这两个指令的区别同样是比较时的数据有无符号。</p><p>下面我们在 amo.S 文件中用汇编写上四个函数，代码如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.globl amomax_ins
#a0内存地址
#a1相比的值
#a0返回值
amomax_ins:
    amomax.w a0, a1, (a0)   #原子相与a0 = [a0] [a0] = max([a0] , a1)
    jr ra                   #返回

.globl amomaxu_ins
#a0内存地址
#a1相比的值
#a0返回值
amomaxu_ins:
    amomaxu.w a0, a1, (a0)   #原子相与a0 = [a0] [a0] = maxu([a0] , a1)
    jr ra                   #返回

.globl amomin_ins
#a0内存地址
#a1相比的值
#a0返回值
amomin_ins:
    amomin.w a0, a1, (a0)   #原子相与a0 = [a0] [a0] = min([a0] , a1)
    jr ra                   #返回

.globl amominu_ins
#a0内存地址
#a1相比的值
#a0返回值
amominu_ins:
    amominu.w a0, a1, (a0)   #原子相与a0 = [a0] [a0] = minu([a0] , a1)
    jr ra                    #返回
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中，amomax_ins、amomaxu_ins、amomin_ins、amominu_ins 四个函数，都是把 a0 中数据作为地址，把该地址内存单元中的值读取到 a0 中，然后把 a1 的值与该地址内存单元中的数据进行比较操作，结果取大或者取小，最后把结果写入该地址的内存单元中，这些操作都是原子执行的、不可分割。你可以自己进入工程调试一下。</p><p>下面我们一起把这些 amo 指令进行测试，相关代码我已经帮你写好了，我们工程项目按下“F5”来调试。下面是指令调用后的打印结果截图，你可以对照一下。</p><figure><img src="`+b+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>截图中的输出与我们预期的结果分毫不差，这说明我们用相关指令编写的汇编函数所完成的功能是正确无误的。</p><p>至此，关于 RISC-V 所有的原子指令，一共有 11 条指令，我们就全部学完了。这些指令分别完成不同的功能，重要的是它们的原子特性，特别是 AMO 类指令，在处理一些全局共享的单体变量时相当有用。</p><h3 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾" aria-hidden="true">#</a> 重点回顾</h3><p>现在我们一起来回顾一下今天所学内容。</p><p>首先，我们讨论了为什么一款芯片需要有原子指令，从这里入手来了解原子指令的特性，它具有操作不可分割性。所以，原子指令是现代高级通用芯片里不可缺少的，是系统软件或者应用软件现实共享数据保护，维护共享数据一致性的重要基础依赖设施。</p><p>RISC-V 的原子指令中包含两部分，分别是 LR/SC 指令和 AMO 指令。</p><p>LR/SC 指令必须成对使用，才能达到原子效果，在执行 LR 指令的同时，处理器会设置相应的标志位，用于监控其内存地址上有没有其它 hart 访问，有没有产生中断异常，有没有执行 MRET 指令。只要发生上述情况里的一种，就会导致 SC 指令执行失败。通过这样的规则，才能确保 LR 与 SC 指令之间的操作是原子的。</p><p>不过，有时候 LR/SC 指令用起来还是挺复杂的，所以 AMO 类指令（即原子内存操作）应运而生。RISC-V 提供了一系列 AMO 类指令，它们是原子交换指令、原子加法指令、原子逻辑指令、原子取大小指令，这些指令相比 LR、SC 指令，使用起来更加方便。</p><figure><img src="'+g+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><h3 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题" aria-hidden="true">#</a> 思考题</h3><p>请你尝试用 LR、SC 指令实现自旋锁。</p><p>期待你在留言区记录自己的收获，或者向我提问。如果觉得这节课还不错，别忘了推荐给身边更多朋友，跟他一起学习进步。</p><blockquote><p>原子指令模式（要么都执行，要么就只能返回到都不执行），随着cpu单核逼近物理极限，那么 相比于冯诺依曼结构 （原子模式随着核增多，维护数据一致浪费时间越多） 哈佛结构有没有它的优点？在多核模式下 部分领域优于冯诺依曼结构的？<br> 作者回复: 是的</p></blockquote>',86);function I(V,j){const a=d("ExternalLinkIcon");return r(),c("div",null,[x,_,h,f,C,n("p",null,[n("a",S,[s("课程代码你可以从这里下载"),e(a)]),s("。话不多说，让我们直接开始吧。")]),w,n("ul",null,[n("li",null,[n("p",null,[n("a",R,[s("1.LR"),e(a)]),s(" 和 SC 指令成对地访问相同的地址。")])]),n("li",null,[n("p",null,[n("a",L,[s("2.LR"),e(a)]),s(" 和 SC 指令之间没有任何其它的写操作（来自任何一个 hart）访问同样的地址。")])]),n("li",null,[n("p",null,[n("a",A,[s("3.LR"),e(a)]),s(" 和 SC 指令之间没有任何中断与异常发生。")])]),n("li",null,[n("p",null,[n("a",y,[s("4.LR"),e(a)]),s(" 和 SC 指令之间没有执行 MRET 指令。")])])]),q])}const U=l(k,[["render",I],["__file","I20-原子指令RISC-V.html.vue"]]);export{U as default};
