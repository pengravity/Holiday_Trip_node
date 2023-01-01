const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// applied for all the routes below
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router.get('/getOwnUser', userController.getOwnUser, userController.getUser);

router.patch('/updateOwnUser', userController.updateOwnUser);

router.delete('/deleteOwnUser', userController.deleteOwnUser);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
