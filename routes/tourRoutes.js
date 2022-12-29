const express = require('express');
const reviewRouter = require('./reviewRoutes');

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /tour/23432sadf/reviews
// GET /tour/23432sadf/reviews
// POST /tour/23432sadf/reviews/asdf1234

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasCheapTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTour
  );

module.exports = router;
