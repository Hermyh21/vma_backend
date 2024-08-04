const Visitor = require("../Models/visitor");
const socketIO = require("socket.io");

// Function to fetch visitor logs within a specific date range from the database
const fetchVisitorLogs = async (date) => {
  console.log("fetchVisitorLogs called with date:", date);
 // Convert the date to a Date object and set the time to midnight
 const startOfDay = new Date(date);
 startOfDay.setHours(6, 0, 0, 0);

 const endOfDay = new Date(date);
 endOfDay.setHours(17, 0, 0, 0);

 console.log("Query to fetch visitor logs: ", {
   startDate: { $lte: endOfDay },
   endDate: { $gte: startOfDay },
 });
  const query = {
    startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
  };
  console.log("Query to fetch visitor logs:", JSON.stringify(query, null, 2));

  try {
    const visitorLogs = await Visitor.find(query);

    // Log the number of visitor logs fetched and a sample if the array is large
    console.log(`Number of visitor logs fetched: ${visitorLogs.length}`);
    if (visitorLogs.length > 0) {
      console.log("Sample visitor log fetched:", visitorLogs[0]);
    } else {
      console.log("No visitor logs found for the given date.");
    }

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
const visitorsYetToArrive = async (date) => {

  try {
    console.log("Fetching visitors yet to arrive for date:", date);
    const yetToArrive = await Visitor.find({
      startDate: { $lte: new Date(date) },
      endDate: { $gte: new Date(date) },
      approved: true,
      declined: false,
      hasLeft: false,
      isInside: false,
    }); 
    console.log("Visitors fetched successfully:", yetToArrive);  
    return yetToArrive;
  } catch (error) {
    console.error("Error fetching visitors yet to arrive:", error);
    throw error;
  }
};
//fetch visitors inside
const fetchVisitorsInside = async (date) => {

  try {
    console.log("Fetching visitors inside the compound for date:", date);
    const fetchVisitorsInside = await Visitor.find({
      startDate: { $lte: new Date(date) },
      endDate: { $gte: new Date(date) },
      approved: true,
      declined: false,
      hasLeft: false,
      isInside: true,
    }); 
    console.log("Visitors fetched successfully:", fetchVisitorsInside);  
    return fetchVisitorsInside;
  } catch (error) {
    console.error("Error fetching visitors inside:", error);
    throw error;
  }
};
//fetch visitors who left
const fetchVisitorsLeft = async (date) => {

  try {
    console.log("Fetching visitors inside the compound for date:", date);
    const fetchVisitorsLeft = await Visitor.find({
      startDate: { $lte: new Date(date) },
      endDate: { $gte: new Date(date) },
      approved: true,
      declined: false,
      hasLeft: true,
      isInside: false,
    }); 
    console.log("Visitors who left fetched successfully:", fetchVisitorsLeft);  
    return fetchVisitorsLeft;
  } catch (error) {
    console.error("Error fetching visitors who left:", error);
    throw error;
  }
};
//Function to fetch approved visitors
const fetchApprovedVisitors = async () => {
  try {
    const approvedVisitors = await Visitor.find({ approved: true });
    return approvedVisitors;
  } catch (error) {
    throw new Error('Failed to fetch approved visitors: ' + error.message);
  }
};

const fetchDeclinedVisitors = async () => {
  try {
    const declinedVisitors = await Visitor.find({ declined: true });
    return declinedVisitors;
  } catch (error) {
    throw new Error('Failed to fetch declined visitors: ' + error.message);
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
// mark visitor as inside
const visitorInside = async (visitorId) => {
  try {
    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      throw new Error('Visitor not found');
    }

    visitor.isInside = true;
    visitor.hasLeft = false;

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
    throw new Error('Failed to let visitor inside: ' + error.message);
  }
};
//mark visitor as hasLeft
const visitorHasLeft = async (visitorId) => {
  try {
    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      throw new Error('Visitor not found');
    }
    visitor.hasLeft = true;
    visitor.isInside = false;    
    await visitor.save();
    return visitor;
  } catch (error) {
    throw new Error('Failed to mark visitor as hasLeft: ' + error.message);
  }
};
module.exports = { fetchVisitorsLeft, fetchVisitorsInside, visitorHasLeft, visitorInside, fetchVisitorLogs, fetchDeclinedVisitors, fetchNewRequests, visitorsYetToArrive, declineVisitor, approveVisitor, pollVisitorLogs, getVisitorById, fetchApprovedVisitors, deleteVisitorById };
