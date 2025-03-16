<template>
  <div class="modal-header">
    <h1>Создание нового кластера</h1>
  </div>

  <form @submit.prevent="submitForm">
    <div class="form-group">
      <label for="cluster-name">Имя кластера</label>
      <input type="text" id="cluster-name" v-model="form.clusterName" required />
    </div>

    <div class="small-groups">
      <div class="form-group">
        <label for="cpu">Количество CPU</label>
        <InputText v-model.number="form.cpu" />
        <Slider v-model="form.cpu" :min="100" :max="800" />
      </div>

      <div class="form-group">
        <label for="ram">Объем RAM (GB)</label>
        <InputText v-model.number="form.ram" />
        <Slider v-model="form.ram" :min="300" :max="1500" />
      </div>

      <div class="form-group">
        <label for="storage-size">Размер хранилища (GB)</label>
        <InputText v-model.number="form.storageSize" />
        <Slider v-model="form.storageSize" :max="10" />
      </div>
    </div>

    <div class="double--not-equal">
      <div class="form-group">
        <label for="db-name">Имя базы данных</label>
        <input type="text" id="db-name" v-model="form.dbName" required />
      </div>

      <div class="form-group">
        <label for="pg-version">Версия PostgreSQL</label>
        <Select
          id="PostgreSQL"
          v-model="form.pgVersion"
          :options="postVersion"
          optionLabel="name"
          placeholder="выберите версию"
          required
        />
      </div>
    </div>

    <div class="double-group">
      <div class="form-group">
        <label for="username">Имя пользователя</label>
        <input type="text" id="username" v-model="form.username" required />
      </div>

      <div class="form-group">
        <label for="password">Пароль пользователя</label>
        <input type="password" id="password" v-model="form.password" required />
      </div>
    </div>

    <div class="double-group">
      <div class="form-group">
        <label for="security-group">Выбор Security Group</label>
        <MultiSelect
          v-model="form.securityGroup"
          :options="cities"
          filter
          optionLabel="name"
          placeholder="Security Group"
          :maxSelectedLabels="4"
        />
      </div>

      <div class="form-group">
        <label for="replicas">Количество реплик</label>
        <InputText v-model.number="form.replicas" />
        <Slider v-model="form.replicas" :max="3" />
      </div>
    </div>
    <div class="form-group">
      <label for="maintenance-window">Окно обслуживания</label>
      <div class="double-group">
        <InputText style="flex: 1" v-model="startFormattedLabel" @blur="validateAndUpdateStart" />
        <InputText style="flex: 1" v-model="endFormattedLabel" @blur="validateAndUpdateEnd" />
      </div>
      <Slider v-model="form.maintenanceWindow" range :max="1440" />
    </div>

    <div class="form-group">
      <label for="backup">Параметры резервного копирования</label>
      <input type="text" id="backup" v-model="form.backup" />
    </div>

    <div class="modal-footer">
      <Button icon="pi pi-check" aria-label="Filter" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRenderStore } from '@/stores';
import { TypeModule } from '@/types/components';
import Button from 'primevue/button';
import Slider from 'primevue/slider';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';

const value = ref(50);
const store = useRenderStore();

const form = ref({
  clusterName: '',
  cpu: 100,
  ram: 300,
  pgVersion: '13',
  storageSize: 1,
  dbName: '',
  username: '',
  password: '',
  securityGroup: [],
  replicas: 0,
  maintenanceWindow: [0, 1440],
  backup: '',
});

const cities = ref([
  { name: 'первый', code: 'NY' },
  { name: 'второй', code: 'RM' },
  { name: 'третий', code: 'LDN' },
  { name: 'четвертый', code: 'IST' },
  { name: 'пятый', code: 'PRS' },
]);

const postVersion = [
  { name: '13', code: '13' },
  { name: '14', code: '14' },
  { name: '15', code: '15' },
];

const startFormattedLabel = ref<string>('00:00');
const startTime = computed(() => form.value.maintenanceWindow[0]);
const startFormattedTime = computed(() => {
  const hours = Math.floor(startTime.value / 60);
  const minutes = startTime.value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});

const endFormattedLabel = ref<string>('24:00');
const endTime = computed(() => form.value.maintenanceWindow[1]);
const endFormattedTime = computed(() => {
  const hours = Math.floor(endTime.value / 60);
  const minutes = endTime.value % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});

watch(startTime, () => {
  startFormattedLabel.value = startFormattedTime.value;
});
watch(endTime, () => {
  endFormattedLabel.value = endFormattedTime.value;
});
// onMounted(() => {
//   formattedValue.value = formattedTime.value;
// });

function validateAndUpdateStart() {
  const timeParts = startFormattedLabel.value.split(':');
  if (timeParts.length !== 2) {
    alert('Введите время в правильном формате (hh:mm)');
    return;
  }

  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes >= 60) {
    alert('Введите корректное значение времени');
    return;
  }

  form.value.maintenanceWindow[0] = hours * 60 + minutes;
}
function validateAndUpdateEnd() {
  const timeParts = endFormattedLabel.value.split(':');
  if (timeParts.length !== 2) {
    alert('Введите время в правильном формате (hh:mm)');
    return;
  }

  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes >= 60) {
    alert('Введите корректное значение времени');
    return;
  }

  form.value.maintenanceWindow[1] = hours * 60 + minutes;
}
// const closeModal = () => {
//   if (store.centerModule) {
//     store.centerModule.isActive = false;
//   }
// };
// const backAction = () => {
//   if (store.centerModule) {
//     store.centerModule.type = TypeModule.Space;
//   }
// };

const submitForm = () => {
  console.log('Форма отправлена', form.value);
  // closeModal();
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #888;
  cursor: pointer;
}
.back-btn {
  color: #888;
  cursor: pointer;
}

.form-group {
  .p-select {
    width: 100%;
  }
  .p-multiselect {
    width: 100%;
  }
  margin-bottom: 16px;
  input {
    margin-bottom: 16px;
  }
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px;
  // margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  resize: vertical;
  height: 100px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;

  .p-button:hover {
    border: 0;
  }
}

button {
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
  margin-right: 8px;
}

.cancel-btn:hover {
  background-color: #d32f2f;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
}

.submit-btn:hover {
  background-color: #388e3c;
}
.checkbox-cmp {
  display: inline-flex;
  align-items: center;
  input {
    width: auto;
  }
}
.double-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; /* Позволяет переносить элементы на следующую строку */
  gap: 20px;
  .form-group {
    flex: 1 1 calc(50% - 20px); /* Элемент занимает 50% ширины контейнера с учётом отступов */
    min-width: 200px; /* Минимальная ширина */
    box-sizing: border-box; /* Учитывает padding и border */
  }
}
.double--not-equal {
  display: flex;
  flex-wrap: wrap; /* Позволяет переносить элементы на следующую строку */
  gap: 20px;
  .form-group {
    flex: 1;
  }
}
.double--not-equal > :first-child {
  flex-grow: 2;
}
.double--not-equal > :last-child {
  flex-grow: 1;
}
.small-groups {
  display: flex;
  flex-wrap: wrap; /* Позволяет переносить элементы на следующую строку */
  gap: 20px; /* Отступы между элементами */

  .form-group {
    flex: 1 1 calc(25% - 20px); /* Элемент занимает 50% ширины контейнера с учётом отступов */
    min-width: 200px; /* Минимальная ширина */
    box-sizing: border-box; /* Учитывает padding и border */
  }
}
</style>