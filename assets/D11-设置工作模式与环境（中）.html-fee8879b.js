import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,d as e}from"./app-cdabc73c.js";const i="/assets/3169e9db4549ab036c2de269788a281e-9f63e9c8.jpg",p="/assets/bd55f67d02edff4415f06c914403bc40-47d06f4e.jpg",l={},t=e(`<h1 id="_11-设置工作模式与环境-中-建造二级引导器" tabindex="-1"><a class="header-anchor" href="#_11-设置工作模式与环境-中-建造二级引导器" aria-hidden="true">#</a> 11 | 设置工作模式与环境（中）：建造二级引导器</h1><p>你好，我是 LMOS。</p><p>上节课，我们建造了属于我们的“计算机”，并且在上面安装好了 GRUB。这节课我会带你一起实现二级引导器这个关键组件。</p><p>看到这儿你可能会问，GRUB 不是已经把我们的操作系统加载到内存中了吗？我们有了 GRUB，我们为什么还要实现二级引导器呢？</p><p>这里我要给你说说我的观点，二级引导器作为<strong>操作系统的先驱</strong>，它需要收集机器信息，确定这个计算机能不能运行我们的操作系统，对 CPU、内存、显卡进行一些初级的配置，放置好内核相关的文件。</p><p>因为我们二级引导器不是执行具体的加载任务的，而是<strong>解析内核文件、收集机器环境信息</strong>，它具体收集哪些信息，我会在下节课详细展开。</p><h2 id="设计机器信息结构" tabindex="-1"><a class="header-anchor" href="#设计机器信息结构" aria-hidden="true">#</a> 设计机器信息结构</h2><p>二级引导器收集的信息，需要地点存放，我们需要设计一个数据结构。信息放在这个数据结构中，这个结构放在<mark>内存 1MB 的地方</mark>，(因为实模式只有1MB的内存寻址空间)，方便以后传给我们的操作系统。</p><p>为了让你抓住重点，我选取了这个数据结构的<strong>关键代码</strong>，这里并没有列出该结构的所有字段（<code>Cosmos/initldr/include/ldrtype.h</code>），这个结构如下所示。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">s_MACHBSTART</span>
<span class="token punctuation">{</span>
    <span class="token class-name">u64_t</span>   mb_krlinitstack<span class="token punctuation">;</span><span class="token comment">//内核栈地址</span>
    <span class="token class-name">u64_t</span>   mb_krlitstacksz<span class="token punctuation">;</span><span class="token comment">//内核栈大小</span>
    <span class="token class-name">u64_t</span>   mb_imgpadr<span class="token punctuation">;</span><span class="token comment">//操作系统映像</span>
    <span class="token class-name">u64_t</span>   mb_imgsz<span class="token punctuation">;</span><span class="token comment">//操作系统映像大小</span>
    <span class="token class-name">u64_t</span>   mb_bfontpadr<span class="token punctuation">;</span><span class="token comment">//操作系统字体地址</span>
    <span class="token class-name">u64_t</span>   mb_bfontsz<span class="token punctuation">;</span><span class="token comment">//操作系统字体大小</span>
    <span class="token class-name">u64_t</span>   mb_fvrmphyadr<span class="token punctuation">;</span><span class="token comment">//机器显存地址</span>
    <span class="token class-name">u64_t</span>   mb_fvrmsz<span class="token punctuation">;</span><span class="token comment">//机器显存大小</span>
    <span class="token class-name">u64_t</span>   mb_cpumode<span class="token punctuation">;</span><span class="token comment">//机器CPU工作模式</span>
    <span class="token class-name">u64_t</span>   mb_memsz<span class="token punctuation">;</span><span class="token comment">//机器内存大小</span>
    <span class="token class-name">u64_t</span>   mb_e820padr<span class="token punctuation">;</span><span class="token comment">//机器e820数组地址</span>
    <span class="token class-name">u64_t</span>   mb_e820nr<span class="token punctuation">;</span><span class="token comment">//机器e820数组元素个数</span>
    <span class="token class-name">u64_t</span>   mb_e820sz<span class="token punctuation">;</span><span class="token comment">//机器e820数组大小</span>
    <span class="token comment">//……</span>
    <span class="token class-name">u64_t</span>   mb_pml4padr<span class="token punctuation">;</span><span class="token comment">//机器页表数据地址</span>
    <span class="token class-name">u64_t</span>   mb_subpageslen<span class="token punctuation">;</span><span class="token comment">//机器页表个数</span>
    <span class="token class-name">u64_t</span>   mb_kpmapphymemsz<span class="token punctuation">;</span><span class="token comment">//操作系统映射空间大小</span>
    <span class="token comment">//……</span>
    <span class="token class-name">graph_t</span> mb_ghparm<span class="token punctuation">;</span><span class="token comment">//图形信息</span>
<span class="token punctuation">}</span><span class="token keyword">__attribute__</span><span class="token punctuation">(</span><span class="token punctuation">(</span>packed<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token class-name">machbstart_t</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="规划二级引导器" tabindex="-1"><a class="header-anchor" href="#规划二级引导器" aria-hidden="true">#</a> 规划二级引导器</h2><p>在开始写代码之前，我们先来从整体划分一下二级引导器的功能模块，从全局了解下功能应该怎么划分，这里我特意为你梳理了一个表格。</p><img src="`+i+'" alt="img" style="zoom:33%;"><p>二级引导器功能划分表</p><p>前面表格里的这些文件，我都放在了课程配套源码中了，你可以从这里下载。</p><p>上述这些文件都在 lesson10～11/<code>Cosmos/initldr/ldrkrl</code> 目录中，它们在编译之后会形成三个文件，编译脚本我已经写好了，下面我们用一幅图来展示这个编译过程。</p><img src="'+p+`" alt="img" style="zoom:15%;"><p>二级引导器编译过程示意图</p><h2 id="打包成内核映像文件" tabindex="-1"><a class="header-anchor" href="#打包成内核映像文件" aria-hidden="true">#</a> 打包成内核映像文件</h2><p>这最后三个文件用我们前面说的映像工具打包成映像文件，其指令如下。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>lmoskrlimg <span class="token operator">-</span>m k <span class="token operator">-</span>lhf initldrimh<span class="token punctuation">.</span>bin <span class="token operator">-</span>o Cosmos<span class="token punctuation">.</span>eki <span class="token operator">-</span>f initldrkrl<span class="token punctuation">.</span>bin initldrsve<span class="token punctuation">.</span>bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>打包工具使用:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>lmoskrlimg <span class="token parameter variable">-m</span> k <span class="token parameter variable">-lhf</span> GRUB头文件 <span class="token parameter variable">-o</span> 映像文件 <span class="token parameter variable">-f</span> 输入的文件列表
<span class="token parameter variable">-m</span> 表示模式 只能是k内核模式
<span class="token parameter variable">-lhf</span> 表示后面跟上GRUB头文件
<span class="token parameter variable">-o</span> 表示输出的映像文件名 
<span class="token parameter variable">-f</span> 表示输入文件列表
例如：lmoskrlimg <span class="token parameter variable">-m</span> k <span class="token parameter variable">-lhf</span> grubhead.bin <span class="token parameter variable">-o</span> kernel.img <span class="token parameter variable">-f</span> file1.bin file2.bin file3.bin file4.bin 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实现-grub-头-grubhead-bin" tabindex="-1"><a class="header-anchor" href="#实现-grub-头-grubhead-bin" aria-hidden="true">#</a> 实现 GRUB 头: grubhead.bin</h2><p>我们的 GRUB 头有两个文件组成，</p><ul><li><strong>一个 imginithead.asm 汇编文件</strong>，它有两个功能，既能让 GRUB 识别，又能设置 C 语言运行环境，用于调用 C 函数；</li><li><strong>第二就是 inithead.c 文件</strong>，它的主要功能是查找二级引导器的核心文件——initldrkrl.bin，然后把它放置到特定的内存地址上。</li></ul><h3 id="_1-imginithead-asm" tabindex="-1"><a class="header-anchor" href="#_1-imginithead-asm" aria-hidden="true">#</a> 1 imginithead.asm</h3><p>我们先来实现 imginithead.asm，它主要工作是初始化 CPU 的寄存器，加载 GDT，切换到 CPU 的保护模式，我们一步一步来实现。</p><p>首先是 GRUB1 和 GRUB2 需要的两个头结构，代码如下。</p><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>MBT_HDR_FLAGS  EQU 0x00010003
MBT_HDR_MAGIC  EQU 0x1BADB002
MBT2_MAGIC  EQU 0xe85250d6
global _start
extern inithead_entry
[section .text]
[bits 32]
_start:
  jmp _entry
align 4
mbt_hdr:
  dd MBT_HDR_MAGIC
  dd MBT_HDR_FLAGS
  dd -(MBT_HDR_MAGIC+MBT_HDR_FLAGS)
  dd mbt_hdr
  dd _start
  dd 0
  dd 0
  dd _entry
ALIGN 8
mbhdr:
  DD  0xE85250D6
  DD  0
  DD  mhdrend - mbhdr
  DD  -(0xE85250D6 + 0 + (mhdrend - mbhdr))
  DW  2, 0
  DD  24
  DD  mbhdr
  DD  _start
  DD  0
  DD  0
  DW  3, 0
  DD  12
  DD  _entry 
  DD  0  
  DW  0, 0
  DD  8
mhdrend:
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后是关中断并加载 GDT，代码如下所示。</p><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>_entry:
  cli           ；关中断
  in al, 0x70 
  or al, 0x80  
  out 0x70,al  ；关掉不可屏蔽中断   
  lgdt [GDT_PTR] ；加载GDT地址到GDTR寄存器
  jmp dword 0x8 :_32bits_mode ；长跳转刷新CS影子寄存器
  ;………………
;GDT全局段描述符表
GDT_START:
knull_dsc: dq 0
kcode_dsc: dq 0x00cf9e000000ffff
kdata_dsc: dq 0x00cf92000000ffff
k16cd_dsc: dq 0x00009e000000ffff ；16位代码段描述符
k16da_dsc: dq 0x000092000000ffff ；16位数据段描述符
GDT_END:
GDT_PTR:
GDTLEN  dw GDT_END-GDT_START-1  ;GDT界限
GDTBASE  dd GDT_START
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后是初始化段寄存器和通用寄存器、栈寄存器，这是为了给调用 inithead_entry 这个 C 函数做准备，代码如下所示。</p><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>_32bits_mode：
  mov ax, 0x10
  mov ds, ax
  mov ss, ax
  mov es, ax
  mov fs, ax
  mov gs, ax
  xor eax,eax
  xor ebx,ebx
  xor ecx,ecx
  xor edx,edx
  xor edi,edi
  xor esi,esi
  xor ebp,ebp
  xor esp,esp
  mov esp,0x7c00 ；设置栈顶为0x7c00
  call inithead_entry ；调用inithead_entry函数在inithead.c中实现
  jmp 0x200000  ；跳转到0x200000地址
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-inithead-c" tabindex="-1"><a class="header-anchor" href="#_2-inithead-c" aria-hidden="true">#</a> 2 inithead.c</h3><p>上述代码的最后调用了 inithead_entry 函数，这个函数我们需要另外在 inithead.c 中实现，我们这就来实现它，如下所示。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">MDC_ENDGIC</span> <span class="token expression"><span class="token number">0xaaffaaffaaffaaff</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">MDC_RVGIC</span> <span class="token expression"><span class="token number">0xffaaffaaffaaffaa</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">REALDRV_PHYADR</span> <span class="token expression"><span class="token number">0x1000</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">IMGFILE_PHYADR</span> <span class="token expression"><span class="token number">0x4000000</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">IMGKRNL_PHYADR</span> <span class="token expression"><span class="token number">0x2000000</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">LDRFILEADR</span> <span class="token expression">IMGFILE_PHYADR</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">MLOSDSC_OFF</span> <span class="token expression"><span class="token punctuation">(</span><span class="token number">0x1000</span><span class="token punctuation">)</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">MRDDSC_ADR</span> <span class="token expression"><span class="token punctuation">(</span><span class="token class-name">mlosrddsc_t</span><span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span>LDRFILEADR<span class="token operator">+</span><span class="token number">0x1000</span><span class="token punctuation">)</span></span></span>

<span class="token keyword">void</span> <span class="token function">inithead_entry</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token function">write_realintsvefile</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">write_ldrkrlfile</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//写initldrsve.bin文件到特定的内存中</span>
<span class="token keyword">void</span> <span class="token function">write_realintsvefile</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name">fhdsc_t</span> <span class="token operator">*</span>fhdscstart <span class="token operator">=</span> <span class="token function">find_file</span><span class="token punctuation">(</span><span class="token string">&quot;initldrsve.bin&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>fhdscstart <span class="token operator">==</span> <span class="token constant">NULL</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;not file initldrsve.bin&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token function">m2mcopy</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">u32_t</span><span class="token punctuation">)</span><span class="token punctuation">(</span>fhdscstart<span class="token operator">-&gt;</span>fhd_intsfsoff<span class="token punctuation">)</span> <span class="token operator">+</span> LDRFILEADR<span class="token punctuation">)</span><span class="token punctuation">,</span>
            <span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token operator">*</span><span class="token punctuation">)</span>REALDRV_PHYADR<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token class-name">sint_t</span><span class="token punctuation">)</span>fhdscstart<span class="token operator">-&gt;</span>fhd_frealsz<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//写initldrkrl.bin文件到特定的内存中</span>
<span class="token keyword">void</span> <span class="token function">write_ldrkrlfile</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name">fhdsc_t</span> <span class="token operator">*</span>fhdscstart <span class="token operator">=</span> <span class="token function">find_file</span><span class="token punctuation">(</span><span class="token string">&quot;initldrkrl.bin&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>fhdscstart <span class="token operator">==</span> <span class="token constant">NULL</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;not file initldrkrl.bin&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token function">m2mcopy</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">u32_t</span><span class="token punctuation">)</span><span class="token punctuation">(</span>fhdscstart<span class="token operator">-&gt;</span>fhd_intsfsoff<span class="token punctuation">)</span> <span class="token operator">+</span> LDRFILEADR<span class="token punctuation">)</span><span class="token punctuation">,</span>
            <span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token operator">*</span><span class="token punctuation">)</span>ILDRKRL_PHYADR<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token class-name">sint_t</span><span class="token punctuation">)</span>fhdscstart<span class="token operator">-&gt;</span>fhd_frealsz<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//在映像文件中查找对应的文件</span>
<span class="token class-name">fhdsc_t</span> <span class="token operator">*</span><span class="token function">find_file</span><span class="token punctuation">(</span><span class="token class-name">char_t</span> <span class="token operator">*</span>fname<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token class-name">mlosrddsc_t</span> <span class="token operator">*</span>mrddadrs <span class="token operator">=</span> MRDDSC_ADR<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>mrddadrs<span class="token operator">-&gt;</span>mdc_endgic <span class="token operator">!=</span> MDC_ENDGIC <span class="token operator">||</span>
        mrddadrs<span class="token operator">-&gt;</span>mdc_rv <span class="token operator">!=</span> MDC_RVGIC <span class="token operator">||</span>
        mrddadrs<span class="token operator">-&gt;</span>mdc_fhdnr <span class="token operator">&lt;</span> <span class="token number">2</span> <span class="token operator">||</span>
        mrddadrs<span class="token operator">-&gt;</span>mdc_filnr <span class="token operator">&lt;</span> <span class="token number">2</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;no mrddsc&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token class-name">s64_t</span> rethn <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token class-name">fhdsc_t</span> <span class="token operator">*</span>fhdscstart <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">fhdsc_t</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">u32_t</span><span class="token punctuation">)</span><span class="token punctuation">(</span>mrddadrs<span class="token operator">-&gt;</span>mdc_fhdbk_s<span class="token punctuation">)</span> <span class="token operator">+</span> LDRFILEADR<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">u64_t</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> mrddadrs<span class="token operator">-&gt;</span>mdc_fhdnr<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">strcmpl</span><span class="token punctuation">(</span>fname<span class="token punctuation">,</span> fhdscstart<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>fhd_name<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            rethn <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">s64_t</span><span class="token punctuation">)</span>i<span class="token punctuation">;</span>
            <span class="token keyword">goto</span> ok_l<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    rethn <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
ok_l<span class="token operator">:</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>rethn <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;not find file&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token operator">&amp;</span>fhdscstart<span class="token punctuation">[</span>rethn<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们实现了 <code>inithead_entry 函数</code>，它主要干了两件事，即分别调用 1 write_realintsvefile();、2 write_ldrkrlfile() 函数，把映像文件中的 initldrsve.bin 文件和 initldrkrl.bin 文件写入到特定的内存地址空间中，具体地址在上面代码中的宏有详细定义。</p><p>这两个函数分别依赖于 find_file 和 m2mcopy 函数。</p><ol><li><p>正如其名，<code>find_file 函数</code>负责扫描映像文件中的文件头描述符，对比其中的文件名，然后返回对应的文件头描述符的地址，这样就可以得到文件在映像文件中的位置和大小了。</p></li><li><p>find_file 函数的接力队友就是 <code>m2mcopy 函数</code>，因为查找对比之后，最后就是 m2mcopy 函数负责把映像文件复制到具体的内存空间里。</p></li></ol><p>代码中的其它函数我就不展开了，感兴趣的同学请自行研究，或者自己改写。</p><h2 id="进入二级引导器-主模块initldrkrl-bin" tabindex="-1"><a class="header-anchor" href="#进入二级引导器-主模块initldrkrl-bin" aria-hidden="true">#</a> 进入二级引导器: 主模块initldrkrl.bin</h2><p>你应该还有印象，刚才说的实现 GRUB 头这个部分，在 imginithead.asm 汇编文件代码中，我们的最后一条指令是“<strong>jmp 0x200000</strong>”，即跳转到物理内存的 0x200000 地址处。</p><p>请你注意，这时地址还是物理地址，这个地址正是在 inithead.c 中由 write_ldrkrlfile() 函数放置的 initldrkrl.bin 文件，这一跳就进入了<mark>二级引导器的主模块</mark>了。</p><p>由于模块的改变，我们还需要写一小段汇编代码，建立下面这个 <code>initldr32.asm</code>（配套代码库中对应 ldrkrl32.asm）文件，并写上如下代码。</p><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>_entry:
  cli
  lgdt [GDT_PTR]；加载GDT地址到GDTR寄存器
  lidt [IDT_PTR]；加载IDT地址到IDTR寄存器
  jmp dword 0x8 :_32bits_mode；长跳转刷新CS影子寄存器
_32bits_mode:
  mov ax, 0x10  ; 数据段选择子(目的)
  mov ds, ax
  mov ss, ax
  mov es, ax
  mov fs, ax
  mov gs, ax
  xor eax,eax
  xor ebx,ebx
  xor ecx,ecx
  xor edx,edx
  xor edi,edi
  xor esi,esi
  xor ebp,ebp
  xor esp,esp
  mov esp,0x90000 ;使得栈底指向了0x90000
  call ldrkrl_entry ;调用ldrkrl_entry函数
  xor ebx,ebx
  jmp 0x2000000 ;跳转到0x2000000的内存地址
  jmp $
GDT_START:
knull_dsc: dq 0
kcode_dsc: dq 0x00cf9a000000ffff ;a-e
kdata_dsc: dq 0x00cf92000000ffff
k16cd_dsc: dq 0x00009a000000ffff ;16位代码段描述符
k16da_dsc: dq 0x000092000000ffff ;16位数据段描述符
GDT_END:
GDT_PTR:
GDTLEN  dw GDT_END-GDT_START-1  ;GDT界限
GDTBASE  dd GDT_START

IDT_PTR:
IDTLEN  dw 0x3ff
IDTBAS  dd 0  ;这是BIOS中断表的地址和长度
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我来给你做个解读，代码的 1～4 行是在加载 GDTR 和 IDTR 寄存器，然后初始化 CPU 相关的寄存器。</p><p>和先前一样，因为代码模块的改变，所以我们要把 GDT、IDT，寄存器这些东西重新初始化，最后再去调用二级引导器的主函数 ldrkrl_entry。</p><h2 id="巧妙调用-bios-中断" tabindex="-1"><a class="header-anchor" href="#巧妙调用-bios-中断" aria-hidden="true">#</a> 巧妙调用 BIOS 中断</h2><p>我们不要急着去写 ldrkrl_entry 函数，因为在后面我们要获得内存布局信息，要设置显卡图形模式，而这些功能依赖于 BIOS 提供中断服务。</p><p>可是，要在 C 函数中调用 BIOS 中断是不可能的，因为 C 语言代码工作在 32 位保护模式下，BIOS 中断工作在 16 位的实模式。</p><p>所以，C 语言环境下调用 BIOS 中断，<strong>需要处理的问题如下</strong>：</p><p>\\1. 保存 C 语言环境下的 CPU 上下文 ，即保护模式下的所有通用寄存器、段寄存器、程序指针寄存器，栈寄存器，把它们都保存在内存中。</p><p>\\2. 切换回实模式，调用 BIOS 中断，把 BIOS 中断返回的相关结果，保存在内存中。</p><p>\\3. 切换回保护模式，重新加载第 1 步中保存的寄存器。这样 C 语言代码才能重新恢复执行。</p><h3 id="ldrkrl32-asm" tabindex="-1"><a class="header-anchor" href="#ldrkrl32-asm" aria-hidden="true">#</a> ldrkrl32.asm</h3><p>要完成上面的功能，必须要写一个汇编函数才能完成，我们就把它写在 ldrkrl32.asm 文件中，如下所示 。</p><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>realadr_call_entry:
  pushad     ;保存通用寄存器
  push    ds
  push    es
  push    fs ;保存4个段寄存器
  push    gs
  call save_eip_jmp ;调用save_eip_jmp 
  pop  gs
  pop  fs
  pop  es      ;恢复4个段寄存器
  pop  ds
  popad       ;恢复通用寄存器
  ret
save_eip_jmp:
  pop esi  ;弹出call save_eip_jmp时保存的eip到esi寄存器中， 
  mov [PM32_EIP_OFF],esi ;把eip保存到特定的内存空间中
  mov [PM32_ESP_OFF],esp ;把esp保存到特定的内存空间中
  jmp dword far [cpmty_mode];长跳转这里表示把cpmty_mode处的第一个4字节装入eip，把其后的2字节装入cs
cpmty_mode:
  dd 0x1000
  dw 0x18
  jmp $
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码我列了详细注释，你一看就能明白。不过这里唯一不好懂的是 <strong>jmp dword far [cpmty_mode]指令</strong>，别担心，听我给你解读一下。</p><p>其实这个指令是一个<strong>长跳转</strong>，表示把[cpmty_mode]处的数据装入 CS：EIP，也就是把 0x18：0x1000 装入到 CS：EIP 中。</p><p>这个 0x18 就是段描述索引（这个知识点不熟悉的话，你可以回看我们第五节课），它正是指向 GDT 中的 16 位代码段描述符；0x1000 代表段内的偏移地址，所以在这个地址上，我们必须放一段代码指令，不然 CPU 跳转到这里将没指令可以执行，那样就会发生错误。</p><p>因为这是一个 16 位代码，所以我们需要新建立一个文件 realintsve.asm，如下所示。</p><h3 id="realintsve-asm" tabindex="-1"><a class="header-anchor" href="#realintsve-asm" aria-hidden="true">#</a> realintsve.asm</h3><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>[bits 16]
_start:
_16_mode:
  mov  bp,0x20 ;0x20是指向GDT中的16位数据段描述符 
  mov  ds, bp
  mov  es, bp
  mov  ss, bp
  mov  ebp, cr0
  and  ebp, 0xfffffffe
  mov  cr0, ebp ;CR0.P=0 关闭保护模式
  jmp  0:real_entry ;刷新CS影子寄存器，真正进入实模式
real_entry:
  mov bp, cs
  mov ds, bp
  mov es, bp
  mov ss, bp ;重新设置实模式下的段寄存器 都是CS中值，即为0 
  mov sp, 08000h ;设置栈
  mov bp,func_table
  add bp,ax
  call [bp] ;调用函数表中的汇编函数，ax是C函数中传递进来的
  cli
  call disable_nmi
  mov  ebp, cr0
  or  ebp, 1
  mov  cr0, ebp ;CR0.P=1 开启保护模式
  jmp dword 0x8 :_32bits_mode
[BITS 32]
_32bits_mode:
  mov bp, 0x10
  mov ds, bp
  mov ss, bp;重新设置保护模式下的段寄存器0x10是32位数据段描述符的索引
  mov esi,[PM32_EIP_OFF];加载先前保存的EIP
  mov esp,[PM32_ESP_OFF];加载先前保存的ESP
  jmp esi ;eip=esi 回到了realadr_call_entry函数中

func_table:  ;函数表
  dw _getmmap ;获取内存布局视图的函数
  dw _read ;读取硬盘的函数
    dw _getvbemode ;获取显卡VBE模式 
    dw _getvbeonemodeinfo ;获取显卡VBE模式的数据
    dw _setvbemode ;设置显卡VBE模式
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的代码我们只要将它编译成 16 位的二进制的文件，并把它放在 0x1000 开始的内存空间中就可以了。这样在 realadr_call_entry 函数的最后，就运行到这段代码中来了。</p><p>上述的代码的流程是这样的：首先从 _16_mode: 标号处进入实模式，然后根据传递进来（由 ax 寄存器传入）的函数号，到函数表中调用对应的函数，里面的函数执行完成后，再次进入保护模式，加载 EIP 和 ESP 寄存器从而回到 realadr_call_entry 函数中。GDT 还是 imghead.asm 汇编代码文件中的 GDT，这没有变，因为它是由 GDTR 寄存器指向的。</p><p>说到这里，相信你会立刻明白，之前 write_realintsvefile() 函数的功能与意义了。它会把<strong>映像文件中的 <mark>initldrsve.bin 文件</mark>写入到特定的内存地址空间中</strong>，而 initldrsve.bin 正是由上面的 realintsve.asm 文件编译而成的。</p><h2 id="二级引导器主函数-ldrkrlentry-c" tabindex="-1"><a class="header-anchor" href="#二级引导器主函数-ldrkrlentry-c" aria-hidden="true">#</a> 二级引导器主函数: ldrkrlentry.c</h2><p>好，现在我们准备得差不多了，从二级引导器的主函数开始，这个函数我们要用 C 来写，估计你也感受到了写汇编语言的压力，所以不能老是写汇编。</p><p>我们先建立一个 C 文件 ldrkrlentry.c，在其中写上一个主函数，代码如下。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">ldrkrl_entry</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token function">init_bstartparm</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中的 ldrkrl_entry() 函数在 initldr32.asm 文件（配套代码库中对应 ldrkrl32.asm）中被调用，从那条 call ldrkrl_entry 指令开始进入了 ldrkrl_entry() 函数，在其中调用了 <strong>init_bstartparm() 函数</strong>，这个函数我们还没有实现，但通过名字我们不难推测，它是负责处理开始参数的。</p><p>你还记不记得，我们建造二级引导器的目的，就是要收集机器环境信息。我们要把这些信息形成一个有结构的参数，传递给我们的操作系统内核以备后续使用。</p><p>由此，我们能够确定，<strong>init_bstartparm() 函数成了收集机器环境信息的主函数</strong>，下节课我们就会去实现它。</p><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾" aria-hidden="true">#</a> 重点回顾</h2><p>今天我们开始实现二级引导器了，但是我们还没有完全实现，我们下一节课再接着继续这项工作。</p><p>现在，我们来梳理一下这节课的内容，回顾一下我们今天的成果。</p><p>\\1. 我们设计了机器信息结构，用于存放后面二级引导器收集到的机器信息。</p><p>\\2. 对二级引导器代码模块进行了规划，确定各模块的主要功能。</p><p>\\3. 实现了 GRUB 规定的 GRUB 头，以便被 GRUB 识别，在 GRUB 头中初始化了 CPU 寄存器，并且跳转到物理内存的 0x200000 地址处，真正进入到二级引导器中开始运行。</p><p>\\4. 为了二级引导器能够调用 BIOS 中断服务程序，我们实现了专门用来完成调用 BIOS 中断服务程序的 realintsve.asm 模块。</p><p>\\5. 最后，我们实现了二级引导器的主函数，由它调用完成其它功能的函数。</p><p>这里我还想聊聊，为什么我们要花这么多功夫，去设计二级引导器这个组件呢？</p><p>我们把这些处理操作系统运行环境的工作独立出来，交给<mark>二级引导器</mark>来做，这会**大大降低后面开发操作系统的难度，也能增加操作系统的通用性。**而且，针对<mark>不同的硬件平台</mark>，我们只要开发<mark>不同的二级引导器</mark>就好了。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题" aria-hidden="true">#</a> 思考题</h2><p>请问 GRUB 头中为什么需要 _entry 标号和 _start 标号的地址？</p><p>欢迎你在留言区跟我交流活动。如果你身边的同事、朋友，对二级引导器的建立有兴趣，也欢迎你把这节课分享给他。</p><p>好，我是 LMOS，我们下节课见！</p><h2 id="课后讨论" tabindex="-1"><a class="header-anchor" href="#课后讨论" aria-hidden="true">#</a> 课后讨论</h2><p>大体上整理了一下：</p><p>1、grub启动后，选择对应的启动菜单项，grub会通过自带文件系统驱动，定位到对应的eki文件</p><p>2、grub会尝试加载eki文件【eki文件需要满足grub多协议引导头的格式要求】<br> 这些是在imginithead.asm中实现的，所以要包括：<br> A、grub文件头，包括魔数、grub1和grub2支持等<br> B、定位的_start符号等</p><p>3、grub校验成功后，会调用<code>_start</code>，然跳转到<code>_entry</code><br> A、<code>_entry</code>中:关闭中断<br> B、加载GDT<br> C、然后进入<code>_32bits_mode</code>，清理寄存器，设置栈顶<br> D、调用<code>inithead_entry</code>【C】</p><p>4、inithead_entry.c<br> A、从imginithead.asm进入后，首先进入函数调用inithead_entry<br> B、初始化光标，清屏<br> C、从eki文件内部，找到initldrsve.bin文件，并分别拷贝到内存的指定物理地址<br> D、从eki文件内部，找到initldrkrl.bin文件，并分别拷贝到内存的指定物理地址<br> E、返回imginithead.asm</p><p>5、imginithead.asm中继续执行<br> jmp 0x200000<br> 而这个位置，就是initldrkrl.bin在内存的位置ILDRKRL_PHYADR<br> 所以后面要执行initldrkrl.bin的内容</p><p>6、这样就到了ldrkrl32.asm的<code>_entry</code><br> A、将GDT加载到GDTR寄存器【内存】<br> B、将IDT加载到IDTR寄存器【中断】<br> C、跳转到<code>_32bits_mode</code><br> 初始寄存器<br> 初始化栈<br> 调用<code>ldrkrl_entry</code>【C】</p><p>7、ldrkrlentry.c<br> A、初始化光标，清屏<br> B、收集机器参数init_bstartparm【C】</p><p>8、bstartparm.c<br> A、初始化machbstart_t<br> B、各类初始化函数，填充machbstart_t的内容<br> C、返回</p><p>9、ldrkrlentry.c<br> A、返回</p><p>10、ldrkrl32.asm<br> A、跳转到0x2000000地址继续执行</p><hr><p>真实进入实际写代码的课程了。<br> 对于grub的头格式在的第二节写个HelloOS.bin就已经有了，这次头格式还是会有。理由是grub是一级引导器。<br> 这节课的内容就是围绕着由一级转到二级引导器的过程展开了。<br> 关于二级引导器的加载过程，简单点说就是把我们内核加载到指定内存的位置并执行，这个加载函数核心是m2mcopy函数，东哥留给我们自己分析了，但东哥强调分析了下为什么会有32位下的代码和16位汇编代码共存的现象。 其实是为了让BIOS提供的获取硬件信息的操作函数（也就是实模式下的BIOS中断号来获取的）做成了c语言环境下也可以调用的功能。这就像跨语言互相调用的技术。汇编调用c语言的方法，反过来c语言调用汇编方法。但更为复杂些，原因是保护模式到实模式再回到保护模式的切换过程。内核可以获取硬件信息就可以根据硬件环境参数，配置自身参数开始工作了。如何配置参数，那又是下节继续播讲。周五见。<br> 关于思考题，这个是grub也是要把控制权交给我们二级引导器的入口地址。 至于为什么不光有一个<code>_start</code>就可以了，我猜测是为了做验证吧。<code>_start</code>的操作是jmp 地址。这个地址正好是<code>_entry</code>。</p>`,102),c=[t];function d(r,o){return s(),a("div",null,c)}const m=n(l,[["render",d],["__file","D11-设置工作模式与环境（中）.html.vue"]]);export{m as default};
