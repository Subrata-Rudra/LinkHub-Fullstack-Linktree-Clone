const express = require("express");
const {
  registerUser,
  verifyUser,
  authenticateUser,
  updateProfilePic,
  deleteUserRequest,
  verifyOtpForUserDeletion,
  forgotPassword,
  sendPasswordResetEmail,
  resetPasswordForm,
  resetPassword,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/signup").post(registerUser);
router.route("/verify").get(verifyUser);
router.route("/login").post(authenticateUser);
router.route("/update-profile-pic").put(protect, updateProfilePic);
router.route("/delete-user-request").delete(protect, deleteUserRequest);
router.route("/verify-delete-otp").post(protect, verifyOtpForUserDeletion);
router.route("/forgot-password").get(forgotPassword);
router.route("/forgot-password").post(sendPasswordResetEmail);
router.route("/reset-password/:email/:token").get(resetPasswordForm);
router.route("/reset-password/:email/:token").post(resetPassword);

module.exports = router;
