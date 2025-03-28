const express = require('express');
const passport = require('passport');

const OrderService = require('../services/order.service');
const CustomerService = require('../services/customers.service');

const router = express.Router();
const orderService = new OrderService();
const customerService = new CustomerService();

const { checkRoles } = require('../middlewares/auth.handler')

router.get('/my-orders',
  passport.authenticate('jwt', {session: false}),
  checkRoles('customer', 'admin'),
  async (req, res, next) => {
  try {
    const user = req.user;
    const orders = await orderService.findByUser(user.sub);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get('/new-order',
  passport.authenticate('jwt', {session: false}),
  checkRoles('customer'),
  async (req, res, next) => {
  try {
    const user = req.user;
    const customer = await customerService.findByUser(user.sub);
    const orders = await orderService.create({customerId: customer.id});
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
