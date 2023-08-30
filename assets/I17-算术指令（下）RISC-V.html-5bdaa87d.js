import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{r as n,o as r,c as d,a as i,b as a,e as l,d as t}from"./app-cdabc73c.js";const c="/assets/9fa8f30d6acbe99195857b5412cab385-49a47a40.jpg",p="/assets/cf81a2914a7d4a04abb5f33b886a53bf-51929e30.jpg",g="/assets/26b174f2983d6fcb3f1bee6a2a1513ba-e57e6fb8.jpg",o="/assets/d8923c72b17aa6653ef814ba9a9a4a07-91fbce08.jpg",m="/assets/5e5ce8070d974bf0e52e754d79007d0a-41c19b2d.jpg",b="/assets/e61ddf5e843338ea343fa574cf1164cc-78af7860.jpg",f="/assets/5f8a306758312ded463bb189338db7c0-bffa5bb7.jpg",v="/assets/5757744ae7ef2f103052bdd73c4fee2d-b98ddb5d.jpg",u="/assets/c1526857c0858d8a3aaa677a9f0c2218-6da07071.jpg",x="/assets/14b11e93584c57fdd1ff280963fe8fc1-73bd2458.jpg",_="/assets/5f7f46c2d0bfb3606fb3688ba0a2df2d-b5845c2f.jpg",h="/assets/7715a7a17fb10ce1b92f927af3df6050-e7a953e4.jpg",j="/assets/e88bced6c98efd0fc41c012da6581b14-b8045aa1.jpg",y="/assets/a26bb58d2d217a803ee0cd37dbfa950c-59a6b1fe.jpg",z="/assets/f2a7d01e3f94fyyf939a2890e0925e05-5e6ea50d.jpg",C="/assets/31d86b306ec670c9b13ce51a8f898f93-5fb6898b.jpg",S="/assets/7a38a717cfce6c6a07afdeae71b44e4f-cb65e474.jpg",V="/assets/14ce5c27f3821d280a89473f1be2f881-f1529eb7.jpg",I="/assets/54b331abb31b9c670501801d9b1a4196-9abfbe8f.jpg",P="/assets/fd743ff7bc5a08326a930117a312e9e6-be747f32.jpg",U="/assets/dcd32534bbb191edea2863106173fc40-71ece8fb.jpg",k="/assets/efabf037545b87932a801fd0d0f52b96-194bf173.jpg",R="/assets/5a31254538411e323fde6aa4a9a8189c-dc6586aa.jpg",F="/assets/54e7a1bfa5d16657c44006a2145fa12e-c5b4378b.jpg",N="/assets/c93920be7759af658c978a26327e756f-248e7ecf.jpg",B="/assets/03e4500cb8544ab75f8634094f7b67b7-a589a5fd.jpg",E="/assets/9aa7f0f2aa4a9abaf23ed0d592d6aa2b-70d8ceec.jpg",L="/assets/90f4c5995f6bbcbca6cee49e4ebyy6b8-b9fa5269.jpg",q="/assets/35de77c0e524003a44025e2be12cb31d-f288c5bb.jpg",G="/assets/d885d37ca6d113bdb94f9bdb2edf1318-f7650594.jpg",M="/assets/fc286f7194da0c7d3f8e70b56488fa22-6e342936.jpg",O="/assets/2684dc87df76536ffce7868f50e42dfd-4f2c1c6c.jpg",T="/assets/2112acb08732cbbd227b777407a5b262-55bd252d.jpg",w="/assets/0463e88de6e311593bbc497eb8779bf3-f62ceca8.jpg",A={},D=i("h1",{id:"_17-risc-v指令精讲-二-算术指令实现与调试",tabindex:"-1"},[i("a",{class:"header-anchor",href:"#_17-risc-v指令精讲-二-算术指令实现与调试","aria-hidden":"true"},"#"),a(" 17｜RISC-V指令精讲（二）：算术指令实现与调试")],-1),H=i("p",null,"你好，我是 LMOS。",-1),J=i("p",null,"上节课，我们学习了算术指令中的加减指令和比较指令。不过一个 CPU 只能实现这两类指令还不够。如果你学过 C 语言，应该对“<<、>>、&、|、!”这些运算符并不陌生，这些运算符都需要 CPU 提供逻辑和移位指令才可以实现。",-1),K={href:"https://gitee.com/lmos/Geek-time-computer-foundation/tree/master/lesson16~17",target:"_blank",rel:"noopener noreferrer"},Q=t(`<h2 id="逻辑指令" tabindex="-1"><a class="header-anchor" href="#逻辑指令" aria-hidden="true">#</a> 逻辑指令</h2><p>从 CPU 芯片电路角度来看，其实 CPU 更擅长执行逻辑操作，如与、或、异或。至于为什么，你可以看看 CPU 的基础门电路。</p><p>RISC-V 指令集中包含了三种逻辑指令，这些指令又分为立即数版本和寄存器版本，分别是 andi、and、ori、or、xori、xor 这六条指令。我们学习这些指令的方法和上节课类似，也涉及到写代码验证调试的部分。</p><h3 id="按位与操作-andi、and-指令" tabindex="-1"><a class="header-anchor" href="#按位与操作-andi、and-指令" aria-hidden="true">#</a> 按位与操作：andi、and 指令</h3><p>首先我们来学习一下 andi、and 指令，它们的形式如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>andi rd，rs1，imm
#andi 立即数按位与指令
#rd 目标寄存器
#rs1 源寄存器1
#imm 立即数
and rd，rs1，rs2
#and 寄存器按位与指令
#rd 目标寄存器
#rs1 源寄存器1
#rs2 源寄存器2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中 rd、rs1、rs2 可以是任何通用寄存器，imm 是立即数。</p><p>andi、and 这两个指令完成的操作，我们用伪代码描述如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//andi
rd = rs1 &amp; imm
//and
rd = rs1 &amp; rs2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>按位与的操作，就是把 rs1 与 imm 或者 rs1 与 rs2 其中的每个数据位两两相与。两个位都是 1，结果为 1，否则结果为 0。</p><p>下面我们在工程目录下建立一个 and.S 文件，写代码验证一下这两个指令，如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.globl andi_ins
andi_ins:
    andi a0，a0，0xff       #a0 = a0&amp;0xff，a0是C语言调用者传递的参数，a0也是返回值，这样计算结果就返回了
    jr ra                   #函数返回

.globl and_ins
and_ins:
    and a0，a0，a1          #a0 = a0&amp;a1，a0、a1是C语言调用者传递的参数，a0是返回值，这样计算结果就返回了
    jr ra                   #函数返回
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们已经写好了 andi_ins 与 and_ins 函数，分别去执行 andi 和 and 指令。</p><p>andi 指令是拿 a0 寄存器和立即数 0xff 进行与操作。由于立即数是 0xff，所以总是返回 a0 的低 8 位数据；and 指令则是拿 a0 和 a1 寄存器进行与操作，再把结果写入到 a0 寄存器。</p><p>下面我们用 VSCode 打开工程按下“F5”调试一下，如下所示：</p><figure><img src="`+c+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图中是执行完 andi a0，a0，0xff 指令之后，执行 jr ra 指令之前的状态。可以看到，a0 寄存器中的值确实已经变成 2 了，这说明运算的结果是符合预期的。</p><p>andi_ins 函数返回后，输出的结果如下图所示：</p><figure><img src="'+p+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>因为 2 的二进制数据是（0b00000000000000000000000000000010）与上 0xff 的二进制数据是（0b00000000000000000000000011111111）结果确实是 2，所以返回 2，结果是正确的。</p><p>接下来，我们对 and_ins 函数进行调试。</p><figure><img src="'+g+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图展示的是执行完 and a0，a0，a1 指令之后，执行 jr ra 指令之前的状态。我们看到 a0 寄存器中的值已经变成了 1，这说明运算的结果是正确的。</p><p>and_ins 函数返回后，输出的结果如下图所示：</p><figure><img src="'+o+`" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图中因为 1 的二进制数据是（0b00000000000000000000000000000001）与上 1 的二进制数据是（0b00000000000000000000000000000001）确实是 1，所以返回 1，结果完全正确。</p><h3 id="按位或操作-ori、or-指令" tabindex="-1"><a class="header-anchor" href="#按位或操作-ori、or-指令" aria-hidden="true">#</a> 按位或操作：ori、or 指令</h3><p>按位与操作说完了，我们接着来学习一下或指令 ori、or，它们的形式如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ori rd，rs1，imm
#ori 立即数按位或指令
#rd 目标寄存器
#rs1 源寄存器1
#imm 立即数
or rd，rs1，rs2
#or 寄存器按位或指令
#rd 目标寄存器
#rs1 源寄存器1
#rs2 源寄存器2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样地，上述代码中 rd、rs1、rs2 可以是任何通用寄存器，imm 表示立即数。</p><p>我们还是从伪代码的描述入手，看看 ori、or 完成的操作。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//ori
rd = rs1 | imm
//or
rd = rs1 | rs2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>按位或的操作就是把 rs1 与 imm 或者 rs1 与 rs2 其中的每个数据位两两相或，两个位有一位为 1，结果为 1，否则结果为 0。</p><p>我们在 and.S 文件中写写代码，做个验证，如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.globl ori_ins
ori_ins:
    ori a0，a0，0           #a0 = a0|0，a0是C语言调用者传递的参数，a0也是返回值，这样计算结果就返回了
    jr ra                   #函数返回

.globl or_ins
or_ins:
    or a0，a0，a1           #a0 = a0|a1，a0、a1是C语言调用者传递的参数，a0是返回值，这样计算结果就返回了
    jr ra                   #函数返回
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中 ori_ins 与 or_ins 函数，分别执行了 ori 和 or 指令。</p><p>ori 指令是拿 a0 寄存器和立即数 0 进行或操作，由于立即数是 0，所以总是返回 a0 原本的数据；or 指令是拿 a0 和 a1 寄存器进行或操作，再把结果写入到 a0 寄存器。</p><p>我们还是到 VSCode 里，按下“F5”调试一下，如下所示：</p><figure><img src="`+m+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图中是执行完 ori a0，a0，0 指令之后，执行 jr ra 指令之前的状态。如果 a0 寄存器中的值确实已经变成 0xf0f0 了，就说明运算的结果正确。</p><p>ori_ins 函数返回后，输出的结果如下图所示：</p><figure><img src="'+b+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>因为 0xf0f0 的二进制数据是（0b00000000000000001111000011110000）或上 0 的二进制数据是（0b00000000000000000000000000000000）按位或操作是“有 1 为 1”，所以返回 0xf0f0，结果是正确的。</p><p>我们再用同样的方法调试一下 or_ins 函数，如下图所示：</p><figure><img src="'+f+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图展示的是执行完 or a0，a0，a1 指令之后，执行 jr ra 指令之前的状态。如果我们看到 a0 寄存器中的值确实已经变成 0x1111 了，就说明运算的结果正确，符合预期。</p><p>or_ins 函数返回后，输出的结果如下：</p><figure><img src="'+v+`" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图中 or_ins 函数第一个参数为 0x1000 的二进制数据是（0b00000000000000000001000000000000）第二个参数为 0x1111 的二进制数据是（0b00000000000000000001000100010001）两个参数相或，而按位或操作是“有 1 为 1”，所以返回 0x1111，结果是正确的。</p><h3 id="按位异或操作-xori、xor-指令" tabindex="-1"><a class="header-anchor" href="#按位异或操作-xori、xor-指令" aria-hidden="true">#</a> 按位异或操作：xori、xor 指令</h3><p>最后，我们再说说逻辑指令中的最后两条指令 xori、xor，即异或指令的立即数版本和寄存器版本，它们的形式如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>xori rd，rs1，imm
#xori 立即数按位异或指令
#rd 目标寄存器
#rs1 源寄存器1
#imm 立即数
xor rd，rs1，rs2
#xor 寄存器按位异或指令
#rd 目标寄存器
#rs1 源寄存器1
#rs2 源寄存器2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>形式上和前面与操作、或操作差不多，就不过多重复了。</p><p>xori、xor 完成的操作用伪代码描述如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//xori
rd = rs1 ^ imm
//xor
rd = rs1 ^ rs2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>按位异或的操作是把 rs1 与 imm 或者 rs1 与 rs2 其中的每个数据位两两相异或，两个位如果不相同，结果为 1。如果两个位相同，结果为 0。</p><p>在 and.S 文件中写代码验证一下，如下所示。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.globl xori_ins
xori_ins:
    xori a0，a0，0          #a0 = a0^0，a0是C语言调用者传递的参数，a0也是返回值，这样计算结果就返回了
    jr ra                   #函数返回

.globl xor_ins
xor_ins:
    xor a0，a0，a1          #a0 = a0^a1，a0、a1是C语言调用者传递的参数，a0是返回值，这样计算结果就返回了
    jr ra                   #函数返回
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们已经写好了 xori_ins 与 xor_ins 函数，分别是执行 xori 和 xor 指令。xori 指令是拿 a0 寄存器和立即数 0 进行异或操作，由于立即数是 0，而且各个数据位相同为 0，不同为 1，所以同样会返回 a0 原本的数据 ；而 xor 指令是拿 a0 和 a1 寄存器进行或操作，再把结果写入到 a0 寄存器。</p><p>下面我们按下“F5”调试一下，如下所示：</p><figure><img src="`+u+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图中是执行完 xori a0，a0，0 指令之后，执行 jr ra 指令之前的状态，我们已经看到 a0 寄存器中的值已经变成 0xff 了，这说明运算的结果正确。</p><p>xori_ins 函数返回后，输出的结果如下图所示：</p><figure><img src="'+x+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>结合上面这张截图不难发现，我们传递给 xori_ins 函数的参数是 0xff，因为 0xff 的二进制数据是（0b00000000000000000000000011111111）异或上 0 的二进制数据是（0b00000000000000000000000000000000）按位异或操作是“相同为 0，不同为 1”，所以返回 0xff，结果是正确的。</p><p>我们再来调试一下 xor_ins 函数。xor a0，a0，a1 指令执行完成之后，执行 jr ra 指令之前的状态如图所示：</p><figure><img src="'+_+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>我们看到 a0 寄存器中的值已经变成 0 了，这说明运算的结果正确，符合预期。</p><p>xor_ins 函数返回后，输出的结果如下图所示：</p><figure><img src="'+h+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>由于我们给 xor_ins 函数传递了两个相同的参数都是 0xffff。因为 0xffff 的二进制数据是（0b00000000000000001111111111111111）两者异或，按位异或操作是“相同为 0，不同为 1”，所以返回 0，结果是正确的。</p><p>下面我们看一下 andi、and、ori、or、xori、xor 这六条指令的二进制数据。</p><p>我们打开工程目录下的 and.bin 文件，如下所示：</p><figure><img src="'+j+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上述图中的 12 个 32 位数据是 12 条指令，其中六个 0x00008067 数据是六个函数的返回指令。</p><p>具体的指令形式，还有对应的汇编语句，我用表格帮你做了整理。</p><figure><img src="'+y+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>同样地，我带你拆分一下 andi、and、ori、or、xori、xor 指令的各位段的数据，看看它们是如何编码的。</p><figure><img src="'+z+`" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>从上图中可以发现，立即数版本和寄存器版本的 and、or、xor 指令通过<strong>操作码</strong>区分，而它们之间的寄存器和立即数版本是靠<strong>功能位段</strong>来区分，立即数位段和源寄存器与目标寄存器位段和之前的指令是相同的。</p><p>到这里六条逻辑指令已经拿下了，咱们继续学习移位指令。</p><h2 id="移位指令" tabindex="-1"><a class="header-anchor" href="#移位指令" aria-hidden="true">#</a> 移位指令</h2><p>移位指令和逻辑操作指令一样，都是 CPU 电路很容易就能实现的。</p><p>RISC-V 指令集中的移位指令包括逻辑左移、逻辑右移和算术右移，它们分别有立即数和寄存器版本，所以一共有六条。逻辑右移和算术右移是不同的，等我们后面用到时再专门讲解。</p><h3 id="逻辑左移指令-slli、sll-指令" tabindex="-1"><a class="header-anchor" href="#逻辑左移指令-slli、sll-指令" aria-hidden="true">#</a> 逻辑左移指令：slli、sll 指令</h3><p>我们先看看逻辑左移指令，也就是 slli、sll 指令，它们的形式如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>slli rd，rs1，imm
#slli 立即数逻辑左移指令
#rd 目标寄存器
#rs1 源寄存器1
#imm 立即数，rs1左移的位数，0~31
sll rd，rs1，rs2
#sll 寄存器逻辑左移指令
#rd 目标寄存器
#rs1 源寄存器1
#rs2 源寄存器2，rs1左移的位数
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中 rd、rs1、rs2 可以是任何通用寄存器。imm 是立即数，其实在官方文档中，这里是 shamt，表示 rs1 左移 shamt 位。这里我为了和之前的形式保持一致，才继续沿用了 imm。</p><figure><img src="`+C+`" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>slli、sll 它们俩完成的操作，用伪代码描述如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//slli
rd = rs1 &lt;&lt; imm
//sll
rd = rs1 &lt;&lt; rs2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>逻辑左移的操作是把 rs1 中的数据向左移动 imm 位，或者把 rs1 中的数据向左移动 rs2 位，右边多出的空位填 0 并写入 rd 中。</p><p>我们用图解来表达这一过程，这样你就能一目了然了。</p><figure><img src="`+S+`" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>接下来我们在工程目录下，建立一个 sll.S 文件，写代码验证一下，如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.globl slli_ins
slli_ins:
    slli a0, a0, 4          #a0 = a0&lt;&lt;4，a0是C语言调用者传递的参数，a0也是返回值，这样计算结果就返回了
    jr ra                   #函数返回

.globl sll_ins
sll_ins:
    sll a0, a0, a1          #a0 = a0&lt;&lt;a1，a0、a1是C语言调用者传递的参数，a0是返回值，这样计算结果就返回了
    jr ra                   #函数返回
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里已经写好了 slli_ins 与 sll_ins 函数，它们会分别执行 slli 和 sll 指令。立即数逻辑左移 slli 指令是把 a0 中的数据左移 4 位。而逻辑左移 sll 指令是把 a0 中的数据左移，左移多少位要取决于 a1 中的数据，完成移动后再把结果写入到 a0 寄存器。</p><p>我们还是用 VSCode 打开工程，按下“F5”调试，如下所示：</p><figure><img src="`+V+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图中是进入 slli_ins 函数，执行完 slli a0，a0，4 指令之后，执行 jr ra 指令之前的状态，我们给 slli_ins 函数传进来的参数是 0xffff。现在对照图示就能看到，a0 寄存器中的值确实已经变成 0xffff0 了，这说明运算结果是正确的。</p><p>slli_ins 函数返回后，输出的结果如下：</p><figure><img src="'+I+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>因为 0xffff 二进制数据是（0b00000000000000001111111111111111），逻辑左移 4 位后的结果是 0xffff0，它的二进制数据是（0b00000000000011111111111111110000），结果正确无误。</p><p>下面我们接着对 sll_ins 函数进行调试，如下所示：</p><figure><img src="'+P+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图中是进入 sll_ins 函数，执行完 sll a0，a0，a1 指令之后，执行 jr ra 指令之前的状态，我们给 sll_ins 函数传进来的参数是 0xeeeeeeee 和 31（a1 寄存器）。如果看到 a0 寄存器中的值确实已经变成 0 了，这说明运算结果是正确的。</p><p>sll_ins 函数返回后，输出的结果如下图所示：</p><figure><img src="'+U+`" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>第一个参数 0xeeeeeeee 的二进制数据是（0b11101110111011101110111011101110），逻辑左移 31 位后的结果是 0，因为它把所有的二进制数据位都移出去了，然后空位补 0，所以结果正确无误。</p><h3 id="逻辑右移指令-srli、srl" tabindex="-1"><a class="header-anchor" href="#逻辑右移指令-srli、srl" aria-hidden="true">#</a> 逻辑右移指令：srli、srl</h3><p>有逻辑左移就有逻辑右移。逻辑右移指令 srli、srl，分别对应着立即数和寄存器版本，它们的形式如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>srli rd，rs1，imm
#srli 立即数逻辑右移指令
#rd 目标寄存器
#rs1 源寄存器1
#imm 立即数，rs1右移的位数，0~31
srl rd，rs1，rs2
#srl 寄存器逻辑右移指令
#rd 目标寄存器
#rs1 源寄存器1
#rs2 源寄存器2，rs1右移的位数
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中 rd、rs1、rs2 可以是任何通用寄存器。imm 是立即数。为了和之前的形式保持一致，我们还是沿用 imm，而非官方文档中的 shamt。</p><p>srli、srl 完成的操作，可以用后面的伪代码来描述：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//srli
rd = rs1 &gt;&gt; imm
//srl
rd = rs1 &gt;&gt; rs2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>逻辑右移的操作是把 rs1 中的数据向右移动 imm 位。或者把 rs1 中的数据向右移动 rs2 位，左边多出的空位填 0 并写入 rd 中。</p><p>你可以对照我画的图示来理解这一过程。</p><figure><img src="`+k+`" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>光看看格式自然不够，我们在 sll.S 文件中写段代码来验证一下，如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.globl srli_ins
srli_ins:
    srli a0, a0, 8          #a0 = a0&gt;&gt;8,a0是C语言调用者传递的参数，a0也是返回值，这样计算结果就返回了
    jr ra                   #函数返回

.globl srl_ins
srl_ins:
    srl a0, a0, a1          #a0 = a0&gt;&gt;a1,a0、a1是C语言调用者传递的参数，a0是返回值，这样计算结果就返回了
    jr ra                   #函数返回
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>逻辑右移的两个函数 srli_ins 与 srl_ins，我已经帮你写好了。代码中立即数逻辑右移 srli 指令是把 a0 中的数据右移 8 位。逻辑右移 srl 指令，则是把 a0 中的数据右移，右移多少位要看 a1 中数据表示的位数是多少，再把结果写入到 a0 寄存器。</p><p>两条右移指令做了哪些事儿咱们说完了，老规矩，打开工程按下“F5”就可以调试了，效果如图：</p><figure><img src="`+R+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图中是进入 srli_ins 函数，执行完 srli a0，a0，8 指令之后，执行 jr ra 指令之前的状态，我们给 srli_ins 函数传进来的参数是 0xffff。现在，对照截图可以看到 a0 寄存器中的值确实已经变成 0xff 了，这说明运算结果正确。</p><p>srli_ins 函数返回后，输出的结果如下图所示：</p><figure><img src="'+F+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>因为调用函数 srli_ins 的参数 0xffff 的二进制数据是（0b00000000000000001111111111111111），逻辑右移 8 位后的结果是 0xff，它的二进制数据是（0b00000000000000000000000011111111），结果正确，符合我们的预期。</p><p>拿下了 srli_ins 函数，接下来就是 srl_ins 函数的调试，如下所示：</p><figure><img src="'+N+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图中是调用进入 srl_ins 函数，执行完 srl a0，a0，a1 指令之后，执行 jr ra 指令之前的状态，给 srl_ins 函数传进来的参数是 0xaaaaaaaa。可以看到，a0 寄存器中的值确实已经变成 0xaaaa 了，所以运算结果也是正确的。</p><p>srl_ins 函数返回后，输出的结果如下图所示：</p><figure><img src="'+B+`" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>给 srl_ins 函数传进来的第一个参数是 0xaaaaaaaa 的二进制数据是（0b10101010101010101010101010101010），逻辑右移 16 位后的结果是 0xaaaa，其二进制数据为（0b00000000000000001010101010101010 ），因为它把低 16 位二进制数据位移出去了，然后高 16 位的空位补 0，所以结果正确无误。</p><h3 id="算术右移指令-srai、sra" tabindex="-1"><a class="header-anchor" href="#算术右移指令-srai、sra" aria-hidden="true">#</a> 算术右移指令：srai、sra</h3><p>最后还有两个算术右移指令，它们和逻辑右移的最大区别是，**数据在逻辑右移之后左边多出空位用 0 填充，而数据在算术右移之后左边多出的空位是用数据的符号位填充。**如果数据的符号位为 1 就填充 1，如果为 0 就填充 0。</p><p>它们的形式和伪代码与逻辑右移是一样的，只不过指令助记符由 srli、srl，变成了 srai、sra。</p><p>下面我们直接在 sll.S 文件中，写代码进行验证。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.globl srai_ins
srai_ins:
    srai a0, a0, 8          #a0 = a0&gt;&gt;8,a0是C语言调用者传递的参数，a0也是返回值，这样计算结果就返回了
    jr ra                   #函数返回

.globl sra_ins
sra_ins:
    sra a0, a0, a1          #a0 = a0&gt;&gt;a1,a0、a1是C语言调用者传递的参数，a0是返回值，这样计算结果就返回了
    jr ra                   #函数返回
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中的两个函数 srai_ins 与 sra_ins，可以实现算术右移。先看立即数算术右移 srai 指令，它把 a0 中的数据右移了 8 位。而算术右移 srl 指令是把 a0 中的数据右移，右移多少位由 a1 中的数据表示的位数来决定，之后再把结果写入到 a0 寄存器。</p><p>我们按下“F5”，调试的结果如下：</p><figure><img src="`+E+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图中是进入立即数算术右移函数 srai_ins，执行完 srai a0，a0，8 指令之后，执行 jr ra 指令之前的状态。对照图里红框的内容可以看到，给 srai_ins 函数传进来的参数是 0x1111。如果 a0 寄存器中的值确实已经变成 0x11 了，就代表运算结果正确。</p><p>srai_ins 函数返回后，输出的结果如下：</p><figure><img src="'+L+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>因为我们给立即数算术右移函数 srai_ins 的参数 0x1111，其二进制数据是（0b00000000000000000001000100010001），符号位为 0，所以算术右移 8 位后的结果是 0x11，它的二进制数据是（0b00000000000000000000000000010001），结果非常正确。</p><p>我们接着调试一下 sra_ins 函数，如下所示：</p><figure><img src="'+q+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>上图中是进入算术右移函数 sra_ins，执行完 sra a0，a0，a1 指令之后，执行 jr ra 指令之前的状态。对照图里左侧红框的部分，我们就能知道 sra_ins 函数传进来的参数是 0xaaaaaaaa，你可能判断 a0 寄存器里输出的结果应该是 0x0000aaaa，但调试显示的实际结果却是 0xffffaaaa。</p><p>出现这个结果，你很奇怪是不是？但这恰恰说明运算结果是正确的。我们先看看 sra_ins 函数返回后输出的结果是什么，然后再分析原因。</p><figure><img src="'+G+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>因为我们给算术右移函数 sra_ins 的参数是 0xaaaaaaaa 和 16，这表明对 0xaaaaaaaa 算术右移 16，0xaaaaaaaa 的二进制数据是（0b10101010101010101010101010101010），注意<strong>其符号位为 1，所以算术右移 16 位后的结果是 0xffffaaaa</strong>，它的二进制数据是（0b11111111111111111010101010101010），结果是符合预期的。输出的结果也证实了这一点。</p><p>下面我们还是要看一下 slli、sll、srli、srl、srai、sra 这六条指令的二进制数据，我们打开工程目录下的 sll.bin 文件。</p><figure><img src="'+M+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>可以看出，图中的 12 个 32 位数据是 12 条指令，其中六个 0x00008067 数据是六个函数的返回指令。具体的指令形式，还有对应的汇编语句，你可以参考后面的表格。</p><figure><img src="'+O+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>我们拆分一下 slli、sll、srli、srl、srai、sra 指令的各位段的数据，看看它们是在内存中如何编码的，你可以结合示意图来理解。</p><figure><img src="'+T+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>我虽然给你详细展示了这些指令如何编码，但并不需要你把细节全部硬记下来，重点是观察其中的规律。</p><p>从上图中我们可以发现，sll、srl、sra 指令的立即数版本和寄存器版本要通过操作码区分，而它们之间是靠功能位段来区分的，<strong>源寄存器与目标寄存器所在的位段和之前的指令是相同的</strong>。需要注意的是，这些立即数版本的立即数位段在官方文档中叫 shamt 位段，并且只占 5 位，而其它指令的立即数占 12 位，这里为了一致性还是沿用立即数。</p><p>到这里，六条移位指令我们就讲完了。</p><h2 id="重点回顾" tabindex="-1"><a class="header-anchor" href="#重点回顾" aria-hidden="true">#</a> 重点回顾</h2><p>今天我们学习了逻辑指令和移位指令。</p><p>逻辑操作的指令包括 andi、ori、or、xori、xor，分别能对寄存器与寄存器、寄存器与立即数进行与、或、异或操作。有了这些操作，CPU 才能对数据进行逻辑运算，在一些情况下还能提升 CPU 的执行性能。更多的应用，后面课程里我们还会继续学习。</p><p>数据移位指令包括 slli、sll、srli、srl、srai、sra，也能分别能对寄存器与寄存器、寄存器与立即数进行逻辑左移、逻辑右移、算术右移操作。这些指令与逻辑指令一起执行数据的位运算时，相当有用，在特定情况下能代替乘除法指令。</p><figure><img src="'+w+'" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><p>经过漫长的学习，我们用两节课程的篇幅，一鼓作气学习了 RISC-V 全部的算术指令，分为加减、比较、逻辑、移位四大类别，一共有 19 条指令。这些指令作用于数据的运算，在应用程序中扮演着重要角色。</p><p>但是 CPU 有了这些算术指令就够了吗？这显然是不行的，起码还需要流程控制指令和数据加载储存指令，我们会在后续课程中继续讨论。</p><h2 id="思考题" tabindex="-1"><a class="header-anchor" href="#思考题" aria-hidden="true">#</a> 思考题</h2><p>为什么指令编码中，目标寄存器，源寄存器 1，源寄存器 2，占用的位宽都是 5 位呢？</p><p>欢迎你在留言区记录自己的疑问或收获，参与越多，你对内容的理解也更深入。如果觉得这节课内容不错，别忘了分享给更多朋友。</p><blockquote><p>逻辑运算有时效率高于加减乘除法，就好比十进制运算，有九九乘法表等加持，20个3直接等于60它的效率优于累计加20个3算出，但cpu的算力是软硬件共同的努力，软件方面通过优化算法结构能够直接提升效率，甚至在浮点运算中，好的算法结构能起事半功倍的效果！<br> 作者回复: 是的 你理解 相当透彻</p><hr><p>答案简单，RISCV寄存器一共32个的啊<br> 作者回复: 对</p><hr><p>寄存器共 32 位。<br> 2^5 = 32。<br> 作者回复: 对</p></blockquote>',171);function W(X,Y){const s=n("ExternalLinkIcon");return r(),d("div",null,[D,H,J,i("p",null,[a("今天我们就继续学习逻辑指令（and、or、xor）和移位指令 （sll、srl、sra）。"),i("a",K,[a("代码你可以从这里下载"),l(s)]),a("。话不多说，我们开始吧。")]),Q])}const ii=e(A,[["render",W],["__file","I17-算术指令（下）RISC-V.html.vue"]]);export{ii as default};
