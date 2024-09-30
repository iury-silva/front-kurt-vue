<template>
  <div>
    {{ route.params.id }}
  </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>