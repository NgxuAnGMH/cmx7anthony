import{_ as i}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as e,d as r}from"./app-cdabc73c.js";const t="/assets/640-1691485183472-282-c00f8a35.jpeg",n={},o=r('<h1 id="_13-白泽带你读论文firmalice-automatic-detection-of-bypass-vulnerabilities" tabindex="-1"><a class="header-anchor" href="#_13-白泽带你读论文firmalice-automatic-detection-of-bypass-vulnerabilities" aria-hidden="true">#</a> 13-白泽带你读论文Firmalice:Automatic Detection of Bypass Vulnerabilities</h1><p>Firmalice - Automatic Detection of Authentication Bypass Vulnerabilitiesin Binary Firmware</p><p>本文发表在<strong>NDSS 15</strong>，第一作者Yan Shoshitaishvili现任亚利桑那州立大学助理教授，本文工作是作者在加州大学圣芭芭拉分校攻读博士期间，和Ruoyu Wang等研究者共同完成。第一作者主要研究方向为二进制程序分析，是著名符号化执行引擎Angr的核心作者，同时也是知名CTF战队Shellphish的成员之一。</p><h2 id="_1-主要内容" tabindex="-1"><a class="header-anchor" href="#_1-主要内容" aria-hidden="true">#</a> 1 主要内容</h2><p>随着物联网的迅速发展，<strong>嵌入式设备</strong>的应用已经无处不在，如智能门锁，智能电表等。但最近的研究表明，市场上的许多嵌入式设备都存在<strong>认证旁路漏洞</strong>，因此对嵌入式设备中此类型漏洞进行有效的分析是十分必要的。但是由于嵌入式固件的闭源性，无法去直接分析其源代码，而且一部分固件直接运行在硬件之上，无法准确地恢复固件的运行环境。此外，一些厂商会对其产品进行加密签名，无法进行插桩等修改操作。使用符号化执行的方法又不能对复杂的固件进行分析。以上种种困难导致，目前对固件中认证旁路漏洞的检测工作大多还是人工进行的。</p><p>为了能够<strong>自动化的检测固件程序中的认证旁路漏洞</strong>，本文提出了一个<strong>二进制分析框架Firmalice</strong>，以支持对嵌入式设备上运行的固件程序进行自动化分析。Firmalice构建在符号化执行引擎上，结合了程序切片的相关技术来提高其扩展性。此外，Firmalice基于攻击者确定执行特权操作所需输入的能力，构建了一种新型的认证旁路漏洞模型。作者在三个real-world的嵌入式设备上测试了该框架，并且成功的发现了其中两个设备中存在的认证旁路漏洞。</p><h2 id="_2-设计与实现" tabindex="-1"><a class="header-anchor" href="#_2-设计与实现" aria-hidden="true">#</a> 2 设计与实现</h2><p>Firmalice识别固件中存在的认证旁路漏洞需要以下五个步骤：</p><ol><li>加载固件镜像文件。</li><li>解析人工提供的Security Policy，转换为对应的privileged program points。</li><li>静态分析固件程序，进行程序切片。</li><li>对切片程序进行符号化执行分析，获取执行特权操作的各条路径。</li><li>对各条路径上的约束求解分析，判断是否存在认证旁路漏洞。</li></ol><h3 id="_2-1-加载固件镜像" tabindex="-1"><a class="header-anchor" href="#_2-1-加载固件镜像" aria-hidden="true">#</a> 2.1 加载固件镜像</h3><p>在分析开始之前，首先要将固件镜像加载到分析系统中。这一步骤目的是为了得到一个已经加载好的，ready-to-analyze的固件的内部特征表示。</p><p>Firmware分为两种，一种是运行在一些通用的操作系统上，大部分功能是由用户空间的程序实现的，系统调用，程序入口点等定义比较规范，称之为user-space firmware，对这种固件的分析和对普通用户态程序的分析是相似的。另一种是直接运行在硬件之上的固件，不知道如何去初始化其运行状态，不清楚binary加载的偏移和执行的地址，称之为Binary-blob firmware。</p><p>首先利用现有的工作[1]对firmware进行反编译，之后的步骤在IR上进行分析，以此来支持不同类型的处理器架构。之后分析binary中Jump Table和间接跳转指令寻址之间的关系，确定一个相对最准确的程序加载基地址。最后根据binary中的函数构造一个简单的call graph，将所有非连通部分的根节点都视为可能的程序入口点。</p><h3 id="_2-2-解析安全策略" tabindex="-1"><a class="header-anchor" href="#_2-2-解析安全策略" aria-hidden="true">#</a> 2.2 解析安全策略</h3><p>Firmalice可以将规范声明的安全策略自动转换为程序可以分析的属性，根据声明的特权操作分析得到一组特权程序点。当程序执行到这些特权程序点时，说明程序已经成功执行了特权操作。</p><p>目前框架所支持的声明规范主要包括四种：</p><ol><li>Static OutPut：在没有正确授权情况下，一定不能输出的静态数据。</li><li>Behavioral Rules：在没有授权的情况下可以执行的操作。</li><li>Memory access：对内存地址（绝对地址）的直接访问。</li><li>Direct privileged program point identification：对于专业的分析员，可以直接指定相关函数为特权程序点。</li></ol><h3 id="_2-3-静态分析" tabindex="-1"><a class="header-anchor" href="#_2-3-静态分析" aria-hidden="true">#</a> 2.3 静态分析</h3><p>这一步骤是对加载好的固件程序进行静态分析，如图所示，通过构建控制流图、控制依赖图和数据依赖图，由框架根据安全策略自动转换出的特权程序点出发，直到第一步中分析得到的所有程序入口点，对程序进行后向切片。</p><figure><img src="'+t+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><h3 id="_2-4-符号化执行" tabindex="-1"><a class="header-anchor" href="#_2-4-符号化执行" aria-hidden="true">#</a> 2.4 符号化执行</h3><p>对静态分析得到的程序切片进行符号化执行分析，得到从程序入口点到特权程序点的所有执行路径，该作者是知名符号化引擎Angr的核心开发者，这里也是使用Angr进行的分析。</p><h3 id="_2-5-认证旁路漏洞检测" tabindex="-1"><a class="header-anchor" href="#_2-5-认证旁路漏洞检测" aria-hidden="true">#</a> 2.5 认证旁路漏洞检测</h3><p>符号化执行引擎可以得到多条执行到程序特权点的路径上的约束，使用z3约束求解器对每条路径的约束求解。如果可以得到有限的解，则说明攻击者可以得到一组确定的输入使得程序可以执行某些特权操作，即说明存在认证旁路漏洞。</p><h2 id="_3-评价与反思" tabindex="-1"><a class="header-anchor" href="#_3-评价与反思" aria-hidden="true">#</a> 3 评价与反思</h2><p>作者在三个real-world的嵌入式设备上测试了Firmalice，成功的在两个设备中发现了存在的认证旁路漏洞，另外一个设备由于程序认证逻辑的比较复杂，未能成功检测出漏洞。</p><p>本文提出了一个新颖的认证旁路漏洞模型，通过程序切片技术将程序分析的目标缩小到认证逻辑相关的范围，使得可以对轻量级的切片程序进行符号化执行分析，解决了符号化执行无法分析复杂程序的问题。而且Firmalice提高了在检测固件认证旁路漏洞的自动化程度，减少了大量的人力工作。</p><p>但是Firmalice无法分析复杂的、混淆处理过的固件，这也是所有基于静态分析和符号化执行的工具所面临的问题。此外，Firmalice所能覆盖的认证旁路漏洞类型也比较有限，比如一些math-based认证旁路漏洞，由于约束可以求解出无穷个解，会被工具认为并不存在认证漏洞。通过在程序静态分析技术、符号化执行技术和约束求解器这几个方面进行技术升级，应该可以一定程度上提高Firmalice的适用面和准确度。</p><p><strong>参考文献</strong></p><p>[1] LLVM: A compilation framework for life long program analysis &amp; transformation. In Proceedings of the International Symposium on Code Generation and Optimization(CGO), pages 75-86.IEEE, 2004.</p>',30),l=[o];function s(c,h){return a(),e("div",null,l)}const m=i(n,[["render",s],["__file","13-白泽带你读论文FirmaliceAutomatic Detection of Bypass Vulnerabilities.html.vue"]]);export{m as default};
