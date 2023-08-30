import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,d as e}from"./app-cdabc73c.js";const t="/assets/0910c3a68df6dde27b511cf13f85d158-c05cbbda.jpg",i={},p=e(`<h1 id="_15-linux初始化-下-从-start到第一个进程" tabindex="-1"><a class="header-anchor" href="#_15-linux初始化-下-从-start到第一个进程" aria-hidden="true">#</a> 15 | Linux初始化（下）：从_start到第一个进程</h1><p>你好，我是 LMOS。</p><p>今天我们继续来研究 Linux 的初始化流程，为你讲解如何解压内核，然后讲解 Linux 内核第一个 C 函数。最后，我们会用 Linux 的第一个用户进程的建立来收尾。</p><p>如果用你上手去玩一款新游戏做类比的话，那么上节课只是新手教程，而这节课就是更深入的实战了。后面你会看到很多熟悉的“面孔”，像是我们前面讲过的 CPU 工作模式、MMU 页表等等基础知识，这节课都会得到运用。</p><h2 id="解压后内核初始化" tabindex="-1"><a class="header-anchor" href="#解压后内核初始化" aria-hidden="true">#</a> 解压后内核初始化</h2><p>下面，我们先从 setup.bin 文件的入口 _start 开始，了解启动信息结构，</p><ul><li>接着由 16 位 main 函数切换 CPU 到<mark>保护模式</mark>，然后跳入 vmlinux.bin 文件中的 startup_32 函数重新加载段描述符。</li><li>如果是 64 位的系统，就要进入 startup_64 函数，切换到 CPU 到<mark>长模式</mark>，最后调用 extract_kernel 函数解压 Linux 内核，并进入内核的 startup_64 函数，由此 Linux 内核开始运行。</li></ul><h2 id="为何要从-start-开始" tabindex="-1"><a class="header-anchor" href="#为何要从-start-开始" aria-hidden="true">#</a> 为何要从 _start 开始</h2><p>通过上节课对 vmlinuz 文件结构的研究，我们已经搞清楚了其中的 vmlinux.bin 是如何产生的，它是由 <code>linux/arch/x86/boot/compressed</code> 目录下的一些目标文件，以及 piggy.S 包含的一个 vmlinux.bin.gz 的压缩文件一起生成的。</p><p>vmlinux.bin.gz 文件则是由编译的 Linux 内核所生成的 <mark>elf 格式</mark>的 vmlinux 文件，去掉了文件的<strong>符号信息</strong>和<strong>重定位信息</strong>后，压缩得到的。</p><p>CPU 是无法识别压缩文件中的指令直接运行的，<strong>必须先进行解压后</strong>，然后解析 elf 格式的文件，把其中的指令段和数据段加载到指定的内存空间中，才能由 CPU 执行。</p><p>这就需要用到前面的 setup.bin 文件了，_start 正是 setup.bin 文件的入口，在 head.S 文件中定义，代码如下。</p><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>#linux/arch/x86/boot/head.S
  .code16
  .section &quot;.bstext&quot;, &quot;ax&quot;
  .global bootsect_start
bootsect_start:
  ljmp  $BOOTSEG, $start2
start2:
#……
#这里的512字段bootsector对于硬盘启动是用不到的
#……
  .globl  _start
_start:
    .byte  0xeb    # short (2-byte) jump
    .byte  start_of_setup-1f #这指令是用.byte定义出来的，跳转start_of_setup-1f
#……
#这里是一个庞大的数据结构，没展示出来，与linux/arch/x86/include/uapi/asm/bootparam.h文件中的struct setup_header一一对应。这个数据结构定义了启动时所需的默认参数
#……
start_of_setup:
  movw  %ds, %ax
  movw  %ax, %es   #ds = es
  cld               #主要指定si、di寄存器的自增方向，即si++ di++

  movw  %ss, %dx
  cmpw  %ax, %dx  # ds 是否等于 ss
  movw  %sp, %dx     
  je  2f    
  # 如果ss为空则建立新栈
  movw  $_end, %dx
  testb  $CAN_USE_HEAP, loadflags
  jz  1f
  movw  heap_end_ptr, %dx
1:  addw  $STACK_SIZE, %dx
  jnc  2f
  xorw  %dx, %dx  
2:
  andw  $~3, %dx
  jnz  3f
  movw  $0xfffc, %dx  
3:  movw  %ax, %ss
  movzwl  %dx, %esp  
  sti      # 栈已经初始化好，开中断
  pushw  %ds
  pushw  $6f
  lretw      # cs=ds ip=6：跳转到标号6处
6:
  cmpl  $0x5a5aaa55, setup_sig #检查setup标记
  jne  setup_bad
  movw  $__bss_start, %di
  movw  $_end+3, %cx
  xorl  %eax, %eax
  subw  %di, %cx
  shrw  $2, %cx
  rep; stosl          #清空setup程序的bss段
  calll  main  #调用C语言main函数 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="setup-header-结构" tabindex="-1"><a class="header-anchor" href="#setup-header-结构" aria-hidden="true">#</a> setup_header 结构</h2><p>下面我们重点研究一下 setup_header 结构，这对我们后面的流程很关键。它定义在 <code>linux/arch/x86/include/uapi/asm/bootparam.h</code> 文件中，如下所示。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">struct</span> <span class="token class-name">setup_header</span> <span class="token punctuation">{</span>    
__u8    setup_sects<span class="token punctuation">;</span>        <span class="token comment">//setup大小</span>
__u16   root_flags<span class="token punctuation">;</span>         <span class="token comment">//根标志   </span>
__u32   syssize<span class="token punctuation">;</span>            <span class="token comment">//系统文件大小</span>
__u16   ram_size<span class="token punctuation">;</span>           <span class="token comment">//内存大小</span>
__u16   vid_mode<span class="token punctuation">;</span>    
__u16   root_dev<span class="token punctuation">;</span>           <span class="token comment">//根设备号</span>
__u16   boot_flag<span class="token punctuation">;</span>          <span class="token comment">//引导标志</span>
<span class="token comment">//……</span>
__u32   realmode_swtch<span class="token punctuation">;</span>     <span class="token comment">//切换回实模式的函数地址     </span>
__u16   start_sys_seg<span class="token punctuation">;</span>    
__u16   kernel_version<span class="token punctuation">;</span>     <span class="token comment">//内核版本    </span>
__u8    type_of_loader<span class="token punctuation">;</span>     <span class="token comment">//引导器类型 我们这里是GRUB</span>
__u8    loadflags<span class="token punctuation">;</span>          <span class="token comment">//加载内核的标志 </span>
__u16   setup_move_size<span class="token punctuation">;</span>    <span class="token comment">//移动setup的大小</span>
__u32   code32_start<span class="token punctuation">;</span>       <span class="token comment">//将要跳转到32位模式下的地址 </span>
__u32   ramdisk_image<span class="token punctuation">;</span>      <span class="token comment">//初始化内存盘映像地址，里面有内核驱动模块 </span>
__u32   ramdisk_size<span class="token punctuation">;</span>       <span class="token comment">//初始化内存盘映像大小</span>
<span class="token comment">//……</span>
<span class="token punctuation">}</span> <span class="token keyword">__attribute__</span><span class="token punctuation">(</span><span class="token punctuation">(</span>packed<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>前面提到过，硬盘中 MBR 是由 GRUB 写入的 boot.img，因此这里的 <code>linux/arch/x86/boot/head.S</code> 中的 bootsector 对于硬盘启动是无用的。</p><p>GRUB 将 vmlinuz 的 setup.bin 部分读到内存地址 0x90000 处，然后跳转到 0x90200 开始执行，<strong>恰好跳过了前面 512 字节的 bootsector</strong>，从 _start 开始。</p><h2 id="_16-位的-main-函数-main-c" tabindex="-1"><a class="header-anchor" href="#_16-位的-main-函数-main-c" aria-hidden="true">#</a> 16 位的 main 函数: main.c</h2><p>我们通常用 C 编译器编译的代码，是 32 位保护模式下的或者是 64 位长模式的，却很少编译成 16 位实模式下的，其实 setup.bin 大部分代码都是 16 位实模式下的。</p><p>从前面的代码里，我们能够看到在 linux/arch/x86/boot/head.S 中调用了 main 函数，该函数在 linux/arch/x86/boot/main.c 文件中，代码如下 。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">//定义boot_params变量</span>
<span class="token keyword">struct</span> <span class="token class-name">boot_params</span> boot_params <span class="token keyword">__attribute__</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token function">aligned</span><span class="token punctuation">(</span><span class="token number">16</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">char</span> <span class="token operator">*</span>HEAP <span class="token operator">=</span> _end<span class="token punctuation">;</span>
<span class="token keyword">char</span> <span class="token operator">*</span>heap_end <span class="token operator">=</span> _end<span class="token punctuation">;</span> 
<span class="token comment">//……</span>
<span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">//把先前setup_header结构复制到boot_params结构中的hdr变量中，在linux/arch/x86/include/uapi/asm/bootparam.h文件中你会发现boot_params结构中的hdr的类型正是setup_header结构  </span>
    <span class="token function">copy_boot_params</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//初始化早期引导所用的console    </span>
    <span class="token function">console_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token comment">//初始化堆 </span>
    <span class="token function">init_heap</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//检查CPU是否支持运行Linux    </span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">validate_cpu</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>        
        <span class="token function">puts</span><span class="token punctuation">(</span><span class="token string">&quot;Unable to boot - please use a kernel appropriate &quot;</span>             <span class="token string">&quot;for your CPU.\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>        
        <span class="token function">die</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token punctuation">}</span>
    <span class="token comment">//告诉BIOS我们打算在什么CPU模式下运行它</span>
    <span class="token function">set_bios_mode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//查看物理内存空间布局    </span>
    <span class="token function">detect_memory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//初始化键盘</span>
    <span class="token function">keyboard_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//查询Intel的(IST)信息。    </span>
    <span class="token function">query_ist</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">/*查询APM BIOS电源管理信息。*/</span>
    <span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">if</span> <span class="token expression"><span class="token function">defined</span><span class="token punctuation">(</span>CONFIG_APM<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token function">defined</span><span class="token punctuation">(</span>CONFIG_APM_MODULE<span class="token punctuation">)</span>   </span></span>
    <span class="token function">query_apm_bios</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span></span>
    <span class="token comment">//查询EDD BIOS扩展数据区域的信息</span>
    <span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">if</span> <span class="token expression"><span class="token function">defined</span><span class="token punctuation">(</span>CONFIG_EDD<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token function">defined</span><span class="token punctuation">(</span>CONFIG_EDD_MODULE<span class="token punctuation">)</span> </span></span>
    <span class="token function">query_edd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span></span>
    <span class="token comment">//设置显卡的图形模式    </span>
    <span class="token function">set_video</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//进入CPU保护模式，不会返回了       </span>
    <span class="token function">go_to_protected_mode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面这些函数都在 linux/arch/x86/boot/ 目录对应的文件中，都是调用 BIOS 中断完成的，具体细节，你可以自行查看。</p><h2 id="处理参数的逻辑-pm-c" tabindex="-1"><a class="header-anchor" href="#处理参数的逻辑-pm-c" aria-hidden="true">#</a> 处理参数的逻辑: pm.c</h2><p>我这里列出的代码只是帮助你理清流程，我们继续看看 go_to_protected_mode() 函数，在 linux/arch/x86/boot/pm.c 中，代码如下。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">//linux/arch/x86/boot/pm.c</span>
<span class="token keyword">void</span> <span class="token function">go_to_protected_mode</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">{</span>    
    <span class="token comment">//安装切换实模式的函数</span>
    <span class="token function">realmode_switch_hook</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//开启a20地址线，是为了能访问1MB以上的内存空间</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">enable_a20</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>        
        <span class="token function">puts</span><span class="token punctuation">(</span><span class="token string">&quot;A20 gate not responding, unable to boot...\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">die</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token punctuation">}</span>
    <span class="token comment">//重置协处理器，早期x86上的浮点运算单元是以协处理器的方式存在的    </span>
    <span class="token function">reset_coprocessor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//屏蔽8259所示的中断源   </span>
    <span class="token function">mask_all_interrupts</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//安装中断描述符表和全局描述符表，    </span>
    <span class="token function">setup_idt</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">setup_gdt</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//保护模式下长跳转到boot_params.hdr.code32_start</span>
    <span class="token function">protected_mode_jump</span><span class="token punctuation">(</span>boot_params<span class="token punctuation">.</span>hdr<span class="token punctuation">.</span>code32_start<span class="token punctuation">,</span>                <span class="token punctuation">(</span>u32<span class="token punctuation">)</span><span class="token operator">&amp;</span>boot_params <span class="token operator">+</span> <span class="token punctuation">(</span><span class="token function">ds</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&lt;&lt;</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>protected_mode_jump 是个汇编函数，在 linux/arch/x86/boot/pmjump.S 文件中。代码逻辑和我们前面（第 5 节课）学到的保护模式切换是一样的。只是多了<strong>处理参数的逻辑</strong>，即跳转到 boot_params.hdr.code32_start 中的地址。</p><p>这个地址在 linux/arch/x86/boot/head.S 文件中设为 0x100000，如下所示。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>code32_start<span class="token operator">:</span>
<span class="token keyword">long</span>  <span class="token number">0x100000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>需要注意的是，GRUB 会把 vmlinuz 中的 vmlinux.bin 部分，放在 1MB 开始的内存空间中。通过这一跳转，正式进入 vmlinux.bin 中。</strong></p><h2 id="startup-32-函数" tabindex="-1"><a class="header-anchor" href="#startup-32-函数" aria-hidden="true">#</a> startup_32 函数</h2><p>startup_32 中需要重新加载段描述符，之后计算 vmlinux.bin 文件的编译生成的地址和实际加载地址的偏移，然后重新设置内核栈，检测 CPU 是否支持<mark>长模式</mark>，接着再次计算 vmlinux.bin 加载地址的偏移，来确定对其中 vmlinux.bin.gz 解压缩的地址。</p><p>如果 CPU 支持<mark>长模式</mark>的话，就要设置 64 位的全局描述表，开启 CPU 的 PAE 物理地址扩展特性。再设置最初的 MMU 页表，最后开启分页并进入长模式，跳转到 startup_64，代码如下。</p><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>  .code32
SYM_FUNC_START(startup_32)
  cld
  cli
  leal  (BP_scratch+4)(%esi), %esp
  call  1f
1:  popl  %ebp
  subl  $ rva(1b), %ebp
    #重新加载全局段描述符表
  leal  rva(gdt)(%ebp), %eax
  movl  %eax, 2(%eax)
  lgdt  (%eax)
    #……篇幅所限未全部展示代码
    #重新设置栈
  leal  rva(boot_stack_end)(%ebp), %esp
    #检测CPU是否支持长模式
  call  verify_cpu
  testl  %eax, %eax
  jnz  .Lno_longmode
    #……计算偏移的代码略过
    #开启PAE
    movl  %cr4, %eax
  orl  $X86_CR4_PAE, %eax
  movl  %eax, %cr4
    #……建立MMU页表的代码略过
    #开启长模式
    movl  $MSR_EFER, %ecx
  rdmsr
  btsl  $_EFER_LME, %eax
    #获取startup_64的地址
    leal  rva(startup_64)(%ebp), %eax
    #……篇幅所限未全部展示代码
    #内核代码段描述符索和startup_64的地址引压入栈
    pushl  $__KERNEL_CS
  pushl  %eax
    #开启分页和保护模式
  movl  $(X86_CR0_PG | X86_CR0_PE), %eax 
  movl  %eax, %cr0
    #弹出刚刚栈中压入的内核代码段描述符和startup_64的地址到CS和RIP中，实现跳转，真正进入长模式。
  lret
SYM_FUNC_END(startup_32）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="startup-64-函数" tabindex="-1"><a class="header-anchor" href="#startup-64-函数" aria-hidden="true">#</a> startup_64 函数</h2><p>现在，我们终于开启了 CPU <mark>长模式</mark>，从 startup_64 开始真正进入了 64 位的时代，可喜可贺。</p><p>startup_64 函数同样也是在 <code>linux/arch/x86/boot/compressed/head64.S</code> 文件中定义的。</p><p>startup_64 函数中，初始化长模式下数据段寄存器，确定最终解压缩地址，然后拷贝压缩 vmlinux.bin 到该地址，跳转到 <code>decompress_kernel</code> 地址处，<strong>开始解压 vmlinux.bin.gz</strong>，代码如下。</p><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>  .code64
  .org 0x200
SYM_CODE_START(startup_64)
  cld
  cli
  #初始化长模式下数据段寄存器
  xorl  %eax, %eax
  movl  %eax, %ds
  movl  %eax, %es
  movl  %eax, %ss
  movl  %eax, %fs
  movl  %eax, %gs
    #……重新确定内核映像加载地址的代码略过
    #重新初始化64位长模式下的栈
    leaq  rva(boot_stack_end)(%rbx), %rsp
    #……建立最新5级MMU页表的代码略过
    #确定最终解压缩地址，然后拷贝压缩vmlinux.bin到该地址
    pushq  %rsi
  leaq  (_bss-8)(%rip), %rsi
  leaq  rva(_bss-8)(%rbx), %rdi
  movl  $(_bss - startup_32), %ecx
  shrl  $3, %ecx
  std
  rep  movsq
  cld
  popq  %rsi
    #跳转到重定位的Lrelocated处
    leaq  rva(.Lrelocated)(%rbx), %rax
  jmp  *%rax
SYM_CODE_END(startup_64)

  .text
SYM_FUNC_START_LOCAL_NOALIGN(.Lrelocated)
    #清理程序文件中需要的BSS段
  xorl  %eax, %eax
  leaq    _bss(%rip), %rdi
  leaq    _ebss(%rip), %rcx
  subq  %rdi, %rcx
  shrq  $3, %rcx
  rep  stosq
    #……省略无关代码
  pushq  %rsi      
  movq  %rsi, %rdi    
  leaq  boot_heap(%rip), %rsi
    #准备参数：被解压数据的开始地址   
  leaq  input_data(%rip), %rdx
    #准备参数：被解压数据的长度   
  movl  input_len(%rip), %ecx
    #准备参数：解压数据后的开始地址     
  movq  %rbp, %r8
    #准备参数：解压数据后的长度
  movl  output_len(%rip), %r9d
    #调用解压函数解压vmlinux.bin.gz，返回入口地址
    call  extract_kernel
  popq  %rsi
    #跳转到内核入口地址 
  jmp  *%rax
SYM_FUNC_END(.Lrelocated)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中最后到了 extract_kernel 函数，它就是解压内核的函数，下面我们就来研究它。</p><h2 id="extract-kernel-函数-misc-c" tabindex="-1"><a class="header-anchor" href="#extract-kernel-函数-misc-c" aria-hidden="true">#</a> extract_kernel 函数: misc.c</h2><p>从 startup_32 函数到 startup_64 函数，其间经过了<mark>保护模式</mark>、<mark>长模式</mark>，最终到达了 <code>extract_kernel 函数</code>，extract_kernel 函数根据 piggy.o 中的信息从 vmlinux.bin.gz 中解压出 vmlinux。</p><p>根据前面的知识点，我们知道 vmlinux 正是编译出 Linux 内核 elf 格式的文件，只不过它被去掉了符号信息。所以，extract_kernel 函数不仅仅是解压，还需要解析 elf 格式。</p><p>extract_kernel 函数是在 linux/arch/x86/boot/compressed/misc.c 文件中定义的。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>asmlinkage __visible <span class="token keyword">void</span> <span class="token operator">*</span><span class="token function">extract_kernel</span><span class="token punctuation">(</span>
                                <span class="token keyword">void</span> <span class="token operator">*</span>rmode<span class="token punctuation">,</span> memptr heap<span class="token punctuation">,</span>
                                <span class="token keyword">unsigned</span> <span class="token keyword">char</span> <span class="token operator">*</span>input_data<span class="token punctuation">,</span>
                                <span class="token keyword">unsigned</span> <span class="token keyword">long</span> input_len<span class="token punctuation">,</span>
                                <span class="token keyword">unsigned</span> <span class="token keyword">char</span> <span class="token operator">*</span>output<span class="token punctuation">,</span>
                                <span class="token keyword">unsigned</span> <span class="token keyword">long</span> output_len
                                <span class="token punctuation">)</span><span class="token punctuation">{</span>    
    <span class="token keyword">const</span> <span class="token keyword">unsigned</span> <span class="token keyword">long</span> kernel_total_size <span class="token operator">=</span> VO__end <span class="token operator">-</span> VO__text<span class="token punctuation">;</span>
    <span class="token keyword">unsigned</span> <span class="token keyword">long</span> virt_addr <span class="token operator">=</span> LOAD_PHYSICAL_ADDR<span class="token punctuation">;</span>    
    <span class="token keyword">unsigned</span> <span class="token keyword">long</span> needed_size<span class="token punctuation">;</span>
    <span class="token comment">//省略了无关性代码</span>
    <span class="token function">debug_putstr</span><span class="token punctuation">(</span><span class="token string">&quot;\\nDecompressing Linux... &quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token comment">//调用具体的解压缩算法解压</span>
    <span class="token function">__decompress</span><span class="token punctuation">(</span>input_data<span class="token punctuation">,</span> input_len<span class="token punctuation">,</span> <span class="token constant">NULL</span><span class="token punctuation">,</span> <span class="token constant">NULL</span><span class="token punctuation">,</span> output<span class="token punctuation">,</span> output_len<span class="token punctuation">,</span>            <span class="token constant">NULL</span><span class="token punctuation">,</span> error<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//解压出的vmlinux是elf格式，所以要解析出里面的指令数据段和常规数据段</span>
    <span class="token comment">//返回vmlinux的入口点即Linux内核程序的开始地址  </span>
    <span class="token function">parse_elf</span><span class="token punctuation">(</span>output<span class="token punctuation">)</span><span class="token punctuation">;</span> 
    <span class="token function">handle_relocations</span><span class="token punctuation">(</span>output<span class="token punctuation">,</span> output_len<span class="token punctuation">,</span> virt_addr<span class="token punctuation">)</span><span class="token punctuation">;</span>    <span class="token function">debug_putstr</span><span class="token punctuation">(</span><span class="token string">&quot;done.\\nBooting the kernel.\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> output<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>正如上面代码所示，extract_kernel 函数调用 __decompress 函数，对 vmlinux.bin.gz 使用特定的解压算法进行解压。解压算法是编译内核的配置选项决定的。</p><p>但是，__decompress 函数解压出来的是 vmlinux 文件是 elf 格式的，所以还要调用 parse_elf 函数进一步解析 elf 格式，把 vmlinux 中的指令段、数据段、BSS 段，根据 elf 中信息和要求放入特定的内存空间，返回指令段的入口地址。</p><p>请你注意，在 Lrelocated 函数的最后一条指令：jmp *rax，其中的 rax 中就是保存的 extract_kernel 函数返回的入口点，就是从这里开始进入了 Linux 内核。</p><h2 id="linux-内核的-startup-64" tabindex="-1"><a class="header-anchor" href="#linux-内核的-startup-64" aria-hidden="true">#</a> Linux 内核的 startup_64</h2><p><strong>这里我提醒你留意，此时的 startup_64 函数并不是之前的 startup_64 函数，也不参与前面的链接工作。</strong></p><p>这个 startup_64 函数定义在 linux/arch/x86/kernel/head_64.S 文件中，它是内核的入口函数，如下所示。</p><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>#linux/arch/x86/kernel/head_64.S  
    .code64
SYM_CODE_START_NOALIGN(startup_64)
  #切换栈
    leaq  (__end_init_task - SIZEOF_PTREGS)(%rip), %rsp
  #跳转到.Lon_kernel_cs:
    pushq  $__KERNEL_CS
  leaq  .Lon_kernel_cs(%rip), %rax
  pushq  %rax
  lretq
.Lon_kernel_cs:
    #对于第一个CPU，则会跳转secondary_startup_64函数中1标号处
  jmp 1f
SYM_CODE_END(startup_64)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中省略了和流程无关的代码，对于 SMP 系统加电之后，总线仲裁机制会选出多个 CPU 中的一个 CPU，称为 BSP，也叫第一个 CPU。它负责让 BSP CPU 先启动，其它 CPU 则等待 BSP CPU 的唤醒。</p><p>这里我来分情况给你说说。对于第一个启动的 CPU，会跳转 secondary_startup_64 函数中 1 标号处，对于其它被唤醒的 CPU 则会直接执行 secondary_startup_64 函数。</p><p>接下来，我给你快速过一遍 secondary_startup_64 函数，后面的代码我省略了这个函数对更多 CPU 特性（设置 GDT、IDT，处理了 MMU 页表等）的检查，因为这些工作我们早已很熟悉了，代码如下所示。</p><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>SYM_CODE_START(secondary_startup_64)
    #省略了大量无关性代码
1:
  movl  $(X86_CR4_PAE | X86_CR4_PGE), %ecx
#ifdef CONFIG_X86_5LEVEL
  testl  $1, __pgtable_l5_enabled(%rip)
  jz  1f
  orl  $X86_CR4_LA57, %ecx
1:
#endif
    #省略了大量无关性代码
.Ljump_to_C_code:
  pushq  $.Lafter_lret  
  xorl  %ebp, %ebp
    #获取x86_64_start_kernel函数地址赋给rax  
  movq  initial_code(%rip), %rax
  pushq  $__KERNEL_CS  
    #将x86_64_start_kernel函数地址压入栈中
  pushq  %rax
    #弹出__KERNEL_CS  和x86_64_start_kernel函数地址到CS：RIP完成调用  
    lretq
.Lafter_lret:
SYM_CODE_END(secondary_startup_64)
#保存了x86_64_start_kernel函数地址
SYM_DATA(initial_code,  .quad x86_64_start_kernel)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 secondary_startup_64 函数一切准备就绪之后，最后就会调用 x86_64_start_kernel 函数，看它的名字好像是内核的开始函数，但真的是这样吗，我们一起看看才知道。</p><h2 id="linux-内核的第一个-c-函数-x86-64-start-kernel" tabindex="-1"><a class="header-anchor" href="#linux-内核的第一个-c-函数-x86-64-start-kernel" aria-hidden="true">#</a> Linux 内核的第一个 C 函数: x86_64_start_kernel</h2><p>若不是经历了前面的分析讲解。要是我问你 Linux 内核的第一个 C 函数是什么，你可能无从说起，就算一通百度之后，仍然无法确定。</p><p>但是，只要我们跟着代码的执行流程，就会发现**在 secondary_startup_64 函数的最后，调用的 <code>x86_64_start_kernel</code> 函数是用 C 语言写的，那么它一定就是 Linux 内核的第一个 C 函数。**它在 <code>linux/arch/x86/kernel/head64.c</code> 文件中被定义，这个文件名你甚至都能猜出来，如下所示。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>asmlinkage __visible <span class="token keyword">void</span> __init <span class="token function">x86_64_start_kernel</span><span class="token punctuation">(</span><span class="token keyword">char</span> <span class="token operator">*</span> real_mode_data<span class="token punctuation">)</span><span class="token punctuation">{</span>    
    <span class="token comment">//重新设置早期页表</span>
    <span class="token function">reset_early_page_tables</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//清理BSS段</span>
    <span class="token function">clear_bss</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//清理之前的顶层页目录</span>
    <span class="token function">clear_page</span><span class="token punctuation">(</span>init_top_pgt<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//复制引导信息</span>
    <span class="token function">copy_bootdata</span><span class="token punctuation">(</span><span class="token function">__va</span><span class="token punctuation">(</span>real_mode_data<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//加载BSP CPU的微码</span>
    <span class="token function">load_ucode_bsp</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//让顶层页目录指向重新设置早期页表</span>
    init_top_pgt<span class="token punctuation">[</span><span class="token number">511</span><span class="token punctuation">]</span> <span class="token operator">=</span> early_top_pgt<span class="token punctuation">[</span><span class="token number">511</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token function">x86_64_start_reservations</span><span class="token punctuation">(</span>real_mode_data<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">void</span> __init <span class="token function">x86_64_start_reservations</span><span class="token punctuation">(</span><span class="token keyword">char</span> <span class="token operator">*</span>real_mode_data<span class="token punctuation">)</span><span class="token punctuation">{</span>  
   <span class="token comment">//略过无关的代码</span>
    <span class="token function">start_kernel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>x86_64_start_kernel 函数中又一次处理了页表，处理页表就是处理 Linux 内核虚拟地址空间，Linux 虚拟地址空间是一步步完善的。</p><p>然后，x86_64_start_kernel 函数复制了引导信息，即 struct boot_params 结构体。最后调用了 x86_64_start_reservations 函数，其中处理了平台固件相关的东西，就是调用了大名鼎鼎的 start_kernel 函数。</p><h2 id="有名的-start-kernel-函数-内核功能初始化函数main-c" tabindex="-1"><a class="header-anchor" href="#有名的-start-kernel-函数-内核功能初始化函数main-c" aria-hidden="true">#</a> 有名的 start_kernel 函数: 内核功能初始化函数main.c</h2><p>start_kernel 函数之所以有名，这是因为在互联网上，在各大 Linux 名著之中，都会大量宣传它 Linux 内核中的地位和作用，正如其名字表达的含意，这是内核的开始。</p><p>但是问题来了。我们一路走来，发现 start_kernel 函数之前有大量的代码执行，那这些代码算不算内核的开始呢？当然也可以说那就是内核的开始，也可以说是前期工作。</p><p>其实，start_kernel 函数中调用了大量 Linux 内核功能的初始化函数，它定义在 <code>/linux/init/main.c</code> 文件中。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> <span class="token function">start_kernel</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">{</span>    
    <span class="token keyword">char</span> <span class="token operator">*</span>command_line<span class="token punctuation">;</span>    
    <span class="token keyword">char</span> <span class="token operator">*</span>after_dashes<span class="token punctuation">;</span>
    <span class="token comment">//CPU组早期初始化</span>
    <span class="token function">cgroup_init_early</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//关中断</span>
    <span class="token function">local_irq_disable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//ARCH层初始化</span>
    <span class="token function">setup_arch</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>command_line<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//日志初始化      </span>
    <span class="token function">setup_log_buf</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">sort_main_extable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//陷阱门初始化    </span>
    <span class="token function">trap_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//内存初始化    </span>
    <span class="token function">mm_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">ftrace_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//调度器初始化</span>
    <span class="token function">sched_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//工作队列初始化</span>
    <span class="token function">workqueue_init_early</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//RCU锁初始化</span>
    <span class="token function">rcu_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//IRQ 中断请求初始化</span>
    <span class="token function">early_irq_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">init_IRQ</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">tick_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">rcu_init_nohz</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//定时器初始化 </span>
    <span class="token function">init_timers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">hrtimers_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//软中断初始化    </span>
    <span class="token function">softirq_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">timekeeping_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">mem_encrypt_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//每个cpu页面集初始化</span>
    <span class="token function">setup_per_cpu_pageset</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token comment">//fork初始化建立进程的 </span>
    <span class="token function">fork_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">proc_caches_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">uts_ns_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//内核缓冲区初始化    </span>
    <span class="token function">buffer_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token function">key_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token comment">//安全相关的初始化</span>
    <span class="token function">security_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  
    <span class="token comment">//VFS数据结构内存池初始化  </span>
    <span class="token function">vfs_caches_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//页缓存初始化    </span>
    <span class="token function">pagecache_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//进程信号初始化    </span>
    <span class="token function">signals_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>    
    <span class="token comment">//运行第一个进程 </span>
    <span class="token function">arch_call_rest_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>start_kernel 函数我如果不做精简，会有 200 多行，全部都是初始化函数，我只留下几个主要的初始化函数，这些函数的实现细节我们无需关心。</p><p>可以看到，Linux 内核所有功能的初始化函数都是在 start_kernel 函数中调用的，这也是它如此出名，如此重要的原因。</p><p>一旦 start_kernel 函数执行完成，Linux 内核就具备了向应用程序提供一系列功能服务的能力。这里对我们而言，我们只关注一个 <code>arch_call_rest_init 函数</code>。下面我们就来研究它。 如下所示。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">void</span> __init __weak <span class="token function">arch_call_rest_init</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">{</span>    
    <span class="token function">rest_init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个函数其实非常简单，它是一个<strong>包装函数</strong>，其中只是直接调用了 rest_init 函数。</p><p>rest_init 函数的重要功能就是建立了两个 Linux 内核线程，我们看看精简后的 rest_init 函数：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>noinline <span class="token keyword">void</span> __ref <span class="token function">rest_init</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">{</span>    <span class="token keyword">struct</span> <span class="token class-name">task_struct</span> <span class="token operator">*</span>tsk<span class="token punctuation">;</span>
    <span class="token keyword">int</span> pid<span class="token punctuation">;</span>
    <span class="token comment">//建立kernel_init线程</span>
    pid <span class="token operator">=</span> <span class="token function">kernel_thread</span><span class="token punctuation">(</span>kernel_init<span class="token punctuation">,</span> <span class="token constant">NULL</span><span class="token punctuation">,</span> CLONE_FS<span class="token punctuation">)</span><span class="token punctuation">;</span>   
    <span class="token comment">//建立khreadd线程 </span>
    pid <span class="token operator">=</span> <span class="token function">kernel_thread</span><span class="token punctuation">(</span>kthreadd<span class="token punctuation">,</span> <span class="token constant">NULL</span><span class="token punctuation">,</span> CLONE_FS <span class="token operator">|</span> CLONE_FILES<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Linux 内核线程可以执行一个内核函数， 只不过这个函数有独立的线程上下文，可以被 Linux 的进程调度器调度，对于 kernel_init 线程来说，执行的就是 kernel_init 函数。</p><h2 id="linux-的第一个用户进程" tabindex="-1"><a class="header-anchor" href="#linux-的第一个用户进程" aria-hidden="true">#</a> Linux 的第一个用户进程</h2><p>当我们可以建立第一个用户进程的时候，就代表 Linux 内核的初始流程已经基本完成。</p><p>经历了“长途跋涉”，我们也终于走到了这里**。Linux 内核的第一个用户态进程是在 kernel_init 线程建立的，而 kernel_init 线程执行的就是 kernel_init 函数。**那 kernel_init 函数到底做了什么呢？</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">static</span> <span class="token keyword">int</span> __ref <span class="token function">kernel_init</span><span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token operator">*</span>unused<span class="token punctuation">)</span><span class="token punctuation">{</span>   
     <span class="token keyword">int</span> ret<span class="token punctuation">;</span>
     <span class="token keyword">if</span> <span class="token punctuation">(</span>ramdisk_execute_command<span class="token punctuation">)</span> <span class="token punctuation">{</span>       
         ret <span class="token operator">=</span> <span class="token function">run_init_process</span><span class="token punctuation">(</span>ramdisk_execute_command<span class="token punctuation">)</span><span class="token punctuation">;</span>        
         <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>ret<span class="token punctuation">)</span>            
             <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>        
         <span class="token function">pr_err</span><span class="token punctuation">(</span><span class="token string">&quot;Failed to execute %s (error %d)\\n&quot;</span><span class="token punctuation">,</span>ramdisk_execute_command<span class="token punctuation">,</span> ret<span class="token punctuation">)</span><span class="token punctuation">;</span>    
     <span class="token punctuation">}</span>
     <span class="token keyword">if</span> <span class="token punctuation">(</span>execute_command<span class="token punctuation">)</span> <span class="token punctuation">{</span>        
         ret <span class="token operator">=</span> <span class="token function">run_init_process</span><span class="token punctuation">(</span>execute_command<span class="token punctuation">)</span><span class="token punctuation">;</span>        
         <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>ret<span class="token punctuation">)</span>            
         <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>        
         <span class="token function">panic</span><span class="token punctuation">(</span><span class="token string">&quot;Requested init %s failed (error %d).&quot;</span><span class="token punctuation">,</span>              execute_command<span class="token punctuation">,</span> ret<span class="token punctuation">)</span><span class="token punctuation">;</span>    
     <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">try_to_run_init_process</span><span class="token punctuation">(</span><span class="token string">&quot;/sbin/init&quot;</span><span class="token punctuation">)</span> <span class="token operator">||</span>                    <span class="token operator">!</span><span class="token function">try_to_run_init_process</span><span class="token punctuation">(</span><span class="token string">&quot;/etc/init&quot;</span><span class="token punctuation">)</span> <span class="token operator">||</span>        <span class="token operator">!</span><span class="token function">try_to_run_init_process</span><span class="token punctuation">(</span><span class="token string">&quot;/bin/init&quot;</span><span class="token punctuation">)</span> <span class="token operator">||</span>        <span class="token operator">!</span><span class="token function">try_to_run_init_process</span><span class="token punctuation">(</span><span class="token string">&quot;/bin/sh&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>        
    <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token function">panic</span><span class="token punctuation">(</span><span class="token string">&quot;No working init found.  Try passing init= option to kernel. &quot;</span>          <span class="token string">&quot;See Linux Documentation/admin-guide/init.rst for guidance.&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结合上述代码，可以发现 ramdisk_execute_command 和 execute_command 都是内核启动时传递的参数，它们可以在 GRUB 启动选项中设置。</p><p>比方说，通常引导内核时向 command line 传递的参数都是 init=xxx ，而对于 initrd 则是传递 rdinit=xxx 。</p><p>但是，通常我们不会传递参数，所以这个函数会执行到上述代码的 15 行，<strong>依次尝试以 /sbin/init、/etc/init、/bin/init、/bin/sh 这些文件为可执行文件建立进程</strong>，但是只要其中之一成功就行了。</p><p>try_to_run_init_process 和 run_init_process 函数的核心都是调用 <code>sys_fork 函数</code>建立进程的，这里我们不用关注它的实现细节。</p><p>到这里，Linux 内核已经建立了第一个进程，Linux 内核的初始化流程也到此为止了。</p><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾" aria-hidden="true">#</a> 重点回顾</h2><p>又到了课程尾声，Linux 初始化流程的学习我们就告一段落了，我来给你做个总结。</p><p>今天我们讲得内容有点多，我们从 _start 开始到 startup32、startup64 函数 ，到 extract_kernel 函数解压出真正的 Linux 内核文件 vmlinux 开始，然后从 Linux 内核的入口函数 startup_64 到 Linux 内核第一个 C 函数，最后接着从 Linux 内核 start_kernel 函数的建立 ，说到了第一个用户进程。</p><p>一起来回顾一下这节课的重点：</p><p>\\1. GRUB 加载 vmlinuz 文件之后，会把控制权交给 vmlinuz 文件的 setup.bin 的部分中 _start，它会设置好栈，清空 bss，设置好 setup_header 结构，调用 16 位 main 切换到保护模式，最后跳转到 1MB 处的 vmlinux.bin 文件中。</p><p>\\2. 从 vmlinux.bin 文件中 startup32、startup64 函数开始建立新的全局段描述符表和 MMU 页表，切换到长模式下解压 vmlinux.bin.gz。释放出 vmlinux 文件之后，由解析 elf 格式的函数进行解析，释放 vmlinux 中的代码段和数据段到指定的内存。然后调用其中的 startup_64 函数，在这个函数的最后调用 Linux 内核的第一个 C 函数。</p><p>3.Linux 内核第一个 C 函数重新设置 MMU 页表，随后便调用了最有名的 start_kernel 函数， start_kernel 函数中调用了大多数 Linux 内核功能性初始化函数，在最后调用 rest_init 函数建立了两个内核线程，在其中的 kernel_init 线程建立了第一个用户态进程。</p><figure><img src="`+t+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>Linux 初始化要点示意图</p><p>不知道你感觉到没有，Linux 的启动流程相比于我们的 Cosmos 启动流程复杂得多。</p><p>Linux 之所以如此复杂，是因为它把完成各种功能的模块组装了一起，而我们 Cosmos 则把内核之前的初始化工作，分离出来，形成二级引导器，二级引导器也是由多文件模块组成的，最后用我们的映像工具把它们封装在一起。</p><p>对比之下，你就可以明白，<strong>软件工程模块化</strong>是多么重要了。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题" aria-hidden="true">#</a> 思考题</h2><p>你能指出上文中 Linux 初始化流程里，主要函数都被链接到哪些对应的二进制文件中了？</p><p>欢迎你在留言区跟我交流互动，也欢迎你把这节课分享给同事、朋友。</p><p>我是 LMOS，我们下节课见！</p>',101),c=[p];function l(o,u){return s(),a("div",null,c)}const v=n(i,[["render",l],["__file","D15-Linux初始化（下）.html.vue"]]);export{v as default};
