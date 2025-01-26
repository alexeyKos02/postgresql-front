<template>
  <div class="security-group-creator">
    <h1>Создание Security Group</h1>
    <!-- Форма для создания Security Group -->
    <form @submit.prevent="createSecurityGroup">
      <div>
        <label for="group-name">Название группы</label>
        <input v-model="groupName" type="text" id="group-name" required />
      </div>
      <div>
        <label for="description">Описание</label>
        <input v-model="description" type="text" id="description" required />
      </div>
      <div>
        <label for="vpc-id">ID VPC</label>
        <input v-model="vpcId" type="text" id="vpc-id" required />
      </div>
      <button type="submit">Создать группу</button>
    </form>

    <hr />

    <!-- Секция для добавления ingress правил -->
    <div>
      <h2>Добавление правил входящего (Ingress) трафика</h2>
      <form @submit.prevent="addIngressRule">
        <div>
          <label for="ingress-protocol">Протокол</label>
          <input
            v-model="ingressRule.protocol"
            type="text"
            id="ingress-protocol"
            placeholder="tcp"
            required
          />
        </div>
        <div>
          <label for="ingress-port">Порт</label>
          <input v-model.number="ingressRule.port" type="number" id="ingress-port" required />
        </div>
        <div>
          <label for="ingress-cidr">CIDR</label>
          <input
            v-model="ingressRule.cidr"
            type="text"
            id="ingress-cidr"
            placeholder="0.0.0.0/0"
            required
          />
        </div>
        <button type="submit">Добавить правило</button>
      </form>
    </div>

    <hr />

    <!-- Секция для добавления egress правил -->
    <div>
      <h2>Добавление правил исходящего (Egress) трафика</h2>
      <form @submit.prevent="addEgressRule">
        <div>
          <label for="egress-protocol">Протокол</label>
          <input
            v-model="egressRule.protocol"
            type="text"
            id="egress-protocol"
            placeholder="tcp"
            required
          />
        </div>
        <div>
          <label for="egress-port">Порт</label>
          <input v-model.number="egressRule.port" type="number" id="egress-port" required />
        </div>
        <div>
          <label for="egress-cidr">CIDR</label>
          <input
            v-model="egressRule.cidr"
            type="text"
            id="egress-cidr"
            placeholder="0.0.0.0/0"
            required
          />
        </div>
        <button type="submit">Добавить правило</button>
      </form>
    </div>

    <hr />

    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Для хранения данных Security Group
const groupName = ref('')
const description = ref('')
const vpcId = ref('')
const securityGroupId = ref<string | null>(null)

// Для хранения правил Ingress (входящий) и Egress (исходящий) трафика
const ingressRule = ref({ protocol: 'tcp', port: 80, cidr: '0.0.0.0/0' })
const egressRule = ref({ protocol: 'tcp', port: 443, cidr: '0.0.0.0/0' })
const successMessage = ref<string | null>(null)

// Функция создания Security Group
async function createSecurityGroup() {
  // Здесь должна быть логика API-запроса
  console.log('Создание Security Group с данными:', {
    groupName: groupName.value,
    description: description.value,
    vpcId: vpcId.value,
  })

  // Логика HTTP-запроса для создания Security Group (например, через axios или fetch)
  // Пример: Условно считается, что ID группы будет возвращен сервером
  // const response = await axios.post('API_URL/security-groups', { ... });
  // securityGroupId.value = response.data.id;

  // Заглушка для демонстрации
  securityGroupId.value = 'sg-12345'
  successMessage.value = `Security Group успешно создана с ID: ${securityGroupId.value}`
}

// Функция добавления правила ingress
async function addIngressRule() {
  console.log('Добавление правила ingress:', ingressRule.value)

  if (!securityGroupId.value) {
    alert('Создайте Security Group перед добавлением правил')
    return
  }

  // Логика запроса для добавления ingress правила
  // Пример: await axios.post(`API_URL/security-groups/${securityGroupId.value}/ingress`, { ... });
  successMessage.value = `Правило Ingress добавлено для Security Group: ${securityGroupId.value}`
}

// Функция добавления правила egress
async function addEgressRule() {
  console.log('Добавление правила egress:', egressRule.value)

  if (!securityGroupId.value) {
    alert('Создайте Security Group перед добавлением правил')
    return
  }

  // Логика запроса для добавления egress правила
  // Пример: await axios.post(`API_URL/security-groups/${securityGroupId.value}/egress`, { ... });
  successMessage.value = `Правило Egress добавлено для Security Group: ${securityGroupId.value}`
}
</script>

<style scoped>
.security-group-creator {
  max-width: 600px;
  margin: auto;
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
  background-color: #4caf50;
  border: none;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}
</style>
