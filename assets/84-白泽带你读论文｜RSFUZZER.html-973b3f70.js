import{_ as i}from"./640-edc8dc9c.js";import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as t,c as S,a as e,b as a,e as M,d as p}from"./app-cdabc73c.js";const s="/assets/640-1689658737254-1-ffa39f4a.png",d="/assets/640-1689658737254-2-8a06cc22.png",l="/assets/640-1689658737254-3-166eab90.png",h="/assets/640-1689658737254-4-445f41e5.png",m="/assets/640-1689658737255-5-21ddd8f5.png",f="/assets/640-1689658737255-6-3038c7a0.png",R="/assets/640-1689658737255-7-6518f0d4.png",c="/assets/640-1689658737255-8-55285fc2.png",g="/assets/640-1689658737255-9-edf2eb19.png",I={},Z=e("h1",{id:"_84-白泽带你读论文-rsfuzzer",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_84-白泽带你读论文-rsfuzzer","aria-hidden":"true"},"#"),a(" 84-白泽带你读论文｜RSFUZZER")],-1),u={href:"https://www.computer.org/csdl/proceedings-article/sp/2023/933600b765/1Js0Ek1SE6c",target:"_blank",rel:"noopener noreferrer"},E=p('<p>如需转载请注明出处，侵权必究。</p><p><strong>论文题目：RSFUZZER: Discovering Deep SMI Handler Vulnerabilities in UEFI Firmware with Hybrid Fuzzing</strong></p><p><strong>发表会议：S&amp;P 2023</strong></p><p>本文是来自中国科学院信息工程研究所霍玮研究组投稿的最新研究RSFUZZER: Discovering Deep SMI Handler Vulnerabilities in UEFI Firmware with Hybrid Fuzzing，目前该工作发表于S&amp;P 2023。</p><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述" aria-hidden="true">#</a> 概述</h2><p><mark>系统管理模式（SMM）<mark>是UEFI固件上的一种安全操作模式，它为x86处理器<em>提供了一种安全执行环境</em>，以访问高度特权数据和控制底层硬件（例如电源管理）。<mark>SMM驱动程序</mark>在SMM中运行，并由</mark>系统管理中断（SMI）处理程序</mark>接收和处理外部数据。尽管SMM在操作系统受到威胁时可以提供额外的保护层，但<mark>SMM驱动程序</mark>中的漏洞（尤其是SMI处理程序）<em>可能会导致保护机制失效</em>，并对设备造成严重损害。因此，及早对SMM漏洞检测SMM漏洞对于确保UEFI固件的安全至关重要。</p><p>为了解决这些问题，本文提出了RSFUZZER，<em>一种混合灰盒模糊测试技术</em>。RSFUZZER能够<strong>学习输入接口和格式信息，并探测由调用多个SMI处理程序触发的深层隐藏漏洞</strong>。作者实现了叫做RSFUZZER的原型工具，并在六个供应商提供的16个UEFI固件映像上对其进行了评估实验。</p><ol><li>实验结果显示，相较于现有技术，RSFUZZER平均能够覆盖更多的基本块，覆盖率高出617%；</li><li>并且能够检测到更多的漏洞，检测率高出828%。</li><li>此外，作者在评估的UEFI固件映像中，发现并报告了65个0-day漏洞，其中14个漏洞获得了CVE编号。</li><li>值得注意的是，这些0-day漏洞中有6个是在Intel的商业产品中发现的，而这些产品可能在发布之前经过了Intel官方混合模糊测试工具Excite的测试。</li></ol><p>这些结果证明RSFUZZER在提高UEFI固件安全性方面具有一定潜在的能力。</p><h3 id="smm-smi-模糊测试" tabindex="-1"><a class="header-anchor" href="#smm-smi-模糊测试" aria-hidden="true">#</a> ###SMM/SMI/模糊测试？</h3><blockquote><p>“SMM驱动程序”和“SMI处理程序”是与计算机系统中的SMM（System Management Mode）相关的两个概念。“模糊测试”是一种软件安全测试方法。让我逐一解释它们之间的关系：</p><ol><li><p>SMM驱动程序（SMM Driver）：SMM是计算机系统中的一种特殊工作模式，用于管理和控制系统级别的任务，例如系统管理和硬件监控。SMM驱动程序是在SMM模式下运行的驱动程序，它用于提供SMM环境下所需的硬件设备或软件支持。这些驱动程序通常由计算机系统的供应商或制造商开发，用于与SMM模式相关的功能和资源交互。</p><ol><li>SMM驱动程序是在SMM（系统管理模式）中运行的一类软件，用于提供特定功能和服务。它们通过SMM接口与SMM环境进行通信，并通过处理来自外部的数据来执行相应的操作。SMM驱动程序可以控制底层硬件，访问高度特权数据，例如电源管理，从而为系统提供额外的安全执行环境。</li></ol></li><li><p>SMI处理程序（SMI Handler）：当计算机系统进入SMM模式时，SMM固件会找到并运行相应的SMM处理程序，以完成特定的系统管理任务。这些处理程序通常被称为SMI处理程序或SMM处理程序。它们是在SMM模式下执行的软件代码，用于处理和响应系统级中断（SMI），来执行系统管理功能和任务。</p><ol><li>SMI（系统管理中断）处理程序是在SMM中运行的一种特殊的程序，用于接收和处理外部发生的系统管理中断。当发生某些特定事件时，例如硬件故障、异常条件或外部触发（如特定序列的按键），系统会触发SMI中断并切换到SMM执行环境，然后执行相应的SMI处理程序。SMI处理程序负责处理中断事件并采取相应的行动，例如记录事件、处理异常或执行特定的任务。</li></ol></li><li><p>模糊测试（Fuzz Testing）：模糊测试是一种软件测试方法，用于发现应用程序或系统的漏洞和安全问题。它通过向应用程序或系统输入具有意外或不规则数据的测试用例，来检测程序对异常输入的处理能力。模糊测试能够模拟潜在的攻击者输入，以发现程序中的缓冲区溢出、代码注入等安全漏洞。</p><ol><li>模糊测试是一种自动化测试技术，它可以生成大量的随机或变异的输入，以尽可能地覆盖程序的不同执行路径。通过分析程序在模糊测试中的行为和可能的异常响应，可以发现程序中潜在的漏洞和安全问题。</li></ol></li></ol><p>综上所述，SMM驱动程序和SMI处理程序是与SMM模式相关的概念，用于实现系统管理和控制任务。而模糊测试是一种软件安全测试方法，与前述的概念之间没有直接关系。模糊测试可以应用于不同的软件和系统，包括SMM处理程序，以发现潜在的安全漏洞和弱点。也就是说，模糊测试可以用于测试SMM驱动程序和SMI处理程序，以提高其安全性和可靠性。</p><p>SMM驱动程序是在SMM中运行的软件，用于提供特定的功能和服务。SMI处理程序是运行在SMM中的用于接收和处理系统管理中断的特殊程序。而模糊测试是一种用于检测软件漏洞的自动化测试方法，其中包括对SMM驱动程序和SMI处理程序进行模糊测试来发现潜在的安全漏洞。</p></blockquote><h2 id="背景" tabindex="-1"><a class="header-anchor" href="#背景" aria-hidden="true">#</a> 背景</h2><h3 id="相关工作现状" tabindex="-1"><a class="header-anchor" href="#相关工作现状" aria-hidden="true">#</a> 相关工作现状</h3><p>在过去的研究中，关于<mark>SMM驱动程序</mark>和<mark>SMI处理程序</mark>的漏洞检测技术主要集中在<em>模糊测试</em>方面。模糊测试是一种用于发现软件和固件漏洞的有效技术。模糊测试技术可以根据使用的程序内部信息的程度分为<mark>黑盒模糊测试</mark>、<mark>灰盒模糊测试</mark>和<mark>白盒模糊测试</mark>。在这三种技术中，灰盒模糊测试在实际应用中取得了平衡，具有高效和有效的特点。为了提高灰盒模糊测试对深层隐藏漏洞的发现能力，研究人员引入了符号执行技术，以帮助跨越程序分支约束。</p><h3 id="黑-灰-白-盒模糊测试" tabindex="-1"><a class="header-anchor" href="#黑-灰-白-盒模糊测试" aria-hidden="true">#</a> ###黑/灰/白/盒模糊测试？</h3><blockquote><p>&quot;黑盒模糊测试&quot;、&quot;灰盒模糊测试&quot;和&quot;白盒模糊测试&quot;都是模糊测试的变种，它们之间的区别在于测试者对目标系统的了解程度以及测试过程中所使用的信息和资源。下面是它们的详细解释：</p><ol><li><p>黑盒模糊测试（Black-box Fuzzing）：<br> 在黑盒模糊测试中，测试者对目标系统的内部结构和实现细节一无所知，并且不具备关于目标系统的源代码或详细文档。测试者只能通过输入合法和非法的数据来观察和分析系统的响应。黑盒模糊测试主要依赖于随机或变异的输入数据，并观察系统的异常行为、崩溃或错误消息来发现潜在的漏洞。这种测试方法可以模拟真实世界中的攻击场景，并发现系统对意外输入的鲁棒性问题。</p></li><li><p>灰盒模糊测试（Gray-box Fuzzing）：<br> 灰盒模糊测试在黑盒模糊测试的基础上，测试者对目标系统的一些内部信息有部分了解，比如系统的一些接口、数据结构或部分源代码。测试者可以根据这些信息生成更加有针对性的输入数据，以提高发现漏洞的效率。灰盒模糊测试可以结合对系统的静态分析和动态分析，识别系统的关键路径、边界条件和潜在漏洞。它可以更加准确地模拟攻击者在对系统进行测试时的策略选择。</p></li><li><p>白盒模糊测试（White-box Fuzzing）：<br> 白盒模糊测试是在测试过程中拥有最多系统信息和资源的一种模糊测试方法。测试者可以完全访问目标系统的源代码、文档和任意内部细节。白盒模糊测试可以利用对系统的深入理解，设计更加有效和精确的输入数据。测试者可以分析源代码的逻辑和数据流，识别程序中的关键点和潜在漏洞，并生成特定的输入模式以触发这些漏洞。</p></li></ol><p>总结起来，黑盒模糊测试侧重于测试目标系统的鲁棒性和抗攻击性，而灰盒模糊测试和白盒模糊测试更加注重对系统内部的了解和利用。灰盒模糊测试相比黑盒模糊测试，测试者具备更多的内部信息；而白盒模糊测试则在此基础上能够访问源代码和更多的内部细节，以更精确和有针对性地测试和发现漏洞。每种模糊测试都有其适用的场景和优势，根据需求和资源的可用性选择合适的模糊测试方法。</p></blockquote><p>然而，在应用现有的模糊测试技术进行SMI处理程序的检测时，存在一些挑战。现有的研究已经考虑了对SMI处理程序的模糊测试，但存在一些限制。</p><ol><li>例如，某些方法只处理单维输入空间（即内<mark>核空间程序</mark>和<mark>SMI处理程序</mark>之间的<strong>通信缓冲区</strong>），<br> 而忽略了<mark>SMI处理程序</mark>可能从硬编码的内存地址读取输入的情况。</li><li>此外，现有方法在生成输入时没有考虑可能影响SMI处理程序执行的<strong>跨处理程序变量</strong>。</li><li>此外，大多数SMI处理程序中的漏洞是<strong>静默损坏</strong>，而不是崩溃，这对于模糊测试工具来检测是具有挑战性的。</li></ol><h3 id="本文的挑战" tabindex="-1"><a class="header-anchor" href="#本文的挑战" aria-hidden="true">#</a> 本文的挑战</h3><p>在该问题中，存在五个挑战需要克服：</p><p><strong>挑战1</strong> 需要考虑多样的输入接口。一些SMI处理程序需要从多个输入接口接收测试输入，包括CommBuffer和硬编码内存地址。这使得生成有效的测试输入变得更加复杂。</p><p><strong>挑战2</strong> 需要满足复杂的输入格式限制。为了有效地测试SMI处理程序，测试输入需要满足特定的格式要求。如果不能正确地嵌入输入变量的内容，可能导致输入解析失败，无法充分测试使用了特定变量的处理程序。</p><p><strong>挑战3</strong> 需要满足处理程序间的协同调用。触发某些漏洞需要多个SMI处理程序的参与。这些处理程序之间存在依赖关系，需要按照特定的顺序调用它们才能触发漏洞。</p><p><strong>挑战4</strong> （触发漏洞）需要满足路径约束。一些漏洞受到路径约束的保护，只有满足特定的路径条件才能触发漏洞。解决这些路径约束是检测漏洞的关键。</p><p><strong>挑战5</strong> 需要具备感知静默损坏的能力。一些漏洞属于静默损坏，即不会导致处理程序崩溃。这种类型的漏洞很难通过监控崩溃来检测，需要采用其他方法来发现。</p><p><strong>实例</strong></p><figure><img src="'+i+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>图1展示了一个任意写漏洞的实例代码片段。在代码的第18行，程序执行到此处时发生了漏洞。变量buffer的值由用户输入控制，因此攻击者可以将值0写入任意内存地址。下面对该实例和挑战的关系进行阐释。</p><h3 id="考虑多样的输入接口" tabindex="-1"><a class="header-anchor" href="#考虑多样的输入接口" aria-hidden="true">#</a> 考虑多样的输入接口</h3><p>为了对一个SMI处理程序进行模糊测试，首先需要确定其<mark>输入接口</mark>，以便提供测试输入。一个SMI处理程序可以有多个输入接口。例如，在图中的Handler1中有两个输入接口：<em>CommBuffer变量</em>和<em>硬编码的内存地址0x40E</em>。该现象对应<strong>挑战1</strong>，即尽管CommBuffer在UEFI中被正式指定为SMI处理程序与内核空间程序之间的通信通道，但实际上许多SMI处理程序也通过硬编码的内存地址从内核空间程序接收数据。</p><h3 id="uefi中的commbuffer" tabindex="-1"><a class="header-anchor" href="#uefi中的commbuffer" aria-hidden="true">#</a> ###UEFI中的CommBuffer？</h3><blockquote><p>在UEFI（统一扩展固件接口）中，CommBuffer被正式指定为SMI（系统管理中断）处理程序与内核空间程序之间的通信通道。CommBuffer是一个特定的数据结构或缓冲区，用于在SMI处理程序和内核空间程序之间进行数据交换和通信。</p><p>通常，CommBuffer是在操作系统内核中内存中分配的一块连续的内存区域。它被设计为一个用于传递数据的区域，可以在SMI处理程序和内核空间程序之间交换信息。</p><p>在通信过程中，SMI处理程序可以在CommBuffer中写入信息，同时内核空间程序也可以读取CommBuffer中的信息。这样，SMI处理程序和内核空间程序可以通过CommBuffer进行数据传递和通信。可以使用不同的同步机制（如互斥锁、信号量等）来确保数据的一致性和并发访问的正确性。</p><p>通过CommBuffer，SMI处理程序可以将系统状态、事件或其他信息传递给内核空间程序，而内核空间程序也可以向SMI处理程序发送控制指令或请求。这样，SMI处理程序和内核空间程序之间可以进行双向的通信和协作，以实现特定的系统功能、服务或响应特定的事件。</p><p>需要注意的是，具体如何使用CommBuffer作为通信信道是由UEFI规范和技术文档所定义的，因此实际的使用方式可能会因不同的UEFI实现或系统配置而有所不同。</p></blockquote><h3 id="满足复杂的输入格式限制" tabindex="-1"><a class="header-anchor" href="#满足复杂的输入格式限制" aria-hidden="true">#</a> 满足复杂的输入格式限制</h3><p>确定了输入接口后，就可以尝试生成测试输入。然而，为了有效地测试SMI处理程序，这些测试输入需要具有良好的结构。例如，变量buffer是从输入的CommBuffer中提取的结构体。该现象对应<strong>挑战2</strong>，即如果无法将buffer的内容正确地嵌入到为CommBuffer生成的测试输入中，<em>由于输入解析失败</em>，无法充分测试使用buffer变量的处理程序。</p><h3 id="满足处理程序间的协同调用" tabindex="-1"><a class="header-anchor" href="#满足处理程序间的协同调用" aria-hidden="true">#</a> 满足处理程序间的协同调用</h3><p>要触发漏洞并执行第18行的代码，需要调用Handler3并满足第16行和第17行的if条件。这些条件涉及到signature和buffer变量，它们的值分别在Handler1和Handler2中进行了初始化。因此，在触发漏洞之前，需要先调用Handler1和Handler2。该现象对应<strong>挑战3</strong>，即触发某些漏洞<em>需要多个SMI处理程序的参与</em>。由于signature和buffer在多个SMI处理程序中被使用，本文将它们称为<em>跨处理程序变量</em>。</p><h3 id="触发漏洞-需要满足路径约束" tabindex="-1"><a class="header-anchor" href="#触发漏洞-需要满足路径约束" aria-hidden="true">#</a> （触发漏洞）需要满足路径约束</h3><p>在第18行之前，signature<em>的值必须等于</em>0x54768345。该现象对应<strong>挑战4</strong>，即一些漏洞受到<em>路径约束</em>的保护。</p><h3 id="具备感知静默损坏的能力" tabindex="-1"><a class="header-anchor" href="#具备感知静默损坏的能力" aria-hidden="true">#</a> 具备感知静默损坏的能力</h3><p>对于具有高于ring-1特权级别的程序来说，写入任意内存地址可能会导致程序崩溃，从而被模糊测试工具捕获。但是，SMI处理程序具有ring-2的特权级别，可以访问任何内存位置，即使有时它们不应该使用这种特权。因此，无论如何调整buffer的值，Handler3都不会在第18行崩溃。因此，模糊测试工具<em>无法通过监控崩溃来检测</em>到图中展示的漏洞。该现象对应<strong>挑战5</strong>，即一些漏洞只是静默损坏，不会导致SMI处理程序崩溃。</p><h2 id="方法" tabindex="-1"><a class="header-anchor" href="#方法" aria-hidden="true">#</a> 方法</h2><h3 id="威胁模型" tabindex="-1"><a class="header-anchor" href="#威胁模型" aria-hidden="true">#</a> 威胁模型</h3><p>在本文中，作者假设攻击者具有ring-0权限但没有ring-2权限，因此他们可以在物理上修改所有内存，但无法直接操作<mark>SMRAM（System Management RAM）</mark>。在这一点假设下，攻击者可以通过向CommBuffer输入可控内容来提供测试输入，并利用SMM handler（系统管理中断处理程序）的漏洞来实现权限提升和恶意攻击。</p><h3 id="smram" tabindex="-1"><a class="header-anchor" href="#smram" aria-hidden="true">#</a> ### SMRAM？</h3><blockquote><p>SMRAM（System Management RAM）是一种特殊的内存区域，是用于存储和保护系统管理代码和数据的一块内存。它在计算机系统中主要用于存储和执行系统管理模式（System Management Mode，简称SMM）中的代码。</p><p>SMM是一种特殊的运行模式，是用于系统管理和控制的一种操作模式。在SMM中，系统可以中断正常的操作模式（如保护模式或实模式），并切换到SMM，这样系统管理处理器（System Management Processor，简称SMP）可以执行特定的系统管理功能，如电源管理、温度监测、固件更新等。SMM的目的是提供一种安全、独立的环境，用于处理系统的敏感任务和事务。</p><p>为了保证SMM的安全性和独立性，SMRAM被用作存储SMM代码和数据的地方。SMRAM通常是一块小而高速的内存区域，只有系统管理处理器和相关的系统管理固件可以访问它。对于其他处理器或操作系统来说，SMRAM是不可见和不可访问的。这样可以确保SMM中的敏感数据和代码不会被未经授权的程序或恶意软件访问或修改。</p><p>SMRAM是通过一些特殊的内存控制器或机制来实现的，具体的实现方式可能因系统架构和UEFI实现而有所不同。SMRAM的大小和位置也根据不同的系统而有所差异，但通常它都是一个小的物理地址范围，一般在BIOS（基本输入输出系统）固件的低端地址范围内。</p><hr><p>在基于RISC-V的处理器架构中，SMRAM的存在与具体的系统实现有关。虽然RISC-V是一个开放的指令集架构，但它并没有强制要求包含SMRAM。</p><p>SMRAM的存在和使用通常是与系统设计和实现相关的，而不是与指令集架构直接相关。因此，在基于RISC-V的处理器架构上，如果系统设计者决定使用SMM和SMRAM来实现系统管理任务和保护，他们可以选择在处理器或系统中添加SMRAM来实现SMM。</p><p>需要注意的是，RISC-V架构本身提供了可扩展性和灵活性，允许系统设计者自定义和扩展处理器的特性，包括添加额外的控制状态寄存器（CSR）和特殊的指令或访问模式。因此，在具体的RISC-V处理器实现中，系统设计者可以根据需要扩展和添加SMM和SMRAM相关的机制，以满足系统的管理和保护需求。</p><p>总之，在基于RISC-V的处理器架构上，是否存在和如何使用SMRAM取决于具体的系统设计和实现。这与处理器架构本身并没有直接的关系，而是由系统设计者在基于RISC-V的处理器上添加和实现的功能。</p></blockquote><h3 id="rsfuzzer流程" tabindex="-1"><a class="header-anchor" href="#rsfuzzer流程" aria-hidden="true">#</a> RSFUZZER流程</h3><p>图2展示了RSFUZZER的概览。整体输入是<em>UEFI固件镜像中的所有SMI处理程序</em>，整体输出是<em>能够触发UEFI固件中SMI处理程序崩溃的Proof-of-Concept (PoC)输入</em>。RSFUZZER有两种模式：<strong>单处理程序</strong>模糊测试模式和<strong>跨处理程序</strong>模糊测试模式。</p><figure><img src="'+s+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>RSFUZZER是<strong>一种用于UEFI固件镜像的模糊测试工具</strong>。它接收UEFI固件镜像中的所有SMI处理程序作为输入，并生成能够触发SMI处理程序崩溃的Proof-of-Concept (PoC)输入作为输出。RSFUZZER包含两种执行模式：单处理程序模糊测试模式和跨处理程序模糊测试模式。</p><ol><li>在单处理程序模糊测试模式下，RSFUZZER选择一个SMI处理程序和一个种子，并通过测试用例来报告新的基本块覆盖率，将其保留为种子，并进行输入知识提取。同时，它记录SMI处理程序的变量处理行为并识别跨处理程序变量。</li><li>当在给定时间限制内没有发现新的基本块时，RSFUZZER切换到跨处理程序模糊测试模式。它搜索跨处理程序变量，获取与该变量相关的SMI处理程序队列，并生成相应的测试用例。</li><li>RSFUZZER通过在单处理程序模糊测试模式和跨处理程序模糊测试模式之间切换，逐步学习输入格式和函数关系，以有效测试UEFI固件镜像中的SMI处理程序。</li></ol><h3 id="输入知识的提取" tabindex="-1"><a class="header-anchor" href="#输入知识的提取" aria-hidden="true">#</a> 输入知识的提取</h3><p>为了提取输入知识，RSFUZZER采取以下步骤，如图3所示：</p><figure><img src="'+d+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><h3 id="测试用例生成" tabindex="-1"><a class="header-anchor" href="#测试用例生成" aria-hidden="true">#</a> 测试用例生成</h3><p>RSFUZZER通过以下方法提取输入知识：</p><p>基于结构的种子生成策略。每当RSFUZZER获取到与输入格式相关的新知识时，它会根据相应的格式分配内存，并填充随机数据生成一个新的测试用例种子。</p><p>基于限制条件的测试用例突变策略。如果约束求解在一段时间内无法解出，RSFUZZER对与未触发的分支相关的变量进行突变，使其变异为与分支条件相同或略大、略小的值。如图4所示。</p><figure><img src="'+l+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>基于污点的测试用例突变策略。由于SMI处理程序拥有ring-2级权限，对内存的污染很可能不会导致崩溃。为了解决这个问题，RSFUZZER在执行混合符号执行之前，分配了一块不可读、不可写、不可执行的Red Zone内存。在混合符号执行过程中，RSFUZZER会标记所有用户可控的内存指令为危险指令，<em>并通过变异潜在的危险指令，使其指向Red Zone内存，从而触发崩溃</em>。通过这些策略，RSFUZZER能够有效地提取输入知识，并在后续的测试用例生成和执行过程中应用。</p><h3 id="跨处理程序知识提取" tabindex="-1"><a class="header-anchor" href="#跨处理程序知识提取" aria-hidden="true">#</a> 跨处理程序知识提取</h3><p>在跨处理程序知识的提取方面，RSFUZZER采取以下步骤：在单处理程序模糊测试模式下，RSFUZZER记录SMI处理程序的变量处理行为，并识别跨处理程序的变量。具体而言，RSFUZZER通过分析SMI处理程序的变量处理行为，确定其是某一特定跨处理程序变量的生产者还是消费者。为了识别跨处理程序变量，RSFUZZER考虑了跨处理程序代码段的三个特征：</p><ol><li>跨处理程序代码段总是访问相同的内存位置；</li><li>至少有一个代码段可以对内存位置进行写操作；</li><li>跨处理程序变量可以在不同的SMI处理程序之间传递。</li></ol><p>通过分析指令执行轨迹，RSFUZZER能够确定内存访问指令中的变量是生产者还是消费者。</p><h3 id="跨处理程序模糊测试模式的调度" tabindex="-1"><a class="header-anchor" href="#跨处理程序模糊测试模式的调度" aria-hidden="true">#</a> 跨处理程序模糊测试模式的调度</h3><p>在跨处理程序模糊测试模式的调度方面，RSFUZZER根据跨处理程序变量的生产者-消费者关系来安排SMI处理程序的执行顺序。为了确保跨处理程序变量在被另一个SMI处理程序消费之前先由一个SMI处理程序产生，RSFUZZER首先执行产生跨处理程序变量的SMI处理程序。然后，RSFUZZER以随机顺序执行消费者的SMI处理程序。通过这样的调度策略，RSFUZZER能够有效地进行跨处理程序的知识提取和模糊测试。</p><h2 id="评估" tabindex="-1"><a class="header-anchor" href="#评估" aria-hidden="true">#</a> 评估</h2><h3 id="有效性评估" tabindex="-1"><a class="header-anchor" href="#有效性评估" aria-hidden="true">#</a> 有效性评估</h3><p>为了评估RSFUZZER的有效性，作者在选取的数据集的UEFI固件镜像上运行RSFUZZER，以发现新的漏洞。对于所有测试的固件，RSFUZZER能够自动识别SMI处理程序的输入通道，并将模糊测试生成的输入数据提供给分析的SMI处理程序。</p><p>总体而言，RSFUZZER发现了65个新漏洞，其中20个得到了相应供应商的确认。其中14个已被分配CVE号并由供应商修复，如表II所示。值得注意的是，许多固件镜像（特别是来自Intel、Dell、ASUS、AMD和Lenovo）已经被安全研究人员广泛研究和测试，并发现了许多漏洞。尽管如此，RSFUZZER仍能够发现大量新的漏洞，说明其在生成高度结构化输入并在复杂的健全性检查下推动模糊测试进入更深层次路径的能力。</p><figure><img src="'+h+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>此外，表I展示了两类漏洞：</p><p>（i）单处理程序漏洞，使用单处理程序知识提取模块检测到；</p><p>（ii）跨处理程序漏洞，使用跨处理程序知识提取模块检测到。</p><p>总体而言，RSFUZZER发现了58个单处理程序漏洞和7个跨处理程序漏洞，证明了其在检测两种类型漏洞方面的有效性。</p><figure><img src="'+m+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>如表II所示，RSFUZZER发现了6类变量、不受信任的指针解引用和使用后释放等漏洞。其中，不正确的输入验证是最常见的漏洞类型。当SMI处理程序未能正确验证输入时，攻击者可以利用该漏洞并发起可能导致控制流改变、任意内存访问或任意代码执行的攻击。</p><p>此外，为了展示这些漏洞的实际安全影响，作者针对两个受影响设备成功创建了两个漏洞的POC（Proof of Concept），</p><ol><li>例如，一个内核空间程序成功获取了SMM权限并在SMRAM中运行任意代码，从而实现了恶意能力，如修改通常限制在SMM的SPI Flash内容，并执行永久的恶意攻击。</li><li>由于本文无法获取所有受影响的设备，剩余漏洞的POC是使用本文的模拟器创建的，并确认了其他18个以前未知的漏洞也是可利用的。</li></ol><p>正如表II所示，对于所有确认的具有分配的CVSS v3评分的漏洞，报告漏洞的平均CVSS v3基础分数为7.7（供应商预留的CVE条目除外），说明报告漏洞的安全影响较高。</p><h3 id="和基准对比" tabindex="-1"><a class="header-anchor" href="#和基准对比" aria-hidden="true">#</a> 和基准对比</h3><p>为了评估RSFUZZER生成的测试用例的性能，本文与Syzgen的模糊测试实验进行比较。本文跟踪了基本块覆盖率的增长趋势，并且图6展示了每个模糊测试工具生成的代码覆盖率情况。结果显示，RSFUZZER在所有固件镜像上以更快的速度覆盖了更多独特的基本块，因为RSFUZZER覆盖率的95%置信区间下界高于Syzgen覆盖率的95%置信区间上界。</p><p>具体来说，如图6所示，RSFUZZER在所有固件镜像的覆盖率方面优于Syzgen。根据Mann-Whitney U检验，所有p值都小于5.00e-2，表明RSFUZZER将基本块覆盖率提高了高达617%。在本文的设置中，Syzgen表现不佳，原因如下：</p><ol><li>为了恢复嵌套对象，Syzgen追踪创建嵌套对象的内部API，但是在UEFI固件中，不存在从内核空间到SMRAM执行深层复制的API函数。</li><li>Syzgen侧重于识别不同接口之间的返回值和参数关系。 <ol><li>在独特漏洞方面，如图7所示，RSFUZZER检测到了总共65个独特漏洞，而Syzgen只检测到了7个，这意味着RSFUZZER在漏洞检测方面的提升达到了828%。</li><li>作者对结果进行了手动分析，发现Syzgen和SPENDER找到的所有漏洞都能被RSFUZZER找到。</li><li>总体而言，本文的结果显示，相较于Syzgen和SPENDER，RSFUZZER在检测更广泛的漏洞方面具有很好的效果。</li></ol></li></ol><figure><img src="'+f+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><figure><img src="'+R+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><h3 id="知识提取模块评估" tabindex="-1"><a class="header-anchor" href="#知识提取模块评估" aria-hidden="true">#</a> 知识提取模块评估</h3><p>作者比较有无提取知识的RSFUZZER在漏洞和代码覆盖率上的差异来确认提取的知识对RSFUZZER的影响。对于不具有知识的模糊测试，作者移除了知识提取模块，只对输入数据进行随机变异。</p><p>表格III显示了独特基本块和漏洞的数量结果。在具有知识的模糊测试中，RSFUZZER发现了65个漏洞，而在不具有知识的模糊测试中只发现了6个漏洞。换句话说，知识提取模块帮助RSFUZZER比不具有知识的模糊测试发现的漏洞数量增加了983%。在代码覆盖率方面，具有知识的模糊测试比不具有知识的模糊测试提高了545%。这些结果强烈表明知识提取模块的有效性。</p><figure><img src="'+c+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p>为了进一步评估输入格式知识和跨处理程序知识对漏洞检测的贡献，本文分析了检测到的漏洞与这两种知识之间的关系。如表IV所示，对于涉及复杂输入格式的漏洞，输入格式推断是必要的。提取跨处理程序知识对于调度SMI处理程序和检测跨处理程序漏洞也很重要。</p><figure><img src="'+g+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>RSFUZZER是一种用于检测系统管理模式（SMM）漏洞的混合灰盒模糊测试技术。它学习输入接口和格式信息，并发现多个SMM处理程序调用中的深层隐藏漏洞。通过在16个UEFI固件映像上的评估实验，实验结果显示，相较于现有技术，RSFUZZER平均能够覆盖更多的基本块，覆盖率高出617%；并且能够检测到更多的漏洞，检测率高出828%。此外，它还发现了65个0-day漏洞，其中14个获得了CVE编号。这些结果证明RSFUZZER在提高UEFI固件安全性方面具有一定潜在的能力。</p>',93);function F(U,b){const r=o("ExternalLinkIcon");return t(),S("div",null,[Z,e("p",null,[e("a",u,[a("CSDL | IEEE Computer Society"),M(r)]),a("。")]),E])}const z=n(I,[["render",F],["__file","84-白泽带你读论文｜RSFUZZER.html.vue"]]);export{z as default};
