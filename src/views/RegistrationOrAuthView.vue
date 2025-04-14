<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useRenderStore } from '@/stores';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'; // Для редиректа
import { getClusters } from '@/utils/api';

const store = useRenderStore();
const { user } = storeToRefs(store);
const router = useRouter();

const signUp = ref<boolean>(true);
const signUpForForm = ref<boolean>(true);

// Loader
const isLoading = ref<boolean>(false);

// Состояние формы
const form = reactive({
  username: '',
  email: '',
  password: '',
  secondName: '',
});

// Состояние ошибок
const errors = reactive({
  username: '',
  email: '',
  password: '',
  secondName: '',
});

// Валидация формы
// const validateForm = (): boolean => {
//   errors.username = form.username.trim() ? '' : 'Имя пользователя обязательно.';
//   errors.secondName = form.secondName.trim() ? '' : 'Фамилия пользователя обязательна.';
//   errors.email = /\S+@\S+\.\S+/.test(form.email) ? '' : 'Введите корректный E-mail.';
//   errors.password = form.password.length >= 6 ? '' : 'Пароль должен быть не менее 6 символов.';

//   return !errors.username && !errors.email && !errors.password && !errors.secondName;
// };

const validateForm = (): boolean => {
  // Сброс ошибок
  errors.username = '';
  errors.secondName = '';
  errors.email = '';
  errors.password = '';

  let isValid = true;

  if (signUpForForm.value) {
    // Валидация для регистрации
    if (!form.username.trim()) {
      errors.username = 'Имя пользователя обязательно.';
      isValid = false;
    }

    if (!form.secondName.trim()) {
      errors.secondName = 'Фамилия пользователя обязательна.';
      isValid = false;
    }
  }

  // Общая валидация для email и пароля (и для логина, и для регистрации)
  if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Введите корректный E-mail.';
    isValid = false;
  }

  // if (form.password.length < 6) {
  //   errors.password = 'Пароль должен быть не менее 6 символов.';
  //   isValid = false;
  // }

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

// Обработка отправки формы
const handleSubmit = async () => {
  console.log("ffff");
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    if (signUpForForm.value) {
      // Режим регистрации
      await store.signup({
        firstName: form.username,
        email: form.email,
        password: form.password,
        lastName: form.secondName,
      });
      alert('Регистрация прошла успешно!');
    } else {
      await getClusters(1);
      // Режим логина
      // await store.login({
      //   email: form.email,
      //   password: form.password,
      // });
      // alert('Вход выполнен успешно!');
    }

    await router.push('/');
  } catch (error: any) {
    alert(`Ошибка: ${error?.response?.data?.message || 'Что-то пошло не так'}`);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="wrapper">
    <div class="module" :class="{ 'right-panel-active': !signUp }">
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
      <div class="register-page">
        <h1>{{ titleText }}</h1>
        <div class="social-section">
          <div class="social-icon facebook">
            <i class="fab fa-facebook-f"></i>
          </div>
          <div class="social-icon vk">
            <i class="fab fa-brands fa-vk"></i>
          </div>
          <div class="social-icon google">
            <i class="fab fa-brands fa-google-plus-g"></i>
          </div>
        </div>
        <form @submit.prevent="handleSubmit" class="form">
          <transition :duration="{ enter: 3000, leave: 300 }" name="fade">
            <div v-show="signUpForForm" class="form-group">
              <input
                id="username"
                v-model="form.username"
                type="text"
                :class="{ error: errors.username }"
                placeholder="Введите имя пользователя"
              />
              <small class="error-message" :class="{ 'animated-text': errors.username }">{{
                errors.username
              }}</small>
            </div>
          </transition>

          <transition :duration="{ enter: 3000, leave: 300 }" name="fade">
            <div v-show="signUpForForm" class="form-group">
              <input
                id="secondName"
                v-model="form.secondName"
                type="text"
                :class="{ error: errors.secondName }"
                placeholder="Введите фамилию пользователя"
              />
              <small class="error-message" :class="{ 'animated-text': errors.secondName }">{{
                errors.secondName
              }}</small>
            </div>
          </transition>

          <div class="form-group">
            <input
              id="email"
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
              id="password"
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
</template>

<style scoped lang="scss">
/* Весь твой стиль как был — оставляю без изменений для полной совместимости */
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
  top: 0;
  bottom: 0;
  left: 0;
  padding: 0 3vw 0 3vw;
  text-align: center;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  transition: transform 0.6s ease-in-out;
}
.module.right-panel-active .register-page {
  transform: translateX(100%);
}

.form {
  width: 100%;
}

h1 {
  font-size: 2rem;
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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
  transition: border-color 0.3s, background-color 0.3s;
}

input:focus {
  border-color: #007bff;
  background-color: #ffffff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.4);
}

input.error {
  border-color: red;
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
  animation: reveal-text 2s ease forwards;
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

.social-section {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  .social-icon {
    width: 2vw;
    height: 2vw;
    background-color: transparent;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    border: 1px solid #dddddd;
    font-size: 1vw;
    cursor: pointer;
    transition: all 0.2s;
  }
  .facebook:hover {
    color: white;
    background-color: #4267b2;
  }
  .vk:hover {
    color: white;
    background-color: #4d7198;
  }
  .google:hover {
    color: white;
    background-color: #db4437;
  }
  .social-icon:hover {
    transform: scale(1.1);
  }
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
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  font-size: 1.3rem;
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
</style>
