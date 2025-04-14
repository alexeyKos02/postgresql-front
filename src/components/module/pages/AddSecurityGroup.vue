<template>
  <div class="modal-header">
    <h1>Создание нового Security Group</h1>
  </div>
  <div>
    <form @submit.prevent="createSecurityGroup" class="security-group-creator">
      <div class="form-group">
        <label for="name">Название группы</label>
        <InputText id="name" v-model="value" aria-describedby="name-help" required />

        <label for="CIDR">CIDR входящего потока</label>
        <InputText id="CIDR" v-model="cidr" aria-describedby="CIDR-help" required />
        <Button icon="pi pi-plus" aria-label="Filter" :onclick="addCDIR" />
      </div>
      <div class="form-group">
        <ScrollPanel
          style="width: 100%; height: 200px"
          class="table"
          :dt="{
            bar: {
              background: '{primary.color}',
            },
          }"
        >
          <TableComponent :clusters="clusters"></TableComponent>
        </ScrollPanel>
        <Button type="submit" :onclick="check">Создать</Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import type { Cluster } from '@/types/entities';
import TableComponent from '../TableComponent.vue';
import ScrollPanel from 'primevue/scrollpanel';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

const value = ref(null);
const cidr = ref(null);
// Для хранения данных Security Group
const groupName = ref('');
const description = ref('');
const vpcId = ref('');
const securityGroupId = ref<string | null>(null);
const form = ref({
  database: '',
  owner: '',
  lcCollate: '',
  lcCtype: '',
});
const clusters: Cluster[] = Array.from({ length: 15 }, (_, index) => ({
  name: `CIDR ${index + 1}`,
}));
// Для хранения правил Ingress (входящий) и Egress (исходящий) трафика
const ingressRule = ref({ protocol: 'tcp', port: 80, cidr: '0.0.0.0/0' });
const egressRule = ref({ protocol: 'tcp', port: 443, cidr: '0.0.0.0/0' });
const successMessage = ref<string | null>(null);

function addCDIR() {
  toast.add({
    severity: 'success',
    summary: `CIDR добавлен`,
    detail: 'CIDR15',
    life: 3000,
  });
}

function check() {
  toast.add({
    severity: 'success',
    summary: `Security groups добавлен`,
    detail: value,
    life: 3000,
  });
}

// Функция создания Security Group
async function createSecurityGroup() {
  // Здесь должна быть логика API-запроса
  console.log('Создание Security Group с данными:', {
    groupName: groupName.value,
    description: description.value,
    vpcId: vpcId.value,
  });

  // Логика HTTP-запроса для создания Security Group (например, через axios или fetch)
  // Пример: Условно считается, что ID группы будет возвращен сервером
  // const response = await axios.post('API_URL/security-groups', { ... });
  // securityGroupId.value = response.data.id;

  // Заглушка для демонстрации
  securityGroupId.value = 'sg-12345';
  successMessage.value = `Security Group успешно создана с ID: ${securityGroupId.value}`;
}

// Функция добавления правила ingress
async function addIngressRule() {
  console.log('Добавление правила ingress:', ingressRule.value);

  if (!securityGroupId.value) {
    alert('Создайте Security Group перед добавлением правил');
    return;
  }

  // Логика запроса для добавления ingress правила
  // Пример: await axios.post(`API_URL/security-groups/${securityGroupId.value}/ingress`, { ... });
  successMessage.value = `Правило Ingress добавлено для Security Group: ${securityGroupId.value}`;
}

// Функция добавления правила egress
async function addEgressRule() {
  console.log('Добавление правила egress:', egressRule.value);

  if (!securityGroupId.value) {
    alert('Создайте Security Group перед добавлением правил');
    return;
  }

  // Логика запроса для добавления egress правила
  // Пример: await axios.post(`API_URL/security-groups/${securityGroupId.value}/egress`, { ... });
  successMessage.value = `Правило Egress добавлено для Security Group: ${securityGroupId.value}`;
}
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}
.security-group-creator {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; /* Позволяет переносить элементы на следующую строку */
  gap: 20px;
  margin-top: 15px;
  .form-group {
    flex: 1 1 calc(50% - 20px); /* Элемент занимает 50% ширины контейнера с учётом отступов */
    min-width: 200px; /* Минимальная ширина */
    box-sizing: border-box; /* Учитывает padding и border */
  }
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
}

input,
button {
  padding: 0.5rem;
  width: 100%;
}

button {
  margin-top: 1rem;
  width: 10%;
  /* background-color: #4caf50;
  border: none;
  color: white;
  cursor: pointer; */
}

/* button:hover {
  background-color: #45a049;
} */

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}
</style>
