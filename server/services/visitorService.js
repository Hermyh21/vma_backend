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
// Fetch approved visitors from the database
const fetchApprovedVisitors = async (approved) => {
  try {
    const visitors = await Visitor.find({ approved: approved });
    return visitors;
  } catch (error) {
    console.error("Error fetching approved visitors: ", error);
    throw error;
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
module.exports = { fetchVisitorLogs, pollVisitorLogs, getVisitorById, fetchApprovedVisitors };
