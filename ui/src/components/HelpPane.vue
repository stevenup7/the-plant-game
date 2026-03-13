<template>
  <div class="about-overlay" @click.self="emit('close')">
    <div class="content about-pane">
      <button class="about-close" @click="emit('close')" aria-label="Close">×</button>
      <h2>How to play</h2>
      <p>The screen is filled with generated plants. Drag one plant onto another to breed them — their children inherit traits from both parents.</p>
      <h2>Checking &amp; breeding</h2>
      <p>Check the box on any plant to mark it (the will move to the top). Use <strong>breed checked</strong> to breed all marked plants in random pairs.</p>
      <h2>Random</h2>
      <p>Hit <strong>random</strong> to replace all unchecked plants with freshly generated ones. The will help you get fresh genes into your gene pool.</p>
      <h2>Save &amp; load</h2>
      <p>Use <strong>save</strong> to name and store your current garden. Use <strong>load</strong> to restore a saved garden or delete old ones.</p>
      <h2>Config</h2>
      <p>Adjust the <strong>mutation chance</strong> to control how the chance of random mutations when breeding. Change the number of <strong>drawings</strong> to show more or fewer plants.</p>
      <h2>Keyboard shortcuts</h2>
      <p><strong>Ctrl+R</strong> — random &nbsp;·&nbsp; <strong>Ctrl+B</strong> — breed checked</p>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close']);
</script>
