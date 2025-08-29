<template>
  <div class="loading-container">
    <ion-spinner name="crescent"></ion-spinner>
  </div>
</template>

<script setup lang="ts">
import { IonSpinner } from "@ionic/vue";
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
