const User = require('../Models/user');

const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};
const deleteUser = async (userId) => {
  try {
    await User.findByIdAndDelete(userId);
  } catch (error) {
    throw new Error('Failed to delete user: ' + error.message);
  }
};

module.exports = {
  getAllUsers,
  deleteUser
};
