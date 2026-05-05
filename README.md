# visa2p61
Course Webpage


<div class="step">
  <div class="step-number">Finding and linking your 5 significant versions</div>
  <p>Browse your commit history in the terminal:</p>
  <div class="code-block">
    <div class="code-block-header">
      <span class="code-block-label">terminal</span>
      <button class="copy-btn" onclick="copyCode(this)">Copy</button>
    </div>
    <pre>git log --oneline</pre>
  </div>
  <p>To inspect a version you're curious about, check it out:</p>
  <div class="code-block">
    <div class="code-block-header">
      <span class="code-block-label">terminal</span>
      <button class="copy-btn" onclick="copyCode(this)">Copy</button>
    </div>
    <pre>git checkout [short-hash]</pre>
  </div>
  <p>Open your browser to see what the page looks like at that moment. When you find a version worth keeping as one of your five, note the full hash:</p>
  <div class="code-block">
    <div class="code-block-header">
      <span class="code-block-label">terminal</span>
      <button class="copy-btn" onclick="copyCode(this)">Copy</button>
    </div>
    <pre>git show --format="%H" --no-patch</pre>
  </div>
  <p>Once you have your 5 hashes, add them to your <code>username.github.io</code> index page as links:</p>
  <div class="code-block">
    <div class="code-block-header">
      <span class="code-block-label">index.html</span>
      <button class="copy-btn" onclick="copyCode(this)">Copy</button>
    </div>
    <pre>&lt;a href="https://github.com/username/a1-git-labyrinth/commit/[full-hash]"&gt;version 1&lt;/a&gt;</pre>
  </div>
  <p>Add a 1–2 sentence annotation after each link describing what changed and why. When you're done inspecting, return to your working branch:</p>
  <div class="code-block">
    <div class="code-block-header">
      <span class="code-block-label">terminal</span>
      <button class="copy-btn" onclick="copyCode(this)">Copy</button>
    </div>
    <pre>git checkout develop</pre>
  </div>
</div>