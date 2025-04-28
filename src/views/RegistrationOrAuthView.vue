<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRenderStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const store = useRenderStore();
const { user } = storeToRefs(store);
const router = useRouter();
const toast = useToast();

const signUp = ref(true);
const signUpForForm = ref(true);
const isLoading = ref(false);
const redirecting = ref(false);

const form = reactive({
  username: '',
  email: '',
  password: '',
  secondName: '',
});

const errors = reactive({
  username: '',
  email: '',
  password: '',
  secondName: '',
});

const validateForm = (): boolean => {
  errors.username = '';
  errors.secondName = '';
  errors.email = '';
  errors.password = '';

  let isValid = true;

  if (signUpForForm.value) {
    if (!form.username.trim()) {
      errors.username = 'Имя пользователя обязательно.';
      isValid = false;
    }

    if (!form.secondName.trim()) {
      errors.secondName = 'Фамилия пользователя обязательна.';
      isValid = false;
    }
  }

  if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Введите корректный E-mail.';
    isValid = false;
  }

  if (form.password.length < 2) {
    errors.password = 'Пароль должен быть не менее 6 символов.';
    isValid = false;
  }

  return isValid;
};

const titleText = computed(() => (signUpForForm.value ? 'Регистрация' : 'Вход'));

function changeType() {
  resetFields(errors);
  resetFields(form);

  if (!signUp.value) {
    signUp.value = !signUp.value;
    setTimeout(() => {
      signUpForForm.value = !signUpForForm.value;
    }, 250);
  } else {
    signUp.value = !signUp.value;
    signUpForForm.value = !signUpForForm.value;
  }
}

function resetFields(fields: any) {
  Object.keys(fields).forEach((key) => {
    fields[key] = '';
  });
}

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    if (signUpForForm.value) {
      await store.signup({
        firstName: form.username,
        email: form.email,
        password: form.password,
        lastName: form.secondName,
      });

      toast.add({
        severity: 'success',
        summary: 'Успех',
        detail: 'Регистрация прошла успешно!',
        life: 2500,
      });

      redirecting.value = true;
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } else {
      await store.login({
        email: form.email,
        password: form.password,
      });

      toast.add({
        severity: 'success',
        summary: 'Добро пожаловать',
        detail: 'Вход выполнен успешно!',
        life: 2500,
      });

      redirecting.value = true;
      setTimeout(() => {
        router.push('/main');
      }, 1200);
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error?.response?.data?.message || 'Не удалось войти',
      life: 4000,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Toast />
  <div class="wrapper">
    <div class="module" :class="{ 'right-panel-active': !signUp }">
      <!-- Overlay -->
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>С возвращением!</h1>
            <p>Ждем скорейшей работы с тобой</p>
            <button class="ghost" @click="changeType">Присоединиться</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>Привет!</h1>
            <p>Вводи свои данные и присоединяйся к нам</p>
            <button class="ghost" @click="changeType">Войти</button>
          </div>
        </div>
      </div>

      <!-- Регистрация / Вход -->
      <div class="register-page">
        <h1>{{ titleText }}</h1>

        <form @submit.prevent="handleSubmit" class="form">
          <transition name="fade">
            <div v-show="signUpForForm" class="form-group">
              <input
                v-model="form.username"
                type="text"
                :class="{ error: errors.username }"
                placeholder="Имя пользователя"
              />
              <small class="error-message" :class="{ 'animated-text': errors.username }">{{
                errors.username
              }}</small>
            </div>
          </transition>

          <transition name="fade">
            <div v-show="signUpForForm" class="form-group">
              <input
                v-model="form.secondName"
                type="text"
                :class="{ error: errors.secondName }"
                placeholder="Фамилия пользователя"
              />
              <small class="error-message" :class="{ 'animated-text': errors.secondName }">{{
                errors.secondName
              }}</small>
            </div>
          </transition>

          <div class="form-group">
            <input
              v-model="form.email"
              type="email"
              :class="{ error: errors.email }"
              placeholder="Введите E-mail"
            />
            <small class="error-message" :class="{ 'animated-text': errors.email }">{{
              errors.email
            }}</small>
          </div>

          <div class="form-group">
            <input
              v-model="form.password"
              type="password"
              :class="{ error: errors.password }"
              placeholder="Введите пароль"
            />
            <small class="error-message" :class="{ 'animated-text': errors.password }">{{
              errors.password
            }}</small>
          </div>

          <button type="submit" :disabled="isLoading">
            <template v-if="isLoading">Загрузка...</template>
            <template v-else>{{ signUpForForm ? 'Зарегистрироваться' : 'Войти' }}</template>
          </button>
        </form>
      </div>
    </div>
  </div>

  <!-- Плавный редирект -->
  <transition name="fade">
    <div v-if="redirecting" class="overlay-loading">
      <div class="spinner" />
    </div>
  </transition>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  position: relative;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
}
.module {
  position: relative;
  display: flex;
  width: 50vw;
  height: 63vh;
  align-items: center;
  border-radius: 10px;
  box-shadow:
    0 14px 28px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.22);
}
.register-page {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 50%;
  left: 0;
  padding: 0 3vw;
  text-align: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  transition: transform 0.6s ease-in-out;
}
.module.right-panel-active .register-page {
  transform: translateX(100%);
}
.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}
.module.right-panel-active .overlay-container {
  transform: translateX(-100%);
}
.overlay {
  background: linear-gradient(90deg, #2c3e50, #34495e);
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  border-radius: 10px;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}
.module.right-panel-active .overlay {
  transform: translateX(50%);
}
.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  font-size: 1.3rem;
  transition: transform 0.6s ease-in-out;
}
.overlay-left {
  transform: translateX(-20%);
}
.module.right-panel-active .overlay-left {
  transform: translateX(0);
}
.overlay-right {
  right: 0;
  transform: translateX(0);
}
.module.right-panel-active .overlay-right {
  transform: translateX(20%);
}
.form {
  width: 100%;
}
h1 {
  font-size: 2rem;
  margin: 0;
}
.form-group {
  text-align: left;
}
input {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.95rem;
  background: #eee;
  border: none;
  transition: all 0.3s ease;
}
input:focus {
  background-color: #fff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.4);
}
input.error {
  border: 1px solid red;
}
.error-message {
  display: block;
  height: 1.2rem;
  color: darkred;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}
.animated-text {
  clip-path: inset(0 100% 0 0);
  animation: reveal-text 1.2s ease forwards;
}
@keyframes reveal-text {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
button {
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(90deg, #1abc9c, #16a085);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
button:hover {
  background: linear-gradient(90deg, #0056b3, #003d80);
}
button:disabled {
  background: grey;
  cursor: not-allowed;
}
.overlay-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #16a085;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
