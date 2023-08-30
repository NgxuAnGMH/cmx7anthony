import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{o as i,c as t,d as n}from"./app-cdabc73c.js";const e="/assets/640-1691480330336-141-2e53fa98.jpeg",r="/assets/640-1691480330336-142-ab4ca504.jpeg",s="/assets/640-1691480330337-143-c854cfb1.jpeg",o="/assets/640-1691480330337-144-20911e37.jpeg",g="/assets/640-1691480330337-145-34980af8.jpeg",p={},l=n('<h1 id="_22-白泽带你读论文丨fuzzing-with-code-fragments" tabindex="-1"><a class="header-anchor" href="#_22-白泽带你读论文丨fuzzing-with-code-fragments" aria-hidden="true">#</a> 22-白泽带你读论文丨Fuzzing with Code Fragments</h1><p><strong>Fuzzing with Code Fragments</strong></p><p>本文发表在USENIX Security ‘12，第一作者是德国萨尔大学硕士研究生Christian Holler，现就职于Mozilla。本文作者所在的研究组，主要从事软件工程，软件测试，程序分析和软件安全相关研究，相关工作主要发表在软件工程方面的会议上，如TSE，ICSE，FSE等。</p><h2 id="一、概要" tabindex="-1"><a class="header-anchor" href="#一、概要" aria-hidden="true">#</a> <strong>一、概要</strong></h2><p>模糊测试（Fuzz Testing）是一种通过提供随机数据作为软件系统输入，以暴露软件漏洞为目的的自动化测试技术。为了保证其有效性，输入的数据一方面必须足够常见以保证能通过基础的一致性检查，另一方面，又要足够独特才能触发到异常行为。所以模糊测试的输入和测试结果的质量是息息相关的。</p><p>对于一般目标系统，Fuzzing所产生的随机输入有较大的概率能够触发目标系统运行时异常，但是对于解释器，这类特殊的软件系统需要符合固定语言语法的源代码片段为输入，在执行程序之前有解析器会对输入代码进行语法分析，如果输入不符合对应的语法规则，解释器将拒绝继续执行，从而导致无法触发系统运行时的异常。</p><p>目前（2012年之前），基于语法生成输入的fuzzing研究十分有限，最广泛使用的jsfunfuzz是针对特定的解释器实现的。为此，本文工作实验了一个能够对基于上下文无关文法的解释器进行黑盒Fuzzing的通用框架——LangFuzz。它不针对特定的语言和目标系统，输入包括语言的语法，样例代码以及测试代码，通过解析语法生成代码构件，从样例代码中学习代码片段，测试代码则用来对代码进行变异。</p><p>作者在Javascript上实现了LangFuzz并和jsfunfuzz进行了比较，三个月内发现了105个新的漏洞，获得奖金50,000美金。</p><h2 id="二、设计与实现" tabindex="-1"><a class="header-anchor" href="#二、设计与实现" aria-hidden="true">#</a> <strong>二、设计与实现</strong></h2><p>如图是LangFuzz的工作架构，重点在前两步。</p><figure><img src="'+e+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><ol><li>利用<mark>ANTLR</mark>提供的JavaScript的parser，解析提供的样例代码文件，从所有文件代码中提取出各种代码片段，以令牌流的形式表示，代码片段本质上对应语法中的非终结符。如果给定的样例代码足够丰富，就可以得到对应语法中所有非终结符对应的代码片段。</li><li>第二步生成输入的策略有两种，可以结合使用，一种是通过对测试代码中的代码进行变异生成测试用例，另一种是根据语法直接生成测试用例。</li><li></li></ol><p>a) 代码变异：随机选取测试代码中的文件，使用第一步中的parser对文件中代码进行分析，然后随机挑选其中的代码片段，从第一步学习出的代码片段库中随机挑选同类型的进行替换，从而得到新的输入代码。</p><p>b) 生成测试用例：根据输入的语法，以一种广度优先的策略对当前语法树上的非终结符，随机选择第一步学习得到的对应类型的代码片段进行替换展开。如图所示，在同一层次选取非终结符进行替换时是随机选择。</p><figure><img src="'+r+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>循环替换N次之后并不一定能替换所有的非终结符，需要再将代码中所有未替换的非终结符替换为所能推导出的终结符。</p><p>c) 将得到的源代码片段作为解释器的输入，检查所有的异常和崩溃。</p><h2 id="三、实验结果" tabindex="-1"><a class="header-anchor" href="#三、实验结果" aria-hidden="true">#</a> <strong>三、实验结果</strong></h2><p>本文的Evaluation部分比较丰富，主要包括四个方面：</p><ol><li>和jsfunfuzz进行比较</li></ol><figure><img src="'+s+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>实验结果说明LangFuzz和jsfunfuzz都可以发现对方无法触发的漏洞，证明两种工具是互补的。虽然LangFuzz的有效性只有jsfunfuzz的一半，但考虑到jsfunfuzz是特定于JavaScript实现的，而LangFuzz是多语言通用，实验结果还是可以接受的。</p><ol start="2"><li>比较两种产生input策略的有效性</li></ol><figure><img src="'+o+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>实验结果说明两种产生输入数据的策略均可发现对方无法触发的漏洞，证明两种策略都有其存在的意义，但具体应该以什么样的比例来结合使用两种策略还需要进一步调试，不在文章研究范围内。</p><ol start="3"><li>在真实系统上进行测试</li></ol><figure><img src="'+g+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>在Mozilla和Google浏览器上进行了测试，发现了164个软件缺陷，其中31个被确认为是安全性相关的。共获得了漏洞安全奖励50,000美金。</p><ol start="4"><li>在其他语言上实现LangFuzz</li></ol><p>作者在PHP上实现了LangFuzz并进行测试，证明了其在其他语言上的适用性。</p><h2 id="四、总结与评价" tabindex="-1"><a class="header-anchor" href="#四、总结与评价" aria-hidden="true">#</a> <strong>四、总结与评价</strong></h2><p>本文是发表在2012年的工作，针对Fuzzing技术在解释器这一特殊场景上的应用进行研究，实现了一个适用于各种语言的测试框架，发现了一些真实场景下的系统漏洞，实验结果比较容易得到认可。</p><p>框架模块设计比较清晰，实现上的难度不是十分复杂，第一步中输入的样例代码数量和种类直接影响到产生的测试输入的质量，从而会影响到测试的结果。所以它需要大量的样例代码和测试代码才能保证比较好的实验结果。从方法上来讲，本文的框架是适用于不同的语言的，但是对于静态类型语言，实验效果是比较差的，因为代码数据类型等检查是在编译期间进行的，增加了触发异常的难度。</p><p>总体而言，本文以一种更通用的，开销更低的方式解决了之前没有解决好的问题，采取的解决方案有一定的创新性。本文的工作仅仅考虑了输入的一次性产生，没有尝试利用代码执行的反馈结果对输入进行调整，这也是之后工作改进可以考虑的方向。</p>',34),c=[l];function z(u,f){return i(),t("div",null,c)}const _=a(p,[["render",z],["__file","22-白泽带你读论文丨Fuzzing with Code Fragments.html.vue"]]);export{_ as default};
