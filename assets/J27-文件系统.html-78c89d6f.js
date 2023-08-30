import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o,c,a as s,b as n,e as i,d as a}from"./app-cdabc73c.js";const l="/assets/93bf5e8e940752b32531ed6752b5f607-2bc63f93.png",r="/assets/e71da53d6e2e4458bcc0af1e23f08e4f-6f268ea1.png",u="/assets/2788a6267f8361c9b6c338b06a1afc50-fb2a010d.png",d={},k=a('<h1 id="_27-文件系统-项目成果要归档-我们就需要档案库" tabindex="-1"><a class="header-anchor" href="#_27-文件系统-项目成果要归档-我们就需要档案库" aria-hidden="true">#</a> 27 | 文件系统：项目成果要归档，我们就需要档案库</h1><p>咱们花了这么长的时间，规划了会议室管理系统，这样多个项目执行的时候，隔离性可以得到保证。但是，会议室里面保存的资料还是暂时的，一旦项目结束，会议室会被回收，会议室里面的资料就丢失了。有一些资料我们希望项目结束也能继续保存，这就需要一个和项目运行生命周期无关的地方，可以永久保存，并且空间也要比会议室大得多。</p><h2 id="文件系统的功能规划" tabindex="-1"><a class="header-anchor" href="#文件系统的功能规划" aria-hidden="true">#</a> 文件系统的功能规划</h2><p>要知道，这些资料才是咱们公司的财富，是执行多个项目积累下来的，是公司竞争力的保证，需要有一个地方归档。这就需要我们有一个存放资料的档案库，在操作系统中就是<strong>文件系统</strong>。那我们应该如何组织规划文件系统这个档案库呢？</p><p>对于<mark>运行的进程</mark>来说，内存就像一个<strong>纸箱子</strong>，仅仅是一个暂存数据的地方，而且空间有限。如果我们想要进程结束之后，数据依然能够保存下来，就不能只保存在内存里，而是应该保存在外部存储中。就像图书馆这种地方，不仅空间大，而且能够永久保存。</p><p>我们最常用的外部存储就是硬盘，数据是以<mark>文件</mark>的形式保存在硬盘上的。为了管理这些文件，我们在规划文件系统的时候，需要考虑到以下几点。</p><p><strong><code>第一点</code>，文件系统要有严格的组织形式，使得文件能够以<mark>块</mark>为单位进行存储</strong>。这就像图书馆里，我们会设置一排排书架，然后再把书架分成一个个小格子，有的项目存放的资料非常多，一个格子放不下，就需要多个格子来存放。我们把这个区域称为存放原始资料的仓库区。</p><p><strong><code>第二点</code>，文件系统中也要有<mark>索引区</mark>，用来方便查找一个文件分成的多个块都存放在了什么位置</strong>。这就好比，图书馆的书太多了，为了方便查找，我们需要专门设置一排书架，这里面会写清楚整个档案库有哪些资料，资料在哪个架子的哪个格子上。这样找资料的时候就不用跑遍整个档案库，在这个书架上找到后，直奔目标书架就可以了。</p><img src="'+l+'" alt="img" style="zoom:25%;"><p><strong><code>第三点</code>，如果文件系统中有的文件是热点文件，近期经常被读取和写入，文件系统应该有<mark>缓存层</mark></strong>。这就相当于图书馆里面的热门图书区，这里面的书都是畅销书或者是常常被借还的图书。因为借还的次数比较多，那就没必要每次有人还了之后，还放回遥远的货架，我们可以专门开辟一个区域，放置这些借还频次高的图书。这样借还的效率就会提高。</p><p><strong><code>第四点</code>，文件应该用<mark>文件夹</mark>的形式组织起来，方便管理和查询</strong>。这就像在图书馆里面，你可以给这些资料分门别类，比如分成计算机类、文学类、历史类等等。这样你也容易管理，项目组借阅的时候只要在某个类别中去找就可以了。</p><p>在文件系统中，每个文件都有一个名字，这样我们访问一个文件，希望通过它的名字就可以找到。文件名就是一个普通的文本。当然文件名会经常冲突，不同用户取相同的名字的情况还是会经常出现的。</p><p>要想把很多的文件有序地组织起来，我们就需要把它们成为目录或者文件夹。这样，一个文件夹里可以包含文件夹，也可以包含文件，这样就形成了一种树形结构。而我们可以将不同的用户放在不同的用户目录下，就可以一定程度上避免了命名的冲突问题。</p><img src="'+r+`" alt="img" style="zoom:25%;"><p>如图所示，不同的用户的文件放在不同的目录下，虽然很多文件都叫“文件 1”，<strong>只要在不同的目录下</strong>，就不会有问题。</p><p>有了目录结构，定位一个文件的时候，我们还会分<strong>绝对路径</strong>（Absolute Path）和<strong>相对路径</strong>（Relative Path）。所谓绝对路径，就是从根目录开始一直到当前的文件，例如“/ 根目录 / 用户 A 目录 / 目录 1/ 文件 2”就是一个绝对路径。而通过 cd 命令可以改变当前路径，例如“cd / 根目录 / 用户 A 目录”，就是将用户 A 目录设置为当前目录，而刚才那个文件的相对路径就变成了“./ 目录 1/ 文件 2”。</p><p><strong><code>第五点</code>，Linux 内核要在自己的内存里面维护<mark>一套数据结构</mark>，来保存哪些文件被哪些进程打开和使用</strong>。这就好比，图书馆里会有个图书管理系统，记录哪些书被借阅了，被谁借阅了，借阅了多久，什么时候归还。</p><p>好了，这样下来，这文件系统的几个部分，是不是就很好理解、记忆了？你不用死记硬背，只要按照一个正常的逻辑去理解，自然而然就能记住了。接下来的整个章节，我们都要围绕这五点展开解析。</p><h2 id="文件系统相关命令行" tabindex="-1"><a class="header-anchor" href="#文件系统相关命令行" aria-hidden="true">#</a> 文件系统相关命令行</h2><p>在 Linux 命令的那一节，我们学了一些简单的文件操作的命令，这里我们再来学几个常用的。</p><h3 id="格式化" tabindex="-1"><a class="header-anchor" href="#格式化" aria-hidden="true">#</a> 格式化</h3><p>首先是<strong>格式化</strong>，也即将一块盘使用命令组织成一定格式的文件系统的过程。咱们买个硬盘或者 U 盘，经常说要先格式化，才能放文件，说的就是这个。</p><ol><li>使用 <code>Windows</code> 的时候，咱们常格式化的格式为 <strong>NTFS</strong>（New Technology File System）。</li><li>在 <code>Linux</code> 下面，常用的是 ext3 或者 ext4。</li></ol><p>当一个 Linux 系统插入了一块没有格式化的硬盘的时候，我们可以通过命令 <strong>fdisk -l</strong>，查看格式化和没有格式化的分区。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span> <span class="token directive keyword">fdisk</span> <span class="token expression"><span class="token operator">-</span>l</span></span>


Disk <span class="token operator">/</span>dev<span class="token operator">/</span>vda<span class="token operator">:</span> <span class="token number">21.5</span> GB<span class="token punctuation">,</span> <span class="token number">21474836480</span> bytes<span class="token punctuation">,</span> <span class="token number">41943040</span> sectors
Units <span class="token operator">=</span> sectors of <span class="token number">1</span> <span class="token operator">*</span> <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
Sector <span class="token function">size</span> <span class="token punctuation">(</span>logical<span class="token operator">/</span>physical<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token number">512</span> bytes <span class="token operator">/</span> <span class="token number">512</span> bytes
I<span class="token operator">/</span>O <span class="token function">size</span> <span class="token punctuation">(</span>minimum<span class="token operator">/</span>optimal<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token number">512</span> bytes <span class="token operator">/</span> <span class="token number">512</span> bytes
Disk label type<span class="token operator">:</span> dos
Disk identifier<span class="token operator">:</span> <span class="token number">0x000a4c75</span>


   Device Boot      Start         End      Blocks   Id  System
<span class="token operator">/</span>dev<span class="token operator">/</span>vda1   <span class="token operator">*</span>        <span class="token number">2048</span>    <span class="token number">41943006</span>    <span class="token number">20970479</span><span class="token operator">+</span>  <span class="token number">83</span>  Linux


Disk <span class="token operator">/</span>dev<span class="token operator">/</span>vdc<span class="token operator">:</span> <span class="token number">107.4</span> GB<span class="token punctuation">,</span> <span class="token number">107374182400</span> bytes<span class="token punctuation">,</span> <span class="token number">209715200</span> sectors
Units <span class="token operator">=</span> sectors of <span class="token number">1</span> <span class="token operator">*</span> <span class="token number">512</span> <span class="token operator">=</span> <span class="token number">512</span> bytes
Sector <span class="token function">size</span> <span class="token punctuation">(</span>logical<span class="token operator">/</span>physical<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token number">512</span> bytes <span class="token operator">/</span> <span class="token number">512</span> bytes
I<span class="token operator">/</span>O <span class="token function">size</span> <span class="token punctuation">(</span>minimum<span class="token operator">/</span>optimal<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token number">512</span> bytes <span class="token operator">/</span> <span class="token number">512</span> bytes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>例如，从上面的命令的输出结果可以看出，vda 这块盘大小 21.5G，是格式化了的，有一个分区 /dev/vda1。vdc 这块盘大小 107.4G，是没有格式化的。</p><p>我们可以通过命令 <strong>mkfs.ext3</strong> 或者 <strong>mkfs.ext4</strong> 进行格式化。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>mkfs<span class="token punctuation">.</span>ext4 <span class="token operator">/</span>dev<span class="token operator">/</span>vdc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>执行完这个命令后，vdc 会建立一个分区，格式化为 ext4 文件系统的格式。至于这个格式是如何组织的，我们下一节仔细讲。</p><p>当然，你也可以选择不将整块盘格式化为一个分区，而是格式化为多个分区。下面的这个命令行可以启动一个交互式程序。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>fdisk <span class="token operator">/</span>dev<span class="token operator">/</span>vdc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在这个交互式程序中，你可以输入 <strong>p</strong> 来打印当前分了几个区。如果没有分过，那这个列表应该是空的。</p><p>接下来，你可以输入 <strong>n</strong> 新建一个分区。它会让你选择创建主分区 primary，还是扩展分区 extended。我们一般都会选择主分区 p。</p><p>接下来，它会让你输入分区号。如果原来没有分过区，应该从 1 开始。或者你直接回车，使用默认值也行。</p><p>接下来，你可以一路选择默认值，直到让你指定这个分区的大小，通过 +sizeM 或者 +sizeK 的方式，默认值是整块盘都用上。你可以 输入 +5620M 分配一个 5G 的分区。这个时候再输入 p，就能看到新创建的分区了，最后输入 w，将对分区的修改写入硬盘。</p><p>分区结束之后，可能会出现 vdc1, vdc2 等多个分区，这个时候你可以 mkfs.ext3 /dev/vdc1 将第一个分区格式化为 ext3，通过 mkfs.ext4 /dev/vdc2 将第二个分区格式化为 ext4.</p><h3 id="挂载" tabindex="-1"><a class="header-anchor" href="#挂载" aria-hidden="true">#</a> 挂载</h3><p>格式化后的硬盘，需要挂在到某个目录下面，才能作为普通的文件系统进行访问。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>mount <span class="token operator">/</span>dev<span class="token operator">/</span>vdc1 <span class="token operator">/</span>根目录<span class="token operator">/</span>用户A目录<span class="token operator">/</span>目录<span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>例如，上面这个命令就是将这个文件系统挂载到“/ 根目录 / 用户 A 目录 / 目录 1”这个目录下面。一旦挂在过去，“/ 根目录 / 用户 A 目录 / 目录 1”这个目录下面原来的文件 1 和文件 2 就都看不到了，换成了 vdc1 这个硬盘里面的文件系统的根目录。</p><h3 id="卸载" tabindex="-1"><a class="header-anchor" href="#卸载" aria-hidden="true">#</a> 卸载</h3><p>有挂载就有卸载，卸载使用 <strong>umount</strong> 命令。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>umount <span class="token operator">/</span>根目录<span class="token operator">/</span>用户A目录<span class="token operator">/</span>目录<span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>前面我们讲过，Linux 里面一切都是文件，那从哪里看出是什么文件呢？要从 ls -l 的结果的第一位标识位看出来。</p><ul><li><p>- 表示普通文件；</p></li><li><p>d 表示文件夹；</p></li><li><p>c 表示字符设备文件，这在设备那一节讲解；</p></li><li><p>b 表示块设备文件，这也在设备那一节讲解；</p></li><li><p>s 表示套接字 socket 文件，这在网络那一节讲解；</p></li><li><p>l 表示符号链接，也即软链接，就是通过名字指向另外一个文件，<br> 例如下面的代码，instance 这个文件就是指向了 /var/lib/cloud/instances 这个文件。软链接的机制我们这一章会讲解。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span> <span class="token directive keyword">ls</span> <span class="token expression"><span class="token operator">-</span>l</span></span>
lrwxrwxrwx <span class="token number">1</span> root root   <span class="token number">61</span> Dec <span class="token number">14</span> <span class="token number">19</span><span class="token operator">:</span><span class="token number">53</span> instance <span class="token operator">-&gt;</span> <span class="token operator">/</span>var<span class="token operator">/</span>lib<span class="token operator">/</span>cloud<span class="token operator">/</span>instances
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="文件系统相关系统调用" tabindex="-1"><a class="header-anchor" href="#文件系统相关系统调用" aria-hidden="true">#</a> 文件系统相关系统调用</h2><p>看完了命令行，我们来看一下，如何使用系统调用操作文件？我们先来看一个完整的例子。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdlib.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;unistd.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;fcntl.h&gt;</span></span>


<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token keyword">int</span> argc<span class="token punctuation">,</span> <span class="token keyword">char</span> <span class="token operator">*</span>argv<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>


  <span class="token keyword">int</span> fd <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
  <span class="token keyword">int</span> ret <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
  <span class="token keyword">int</span> buffer <span class="token operator">=</span> <span class="token number">1024</span><span class="token punctuation">;</span>
  <span class="token keyword">int</span> num <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>


  <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token punctuation">(</span>fd<span class="token operator">=</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token string">&quot;./test&quot;</span><span class="token punctuation">,</span> O_RDWR<span class="token operator">|</span>O_CREAT<span class="token operator">|</span>O_TRUNC<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">==</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Open Error\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>


  ret <span class="token operator">=</span> <span class="token function">write</span><span class="token punctuation">(</span>fd<span class="token punctuation">,</span> <span class="token operator">&amp;</span>buffer<span class="token punctuation">,</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span> ret <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;write Error\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;write %d byte(s)\\n&quot;</span><span class="token punctuation">,</span>ret<span class="token punctuation">)</span><span class="token punctuation">;</span>


  <span class="token function">lseek</span><span class="token punctuation">(</span>fd<span class="token punctuation">,</span> <span class="token number">0L</span><span class="token punctuation">,</span> <span class="token constant">SEEK_SET</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  ret<span class="token operator">=</span> <span class="token function">read</span><span class="token punctuation">(</span>fd<span class="token punctuation">,</span> <span class="token operator">&amp;</span>num<span class="token punctuation">,</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>ret<span class="token operator">==</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;read Error\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;read %d byte(s)，the number is %d\\n&quot;</span><span class="token punctuation">,</span> ret<span class="token punctuation">,</span> num<span class="token punctuation">)</span><span class="token punctuation">;</span>


  <span class="token function">close</span><span class="token punctuation">(</span>fd<span class="token punctuation">)</span><span class="token punctuation">;</span>


  <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="open" tabindex="-1"><a class="header-anchor" href="#open" aria-hidden="true">#</a> open</h3><p>当使用系统调用 open 打开一个文件时，操作系统会创建一些数据结构来表示这个被打开的文件。下一节，我们就会看到这些。为了能够找到这些数据结构，在进程中，我们会为这个打开的文件分配一个<mark>文件描述符 fd（File Descriptor）</mark>。</p><h3 id="文件描述符-fd" tabindex="-1"><a class="header-anchor" href="#文件描述符-fd" aria-hidden="true">#</a> 文件描述符 fd</h3><p>文件描述符，就是用来<strong>区分一个进程打开的多个文件的</strong>。它的作用域就是当前进程，出了当前进程这个文件描述符就没有意义了。open 返回的 fd 必须记录好，我们对这个文件的所有操作都要靠这个 fd，包括最后关闭文件。</p><p>在 Open 函数中，有一些参数：</p><ul><li><code>O_CREAT</code> 表示当文件不存在，创建一个新文件；</li><li><code>O_RDWR</code> 表示以读写方式打开；</li><li><code>O_TRUNC</code> 表示打开文件后，将文件的长度截断为 0。</li></ul><h3 id="write" tabindex="-1"><a class="header-anchor" href="#write" aria-hidden="true">#</a> write</h3><p>接下来，<code>write</code> 要用于写入数据。</p><ol><li>第一个参数就是文件描述符，</li><li>第二个参数表示要写入的数据存放位置，</li><li>第三个参数表示希望写入的字节数，返回值表示成功写入到文件的字节数。</li></ol><h3 id="lseek" tabindex="-1"><a class="header-anchor" href="#lseek" aria-hidden="true">#</a> lseek</h3><p><code>lseek</code> 用于重新定位读写的位置，</p><ol><li>第一个参数是文件描述符，</li><li>第二个参数是重新定位的位置，</li><li>第三个参数是 SEEK_SET，表示起始位置为文件头，</li></ol><p>第二个参数和第三个参数合起来表示将读写位置设置为从文件头开始 0 的位置，也即从头开始读写。</p><h3 id="read" tabindex="-1"><a class="header-anchor" href="#read" aria-hidden="true">#</a> read</h3><p><code>read</code> 用于读取数据，</p><ol><li>第一个参数是文件描述符，</li><li>第二个参数是读取来的数据存到指向的空间，</li><li>第三个参数是希望读取的字节数，返回值表示成功读取的字节数。</li></ol><h3 id="close" tabindex="-1"><a class="header-anchor" href="#close" aria-hidden="true">#</a> close</h3><p>最终，<code>close</code> 将关闭一个文件。</p><h3 id="文件属性" tabindex="-1"><a class="header-anchor" href="#文件属性" aria-hidden="true">#</a> 文件属性</h3><p>对于命令行来讲，通过 <code>ls</code> 可以得到文件的属性，使用代码怎么办呢？</p><p>我们有下面三个函数，可以返回与打开的文件描述符相关的文件状态信息。这个信息将会写到类型为 struct stat 的 buf 结构中。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">int</span> <span class="token function">stat</span><span class="token punctuation">(</span><span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span>pathname<span class="token punctuation">,</span> <span class="token keyword">struct</span> <span class="token class-name">stat</span> <span class="token operator">*</span>statbuf<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">int</span> <span class="token function">fstat</span><span class="token punctuation">(</span><span class="token keyword">int</span> fd<span class="token punctuation">,</span> <span class="token keyword">struct</span> <span class="token class-name">stat</span> <span class="token operator">*</span>statbuf<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">int</span> <span class="token function">lstat</span><span class="token punctuation">(</span><span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span>pathname<span class="token punctuation">,</span> <span class="token keyword">struct</span> <span class="token class-name">stat</span> <span class="token operator">*</span>statbuf<span class="token punctuation">)</span><span class="token punctuation">;</span>


<span class="token keyword">struct</span> <span class="token class-name">stat</span> <span class="token punctuation">{</span>
  <span class="token class-name">dev_t</span>     st_dev<span class="token punctuation">;</span>         <span class="token comment">/* ID of device containing file */</span>
  <span class="token class-name">ino_t</span>     st_ino<span class="token punctuation">;</span>         <span class="token comment">/* Inode number */</span>
  <span class="token class-name">mode_t</span>    st_mode<span class="token punctuation">;</span>        <span class="token comment">/* File type and mode */</span>
  <span class="token class-name">nlink_t</span>   st_nlink<span class="token punctuation">;</span>       <span class="token comment">/* Number of hard links */</span>
  <span class="token class-name">uid_t</span>     st_uid<span class="token punctuation">;</span>         <span class="token comment">/* User ID of owner */</span>
  <span class="token class-name">gid_t</span>     st_gid<span class="token punctuation">;</span>         <span class="token comment">/* Group ID of owner */</span>
  <span class="token class-name">dev_t</span>     st_rdev<span class="token punctuation">;</span>        <span class="token comment">/* Device ID (if special file) */</span>
  <span class="token class-name">off_t</span>     st_size<span class="token punctuation">;</span>        <span class="token comment">/* Total size, in bytes */</span>
  <span class="token class-name">blksize_t</span> st_blksize<span class="token punctuation">;</span>     <span class="token comment">/* Block size for filesystem I/O */</span>
  <span class="token class-name">blkcnt_t</span>  st_blocks<span class="token punctuation">;</span>      <span class="token comment">/* Number of 512B blocks allocated */</span>
  <span class="token keyword">struct</span> <span class="token class-name">timespec</span> st_atim<span class="token punctuation">;</span>  <span class="token comment">/* Time of last access */</span>
  <span class="token keyword">struct</span> <span class="token class-name">timespec</span> st_mtim<span class="token punctuation">;</span>  <span class="token comment">/* Time of last modification */</span>
  <span class="token keyword">struct</span> <span class="token class-name">timespec</span> st_ctim<span class="token punctuation">;</span>  <span class="token comment">/* Time of last status change */</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>函数 stat 和 lstat 返回的是通过文件名查到的状态信息。这两个方法区别在于，</p><ul><li><code>stat</code> 没有处理符号链接（软链接）的能力。如果一个文件是符号链接，stat 会直接返回它所指向的文件的属性，</li><li>而 <code>lstat</code> 返回的就是这个符号链接的内容，fstat 则是通过文件描述符获取文件对应的属性。</li></ul><h2 id="示例" tabindex="-1"><a class="header-anchor" href="#示例" aria-hidden="true">#</a> 示例</h2><p>接下来我们来看，如何使用系统调用列出一个文件夹下面的文件以及文件的属性。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdlib.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;unistd.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;fcntl.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;sys/types.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;sys/stat.h&gt;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;dirent.h&gt;</span></span>


<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token keyword">int</span> argc<span class="token punctuation">,</span> <span class="token keyword">char</span> <span class="token operator">*</span>argv<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">struct</span> <span class="token class-name">stat</span> sb<span class="token punctuation">;</span>
  DIR <span class="token operator">*</span>dirp<span class="token punctuation">;</span>
  <span class="token keyword">struct</span> <span class="token class-name">dirent</span> <span class="token operator">*</span>direntp<span class="token punctuation">;</span>
  <span class="token keyword">char</span> filename<span class="token punctuation">[</span><span class="token number">128</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>dirp <span class="token operator">=</span> <span class="token function">opendir</span><span class="token punctuation">(</span><span class="token string">&quot;/root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token constant">NULL</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Open Directory Error%s\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>direntp <span class="token operator">=</span> <span class="token function">readdir</span><span class="token punctuation">(</span>dirp<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token constant">NULL</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token function">sprintf</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> <span class="token string">&quot;/root/%s&quot;</span><span class="token punctuation">,</span> direntp<span class="token operator">-&gt;</span>d_name<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">lstat</span><span class="token punctuation">(</span>filename<span class="token punctuation">,</span> <span class="token operator">&amp;</span>sb<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
      <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;lstat Error%s\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;name : %s, mode : %d, size : %d, user id : %d\\n&quot;</span><span class="token punctuation">,</span> direntp<span class="token operator">-&gt;</span>d_name<span class="token punctuation">,</span> sb<span class="token punctuation">.</span>st_mode<span class="token punctuation">,</span> sb<span class="token punctuation">.</span>st_size<span class="token punctuation">,</span> sb<span class="token punctuation">.</span>st_uid<span class="token punctuation">)</span><span class="token punctuation">;</span>


  <span class="token punctuation">}</span>
  <span class="token function">closedir</span><span class="token punctuation">(</span>dirp<span class="token punctuation">)</span><span class="token punctuation">;</span>


  <span class="token keyword">return</span> <span class="token number">0</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>opendir</code> 函数打开一个目录名所对应的 DIR 目录流。并返回指向 DIR 目录流的指针。流定位在 DIR 目录流的第一个条目。</p><p><code>readdir</code> 函数从 DIR 目录流中读取一个项目，返回的是一个指针，指向 dirent 结构体，且流的自动指向下一个目录条目。如果已经到流的最后一个条目，则返回 NULL。</p><p><code>closedir()</code> 关闭参数 dir 所指的目录流。</p><p>到这里，你应该既会使用系统调用操作文件，也会使用系统调用操作目录了。下一节，我们开始来看内核如何实现的。</p><h2 id="总结时刻" tabindex="-1"><a class="header-anchor" href="#总结时刻" aria-hidden="true">#</a> 总结时刻</h2><p>这一节，我们对于文件系统的主要功能有了一个总体的印象，我们通过下面这张图梳理一下。</p><ul><li>在文件系统上，需要维护文件的<code>严格的格式</code>，要通过 mkfs.ext4 命令来格式化为严格的格式。</li><li>每一个硬盘上保存的文件都要有<code>一个索引</code>，来维护这个文件上的数据块都保存在哪里。</li><li>文件通过<code>文件夹</code>组织起来，可以方便用户使用。</li><li>为了能够更快读取文件，<code>内存里会分配一块空间作为缓存</code>，让一些数据块放在缓存里面。</li><li>在内核中，要有<mark>一整套的数据结构</mark>来表示<code>进程打开的所有文件</code>。</li><li>在用户态，<code>每个打开的文件</code>都有<mark>一个文件描述符</mark>，可以通过各种文件相关的系统调用，操作这个文件描述符。</li></ul><img src="`+u+'" alt="img" style="zoom:25%;"><h2 id="课堂练习" tabindex="-1"><a class="header-anchor" href="#课堂练习" aria-hidden="true">#</a> 课堂练习</h2><p>你可以试着将一块空闲的硬盘，分区成为两块，并安装不同的文件系统，进行挂载。这是 Linux 运维人员经常做的一件事情。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎你收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习、进步。</p><h2 id="课后讨论" tabindex="-1"><a class="header-anchor" href="#课后讨论" aria-hidden="true">#</a> 课后讨论</h2><ul><li>文件系统的功能</li><li>以块为单位的存储组织形式 <ul><li>要有索引, 方便查找</li><li>热点文件应该有缓存</li><li>可以以文件夹形式组织, 方便管理</li><li>在内存中维护数据结构, 保存哪些文件被哪些进程打开/使用</li></ul></li><li>文件系统相关命令行</li><li>格式化, 组织成一定格式的文件系统; Windows→NTFS, Linux→ext3/ext4<br> - fdisk -l 查看分区<br> - mkfs.ext3/mkfs.ext4 /dev/... 进行格式化 <ul><li>可建立多个分区, 再分别以不同文件系统进行格式化</li><li>fdisk /dev/... 打开交互式程序<br> - p 打印分区<br> - n 新建分区: p primary 建立主分区; e extended 建立扩展分区; 设置大小; w 执行分区修改 <ul><li>再执行 mkfs.ext* 进行格式化</li></ul></li><li>挂载分区到某个目录, 才能正常访问</li><li>mount /dev/... /目录 <ul><li>umount /目录</li></ul></li><li>查看文件类型 ls -l</li><li>第一个标识符: - 普通文件; d 文件夹; c 字符设备文件; b 块设备文件; s socket 文件; l 符号链接(软连接)</li></ul></li><li>文件系统相关系统调用</li><li>open 打开一个文件, 返回文件描述符 fd; 参数 O_CREAT 不存在就创建, O_RDWR 以读写方式打开, O_TRUNC 文件长度截断为 0; 返回成功写入字节数 <ul><li>write 写数据, 参数 fd, 数据位置, 写入字节数; 返回成功写入字节数</li><li>lseek 重新定位读写位置, 参数 fd, 位置, SEEK_SET</li><li>read 读数据, 参数 fd, 存放位置, 读取字节数; 返回成功读取字节数</li><li>close 关闭文件</li><li>stat/lstat 通过文件名获取文件信息; fstat 通过 fd 获取文件信息</li><li>opendir 打开一个目录, 生成一个目录流 DIR</li><li>readdir 读取目录流的一个条目, 自动指向下一个条目</li><li>closedir 关闭目录流</li></ul></li></ul>',88),m=s("br",null,null,-1),v={href:"https://www.cnblogs.com/luoahong/p/10943864.html",target:"_blank",rel:"noopener noreferrer"},b=a("<p>多线程高并发的时候，经常报open fd too much。貌似fd是有上限的，每次网络连接都会创建一个fd？<br> 作者回复: 是的，这也是为什么不能太多的网络连接。<br> 网友回复：1 Linux中每个fd被打开的数量有限制，可以通过更改Linux系统配置来修改这个限制。<br> 2 每个进程都有fd限制数量。否则，就可能被某个进程大量占用，导致其他进程获取不到。</p><p>操作目录的相关函数并不是系统调用，而是库函数。<br> 作者回复: 赞，opendir这些的确是库函数</p><p>老师，管道类型的文件也是一种文件类型吧<br> 作者回复: 是的</p><p>1.文件描述符，就是用来区分一个进程打开的多个文件的。（文件描述符只在当前进程有效）<br> 2.Linux 内核要在自己的内存里面维护一套数据结构，来保存哪些文件被哪些进程打开和使用<br> 3.讲解了格式化、分区、挂载、卸载的命令</p><p>Linux文件索引采用的是哪种数据结构？红黑树还是B+树<br> 作者回复: 我这里指的是Inode</p>",5);function h(f,g){const e=p("ExternalLinkIcon");return o(),c("div",null,[k,s("p",null,[n("决心从头把计算机所有的基础课程全部补上，夯实基础，一定要坚持到最后"),m,n(" day27笔记："),s("a",v,[n("https://www.cnblogs.com/luoahong/p/10943864.html"),i(e)])]),b])}const _=t(d,[["render",h],["__file","J27-文件系统.html.vue"]]);export{_ as default};
