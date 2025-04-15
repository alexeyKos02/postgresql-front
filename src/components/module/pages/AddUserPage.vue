<template>
  <div>
    <div class="modal-header">
      <h1>Создание нового пользователя</h1>
    </div>

    <!-- Информационная плашка -->
    <div class="info-banner">
      <FontAwesomeIcon icon="fa-solid fa-circle-info" class="info-icon" />
      <p class="info-text">
        Приглашение можно отправить только пользователю, зарегистрированному в системе.
      </p>
    </div>

    <!-- Email + кнопка -->
    <div class="outer-card">
      <div class="input-group">
        <FloatLabel>
          <InputText
            id="email"
            v-model="email"
            autocomplete="off"
            class="full-width"
            @blur="onEmailBlur"
            :class="{ 'input-error': emailTouched && !isValidEmail(email) }"
          />
          <label for="email">Email</label>
        </FloatLabel>

        <div class="error-container">
          <p class="error-msg" v-if="emailTouched && !isValidEmail(email)">
            Введите корректный email
          </p>
        </div>
      </div>

      <Button
        icon="pi pi-check"
        rounded
        aria-label="Добавить"
        class="check-btn"
        @click="invite"
      />
    </div>

    <!-- Выбор роли -->
    <div class="radio-buttons--wrapper">
      <div class="radio-buttons">
        <div class="radio-buttons--element" v-for="r in roles" :key="r.value">
          <RadioButton
            v-model="role"
            :inputId="r.value"
            name="role"
            :value="r.value"
          />
          <label :for="r.value">{{ r.label }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RadioButton from 'primevue/radiobutton';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { inviteUserToWorkspace } from '@/utils/api';
import type { InviteUserDto } from '@/types/api';

const props = defineProps<{ workspaceId: number }>();
const toast = useToast();

const email = ref('');
const role = ref('');
const emailTouched = ref(false);

const roles = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Editor', value: 'Editor' },
  { label: 'Viewer', value: 'Viewer' },
];

const roleMap: Record<string, number> = {
  Viewer: 0,
  Editor: 1,
  Admin: 2,
};

function isValidEmail(value: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
}

function onEmailBlur() {
  emailTouched.value = true;
}

async function invite() {
  emailTouched.value = true;

  if (!isValidEmail(email.value)) {
    toast.add({
      severity: 'warn',
      summary: 'Неверный email',
      detail: 'Пожалуйста, введите корректный email',
      life: 3000,
    });
    return;
  }

  if (!role.value) {
    toast.add({
      severity: 'warn',
      summary: 'Роль не выбрана',
      detail: 'Пожалуйста, выберите роль',
      life: 3000,
    });
    return;
  }

  try {
    const inviteData: InviteUserDto = {
      email: email.value,
      role: roleMap[role.value],
    };

    await inviteUserToWorkspace(props.workspaceId, inviteData);

    toast.add({
      severity: 'success',
      summary: 'Приглашение отправлено',
      detail: `${email.value} (роль: ${role.value})`,
      life: 3000,
    });

    email.value = '';
    role.value = '';
    emailTouched.value = false;
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error?.response?.data?.message || error?.message || 'Не удалось отправить приглашение',
      life: 4000,
    });
  }
}
</script>

<style scoped lang="scss">
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background-color: #f1f5f9;
  border-left: 4px solid #3b82f6;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 16px;
  color: #334155;
  font-size: 14px;
}

.info-icon {
  font-size: 16px;
  color: #3b82f6;
  margin-top: 2px;
}

.outer-card {
  display: flex;
  gap: 12px;
  width: 100%;
  align-items: flex-start;
  margin-top: 3vh;
}

.input-group {
  flex-grow: 1;
  position: relative;
}

.full-width {
  width: 100%;
}

.input-error {
  border-color: #e74c3c !important;
}

.error-container {
  min-height: 20px;
  margin-top: 4px;
}

.error-msg {
  color: #e74c3c;
  font-size: 12px;
  margin: 0;
}

.check-btn {
  height: 42px;
  width: 42px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-buttons--wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2vh;
}

.radio-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.radio-buttons--element {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
