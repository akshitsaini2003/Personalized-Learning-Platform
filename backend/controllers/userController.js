const User = require('../models/User');

// ✅ **Sabhi Users Fetch Kare**
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Password exclude kare
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ **User Delete Kare**
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ **User Password Reset Kare**
exports.resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully", user });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ **User Role Update Kare**
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { newRole } = req.body;

    if (!newRole) {
      return res.status(400).json({ error: "New role is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user role
    user.role = newRole;
    await user.save();

    res.status(200).json({ message: "Role updated successfully", user });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};