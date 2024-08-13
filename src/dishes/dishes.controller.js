const dishes = require("../data/dishes-data");
const nextId = require("../utils/nextId");

// List all dishes
function list(req, res) {
  res.json({ data: dishes });
}

// Read a specific dish by ID
function read(req, res) {
  const dish = dishes.find((dish) => dish.id === req.params.dishId);
  if (dish) {
    res.json({ data: dish });
  } else {
    res.status(404).json({ error: `Dish not found: ${req.params.dishId}` });
  }
}

// Create a new dish
function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;

  // Validation
  if (!name || name === "") return res.status(400).json({ error: "Dish must include a name" });
  if (!description || description === "") return res.status(400).json({ error: "Dish must include a description" });
  if (price == null) return res.status(400).json({ error: "Dish must include a price" });
  if (price <= 0 || !Number.isInteger(price)) return res.status(400).json({ error: "Dish must have a price that is an integer greater than 0" });
  if (!image_url || image_url === "") return res.status(400).json({ error: "Dish must include an image_url" });

  // Create the new dish
  const newDish = {
    id: nextId(),
    name,
    description,
    price,
    image_url
  };

  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

// Update an existing dish by ID
function update(req, res) {
  const dishId = req.params.dishId;
  const { data: { id, name, description, price, image_url } = {} } = req.body;

  // Find the dish
  const dishIndex = dishes.findIndex((dish) => dish.id === dishId);
  if (dishIndex === -1) return res.status(404).json({ error: `Dish does not exist: ${dishId}` });

  // Validation
  if (id && id !== dishId) return res.status(400).json({ error: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}` });
  if (!name || name === "") return res.status(400).json({ error: "Dish must include a name" });
  if (!description || description === "") return res.status(400).json({ error: "Dish must include a description" });
  if (price == null) return res.status(400).json({ error: "Dish must include a price" });
  if (price <= 0 || !Number.isInteger(price)) return res.status(400).json({ error: "Dish must have a price that is an integer greater than 0" });
  if (!image_url || image_url === "") return res.status(400).json({ error: "Dish must include an image_url" });

  // Update the dish
  const updatedDish = {
    id: dishId,
    name,
    description,
    price,
    image_url
  };

  dishes[dishIndex] = updatedDish;
  res.json({ data: updatedDish });
}

module.exports = {
  list,
  read,
  create,
  update,
};
