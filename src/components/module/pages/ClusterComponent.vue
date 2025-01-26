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
        <input type="number" id="cpu" v-model="form.cpu" min="1" required />
      </div>

      <div class="form-group">
        <label for="ram">Объем RAM (GB)</label>
        <input type="number" id="ram" v-model="form.ram" min="1" required />
      </div>

      <div class="form-group">
        <label for="pg-version">Версия PostgreSQL</label>
        <select id="pg-version" v-model="form.pgVersion" required>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
        </select>
      </div>

      <div class="form-group">
        <label for="storage-size">Размер хранилища (GB)</label>
        <input type="number" id="storage-size" v-model="form.storageSize" min="10" required />
      </div>
    </div>
    <div class="form-group">
      <label>
        <div class="checkbox-cmp">
          Автоматическое масштабирование хранилища
          <input type="checkbox" v-model="form.autoScalingStorage" />
        </div>
      </label>
    </div>

    <div class="form-group">
      <label for="db-name">Имя базы данных</label>
      <input type="text" id="db-name" v-model="form.dbName" required />
    </div>

    <div class="form-group">
      <label for="username">Имя пользователя</label>
      <input type="text" id="username" v-model="form.username" required />
    </div>

    <div class="form-group">
      <label for="password">Пароль пользователя</label>
      <input type="password" id="password" v-model="form.password" required />
    </div>

    <div class="form-group">
      <label for="locale-collate">Параметры локали (lc_collate)</label>
      <input type="text" id="locale-collate" v-model="form.localeCollate" />
    </div>

    <div class="form-group">
      <label for="locale-ctype">Параметры локали (lc_ctype)</label>
      <input type="text" id="locale-ctype" v-model="form.localeCtype" />
    </div>

    <div class="form-group">
      <label for="security-group">Выбор Security Group</label>
      <select id="security-group" v-model="form.securityGroup" required>
        <option value="default">Default</option>
        <option value="custom">Custom</option>
      </select>
    </div>

    <div class="form-group">
      <label for="replicas">Количество реплик</label>
      <input type="number" id="replicas" v-model="form.replicas" min="0" />
    </div>

    <div class="form-group">
      <label for="maintenance-window">Окно обслуживания</label>
      <input type="text" id="maintenance-window" v-model="form.maintenanceWindow" />
    </div>

    <div class="form-group">
      <label for="backup">Параметры резервного копирования</label>
      <input type="text" id="backup" v-model="form.backup" />
    </div>

    <div class="form-group">
      <label for="pg-config">Конфигурация PostgreSQL</label>
      <textarea id="pg-config" v-model="form.pgConfig"></textarea>
    </div>

    <div class="modal-footer">
      <button type="button" class="cancel-btn" @click="closeModal">Отмена</button>
      <button type="submit" class="submit-btn">Создать кластер</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRenderStore } from '@/stores'
import { TypeModule } from '@/types/components'
const store = useRenderStore()

const form = ref({
  clusterName: '',
  cpu: 1,
  ram: 1,
  pgVersion: '13',
  storageSize: 10,
  autoScalingStorage: false,
  dbName: '',
  username: '',
  password: '',
  localeCollate: '',
  localeCtype: '',
  securityGroup: 'default',
  replicas: 0,
  maintenanceWindow: '',
  backup: '',
  pgConfig: '',
})

const closeModal = () => {
  if (store.centerModule) {
    store.centerModule.isActive = false
  }
}
const backAction = () => {
  if (store.centerModule) {
    store.centerModule.type = TypeModule.Space
  }
}

const submitForm = () => {
  console.log('Форма отправлена', form.value)
  closeModal()
}
</script>

<style scoped>
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
  margin-bottom: 16px;
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
  margin-top: 4px;
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
.small-groups {
  display: flex;
  flex-wrap: wrap; /* Позволяет переносить элементы на следующую строку */
  gap: 20px; /* Отступы между элементами */

  .form-group {
    flex: 1 1 calc(50% - 20px); /* Элемент занимает 50% ширины контейнера с учётом отступов */
    min-width: 200px; /* Минимальная ширина */
    box-sizing: border-box; /* Учитывает padding и border */
  }
}
</style>
