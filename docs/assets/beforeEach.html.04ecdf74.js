import{c as s}from"./app.269b6a4d.js";import{_ as n}from"./plugin-vue_export-helper.21dcd24c.js";const a={},e=s(`<h1 id="navigation-guard" tabindex="-1"><a class="header-anchor" href="#navigation-guard" aria-hidden="true">#</a> Navigation guard</h1><hr><h2 id="global-front-guard" tabindex="-1"><a class="header-anchor" href="#global-front-guard" aria-hidden="true">#</a> Global front guard</h2><p>The <strong>beforeEach</strong> method is somewhat similar to the <strong>beforeEach</strong> in <code>router</code>, but not exactly the same. The beforeEach in <code>VueKeep</code> is mainly for more flexible dynamic destruction of the page component.</p><p>You can use keepRouter.beforeEach to register a global front guard:</p><div class="language-javascript ext-js line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#C586C0;">import</span><span style="color:#D4D4D4;"> { </span><span style="color:#9CDCFE;">beforeEach</span><span style="color:#D4D4D4;"> } </span><span style="color:#C586C0;">from</span><span style="color:#D4D4D4;"> </span><span style="color:#CE9178;">&#39;vue-keep&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">const</span><span style="color:#D4D4D4;"> </span><span style="color:#4FC1FF;">unBeforeEach</span><span style="color:#D4D4D4;"> = </span><span style="color:#DCDCAA;">beforeEach</span><span style="color:#D4D4D4;">((</span><span style="color:#9CDCFE;">to</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">from</span><span style="color:#D4D4D4;">) </span><span style="color:#569CD6;">=&gt;</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">  </span><span style="color:#6A9955;">// Triggered when the router jumps</span></span>
<span class="line"><span style="color:#D4D4D4;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCDCAA;">setTimeout</span><span style="color:#D4D4D4;">(() </span><span style="color:#569CD6;">=&gt;</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">  </span><span style="color:#DCDCAA;">unBeforeEach</span><span style="color:#D4D4D4;">() </span><span style="color:#6A9955;">// Destroy the global front guard after 20 seconds</span></span>
<span class="line"><span style="color:#D4D4D4;">}, </span><span style="color:#B5CEA8;">20000</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h2 id="page-front-guard" tabindex="-1"><a class="header-anchor" href="#page-front-guard" aria-hidden="true">#</a> page front guard</h2><p>You can also use keepRouter.beforeEach to register a <code>page front guard</code> to optimize your program as needed:</p><blockquote><p>The first parameter is the <code>name</code> in <code>route</code></p></blockquote><div class="language-javascript ext-js line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#DCDCAA;">created</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">  </span><span style="color:#6A9955;">// GOOD</span></span>
<span class="line"><span style="color:#D4D4D4;">  </span><span style="color:#569CD6;">const</span><span style="color:#D4D4D4;"> </span><span style="color:#4FC1FF;">query</span><span style="color:#D4D4D4;"> = </span><span style="color:#569CD6;">this</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">$route</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">query</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">  </span><span style="color:#569CD6;">this</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">beforeEach</span><span style="color:#D4D4D4;"> = </span><span style="color:#569CD6;">this</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">$keepRouter</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">beforeEach</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&#39;Goods&#39;</span><span style="color:#D4D4D4;">, (</span><span style="color:#9CDCFE;">to</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">from</span><span style="color:#D4D4D4;">) </span><span style="color:#569CD6;">=&gt;</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> (</span><span style="color:#9CDCFE;">to</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">query</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">id</span><span style="color:#D4D4D4;"> !== </span><span style="color:#9CDCFE;">query</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">id</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">      </span><span style="color:#6A9955;">// reload new page</span></span>
<span class="line"><span style="color:#D4D4D4;">      </span><span style="color:#C586C0;">return</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">to</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">cache</span><span style="color:#D4D4D4;"> = </span><span style="color:#569CD6;">false</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#6A9955;">// old page</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#9CDCFE;">to</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">cache</span><span style="color:#D4D4D4;"> = </span><span style="color:#569CD6;">true</span></span>
<span class="line"><span style="color:#D4D4D4;">  })</span></span>
<span class="line"><span style="color:#D4D4D4;">},</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCDCAA;">destroy</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">  </span><span style="color:#569CD6;">this</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">beforeEach</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><div class="language-javascript ext-js line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#6A9955;">// BAD</span></span>
<span class="line"><span style="color:#DCDCAA;">created</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">  </span><span style="color:#569CD6;">this</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">unBeforeEach</span><span style="color:#D4D4D4;"> = </span><span style="color:#569CD6;">this</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">$keepRouter</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">beforeEach</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&#39;Goods&#39;</span><span style="color:#D4D4D4;">, (</span><span style="color:#9CDCFE;">to</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">from</span><span style="color:#D4D4D4;">) </span><span style="color:#569CD6;">=&gt;</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#6A9955;">/**</span></span>
<span class="line"><span style="color:#6A9955;">     * if to.triggerType = &#39;beforeChange&#39;,</span></span>
<span class="line"><span style="color:#6A9955;">     * Then the route has not changed, at this time this.$route belongs to the route of the previous page, resulting in an error in getting this.$route.query.id</span></span>
<span class="line"><span style="color:#6A9955;">     */</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> (</span><span style="color:#9CDCFE;">to</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">query</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">id</span><span style="color:#D4D4D4;"> !== </span><span style="color:#569CD6;">this</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">$route</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">query</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">id</span><span style="color:#D4D4D4;">) {</span></span>
<span class="line"><span style="color:#D4D4D4;">      </span><span style="color:#6A9955;">// reload new page</span></span>
<span class="line"><span style="color:#D4D4D4;">      </span><span style="color:#C586C0;">return</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">to</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">cache</span><span style="color:#D4D4D4;"> = </span><span style="color:#569CD6;">false</span></span>
<span class="line"><span style="color:#D4D4D4;">    }</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#6A9955;">// old page</span></span>
<span class="line"><span style="color:#D4D4D4;">    </span><span style="color:#9CDCFE;">to</span><span style="color:#D4D4D4;">.</span><span style="color:#9CDCFE;">cache</span><span style="color:#D4D4D4;"> = </span><span style="color:#569CD6;">true</span></span>
<span class="line"><span style="color:#D4D4D4;">  })</span></span>
<span class="line"><span style="color:#D4D4D4;">},</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCDCAA;">destroy</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"><span style="color:#D4D4D4;">  </span><span style="color:#569CD6;">this</span><span style="color:#D4D4D4;">.</span><span style="color:#DCDCAA;">unBeforeEach</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><ul><li>beforeEach in <code>VueKeep</code> is not intended to provide a <code>next</code> method.</li><li>beforeEach in <code>VueKeep</code> also provides the <code>to</code> and <code>from</code> parameters in <code>router.beforeEach</code>.</li></ul><hr><ul><li><strong><code>triggerType</code>(String)</strong>: The trigger types are: beforeChange/change <blockquote><ul><li><strong><code>beforeChange</code></strong>: The routing has not changed, basically it belongs to <code>javaScript</code> triggering the jump is beforeChange</li><li><strong><code>change</code></strong>: The route has changed, and basically it is not a <code>javaScript</code> that triggers the jump is change</li></ul></blockquote></li><li><strong><code>cache</code>(Boolean)</strong>: Whether the jump uses the cached page (if it has been cached), if the <code>triggerType</code> belongs to <code>beforeChange</code>, then you can manually and dynamically modify whether to use the cache.</li><li><strong><code>direction</code>(String)</strong>: The jump belongs to forward/back.</li><li><strong><code>method</code>(String)</strong>: The method that triggers the jump.</li><li><strong><code>state</code>(Object)</strong>: The state object provides the position of the current page in the browser history stack, the return page route, the forward page route, the page route before the current jump, and the page route after the jump.</li></ul><h3 id="about-the-execution-timing-of-keeprouer-beforeeach" tabindex="-1"><a class="header-anchor" href="#about-the-execution-timing-of-keeprouer-beforeeach" aria-hidden="true">#</a> About the execution timing of <code>keepRouer.beforeEach</code></h3><hr><div class="custom-container warning"><p class="custom-container-title">WARNING</p><p><code>keepRouer.beforeEach</code> is always executed before <code>router.beforeEach</code> regardless of whether <code>triggerType</code> is <strong>beforeChange</strong> or <strong>change</strong>.</p></div>`,17);function o(l,p){return e}var t=n(a,[["render",o]]);export{t as default};
