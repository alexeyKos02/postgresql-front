<template>
  <div>
    <div class="outer-card">
      <div class="inner-card">
        <FloatLabel variant="on">
          <InputText id="email" v-model="email" autocomplete="off" class="full-width" />
          <label for="email">Email</label>
        </FloatLabel>
      </div>
      <Button icon="pi pi-check" rounded aria-label="Filter" />
    </div>
    <div class="radio-buttons--wrapper">
      <div class="radio-buttons">
        <div class="radio-buttons--element">
          <RadioButton v-model="ingredient" inputId="Admin" name="pizza" value="Cheese" />
          <label for="Admin">Admin</label>
        </div>
        <div class="radio-buttons--element">
          <RadioButton v-model="ingredient" inputId="Editor" name="pizza" value="Mushroom" />
          <label for="Editor">Editor</label>
        </div>
        <div class="radio-buttons--element">
          <RadioButton v-model="ingredient" inputId="Viewer" name="pizza" value="Pepper" />
          <label for="Viewer">Viewer</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RadioButton from 'primevue/radiobutton'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Button from 'primevue/button'
import { useRenderStore } from '@/stores'
import { TypeModule } from '@/types/components'
const store = useRenderStore()
const email = ref('')
const role = ref('')
const ingredient = ref('')
const search = (event) => {
  items.value = [...Array(10).keys()].map((item) => event.query + '-' + item)
}

const backAction = () => {
  if (store.centerModule) {
    store.centerModule.type = TypeModule.Space
  }
}
const closeModal = () => {
  if (store.centerModule) {
    store.centerModule.isActive = false
  }
}
</script>

<style lang="scss" scoped>
.outer-card {
  display: flex;
  gap: 1rem;
  width: 100%;
  align-items: center;
  button {
    height: 2vw;
  } /* занимать всю ширину родительского элемента */
}

.inner-card {
  width: 100%; /* занимать всю ширину родительского элемента */
}

.full-width {
  width: 100%; /* занимать всю ширину родительского элемента */
}
.auto {
  background-color: aqua;
  input {
    width: 100% !important;
  }
}
.radio-buttons--wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1.5vh;
  margin-right: 2vw;
}
.radio-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.radio-buttons--element {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.control-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
