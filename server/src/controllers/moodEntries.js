const prisma = require("../prisma");

// Get all mood entries for a user
const getEntries = async (req, res) => {
  try {
    const entries = await prisma.moodEntry.findMany({
      where: { userId: req.userId },
      include: {
        contextLogs: {
          include: {
            variable: true,
          },
        },
      },
      orderBy: { loggedAt: "desc" },
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Create a new mood entry
const createEntry = async (req, res) => {
  const { moodScore, notes, contextLogs } = req.body;

  if (!moodScore || moodScore < 1 || moodScore > 10) {
    return res
      .status(400)
      .json({ message: "Mood score must be between 1 and 10" });
  }
  try {
    const entry = await prisma.moodEntry.create({
      data: {
        userId: req.userId,
        moodScore,
        notes,
        contextLogs: {
          create:
            contextLogs?.map((log) => ({
              variableId: log.variableId,
              value: log.value,
            })) || [],
        },
      },
      include: {
        contextLogs: {
          include: {
            variable: true,
          },
        },
      },
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a mood entry
const deleteEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const entry = await prisma.moodEntry.findUnique({
      where: { id: parseInt(id) },
    });

    if (!entry || entry.userId !== req.userId) {
      return res.status(404).json({ message: "Entry not found" });
    }

    await prisma.contextLog.deleteMany({ where: { entryId: parseInt(id) } });
    await prisma.moodEntry.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getEntries, createEntry, deleteEntry };
