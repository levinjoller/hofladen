<template>
  <TresGroup :position="boxPosition">
    <template v-if="isActive">
      <Box :args="boxArgs" color="orange" />
      <Html :position="[0, 0, 0]" center>
        <div class="label">{{ paloxDisplayName }}</div>
      </Html>
    </template>

    <template v-else>
      <Box :args="boxArgs">
        <TresMeshBasicMaterial :color="inactiveColor" wireframe />
      </Box>
    </template>
  </TresGroup>
</template>

<script setup lang="ts">
import { Box, Html } from "@tresjs/cientos";
import { computed } from "vue";
import { Coordinate } from "@/types/schemas/coordinate-schema";
import { BoxArgsTuple, Vector3Tuple } from "@/types/tres-types";

const props = defineProps<{
  coordinate: Coordinate;
  isActive: boolean;
  paloxDisplayName: string;
}>();

const boxArgs: BoxArgsTuple = [1, 1, 1];
const inactiveColor = "#999999";
const boxPosition = computed<Vector3Tuple>(() => [
  props.coordinate.x_column,
  props.coordinate.y_level,
  props.coordinate.z_slot,
]);
</script>

<style scoped>
.label {
  color: grey;
  font-size: 0.8rem;
  text-align: center;
}
</style>
