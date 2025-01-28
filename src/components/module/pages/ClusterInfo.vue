<script setup lang="ts">
import { reactive } from 'vue';
import Knob from 'primevue/knob';
import Button from 'primevue/button';
const value = 50;
const clusterInfo = reactive({
  name: 'Demo Cluster',
  version: 'v1.23.0',
  id: '12345',
  status: 'Running',
  nodes: [
    {
      name: 'node-1',
      roles: 'master',
      version: 'v1.22.3',
      status: 'Ready',
      cpu: '2/4',
      ram: '4Gi/8Gi',
      disk: '50Gi/100Gi',
    },
  ],
  pods: [
    {
      name: 'pod-1',
      status: 'Running',
      resources: { cpu: '500m', ram: '256Mi' },
    },
  ],
  namespaces: [
    { name: 'default', podCount: 10 },
    { name: 'kube-system', podCount: 12 },
  ],
  deployments: 5,
  statefulSets: 2,
  daemonSets: 1,
  replicaSets: 4,
  cronJobs: 3,
  services: [{ name: 'service-1', type: 'ClusterIP', ip: '10.96.0.1' }],
  configMaps: 10,
  secrets: 5,
  pvcs: 7,
  resources: {
    cpu: '40% (4/10 cores)',
    memory: '60% (6/10 GB)',
  },
  events: [{ message: 'Pod pod-1 restarted.' }, { message: 'Node node-1 is Ready.' }],
  rbac: 'Enabled',
  podSecurityPolicies: 'Enabled',
});
</script>

<template>
  <div class="cluster-info">
    <h1>Информация о Кластере Kubernetes</h1>
    <!-- Общая информация -->
    <section>
      <h2>Общая информация о кластере</h2>
      <ul>
        <li><strong>Название кластера:</strong> {{ clusterInfo.name }}</li>
        <li><strong>Версия Kubernetes:</strong> {{ clusterInfo.version }}</li>
        <li><strong>Идентификатор кластера:</strong> {{ clusterInfo.id }}</li>
        <li><strong>Статус:</strong> {{ clusterInfo.status }}</li>
      </ul>
    </section>

    <!-- Узлы -->
    <section>
      <h2>Узлы (Nodes)</h2>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Роли</th>
            <th>Версия</th>
            <th>Статус</th>
            <th>CPU</th>
            <th>RAM</th>
            <th>Диск</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="node in clusterInfo.nodes" :key="node.name">
            <td>{{ node.name }}</td>
            <td>{{ node.roles }}</td>
            <td>{{ node.version }}</td>
            <td>{{ node.status }}</td>
            <td>{{ node.cpu }}</td>
            <td>{{ node.ram }}</td>
            <td>{{ node.disk }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Поды -->
    <section>
      <h2>Поды (Pods)</h2>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Статус</th>
            <th>CPU</th>
            <th>RAM</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pod in clusterInfo.pods" :key="pod.name">
            <td>{{ pod.name }}</td>
            <td>{{ pod.status }}</td>
            <td>{{ pod.resources.cpu }}</td>
            <td>{{ pod.resources.ram }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Пространства имен -->
    <section>
      <h2>Пространства имен (Namespaces)</h2>
      <ul>
        <li v-for="namespace in clusterInfo.namespaces" :key="namespace.name">
          {{ namespace.name }} - {{ namespace.podCount }} подов
        </li>
      </ul>
    </section>

    <!-- Развернутые приложения -->
    <section>
      <h2>Развернутые приложения</h2>
      <ul>
        <li><strong>Deployment:</strong> {{ clusterInfo.deployments }}</li>
        <li><strong>StatefulSet:</strong> {{ clusterInfo.statefulSets }}</li>
        <li><strong>DaemonSet:</strong> {{ clusterInfo.daemonSets }}</li>
        <li><strong>ReplicaSet:</strong> {{ clusterInfo.replicaSets }}</li>
        <li><strong>CronJobs:</strong> {{ clusterInfo.cronJobs }}</li>
      </ul>
    </section>

    <!-- Сетевые компоненты -->
    <section>
      <h2>Сетевые компоненты</h2>
      <ul>
        <li v-for="service in clusterInfo.services" :key="service.name">
          {{ service.name }} - {{ service.type }} - {{ service.ip }}
        </li>
      </ul>
    </section>

    <!-- Конфигурационные объекты -->
    <section>
      <h2>Конфигурационные объекты</h2>
      <ul>
        <li><strong>ConfigMaps:</strong> {{ clusterInfo.configMaps }}</li>
        <li><strong>Secrets:</strong> {{ clusterInfo.secrets }}</li>
        <li><strong>PersistentVolumeClaims:</strong> {{ clusterInfo.pvcs }}</li>
      </ul>
    </section>

    <!-- Использование ресурсов -->
    <section>
      <h2>Использование ресурсов</h2>
      <ul class="resource-usage">
        <li><strong>CPU:</strong> <Knob v-model="value" valueTemplate="{value}%" /></li>
        <!-- <li><strong>CPU:</strong> {{ clusterInfo.resources.cpu }}</li> -->
        <!-- <li><strong>Memory:</strong> {{ clusterInfo.resources.memory }}</li> -->
        <li><strong>Memory:</strong> <Knob v-model="value" valueTemplate="{value}%" /></li>
      </ul>
    </section>

    <!-- События -->
    <section>
      <h2>События</h2>
      <ul>
        <li v-for="event in clusterInfo.events" :key="event.message">
          {{ event.message }}
        </li>
      </ul>
    </section>

    <!-- Политики безопасности -->
    <section>
      <h2>Политики безопасности</h2>
      <ul>
        <li><strong>RBAC:</strong> {{ clusterInfo.rbac }}</li>
        <li><strong>Pod Security Policies:</strong> {{ clusterInfo.podSecurityPolicies }}</li>
      </ul>
    </section>
  </div>
</template>

<style>
.resource-usage {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 50%;
}
.cluster-info {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}
section {
  margin-bottom: 20px;
}
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 10px;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f4f4f4;
  text-align: left;
}
</style>
