/**
 * @file patient.routes.js
 * @description Defines the API endpoints for managing Patients in the Medical System.
 * Follows RESTful principles.
 */

const express = require('express');
const router = express.Router();

// We import the controller (Business Logic Layer)
// Note: We will create this file in the next step, but we need to reference it here.
const PatientController = require('../controller/patient.controller');

// ==========================================
// Base Path: /api/patients
// ==========================================

/**
 * @route   GET /api/patients
 * @desc    Retrieves a list of all patients registered in the system.
 * @access  Private (Doctors/Admins)
 */
router.get('/', PatientController.getAllPatients);

/**
 * @route   GET /api/patients/:id
 * @desc    Retrieves a single patient by their unique ID.
 * @param   {string} id - The patient's unique identifier.
 */
router.get('/:id', PatientController.getPatientById);

/**
 * @route   POST /api/patients
 * @desc    Creates a new patient record in the database.
 * @body    {string} firstName, {string} lastName, {string} email, {string} phone
 */
router.post('/', PatientController.createPatient);

/**
 * @route   PUT /api/patients/:id
 * @desc    Updates an existing patient's information completely.
 * @param   {string} id - The patient to update.
 */
router.put('/:id', PatientController.updatePatient);

/**
 * @route   DELETE /api/patients/:id
 * @desc    Soft deletes (archives) or permanently removes a patient.
 * @param   {string} id - The patient to delete.
 */
router.delete('/:id', PatientController.deletePatient);

// Export the router to be used in app.js
module.exports = router;