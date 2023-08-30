import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r,o as c,c as o,a as e,b as a,e as n,d as s}from"./app-cdabc73c.js";const p="/assets/640-1691478513145-81-ee7175a7.png",l="/assets/640-1691478513145-82-9b0d5e6b.png",h="/assets/640-1691478513145-83-c302c970.png",d="/assets/640-1691478513145-84-947f2182.png",g={},u=e("h1",{id:"_27-白泽带你读论文丨precisely-characterizing-security-impact-in-a-flood-of",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_27-白泽带你读论文丨precisely-characterizing-security-impact-in-a-flood-of","aria-hidden":"true"},"#"),a(" 27-白泽带你读论文丨Precisely Characterizing Security Impact in a Flood of")],-1),_=e("p",null,[e("strong",null,"Precisely Characterizing Security Impact in a Flood of Patches via Symbolic Rule Comparison")],-1),m={href:"https://www.ndss-symposium.org/wp-content/uploads/2020/02/24419.pdf",target:"_blank",rel:"noopener noreferrer"},f=s('<p>本文发表在NDSS 2020，第一作者是来自明尼苏达大学的博士生Qiushi Wu。</p><h2 id="_1-主要内容" tabindex="-1"><a class="header-anchor" href="#_1-主要内容" aria-hidden="true">#</a> <strong>1 主要内容</strong></h2><p>软件维护商通常会接收到大量的bug报告，对该类报告的审核与响应占据了大量的时间与成本。碍于人力所限，软件维护商不能够对所有的bug完成立即响应，因此必须要<em>对bug的危害性进行评估</em>来分配修复优先级。目前来说，对于bug危害性的鉴别是由人工完成的，这当中就不可避免的存在错误和遗漏，因此本文希望可以自动化地从大量patch中<em>自动鉴别具有安全隐患的高危bug</em>。</p><p>在确定bug威胁性上，现有工作可分为以下三类：</p><ul><li>（1）利用bug报告进行文本分析</li><li>（2）代码静态分析</li><li>（3）漏洞挖掘工具如fuzzing工具等。</li></ul><p>以上方法都存在明显的缺陷。</p><p>本文在假设patch成功修复了某种安全问题的的情况下，提出了一种更加快速、轻量、准确（更少误报）的方法并实现了工具SID。具体来说，本文聚焦于patch代码与源代码之间的安全性区别，通过对patch的建模标定其中的关键部分并利用约束不足的符号执行（under-constrained symbolic execution）来进行安全性分析，再与源代码的安全性分析进行对比，从而推断出源代码中的安全隐患。</p><p>最终，作者在实验中找到了 227个Linux kernel漏洞，21个漏洞在Android系统中仍未得到修复，并获得了24个新的CVE。</p><h2 id="_2-设计与实现" tabindex="-1"><a class="header-anchor" href="#_2-设计与实现" aria-hidden="true">#</a> <strong>2 设计与实现</strong></h2><figure><img src="'+p+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>SID的整体工作流程如上图所示，具体来说可以分成以下三个阶段：</p><h3 id="a-pre-processing" tabindex="-1"><a class="header-anchor" href="#a-pre-processing" aria-hidden="true">#</a> a) Pre-processing</h3><p>这部分的工作比较单纯，从git上拿到patch代码与原代码，并使用静态的数据流分析获取依赖文件并将这些代码编译成<mark>LLVM的中间语言文件</mark>。在依赖文件的获取中，文章提到了使用静态数据流分析进行前向和后向的追踪导入，但是他们发现大部分的所依赖代码都存在于同一个文件当中，故大部分情况下拿到patch所在的一个文件即可。这其中可以看出文章对于代码的分析是局限在比较短的代码中的，至于同文件的跨函数问题也未作说明，这里很有可能存在trick。</p><h3 id="b-dissecting-patches" tabindex="-1"><a class="header-anchor" href="#b-dissecting-patches" aria-hidden="true">#</a> b) Dissecting patches</h3><p>这个阶段则是对patch代码与原代码利用代码匹配、静态分析与符号执行来进行分析的过程，首先，本文对patch建模如下：</p><figure><img src="'+l+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>一个Patch中存在安全操作、关键变量、危险操作三个部分，首先文章通过对四种安全问题进行总结，得出四种常用安全操作，再对四种安全操作总结出下列常见模式，最后进行代码匹配获取patch中的安全操作。</p><figure><img src="'+h+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>接下来标定安全操作中涉及的变量对关键变量，之后进行数据流分析，找到对于关键变量进行的危险操作，并得到从安全操作到危险操作的一对对路径。对于原代码来说，方法是类似的，只是原代码不存在安全操作，因此我们继承从patch中得到的关键变量来进行分析即可。</p><h3 id="c-symbolic-rules-comparison" tabindex="-1"><a class="header-anchor" href="#c-symbolic-rules-comparison" aria-hidden="true">#</a> c) Symbolic rules comparison</h3><p>这一阶段是本文工作的核心，在这一阶段，我们需要分别证明patch代码无论如何不会违反某一条安全规则、原代码在patch所阻止的所有情况下都会违反某一条安全规则这两个命题。</p><p>证明的关键在于对于patch代码与原代码构造不同的约束来进行求解。对于patch代码来说，我们构造的约束包含以下三部分：</p><ol><li>安全操作中约束</li><li>从安全操作到危险操作的路径上的约束</li><li>能够代表违反了某条安全规则的约束</li></ol><p>接着对这三组约束进行求解，如果无解，那么证明在安全操作的约束下，patch代码无论如何不会违反某一条安全规则。</p><p>对于原代码来说，类似的，我们同样构造三部分约束：</p><ol><li>与安全操作中相反的约束</li><li>从安全操作到危险操作的路径上的约束</li><li>能够代表满足某条安全规则约束</li></ol><p>同样的，对三组约束进行求解，如果无解，那么证明在安全操作所阻止的全部情况下，原代码都无法满足安全规则，即一定会违背安全规则。那么两相对比，我们就可以确定，原代码必然存在安全隐患。</p><p>最后，对于构造安全规则的约束，实际上由于针对的安全问题类型仅有四种，因此也并不复杂，针对权限检查、初始化、no use after free这三种情况，约束被构造为一个标志位，代表着是否完成了检查，针对越界访问，约束稍加复杂，变成了边界值的判断。</p><figure><img src="'+d+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><h2 id="_3-实验评估" tabindex="-1"><a class="header-anchor" href="#_3-实验评估" aria-hidden="true">#</a> <strong>3 实验评估</strong></h2><p>本文实验从66K个git commits中获取了54,651个patch进行分析，在这当中找到了227个安全bug，在这227个bug当中，存在8个误报，可以说实现了作者对于工具减少误报的初始定位。对于误报的分析，作者认为问题主要有两点：</p><ol><li><em>静态分析不准确。</em></li></ol><p>由于文章所用的方法是比较native的方法，因此导致路径的寻找、危险操作的寻找不准确。</p><ol start="2"><li><em>Patch中的约束抓取不准确。</em></li></ol><p>同样，文章对于安全操作的寻找仅仅局限于几种简单的模式，然而patch中对于关键变量的约束形式可能是复杂的，因此存在从安全操作中实际上不能简单的导出约束的情况。</p><p>除此之外，漏报也是一个很大的问题，文章为了量化漏报的情况，从最近的确切的具有安全问题的修复补丁中挑出100个进行验证，结果SID仅仅报出了其中的47个。针对漏报， 作者总结了两个原因：</p><ol><li><em>保守的符号执行策略。</em></li></ol><p>为了最大程度的减少误报，工具实际上采用了保守的符号执行策略，在对原代码的安全性验证中，采用了证明“补丁阻止的所有情况下都无法满足安全规则”而不是“补丁阻止的情况下可能违反安全规则”，这导致了漏报。</p><ol start="2"><li><em>安全操作、漏洞操作定义的覆盖率不足。</em></li></ol><p>由于做法上过多的rule-based，作者对于四种安全问题的研究集中在自己定义的简单的模式上，这导致了没有办法很好的cover实际的情况，导致了大量漏报。</p><h2 id="_4-总结评价" tabindex="-1"><a class="header-anchor" href="#_4-总结评价" aria-hidden="true">#</a> <strong>4 总结评价</strong></h2><p>本文的核心思想我认为还是比较巧妙的，通过对比原代码与补丁代码的差异来确定原代码的问题，由于补丁代码实际上包含了补丁作者对于原代码问题的修复的信息，因此这个做法效果上应该是有保障的，而且由于通过补丁我们可以把目光聚焦于一下段代码而不是整个软件系统，这极大地降低了工具开销。</p><p>但是，工具的实现方法非常的native，采用了大量的rule，主要就是通过自己总结常规模式来进行匹配，且诸如覆盖率、跨函数等问题实则有些语焉不详，因此给人感觉比较tricky。总的来说方法比较巧妙，也比较具有扩展性，但实现还是过于弱了一点，对于安全操作、危险操作的标定在覆盖率上的问题尤其严重。</p>',43);function b(y,x){const i=r("ExternalLinkIcon");return c(),o("div",null,[u,_,e("p",null,[a("原文链接："),e("a",m,[a("https://www.ndss-symposium.org/wp-content/uploads/2020/02/24419.pdf"),n(i)])]),f])}const k=t(g,[["render",b],["__file","27-白泽带你读论文丨Precisely Characterizing Security Impact in a Flood of.html.vue"]]);export{k as default};
