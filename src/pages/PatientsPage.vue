<template>
  <q-page class="q-pa-md bg-grey-2">

    <div class="row items-center justify-between q-mb-lg q-col-gutter-y-md">
      <div class="col-12 col-md-auto">
        <div class="text-h4 text-weight-bold text-primary">Pacientes</div>
        <div class="text-subtitle2 text-grey-7">Gestión integral de expedientes clínicos</div>
      </div>

      <div class="col-12 col-md-auto row justify-end items-center q-gutter-sm">
        <q-input
          v-model="filter"
          dense
          outlined
          rounded
          placeholder="Buscar paciente..."
          class="bg-white col-grow col-md-auto"
          :class="$q.screen.lt.md ? 'full-width' : ''"
        >
          <template v-slot:append>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>

        <q-btn
          color="primary"
          icon="add"
          label="Nuevo"
          unelevated
          rounded
          class="shadow-2"
          :class="$q.screen.lt.sm ? 'full-width' : 'q-px-lg'"
          @click="openDialog()"
        />
      </div>
    </div>

    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :loading="loading"
      :grid="$q.screen.xs"
      flat
      bordered
      class="rounded-borders-lg shadow-1 bg-white"
      no-data-label="No hay pacientes registrados"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-primary text-weight-bold"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-sm">
          <q-btn flat round color="primary" icon="edit" size="sm" @click="openDialog(props.row)">
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)">
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card bordered flat class="rounded-borders-lg">
            <q-card-section class="row justify-between items-center bg-grey-1 q-py-sm">
              <div class="text-subtitle1 text-weight-bold text-primary">
                {{ props.row.firstName }} {{ props.row.lastName }}
              </div>
              <div class="row">
                <q-btn flat round color="primary" icon="edit" size="sm" @click="openDialog(props.row)" />
                <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)" />
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-gutter-y-xs text-body2">
              <div><q-icon name="event" class="q-mr-xs text-grey" /> {{ new Date(props.row.birthDate).toLocaleDateString() }}</div>
              <div><q-icon name="phone" class="q-mr-xs text-grey" /> {{ props.row.phone }}</div>
              <div v-if="props.row.symptoms" class="text-grey-8 q-mt-sm">
                <q-icon name="sick" class="q-mr-xs text-warning" />
                <span class="text-italic">{{ props.row.symptoms }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>

      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>

    <q-dialog v-model="showDialog" persistent backdrop-filter="blur(4px)">
      <q-card style="width: 700px; max-width: 90vw;" class="rounded-borders-xl shadow-3">

        <q-card-section class="bg-primary text-white q-py-sm row items-center justify-between">
          <div class="text-h6 text-weight-medium">
            <q-icon name="medical_services" class="q-mr-sm" />
            {{ isEditing ? 'Editar Expediente' : 'Nuevo Ingreso' }}
          </div>
          <q-btn flat round icon="close" v-close-popup dense />
        </q-card-section>

        <q-card-section class="q-pa-md q-pa-md-lg q-gutter-y-md scroll" style="max-height: 70vh">

          <div class="text-subtitle2 text-grey-6 q-mb-sm">Información Personal</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.firstName"
                label="Nombre(s) *"
                outlined dense rounded
                :rules="[val => !!val || 'Requerido']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.lastName"
                label="Apellidos *"
                outlined dense rounded
                :rules="[val => !!val || 'Requerido']"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.birthDate"
                label="Fecha Nacimiento *"
                type="date"
                outlined dense rounded stack-label
                :rules="[val => !!val || 'Requerido']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-select
                v-model="form.gender"
                :options="[{label: 'Masculino', value: 'M'}, {label: 'Femenino', value: 'F'}, {label: 'Otro', value: 'OTHER'}]"
                label="Género *"
                outlined dense rounded
                emit-value
                map-options
              />
            </div>
          </div>

          <q-separator spaced />

          <div class="text-subtitle2 text-grey-6 q-mb-sm">Contacto</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input v-model="form.phone" label="Teléfono *" outlined dense rounded mask="(###) ### - ####" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="form.email" label="Email" outlined dense rounded type="email" />
            </div>
          </div>

          <q-input v-model="form.address" label="Dirección" outlined dense rounded type="textarea" rows="2" />

          <q-separator spaced />

          <div class="text-subtitle2 text-primary text-weight-bold q-mb-sm">
            <q-icon name="local_hospital" class="q-mr-xs"/> Datos Clínicos
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.allergies"
                label="Alergias Conocidas"
                outlined dense rounded
                type="textarea"
                rows="3"
                bg-color="red-1"
                placeholder="Ej: Penicilina, Nueces..."
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.symptoms"
                label="Síntomas / Motivo de Consulta"
                outlined dense rounded
                type="textarea"
                rows="3"
                bg-color="blue-1"
                placeholder="Ej: Dolor de cabeza, fiebre..."
              />
            </div>
          </div>

        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cancelar" v-close-popup color="grey-8" rounded class="q-px-md" />
          <q-btn
            :label="isEditing ? 'Guardar Cambios' : 'Registrar Paciente'"
            color="primary"
            unelevated
            rounded
            class="q-px-lg"
            icon="save"
            @click="confirmSave"
            :loading="saving"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import PatientService, { type Patient, type PatientInput } from 'src/services/PatientService';

//CONFIGURATION
const $q = useQuasar();
const loading = ref(false);
const saving = ref(false);
const rows = ref<Patient[]>([]);
const filter = ref('');

//Column Definition
const columns: QTableColumn[] = [
  { name: 'firstName', label: 'Nombre', field: 'firstName', align: 'left', sortable: true },
  { name: 'lastName', label: 'Apellidos', field: 'lastName', align: 'left', sortable: true },
  { name: 'phone', label: 'Teléfono', field: 'phone', align: 'left' },
  {
    name: 'gender',
    label: 'Género',
    field: 'gender',
    align: 'center',
    format: (val) => val === 'M' ? 'Masculino' : (val === 'F' ? 'Femenino' : 'Otro')
  },
  {
    name: 'birthDate',
    label: 'F. Nacimiento',
    field: (row: Patient) => row.birthDate,
    format: (val) => new Date(val).toLocaleDateString(),
    align: 'left',
    sortable: true
  },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' },
];

//STATE
const showDialog = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = reactive<PatientInput>({
  firstName: '',
  lastName: '',
  birthDate: '',
  gender: 'M',
  phone: '',
  email: '',
  address: '',
  allergies: '',
  symptoms: ''
});

//METHODS (CRUD)

const loadPatients = async () => {
  loading.value = true;
  try {
    rows.value = await PatientService.getAll();
  } catch (error) {
    console.error(error);
    $q.notify({ type: 'negative', message: 'Error de conexión con el servidor' });
  } finally {
    loading.value = false;
  }
};

const openDialog = (patient?: Patient) => {
  if (patient) {
    isEditing.value = true;
    editingId.value = patient.id;

    form.firstName = patient.firstName;
    form.lastName = patient.lastName;
    form.birthDate = patient.birthDate?.split('T')[0] ?? '';
    form.gender = patient.gender;
    form.phone = patient.phone;
    form.email = patient.email ?? '';
    form.address = patient.address ?? '';
    form.allergies = patient.allergies ?? '';
    form.symptoms = patient.symptoms ?? '';
  } else {
    isEditing.value = false;
    editingId.value = null;
    resetForm();
  }
  showDialog.value = true;
};

const resetForm = () => {
  form.firstName = '';
  form.lastName = '';
  form.birthDate = '';
  form.gender = 'M';
  form.phone = '';
  form.email = '';
  form.address = '';
  form.allergies = '';
  form.symptoms = '';
};

//LOGIC: CONFIRMATION & SAVE
const confirmSave = () => {
  if (!form.firstName || !form.lastName || !form.birthDate || !form.phone) {
    $q.notify({ type: 'warning', message: 'Por favor complete los campos obligatorios (*)' });
    return;
  }

  $q.dialog({
    title: isEditing.value ? 'Confirmar Actualización' : 'Confirmar Registro',
    message: isEditing.value
      ? '¿Está seguro de que desea guardar los cambios en este expediente?'
      : '¿Está seguro de que los datos son correctos para registrar al nuevo paciente?',
    persistent: true,
    ok: { label: 'Sí, Guardar', color: 'primary', unelevated: true, rounded: true },
    cancel: { label: 'Revisar', flat: true, color: 'grey-8' }
  }).onOk(() => {
    void executeSave();
  });
};

const executeSave = async () => {
  saving.value = true;
  try {
    if (isEditing.value && editingId.value) {
      await PatientService.update(editingId.value, form);
      $q.notify({ type: 'positive', message: 'Expediente actualizado correctamente' });
    } else {
      await PatientService.create(form);
      $q.notify({ type: 'positive', message: 'Paciente registrado exitosamente' });
    }
    showDialog.value = false;
    void loadPatients();
  } catch (error) {
    console.error(error);
    $q.notify({ type: 'negative', message: 'No se pudieron guardar los cambios' });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (patient: Patient) => {
  $q.dialog({
    title: 'Eliminar Paciente',
    message: `¿Está seguro de eliminar el expediente de <strong>${patient.firstName} ${patient.lastName}</strong>?<br><br><span class="text-red">Esta acción es delicada.</span>`,
    html: true,
    persistent: true,
    ok: { label: 'Sí, Eliminar', color: 'negative', unelevated: true, rounded: true },
    cancel: { label: 'Cancelar', flat: true, color: 'grey-8' }
  }).onOk(() => {
    void (async () => {
      try {
        await PatientService.delete(patient.id);
        $q.notify({ type: 'info', message: 'Paciente eliminado del sistema' });
        void loadPatients();
      } catch (error) {
        console.error(error);
        $q.notify({ type: 'negative', message: 'Error al eliminar' });
      }
    })();
  });
};

//LIFECYCLE
onMounted(() => {
  void loadPatients();
});
</script>

<style scoped>
.rounded-borders-lg {
  border-radius: 12px;
}
.rounded-borders-xl {
  border-radius: 20px;
}
</style>
