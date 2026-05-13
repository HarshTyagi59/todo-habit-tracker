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

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const alreadyDone = habit.completedDates.some(d => {
      const cd = new Date(d);
      const cdStr = `${cd.getFullYear()}-${String(cd.getMonth() + 1).padStart(2, '0')}-${String(cd.getDate()).padStart(2, '0')}`;
      return cdStr === todayStr;
    });

    if (alreadyDone) {
      // Unmark today
      habit.completedDates = habit.completedDates.filter(d => {
        const cd = new Date(d);
        const cdStr = `${cd.getFullYear()}-${String(cd.getMonth() + 1).padStart(2, '0')}-${String(cd.getDate()).padStart(2, '0')}`;
        return cdStr !== todayStr;
      });
    } else {
      // Mark today
      habit.completedDates.push(now);
    }

    // ✅ Recalculate streak properly from completedDates
    const sortedDates = habit.completedDates
      .map(d => {
        const cd = new Date(d);
        return `${cd.getFullYear()}-${String(cd.getMonth() + 1).padStart(2, '0')}-${String(cd.getDate()).padStart(2, '0')}`;
      })
      .sort()
      .reverse() // Latest first

    let streak = 0
    let checkDate = new Date()

    for (let i = 0; i < sortedDates.length; i++) {
      const checkStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;

      if (sortedDates[i] === checkStr) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1) // Go back one day
      } else {
        break // Streak broken
      }
    }

    habit.streak = streak;
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