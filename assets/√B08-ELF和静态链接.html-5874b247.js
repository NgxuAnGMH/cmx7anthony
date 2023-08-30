import{_ as s}from"./plugin-vue_export-helper-c27b6911.js";import{r as i,o as l,c as d,a as n,b as e,e as r,d as c}from"./app-cdabc73c.js";const o="/assets/997341ed0fa9018561c7120c19cfa2a7-2c3c18b3.jpg",t="/assets/276a740d0eabf5f4be905fe7326d9fb3-b990ffe5.jpg",p="/assets/f62da9b29aa53218f8907851df27f912-7d7c960c.jpeg",m={},v=c(`<h1 id="√08-elf和静态链接-为什么程序无法同时在linux和windows下运行" tabindex="-1"><a class="header-anchor" href="#√08-elf和静态链接-为什么程序无法同时在linux和windows下运行" aria-hidden="true">#</a> √08 | ELF和静态链接：为什么程序无法同时在Linux和Windows下运行？</h1><p>过去的三节，你和我一起通过一些简单的代码，看到了我们写的程序，是怎么变成一条条计算机指令的；if…else 这样的条件跳转是怎么样执行的；for/while 这样的循环是怎么执行的；函数间的相互调用是怎么发生的。</p><p>我记得以前，我自己在了解完这些知识之后，产生了一个非常大的疑问。那就是，既然我们的程序最终都被变成了一条条机器码去执行，<em>那为什么同一个程序，在同一台计算机上，在 Linux 下可以运行，而在 Windows 下却不行呢</em>？反过来，Windows 上的程序在 Linux 上也是一样不能执行的。<em>可是我们的 CPU 并没有换掉</em>，它应该可以识别同样的指令呀？</p><p>如果你和我有同样的疑问，那这一节，我们就一起来解开。</p><h2 id="编译、链接和装载-拆解程序执行" tabindex="-1"><a class="header-anchor" href="#编译、链接和装载-拆解程序执行" aria-hidden="true">#</a> 编译、链接和装载：拆解程序执行</h2><p>第 5 节我们说过，写好的 C 语言代码，可以通过编译器编译成汇编代码，然后汇编代码再通过汇编器变成 CPU 可以理解的机器码，于是 CPU 就可以执行这些机器码了。你现在对这个过程应该不陌生了，但是这个描述把过程大大简化了。下面，我们一起具体来看，C 语言程序是如何变成一个可执行程序的。</p><p>不知道你注意到没有，过去几节，我们通过 gcc 生成的文件和 objdump 获取到的汇编指令都有些小小的问题。我们先把前面的 add 函数示例，拆分成两个文件 add_lib.c 和 link_example.c。</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">// add_lib.c</span>
<span class="token keyword">int</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> a<span class="token punctuation">,</span> <span class="token keyword">int</span> b<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">return</span> a<span class="token operator">+</span>b<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">// link_example.c</span>

<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>
<span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
    <span class="token keyword">int</span> a <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span>
    <span class="token keyword">int</span> b <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">;</span>
    <span class="token keyword">int</span> c <span class="token operator">=</span> <span class="token function">add</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;c = %d\\n&quot;</span><span class="token punctuation">,</span> c<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们通过 gcc 来编译这两个文件，然后通过 objdump 命令看看它们的汇编代码。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ gcc <span class="token parameter variable">-g</span> <span class="token parameter variable">-c</span> add_lib.c link_example.c
$ objdump <span class="token parameter variable">-d</span> <span class="token parameter variable">-M</span> intel <span class="token parameter variable">-S</span> add_lib.o
$ objdump <span class="token parameter variable">-d</span> <span class="token parameter variable">-M</span> intel <span class="token parameter variable">-S</span> link_example.o
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>add_lib.o:     file format elf64-x86-64
Disassembly of section .text:
0000000000000000 &lt;add&gt;:
   0:   55                      push   rbp
   1:   48 89 e5                mov    rbp,rsp
   4:   89 7d fc                mov    DWORD PTR [rbp-0x4],edi
   7:   89 75 f8                mov    DWORD PTR [rbp-0x8],esi
   a:   8b 55 fc                mov    edx,DWORD PTR [rbp-0x4]
   d:   8b 45 f8                mov    eax,DWORD PTR [rbp-0x8]
  10:   01 d0                   add    eax,edx
  12:   5d                      pop    rbp
  13:   c3                      ret    
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>link_example.o:     file format elf64-x86-64
Disassembly of section .text:
0000000000000000 &lt;main&gt;:
   0:   55                      push   rbp
   1:   48 89 e5                mov    rbp,rsp
   4:   48 83 ec 10             sub    rsp,0x10
   8:   c7 45 fc 0a 00 00 00    mov    DWORD PTR [rbp-0x4],0xa
   f:   c7 45 f8 05 00 00 00    mov    DWORD PTR [rbp-0x8],0x5
  16:   8b 55 f8                mov    edx,DWORD PTR [rbp-0x8]
  19:   8b 45 fc                mov    eax,DWORD PTR [rbp-0x4]
  1c:   89 d6                   mov    esi,edx
  1e:   89 c7                   mov    edi,eax
  20:   b8 00 00 00 00          mov    eax,0x0
  25:   e8 00 00 00 00          call   2a &lt;main+0x2a&gt;
  2a:   89 45 f4                mov    DWORD PTR [rbp-0xc],eax
  2d:   8b 45 f4                mov    eax,DWORD PTR [rbp-0xc]
  30:   89 c6                   mov    esi,eax
  32:   48 8d 3d 00 00 00 00    lea    rdi,[rip+0x0]        # 39 &lt;main+0x39&gt;
  39:   b8 00 00 00 00          mov    eax,0x0
  3e:   e8 00 00 00 00          call   43 &lt;main+0x43&gt;
  43:   b8 00 00 00 00          mov    eax,0x0
  48:   c9                      leave  
  49:   c3                      ret    
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>既然代码已经被我们“编译”成了指令，我们不妨尝试运行一下 ./link_example.o。</p><p>不幸的是，文件没有执行权限，我们遇到一个 Permission denied 错误。即使通过 chmod 命令赋予 link_example.o 文件可执行的权限，运行./link_example.o 仍然只会得到一条 cannot execute binary file: Exec format error 的错误。</p><p>我们再仔细看一下 objdump 出来的两个文件的代码，会发现两个程序的地址都是从 0 开始的。如果地址是一样的，程序如果需要通过 call 指令调用函数的话，它怎么知道应该跳转到哪一个文件里呢？</p><p>这么说吧，无论是这里的运行报错，还是 objdump 出来的汇编代码里面的重复地址，都是因为 add_lib.o 以及 link_example.o 并不是一个<strong>可执行文件</strong>（Executable Program），而是<strong>目标文件</strong>（Object File）。只有通过<mark>链接器（Linker）<mark>把</mark>多个目标文件</mark>以及<mark>调用的各种函数库</mark>链接起来，我们才能得到<mark>一个可执行文件</mark>。</p><p>我们通过 gcc 的 -o 参数，可以生成对应的可执行文件，对应执行之后，就可以得到这个简单的加法调用函数的结果。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ gcc <span class="token parameter variable">-o</span> link-example add_lib.o link_example.o
$ ./link_example
c <span class="token operator">=</span> <span class="token number">15</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际上，“<strong>C 语言代码 - 汇编代码 - 机器码</strong>” 这个过程，在我们的计算机上进行的时候是由两部分组成的。</p><p>第一个部分由<mark>编译</mark>（Compile）、<mark>汇编</mark>（Assemble）以及<mark>链接</mark>（Link）三个阶段组成。在这三个阶段完成之后，我们就生成了一个可执行文件。</p><p>第二部分，我们通过<mark>装载器</mark>（Loader）把<mark>可执行文件</mark>装载（Load）到内存中。CPU 从内存中读取指令和数据，来开始真正执行程序。</p><img src="`+o+`" alt="img" style="zoom:25%;"><h2 id="elf-格式和链接-理解链接过程" tabindex="-1"><a class="header-anchor" href="#elf-格式和链接-理解链接过程" aria-hidden="true">#</a> ELF 格式和链接：理解链接过程</h2><p>程序最终是通过装载器变成指令和数据的，所以其实我们生成的可执行代码也并不仅仅是一条条的指令。我们还是通过 objdump 指令，把可执行文件的内容拿出来看看。</p><div class="language-assembly line-numbers-mode" data-ext="assembly"><pre class="language-assembly"><code>link_example:     file format elf64-x86-64
Disassembly of section .init:
...
Disassembly of section .plt:
...
Disassembly of section .plt.got:
...
Disassembly of section .text:
...

 6b0:   55                      push   rbp
 6b1:   48 89 e5                mov    rbp,rsp
 6b4:   89 7d fc                mov    DWORD PTR [rbp-0x4],edi
 6b7:   89 75 f8                mov    DWORD PTR [rbp-0x8],esi
 6ba:   8b 55 fc                mov    edx,DWORD PTR [rbp-0x4]
 6bd:   8b 45 f8                mov    eax,DWORD PTR [rbp-0x8]
 6c0:   01 d0                   add    eax,edx
 6c2:   5d                      pop    rbp
 6c3:   c3                      ret    
00000000000006c4 &lt;main&gt;:
 6c4:   55                      push   rbp
 6c5:   48 89 e5                mov    rbp,rsp
 6c8:   48 83 ec 10             sub    rsp,0x10
 6cc:   c7 45 fc 0a 00 00 00    mov    DWORD PTR [rbp-0x4],0xa
 6d3:   c7 45 f8 05 00 00 00    mov    DWORD PTR [rbp-0x8],0x5
 6da:   8b 55 f8                mov    edx,DWORD PTR [rbp-0x8]
 6dd:   8b 45 fc                mov    eax,DWORD PTR [rbp-0x4]
 6e0:   89 d6                   mov    esi,edx
 6e2:   89 c7                   mov    edi,eax
 6e4:   b8 00 00 00 00          mov    eax,0x0
 6e9:   e8 c2 ff ff ff          call   6b0 &lt;add&gt;
 6ee:   89 45 f4                mov    DWORD PTR [rbp-0xc],eax
 6f1:   8b 45 f4                mov    eax,DWORD PTR [rbp-0xc]
 6f4:   89 c6                   mov    esi,eax
 6f6:   48 8d 3d 97 00 00 00    lea    rdi,[rip+0x97]        # 794 &lt;_IO_stdin_used+0x4&gt;
 6fd:   b8 00 00 00 00          mov    eax,0x0
 702:   e8 59 fe ff ff          call   560 &lt;printf@plt&gt;
 707:   b8 00 00 00 00          mov    eax,0x0
 70c:   c9                      leave  
 70d:   c3                      ret    
 70e:   66 90                   xchg   ax,ax
...
Disassembly of section .fini:
...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你会发现，可执行代码 dump 出来内容，和之前的目标代码长得差不多，但是长了很多。因为在 Linux 下，可执行文件和目标文件所使用的都是一种叫 <strong>ELF</strong>（Execuatable and Linkable File Format）的文件格式，中文名字叫<strong>可执行与可链接文件格式</strong>，这里面不仅存放了编译成的汇编指令，还保留了很多别的数据。</p><p>比如我们过去所有 objdump 出来的代码里，你都可以看到对应的函数名称，像 add、main 等等，乃至你自己定义的全局可以访问的变量名称，都存放在这个 ELF 格式文件里。这些名字和它们对应的地址，在 ELF 文件里面，存储在一个叫作<strong>符号表</strong>（Symbols Table）的位置里。符号表相当于一个地址簿，把名字和地址关联了起来。</p><p>我们先只关注和我们的 add 以及 main 函数相关的部分。你会发现，这里面，main 函数里调用 add 的跳转地址，不再是下一条指令的地址了，而是 add 函数的入口地址了，这就是 EFL 格式和链接器的功劳。</p><img src="`+t+'" alt="img" style="zoom:25%;"><p>ELF 文件格式把各种信息，分成一个一个的 Section 保存起来。ELF 有一个基本的文件头（File Header），用来表示这个文件的基本属性，比如是否是可执行文件，对应的 CPU、操作系统等等。除了这些基本属性之外，大部分程序还有这么一些 Section：</p><ul><li>1.首先是.text Section，也叫作<strong>代码段</strong>或者指令段（Code Section），用来保存程序的代码和指令；</li><li>2.接着是.data Section，也叫作<strong>数据段</strong>（Data Section），用来保存程序里面设置好的初始化数据信息；</li><li>3.然后就是.rel.text Secion，叫作<strong>重定位表</strong>（Relocation Table）。重定位表里，保留的是当前的文件里面，哪些跳转地址其实是我们不知道的。比如上面的 link_example.o 里面，我们在 main 函数里面调用了 add 和 printf 这两个函数，但是在链接发生之前，我们并不知道该跳转到哪里，这些信息就会存储在重定位表里；</li><li>4.最后是.symtab Section，叫作<strong>符号表</strong>（Symbol Table）。符号表保留了我们所说的当前文件里面定义的函数名称和对应地址的地址簿。</li></ul><p>链接器会扫描所有输入的目标文件，然后把所有符号表里的信息收集起来，构成<mark>一个全局的符号表</mark>。然后再根据重定位表，<em>把所有不确定要跳转地址的代码</em>，根据符号表里面存储的地址，进行一次修正。最后，把所有的目标文件的对应段进行一次合并，变成了最终的可执行代码。这也是为什么，<em>可执行文件里面的函数调用的地址都是正确的</em>。</p><img src="'+p+'" alt="img" style="zoom:25%;"><p><em>在链接器把程序变成可执行文件之后</em>，要装载器去执行程序就容易多了。<em>装载器不再需要考虑地址跳转的问题</em>，只需要解析 ELF 文件，把对应的指令和数据，加载到内存里面供 CPU 执行就可以了。</p><h2 id="总结延伸" tabindex="-1"><a class="header-anchor" href="#总结延伸" aria-hidden="true">#</a> 总结延伸</h2><p>讲到这里，相信你已经猜到，为什么同样一个程序，在 Linux 下可以执行而在 Windows 下不能执行了。其中一个非常重要的原因就是，<em>两个操作系统下可执行文件的格式不一样</em>。</p><p>我们今天讲的是 Linux 下的 ELF 文件格式，而 Windows 的可执行文件格式是一种叫作 <strong>PE</strong>（Portable Executable Format）的文件格式。Linux 下的装载器只能解析 ELF 格式而不能解析 PE 格式。</p><p>如果我们有一个可以能够解析 PE 格式的装载器，我们就有可能在 Linux 下运行 Windows 程序了。这样的程序真的存在吗？没错，Linux 下著名的开源项目 Wine，就是通过兼容 PE 格式的装载器，使得我们能直接在 Linux 下运行 Windows 程序的。而现在微软的 Windows 里面也提供了 WSL，也就是 Windows Subsystem for Linux，可以解析和加载 ELF 格式的文件。</p><p>我们去写可以用的程序，也不仅仅是把所有代码放在一个文件里来编译执行，而是可以拆分成不同的函数库，最后通过一个静态链接的机制，使得不同的文件之间既有分工，又能通过静态链接来“合作”，变成一个可执行的程序。</p><p>对于 ELF 格式的文件，为了能够实现这样一个静态链接的机制，里面不只是简单罗列了程序所需要执行的指令，还会包括链接所需要的重定位表和符号表。</p><h2 id="推荐阅读" tabindex="-1"><a class="header-anchor" href="#推荐阅读" aria-hidden="true">#</a> 推荐阅读</h2><p>想要更深入了解程序的链接过程和 ELF 格式，我推荐你阅读<u>《程序员的自我修养——链接、装载和库》的 1～4 章</u>。这是一本难得的讲解程序的链接、装载和运行的好书。</p><h2 id="课后思考" tabindex="-1"><a class="header-anchor" href="#课后思考" aria-hidden="true">#</a> 课后思考</h2><p>你可以通过 readelf 读取出今天演示程序的符号表，看看符号表里都有哪些信息；然后通过 objdump 读取出今天演示程序的重定位表，看看里面又有哪些信息。</p><p>欢迎留言和我分享你的思考和疑惑，你也可以把今天的内容分享给你的朋友，和他一起学习和进步。</p>',46),b=n("p",null,[e("readelf -s link_example.o //查看符号表"),n("br"),e(" objdump -r link_example.o //查看重定位表")],-1),u=n("p",null,"Java的类加载是由jvm完成，大致过程为装载-链接-初始化-运行，所以是jvm帮我们屏蔽了操作系统之间的差异。为了加快程序启动速度，一些类会延迟加载，所以jvm中有很多动态链接。",-1),x={href:"https://blog.csdn.net/haoel/article/details/2879",target:"_blank",rel:"noopener noreferrer"};function k(f,g){const a=i("ExternalLinkIcon");return l(),d("div",null,[v,n("blockquote",null,[b,u,n("p",null,[e("这一节可执行文件最好用gdb一步一步调试，最好看看每一步汇编，详细的看看内部一些细节才好。推荐陈皓10年前写的“用GDB调试程序”系列："),n("a",x,[e("https://blog.csdn.net/haoel/article/details/2879"),r(a)])])])])}const D=s(m,[["render",k],["__file","√B08-ELF和静态链接.html.vue"]]);export{D as default};
