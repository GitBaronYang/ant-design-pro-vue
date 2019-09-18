<template>
  <exception-page type="404" />
</template>

<script>
import { ExceptionPage } from '@/components'

export default {
  components: {
    ExceptionPage
  },
  created () {
    this.$router.push({ name: 'dashboard' })
  }
}
</script>

<style scoped>

</style>
