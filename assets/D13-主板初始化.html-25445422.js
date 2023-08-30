import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,d as p}from"./app-cdabc73c.js";const e="/assets/c08ebf3fb25fddab6d4dbd24326aae83-313356c7.jpg",t="/assets/fd2cd9e5b63cd7e52cd68b65e81aee7a-b8923248.jpg",c="/assets/4d81f7feb668abf30c5cced619549709-64b24721.jpg",o={},i=p(`<h1 id="_13-第一个c函数-如何实现板级初始化" tabindex="-1"><a class="header-anchor" href="#_13-第一个c函数-如何实现板级初始化" aria-hidden="true">#</a> 13 | 第一个C函数：如何实现板级初始化？</h1><p>你好，我是 LMOS。</p><p>前面三节课，我们为调用 Cosmos 的**第一个 C 函数 <code>hal_start</code> 做了大量工作。**这节课我们要让操作系统 Cosmos 里的第一个 C 函数真正跑起来啦，也就是说，我们会真正进入到我们的内核中。</p><p>今天我们会继续在这个 hal_start 函数里，首先执行板级初始化，其实就是 hal 层（硬件抽象层，下同）初始化，其中执行了平台初始化，hal 层的内存初始化，中断初始化，最后进入到内核层的初始化。</p><p>这节课的配套代码，你可以从这里下载。</p><h2 id="第一个-c-函数-hal-start-c" tabindex="-1"><a class="header-anchor" href="#第一个-c-函数-hal-start-c" aria-hidden="true">#</a> 第一个 C 函数: hal_start.c</h2><p>任何软件工程，第一个函数总是简单的，因为它是总调用者，像是一个管理者，坐在那里发号施令，自己却是啥活也不干。</p><p>由于这是第一个 C 函数，也是初始化函数，我们还是要为它单独建立一个文件，以显示对它的尊重，依然在 Cosmos/hal/x86/ 下建立一个 <code>hal_start.c</code> 文件。写上这样一个函数。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">hal_start</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token comment">//第一步：初始化hal层</span>
    <span class="token comment">//第二步：初始化内核层</span>
    <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>根据前面的设计，Cosmos 是有 hal 层和内核层之分，所以在上述代码中，要分两步走。</p><ol><li>第一步是初始化 hal 层；</li><li>第二步，初始化内核层。</li></ol><p>只是这两步的函数我们还没有写。</p><p>然而最后的死循环却有点奇怪，其实它的目的很简单，就是避免这个函数返回，因为这个返回了就无处可去，避免走回头路。</p><h2 id="hal-层初始化-halinit-c" tabindex="-1"><a class="header-anchor" href="#hal-层初始化-halinit-c" aria-hidden="true">#</a> hal 层初始化: halinit.c</h2><p><strong>为了分离硬件的特性</strong>，我们设计了 hal 层，把硬件相关的操作集中在这个层，并向上提供接口，目的是让内核上层不用关注硬件相关的细节，也能方便以后移植和扩展。(关于 hal 层的设计，可以回顾第 3 节课)</p><p>也许今天我们是在 x86 平台上写 Cosmos，明天就要在 ARM 平台上开发 Cosmos，那时我们就可以写个 ARM 平台的 hal 层，来替换 Cosmos 中的 x86 平台的 hal 层。</p><p>下面我们在 Cosmos/hal/x86/ 下建立一个 <code>halinit.c</code> 文件，写出 hal 层的初始化函数。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">init_hal</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token comment">//初始化平台</span>
    <span class="token comment">//初始化内存</span>
    <span class="token comment">//初始化中断</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个函数也是一个调用者，没怎么干活。不过根据代码的注释能看出，它调用的函数多一点，但主要是完成初始化平台、初始化内存、初始化中断的功能函数。</p><h2 id="初始化平台-halplatform-c" tabindex="-1"><a class="header-anchor" href="#初始化平台-halplatform-c" aria-hidden="true">#</a> 初始化平台: halplatform.c</h2><p>我们先来写好平台初始化函数，因为它需要最先被调用。</p><p>这个函数主要负责完成两个任务，一是<strong>把二级引导器建立的机器信息结构复制到 hal 层中的一个全局变量中</strong>，方便内核中的其它代码使用里面的信息，之后二级引导器建立的数据所占用的内存都会被释放。二是要<strong>初始化图形显示驱动</strong>，内核在运行过程要在屏幕上输出信息。</p><p>下面我们在 Cosmos/hal/x86/ 下建立一个 <code>halplatform.c</code> 文件，写上如下代码。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">machbstart_t_init</span><span class="token punctuation">(</span><span class="token class-name">machbstart_t</span> <span class="token operator">*</span>initp<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token comment">//清零</span>
    <span class="token function">memset</span><span class="token punctuation">(</span>initp<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token class-name">machbstart_t</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">void</span> <span class="token function">init_machbstart</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name">machbstart_t</span> <span class="token operator">*</span>kmbsp <span class="token operator">=</span> <span class="token operator">&amp;</span>kmachbsp<span class="token punctuation">;</span>
    <span class="token class-name">machbstart_t</span> <span class="token operator">*</span>smbsp <span class="token operator">=</span> MBSPADR<span class="token punctuation">;</span><span class="token comment">//物理地址1MB处</span>
    <span class="token function">machbstart_t_init</span><span class="token punctuation">(</span>kmbsp<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//复制，要把地址转换成虚拟地址</span>
    <span class="token function">memcopy</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token function">phyadr_to_viradr</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">adr_t</span><span class="token punctuation">)</span>smbsp<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token operator">*</span><span class="token punctuation">)</span>kmbsp<span class="token punctuation">,</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token class-name">machbstart_t</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//平台初始化函数</span>
<span class="token keyword">void</span> <span class="token function">init_halplaltform</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token comment">//复制机器信息结构</span>
    <span class="token function">init_machbstart</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//初始化图形显示驱动</span>
    <span class="token function">init_bdvideo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个代码中别的地方很好理解，就是 kmachbsp 你可能会有点奇怪，它是个结构体变量，结构体类型是 machbstart_t，这个结构和二级引导器所使用的一模一样。</p><h2 id="hal-层全局变量-halglobal-c" tabindex="-1"><a class="header-anchor" href="#hal-层全局变量-halglobal-c" aria-hidden="true">#</a> hal 层全局变量: halglobal.c</h2><p>同时，它还是一个 hal 层的全局变量，我们想专门有个文件定义<strong>所有 hal 层的全局变量</strong>，于是我们在 Cosmos/hal/x86/ 下建立一个 <code>halglobal.c</code> 文件，写上如下代码。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">//全局变量定义变量放在data段</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name function">HAL_DEFGLOB_VARIABLE</span><span class="token expression"><span class="token punctuation">(</span>vartype<span class="token punctuation">,</span>varname<span class="token punctuation">)</span> </span><span class="token punctuation">\\</span>
<span class="token expression">EXTERN  <span class="token keyword">__attribute__</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token function">section</span><span class="token punctuation">(</span></span><span class="token string">&quot;.data&quot;</span><span class="token expression"><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> vartype varname</span></span>

<span class="token function">HAL_DEFGLOB_VARIABLE</span><span class="token punctuation">(</span><span class="token class-name">machbstart_t</span><span class="token punctuation">,</span>kmachbsp<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>前面的 EXTERN，在 halglobal.c 文件中定义为空，而在其它文件中定义为 extern，告诉编译器这是外部文件的变量，避免发生错误。</p><h2 id="图形驱动相关初始化-bdvideo-c" tabindex="-1"><a class="header-anchor" href="#图形驱动相关初始化-bdvideo-c" aria-hidden="true">#</a> 图形驱动相关初始化: bdvideo.c</h2><p>下面，我们在 Cosmos/hal/x86/ 下的 <code>bdvideo.c</code> 文件中，写好 init_bdvideo 函数。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">init_bdvideo</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name">dftgraph_t</span> <span class="token operator">*</span>kghp <span class="token operator">=</span> <span class="token operator">&amp;</span>kdftgh<span class="token punctuation">;</span>
    <span class="token comment">//初始化图形数据结构，里面放有图形模式，分辨率，图形驱动函数指针</span>
    <span class="token function">init_dftgraph</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//初始bga图形显卡的函数指针</span>
    <span class="token function">init_bga</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//初始vbe图形显卡的函数指针</span>
    <span class="token function">init_vbe</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//清空屏幕 为黑色</span>
    <span class="token function">fill_graph</span><span class="token punctuation">(</span>kghp<span class="token punctuation">,</span> <span class="token function">BGRA</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//显示背景图片 </span>
    <span class="token function">set_charsdxwflush</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">hal_background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>init_dftgraph() 函数初始了 dftgraph_t 结构体类型的变量 kdftgh，我们在 <code>halglobal.c</code> 文件中定义这个变量，结构类型我们这样来定义。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">s_DFTGRAPH</span>
<span class="token punctuation">{</span>
    <span class="token class-name">u64_t</span> gh_mode<span class="token punctuation">;</span>         <span class="token comment">//图形模式</span>
    <span class="token class-name">u64_t</span> gh_x<span class="token punctuation">;</span>            <span class="token comment">//水平像素点</span>
    <span class="token class-name">u64_t</span> gh_y<span class="token punctuation">;</span>            <span class="token comment">//垂直像素点</span>
    <span class="token class-name">u64_t</span> gh_framphyadr<span class="token punctuation">;</span>   <span class="token comment">//显存物理地址 </span>
    <span class="token class-name">u64_t</span> gh_fvrmphyadr<span class="token punctuation">;</span>   <span class="token comment">//显存虚拟地址</span>
    <span class="token class-name">u64_t</span> gh_fvrmsz<span class="token punctuation">;</span>       <span class="token comment">//显存大小</span>
    <span class="token class-name">u64_t</span> gh_onepixbits<span class="token punctuation">;</span>   <span class="token comment">//一个像素字占用的数据位数</span>
    <span class="token class-name">u64_t</span> gh_onepixbyte<span class="token punctuation">;</span>
    <span class="token class-name">u64_t</span> gh_vbemodenr<span class="token punctuation">;</span>    <span class="token comment">//vbe模式号</span>
    <span class="token class-name">u64_t</span> gh_bank<span class="token punctuation">;</span>         <span class="token comment">//显存的bank数</span>
    <span class="token class-name">u64_t</span> gh_curdipbnk<span class="token punctuation">;</span>    <span class="token comment">//当前bank</span>
    <span class="token class-name">u64_t</span> gh_nextbnk<span class="token punctuation">;</span>      <span class="token comment">//下一个bank</span>
    <span class="token class-name">u64_t</span> gh_banksz<span class="token punctuation">;</span>       <span class="token comment">//bank大小</span>
    <span class="token class-name">u64_t</span> gh_fontadr<span class="token punctuation">;</span>      <span class="token comment">//字库地址</span>
    <span class="token class-name">u64_t</span> gh_fontsz<span class="token punctuation">;</span>       <span class="token comment">//字库大小</span>
    <span class="token class-name">u64_t</span> gh_fnthight<span class="token punctuation">;</span>     <span class="token comment">//字体高度</span>
    <span class="token class-name">u64_t</span> gh_nxtcharsx<span class="token punctuation">;</span>    <span class="token comment">//下一字符显示的x坐标</span>
    <span class="token class-name">u64_t</span> gh_nxtcharsy<span class="token punctuation">;</span>    <span class="token comment">//下一字符显示的y坐标</span>
    <span class="token class-name">u64_t</span> gh_linesz<span class="token punctuation">;</span>       <span class="token comment">//字符行高</span>
    <span class="token class-name">pixl_t</span> gh_deffontpx<span class="token punctuation">;</span>   <span class="token comment">//默认字体大小</span>
    <span class="token class-name">u64_t</span> gh_chardxw<span class="token punctuation">;</span>
    <span class="token class-name">u64_t</span> gh_flush<span class="token punctuation">;</span>
    <span class="token class-name">u64_t</span> gh_framnr<span class="token punctuation">;</span>
    <span class="token class-name">u64_t</span> gh_fshdata<span class="token punctuation">;</span>      <span class="token comment">//刷新相关的</span>
    <span class="token class-name">dftghops_t</span> gh_opfun<span class="token punctuation">;</span>   <span class="token comment">//图形驱动操作函数指针结构体</span>
<span class="token punctuation">}</span><span class="token class-name">dftgraph_t</span><span class="token punctuation">;</span>
<span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">s_DFTGHOPS</span>
<span class="token punctuation">{</span>
    <span class="token comment">//读写显存数据</span>
    <span class="token class-name">size_t</span> <span class="token punctuation">(</span><span class="token operator">*</span>dgo_read<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token keyword">void</span><span class="token operator">*</span> outp<span class="token punctuation">,</span><span class="token class-name">size_t</span> rdsz<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">size_t</span> <span class="token punctuation">(</span><span class="token operator">*</span>dgo_write<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token keyword">void</span><span class="token operator">*</span> inp<span class="token punctuation">,</span><span class="token class-name">size_t</span> wesz<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">sint_t</span> <span class="token punctuation">(</span><span class="token operator">*</span>dgo_ioctrl<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token keyword">void</span><span class="token operator">*</span> outp<span class="token punctuation">,</span><span class="token class-name">uint_t</span> iocode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//刷新</span>
    <span class="token keyword">void</span>   <span class="token punctuation">(</span><span class="token operator">*</span>dgo_flush<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">sint_t</span> <span class="token punctuation">(</span><span class="token operator">*</span>dgo_set_bank<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span> <span class="token class-name">sint_t</span> bnr<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//读写像素</span>
    <span class="token class-name">pixl_t</span> <span class="token punctuation">(</span><span class="token operator">*</span>dgo_readpix<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token class-name">uint_t</span> x<span class="token punctuation">,</span><span class="token class-name">uint_t</span> y<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">void</span>   <span class="token punctuation">(</span><span class="token operator">*</span>dgo_writepix<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token class-name">pixl_t</span> pix<span class="token punctuation">,</span><span class="token class-name">uint_t</span> x<span class="token punctuation">,</span><span class="token class-name">uint_t</span> y<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//直接读写像素 </span>
    <span class="token class-name">pixl_t</span> <span class="token punctuation">(</span><span class="token operator">*</span>dgo_dxreadpix<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token class-name">uint_t</span> x<span class="token punctuation">,</span><span class="token class-name">uint_t</span> y<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">void</span>   <span class="token punctuation">(</span><span class="token operator">*</span>dgo_dxwritepix<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token class-name">pixl_t</span> pix<span class="token punctuation">,</span><span class="token class-name">uint_t</span> x<span class="token punctuation">,</span><span class="token class-name">uint_t</span> y<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//设置x，y坐标和偏移</span>
    <span class="token class-name">sint_t</span> <span class="token punctuation">(</span><span class="token operator">*</span>dgo_set_xy<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token class-name">uint_t</span> x<span class="token punctuation">,</span><span class="token class-name">uint_t</span> y<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">sint_t</span> <span class="token punctuation">(</span><span class="token operator">*</span>dgo_set_vwh<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token class-name">uint_t</span> vwt<span class="token punctuation">,</span><span class="token class-name">uint_t</span> vhi<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">sint_t</span> <span class="token punctuation">(</span><span class="token operator">*</span>dgo_set_xyoffset<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token class-name">uint_t</span> xoff<span class="token punctuation">,</span><span class="token class-name">uint_t</span> yoff<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//获取x，y坐标和偏移</span>
    <span class="token class-name">sint_t</span> <span class="token punctuation">(</span><span class="token operator">*</span>dgo_get_xy<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token class-name">uint_t</span><span class="token operator">*</span> rx<span class="token punctuation">,</span><span class="token class-name">uint_t</span><span class="token operator">*</span> ry<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">sint_t</span> <span class="token punctuation">(</span><span class="token operator">*</span>dgo_get_vwh<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token class-name">uint_t</span><span class="token operator">*</span> rvwt<span class="token punctuation">,</span><span class="token class-name">uint_t</span><span class="token operator">*</span> rvhi<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">sint_t</span> <span class="token punctuation">(</span><span class="token operator">*</span>dgo_get_xyoffset<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token operator">*</span> ghpdev<span class="token punctuation">,</span><span class="token class-name">uint_t</span><span class="token operator">*</span> rxoff<span class="token punctuation">,</span><span class="token class-name">uint_t</span><span class="token operator">*</span> ryoff<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token class-name">dftghops_t</span><span class="token punctuation">;</span>
<span class="token comment">//刷新显存</span>
<span class="token keyword">void</span> <span class="token function">flush_videoram</span><span class="token punctuation">(</span><span class="token class-name">dftgraph_t</span> <span class="token operator">*</span>kghp<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    kghp<span class="token operator">-&gt;</span>gh_opfun<span class="token punctuation">.</span><span class="token function">dgo_flush</span><span class="token punctuation">(</span>kghp<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不难发现，我们正是把这些实际的图形驱动函数的地址填入了这个结构体中，然后通过这个结构体，我们就可以调用到相应的函数了。</p><p>因为写这些函数都是体力活，我已经帮你搞定了，你直接使用就可以。上面的 flush_videoram 函数已经证明了这一想法。</p><blockquote><p>来，我们测试一下，看看结果，我们图形驱动程序初始化会显示背景图片——<code>background.bmp</code>，这是在打包映像文件时包含进去的，你自己可以随时替换，只要是满足 <strong>1024*768，24 位的位图文件</strong>就行了。</p></blockquote><p>下面我们要把这些函数调用起来：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">//在halinit.c文件中</span>
<span class="token keyword">void</span> <span class="token function">init_hal</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token function">init_halplaltform</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//在hal_start.c文件中</span>
<span class="token keyword">void</span> <span class="token function">hal_start</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token function">init_hal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//初始化hal层，其中会调用初始化平台函数，在那里会调用初始化图形驱动</span>
    <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来，让我们一起 make vboxtest，应该很有成就感。一幅风景图呈现在我们面前，上面有 Cosmos 的版本、编译时间、CPU 工作模式，内存大小等数据。这相当一个我们 Cosmos 的水印信息。</p><img src="`+e+`" alt="img" style="zoom:25%;"><p>图形驱动测试</p><h2 id="初始化内存-halmm-c" tabindex="-1"><a class="header-anchor" href="#初始化内存-halmm-c" aria-hidden="true">#</a> 初始化内存: halmm.c</h2><p>首先，我们在 Cosmos/hal/x86/ 下建立一个 <code>halmm.c</code> 文件，用于初始化内存，为了后面的内存管理器作好准备。</p><p>hal 层的内存初始化比较容易，只要向内存管理器提供内存空间布局信息就可以。</p><p>你可能在想，不对啊，明明我们在二级引导器中已经获取了内存布局信息，是的，<strong>但 Cosmos 的内存管理器需要保存更多的信息，最好是顺序的内存布局信息，这样可以增加额外的功能属性，同时降低代码的复杂度。</strong></p><p>不难发现，BIOS 提供的结构无法满足前面这些要求。不过我们也有办法解决，只要以 BIOS 提供的结构为基础，设计一套新的数据结构就搞定了。这个结构可以这样设计。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">PMR_T_OSAPUSERRAM</span> <span class="token expression"><span class="token number">1</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">PMR_T_RESERVRAM</span> <span class="token expression"><span class="token number">2</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">PMR_T_HWUSERRAM</span> <span class="token expression"><span class="token number">8</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">PMR_T_ARACONRAM</span> <span class="token expression"><span class="token number">0xf</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">PMR_T_BUGRAM</span> <span class="token expression"><span class="token number">0xff</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">PMR_F_X86_32</span> <span class="token expression"><span class="token punctuation">(</span><span class="token number">1</span><span class="token operator">&lt;&lt;</span><span class="token number">0</span><span class="token punctuation">)</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">PMR_F_X86_64</span> <span class="token expression"><span class="token punctuation">(</span><span class="token number">1</span><span class="token operator">&lt;&lt;</span><span class="token number">1</span><span class="token punctuation">)</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">PMR_F_ARM_32</span> <span class="token expression"><span class="token punctuation">(</span><span class="token number">1</span><span class="token operator">&lt;&lt;</span><span class="token number">2</span><span class="token punctuation">)</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">PMR_F_ARM_64</span> <span class="token expression"><span class="token punctuation">(</span><span class="token number">1</span><span class="token operator">&lt;&lt;</span><span class="token number">3</span><span class="token punctuation">)</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">PMR_F_HAL_MASK</span> <span class="token expression"><span class="token number">0xff</span></span></span>

<span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">s_PHYMMARGE</span>
<span class="token punctuation">{</span>
    <span class="token class-name">spinlock_t</span> pmr_lock<span class="token punctuation">;</span><span class="token comment">//保护这个结构是自旋锁</span>
    <span class="token class-name">u32_t</span> pmr_type<span class="token punctuation">;</span>     <span class="token comment">//内存地址空间类型</span>
    <span class="token class-name">u32_t</span> pmr_stype<span class="token punctuation">;</span>
    <span class="token class-name">u32_t</span> pmr_dtype<span class="token punctuation">;</span>    <span class="token comment">//内存地址空间的子类型，见上面的宏</span>
    <span class="token class-name">u32_t</span> pmr_flgs<span class="token punctuation">;</span>     <span class="token comment">//结构的标志与状态</span>
    <span class="token class-name">u32_t</span> pmr_stus<span class="token punctuation">;</span>
    <span class="token class-name">u64_t</span> pmr_saddr<span class="token punctuation">;</span>    <span class="token comment">//内存空间的开始地址</span>
    <span class="token class-name">u64_t</span> pmr_lsize<span class="token punctuation">;</span>    <span class="token comment">//内存空间的大小</span>
    <span class="token class-name">u64_t</span> pmr_end<span class="token punctuation">;</span>      <span class="token comment">//内存空间的结束地址</span>
    <span class="token class-name">u64_t</span> pmr_rrvmsaddr<span class="token punctuation">;</span><span class="token comment">//内存保留空间的开始地址</span>
    <span class="token class-name">u64_t</span> pmr_rrvmend<span class="token punctuation">;</span>  <span class="token comment">//内存保留空间的结束地址</span>
    <span class="token keyword">void</span><span class="token operator">*</span> pmr_prip<span class="token punctuation">;</span>     <span class="token comment">//结构的私有数据指针，以后扩展所用</span>
    <span class="token keyword">void</span><span class="token operator">*</span> pmr_extp<span class="token punctuation">;</span>     <span class="token comment">//结构的扩展数据指针，以后扩展所用</span>
<span class="token punctuation">}</span><span class="token class-name">phymmarge_t</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有些情况下内核要另起炉灶，不想把所有的内存空间都交给内存管理器去管理，所以要保留一部分内存空间，这就是上面结构中那两个 pmr_rrvmsaddr、pmr_rrvmend 字段的作用。</p><p>有了数据结构，我们还要写代码来操作它：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token class-name">u64_t</span> <span class="token function">initpmrge_core</span><span class="token punctuation">(</span><span class="token class-name">e820map_t</span> <span class="token operator">*</span>e8sp<span class="token punctuation">,</span> <span class="token class-name">u64_t</span> e8nr<span class="token punctuation">,</span> <span class="token class-name">phymmarge_t</span> <span class="token operator">*</span>pmargesp<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name">u64_t</span> retnr <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">u64_t</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> e8nr<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token comment">//根据一个e820map_t结构建立一个phymmarge_t结构</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">init_one_pmrge</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>e8sp<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token operator">&amp;</span>pmargesp<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">==</span> FALSE<span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            <span class="token keyword">return</span> retnr<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        retnr<span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> retnr<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">void</span> <span class="token function">init_phymmarge</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name">machbstart_t</span> <span class="token operator">*</span>mbsp <span class="token operator">=</span> <span class="token operator">&amp;</span>kmachbsp<span class="token punctuation">;</span>
    <span class="token class-name">phymmarge_t</span> <span class="token operator">*</span>pmarge_adr <span class="token operator">=</span> <span class="token constant">NULL</span><span class="token punctuation">;</span>
    <span class="token class-name">u64_t</span> pmrgesz <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token comment">//根据machbstart_t机器信息结构计算获得phymmarge_t结构的开始地址和大小</span>
    <span class="token function">ret_phymmarge_adrandsz</span><span class="token punctuation">(</span>mbsp<span class="token punctuation">,</span> <span class="token operator">&amp;</span>pmarge_adr<span class="token punctuation">,</span> <span class="token operator">&amp;</span>pmrgesz<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">u64_t</span> tmppmrphyadr <span class="token operator">=</span> mbsp<span class="token operator">-&gt;</span>mb_nextwtpadr<span class="token punctuation">;</span>
    <span class="token class-name">e820map_t</span> <span class="token operator">*</span>e8p <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">e820map_t</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">adr_t</span><span class="token punctuation">)</span><span class="token punctuation">(</span>mbsp<span class="token operator">-&gt;</span>mb_e820padr<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//建立phymmarge_t结构</span>
    <span class="token class-name">u64_t</span> ipmgnr <span class="token operator">=</span> <span class="token function">initpmrge_core</span><span class="token punctuation">(</span>e8p<span class="token punctuation">,</span> mbsp<span class="token operator">-&gt;</span>mb_e820nr<span class="token punctuation">,</span> pmarge_adr<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//把phymmarge_t结构的地址大小个数保存machbstart_t机器信息结构中</span>
    mbsp<span class="token operator">-&gt;</span>mb_e820expadr <span class="token operator">=</span> tmppmrphyadr<span class="token punctuation">;</span>
    mbsp<span class="token operator">-&gt;</span>mb_e820exnr <span class="token operator">=</span> ipmgnr<span class="token punctuation">;</span>
    mbsp<span class="token operator">-&gt;</span>mb_e820exsz <span class="token operator">=</span> ipmgnr <span class="token operator">*</span> <span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token class-name">phymmarge_t</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    mbsp<span class="token operator">-&gt;</span>mb_nextwtpadr <span class="token operator">=</span> <span class="token function">PAGE_ALIGN</span><span class="token punctuation">(</span>mbsp<span class="token operator">-&gt;</span>mb_e820expadr <span class="token operator">+</span> mbsp<span class="token operator">-&gt;</span>mb_e820exsz<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//phymmarge_t结构中地址空间从低到高进行排序，我已经帮你写好了</span>
    <span class="token function">phymmarge_sort</span><span class="token punctuation">(</span>pmarge_adr<span class="token punctuation">,</span> ipmgnr<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结合上面的代码，你会发现这是根据 e820map_t 结构数组，建立了一个 phymmarge_t 结构数组，init_one_pmrge 函数正是把 e820map_t 结构中的信息复制到 phymmarge_t 结构中来。理解了这个原理，即使不看我的，你自己也会写。</p><p>下面我们把这些函数，用一个总管函数调动起来，这个总管函数叫什么名字好呢？当然是 init_halmm，如下所示。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">init_halmm</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token function">init_phymmarge</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//init_memmgr();</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里 init_halmm 函数中还调用了 init_memmgr 函数，这个正是这我们内存管理器初始化函数，我会在内存管理的那节课展开讲。而 init_halmm 函数将要被 init_hal 函数调用。</p><h2 id="初始化中断-kernel-asm" tabindex="-1"><a class="header-anchor" href="#初始化中断-kernel-asm" aria-hidden="true">#</a> 初始化中断: kernel.asm</h2><p>什么是中断呢？为了帮你快速理解，我们先来看两种情景：</p><p>1.你在开车时，突然汽车引擎坏了，你需要修复它才能继续驾驶汽车……</p><p>2.你在外旅游，你女朋友突然来电话了，你可以选择接电话或者不接电话，当然不接电话的后果很严重（笑）……</p><p>在以上两种情景中，虽然不十分恰当，但都是在做一件事时，因为一些原因而要切换到另一件事上。其实计算机中的 CPU 也是一样，在做一件事时，因为一些原因要转而做另一件事，于是中断产生了……</p><p>根据原因的类型不同，中断被分为两类。</p><ul><li><strong><code>异常</code>，这是<code>同步</code>的，原因是错误和故障</strong>，就像汽车引擎坏了。不修复错误就不能继续运行，所以这时，CPU 会跳到这种错误的处理代码那里开始运行，运行完了会返回。</li></ul><blockquote><p>为啥说它是同步的呢？这是因为如果不修改程序中的错误，下次运行程序到这里同样会发生异常。</p></blockquote><ul><li><strong><code>中断</code>，这是<code>异步</code>的，我们通常说的中断就是这种类型，它是因为外部事件而产生的</strong>，就好像旅游时女朋友来电话了。通常设备需要 CPU 关注时，会给 CPU 发送一个中断信号，所以这时 CPU 会跳到处理这种事件的代码那里开始运行，运行完了会返回。</li></ul><blockquote><p>由于不确定何种设备何时发出这种中断信号，所以它是异步的。</p></blockquote><p>在 x86 CPU 上，最多支持 256 个中断，还记得前面所说的中断表和中断门描述符吗，这意味着我们要准备 256 个中断门描述符和 256 个中断处理程序的入口。</p><p>下面我们来定义它，如下所示：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">s_GATE</span>
<span class="token punctuation">{</span>
        <span class="token class-name">u16_t</span>   offset_low<span class="token punctuation">;</span>     <span class="token comment">/* 偏移 */</span>
        <span class="token class-name">u16_t</span>   selector<span class="token punctuation">;</span>       <span class="token comment">/* 段选择子 */</span>
        <span class="token class-name">u8_t</span>    dcount<span class="token punctuation">;</span>         <span class="token comment">/* 该字段只在调用门描述符中有效。如果在利用调用门调用子程序时引起特权级的转换和堆栈的改变，需要将外层堆栈中的参数复制到内层堆栈。该双字计数字段就是用于说明这种情况发生时，要复制的双字参数的数量。*/</span>
        <span class="token class-name">u8_t</span>    attr<span class="token punctuation">;</span>           <span class="token comment">/* P(1) DPL(2) DT(1) TYPE(4) */</span>
        <span class="token class-name">u16_t</span>   offset_high<span class="token punctuation">;</span>    <span class="token comment">/* 偏移的高位段 */</span>
        <span class="token class-name">u32_t</span>   offset_high_h<span class="token punctuation">;</span>
        <span class="token class-name">u32_t</span>   offset_resv<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token keyword">__attribute__</span><span class="token punctuation">(</span><span class="token punctuation">(</span>packed<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token class-name">gate_t</span><span class="token punctuation">;</span>
<span class="token comment">//定义中断表</span>
<span class="token function">HAL_DEFGLOB_VARIABLE</span><span class="token punctuation">(</span><span class="token class-name">gate_t</span><span class="token punctuation">,</span>x64_idt<span class="token punctuation">)</span><span class="token punctuation">[</span>IDTMAX<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码，正是按照要求，把这些数据填入中断门描述符中的。有了中断门之后，还差中断入口处理程序，中断入口处理程序只负责这三件事：</p><p>\\1. 保护 CPU 寄存器，即中断发生时的程序运行的上下文。</p><p>\\2. 调用中断处理程序，这个程序可以是修复异常的，可以是设备驱动程序中对设备响应的程序。</p><p>\\3. 恢复 CPU 寄存器，即恢复中断时程序运行的上下文，使程序继续运行。</p><p>以上这些操作又要用汇编代码才可以编写，我觉得这是内核中最重要的部分，所以我们建立一个文件，并用 kernel.asm 命名。</p><p>我们先来写好完成以上三个功能的汇编宏代码，避免写 256 遍同样的代码，代码如下所示。</p><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>//保存中断后的寄存器
%macro  SAVEALL  0
  push rax
  push rbx
  push rcx
  push rdx
  push rbp
  push rsi
  push rdi
  push r8
  push r9
  push r10
  push r11
  push r12
  push r13
  push r14
  push r15
  xor r14,r14
  mov r14w,ds
  push r14
  mov r14w,es
  push r14
  mov r14w,fs
  push r14
  mov r14w,gs
  push r14
%endmacro
//恢复中断后寄存器
%macro  RESTOREALL  0
  pop r14
  mov gs,r14w
  pop r14 
  mov fs,r14w
  pop r14
  mov es,r14w
  pop r14
  mov ds,r14w
  pop r15
  pop r14
  pop r13
  pop r12
  pop r11
  pop r10
  pop r9
  pop r8
  pop rdi
  pop rsi
  pop rbp
  pop rdx
  pop rcx
  pop rbx
  pop rax
  iretq
%endmacro
//保存异常下的寄存器
%macro  SAVEALLFAULT 0
  push rax
  push rbx
  push rcx
  push rdx
  push rbp
  push rsi
  push rdi
  push r8
  push r9
  push r10
  push r11
  push r12
  push r13
  push r14
  push r15
  xor r14,r14
  mov r14w,ds
  push r14
  mov r14w,es
  push r14
  mov r14w,fs
  push r14
  mov r14w,gs
  push r14
%endmacro
//恢复异常下寄存器
%macro  RESTOREALLFAULT  0
  pop r14
  mov gs,r14w
  pop r14 
  mov fs,r14w
  pop r14
  mov es,r14w
  pop r14
  mov ds,r14w
  pop r15
  pop r14
  pop r13
  pop r12
  pop r11
  pop r10
  pop r9
  pop r8
  pop rdi
  pop rsi
  pop rbp
  pop rdx
  pop rcx
  pop rbx
  pop rax
  add rsp,8
  iretq
%endmacro
//没有错误码CPU异常
%macro  SRFTFAULT 1
  push    _NOERRO_CODE
  SAVEALLFAULT
  mov r14w,0x10
  mov ds,r14w
  mov es,r14w
  mov fs,r14w
  mov gs,r14w
  mov   rdi,%1 ;rdi, rsi
  mov   rsi,rsp
  call   hal_fault_allocator
  RESTOREALLFAULT
%endmacro
//CPU异常
%macro  SRFTFAULT_ECODE 1
  SAVEALLFAULT
  mov r14w,0x10
  mov ds,r14w
  mov es,r14w
  mov fs,r14w
  mov gs,r14w
  mov   rdi,%1
  mov   rsi,rsp
  call   hal_fault_allocator
  RESTOREALLFAULT
%endmacro
//硬件中断
%macro  HARWINT  1
  SAVEALL
  mov r14w,0x10
  mov ds,r14w
  mov es,r14w
  mov fs,r14w
  mov gs,r14w
  mov  rdi, %1
  mov   rsi,rsp
  call    hal_intpt_allocator
  RESTOREALL
%endmacro
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>别看前面的代码这么长，其实<strong>最重要的只有两个指令：push、pop</strong>，这两个正是用来压入寄存器和弹出寄存器的，正好可以用来保存和恢复 CPU 所有的通用寄存器。</p><p>有的 CPU 异常，CPU 自动把异常码压入到栈中，而有的 CPU 异常没有异常码，<strong>为了统一，我们对没有异常码的手动压入一个常数，维持栈的平衡。</strong></p><p>有了中断异常处理的宏，我们还要它们变成中断异常的处理程序入口点函数。汇编函数其实就是一个标号加一段汇编代码，C 编译器把 C 语言函数编译成汇编代码后，也是标号加汇编代码，函数名就是标号。</p><p>下面我们在 <code>kernel.asm</code> 中写好它们：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">//除法错误异常 比如除0</span>
exc_divide_error<span class="token operator">:</span>
  SRFTFAULT <span class="token number">0</span>
<span class="token comment">//单步执行异常</span>
exc_single_step_exception<span class="token operator">:</span>
  SRFTFAULT <span class="token number">1</span>
exc_nmi<span class="token operator">:</span>
  SRFTFAULT <span class="token number">2</span>
<span class="token comment">//调试断点异常</span>
exc_breakpoint_exception<span class="token operator">:</span>
  SRFTFAULT <span class="token number">3</span>
<span class="token comment">//溢出异常</span>
exc_overflow<span class="token operator">:</span>
  SRFTFAULT <span class="token number">4</span>
<span class="token comment">//段不存在异常</span>
exc_segment_not_present<span class="token operator">:</span>
  SRFTFAULT_ECODE <span class="token number">11</span>
<span class="token comment">//栈异常</span>
exc_stack_exception<span class="token operator">:</span>
  SRFTFAULT_ECODE <span class="token number">12</span>
<span class="token comment">//通用异常</span>
exc_general_protection<span class="token operator">:</span>
  SRFTFAULT_ECODE <span class="token number">13</span>
<span class="token comment">//缺页异常</span>
exc_page_fault<span class="token operator">:</span>
  SRFTFAULT_ECODE <span class="token number">14</span>
hxi_exc_general_intpfault<span class="token operator">:</span>
  SRFTFAULT <span class="token number">256</span>
<span class="token comment">//硬件1～7号中断</span>
hxi_hwint00<span class="token operator">:</span>
  <span class="token function">HARWINT</span>  <span class="token punctuation">(</span>INT_VECTOR_IRQ0<span class="token operator">+</span><span class="token number">0</span><span class="token punctuation">)</span>
hxi_hwint01<span class="token operator">:</span>
  <span class="token function">HARWINT</span>  <span class="token punctuation">(</span>INT_VECTOR_IRQ0<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">)</span>
hxi_hwint02<span class="token operator">:</span>
  <span class="token function">HARWINT</span>  <span class="token punctuation">(</span>INT_VECTOR_IRQ0<span class="token operator">+</span><span class="token number">2</span><span class="token punctuation">)</span>
hxi_hwint03<span class="token operator">:</span>
  <span class="token function">HARWINT</span>  <span class="token punctuation">(</span>INT_VECTOR_IRQ0<span class="token operator">+</span><span class="token number">3</span><span class="token punctuation">)</span>
hxi_hwint04<span class="token operator">:</span>
  <span class="token function">HARWINT</span>  <span class="token punctuation">(</span>INT_VECTOR_IRQ0<span class="token operator">+</span><span class="token number">4</span><span class="token punctuation">)</span>
hxi_hwint05<span class="token operator">:</span>
  <span class="token function">HARWINT</span>  <span class="token punctuation">(</span>INT_VECTOR_IRQ0<span class="token operator">+</span><span class="token number">5</span><span class="token punctuation">)</span>
hxi_hwint06<span class="token operator">:</span>
  <span class="token function">HARWINT</span>  <span class="token punctuation">(</span>INT_VECTOR_IRQ0<span class="token operator">+</span><span class="token number">6</span><span class="token punctuation">)</span>
hxi_hwint07<span class="token operator">:</span>
  <span class="token function">HARWINT</span>  <span class="token punctuation">(</span>INT_VECTOR_IRQ0<span class="token operator">+</span><span class="token number">7</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="函数设置中断门描述符-halgdtidt-c" tabindex="-1"><a class="header-anchor" href="#函数设置中断门描述符-halgdtidt-c" aria-hidden="true">#</a> 函数设置中断门描述符: halgdtidt.c</h2><p>为了突出重点，这里没有全部展示代码 ，你只用搞清原理就行了。那有了<code>中断处理程序的入口地址</code>，下面我们就可以在 <code>halsgdidt.c</code> 文件写出<strong>函数设置中断门描述符</strong>了，代码如下。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">init_idt_descriptor</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
<span class="token comment">//一开始把所有中断的处理程序设置为保留的通用处理程序</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">u16_t</span> intindx <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> intindx <span class="token operator">&lt;=</span> <span class="token number">255</span><span class="token punctuation">;</span> intindx<span class="token operator">++</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token function">set_idt_desc</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">u8_t</span><span class="token punctuation">)</span>intindx<span class="token punctuation">,</span> DA_386IGate<span class="token punctuation">,</span> hxi_exc_general_intpfault<span class="token punctuation">,</span> PRIVILEGE_KRNL<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token function">set_idt_desc</span><span class="token punctuation">(</span>INT_VECTOR_DIVIDE<span class="token punctuation">,</span> DA_386IGate<span class="token punctuation">,</span> exc_divide_error<span class="token punctuation">,</span> PRIVILEGE_KRNL<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">set_idt_desc</span><span class="token punctuation">(</span>INT_VECTOR_DEBUG<span class="token punctuation">,</span> DA_386IGate<span class="token punctuation">,</span> exc_single_step_exception<span class="token punctuation">,</span> PRIVILEGE_KRNL<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">set_idt_desc</span><span class="token punctuation">(</span>INT_VECTOR_NMI<span class="token punctuation">,</span> DA_386IGate<span class="token punctuation">,</span> exc_nmi<span class="token punctuation">,</span> PRIVILEGE_KRNL<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">set_idt_desc</span><span class="token punctuation">(</span>INT_VECTOR_BREAKPOINT<span class="token punctuation">,</span> DA_386IGate<span class="token punctuation">,</span> exc_breakpoint_exception<span class="token punctuation">,</span> PRIVILEGE_USER<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">set_idt_desc</span><span class="token punctuation">(</span>INT_VECTOR_OVERFLOW<span class="token punctuation">,</span> DA_386IGate<span class="token punctuation">,</span> exc_overflow<span class="token punctuation">,</span> PRIVILEGE_USER<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//篇幅所限，未全部展示</span>
    <span class="token function">set_idt_desc</span><span class="token punctuation">(</span>INT_VECTOR_PAGE_FAULT<span class="token punctuation">,</span> DA_386IGate<span class="token punctuation">,</span> exc_page_fault<span class="token punctuation">,</span> PRIVILEGE_KRNL<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">set_idt_desc</span><span class="token punctuation">(</span>INT_VECTOR_IRQ0 <span class="token operator">+</span> <span class="token number">0</span><span class="token punctuation">,</span> DA_386IGate<span class="token punctuation">,</span> hxi_hwint00<span class="token punctuation">,</span> PRIVILEGE_KRNL<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">set_idt_desc</span><span class="token punctuation">(</span>INT_VECTOR_IRQ0 <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> DA_386IGate<span class="token punctuation">,</span> hxi_hwint01<span class="token punctuation">,</span> PRIVILEGE_KRNL<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">set_idt_desc</span><span class="token punctuation">(</span>INT_VECTOR_IRQ0 <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">,</span> DA_386IGate<span class="token punctuation">,</span> hxi_hwint02<span class="token punctuation">,</span> PRIVILEGE_KRNL<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">set_idt_desc</span><span class="token punctuation">(</span>INT_VECTOR_IRQ0 <span class="token operator">+</span> <span class="token number">3</span><span class="token punctuation">,</span> DA_386IGate<span class="token punctuation">,</span> hxi_hwint03<span class="token punctuation">,</span> PRIVILEGE_KRNL<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//篇幅所限，未全部展示</span>
     <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码已经很明显了，一开始把所有中断的处理程序设置为保留的通用处理程序，避免未知中断异常发生了 CPU 无处可去，然后对已知的中断和异常进一步设置，这会覆盖之前的通用处理程序，这样就可以确保万无一失。</p><h2 id="供上层使用的中断-halintupt-c" tabindex="-1"><a class="header-anchor" href="#供上层使用的中断-halintupt-c" aria-hidden="true">#</a> 供上层使用的中断: halintupt.c</h2><p>下面我们把这些代码整理一下，安装到具体的调用路径上，让上层调用者调用到就好了。</p><p>我们依然在 <code>halintupt.c</code> 文件中写上 init_halintupt() 函数：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">init_halintupt</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token function">init_idt_descriptor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">init_intfltdsc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到此为止，CPU 体系层面的中断就初始化完成了。你会发现，我们在 init_halintupt() 函数中还调用了 <strong>init_intfltdsc() 函数</strong>，这个函数是干什么的呢？请往下看。</p><p>我们先来设计一下 Cosmos 的中断处理框架，后面我们把中断和异常统称为中断，因为它们的处理方式相同。</p><h2 id="中断处理框架设计" tabindex="-1"><a class="header-anchor" href="#中断处理框架设计" aria-hidden="true">#</a> 中断处理框架设计</h2><p>前面我们只是解决了中断的 CPU 相关部分，而 CPU 只是响应中断，但是并不能解决产生中断的问题。</p><p>比如缺页中断来了，我们要解决内存地址映射关系，程序才可以继续运行。再比如硬盘中断来了，我们要读取硬盘的数据，要处理这问题，就要写好相应的处理函数。</p><p><strong>因为有些处理是内核所提供的，而有些处理函数是设备驱动提供的</strong>，想让它们和中断关联起来，就要好好设计<strong>中断处理框架</strong>了。</p><p>下面我们来画幅图，描述中断框架的设计：</p><img src="`+t+`" alt="img" style="zoom:15%;"><p>中断框架设计图</p><p>可以看到，中断、异常分发器的左侧的东西我们已经处理完成，下面需要写好<mark>中断</mark>、<mark>异常分发器</mark>和<mark>中断异常描述符</mark>。</p><h3 id="一-中断异常描述符" tabindex="-1"><a class="header-anchor" href="#一-中断异常描述符" aria-hidden="true">#</a> 一\\中断异常描述符</h3><p>我们先来搞定<mark>中断异常描述</mark>，结合框架图，中断异常描述也是个表，它在 C 语言中就是个结构数组，让我们一起来写好这个数组：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">s_INTFLTDSC</span><span class="token punctuation">{</span>    
    <span class="token class-name">spinlock_t</span>  i_lock<span class="token punctuation">;</span>    
    <span class="token class-name">u32_t</span>       i_flg<span class="token punctuation">;</span>    
    <span class="token class-name">u32_t</span>       i_stus<span class="token punctuation">;</span>    
    <span class="token class-name">uint_t</span>      i_prity<span class="token punctuation">;</span>        <span class="token comment">//中断优先级    </span>
    <span class="token class-name">uint_t</span>      i_irqnr<span class="token punctuation">;</span>        <span class="token comment">//中断号    </span>
    <span class="token class-name">uint_t</span>      i_deep<span class="token punctuation">;</span>         <span class="token comment">//中断嵌套深度    </span>
    <span class="token class-name">u64_t</span>       i_indx<span class="token punctuation">;</span>         <span class="token comment">//中断计数    </span>
    <span class="token class-name">list_h_t</span>    i_serlist<span class="token punctuation">;</span>      <span class="token comment">//也可以使用中断回调函数的方式</span>
    <span class="token class-name">uint_t</span>      i_sernr<span class="token punctuation">;</span>        <span class="token comment">//中断回调函数个数   </span>
    <span class="token class-name">list_h_t</span>    i_serthrdlst<span class="token punctuation">;</span>   <span class="token comment">//中断线程链表头    </span>
    <span class="token class-name">uint_t</span>      i_serthrdnr<span class="token punctuation">;</span>    <span class="token comment">//中断线程个数    </span>
    <span class="token keyword">void</span><span class="token operator">*</span>       i_onethread<span class="token punctuation">;</span>    <span class="token comment">//只有一个中断线程时直接用指针    </span>
    <span class="token keyword">void</span><span class="token operator">*</span>       i_rbtreeroot<span class="token punctuation">;</span>   <span class="token comment">//如果中断线程太多则按优先级组成红黑树</span>
    <span class="token class-name">list_h_t</span>    i_serfisrlst<span class="token punctuation">;</span>      
    <span class="token class-name">uint_t</span>      i_serfisrnr<span class="token punctuation">;</span>       
    <span class="token keyword">void</span><span class="token operator">*</span>       i_msgmpool<span class="token punctuation">;</span>     <span class="token comment">//可能的中断消息池    </span>
    <span class="token keyword">void</span><span class="token operator">*</span>       i_privp<span class="token punctuation">;</span>    
    <span class="token keyword">void</span><span class="token operator">*</span>       i_extp<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token class-name">intfltdsc_t</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面结构中，记录了中断的优先级。因为有些中断可以稍后执行，而有的中断需要紧急执行，所以要设计一个优先级。其中还有中断号，中断计数等统计信息。</p><p>中断可以由<strong>线程</strong>的方式执行，也可以是一个<strong>回调函数</strong>，该函数的地址放另一个结构体中，这个结构体我已经帮你写好了，如下所示。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">typedef</span> <span class="token class-name">drvstus_t</span> <span class="token punctuation">(</span><span class="token operator">*</span><span class="token class-name">intflthandle_t</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token class-name">uint_t</span> ift_nr<span class="token punctuation">,</span><span class="token keyword">void</span><span class="token operator">*</span> device<span class="token punctuation">,</span><span class="token keyword">void</span><span class="token operator">*</span> sframe<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//中断处理函数的指针类型</span>
<span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">s_INTSERDSC</span><span class="token punctuation">{</span>    
    <span class="token class-name">list_h_t</span>    s_list<span class="token punctuation">;</span>        <span class="token comment">//在中断异常描述符中的链表</span>
    <span class="token class-name">list_h_t</span>    s_indevlst<span class="token punctuation">;</span>    <span class="token comment">//在设备描述描述符中的链表</span>
    <span class="token class-name">u32_t</span>       s_flg<span class="token punctuation">;</span>        
    <span class="token class-name">intfltdsc_t</span><span class="token operator">*</span> s_intfltp<span class="token punctuation">;</span>    <span class="token comment">//指向中断异常描述符 </span>
    <span class="token keyword">void</span><span class="token operator">*</span>       s_device<span class="token punctuation">;</span>      <span class="token comment">//指向设备描述符</span>
    <span class="token class-name">uint_t</span>      s_indx<span class="token punctuation">;</span>    
    <span class="token class-name">intflthandle_t</span> s_handle<span class="token punctuation">;</span>   <span class="token comment">//中断处理的回调函数指针</span>
<span class="token punctuation">}</span><span class="token class-name">intserdsc_t</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果内核或者设备驱动程序要安装一个中断处理函数，就要先申请一个 intserdsc_t 结构体，然后把中断函数的地址写入其中，最后把这个结构挂载到对应的 intfltdsc_t 结构中的 i_serlist 链表中。</p><h3 id="设计缘由" tabindex="-1"><a class="header-anchor" href="#设计缘由" aria-hidden="true">#</a> 设计缘由</h3><p>你可能要问了，为什么不能直接把中断处理函数放在 intfltdsc_t 结构中呢，还要多此一举搞个 intserdsc_t 结构体呢？</p><p>这是因为我们的计算机中可能有很多设备，每个设备都可能产生中断，但是中断控制器的中断信号线是有限的。你可以这样理解：中断控制器最多只能产生几十号中断号，而设备不止几十个，<strong>所以会有多个设备共享一根中断信号线</strong>。</p><p>这就导致一个中断发生后，无法确定是哪个设备产生的中断，所以我们干脆让设备驱动程序来决定，因为它是最了解设备的。</p><p>这里我们让这个 intfltdsc_t 结构上的所有中断处理函数都依次执行，查看是不是自己的设备产生了中断，如果是就处理，不是则略过。</p><h3 id="初始化" tabindex="-1"><a class="header-anchor" href="#初始化" aria-hidden="true">#</a> 初始化</h3><p>好，明白了这两个结构之后，我们就要开始初始化了。首先是在 halglobal.c 文件定义 intfltdsc_t 结构。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">//定义intfltdsc_t结构数组大小为256</span>
<span class="token function">HAL_DEFGLOB_VARIABLE</span><span class="token punctuation">(</span><span class="token class-name">intfltdsc_t</span><span class="token punctuation">,</span>machintflt<span class="token punctuation">)</span><span class="token punctuation">[</span>IDTMAX<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="二-中断函数-异常分发函数" tabindex="-1"><a class="header-anchor" href="#二-中断函数-异常分发函数" aria-hidden="true">#</a> 二\\中断函数 + 异常分发函数</h3><p>下面我们再来实现中断、异常分发器函数，如下所示。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">//中断处理函数</span>
<span class="token keyword">void</span> <span class="token function">hal_do_hwint</span><span class="token punctuation">(</span><span class="token class-name">uint_t</span> intnumb<span class="token punctuation">,</span> <span class="token keyword">void</span> <span class="token operator">*</span>krnlsframp<span class="token punctuation">)</span>
<span class="token punctuation">{</span>    
    <span class="token class-name">intfltdsc_t</span> <span class="token operator">*</span>ifdscp <span class="token operator">=</span> <span class="token constant">NULL</span><span class="token punctuation">;</span>    
    <span class="token class-name">cpuflg_t</span> cpuflg<span class="token punctuation">;</span>
    <span class="token comment">//根据中断号获取中断异常描述符地址    </span>
    ifdscp <span class="token operator">=</span> <span class="token function">hal_retn_intfltdsc</span><span class="token punctuation">(</span>intnumb<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//对断异常描述符加锁并中断    </span>
    <span class="token function">hal_spinlock_saveflg_cli</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>ifdscp<span class="token operator">-&gt;</span>i_lock<span class="token punctuation">,</span> <span class="token operator">&amp;</span>cpuflg<span class="token punctuation">)</span><span class="token punctuation">;</span>    
    ifdscp<span class="token operator">-&gt;</span>i_indx<span class="token operator">++</span><span class="token punctuation">;</span>    
    ifdscp<span class="token operator">-&gt;</span>i_deep<span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token comment">//运行中断处理的回调函数</span>
    <span class="token function">hal_run_intflthandle</span><span class="token punctuation">(</span>intnumb<span class="token punctuation">,</span> krnlsframp<span class="token punctuation">)</span><span class="token punctuation">;</span>    
    ifdscp<span class="token operator">-&gt;</span>i_deep<span class="token operator">--</span><span class="token punctuation">;</span>
    <span class="token comment">//解锁并恢复中断状态    </span>
    <span class="token function">hal_spinunlock_restflg_sti</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>ifdscp<span class="token operator">-&gt;</span>i_lock<span class="token punctuation">,</span> <span class="token operator">&amp;</span>cpuflg<span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//异常分发器</span>
<span class="token keyword">void</span> <span class="token function">hal_fault_allocator</span><span class="token punctuation">(</span><span class="token class-name">uint_t</span> faultnumb<span class="token punctuation">,</span> <span class="token keyword">void</span> <span class="token operator">*</span>krnlsframp<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token comment">//我们的异常处理回调函数也是放在中断异常描述符中的</span>
    <span class="token function">hal_do_hwint</span><span class="token punctuation">(</span>faultnumb<span class="token punctuation">,</span> krnlsframp<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//中断分发器</span>
<span class="token keyword">void</span> <span class="token function">hal_hwint_allocator</span><span class="token punctuation">(</span><span class="token class-name">uint_t</span> intnumb<span class="token punctuation">,</span> <span class="token keyword">void</span> <span class="token operator">*</span>krnlsframp<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token function">hal_do_hwint</span><span class="token punctuation">(</span>intnumb<span class="token punctuation">,</span> krnlsframp<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>前面的代码确实是按照我们的中断框架设计实现的，下面我们去实现 hal_run_intflthandle 函数，它负责调用<strong>中断处理的回调函数</strong>。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">hal_run_intflthandle</span><span class="token punctuation">(</span><span class="token class-name">uint_t</span> ifdnr<span class="token punctuation">,</span> <span class="token keyword">void</span> <span class="token operator">*</span>sframe<span class="token punctuation">)</span>
<span class="token punctuation">{</span>    
    <span class="token class-name">intserdsc_t</span> <span class="token operator">*</span>isdscp<span class="token punctuation">;</span>    
    <span class="token class-name">list_h_t</span> <span class="token operator">*</span>lst<span class="token punctuation">;</span>
    <span class="token comment">//根据中断号获取中断异常描述符地址    </span>
    <span class="token class-name">intfltdsc_t</span> <span class="token operator">*</span>ifdscp <span class="token operator">=</span> <span class="token function">hal_retn_intfltdsc</span><span class="token punctuation">(</span>ifdnr<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//遍历i_serlist链表    </span>
    <span class="token function">list_for_each</span><span class="token punctuation">(</span>lst<span class="token punctuation">,</span> <span class="token operator">&amp;</span>ifdscp<span class="token operator">-&gt;</span>i_serlist<span class="token punctuation">)</span>    
    <span class="token punctuation">{</span>   
        <span class="token comment">//获取i_serlist链表上对象即intserdsc_t结构</span>
        isdscp <span class="token operator">=</span> <span class="token function">list_entry</span><span class="token punctuation">(</span>lst<span class="token punctuation">,</span> <span class="token class-name">intserdsc_t</span><span class="token punctuation">,</span> s_list<span class="token punctuation">)</span><span class="token punctuation">;</span>  
        <span class="token comment">//调用中断处理回调函数      </span>
        isdscp<span class="token operator">-&gt;</span><span class="token function">s_handle</span><span class="token punctuation">(</span>ifdnr<span class="token punctuation">,</span> isdscp<span class="token operator">-&gt;</span>s_device<span class="token punctuation">,</span> sframe<span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码已经很清楚了，循环遍历 intfltdsc_t 结构中，i_serlist 链表上所有挂载的 intserdsc_t 结构，然后调用 intserdsc_t 结构中的中断处理的回调函数。</p><p>我们 Cosmos 链表借用了 Linux 所用的链表，代码我已经帮你写好了，放在了 <code>list.h</code> 和 <code>list_t.h</code> 文件中，请自行查看。</p><h2 id="初始化中断控制器-i8259-c" tabindex="-1"><a class="header-anchor" href="#初始化中断控制器-i8259-c" aria-hidden="true">#</a> 初始化中断控制器: i8259.c</h2><p>我们把 CPU 端的中断搞定了以后，还有设备端的中断，这个可以交给设备驱动程序，但是 CPU 和设备之间的中断控制器，还需要我们出面解决。</p><p>多个设备的中断信号线都会连接到中断控制器上，中断控制器可以决定启用或者屏蔽哪些设备的中断，还可以决定设备中断之间的优先线，所以它才叫<strong>中断控制器</strong>。</p><p>x86 平台上的中断控制器有多种，最开始是 8259A，然后是 IOAPIC，最新的是 MSI-X。为了简单的说明原理，我们选择了 8259A 中断控制器。</p><p>8259A 在任何 x86 平台上都可以使用，x86 平台使用了两片 8259A 芯片，以级联的方式存在。它拥有 15 个中断源（即可以有 15 个中断信号接入）。让我们看看 8259A 在系统上的框架图：</p><img src="`+c+`" alt="img" style="zoom:15%;"><p>8259A在系统上的框架图</p><p>上面直接和 CPU 连接的是主 8259A，下面的是从 8259A，每一个 8259A 芯片都有两个 I/O 端口，我们可以通过它们对 8259A 进行编程。主 8259A 的端口地址是 0x20，0x21；从 8259A 的端口地址是 0xA0，0xA1。</p><p>下面我们来做代码初始化，我们程序员可以向 8259A 写两种命令字： ICW 和 OCW；ICW 这种命令字用来实现 8259a 芯片的初始化。而 OCW 这种命令用来向 8259A 发布命令，以对其进行控制。OCW 可以在 8259A 被初始化之后的任何时候被使用。</p><p>我已经把代码定好了，放在了 <code>8259.c</code> 文件中，如下所示：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">init_i8259</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token comment">//初始化主从8259a</span>
    <span class="token function">out_u8_p</span><span class="token punctuation">(</span>ZIOPT<span class="token punctuation">,</span> ICW1<span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">out_u8_p</span><span class="token punctuation">(</span>SIOPT<span class="token punctuation">,</span> ICW1<span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">out_u8_p</span><span class="token punctuation">(</span>ZIOPT1<span class="token punctuation">,</span> ZICW2<span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">out_u8_p</span><span class="token punctuation">(</span>SIOPT1<span class="token punctuation">,</span> SICW2<span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">out_u8_p</span><span class="token punctuation">(</span>ZIOPT1<span class="token punctuation">,</span> ZICW3<span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">out_u8_p</span><span class="token punctuation">(</span>SIOPT1<span class="token punctuation">,</span> SICW3<span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">out_u8_p</span><span class="token punctuation">(</span>ZIOPT1<span class="token punctuation">,</span> ICW4<span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">out_u8_p</span><span class="token punctuation">(</span>SIOPT1<span class="token punctuation">,</span> ICW4<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//屏蔽全部中断源</span>
    <span class="token function">out_u8_p</span><span class="token punctuation">(</span>ZIOPT1<span class="token punctuation">,</span> <span class="token number">0xff</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">out_u8_p</span><span class="token punctuation">(</span>SIOPT1<span class="token punctuation">,</span> <span class="token number">0xff</span><span class="token punctuation">)</span><span class="token punctuation">;</span>        
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果你要了解 8259A 的细节，就是上述代码中为什么要写入这些数据，你可以自己在 Intel 官方网站上搜索 8259A 的数据手册，自行查看。</p><p>这里你只要在 init_halintupt() 函数的最后，调用这个函数就行。你有没有想过，既然我们是研究操作系统不是要写硬件驱动，为什么要在初始化中断控制器后，屏蔽所有的中断源呢？因为我们 Cosmos 在初始化阶段还不能处理中断。</p><p>到此，我们的 Cosmos 的 hal 层初始化就结束了。关于内存管理器的初始化，我会在内存管理模块讲解，你先有个印象就行。</p><h2 id="进入内核层-待办" tabindex="-1"><a class="header-anchor" href="#进入内核层-待办" aria-hidden="true">#</a> 进入内核层: 待办?</h2><p>hal 层的初始化已经完成，按照前面的设计，我们的 Cosmos 还有内核层，我们下面就要进入到内核层，建立一个文件，写上一个函数，作为本课程的结尾。</p><p>但是这个函数是个<strong>空函数</strong>，目前什么也不做，它是为 Cosmos 内核层初始化而存在的，但是由于课程只进行到这里，所以我只是写个空函数，为后面的课程做好准备。</p><p>由于内核层是从 hal 层进入的，必须在 hal_start() 函数中被调用，所以在此完成这个函数——init_krl()。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">init_krl</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span> 
    <span class="token comment">//禁止函数返回    </span>
    <span class="token function">die</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面我们在 hal_start() 函数中调用它就行了，如下所示</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">hal_start</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>   
    <span class="token comment">//初始化Cosmos的hal层 </span>
    <span class="token function">init_hal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//初始化Cosmos的内核层    </span>
    <span class="token function">init_krl</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从上面的代码中，不难发现 Cosmos 的 hal 层初始化完成后，就自动进入了 Cosmos 内核层的初始化。至此本课程已经结束。</p><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾" aria-hidden="true">#</a> 重点回顾</h2><p>写一个 C 函数是容易的，但是写操作系统的第一个 C 函数并不容易，好在我们一路坚持，没有放弃，才取得了这个阶段性的胜利。但温故而知新，对学过的东西要学而时习之，下面我们来回顾一下本课程的重点。</p><p>\\1. Cosmos 的第一个 C 函数产生了，它十分简单但极其有意义，它的出现标志着 C 语言的运行环境已经完善。从此我们可以用 C 语言高效地开发操作系统了，由爬行时代进入了跑步前行的状态，可喜可贺。</p><p>\\2. 第一个 C 函数，干的第一件重要工作就是**调用 hal 层的初始化函数。**这个初始化函数首先初始化了平台，初始化了机器信息结构供内核的其它代码使用，还初始化了我们图形显示驱动、显示了背景图片；其次是初始化了内存管理相关的数据结构；接着初始了中断，中断处理框架是两层，所以最为复杂；最后初始化了中断控制器。</p><p>\\3. 当 hal 层初始化完成了，我们就进入了内核层，由于到了课程的尾声，我们先暂停在这里。</p><p>在这节课里我帮你写了很多代码，那些代码非常简单和枯燥，但是必须要有它们才可以。综合我们前面讲过的知识，我相信你有能力看懂它们。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题" aria-hidden="true">#</a> 思考题</h2><p>请你梳理一下，Cosmos hal 层的函数调用关系。</p><p>欢迎你在留言区跟我交流互动，也欢迎把这节课转发给你的朋友和同事。</p><p>好，我是 LMOS，咱们下节课见！</p>`,152),l=[i];function u(d,r){return s(),a("div",null,l)}const v=n(o,[["render",u],["__file","D13-主板初始化.html.vue"]]);export{v as default};
