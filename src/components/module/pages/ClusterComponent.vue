<template>
  <div class="modal-header">
    <h1>Создание нового кластера</h1>
  </div>

  <form @submit.prevent="submitForm">
    <div class="form-group">
      <label>Системное имя</label>
      <InputText v-model="form.systemName" placeholder="Введите системное имя" required />
    </div>

    <div class="double-group">
      <div class="form-group">
        <label>Размер хранилища (GB)</label>
        <InputText v-model.number="form.storageSize" />
        <Slider v-model="form.storageSize" :min="1" :max="10" />
      </div>

      <div class="form-group">
        <label>Количество CPU</label>
        <InputText v-model.number="form.cpu" />
        <Slider v-model="form.cpu" :min="100" :max="800" />
      </div>
    </div>

    <div class="double-group">
      <div class="form-group">
        <label>Память (MB)</label>
        <InputText v-model.number="form.memory" />
        <Slider v-model="form.memory" :min="300" :max="1500" />
      </div>

      <div class="form-group">
        <label>Major Version PostgreSQL</label>
        <Select
          v-model="form.majorVersion"
          :options="versions"
          optionLabel="label"
          optionValue="value"
          placeholder="Выберите версию"
        />
      </div>
    </div>

    <div class="double-group">
      <div class="form-group">
        <label>Имя базы данных</label>
        <InputText v-model="form.databaseName" placeholder="Название базы данных" />
      </div>

      <div class="form-group">
        <label>Количество инстансов</label>
        <InputText v-model.number="form.instances" />
        <Slider v-model="form.instances" :min="1" :max="5" />
      </div>
    </div>

    <div class="double-group">
      <div class="form-group">
        <label>Владелец БД (логин)</label>
        <InputText v-model="form.ownerName" />
      </div>

      <div class="form-group">
        <label>Пароль владельца БД</label>
        <InputText v-model="form.ownerPassword" type="password" />
      </div>
    </div>

    <div class="double-group">
      <div class="form-group">
        <label>lcCollate</label>
        <InputText v-model="form.lcCollate" placeholder="например, en_US.UTF-8" />
      </div>

      <div class="form-group">
        <label>lcCtype</label>
        <InputText v-model="form.lcCtype" placeholder="например, en_US.UTF-8" />
      </div>
    </div>

    <div class="double-group">
      <div class="form-group">
        <label>Pooler Mode</label>
        <Select
          v-model="form.poolerMode"
          :options="poolerModes"
          placeholder="Выберите режим"
        />
      </div>

      <div class="form-group">
        <label>Security Group</label>
        <Select
          v-model="form.securityGroupId"
          :options="securityGroups"
          optionLabel="label"
          optionValue="value"
          placeholder="Выберите Security Group"
        />
      </div>
    </div>

    <div class="double-group">
      <div class="form-group">
        <label>Pooler Max Connections</label>
        <InputText v-model.number="form.poolerMaxConnections" />
      </div>

      <div class="form-group">
        <label>Pooler Default Pool Size</label>
        <InputText v-model.number="form.poolerDefaultPoolSize" />
      </div>
    </div>

    <div class="double-group">
      <div class="form-group">
        <label>Backup Schedule Cron</label>
        <InputText v-model="form.backupScheduleCronExpression" placeholder="например, 0 2 * * *" @blur="validateCron"/>
      </div>

      <div class="form-group">
        <label>Метод бэкапа</label>
        <Select
          v-model="form.backupMethod"
          :options="backupMethods"
          placeholder="Выберите метод"
        />
      </div>
    </div>

    <div class="modal-footer">
      <Button icon="pi pi-check" label="Создать кластер" @click="submitForm" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Slider from 'primevue/slider';
import Select from 'primevue/select';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useRenderStore } from '@/stores';
import type { CreateClusterDto } from '@/types/api';

const store = useRenderStore();
const toast = useToast();

// Data
const form = ref({
  systemName: '',
  storageSize: 1,
  cpu: 100,
  memory: 300,
  majorVersion: null,
  databaseName: '',
  lcCollate: '',
  lcCtype: '',
  instances: 1,
  ownerName: '',
  ownerPassword: '',
  poolerMode: null,
  poolerMaxConnections: 10,
  poolerDefaultPoolSize: 5,
  securityGroupId: null,
  backupScheduleCronExpression: '',
  backupMethod: null,
});

// Options
const versions = [
  { label: '13', value: 13 },
  { label: '14', value: 14 },
  { label: '15', value: 15 },
];

const poolerModes = ['session', 'transaction', 'statement'];

const securityGroups = [
  { label: 'Security Group 1', value: 1 },
  { label: 'Security Group 2', value: 2 },
  { label: 'Security Group 3', value: 3 },
];

const backupMethods = ['volumeSnapshot', 'barmanObjectStore'];

function isValidCron(cron: string): boolean {
  const parts = cron.trim().split(/\s+/);

  if (parts.length !== 5) {
    return false;
  }

  const validators = [
    { min: 0, max: 59 },  // Минуты
    { min: 0, max: 23 },  // Часы
    { min: 1, max: 31 },  // День месяца
    { min: 1, max: 12 },  // Месяц
    { min: 0, max: 6 },   // День недели
  ];

  return parts.every((part, index) => validateCronField(part, validators[index].min, validators[index].max));
}

function validateCronField(field: string, min: number, max: number): boolean {
  const patterns = [
    /^\*$/,                               // "*"
    /^[0-9]+$/,                           // "5"
    /^[0-9]+-[0-9]+$/,                    // "5-10"
    /^\*\/[0-9]+$/,                       // "*/5"
    /^[0-9]+(,[0-9]+)+$/,                 // "1,2,3"
  ];

  const isValidPattern = patterns.some((pattern) => pattern.test(field));
  if (!isValidPattern) return false;

  const extractNumbers = (field: string) => {
    const numbers: number[] = [];
    field.split(/,|-/).forEach((part) => {
      const num = parseInt(part, 10);
      if (!isNaN(num)) numbers.push(num);
    });
    const stepMatch = field.match(/\*\/(\d+)/);
    if (stepMatch) numbers.push(parseInt(stepMatch[1], 10));
    return numbers;
  };

  const numbers = extractNumbers(field);
  return numbers.every((num) => num >= min && num <= max);
}

function validateCron() {
  if (!form.value.backupScheduleCronExpression) return;

  if (!isValidCron(form.value.backupScheduleCronExpression)) {
    toast.add({
      severity: 'warn',
      summary: 'Проверьте cron',
      detail: 'Некорректное cron выражение',
      life: 3000,
    });
  }
}
function prepareClusterData(): CreateClusterDto {
  return {
    systemName: form.value.systemName || '',
    storageSize: form.value.storageSize,
    cpu: form.value.cpu,
    memory: form.value.memory,
    majorVersion: Number(form.value.majorVersion) || 13,
    databaseName: form.value.databaseName || '',
    lcCollate: form.value.lcCollate || '',
    lcCtype: form.value.lcCtype || '',
    instances: form.value.instances,
    ownerName: form.value.ownerName || '',
    ownerPassword: form.value.ownerPassword || '',
    poolerMode: form.value.poolerMode || 'session',
    poolerMaxConnections: form.value.poolerMaxConnections,
    poolerDefaultPoolSize: form.value.poolerDefaultPoolSize,
    securityGroupId: form.value.securityGroupId || 1,
    backupScheduleCronExpression: form.value.backupScheduleCronExpression || '',
    backupMethod: form.value.backupMethod || 'pg_dump',
  };
}

// Submit
async function submitForm() {
  // Валидация Cron перед отправкой
  if (
    form.value.backupScheduleCronExpression &&
    !isValidCron(form.value.backupScheduleCronExpression)
  ) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Некорректное cron выражение для расписания бэкапа',
      life: 3000,
    });
    return;
  }

  const data = prepareClusterData();

  try {
    const response = await store.createCluster(1, data);

    toast.add({
      severity: 'success',
      summary: 'Кластер успешно создан',
      life: 3000,
    });

    console.log('Кластер успешно создан:', response);

  } catch (error: any) {
    console.error('Ошибка при создании кластера:', error);

    toast.add({
      severity: 'error',
      summary: 'Ошибка создания кластера',
      detail: error.message,
      life: 4000,
    });
  }
}

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



<!-- <template>
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
  </form>
  <div class="modal-footer">
    <Button icon="pi pi-check" aria-label="Filter" :onclick="() => check()" />
  </div>
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
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const value = ref(50);
const store = useRenderStore();

function check() {
  toast.add({
    severity: 'success',
    summary: `Кластер добавлен`,
    detail: form.value.clusterName,
    life: 3000,
  });
}
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
</style> -->
