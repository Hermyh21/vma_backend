const Visitor = require("../Models/visitor");
const socketIO = require("socket.io");

// Function to fetch visitor logs within a specific date range from the database
const fetchVisitorLogs = async (date) => {
  console.log("fetchVisitorLogs: ", date);
  try {
    const visitorLogs = await Visitor.find({
      startDate: { $lte: new Date(date) },
      endDate: { $gte: new Date(date) },
    });

    //console.log("fetchedVisitorLogs: ", visitorLogs);
    return visitorLogs;
  } catch (error) {
    console.error("Error fetching visitor logs:", error);
    throw error;
  }
};
const fetchNewRequests = async (date) => {
  console.log("fetchNewRequests: ", date);
  try {
    const newRequests = await Visitor.find({
      startDate: { $lte: new Date(date) },
      endDate: { $gte: new Date(date) },
      approved: false,
      declined: false
    });

    console.log("fetchedNewRequests: ", newRequests);
    return newRequests;
  } catch (error) {
    console.error("Error fetching new requests:", error);
    throw error;
  }
};

// Function to fetch approved visitors
const fetchApprovedVisitors = async () => {
  try {
    const approvedVisitors = await Visitor.find({ approved: true });
    return approvedVisitors;
  } catch (error) {
    throw new Error('Failed to fetch approved visitors: ' + error.message);
  }
};

// Polling function to periodically fetch and emit visitor logs
const pollVisitorLogs = (io, interval = 10000) => {
  setInterval(async () => {
    try {
      const visitorLogs = await Visitor.find({});
      io.emit("visitorLogsUpdated", visitorLogs);
    } catch (error) {
      console.error("Error fetching visitor logs:", error);
    }
  }, interval);
};
//Delete visitor by id
const deleteVisitorById = async (visitorId) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(visitorId);

    if (!visitor) {
      throw new Error('Visitor not found');
    }

    return visitor;
  } catch (error) {
    throw new Error('Failed to delete visitor');
  }
}
const getVisitorById = async (visitorId) => {
  try {
    // Fetch visitor by ID from the database
    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      throw new Error("Visitor not found");
    }

    return visitor;
  } catch (error) {
    // Handle errors
    console.error("Failed to load visitor:", error);
    throw error;
  }
};
// Approve visitor by ID
const approveVisitor = async (visitorId) => {
  try {
    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      throw new Error('Visitor not found');
    }

    visitor.approved = true;
    visitor.declined = false;

    await visitor.save();

    return visitor;
  } catch (error) {
    throw new Error('Failed to approve visitor: ' + error.message);
  }
};
// Decline visitor by ID
const declineVisitor = async (visitorId, declineReason = '') => {
  try {
    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      throw new Error('Visitor not found');
    }

    visitor.declined = true;
    visitor.approved = false;
    visitor.declineReason = declineReason;

    await visitor.save();

    return visitor;
  } catch (error) {
    throw new Error('Failed to decline visitor: ' + error.message);
  }
};
module.exports = { fetchVisitorLogs, fetchNewRequests, declineVisitor, approveVisitor, pollVisitorLogs, getVisitorById, fetchApprovedVisitors, deleteVisitorById };
