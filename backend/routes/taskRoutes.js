const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// Get all tasks
router.get('/', protect, async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
});

// Create task
router.post('/', protect, async (req, res) => {
  const { title, notes, priority, category, dueDate } = req.body;
  const task = await Task.create({ user: req.user._id, title, notes, priority, category, dueDate });
  res.status(201).json(task);
});

// Update task
router.put('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (task.user.toString() !== req.user._id.toString())
    return res.status(401).json({ message: 'Not authorized' });
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete task
router.delete('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (task.user.toString() !== req.user._id.toString())
    return res.status(401).json({ message: 'Not authorized' });
  await task.deleteOne();
  res.json({ message: 'Task removed' });
});

module.exports = router;