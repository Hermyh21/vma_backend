const Visitor = require("../Models/visitor"); // Import the Visitor model

// Function to fetch visitor logs within a specific date range from the database
const fetchVisitorLogs = async (startDate, endDate) => {
  try {
    // Fetch visitor logs within the specified date range from the database
    const visitorLogs = await Visitor.find({
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
    });
    return visitorLogs;
  } catch (error) {
    // Handle errors
    console.error("Error fetching visitor logs:", error);
    throw error;
  }
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
module.exports = fetchVisitorLogs;
