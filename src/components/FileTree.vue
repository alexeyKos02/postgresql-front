<template>
  <div>
    <ul class="file-tree">
      <li>
        <span class="caret" :class="{ 'caret-down': isOpen.root }" @click="toggle('root')">
          Root
        </span>
        <ul v-show="isOpen.root" class="nested">
          <li>
            <span
              class="caret"
              :class="{ 'caret-down': isOpen.folder1 }"
              @click="toggle('folder1')"
            >
              {{ 'Folder 1' }}
            </span>
            <ul v-show="isOpen.folder1" class="nested">
              <li class="file">
                <FontAwesomeIcon class="icon" icon="fa-solid fa-file" />file1.txt
              </li>
              <li class="file">
                <FontAwesomeIcon class="icon" icon="fa-solid fa-file" />file2.txt
              </li>
            </ul>
          </li>
          <li>
            <span
              class="caret"
              :class="{ 'caret-down': isOpen.folder2 }"
              @click="toggle('folder2')"
            >
              {{ 'Folder 2' }}
            </span>
            <ul v-show="isOpen.folder2" class="nested">
              <li class="file">
                <FontAwesomeIcon class="icon" icon="fa-solid fa-file" />file3.txt
              </li>
              <li>
                <span
                  class="caret"
                  :class="{ 'caret-down': isOpen.folder3 }"
                  @click="toggle('folder3')"
                >
                  {{ 'Folder 3' }}
                </span>
                <ul v-show="isOpen.folder3" class="nested">
                  <li class="file">
                    <FontAwesomeIcon class="icon" icon="fa-solid fa-file" />file1.txt
                  </li>
                  <li class="file">
                    <FontAwesomeIcon class="icon" icon="fa-solid fa-file" />file2.txt
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li class="file">
            <FontAwesomeIcon class="icon" icon="fa-solid fa-file" />
            File4.txt
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// Состояние для открытых/закрытых элементов
const isOpen = reactive({
  root: false,
  folder1: false,
  folder2: false,
  folder3: false,
});

const toggle = (key: any) => {
  isOpen[key] = !isOpen[key];
};
</script>
<style scoped lang="scss">
/* Стилизация списка */
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
li {
  padding-bottom: 0.5vh;
  ul {
    padding-top: 0.5rem;
    padding-left: 1.5rem;
    border-left: 1px solid #16a085;
    margin-left: 0.35rem;
  }
}

.caret {
  cursor: pointer;
  user-select: none;
}

.caret::before {
  min-width: 0.7rem;
  width: 0.7rem;
  content: '\25B6'; /* Треугольник вправо */
  color: #16a085;
  display: inline-block;
  margin-right: 0.4rem;
  transition: transform 0.3s ease;
}

.caret-down::before {
  transform: rotate(90deg); /* Поворачиваем символ треугольника */
}

.nested {
}

.file-tree {
  // font-family: 'Accid', sans-serif;
  font-size: 17px;
  white-space: nowrap;
  clip-path: inset(0 0 0 0);
}

.file {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.icon {
  color: #16a085;
  min-width: 0.7rem;
  width: 0.7rem;
  margin-right: 0.4rem;
}
</style>
