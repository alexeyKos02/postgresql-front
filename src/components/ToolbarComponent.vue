<script setup lang="ts">
import Toolbar from 'primevue/toolbar';
import Avatar from 'primevue/avatar';
import { ref } from 'vue';
import Toast from 'primevue/toast';
import CustomPopover from './CustomPopover.vue';

const popupOptions = ref([{ name: 'Открыть в новом окне', code: 'create' }]);

const toggle = (id: string) => {
  switch (id) {
    case 'cluster':
      console.log('cluster2');
      break;
    case 'users':
      console.log('users2');
      break;
    case 'securityGroups':
      console.log('securityGroups2');
      break;
  }
};

function openNewModule(popover: object | null) {
  if (!popover) {
    return;
  }

  const id = popover.$attrs?.id || popover.$el?.id;

  if (!id) {
    return;
  }

  switch (id) {
    case 'cluster':
      console.log('cluster');
      break;
    case 'users':
      console.log('users');
      break;
    case 'securityGroups':
      console.log('securityGroups');
      break;
  }
}
</script>
<template>
  <div class="card">
    <Toast />
    <Toolbar class="toolbar">
      <template #start>
        <div class="start-comp">
          <img class="logo" alt="icon" src="../assets/icon.svg" />
          <CustomPopover
            label="Кластер"
            popoverId="cluster"
            :popupOptions="popupOptions"
            :customToggle="toggle"
            :customOpenNewModule="openNewModule"
          />
          <CustomPopover
            label="Пользователи"
            popoverId="users"
            :popupOptions="popupOptions"
            :customToggle="toggle"
            :customOpenNewModule="openNewModule"
          />
          <CustomPopover
            label="securityGroups"
            popoverId="securityGroups"
            :popupOptions="popupOptions"
            :customToggle="toggle"
            :customOpenNewModule="openNewModule"
          />
        </div>
      </template>

      <template #end>
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          style="width: 32px; height: 32px"
        />
      </template>
    </Toolbar>
  </div>
</template>

<style scoped lang="scss">
.card {
  position: fixed;
  width: 100%;
  z-index: 1000;
}
.toolbar {
  padding-left: 2vw;
  padding-right: 2vw;
}
.start-comp {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo {
  width: 36px;
}
</style>
