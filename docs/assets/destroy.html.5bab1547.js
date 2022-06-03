import{c as s}from"./app.269b6a4d.js";import{_ as n}from"./plugin-vue_export-helper.21dcd24c.js";const a={},e=s(`<h1 id="destroy" tabindex="-1"><a class="header-anchor" href="#destroy" aria-hidden="true">#</a> destroy</h1><hr><p>If you need to destroy the cached page components, you can use destroy to destroy</p><ul><li>destroy property and method parameters are Route.name <code>String | Array</code>, the only special value: <code>ALL</code> destroy all</li><li>Provide the <code>$keepRouter</code> global object in the Vue instance</li></ul><h3 id="destroy-inside-vue-instance" tabindex="-1"><a class="header-anchor" href="#destroy-inside-vue-instance" aria-hidden="true">#</a> Destroy inside Vue instance</h3><hr><div class="language-vue ext-vue line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">&lt;router-link :to=&quot;{name: &#39;Home&#39;, destroy: &#39;About&#39;}&quot;&gt;</span></span>
<span class="line"><span style="color:#D4D4D4;">  Jump to the Home page and destroy the About page</span></span>
<span class="line"><span style="color:#D4D4D4;">&lt;/router-link&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">&lt;button @click=&quot;$router.replace({name: &#39;Home&#39;, destroy: &#39;About&#39;})&quot;&gt;</span></span>
<span class="line"><span style="color:#D4D4D4;">  Jump to the Home page and destroy the About page</span></span>
<span class="line"><span style="color:#D4D4D4;">&lt;button&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">&lt;button @click=&quot;$router.push({name: &#39;Home&#39;, destroy: [&#39;Page1&#39;, &#39;Page2&#39;]})&quot;&gt;</span></span>
<span class="line"><span style="color:#D4D4D4;">  Jump to the Home page and destroy the Page1 and Page2 pages</span></span>
<span class="line"><span style="color:#D4D4D4;">&lt;button&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">&lt;button @click=&quot;$router.push({name: &#39;Home&#39;, destroy: &#39;ALL&#39;})&quot;&gt;</span></span>
<span class="line"><span style="color:#D4D4D4;">  Jump to the Home page and destroy all cached pages</span></span>
<span class="line"><span style="color:#D4D4D4;">&lt;button&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">&lt;button</span></span>
<span class="line"><span style="color:#D4D4D4;">  @click=&quot;() =&gt; {</span></span>
<span class="line"><span style="color:#D4D4D4;">    $router.push({name: &#39;Home&#39;});</span></span>
<span class="line"><span style="color:#D4D4D4;">    $keepRouter.destroy(&#39;About&#39;);</span></span>
<span class="line"><span style="color:#D4D4D4;">  }&quot;</span></span>
<span class="line"><span style="color:#D4D4D4;">&gt; Jump to the Home page and destroy the About page &lt;button&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h3 id="destroy-outside-the-vue-instance" tabindex="-1"><a class="header-anchor" href="#destroy-outside-the-vue-instance" aria-hidden="true">#</a> Destroy outside the Vue instance</h3><hr><div class="language-javascript ext-js line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#C586C0;">import</span><span style="color:#D4D4D4;"> { </span><span style="color:#9CDCFE;">destroy</span><span style="color:#D4D4D4;"> } </span><span style="color:#C586C0;">from</span><span style="color:#D4D4D4;"> </span><span style="color:#CE9178;">&#39;vue-keep&#39;</span><span style="color:#D4D4D4;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCDCAA;">destroy</span><span style="color:#D4D4D4;">([</span><span style="color:#CE9178;">&#39;Page1&#39;</span><span style="color:#D4D4D4;">, </span><span style="color:#CE9178;">&#39;Page2&#39;</span><span style="color:#D4D4D4;">]);</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div>`,10);function l(p,t){return e}var c=n(a,[["render",l]]);export{c as default};
