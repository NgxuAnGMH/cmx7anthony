import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as u,c as z,a as e,b as r,e as i,d as s}from"./app-cdabc73c.js";const o="/assets/640-1691462987160-27-0587cc3f.png",c="/assets/640-1691462987160-28-8f6da08b.png",f="/assets/640-1691462987161-29-2175b845.png",p="/assets/640-1691462987161-30-6cf46740.png",l="/assets/640-1691462987161-31-9ba32515.png",d="/assets/640-1691462987161-32-df85ab40.png",g={},_=e("h1",{id:"_49-白泽带你读论文丨fuzzgen-automatic-fuzzer-generation",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_49-白泽带你读论文丨fuzzgen-automatic-fuzzer-generation","aria-hidden":"true"},"#"),r(" 49-白泽带你读论文丨FuzzGen: Automatic Fuzzer Generation")],-1),h=e("p",null,[e("strong",null,"FuzzGen: Automatic Fuzzer Generation")],-1),b=e("p",null,"论文链接：",-1),m={href:"https://www.usenix.org/system/files/sec20fall_ispoglou_prepub.pdf",target:"_blank",rel:"noopener noreferrer"},A=s('<p>本文发表在USENIX Security 2020，第一作者是来自谷歌的Kyriakos K. Ispoglou。</p><h2 id="_1-主要内容" tabindex="-1"><a class="header-anchor" href="#_1-主要内容" aria-hidden="true">#</a> <strong>1. 主要内容</strong></h2><p>Fuzzing技术是发现软件中未知漏洞的一种有效手段。现有技术大多针对于<em>program</em> fuzzing，并不能直接应用于<em>library</em> fuzzing，其原因一方面<u>library本身并不能单独运行</u>，需要其它程序调用，没有一个比较合适的入口点；另一方面，library通常会暴露一个或多个API，<u>但是它们间依赖关系（如先后的调用顺序）一般只会在文档中写出</u>，对于fuzzing来说这就需要人工分析来针对这些接口写一些针对性的fuzz模板。</p><p>现有的针对library fuzzing的工具<mark>LibFuzzer</mark>就是借助了人工的帮助来实现了library fuzzing。它需要分析人员针对library的特定组件编写一个fuzzer stub，在其中声明必要状态的构建和正确的API调用顺序。但是很显然这种高度依赖人工的方式很难自动扩展到不同的library。</p><p>因此，本文就提出了FuzzGen，它通过分析library的API和使用这些library的consumer程序得到API间的依赖关系，从而自动化地构建出fuzzer stub。实验表明，Libfuzzer通过FuzzGen的增强，一方面可以实现了更高地代码覆盖率，同时避免了对人工的依赖。作者在Debian和AOSP上选择了7个library做了测试，总共发现了17个漏洞，其中6个已经分配了CVE，并且平均的代码覆盖率达到了54.94%。</p><h2 id="_2-设计与实现" tabindex="-1"><a class="header-anchor" href="#_2-设计与实现" aria-hidden="true">#</a> <strong>2. 设计与实现</strong></h2><figure><img src="'+o+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>FuzzGen的整体框架如上图所示，它利用library的头文件和library consumer代码（系统中使用这些library的程序代码）来推断library API，构建抽象API依赖图，最终生成对应的fuzzer stub。其整体框架可以分为以下三个模块：</p><h3 id="_1-api推断" tabindex="-1"><a class="header-anchor" href="#_1-api推断" aria-hidden="true">#</a> （1）API推断</h3><p>该模块的目的是为了推断出library中的有效API用于下一步A2DG的构建。</p><p>首先他会分析目标library中的所有声明的函数，然后再分析consumer程序包含的头文件中的所有函数，二者取交集作为潜在的API函数集合。</p><p>因为可能有重名函数的存在，所以在这个方法存在过度近似的问题，即推断出来的潜在的API函数其实可能属于另一个library。这里作者通过一种渐进的类库推断方法来排除掉这些非目标library的函数，即迭代编译一个与目标库链接的测试程序来检查每个可能的API函数，如果链接失败，那么这个函数就是不是目标库的一部分。</p><h3 id="_2-a2dg-抽象api依赖图-构建" tabindex="-1"><a class="header-anchor" href="#_2-a2dg-抽象api依赖图-构建" aria-hidden="true">#</a> （2）A2DG（抽象API依赖图）构建</h3><p>A2DG用来表示API间的依赖关系，具体而言包含控制依赖关系和数据依赖关系，FuzzGen针对每一个consumer程序都会生成至少一个A2DG。</p><p>首先，针对于控制依赖的构建，FuzzGen会为每个cousumer代码生成一个控制流图，然后遍历其中的基本块，对于不包含API调用的基本块进行删除，对于包含多个API调用的基本块进行拆分，最终得到一个包含API调用顺序的基本A2DG，如下图所示。</p><figure><img src="'+c+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>然后构建数据依赖关系，对于fuzzer来说，它需要知道对于一个函数内哪些参数可以fuzz，以及如何去fuzz这些参数。这里FuzzGen会为每一个参数分配一个类型，可能的类型如下表所示。FuzzGen会对每个函数的每个参数进行一次数据流分析，如果参数被用于switch，那它就被分配一个predefined类型，如果对于参数第一次使用的场景是写操作，那么就给他分配一个output类型。作为函数内部推断的补充，FuzzerGen还为每个API调用进行一次后向切片，并为参数进行类型推断。因为分析的不准确性和consumer中可能的对library的误用，这里通过启发式的算法对相同变量分配的不同类型进行统一。</p><figure><img src="'+f+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>除了对参数进行value-set推断，fuzzer还需要知道API之间什么时候重用变量，什么时候需要在API间创建新的变量。FuzzGen先通过别名分析来来识别参数、返回值之间的依赖关系，并且利用向前向后切片来减少别名分析所带来的不精确性。然后对于A2DG的每一条边，FuzzGen都利用数据流分析来分析函数间每对参数和返回值是否存在依赖关系。</p><p>最后为了更全面地进行fuzzing，FuzzGen的输入包含多个consumer代码，这样最终就得到不止一个A2DG。因为会为每一个A2DG都生成一个fuzzer stub，这里会寻找A2DG间的公共节点进行合并，如果不存在公共节点的话，也会保留多个A2DG。</p><p>因为生成的A2DG可能会包含一些复杂的控制流和循环，这就可能导致最终生成的fuzzer stub也比较复杂。因此在生成A2DG之后，FuzzGen会对这个图进行一次flatten。具体而言，针对循环来说，会删除后向的边；对于处理后的API依赖图，会做一个宽松的拓扑排序，即在拓扑排序的每个步骤中，删除相同顺序的函数调用，并把这些相同顺序的调用设为一组，然后随机去调用这些函数组。</p><h3 id="_3-fuzzer生成" tabindex="-1"><a class="header-anchor" href="#_3-fuzzer生成" aria-hidden="true">#</a> （3）Fuzzer生成</h3><p>依据构建好的A2DG，FuzzGen会将其中所有节点转换成API调用，并根据推断的数量依赖关系来布局变量，最终生成fuzzer stub。</p><h2 id="_3-实验评估" tabindex="-1"><a class="header-anchor" href="#_3-实验评估" aria-hidden="true">#</a> <strong>3. 实验评估</strong></h2><p>作者选择了7个广泛使用的解码库作为测试用例，其中5个来自于AOSP，2个来自于Debian。而对于consumer的选择，因为作者发现工具分析过多的consumer程序可能并不会增加API的覆盖率，反而会使API的调用图变得更加复杂，因此作者通过计算程序中使用的不同API数量除以总的真实代码行数作为评判标准，选取占比最高的4个consumer代码作为测试用例。整体情况如下图所示：</p><figure><img src="'+p+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>因为fuzzing本身存在随机性，所以单次短时间内的fuzzing结果可能存在误导性，所以作者选择<em>每个fuzzer运行5次，每次运行24个小时的结果作为最终的实验依据</em>。</p><p>并且由于并没有已有的工作来做自动化的library fuzzing，作者这里选择了人工分析这个library，然后针对性地写一些fuzzer stub作为对照组。</p><h3 id="_1-针对代码覆盖率的评估" tabindex="-1"><a class="header-anchor" href="#_1-针对代码覆盖率的评估" aria-hidden="true">#</a> (1) 针对代码覆盖率的评估：</h3><p>针对代码覆盖率的测试结果如下图所示，作者对比了每个时间间隔内的自动生成的fuzzer和人工编写的fuzzer对CFG的边的覆盖情况。总体而言，自动生成fuzzer的覆盖率高6.94%左右。</p><figure><img src="'+l+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><h3 id="_2-针对效率的评估" tabindex="-1"><a class="header-anchor" href="#_2-针对效率的评估" aria-hidden="true">#</a> (2) 针对效率的评估：</h3><p>针对效率的评估如下表所示，从中可以看出FuzzGen生成的fuzzer对于不同的平台都有着不错的表现。而与人工编写的fuzzer进行对比，作者这里采用了曼-惠特尼U检验的结果来作为评估标准来综合评估代码覆盖率和发现bug的差异，从结果上来看，除了最后一个libaom，FuzzerGen生成Fuzzer效果还是不错的。</p><p>从中我们还能看出有些case人工fuzzer发现的bug数量更多，这是因为人工fuzzer更具针对性，相较于工具而言它更能发现库中某些组件中的bug。而工具实现了更多API的交互，所以实现了更好的代码覆盖率。</p><figure><img src="'+d+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><h2 id="_4-总结" tabindex="-1"><a class="header-anchor" href="#_4-总结" aria-hidden="true">#</a> <strong>4. 总结</strong></h2>',36),G=e("em",null,"作者同时也将代码进行了开源",-1),y={href:"https://github.com/HexHive/FuzzGen%E3%80%82",target:"_blank",rel:"noopener noreferrer"};function F(I,P){const a=t("ExternalLinkIcon");return u(),z("div",null,[_,h,b,e("p",null,[e("a",m,[r("https://www.usenix.org/system/files/sec20fall_ispoglou_prepub.pdf"),i(a)])]),A,e("p",null,[r("本文基于Libfuzzer提出了一种可以自动化生成fuzzer stub的方法FuzzGen，从而实现了自动化地对library进行fuzz。FuzzGen整体的实现过程主要利用了consumer程序，通过分析其中library API的交互情况和数据依赖关系，来构造特定的fuzzer stub。相较于人工编写的fuzzer stub而言，自动化生成的fuzzer能实现更好的代码覆盖率。"),G,r("，不过暂时代码还未上传，链接："),e("a",y,[r("https://github.com/HexHive/FuzzGen。"),i(a)])])])}const k=n(g,[["render",F],["__file","49-白泽带你读论文丨FuzzGen Automatic Fuzzer Generation.html.vue"]]);export{k as default};
