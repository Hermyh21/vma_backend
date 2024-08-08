const express = require('express');
const router = express.Router();
const Department = require('../Models/Department');

// Fetch all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err.message);  // More detailed logging
    res.status(500).json({ message: err.message });
  }
});

// Create a new department
router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const department = new Department({ name });
    const newDepartment = await department.save();
    res.status(201).json(newDepartment);
  } catch (err) {
    console.error('Error creating department:', err.message);  // More detailed logging
    res.status(400).json({ message: err.message });
  }
});

// Update a department
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.name = name;
    const updatedDepartment = await department.save();
    res.status(200).json(updatedDepartment);
  } catch (err) {
    console.error('Error updating department:', err.message);  // More detailed logging
    res.status(400).json({ message: err.message });
  }
});

// Delete a department
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const departmentres = await Department.findByIdAndDelete(id);
    if (!departmentres) {
      return res.status(404).json({ message: 'Department not found' });
    }

    
    res.status(204).json({ message: 'Department deleted successfully' });
  } catch (err) {
    console.error('Error deleting department:', err.message);  // More detailed logging
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
