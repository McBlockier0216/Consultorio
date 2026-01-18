import axios from 'axios';

/**
 * Represents the Patient entity as returned by the Backend.
 * Matches the Prisma schema definition exactly.
 */
export interface Patient {
  id: string; // IDs are BigInt in DB but serialized as strings for JSON safety
  firstName: string;
  lastName: string;
  birthDate: string; // ISO Date string
  gender: 'M' | 'F' | 'OTHER';
  email?: string;
  phone: string;
  address?: string;
  allergies?: string;
  symptoms?: string; // Clinical symptoms or reason for visit
  createdAt?: string;
}

/**
 * DTO (Data Transfer Object) for creating or updating a patient.
 * Excludes system-generated fields like ID and timestamps.
 */
export interface PatientInput {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'M' | 'F' | 'OTHER';
  email?: string;
  phone: string;
  address?: string;
  allergies?: string;
  symptoms?: string;
}

// API CONFIGURATION
const API_URL = 'http://localhost:3000/api/patients';

// SERVICE CLASS
// Encapsulates all HTTP logic. The UI components will call these methods.
export default {

  /**
   * Retrieves all active patients from the server.
   * Includes specific logic to bypass browser caching (prevents 304 Not Modified).
   * @returns {Promise<Patient[]>} List of active patients
   */
  async getAll() {
    const response = await axios.get<{ success: boolean; data: Patient[] }>(API_URL, {
      // Explicit Headers: Instructs the browser and proxies not to cache this response
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      params: {
        _t: Date.now()
      }
    });
    return response.data.data;
  },

  /**
   * Registers a new patient in the system.
   * @param {PatientInput} patient - The patient data to save
   * @returns {Promise<Patient>} The created patient object
   */
  async create(patient: PatientInput) {
    const response = await axios.post<{ success: boolean; data: Patient }>(API_URL, patient);
    return response.data.data;
  },

  /**
   * Updates an existing patient's record.
   * @param {string} id - The unique ID of the patient
   * @param {Partial<PatientInput>} patient - The fields to update
   * @returns {Promise<Patient>} The updated patient object
   */
  async update(id: string, patient: Partial<PatientInput>) {
    // Partial<T> allows sending only the modified fields instead of the whole object
    const response = await axios.put<{ success: boolean; data: Patient }>(`${API_URL}/${id}`, patient);
    return response.data.data;
  },

  /**
   * Performs a Soft Delete on a patient record.
   * @param {string} id - The ID of the patient to delete
   * @returns {Promise<boolean>} True if operation was successful
   */
  async delete(id: string) {
    const response = await axios.delete<{ success: boolean }>(`${API_URL}/${id}`);
    return response.data.success;
  }
};
