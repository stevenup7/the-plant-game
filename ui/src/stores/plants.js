import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlantsStore = defineStore('plants', () => {
  const drawingObjects = ref([]);
  const mutationChance = ref(0.1);

  function init(count = 24) {
    const current = drawingObjects.value;
    if (count > current.length) {
      for (let i = current.length; i < count; i++) {
        current.push({ id: i });
      }
    } else {
      drawingObjects.value = current.slice(0, count);
    }
  }

  function getDrawingById(id) {
    return drawingObjects.value.find(o => o.id === id)?.drawing;
  }

  function handleDrop({ target, dragged, action }) {
    const drag = getDrawingById(target);
    const drop = getDrawingById(dragged);
    if (action === 'swap') {
      swap(drag, drop);
    } else {
      breed(drag, drop);
    }
  }

  function breed(drag, drop) {
    const dragGenes = drag.genes.clone();
    const dropGenes = drop.genes.clone();
    drawingObjects.value.forEach(drawing => {
      if (drawing.locked !== true) {
        drawing.drawing.genes = dragGenes.breed(dropGenes, 0.1, mutationChance.value);
        drawing.drawing.draw();
      }
    });
  }

  function breedChecked() {
    const parents = drawingObjects.value.filter(o => o.locked === true);
    if (parents.length < 2) return;
    drawingObjects.value.forEach(drawing => {
      if (drawing.locked === true) return;
      const a = parents[Math.floor(Math.random() * parents.length)];
      let b = parents[Math.floor(Math.random() * parents.length)];
      if (parents.length > 1) {
        while (b === a) b = parents[Math.floor(Math.random() * parents.length)];
      }
      drawing.drawing.genes = a.drawing.genes.clone().breed(b.drawing.genes.clone(), 0.1, mutationChance.value);
      drawing.drawing.draw();
    });
  }

  function swap(drag, drop) {
    drag.swap(drop);
    drop.draw();
    drag.draw();
  }

  function moveToFront(id) {
    const arr = drawingObjects.value;
    const idx = arr.findIndex(o => o.id === id);
    const firstUnlocked = arr.findIndex(o => o.locked !== true);
    if (idx === -1 || firstUnlocked === -1 || idx <= firstUnlocked) return;
    [arr[firstUnlocked], arr[idx]] = [arr[idx], arr[firstUnlocked]];
  }

  function moveToBack(id) {
    const arr = drawingObjects.value;
    const idx = arr.findIndex(o => o.id === id);
    const lastLocked = arr.reduce((last, o, i) => o.locked === true ? i : last, -1);
    if (idx === -1 || lastLocked === -1 || idx >= lastLocked) return;
    [arr[lastLocked], arr[idx]] = [arr[idx], arr[lastLocked]];
  }

  function random() {
    drawingObjects.value.forEach(drawing => {
      if (drawing.locked !== true) {
        drawing.drawing.genes.randomize();
        drawing.drawing.draw();
      }
    });
  }

  function save(name) {
    const saveData = {};
    drawingObjects.value.forEach(drawing => {
      saveData['drawing' + drawing.id] = drawing.drawing.genes.toJSON();
    });
    saveData._count = drawingObjects.value.length;
    localStorage.setItem('plants:' + name, JSON.stringify(saveData));
  }

  function getSaveCount(name) {
    const data = JSON.parse(localStorage.getItem('plants:' + name));
    if (!data) return 24;
    return data._count ?? Object.keys(data).filter(k => k.startsWith('drawing')).length;
  }

  function load(name) {
    const data = JSON.parse(localStorage.getItem('plants:' + name));
    if (!data) return;
    Object.entries(data).forEach(([k, v]) => {
      const objectId = parseInt(k.replace('drawing', ''), 10);
      if (drawingObjects.value[objectId]) {
        drawingObjects.value[objectId].drawing.genes.fromJSON(v);
        drawingObjects.value[objectId].drawing.draw();
      }
    });
  }

  function listSaves() {
    return Object.keys(localStorage)
      .filter(k => k.startsWith('plants:'))
      .map(k => k.slice('plants:'.length));
  }

  function deleteSave(name) {
    localStorage.removeItem('plants:' + name);
  }

  return { drawingObjects, mutationChance, init, handleDrop, breedChecked, random, moveToFront, moveToBack, save, load, getSaveCount, listSaves, deleteSave };
});
