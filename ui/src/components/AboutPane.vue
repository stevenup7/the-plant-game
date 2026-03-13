<template>
  <div class="about-overlay" @click.self="emit('close')">
  <div class="content about-pane">
    <button class="about-close" @click="emit('close')" aria-label="Close">×</button>
    <h2>What is this thing?</h2>
    <p>The plant game is a little bit of code that draws pictures of "plants".</p>
    <h2>How does it work?</h2>
    <p>Each plant is described by a genome — a set of numeric and colour genes covering things like branch angle, length, count, thickness, and colour at each level of the plant. Drawing works by recursively branching outward from a root stem up to four levels deep, with each level's shape, spread, and palette determined entirely by its genes. Branches are drawn as tapered SVG paths with quadratic curves so they taper naturally from base to tip; some levels can be rendered with a soft blur for a more painterly feel. Breeding works like biological crossover: the algorithm picks a starting parent at random, then walks gene by gene through the child's genome, copying values from that parent — but at each step there is a small chance to switch source, so children end up with a patchwork of traits from both parents rather than a clean 50/50 split. After crossover, each gene has an independent chance to mutate: numeric genes are nudged towards a new random value rather than jumping to it, which keeps mutations gradual; colour genes and array orderings can be shuffled more freely. The result is that close relatives look similar but distinct, while distant crosses can produce surprising novelty.</p>
    <h2>Who would make this weird thing?</h2>
    <p>The plant game was written by steven upritchard
      <a href="mailto:plant-game@upritchard.com">plant-game@upritchard.com</a></p>
  </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close']);
</script>
