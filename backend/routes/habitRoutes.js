const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const { protect } = require('../middleware/authMiddleware');

// Get all habits
router.get('/', protect, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create habit
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, frequency, color } = req.body;
    const habit = await Habit.create({
      user: req.user._id,
      title,
      description,
      frequency,
      color
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark habit complete/uncomplete for today
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    // ✅ Local date fix for India IST timezone
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const alreadyDone = habit.completedDates.some(d => {
      const cd = new Date(d);
      const cdStr = `${cd.getFullYear()}-${String(cd.getMonth() + 1).padStart(2, '0')}-${String(cd.getDate()).padStart(2, '0')}`;
      return cdStr === todayStr;
    });

    if (alreadyDone) {
      habit.completedDates = habit.completedDates.filter(d => {
        const cd = new Date(d);
        const cdStr = `${cd.getFullYear()}-${String(cd.getMonth() + 1).padStart(2, '0')}-${String(cd.getDate()).padStart(2, '0')}`;
        return cdStr !== todayStr;
      });
      habit.streak = Math.max(0, habit.streak - 1);
    } else {
      habit.completedDates.push(now);
      habit.streak += 1;
    }

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete habit
router.delete('/:id', protect, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    await habit.deleteOne();
    res.json({ message: 'Habit removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;