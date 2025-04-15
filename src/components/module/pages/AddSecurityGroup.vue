<template>
  <div class="modal-header">
    <h1>Создание новой Security Group</h1>
  </div>
  <form @submit.prevent="handleCreateSecurityGroup" class="security-group-creator">
    <div class="form-line">
      <div class="form-group">
        <label for="name">Название группы</label>
        <InputText id="name" v-model="value" placeholder="Например: my-security-group" required />
      </div>
      <div class="form-group">
        <label for="CIDR"
          >CIDR входящего потока <small>(например, 192.168.1.0/24 или x.x.x.x)</small></label
        >
        <div class="cidr-input">
          <InputText
            id="CIDR"
            v-model="cidr"
            placeholder="192.168.1.0/24"
            :class="{ 'input-error': cidrError }"
            @keyup.enter="addCIDR"
          />
          <Button icon="pi pi-plus" severity="secondary" @click="addCIDR" text rounded />
        </div>
        <span v-if="cidrError" class="error-text">Некорректный или уже добавленный CIDR</span>
      </div>
    </div>

    <div class="form-group">
      <label>Добавленные CIDR:</label>
      <ScrollPanel class="cidr-list" style="width: 100%; height: 150px">
        <div v-if="clusters.length === 0" class="empty-text">CIDR пока не добавлены</div>
        <transition-group name="fade" tag="ul">
          <li v-for="(item, index) in clusters" :key="item.name">
            {{ item.name }}
            <Button
              icon="pi pi-times"
              text
              severity="danger"
              size="small"
              @click="removeCIDR(index)"
            />
          </li>
        </transition-group>
      </ScrollPanel>
    </div>

    <div class="form-actions">
      <Button
        label="Создать группу"
        icon="pi pi-check"
        severity="primary"
        type="submit"
        :disabled="!value || loading"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import ScrollPanel from 'primevue/scrollpanel';
import { useToast } from 'primevue/usetoast';
import type { Cluster } from '@/types/entities';
import { createSecurityGroup } from '@/utils/api';

const props = defineProps<{
  workspaceId: number;
}>();

const toast = useToast();

const value = ref('');
const cidr = ref('');
const clusters = ref<Cluster[]>([]);
const cidrError = ref(false);
const loading = ref(false);

function isValidCIDR(value: string): boolean {
  const cidrPattern = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
  return cidrPattern.test(value.trim());
}

function addCIDR() {
  const trimmed = cidr.value.trim();

  if (!trimmed || !isValidCIDR(trimmed) || clusters.value.some((c) => c.name === trimmed)) {
    cidrError.value = true;
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Некорректный формат или CIDR уже добавлен',
      life: 3000,
    });
    return;
  }

  clusters.value.push({ name: trimmed });
  cidr.value = '';
  cidrError.value = false;

  toast.add({
    severity: 'success',
    summary: 'CIDR добавлен',
    life: 2000,
  });

  setTimeout(() => {
    const panel = document.querySelector('.p-scrollpanel-content');
    if (panel) panel.scrollTop = panel.scrollHeight;
  }, 100);
}

function removeCIDR(index: number) {
  clusters.value.splice(index, 1);
  toast.add({
    severity: 'info',
    summary: 'CIDR удален',
    life: 2000,
  });
}

async function handleCreateSecurityGroup() {
  // Проверка: должен быть хотя бы один CIDR
  if (clusters.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Добавьте хотя бы один CIDR',
      life: 3000,
    });
    return;
  }

  loading.value = true;

  try {
    const requestBody = {
      id: 0,
      name: value.value.trim(),
      allowedIps: clusters.value.map((item) => item.name),
    };

    await createSecurityGroup(props.workspaceId, requestBody);

    toast.add({
      severity: 'success',
      summary: 'Security Group успешно создана',
      detail: value.value,
      life: 3000,
    });

    resetForm();
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка создания группы',
      detail: error.message || 'Не удалось создать группу',
      life: 4000,
    });
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  value.value = '';
  cidr.value = '';
  clusters.value = [];
}
</script>

<style scoped lang="scss">
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;

  h1 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }
}

.security-group-creator {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-line {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    color: #555;
  }

  .cidr-input {
    display: flex;
    align-items: center;
    gap: 8px;

    input {
      flex: 1;
    }
  }

  .error-text {
    color: #e74c3c;
    font-size: 12px;
  }
}

.cidr-list {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0;
  background: #fafafa;

  .p-scrollpanel-content {
    padding: 8px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 4px;
      border-bottom: 1px solid #eee;
      transition: background-color 0.3s ease;

      &:last-child {
        border-bottom: none;
        margin-bottom: 4px;
      }

      &:hover {
        background: #f8f8f8;
      }

      button {
        margin-left: 10px;
      }
    }
  }

  .empty-text {
    text-align: center;
    color: #888;
    font-size: 13px;
    padding: 10px 0;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.input-error {
  border-color: #e74c3c;
}

button,
.p-button {
  transition: all 0.3s ease;
}

button:hover,
.p-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
