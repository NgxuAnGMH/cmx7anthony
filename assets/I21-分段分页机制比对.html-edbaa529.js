import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as e,o,c,a as n,b as s,e as p,d as l}from"./app-cdabc73c.js";const i="/assets/9697ae17b9f561e78514890f9d58d4eb-573ad431.jpg",u="/assets/7c82068d2d6bdb601084a07569ac8b04-097dff1b.jpg",r="/assets/abbcafe962d93fac976aa26b7fcb7440-d1027234.jpg",k="/assets/8495dfcbaed235f7500c7e11149b2feb-006680e9.jpg",d="/assets/image-20220706171715440-f1e3c0a3.png",m="/assets/b6960eb0a7eea008d33f8e0c4facc8b8-c9c2c825.jpg",_="/assets/image-20220706171751676-e0cd8f98.png",b="/assets/42eff3e7574ac8ce2501210e25cd2c0b-327c6097.jpg",f="/assets/7dd9039e4ad2f6433aa09c14ede92991-773e6521.jpg",g={},h=l('<h1 id="_21-内存管理-下-为客户保密-项目组独享会议室封闭开发" tabindex="-1"><a class="header-anchor" href="#_21-内存管理-下-为客户保密-项目组独享会议室封闭开发" aria-hidden="true">#</a> 21 | 内存管理（下）：为客户保密，项目组独享会议室封闭开发</h1><p>上一节，我们讲了虚拟空间的布局。接下来，我们需要知道，如何将其映射成为物理地址呢？</p><h2 id="分段机制-仅适用于权限相关-段表-段描述符表" tabindex="-1"><a class="header-anchor" href="#分段机制-仅适用于权限相关-段表-段描述符表" aria-hidden="true">#</a> 分段机制(仅适用于权限相关)/段表=段描述符表</h2><p>你可能已经想到了，咱们前面讲 x86 CPU 的时候，讲过分段机制，咱们规划虚拟空间的时候，也是将空间分成多个段进行保存。</p><p>那就直接用分段机制呗。我们来看看分段机制的原理。</p><img src="'+i+'" alt="img" style="zoom:25%;"><p>分段机制下的虚拟地址由两部分组成，<strong>段选择子</strong>和<strong>段内偏移量</strong>。段选择子就保存在咱们前面讲过的<mark>段寄存器</mark>里面。段选择子里面最重要的是<strong>段号</strong>，用作段表的索引。段表里面保存的是这个段的<strong>基地址</strong>、<strong>段的界限</strong>和<strong>特权等级</strong>等。虚拟地址中的段内偏移量应该位于 0 和段界限之间。如果段内偏移量是合法的，就将段基地址加上段内偏移量得到物理内存地址。</p><p>例如，我们将上面的虚拟空间分成以下 4 个段，用 0～3 来编号。每个段在段表中有一个项，在物理空间中，段的排列如下图的右边所示。</p><img src="'+u+`" alt="img" style="zoom:25%;"><p>如果要访问段 2 中偏移量 600 的虚拟地址，我们可以计算出物理地址为，段 2 基地址 2000 + 偏移量 600 = 2600。</p><p>多好的机制啊！我们来看看 Linux 是如何使用这个机制的。</p><p>在 Linux 里面，<mark>段表</mark>全称<strong>段描述符表</strong>（segment descriptors），放在<strong>全局描述符表 GDT</strong>（Global Descriptor Table）里面，会有下面的宏来初始化段描述符表里面的表项。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name function">GDT_ENTRY_INIT</span><span class="token expression"><span class="token punctuation">(</span>flags<span class="token punctuation">,</span> base<span class="token punctuation">,</span> limit<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">{</span> <span class="token punctuation">{</span> </span><span class="token punctuation">\\</span>
    <span class="token expression"><span class="token punctuation">.</span>a <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>limit<span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xffff</span><span class="token punctuation">)</span> <span class="token operator">|</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">(</span>base<span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xffff</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token number">16</span><span class="token punctuation">)</span><span class="token punctuation">,</span> </span><span class="token punctuation">\\</span>
    <span class="token expression"><span class="token punctuation">.</span>b <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">(</span>base<span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xff0000</span><span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">16</span><span class="token punctuation">)</span> <span class="token operator">|</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">(</span>flags<span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xf0ff</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token number">8</span><span class="token punctuation">)</span> <span class="token operator">|</span> </span><span class="token punctuation">\\</span>
      <span class="token expression"><span class="token punctuation">(</span><span class="token punctuation">(</span>limit<span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xf0000</span><span class="token punctuation">)</span> <span class="token operator">|</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>base<span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xff000000</span><span class="token punctuation">)</span><span class="token punctuation">,</span> </span><span class="token punctuation">\\</span>
  <span class="token expression"><span class="token punctuation">}</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一个段表项由段基地址 base、段界限 limit，还有一些标识符组成。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token function">DEFINE_PER_CPU_PAGE_ALIGNED</span><span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">gdt_page</span><span class="token punctuation">,</span> gdt_page<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token punctuation">.</span>gdt <span class="token operator">=</span> <span class="token punctuation">{</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">ifdef</span> <span class="token expression">CONFIG_X86_64</span></span>
  <span class="token punctuation">[</span>GDT_ENTRY_KERNEL32_CS<span class="token punctuation">]</span>    <span class="token operator">=</span> <span class="token function">GDT_ENTRY_INIT</span><span class="token punctuation">(</span><span class="token number">0xc09b</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0xfffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">[</span>GDT_ENTRY_KERNEL_CS<span class="token punctuation">]</span>    <span class="token operator">=</span> <span class="token function">GDT_ENTRY_INIT</span><span class="token punctuation">(</span><span class="token number">0xa09b</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0xfffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">[</span>GDT_ENTRY_KERNEL_DS<span class="token punctuation">]</span>    <span class="token operator">=</span> <span class="token function">GDT_ENTRY_INIT</span><span class="token punctuation">(</span><span class="token number">0xc093</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0xfffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">[</span>GDT_ENTRY_DEFAULT_USER32_CS<span class="token punctuation">]</span>  <span class="token operator">=</span> <span class="token function">GDT_ENTRY_INIT</span><span class="token punctuation">(</span><span class="token number">0xc0fb</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0xfffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">[</span>GDT_ENTRY_DEFAULT_USER_DS<span class="token punctuation">]</span>  <span class="token operator">=</span> <span class="token function">GDT_ENTRY_INIT</span><span class="token punctuation">(</span><span class="token number">0xc0f3</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0xfffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">[</span>GDT_ENTRY_DEFAULT_USER_CS<span class="token punctuation">]</span>  <span class="token operator">=</span> <span class="token function">GDT_ENTRY_INIT</span><span class="token punctuation">(</span><span class="token number">0xa0fb</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0xfffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">else</span></span>
  <span class="token punctuation">[</span>GDT_ENTRY_KERNEL_CS<span class="token punctuation">]</span>    <span class="token operator">=</span> <span class="token function">GDT_ENTRY_INIT</span><span class="token punctuation">(</span><span class="token number">0xc09a</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0xfffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">[</span>GDT_ENTRY_KERNEL_DS<span class="token punctuation">]</span>    <span class="token operator">=</span> <span class="token function">GDT_ENTRY_INIT</span><span class="token punctuation">(</span><span class="token number">0xc092</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0xfffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">[</span>GDT_ENTRY_DEFAULT_USER_CS<span class="token punctuation">]</span>  <span class="token operator">=</span> <span class="token function">GDT_ENTRY_INIT</span><span class="token punctuation">(</span><span class="token number">0xc0fa</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0xfffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">[</span>GDT_ENTRY_DEFAULT_USER_DS<span class="token punctuation">]</span>  <span class="token operator">=</span> <span class="token function">GDT_ENTRY_INIT</span><span class="token punctuation">(</span><span class="token number">0xc0f2</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0xfffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span></span>
<span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token function">EXPORT_PER_CPU_SYMBOL_GPL</span><span class="token punctuation">(</span>gdt_page<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里面对于 64 位的和 32 位的，都定义了<mark>内核代码段</mark>、<mark>内核数据段</mark>、<mark>用户代码段</mark>和<mark>用户数据段</mark>。</p><p>另外，还会定义下面四个段选择子，指向上面的段描述符表项。这四个段选择子看着是不是有点眼熟？咱们讲内核初始化的时候，启动第一个用户态的进程，就是将这四个值赋值给段寄存器。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">__KERNEL_CS</span>      <span class="token expression"><span class="token punctuation">(</span>GDT_ENTRY_KERNEL_CS<span class="token operator">*</span><span class="token number">8</span><span class="token punctuation">)</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">__KERNEL_DS</span>      <span class="token expression"><span class="token punctuation">(</span>GDT_ENTRY_KERNEL_DS<span class="token operator">*</span><span class="token number">8</span><span class="token punctuation">)</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">__USER_DS</span>      <span class="token expression"><span class="token punctuation">(</span>GDT_ENTRY_DEFAULT_USER_DS<span class="token operator">*</span><span class="token number">8</span> <span class="token operator">+</span> <span class="token number">3</span><span class="token punctuation">)</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">__USER_CS</span>      <span class="token expression"><span class="token punctuation">(</span>GDT_ENTRY_DEFAULT_USER_CS<span class="token operator">*</span><span class="token number">8</span> <span class="token operator">+</span> <span class="token number">3</span><span class="token punctuation">)</span></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过分析，我们发现，所有的段的起始地址都是一样的，都是 0。这算哪门子分段嘛！所以，在 Linux 操作系统中，并没有使用到全部的分段功能。那分段是不是完全没有用处呢？<strong>分段机制可以用来做<mark>权限审核</mark>，例如<code>用户态</code> DPL 是 3，<code>内核态</code> DPL 是 0。当用户态试图访问内核态的时候，会因为权限不足而报错。</strong></p><h2 id="分页机制-大小相同更好管理-页表" tabindex="-1"><a class="header-anchor" href="#分页机制-大小相同更好管理-页表" aria-hidden="true">#</a> 分页机制(大小相同更好管理)/页表</h2><p>其实 Linux 倾向于另外一种从虚拟地址到物理地址的转换方式，称为<strong>分页</strong>（Paging）。</p><p>对于物理内存，操作系统把它分成一块一块<code>大小相同的页，这样更方便管理</code>，例如有的内存页面长时间不用了，可以暂时写到硬盘上，称为<strong>换出</strong>。一旦需要的时候，再加载进来，叫做<strong>换入</strong>。这样可以扩大可用物理内存的大小，提高物理内存的利用率。</p><p>这个换入和换出都是<strong>以页为单位</strong>的。页面的大小一般为 4KB。为了能够定位和访问每个页，需要有个<mark>页表</mark>，保存每个页的起始地址，再加上在页内的偏移量，组成线性地址，就能对于内存中的每个位置进行访问了。</p><img src="`+r+'" alt="img" style="zoom:25%;"><p>虚拟地址分为两部分，<strong>页号</strong>和<strong>页内偏移</strong>。页号作为页表的索引，页表包含物理页每页所在物理内存的基地址。这个基地址与页内偏移的组合就形成了物理内存地址。</p><p>下面的图，举了一个简单的页表的例子，虚拟内存中的页通过页表映射为了物理内存中的页。</p><img src="'+k+'" alt="img" style="zoom:25%;"><p>32 位环境下，虚拟地址空间共 4GB。如果分成 4KB 一个页，那就是 1M 个页。每个页表项需要 4 个字节来存储，那么整个 4GB 空间的映射就需要 4MB 的内存来存储映射表。如果每个进程都有自己的映射表，100 个进程就需要 400MB 的内存。对于内核来讲，有点大了 。</p><p>页表中所有页表项必须提前建好，并且要求是连续的。如果不连续，就没有办法通过虚拟地址里面的页号找到对应的页表项了。</p><h3 id="_32位的两级页表" tabindex="-1"><a class="header-anchor" href="#_32位的两级页表" aria-hidden="true">#</a> 32位的两级页表</h3><p>那怎么办呢？我们可以试着将页表再分页，4G 的空间需要 4M 的页表来存储映射。我们把这 4M 分成 1K（1024）个 4K，每个 4K 又能放在一页里面，这样 1K 个 4K 就是 1K 个页，这 1K 个页也需要一个表进行管理，我们称为页目录表，这个页目录表里面有 1K 项，每项 4 个字节，页目录表大小也是 4K。</p><p>页目录有 1K 项，用 10 位就可以表示访问页目录的哪一项。这一项其实对应的是一整页的页表项，也即 4K 的页表项。每个页表项也是 4 个字节，因而一整页的页表项是 1K 个。再用 10 位就可以表示访问页表项的哪一项，页表项中的一项对应的就是一个页，是存放数据的页，这个页的大小是 4K，用 12 位可以定位这个页内的任何一个位置。</p><p>这样加起来正好 32 位，也就是用前 10 位定位到页目录表中的一项。将这一项对应的页表取出来共 1k 项，再用中间 10 位定位到页表中的一项，将这一项对应的存放数据的页取出来，再用最后 12 位定位到页中的具体位置访问数据。</p><img src="'+d+'" alt="image-20220706171715440" style="zoom:15%;"><p>保护模式下的分页——4KB 页</p><img src="'+m+'" alt="img" style="zoom:25%;"><p>你可能会问，如果这样的话，映射 4GB 地址空间就需要 4MB+4KB 的内存，这样不是更大了吗？ 当然如果页是满的，当时是更大了，但是，我们往往不会为一个进程分配那么多内存。</p><p>比如说，上面图中，我们假设只给这个进程分配了一个数据页。如果只使用页表，也需要完整的 1M 个页表项共 4M 的内存，但是如果使用了页目录，页目录需要 1K 个全部分配，占用内存 4K，但是里面只有一项使用了。<strong>到了页表项，只需要分配能够管理那个数据页的页表项页就可以了，也就是说，最多 4K，这样内存就节省多了</strong>。</p><h3 id="_64位的四级页表" tabindex="-1"><a class="header-anchor" href="#_64位的四级页表" aria-hidden="true">#</a> 64位的四级页表</h3><p>当然对于 64 位的系统，两级肯定不够了，就变成了<strong>四级目录</strong>，分别是<mark>全局页目录项 PGD（Page Global Directory）</mark>、<mark>上层页目录项 PUD（Page Upper Directory）</mark>、<mark>中间页目录项 PMD（Page Middle Directory）<mark>和</mark>页表项 PTE（Page Table Entry）</mark>。</p><img src="'+_+'" alt="image-20220706171751676" style="zoom:15%;"><p>长模式下的分页——4KB 页</p><img src="'+b+'" alt="img" style="zoom:25%;"><h2 id="总结时刻" tabindex="-1"><a class="header-anchor" href="#总结时刻" aria-hidden="true">#</a> 总结时刻</h2><p>这一节我们讲了<mark>分段机制</mark>、<mark>分页机制</mark>以及从虚拟地址到物理地址的映射方式。总结一下这两节，我们可以把内存管理系统精细化为下面三件事情：</p><ol><li><p>第一，虚拟内存空间的管理，将虚拟内存分成大小相等的页；</p></li><li><p>第二，物理内存的管理，将物理内存分成大小相等的页；</p></li><li><p>第三，内存映射，将虚拟内存页和物理内存页映射起来，并且在内存紧张的时候可以换出到硬盘中。</p></li></ol><img src="'+f+'" alt="img" style="zoom:25%;"><h2 id="课堂练习" tabindex="-1"><a class="header-anchor" href="#课堂练习" aria-hidden="true">#</a> 课堂练习</h2><p>这一节我们说一个页的大小为 4K，有时候我们需要为应用配置大页（HugePage）。请你查一下大页的大小及配置方法，咱们后面会用到。</p><p>欢迎留言和我分享你的疑惑和见解，也欢迎你收藏本节内容，反复研读。你也可以把今天的内容分享给你的朋友，和他一起学习、进步。</p><h2 id="课后讨论" tabindex="-1"><a class="header-anchor" href="#课后讨论" aria-hidden="true">#</a> 课后讨论</h2><p>分页机制本质上来说就是类似于linux文件系统的目录管理一样，页目录项和页表项相当于根目录和上级目录，页内偏移就是相对路径，绝对路径就是整个32位地址，分布式存储系统也是采用的类似的机制，先用元数据存储前面的路径，再用块内偏移定位到具体文件，感觉道理都差不多<br> 作者回复: 是的</p><ul><li>内存管理(下)</li><li>虚拟内存地址到物理内存地址的映射</li><li>分段</li><li>虚拟地址 = 段选择子(段寄存器) + 段内偏移量 <ul><li>段选择子 = 段号(段表索引) + 标识位</li><li>段表 = 物理基地址 + 段界限(偏移量范围) + 特权等级</li></ul></li><li>Linux 分段实现</li><li>段表称为段描述符表, 放在全局标识符表中 <ul><li>Linux 将段基地址都初始化为 0, 不用于地址映射</li><li>Linux 分段功能主要用于权限检查</li></ul></li><li>Linux 通过分页实现映射</li><li>物理内存被换分为大小固定(4KB)的页, 物理页可在内存与硬盘间换出/换入 <ul><li>页表 = 虚拟页号 + 物理页号; 用于定位页</li><li>虚拟地址 = 虚拟页号 + 页内偏移</li><li>若采用单页表, 32位系统中一个页表将有 1M 页表项, 占用 4MB(每项 4B)</li><li>Linux 32位系统采用两级页表: 页表目录(1K项, 10bit) + 页表(1K项, 10bit)(页大小(4KB, 12bit))</li><li>映射 4GB 内存理论需要 1K 个页表目录项 + 1K*1K=1M 页表项, 将占用 4KB+4MB 空间</li><li>因为完整的页表目录可以满足所有地址的查询, 因此页表只需在对应地址有内存分配时才生成;</li><li>64 为系统采用 4 级页表</li></ul></li></ul>',53),v={href:"https://jishuin.proginn.com/p/763bfbd248c0",target:"_blank",rel:"noopener noreferrer"},T=n("br",null,null,-1),E=n("p",null,[s("分页，分段机制的优劣在于哪儿呢，为什么有分页分段"),n("br"),s(" 作者回复: 都是硬件的机制，操作系统作为软件要用硬件机制。文章里面写了优劣势了。"),n("strong",null,"分段容易碎片，不容易换出"),s("。")],-1),x=n("strong",null,"处理器体系结构支持多重页面大小，操作系统可以根据需要进行相关设置，Linux可以通过hugepage，结合处理器支持页面大小设置多种页面大小",-1),D={href:"https://garlicspace.com/2020/01/10/%e5%86%85%e5%ad%98%e7%ae%a1%e7%90%86-%e9%a1%b5%e9%9d%a2%e5%a4%a7%e5%b0%8f/",target:"_blank",rel:"noopener noreferrer"},N=n("br",null,null,-1),R=n("p",null,"内存管理，本质上是虚拟地址到物理地址映射关系的管理。管理这个关系，我们要注意自身的管理成本，这样我们将内存分页，再对页进行管理。如果只分一层，维护起来比较麻烦。我们再往上加一层，弄个页目录，我们只需要维护好页目录，有数据的时候再加个页表项数据，这样就比较轻松了。",-1),K=n("p",null,[s("老师，你好，页表目录和页表也需要内存空间，这些内存空间是在哪里分配的呢？"),n("br"),s(" 作者回复: 后面会讲页表初始化，启动的时候固定的根的位置，的确有点绕")],-1),G=n("p",null,[s("请问一下，Linux在哪些管理上使用的分段，哪些情况使用的是分页呢？ 还是说"),n("strong",null,"现代操作系统都已经倾向于使用分页来管理"),s("了。"),n("br"),s(" 作者回复: "),n("strong",null,"分段仅用于权限")],-1),L=n("p",null,"页的大小必须是2的n次方，而且与TLB的结构有关",-1);function y(I,S){const a=e("ExternalLinkIcon");return o(),c("div",null,[h,n("p",null,[n("a",v,[s("https://jishuin.proginn.com/p/763bfbd248c0"),p(a)]),T,s(" 这篇文章看起来更容易理解")]),E,n("p",null,[x,s("，相关笔记： "),n("a",D,[s("https://garlicspace.com/2020/01/10/内存管理-页面大小/"),p(a)]),N,s(" 作者回复: 是的，Hugepage在优化内存的时候，经常使用，例如虚拟机或者DPDK使用Hugepage")]),R,K,G,L])}const P=t(g,[["render",y],["__file","I21-分段分页机制比对.html.vue"]]);export{P as default};
