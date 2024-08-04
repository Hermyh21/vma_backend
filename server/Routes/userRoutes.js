const express = require('express');
const userRouter = express.Router();
const User = require('../Models/user');
const userService = require('../services/getUsers')
// Fetch all users
userRouter.get('/api/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Delete a user by ID
userRouter.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await userService.deleteUser(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = userRouter;