const orders = require("../data/orders-data");
const nextId = require("../utils/nextId");

// List all orders
function list(req, res) {
  res.json({ data: orders });
}

// Read a specific order by ID
function read(req, res) {
  const order = orders.find((order) => order.id === req.params.orderId);
  if (order) {
    res.json({ data: order });
  } else {
    res.status(404).json({ error: `Order not found: ${req.params.orderId}` });
  }
}

// Create a new order
function create(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  // Validation
  if (!deliverTo || deliverTo === "") return res.status(400).json({ error: "Order must include a deliverTo" });
  if (!mobileNumber || mobileNumber === "") return res.status(400).json({ error: "Order must include a mobileNumber" });
  if (!Array.isArray(dishes) || dishes.length === 0) return res.status(400).json({ error: "Order must include at least one dish" });

  dishes.forEach((dish, index) => {
    if (!dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)) {
      return res.status(400).json({ error: `dish ${index} must have a quantity that is an integer greater than 0` });
    }
  });

  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes
  };

  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

// Update an existing order by ID
function update(req, res) {
  const orderId = req.params.orderId;
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  // Find the order
  const orderIndex = orders.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) return res.status(404).json({ error: `Order does not exist: ${orderId}` });

  // Validation
  if (id && id !== orderId) return res.status(400).json({ error: `Order id does not match route id. Order: ${id}, Route: ${orderId}` });
  if (!deliverTo || deliverTo === "") return res.status(400).json({ error: "Order must include a deliverTo" });
  if (!mobileNumber || mobileNumber === "") return res.status(400).json({ error: "Order must include a mobileNumber" });
  if (!status || !['pending', 'preparing', 'out-for-delivery', 'delivered'].includes(status)) {
    return res.status(400).json({ error: "Order must have a status of pending, preparing, out-for-delivery, delivered" });
  }
  if (status === 'delivered') return res.status(400).json({ error: "A delivered order cannot be changed" });
  if (!Array.isArray(dishes) || dishes.length === 0) return res.status(400).json({ error: "Order must include at least one dish" });

  dishes.forEach((dish, index) => {
    if (!dish.quantity || dish.quantity <= 0 || !Number.isInteger(dish.quantity)) {
      return res.status(400).json({ error: `dish ${index} must have a quantity that is an integer greater than 0` });
    }
  });

  // Update the order
  const updatedOrder = {
    id: orderId,
    deliverTo,
    mobileNumber,
    status,
    dishes
  };

  orders[orderIndex] = updatedOrder;
  res.json({ data: updatedOrder });
}

// Delete an existing order by ID
function destroy(req, res) {
  const orderId = req.params.orderId;
  const orderIndex = orders.findIndex((order) => order.id === orderId);

  if (orderIndex === -1) return res.status(404).json({ error: `Order not found: ${orderId}` });
  if (orders[orderIndex].status !== 'pending') return res.status(400).json({ error: "An order cannot be deleted unless it is pending." });

  orders.splice(orderIndex, 1);
  res.status(204).end();
}

module.exports = {
  list,
  read,
  create,
  update,
 destroy,
};
