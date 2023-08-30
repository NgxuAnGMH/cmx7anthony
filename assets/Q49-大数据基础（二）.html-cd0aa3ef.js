import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as r,d as s}from"./app-cdabc73c.js";const o="/assets/f682c9b0304b7bf264bf25f9da981df2-87548418.jpg",d="/assets/2f8b969c279c600a50782f185ec78a98-fe7e1855.jpg",t="/assets/d698a7274f6a9e63ca4e5da748cd834d-1c0da06b.jpg",i="/assets/yy994495b6f17c07151e9525f46baf1a-521055c6.jpg",p="/assets/8e0aed44ce6960ffe4d12a4ac7c2b44e-9cd1ea7f.jpg",n="/assets/e9e5891754412c78f1687277fbb9c3c9-1738f504.jpg",l="/assets/64029ebd4b92865c441909fbeed9a0e8-dbd6edbb.jpg",c={},m=s('<h1 id="加餐03-学习攻略-二-大数据-云计算-究竟怎么学" tabindex="-1"><a class="header-anchor" href="#加餐03-学习攻略-二-大数据-云计算-究竟怎么学" aria-hidden="true">#</a> 加餐03｜学习攻略（二）：大数据&amp;云计算，究竟怎么学？</h1><p>你好，我是 LMOS。</p><p>上节课我们从谷歌的三驾马车开始，学习了大数据三件套的设计思路，可惜谷歌三驾马车作为商用软件，只开放了论文来讲解原理，却并没有开放出对应的源代码。</p><p>为了帮你更好地理解这些核心技术是怎么落地的，这节课我会简单介绍一下另外三个基础组件的设计原理，它们也是开源大数据生态中的重要角色。</p><h2 id="hdfs-设计原理" tabindex="-1"><a class="header-anchor" href="#hdfs-设计原理" aria-hidden="true">#</a> HDFS 设计原理</h2><p>首先我们来说说 HDFS，它的全称是 <em>Hadoop Distributed File System</em>，你可以理解为一个可以由低成本的普通 PC 机组成的大规模分布式文件系统。</p><p>HDFS 的架构图如下所示：</p><img src="'+o+'" alt="img" style="zoom:25%;"><p>其实，HDFS 的核心架构和上节课讲过的 GFS，架构思路是一脉相承的。</p><p>HDFS 基于主 / 从架构设计，其集群的核心是由 <mark>NameNode</mark>（充当主服务器）、<mark>DataNode</mark>（充当从服务器）、<mark>Client</mark> 这三部分构成的。各部分的含义和功能，你可以参考后面这张表：</p><img src="'+d+'" alt="img" style="zoom:50%;"><p>通过这几个组件的配合，<strong>我们就拥有了一个可靠的分布式文件系统</strong>。</p><p>那么 HDFS 有哪些优势呢？主要是后面这四点：</p><ol><li><strong>容错性</strong>：可以在集群中的任意节点发生故障时继续运行，这能保证数据的安全性。</li><li><strong>大数据处理能力</strong>：HDFS 可以存储海量的数据，并支持大规模并行计算。</li><li><strong>高可靠性</strong>：HDFS 将文件分割成多个块存储，并在集群中多次复制，可以保证数据的高可靠性。</li><li><strong>简单易用</strong>：HDFS 提供了简单易用的文件存储和访问接口，与其他系统集成很方便。</li></ol><p>但是，HDFS 也有一些不足，具体包括：</p><ol><li><em>性能相对较低</em>：不适合低延迟的数据访问。</li><li><em>不支持随机写入</em>：不支持随机写入，只能进行顺序写入。</li><li><em>对小文件不友好</em>：不能很好地存储小文件，因为它需要将小文件分割成大块存储，而这会导致存储和计算效率低下。</li></ol><p>总之，HDFS 能够高效地存储海量数据，并支持大规模并行计算。但是，HDFS 不适合用于低延迟的数据访问，也不适合用于存储小文件。说到这，我们就不难推测 HDFS 的适用场景了——它适合用在海量数据存储和大规模数据分析的场景中，例如<mark>搜索引擎</mark>、<mark>广告系统</mark>、<mark>推荐系统</mark>等。</p><h2 id="yarn-设计原理" tabindex="-1"><a class="header-anchor" href="#yarn-设计原理" aria-hidden="true">#</a> YARN 设计原理</h2><p>其实早期 Hadoop 也按照 Google Mapreduce 的架构，实现了一套 Mapreduce 的资源管理器，用于管理和调度 MapReduce 任务所需要的资源。<em>但是 JobTracker 存在单点故障，它承受的访问压力也比较大</em>，这影响了系统的可扩展性。另外，早期设计还不支持 MapReduce 之外的计算框架（比如 Spark、Flink）。</p><p>正是因为上述问题，Hadoop 才做出了 YARN 这个新的 Hadoop 资源管理器。YARN 的全称是 Yet Another Resource Negotiator，让我们结合架构图了解一下它的工作原理。</p><img src="'+t+'" alt="img" style="zoom:25%;"><p>根据架构图可见，YARN 由 <mark>ResourceManager</mark>、<mark>NodeManager</mark>、<mark>JobHistoryServer</mark>、<mark>Containers</mark>、<mark>Application Master</mark>、<mark>job、Task</mark>、<mark>Client</mark> 组成。</p><p>YARN 的架构图中的各个模块的功能，你可以参考后面这张表格：</p><img src="'+i+'" alt="img" style="zoom:33%;"><p>了解了每个模块大致的功能之后，我们再看看 YARN 运行的基本流程吧！</p><img src="'+p+'" alt="img" style="zoom:25%;"><p>到 YARN 运行主要是包括后面表格里的八个步骤。</p><img src="'+n+'" alt="img" style="zoom:33%;"><p>其实我们计算的每一个 MapReduce 的作业，也都是通过这几步，被 YARN 资源管理器调度到不同的机器上运行的。弄懂了 YARN 的工作原理，对“Hadoop 大数据生态下如何调度计算作业到不同容器做计算”这个问题，你会更容易理解。</p><p>然而，解决了存储和计算问题还不够。因为大数据生态下需要的组件非常多，各种组件里还有很多需要同步、订阅或通知的状态信息。如果这些信息没有一个统一组件处理，那整个分布式系统的运行都会失控，这就不得不提到<strong>一个重要的协调组件</strong>——<mark>ZooKeeper</mark> 了。</p><h2 id="zookeeper-设计原理" tabindex="-1"><a class="header-anchor" href="#zookeeper-设计原理" aria-hidden="true">#</a> ZooKeeper 设计原理</h2><p>ZooKeeper 集群中包含 Leader、Follower 以及 Observer 三个角色。</p><p><mark>Leader</mark> 负责进行投票的发起和决议，更新系统状态，Leader 是由选举产生的。<mark>Follower</mark> 用于接受客户端请求并向客户端返回结果，在选主过程中会参与投票。</p><p><mark>Observer</mark> 的目的是扩展系统，提高读取速度。Observer 会从客户端接收请求，并将结果返回给客户端。Observer 可以接受客户端连接，也可以接收读写请求，并将写请求转发给 Leader。但是，Observer<strong>不参与投票过程</strong>，只同步 Leader 的状态。</p><p>后面是 ZooKeeper 的架构图：</p><img src="'+l+`" alt="img" style="zoom:25%;"><p>在其核心，<em>Zookeeper 使用原子广播来保持服务器同步</em>。实现这种机制的协议称为 <mark>Zab 协议</mark>，它包括<strong>恢复模式</strong>（用于主选择）和<strong>广播模式</strong>（用于同步）。</p><p>当服务启动或 leader 崩溃后，Zab 协议进入恢复模式。恢复模式结束时，leader 已经当选，大多数服务器已经同步完成 leader 的状态。这种状态同步可以确保 leader 和 Server 的系统状态相同。</p><p>为了保证事务序列的一致性，ZooKeeper 使用递增的事务 ID（zxid）来标识事务。所有提案提交时都会附上 zxid。Zxid 为 64 位整数，<strong>高 32 位</strong>表示领导人关系是否发生变化（每选出一个领导者，就会创建一个新的 epoch，表示当前领导人所属的统治时期），<strong>低 32 位</strong>用于增量计数。</p><p>在工作期间，每个服务器都有三种状态：</p><ol><li><p>LOOKING：表示当前服务器不知道该领导者，正在寻找他。</p></li><li><p>LEADING：表示当前 Server 为已当选的 leader。</p></li><li><p>FOLLOWING：表示该 leader 已经当选，当前 Server 正在与该 leader 同步。</p></li></ol><p>通过这样<em>一套可靠的一致性协议和架构设计</em>，Zookeeper 把<u>用户改变数据状态的操作</u>，抽象成了<u>类似于对文件目录树的操作</u>。这样就简化了分布式系统中数据状态协调的难度，提高了分布式系统运行的稳定性和可靠性。</p><h2 id="综合应用与环境搭建" tabindex="-1"><a class="header-anchor" href="#综合应用与环境搭建" aria-hidden="true">#</a> 综合应用与环境搭建</h2><p>学了这么多基础概念，我们来挑战一个综合性问题。假设在一个大型 Hadoop 集群中，你作为系统管理员需要解决这样一个问题——如何保证数据的安全性？</p><p>你会如何解决呢，使用哪些 HDFS、YARN、ZooKeeper 中的哪些功能，为什么这样选择呢？你可以自己先思考一下，再听听我的想法。</p><p>为了保证数据的安全性，我们可以使用 HDFS 的多副本机制来保存数据。在 HDFS 中，我们可以将文件分成若干块存储在集群中的多个节点上，并设置每个块的副本数量。这样，即使某个节点出现故障，也可以通过其他节点上的副本来恢复数据。</p><p>此外，还可以利用 YARN 的资源管理功能来控制集群中节点的使用情况，以避免资源过度使用导致的数据丢失。</p><p>最后，我们还可以利用 ZooKeeper 的分布式锁功能，来保证集群中只有一个节点可以访问某个文件。这样多个节点同时写入同一个文件造成的数据冲突，也能够避免。</p><p><strong>总的来说，综合使用 HDFS 的多副本机制、YARN 的资源管理功能以及 Zookeeper 的分布式锁功能，可以帮我们有效保证数据的安全性。</strong></p><p>接下来就让我们动手搭建一套大数据开发环境吧。大数据开发环境搭建一般环节比较多，所以比较费时。为了节约部署时间，提高开发效率，我比较推荐使用 Docker 部署。</p><p>首先，我们先安装好 Docker 和 docker-compose。</p><p>要安装 Docker，一共要执行六步操作。第一步，在终端中更新软件包列表：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo apt update
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>第二步，安装依赖包：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo apt install apt-transport-https ca-certificates curl software-properties-common
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>第三步，添加 Docker 的官方 GPG 密钥：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>第四步，在系统中添加 Docker 的存储库：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo add-apt-repository &quot;deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable&quot;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>第五步，更新软件包列表并安装 Docker：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo apt update
sudo apt install docker-ce
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>第六步，启动 Docker 服务并将其设置为开机启动：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo systemctl start docker
sudo systemctl enable docker
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>安装完 Docker，接下来我们来还需要执行两个步骤，来安装 Docker Compose。首先我们要下载 Docker Compose 可执行文件，代码如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo curl -L &quot;https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)&quot; -o /usr/local/bin/docker-compose
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>第二步，为 Docker Compose 可执行文件设置执行权限：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo chmod +x /usr/local/bin/docker-compose
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>现在，Docker 和 Docker Compose 都安好了。为了确认安装是否成功，可以使用后面的命令验证：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>docker --version
docker-compose --version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来，我们就可以启动大数据项目了。首先需要使用命令克隆仓库：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>git clone https://github.com/spancer/bigdata-docker-compose.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后，我们打开项目目录运行下面的命令：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> docker-compose up -d 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>等待项目启动成功，我们就可以使用 Hadoop 生态的各个组件，做更多的探索实验啦。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>这节课我们学到了开源大数据生态中的三个重要角色，它们是 Hadoop 大数据平台的基础，负责了文件存储、资源管理和分布式协调。</p><ol><li><p>HDFS 是 Hadoop 的分布式文件系统，<br> 它可以将海量数据分布在集群中的多个节点上进行存储，采用多副本机制保证数据安全。</p></li><li><p>YARN 是 Hadoop 的资源管理系统，<em>负责调度任务并管理资源</em>。</p></li><li><p>ZooKeeper 是<em>分布式协调服务</em>，提供<mark>分布式锁</mark>、<mark>队列</mark>、<mark>通知</mark>等功能，<br> 常用于分布式系统的配置管理、分布式协调和集群管理。</p></li></ol><p>了解了这些组件的原理之后，我们还一起分析了一道综合应用题帮你加深理解。最后，动手环节也必不可少，利用 Docker，可以帮我们快速搭建一套大数据开发环境，课后你有兴趣的话也推荐自己上手试试看。</p><p>欢迎你在留言区和我交流讨论，我们下节课见。</p>`,79),u=[m];function g(v,b){return a(),r("div",null,u)}const x=e(c,[["render",g],["__file","Q49-大数据基础（二）.html.vue"]]);export{x as default};
