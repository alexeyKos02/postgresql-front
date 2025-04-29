<script lang="ts" setup>
import { ref } from 'vue';
import Listbox from 'primevue/listbox';
import Popover from 'primevue/popover';
import Button from 'primevue/button';

const props = defineProps<{
  popoverId: string;
  label: string;
  popupOptions: { name: string; code: string }[];
  customToggle: (id: string) => void;
  customOpenNewModule: (popover: object | null) => void;
  disabled: boolean;
}>();

const op = ref<InstanceType<typeof Popover> | null>(null);
const currentOption = ref();

function toggle(event: Event, id: string) {
  op.value?.toggle(event);
  props.customToggle(id);
}

function openNewModule(popover: object | null) {
  if (!popover) return;
  currentOption.value = '';
  props.customOpenNewModule(popover);
}
</script>

<template>
  <Popover ref="op" class="popup" :id="popoverId">
    <div class="flex flex-col gap-4">
      <Listbox
        v-model="currentOption"
        :options="popupOptions"
        optionLabel="name"
        class="w-full md:w-56"
        @change="() => openNewModule(op)"
      />
    </div>
  </Popover>

  <div class="card flex justify-center">
    <Button
      type="button"
      :label="label"
      @click="($event) => toggle($event, popoverId)"
      class="min-w-48"
      variant="text"
      :disabled="disabled"
    />
  </div>
</template>

<style lang="scss">
.popup {
  .p-popover-content {
    padding: 0;

    .p-listbox {
      border: 0;
    }
  }
}
</style>
