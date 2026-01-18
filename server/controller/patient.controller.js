/**
 * @file patient.controller.js
 * @description Controller responsible for handling Patient requests.
 * Implements CRUD operations using Prisma Client.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//BigInt serialization for JSON (Prisma uses BigInt for IDs)
BigInt.prototype.toJSON = function () { return this.toString() }

const PatientController = {

    /**
     * @function getAllPatients
     * @description Retrieves all active patients (not soft-deleted).
     * @route GET /api/patients
     */
    async getAllPatients(req, res) {
        try {
            // We fetch patients where 'deletedAt' is null (Soft Delete check)
            const patients = await prisma.patient.findMany({
                where: {
                    deletedAt: null
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return res.status(200).json({
                success: true,
                count: patients.length,
                data: patients
            });
        } catch (error) {
            console.error('Error getting patients:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error.message
            });
        }
    },

    /**
     * @function getPatientById
     * @description Retrieves a single patient by ID.
     * @route GET /api/patients/:id
     */
    async getPatientById(req, res) {
        try {
            const { id } = req.params;

            const patient = await prisma.patient.findFirst({
                where: {
                    id: BigInt(id), // Convert string ID to BigInt
                    deletedAt: null // Ensure patient is not deleted
                },
                include: {
                    appointments: true // Join with Appointments table
                }
            });

            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: 'Patient not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: patient
            });
        } catch (error) {
            console.error('Error getting patient:', error);
            return res.status(500).json({
                success: false,
                message: 'Error retrieving patient details'
            });
        }
    },

    /**
     * @function createPatient
     * @description Creates a new patient in the database.
     * @route POST /api/patients
     */
    async createPatient(req, res) {
        try {
            // Destructure and validate input
            const { firstName, lastName, birthDate, gender, phone, email, address, allergies, symptoms} = req.body;

            // Basic Validation
            if (!firstName || !lastName || !birthDate || !phone || !gender) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: firstName, lastName, birthDate, phone, gender'
                });
            }

            // Create using Prisma
            const newPatient = await prisma.patient.create({
                data: {
                    firstName,
                    lastName,
                    birthDate: new Date(birthDate), // Convert string "YYYY-MM-DD" to Date object
                    gender,
                    phone,
                    email,
                    address,
                    allergies,
                    symptoms
                }
            });

            return res.status(201).json({
                success: true,
                message: 'Patient created successfully',
                data: newPatient
            });

        } catch (error) {
            console.error('Error creating patient:', error);
            return res.status(500).json({
                success: false,
                message: 'Could not create patient',
                error: error.message
            });
        }
    },

    /**
     * @function updatePatient
     * @description Updates an existing patient's details.
     * @route PUT /api/patients/:id
     */
    async updatePatient(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            // Check if patient exists first
            const existingPatient = await prisma.patient.findUnique({
                where: { id: BigInt(id) }
            });

            if (!existingPatient || existingPatient.deletedAt) {
                return res.status(404).json({ success: false, message: 'Patient not found' });
            }

            // If birthDate is present, convert it
            if (data.birthDate) {
                data.birthDate = new Date(data.birthDate);
            }

            const updatedPatient = await prisma.patient.update({
                where: { id: BigInt(id) },
                data: data
            });

            return res.status(200).json({
                success: true,
                message: 'Patient updated successfully',
                data: updatedPatient
            });

        } catch (error) {
            console.error('Error updating patient:', error);
            return res.status(500).json({ success: false, message: 'Update failed' });
        }
    },

    /**
     * @function deletePatient
     * @description Soft deletes a patient (sets deletedAt timestamp).
     * @route DELETE /api/patients/:id
     */
    async deletePatient(req, res) {
        try {
            const { id } = req.params;

            // We perform a "Soft Delete" instead of removing the record
            await prisma.patient.update({
                where: { id: BigInt(id) },
                data: {
                    deletedAt: new Date() // Mark as deleted now
                }
            });

            return res.status(200).json({
                success: true,
                message: 'Patient deleted successfully (Soft Delete)'
            });

        } catch (error) {
            console.error('Error deleting patient:', error);
            return res.status(500).json({ success: false, message: 'Delete failed' });
        }
    }
};

module.exports = PatientController;