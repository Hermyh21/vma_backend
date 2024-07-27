const Visitor = require('../models/visitor');

exports.updateVisitor = async (req, res) => {
  const visitorId = req.params.visitorId;
  const {
    numberOfVisitors,
    names,
    purpose,
    startDate,
    endDate,
    bringCar,
    selectedPlateNumbers,
    possessions,
    approved,
    declined,
    declineReason,
    isInside,
    hasLeft
  } = req.body;

  try {
    const updatedVisitor = await Visitor.findByIdAndUpdate(
      visitorId,
      {
        numberOfVisitors,
        names,
        purpose,
        startDate,
        endDate,
        bringCar,
        selectedPlateNumbers,
        possessions,
        approved,
        declined,
        declineReason,
        isInside,
        hasLeft
      },
      { new: true, runValidators: true }
    );

    if (!updatedVisitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.status(200).json(updatedVisitor);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update visitor', error });
  }
};
