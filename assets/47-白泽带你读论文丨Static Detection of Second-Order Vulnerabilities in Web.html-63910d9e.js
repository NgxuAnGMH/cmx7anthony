import{_ as r}from"./plugin-vue_export-helper-c27b6911.js";import{r as s,o as t,c as n,a as e,b as a,e as o,d}from"./app-cdabc73c.js";const c="/assets/640-1691464045899-72-3abe578b.png",h="/assets/640-1691464045900-73-49fd284f.png",p="/assets/640-1691464045900-74-5485f40c.png",l="/assets/640-1691464045900-75-1da4011f.png",_="/assets/640-1691464045900-76-8cd2676b.png",f={},u=e("h1",{id:"_47-白泽带你读论文丨static-detection-of-second-order-vulnerabilities-in-web",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_47-白泽带你读论文丨static-detection-of-second-order-vulnerabilities-in-web","aria-hidden":"true"},"#"),a(" 47-白泽带你读论文丨Static Detection of Second-Order Vulnerabilities in Web")],-1),g=e("p",null,[e("strong",null,"Static Detection of Second-Order Vulnerabilities in Web Applications")],-1),S=e("p",null,"论文链接：",-1),b={href:"https://www.usenix.org/system/files/conference/usenixsecurity14/sec14-paper-dahse.pdf",target:"_blank",rel:"noopener noreferrer"},m=d('<p>本文发表在Usenix Security Symposium (USENIX 2014)，作者是来自Ruhr-University Bochum的Johannes Dahse和Thorsten Holz。</p><h2 id="_1-主要内容" tabindex="-1"><a class="header-anchor" href="#_1-主要内容" aria-hidden="true">#</a> 1 主要内容</h2><p>这篇文章中提到的静态分析工具RIPS是由这两位作者于2010年发布的开源软件，该软件的商业版本仍然在持续更新，检测范围也由PHP扩展到了Java和Node.js，是一款非常优秀的静态检测软件。</p><p>本文中，作者扩展了RIPS能够检测的漏洞类型，提出了对web应用中二次攻击漏洞的检测策略。相比于单次攻击漏洞，二次攻击漏洞的定义如下：攻击者首先会将payload保存在Persistent Data Stores（PDS，即web应用中持久性存储数据的位置）中，随后访问保存在PDS中的payload，形成一次攻击。本文中讨论的PDS为数据库、SESSION以及文件名。</p><p>作者将php中的数据库、SESSION以及文件名的读写操作进行建模，将PDS写操作与PDS读取操作对应，使得对PDS的后向数据流分析和污点分析可以成功进行。最后作者还在6个真实web应用中进行了测试。</p><h2 id="_2-设计与实现" tabindex="-1"><a class="header-anchor" href="#_2-设计与实现" aria-hidden="true">#</a> 2 设计与实现</h2><p>对二次攻击漏洞的检测主要难点在于数据进入PDS，之后又从PDS中取出时会丢失存取数据的对应关系，导致无法进行数据流分析。因此作者在这篇文章中主要解决的就是两个问题。一是如何建模php中的PDS操作数据流；二是如何将PDS写操作与访问操作一一对应。</p><h3 id="_2-1-数组操作建模" tabindex="-1"><a class="header-anchor" href="#_2-1-数组操作建模" aria-hidden="true">#</a> <strong>2.1 数组操作建模</strong></h3><p>对内置函数implode进行建模，将该函数指定的分隔符抽象为新的符号ArrayJoin，从而可以从一个由拼接得到的字符串中还原出原始数据。将( <code>$array as $key =&gt; $value</code>)中的key抽象为ArrayKey。以上两种抽象可以提高对session数组的分析精度。</p><h3 id="_2-2-pds过程内数据流建模" tabindex="-1"><a class="header-anchor" href="#_2-2-pds过程内数据流建模" aria-hidden="true">#</a> <strong>2.2 PDS过程内数据流建模</strong></h3><figure><img src="'+c+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>在数据流分析过程中，作者将从PDS中读取的数据建模为δ∗ 符号，将有可能受到污染的PDS写入数据抽象为δ符号。如图b和图c所示。如果δ∗代表的数据未经净化就进入到sink点，并且其对应的δ符号代表的数据受控于用户，就认为找到一个second order漏洞。针对三种不同的PDS，作者分别进行分析</p><h4 id="_2-2-1-数据库" tabindex="-1"><a class="header-anchor" href="#_2-2-1-数据库" aria-hidden="true">#</a> 2.2.1 数据库</h4><ol><li>准备阶段</li></ol><p>提取应用中以.SQL结尾的数据库备份文件，从所有create table语句中抽取表信息。同时全局扫描php代码，从中抽取SQL操作，尽可能还原整个数据库表结构。</p><ol start="2"><li>写操作建模</li></ol><p>从含有insert update以及replace的SQL语句中提取所影响的数据表名，列名以及对应的数据符号，保存在summary中。</p><ol start="3"><li>读操作建模</li></ol><p>从含有select的SQL语句中提取表名，列名。别名也会在这一步进行还原。通过select语句查找到的数据会被赋予新的符号ResourceDB并保存在summary中。</p><ol start="4"><li>访问操作建模</li></ol><p>php通过内置的fetch函数，将读取的SQL语句返回值保存在一个数组中。当一个Arraydimfetch符号访问fetch函数的返回结果时，该Arraydimfetch就会转换为ResourceDB符号。在这种情况下同时根据ResourceDB符号中可用的列名给Arraydimfetch的key赋值。说明访问的是哪个表的哪个列。并将结果保存于summary中</p><ol start="5"><li>净化函数建模</li></ol><p>除了php内置的净化函数（如addslashes、mysql_escape_string等）外，作者还讨论了SQL语句的隐式净化。即若数据在存入数据库中时进行了隐式的类型转换，则认为该数据经过净化。对经过净化的数据会打上Sanitization标签。</p><h4 id="_2-2-2-session" tabindex="-1"><a class="header-anchor" href="#_2-2-2-session" aria-hidden="true">#</a> 2.2.2 Session</h4><p>1）写操作建模</p><p>Session在php中以全局数组的形式保存，因此对session的建模与普通全局数组一致，使用Arraydimfetch符号对session数组的写入进行记录</p><p>2）读、访问操作建模</p><p>使用Arraydimfetch符号对session数组的读取与访问进行记录。</p><p>3）净化函数建模</p><p>对内置字符串净化函数进行建模，如md5等，seseion值传入这些函数则认为经过一次净化。</p><h4 id="_2-2-3-文件名" tabindex="-1"><a class="header-anchor" href="#_2-2-3-文件名" aria-hidden="true">#</a> 2.2.3 文件名</h4><ol><li>写操作建模</li></ol><p>作者对27个php内置函数进行建模，通过字符串匹配的方式，获取传入的路径名，如果某个路径名可控，则该路径的前缀名标记为taintable。此外，如果source点没有经过针对路径遍历漏洞的净化，则从该source点出发的所有路径名标记为tainable</p><ol start="2"><li>读操作建模</li></ol><p>对php中读目录函数scandir、opendir以及glob建模。返回值赋予新的符号ResourceDir并记录传入函数的路径名。</p><ol start="3"><li>访问操作建模</li></ol><p>内置函数readdir返回的数组具有任意的维度值和以及对应的路径名。通过这个函数读取到的条目如果是一个ResourceDir符号，则认为是对文件名的一次访问。</p><ol start="4"><li>净化函数建模</li></ol><p>对内置净化函数如file_exists、is_file建模。</p><h3 id="_2-3-pds过程间数据流建模" tabindex="-1"><a class="header-anchor" href="#_2-3-pds过程间数据流建模" aria-hidden="true">#</a> <strong>2.3 PDS过程间数据流建模</strong></h3><p>作者在PDS过程间数据流建模过程中，主要解决以下两个问题</p><h4 id="_2-3-1-多参数追踪" tabindex="-1"><a class="header-anchor" href="#_2-3-1-多参数追踪" aria-hidden="true">#</a> 2.3.1 多参数追踪</h4><p>web应用开发者常常会将对PDS的访问封装为新的函数，导致一个sink点会接受多个参数。在后向数据流分析的时候，以往的做法是对参数分别追踪，单独保存，这样就有可能丢失另一个参数的数据内容。因此作者在这里为多个参数分配了一个新的符号ValueConcat，在function summary中同时保存这些参数的数据流分析结果。</p><h4 id="_2-3-2-返回值映射" tabindex="-1"><a class="header-anchor" href="#_2-3-2-返回值映射" aria-hidden="true">#</a> 2.3.2 返回值映射</h4><p>由于RIPS使用函数摘要保存每个函数的返回值。但是用户定义的函数可能会为每个调用返回具有不同属性的对象。比如一个select查询将用户定义的函数的参数嵌入到表名中，根据函数的参数，返回不同的ResourceDB符号。为了解决这个问题，作者在函数摘要的返回值中添加一个空的ResourceDB符号用于保存用户定义函数中动态SQL查询的返回结果。每次调用了该函数，在符号中添加一条新的返回结果。</p><h2 id="_3-实验评估" tabindex="-1"><a class="header-anchor" href="#_3-实验评估" aria-hidden="true">#</a> 3 实验评估</h2><p>为了说明使用PDS的普遍性以及二次攻击的危害，作者对当时流行的6个web应用中使用PDS的情况进行了调研。在初始化阶段，作者成功恢复了所有测试应用程序的数据库表结构。这说明重构数据库结构是切实可行的。同时使用人工分析的方法寻找这6个软件中的污染路径作为ground truth。</p><h3 id="_3-1-数据库操作中的二次漏洞" tabindex="-1"><a class="header-anchor" href="#_3-1-数据库操作中的二次漏洞" aria-hidden="true">#</a> <strong>3.1 数据库操作中的二次漏洞</strong></h3><p>共计184个可污染路径，预测正确率为70%。</p><figure><img src="'+h+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><h3 id="_3-2-session读写操作中的二次漏洞" tabindex="-1"><a class="header-anchor" href="#_3-2-session读写操作中的二次漏洞" aria-hidden="true">#</a> <strong>3.2 session读写操作中的二次漏洞</strong></h3><p>共计52个session key中有12%的key可污染，预测正确率为83%。</p><figure><img src="'+p+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><h3 id="_3-3-文件名读写操作中的二次漏洞" tabindex="-1"><a class="header-anchor" href="#_3-3-文件名读写操作中的二次漏洞" aria-hidden="true">#</a> <strong>3.3 文件名读写操作中的二次漏洞</strong></h3><p>共计8个路径名中，63%可污染，预测正确率为100%</p><figure><img src="'+l+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><h3 id="_3-4-时间开销" tabindex="-1"><a class="header-anchor" href="#_3-4-时间开销" aria-hidden="true">#</a> <strong>3.4 时间开销</strong></h3><p>评估了添加二次攻击检测机制对RIPS工具效率的影响，最后发现无论是时间还是空间上的开销都差别不大。</p><figure><img src="'+_+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><h2 id="_4-总结" tabindex="-1"><a class="header-anchor" href="#_4-总结" aria-hidden="true">#</a> 4 总结</h2><p>这是第一篇通过静态分析方法对web应用中二次攻击漏洞进行检测的文章，作者在文中详细讨论了对二次攻击的分析与建模过程，并在真实软件中取得了不错的效果。</p><p>未来的改进方向主要为提高净化函数建模精确度，减少误报率，以及更加精确的PDS操作函数建模提高预测正确率。</p>',62);function x(y,D){const i=s("ExternalLinkIcon");return t(),n("div",null,[u,g,S,e("p",null,[e("a",b,[a("https://www.usenix.org/system/files/conference/usenixsecurity14/sec14-paper-dahse.pdf"),o(i)])]),m])}const k=r(f,[["render",x],["__file","47-白泽带你读论文丨Static Detection of Second-Order Vulnerabilities in Web.html.vue"]]);export{k as default};
