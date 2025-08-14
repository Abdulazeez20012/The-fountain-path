const express = require('express');
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');

const router = express.Router();

// Get donation stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonors: { $addToSet: '$donor' },
          totalDonations: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = await Donation.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      total: stats[0] || { totalAmount: 0, totalDonors: [], totalDonations: 0 },
      monthly: monthlyStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's donations
router.get('/my', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create donation
router.post('/', auth, async (req, res) => {
  try {
    const { amount, purpose, paymentMethod, transactionId } = req.body;

    const donation = new Donation({
      donor: req.user.userId,
      amount,
      purpose,
      paymentMethod,
      transactionId,
      status: 'pending'
    });

    await donation.save();
    await donation.populate('donor', 'name email');

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update donation status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('donor', 'name email');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
