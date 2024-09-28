<template>
  <Teleport to="body">
    <div v-if="visible" class="loading-overlay">
      <ProgressSpinner strokeWidth="4" animationDuration=".6s" style="width: 80px; height: 80px" />
    </div>
  </Teleport>
</template>
  
  <script setup>
import { defineProps } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
</script>
<style>
:root {
  --p-progressspinner-color-1: #CBE4DE !important;
  --p-progressspinner-color-2: #2A816C !important;
  --p-progressspinner-color-3: #CBE4DE !important;
  --p-progressspinner-color-4: #2A816C !important;

}
</style>
  
<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-message {
  margin-top: 1rem;
  color: #333;
  font-size: 1rem;
}
</style>