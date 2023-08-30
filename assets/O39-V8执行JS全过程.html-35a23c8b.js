import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o as l,c as i,a as n,b as a,e,d as t}from"./app-cdabc73c.js";const c="/assets/cde28ae834f88de746657a5860b07cda-14666c5e.jpg",r="/assets/7dae168f208c3fab69a6891a76c92109-c1678f00.jpg",u="/assets/b21df133eda30afd83629af31e9c54e3-7fc9565f.jpg",d="/assets/bf60238a8ce64035215bd60ca5aba5f4-8a74c4c1.jpg",v={},k=t('<h1 id="_39-源码解读-v8-执行-js-代码的全过程" tabindex="-1"><a class="header-anchor" href="#_39-源码解读-v8-执行-js-代码的全过程" aria-hidden="true">#</a> 39｜源码解读：V8 执行 JS 代码的全过程</h1><p>你好，我是 LMOS。</p><p>前面我们学习了现代浏览器架构，也大致了解了浏览器内核的工作原理。在浏览器的内核中，V8 是一个绕不开的话题。在浏览器中，Chrome 的重要地位不用赘述，而 <mark>V8</mark> 不仅是 Chrome 的核心组件，还是 <mark>node.js</mark> 等众多软件的核心组件，所以，V8 的重要程度亦不用多言。</p><p>不过，V8 涉及到的技术十分广泛，包括<em>操作系统、编译技术、计算机体系结构</em>等多方面知识，为了带你先从宏观角度系统学习和了解 V8 项目，这节课我会从源码理解讲起，带你了解了 V8 执行 JS 代码的全过程。</p><h2 id="如何阅读-v8-源码和搭建-v8-开发环境" tabindex="-1"><a class="header-anchor" href="#如何阅读-v8-源码和搭建-v8-开发环境" aria-hidden="true">#</a> 如何阅读 V8 源码和搭建 V8 开发环境</h2><p>前面两节课，我带你简单了解了 Chromium 和 Webkit 项目的目录结构，在这里我们继续看一下如何学习 V8 源码。</p>',6),m=n("strong",null,"depot_tools",-1),h={href:"https://storage.googleapis.com/chrome-infra/depot_tools.zip",target:"_blank",rel:"noopener noreferrer"},b=t(`<p>解压后，我们需要将 depot_tools 工具添加到环境变量，注意这些操作需要你保证本机可以访问 Google 浏览器。</p><p>我们以 Mac 系统为例，添加到环境变量的代码命令如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>export PATH=\`pwd\`/depot_tools:&quot;$PATH&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后，你可以在命令行中测试 depot_tools 是否可以使用：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>gclient sync 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>下载完 depot_tools 后，我们就可以下载 V8 代码进行编译调试了“</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>mkdir v8
cd v8
fetch v8
cd v8/src
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下载好 V8 源码后，我们需要使用 GN 来配置工程文件。下面是我们用到的几个编译的参数：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>  is_component_build = true  // 编译成动态链接库以减少体积
  is_debug = true  // 开启调试
  v8_optimized_debug = true // 关闭一些代码优化
  symbol_level = 0 将所有的debug符号放在一起，加速二次编译和链接过程;
  ide=vs2022 /  ide=xcode // 选择编译 IDE
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们这节课就不展开讲解 gn 命令了，如果你有兴趣了解更多内容，可以自行查阅资料。说回正题，我们继续聊配置工作。</p><p>Windows 的配置情况如下 ：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>gn gen out.gn/x64.release --args=&#39;is_debug=true target_cpu=&quot;x64&quot; v8_target_cpu=&quot;arm64&quot; use_goma=true is_component_build=true v8_optimized_debug = true symbol_level = 0&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>我们再来看看 Mac 下的情况，Mac 下我们需要更新 xcode 依赖，代码如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
gn gen out/gn --ide=xcode
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>执行完成后，我们可以通过 IDE 进入相应的工程文件下，后面是我的操作截图，供你参考：</p><figure><img src="`+c+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>',16),g={href:"http://hello-world.cc",target:"_blank",rel:"noopener noreferrer"},f={href:"http://hello-world.cc",target:"_blank",rel:"noopener noreferrer"},_=t(`<p>我们来看一下这个文件的具体代码：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">int</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token keyword">int</span> argc<span class="token punctuation">,</span> <span class="token keyword">char</span><span class="token operator">*</span> argv<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// Initialize V8.</span>
  v8<span class="token operator">::</span>V8<span class="token operator">::</span><span class="token function">InitializeICUDefaultLocation</span><span class="token punctuation">(</span>argv<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  v8<span class="token operator">::</span>V8<span class="token operator">::</span><span class="token function">InitializeExternalStartupData</span><span class="token punctuation">(</span>argv<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  std<span class="token operator">::</span>unique_ptr<span class="token operator">&lt;</span>v8<span class="token operator">::</span>Platform<span class="token operator">&gt;</span> platform <span class="token operator">=</span> v8<span class="token operator">::</span>platform<span class="token operator">::</span><span class="token function">NewDefaultPlatform</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  v8<span class="token operator">::</span>V8<span class="token operator">::</span><span class="token function">InitializePlatform</span><span class="token punctuation">(</span>platform<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  v8<span class="token operator">::</span>V8<span class="token operator">::</span><span class="token function">Initialize</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// Create a new Isolate and make it the current one.</span>
  v8<span class="token operator">::</span>Isolate<span class="token operator">::</span>CreateParams create_params<span class="token punctuation">;</span>
  create_params<span class="token punctuation">.</span>array_buffer_allocator <span class="token operator">=</span>
      v8<span class="token operator">::</span>ArrayBuffer<span class="token operator">::</span>Allocator<span class="token operator">::</span><span class="token function">NewDefaultAllocator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  v8<span class="token operator">::</span>Isolate<span class="token operator">*</span> isolate <span class="token operator">=</span> v8<span class="token operator">::</span>Isolate<span class="token operator">::</span><span class="token function">New</span><span class="token punctuation">(</span>create_params<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">{</span>
    v8<span class="token operator">::</span>Isolate<span class="token operator">::</span>Scope <span class="token function">isolate_scope</span><span class="token punctuation">(</span>isolate<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// Create a stack-allocated handle scope.</span>
    v8<span class="token operator">::</span>HandleScope <span class="token function">handle_scope</span><span class="token punctuation">(</span>isolate<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// Create a new context.</span>
    v8<span class="token operator">::</span>Local<span class="token operator">&lt;</span>v8<span class="token operator">::</span>Context<span class="token operator">&gt;</span> context <span class="token operator">=</span> v8<span class="token operator">::</span>Context<span class="token operator">::</span><span class="token function">New</span><span class="token punctuation">(</span>isolate<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// Enter the context for compiling and running the hello world script.</span>
    v8<span class="token operator">::</span>Context<span class="token operator">::</span>Scope <span class="token function">context_scope</span><span class="token punctuation">(</span>context<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">{</span>
      <span class="token comment">// Create a string containing the JavaScript source code.</span>
      v8<span class="token operator">::</span>Local<span class="token operator">&lt;</span>v8<span class="token operator">::</span>String<span class="token operator">&gt;</span> source <span class="token operator">=</span>
          v8<span class="token operator">::</span>String<span class="token operator">::</span><span class="token function">NewFromUtf8Literal</span><span class="token punctuation">(</span>isolate<span class="token punctuation">,</span> <span class="token string">&quot;&#39;Hello&#39; + &#39;, World!&#39;&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// Compile the source code.</span>
      v8<span class="token operator">::</span>Local<span class="token operator">&lt;</span>v8<span class="token operator">::</span>Script<span class="token operator">&gt;</span> script <span class="token operator">=</span>
          v8<span class="token operator">::</span>Script<span class="token operator">::</span><span class="token function">Compile</span><span class="token punctuation">(</span>context<span class="token punctuation">,</span> source<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToLocalChecked</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// Run the script to get the result.</span>
      v8<span class="token operator">::</span>Local<span class="token operator">&lt;</span>v8<span class="token operator">::</span>Value<span class="token operator">&gt;</span> result <span class="token operator">=</span> script<span class="token operator">-&gt;</span><span class="token function">Run</span><span class="token punctuation">(</span>context<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToLocalChecked</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// Convert the result to an UTF8 string and print it.</span>
      v8<span class="token operator">::</span>String<span class="token operator">::</span>Utf8Value <span class="token function">utf8</span><span class="token punctuation">(</span>isolate<span class="token punctuation">,</span> result<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;%s\\n&quot;</span><span class="token punctuation">,</span> <span class="token operator">*</span>utf8<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),x={href:"http://hello-world.cc",target:"_blank",rel:"noopener noreferrer"},V=n("ol",null,[n("li",null,"初始化了 V8 程序；"),n("li",null,"运行了一段基于 JavaScript 语言程序的 “hello world” 并输出；"),n("li",null,"运行了一段基于 JavaScript 语言程序的加法运算并输出；"),n("li",null,"执行完成后卸载了 V8。")],-1),S=n("p",null,"上节课我们有提到，V8 是一个 JS 的执行引擎，在这个 helloworld 的代码中，除去运行 JS 代码的两部分，其它的代码都是为 JS 代码运行提供的准备工作。",-1),q=n("p",null,"我们现在就看一下运行时都做了哪些基本的准备工作。",-1),T=n("h2",{id:"v8-在运行时的表现",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#v8-在运行时的表现","aria-hidden":"true"},"#"),a(" V8 在运行时的表现")],-1),I=n("p",null,"上面代码是 hello-world 代码的主函数，也是核心的部分。我们梳理一下关键过程有哪些：首先 hello- world 代码的主函数调用了 v8::V8::Initialize() 方法对 V8 进行初始化；然后，调用了 v8::Isolate::New 来创建 Isolate；接着，创建完成后调用了 v8::Script::Compile 来进行编译；最后，调用 script->Run 用来执行 JS 代码。",-1),w={href:"http://hello-world.cc",target:"_blank",rel:"noopener noreferrer"},J=t('<figure><img src="'+r+`" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>好，让我们进入具体分析环节，先从内存申请开始说起。</p><h3 id="v8-启动时的内存申请" tabindex="-1"><a class="header-anchor" href="#v8-启动时的内存申请" aria-hidden="true">#</a> V8 启动时的内存申请</h3><p>申请内存从 InitReservation 方法开始，它主要处理的操作就是为 V8 引擎向 OS 申请内存，代码在 src/utils/allocation.cc 这个目录中：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>      <span class="token comment">// Reserve a region of twice the size so that there is an aligned address</span>
      <span class="token comment">// within it that&#39;s usable as the cage base.</span>
      VirtualMemory <span class="token function">padded_reservation</span><span class="token punctuation">(</span>params<span class="token punctuation">.</span>page_allocator<span class="token punctuation">,</span>
                                       params<span class="token punctuation">.</span>reservation_size <span class="token operator">*</span> <span class="token number">2</span><span class="token punctuation">,</span>
                                       reinterpret_cast<span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">*</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>hint<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>padded_reservation<span class="token punctuation">.</span><span class="token function">IsReserved</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span> false<span class="token punctuation">;</span>

      <span class="token comment">// Find properly aligned sub-region inside the reservation.</span>
      Address address <span class="token operator">=</span>
          <span class="token function">VirtualMemoryCageStart</span><span class="token punctuation">(</span>padded_reservation<span class="token punctuation">.</span><span class="token function">address</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> params<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">CHECK</span><span class="token punctuation">(</span>padded_reservation<span class="token punctuation">.</span><span class="token function">InVM</span><span class="token punctuation">(</span>address<span class="token punctuation">,</span> params<span class="token punctuation">.</span>reservation_size<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>申请内存的时候，InitReservation 会先申请两倍的内存，保证内存对齐，再从两倍内存中找到一个适合对齐地址，这是 V8 真正使用的内存地址。这块申请出来的内存后面的工作里用得上。完成申请后，还会再调用 padded_reservation.Free() 方法，将刚开始申请的内存释放掉。</p><p>下面我带你看看 VirtualMemoryCage 数据结构，它是 V8 内存管理的主要数据结构。V8 的内存方式采用的段页式，和 OS 的内存数据结构比较类似，但区别是 V8 只有一个段，OS 会有多段，但是 V8 会有很多页。</p><p>VirtualMemeoryCage 的数据结构位于 allocation.h 文件中，如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// +------------+-----------+-----------  ~~~  -+
// |     ...    |    ...    |   ...             |
// +------------+-----------+------------ ~~~  -+
// ^            ^           ^
// start        cage base   allocatable base
//
// &lt;------------&gt;           &lt;-------------------&gt;
// base bias size              allocatable size
// &lt;--------------------------------------------&gt;
//             reservation size
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>reservation size 是 V8 实际申请的内存，start 是内存基址，cage base 是页表的位置，allocatable 是 V8 可分配内存的开始，用来创建 Isolate。</p><h3 id="isolate" tabindex="-1"><a class="header-anchor" href="#isolate" aria-hidden="true">#</a> Isolate</h3><p>Isolate 是一个完整的 V8 实例，有着完整的堆和栈。V8 是虚拟机，Isolate 才是运行 JavaScript 的宿主。一个 Isolate 是一个独立的运行环境，包括但不限于堆管理器（heap）、垃圾回收器（GC）等。</p><p>在同一个时间，有且只有一个线程能在 Isolate 中运行代码，也就是说同一时刻，只有一个线程能进入 Iisolate，而多个线程可以通过切换来共享同一个 Isolate。</p><p>Isolate 对外的接口是 V8_EXPORT ，定义在 include/v8.h 文件中，其他程序可以调用它。这个接口也可以理解为 JavaScript 的运行单元，多个线程也就是多个任务，它们可以共享一个运行单元，主要涉及到几个 V8 的概念：</p><ol><li><p>Context：上下文，所有的 JS 代码都是在某个 V8 Context 中运行的。</p></li><li><p>Handle：一个指定 JS 对象的索引，它指向此 JS 对象在 V8 堆中的位置。</p></li><li><p>Handle Scope：包含很多 handle 的集合，用来统一管理多个 handle，当 Scope 被移出堆时，它所管理的 handle 集合也会被移除。</p></li></ol><p>Isolate 还有一个对内的数据结构 <strong>V8_EXPORT_PRIVATE</strong>，也是一个核心的数据结构，内部的很多重要的结构都会用到它，后面编译流程我还会讲到。</p><h3 id="编译" tabindex="-1"><a class="header-anchor" href="#编译" aria-hidden="true">#</a> 编译</h3><p>V8 的编译流程也是 V8 的核心流程，我们先简单看下编译的大概流程：</p><ol><li><p>tokenize （分词）：将 JS 代码解析为 Token 流，Token 是语法上的不可拆分的最小单位；</p></li><li><p>parse （解析）：语法分析，将上一步生成的 token 流转化为 AST 结构，AST 被称为抽象语法树；</p></li><li><p>ignite （解释）：通过解释器，生成字节码。</p></li></ol><p>接着，我们再看看这个过程的关键数据结构 V8_EXPORT_PRIVATE ParseInfo，代码在 src/parsing/parse-info.cc 目录下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ParseInfo 这个数据结构就是JS 代码生成token，再生成 AST 的过程，AST 的数据结构位置在 src/ast/ast.h。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>生成 AST 后，解释器会根据 AST 生成字节码，并解释执行字节码。字节码是介入 AST 和机器码之间的一种数据结构，你先留个印象，我们后面再详细说。</p><h3 id="代码执行" tabindex="-1"><a class="header-anchor" href="#代码执行" aria-hidden="true">#</a> 代码执行</h3><p>经过编译，最终生成了字节码。我们继续来看 Exectuion 这个数据结构，这个结构承载着 JS 代码运行过程前后的相关信息：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code>  class Execution final <span class="token operator">:</span> public AllStatic <span class="token punctuation">{</span>
 public<span class="token operator">:</span>
  <span class="token comment">// Whether to report pending messages, or keep them pending on the isolate.</span>
  <span class="token keyword">enum</span> <span class="token class-name">class</span> MessageHandling <span class="token punctuation">{</span> kReport<span class="token punctuation">,</span> kKeepPending <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">enum</span> <span class="token class-name">class</span> Target <span class="token punctuation">{</span> kCallable<span class="token punctuation">,</span> kRunMicrotasks <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token comment">// Call a function, the caller supplies a receiver and an array</span>
  <span class="token comment">// of arguments.</span>
  <span class="token comment">//</span>
  <span class="token comment">// When the function called is not in strict mode, receiver is</span>
  <span class="token comment">// converted to an object.</span>
  <span class="token comment">//</span>
  V8_EXPORT_PRIVATE V8_WARN_UNUSED_RESULT <span class="token keyword">static</span> MaybeHandle<span class="token operator">&lt;</span>Object<span class="token operator">&gt;</span> <span class="token function">Call</span><span class="token punctuation">(</span>
      Isolate<span class="token operator">*</span> isolate<span class="token punctuation">,</span> Handle<span class="token operator">&lt;</span>Object<span class="token operator">&gt;</span> callable<span class="token punctuation">,</span> Handle<span class="token operator">&lt;</span>Object<span class="token operator">&gt;</span> receiver<span class="token punctuation">,</span>
      <span class="token keyword">int</span> argc<span class="token punctuation">,</span> Handle<span class="token operator">&lt;</span>Object<span class="token operator">&gt;</span> argv<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过前面关键过程和数据结构的讲解，相信你已经基本了解了 V8 运行时的核心流程，下面我们从宏观层面看一下这个过程。</p><h2 id="v8-编译-——-v8-执行-js-的过程" tabindex="-1"><a class="header-anchor" href="#v8-编译-——-v8-执行-js-的过程" aria-hidden="true">#</a> V8 编译 —— V8 执行 JS 的过程</h2><p>JS 代码是给人看的，并不能由机器直接运行，需要很多中间步骤的转换，执行这些步骤的就是 <mark>JS 解析器</mark>。</p><p>主要过程是这样：首先对 JS 源代码进行<em>词法分析</em>，将源代码拆分成<em>一个个简单的词语（即 Token）</em>；然后，以这些 Token 为输入流进行语法分析，形成<em>一棵抽象语法树（即 AST）</em>，并检查其语法上的错误；最后，由语法树生成<mark>字节码</mark>，由 <mark>JS 解析器</mark>运行。下面我们分别讨论这几个步骤。</p><h3 id="词法分析" tabindex="-1"><a class="header-anchor" href="#词法分析" aria-hidden="true">#</a> 词法分析</h3><p>词法分析是将 JS 代码拆分成对应的 Token，Token 是能拆分的最小单位，固定 type 表述类型 / 属性，value 表示对应的值，如下图 Token。</p><img src="`+u+`" alt="img" style="zoom:33%;"><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[{
  &quot;type&quot;: &quot;Keyword&quot;,
  &quot;value&quot;: &quot;let&quot;
}, {
  &quot;type&quot;: &quot;Identifier&quot;,
  &quot;value&quot;: &quot;name&quot;
}, {
  &quot;type&quot;: &quot;Punctuator&quot;,
  &quot;value&quot;: &quot;=&quot;
}, {
  &quot;type&quot;: &quot;string&quot;,
  &quot;value&quot;: &quot;LMOS&quot;
}]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="语法分析" tabindex="-1"><a class="header-anchor" href="#语法分析" aria-hidden="true">#</a> 语法分析</h3><p>在进行词法分析转为 Token 之后，解析器会继续根据生成的 Token 生成对应的 AST。说起 AST，相信前端同学并不陌生，也是热词之一，无论是在 Vue、React 中表示虚拟 DOM ，或者表示 Babel 对 JS 的转译，都需要先将其转化为对应的 AST。</p><h3 id="字节码" tabindex="-1"><a class="header-anchor" href="#字节码" aria-hidden="true">#</a> 字节码</h3><p>在解析器（Parser）将 JS 代码解析成 AST 之后，<strong>解释器</strong>（Ignition）根据 AST 来生成字节码（也称中间码）。前文提到 CPU 只能识别机器码，对字节码是识别不了的，这里就衍生出一个问题，如果 CPU 识别不了字节码，那为什么还要在中间插一步来耗费资源转成字节码呢？效率不是很低吗？</p><p>在计算机学科里聊效率，都逃避不了时间和空间这两个概念，绝大部分的优化都是空间换时间或时间换空间，两者的平衡，效率如何达到最高，是一个很值得深入研究的问题。</p><p>拿之前版本的 V8 引擎执行 JS 来说，是没有转字节码这一步骤的，而是直接从 AST 转成机器码，这个过程称为编译过程，所以每次拿到 JS 文件的时候，首先都会编译，而这个过程还是比较浪费时间的，这是一件比较头疼的事情，需要一个解决办法。</p><h2 id="v8-中的优化细节" tabindex="-1"><a class="header-anchor" href="#v8-中的优化细节" aria-hidden="true">#</a> V8 中的优化细节</h2><p>V8 执行 JS 的主要过程我们说完了，其实在这个过程中，V8 利用 JIT 的能力做了很多方面的优化，现在我们看一下具体有哪些。</p><h3 id="缓存机器码" tabindex="-1"><a class="header-anchor" href="#缓存机器码" aria-hidden="true">#</a> 缓存机器码</h3><p>一个网页只要第一次打开过，关闭再次去打开，大部分情况下，还是和原来 JS 文件一致的，除非开发者修改了代码，但这个可以暂时不考虑。毕竟哪个网站也不会一天闲得无聊，不停地修改，上传替换。</p><p>按照这个思路，既然绝大多数情况下，文件不会修改，<u>那编译后的机器码可以考虑缓存下来</u>，这样一来，下次再打开或者刷新页面的时候就省去编译的过程了，可以直接执行了。</p><p>存储机器码可以分成两种情况：</p><ol><li>一个是浏览器未关闭时候，直接存储到浏览器本地的内存中；</li><li>一个是浏览器关闭了，直接存储在磁盘上，而早期的 V8 也确实是这么做的，典型的牺牲空间换时间。</li></ol><h3 id="热代码" tabindex="-1"><a class="header-anchor" href="#热代码" aria-hidden="true">#</a> 热代码</h3><p><u>在代码中，常常会有同一部分代码，被多次调用</u>，同一部分代码如果每次都需要解释器转二进制代码再去执行，效率上来说，会有些浪费，所以在 V8 模块中会有<mark>专门的监控模块</mark>，来监控同一代码是否多次被调用，如果被多次调用，那么就会被标记为<strong>热代码</strong>，这有什么作用呢？我们继续往下看。</p><h3 id="优化编译器" tabindex="-1"><a class="header-anchor" href="#优化编译器" aria-hidden="true">#</a> 优化编译器</h3><p><strong>TurboFan</strong> (优化编译器) 这个词，相信关注手机界的同学并不陌生，华为、小米等这些品牌，在近几年产品发布会上都会出现这个词，主要的能力是通过软件计算能力来优化一系列的功能，使得效率更优。</p><p>接着热代码继续说，当存在热代码的时候，<u>V8 会借助 TurboFan 将<em>为热代码的字节码</em>转为机器码并缓存下来</u>，这样一来，当再次调用热代码时，就不再需要将字节码转为机器码。当然，热代码相对来说还是少部分的，所以缓存也并不会占用太大内存，并且提升了执行效率，同样此处也是牺牲空间换时间。</p><h3 id="反优化" tabindex="-1"><a class="header-anchor" href="#反优化" aria-hidden="true">#</a> 反优化</h3><p>JS 语言是动态语言，非常之灵活，<em>对象的结构和属性在运行时是可以发生改变的</em>，我们设想一个问题：如果热代码在某次执行的时候，突然其中的某个属性被修改了，那么编译成机器码的热代码还能继续执行吗？</p><p>答案是肯定不能。这个时候就要使用到优化编译器的<strong>反优化</strong>了，<u>它会将热代码退回到 AST 这一步</u>，这个时候解释器会重新解释执行被修改的代码；如果代码再次被标记为热代码，那么会重复执行优化编译器的这个步骤。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>这节课我们先通过编译源码的方式搭建了 V8 的环境，又通过 V8 项目中的 hello_world 项目一步步学习了 V8 执行 JS 代码的过程，最后，我们又从宏观角度了解了 V8 执行 JS 代码的全过程。</p><p>这节课的要点，你可以结合后面的导图看一下。</p><figure><img src="`+d+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>在这个过程中，我们通过 V8 项目的关键代码和数据结构深入的了解了 V8 这个项目。在学习一个开源巨石项目的过程中，我们要掌握一定的学习方式，切不可以在初学习的阶段就过度自底而上地纠结于各种代码细节。</p><p>我们可以通过这样的方式进行学习：</p><ol><li><strong>初步建立印象</strong>：自顶而上的了解项目的结构和架构，形成一个初步的宏观视觉；</li><li><strong>梳理主线</strong>：进入程序源码的角度，理解代码的主要脉络，建议从一个简单的例子入手；</li><li><strong>关注重要过程</strong>：关注过程中的关键代码输入输出，运行过程中的几个重要中间阶段、重要中间结果和数据结构；</li><li><strong>查漏补缺</strong>：补充细节知识点的查漏补缺，结合自己情况深入学习。</li></ol><p>V8 在执行 JS 的过程中又可以进行很多优化，具体方式就是</p><ul><li>在运行 JS 过程中持续记录代码语句执行情况，以及变量类型的变化情况。</li><li>若推测代码执行次数较多（热点代码）且变量类型较固定时，就会调用优化器优化这部分代码，</li><li>缓存这部分机器码 + 跳过这部分类型判断逻辑，从而实现性能优化。</li></ul><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题" aria-hidden="true">#</a> 思考题</h2><p>V8 在执行 JS 的过程中可以做哪些性能优化？</p><p>欢迎你在留言区与我交流讨论，也推荐你把课程分享给更多朋友。</p><blockquote><p>老师可以开一门专门的编译器的课程吗？或者带我们写一门编译器也可以😊<br> 作者回复: 你的要求有点点高哦</p><hr><p>请问：V8的字节码和Java的字节码是相同的吗？或者说，是同一个标准吗？<br> 作者回复: 不同</p><hr><p>需要 win系统或者ubuntu等linux系统怎么运行测试v8，希望哪位大神分享下哦<br> 作者回复: 可以直接下载啊 有win和linux版本的</p></blockquote>',67);function C(y,A){const s=p("ExternalLinkIcon");return l(),i("div",null,[k,n("p",null,[a("Chromium 项目中包含了可运行的 V8 源码，但是从调试的角度看，我们一般使用 "),m,a(" 来编译调试 V8 源码，它是 V8 的编译工具链，下载和编译代码都需要用到它，你可以直接"),n("a",h,[a("点击 depot_tools bundle 下载"),e(s)]),a("。")]),b,n("p",null,[a("我们看到，在工程文件下有一个名为 samples 的目录，上图中打开的文件 "),n("a",g,[a("hello-world.cc"),e(s)]),a(" 也是这个目录下的一个文件，它是 V8 项目中的一个实例文件，我们后面的学习也会从 "),n("a",f,[a("hello-world.cc"),e(s)]),a(" 文件入手。")]),_,n("p",null,[a("我们简单看看 "),n("a",x,[a("hello-world.cc"),e(s)]),a(" 这个文件，它是用 C++ 程序编写的，主要做了下面几件事：")]),V,S,q,T,I,n("p",null,[a("我们后面会围绕上述关键过程做分析。你可以结合下面这张图，看看 "),n("a",w,[a("hello-world.cc"),e(s)]),a(" 的执行过程，还有这个过程里涉及到的核心方法和重要数据结构。")]),J])}const E=o(v,[["render",C],["__file","O39-V8执行JS全过程.html.vue"]]);export{E as default};
