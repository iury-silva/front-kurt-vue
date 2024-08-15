<script setup>
import { useCounterStore } from './stores/counter'
import { computed } from 'vue'
import Button from 'primevue/button'

const counterStore = useCounterStore()
const increment = () => {
  counterStore.increment()
}

const decrement = () => {
  counterStore.decrement()
}
const counter = computed(() => counterStore.count)
</script>

<template>
  <div>
    <Button @click="increment">Increment</Button>
    <Button @click="decrement">Decrement</Button>
    <p>Counter: {{ counter }}</p>
    <RouterView />
  </div>
</template>

<style scoped></style>
