<template>
  <div class="fullscreen flex flex-center bg-grey-2">
    <q-card class="login-card q-pa-lg shadow-2 rounded-borders-xl">
      <q-card-section class="text-center">
        <div class="text-h4 text-weight-bold text-primary q-mb-md">Mi Consultorio</div>
        <div class="text-subtitle1 text-grey-7">Bienvenido de nuevo</div>
      </q-card-section>

      <q-card-section class="q-gutter-y-md">
        <q-input
          v-model="email"
          label="Correo Electrónico"
          outlined
          rounded
          dense
          type="email"
          color="primary"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          label="Contraseña"
          outlined
          rounded
          dense
          type="password"
          color="primary"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section>
        <q-btn
          label="Ingresar al Sistema"
          color="primary"
          class="full-width q-py-sm rounded-borders-lg"
          unelevated
          size="lg"
          @click="handleLogin"
          :loading="loading"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();

const email = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = () => {
  loading.value = true;

  setTimeout(() => {
    loading.value = false;
    $q.notify({ type: 'positive', message: 'Bienvenido Doctor' });
    void router.push('/patients');
  }, 1000);
};
</script>

<style lang="scss" scoped>
.rounded-borders-xl {
  border-radius: 24px;
}
.rounded-borders-lg {
  border-radius: 12px;
}
.login-card {
  width: 100%;
  max-width: 400px;
}
</style>
