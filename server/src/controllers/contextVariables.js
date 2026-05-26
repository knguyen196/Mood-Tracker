const primsa = require("../prisma");

// Get all context variables for a user
const getVariables = async (req, res) => {
  try {
    const variables = await prisma.contextVariable.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "asc" },
    });
    res.json(variables);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Create a new context variable
const createVariable = async (req, res) => {
  const { name, unit } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const variable = await prisma.contextVariable.create({
      data: { name, unit, userId: req.userId },
    });
    res.status(201).json(variable);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a context variable
const deleteVariable = async (req, res) => {
  const { id } = req.params;
  try {
    const variable = await prisma.contextVariable.findUnique({
      where: { id: parseInt(id) },
    });

    if (!variable || variable.userId !== req.userId) {
      return res.status(404).json({ message: "Variable not found" });
    }
    await prisma.contextVariable.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Variable deleted" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getVariables, createVariable, deleteVariable };
