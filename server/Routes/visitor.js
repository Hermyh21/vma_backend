const express = require("express");
const router = express.Router();
const Visitor = require("../Models/visitor");
const { fetchVisitorsLeft, fetchVisitorsInside, visitorInside, visitorsYetToArrive, fetchVisitorLogs, fetchApprovedVisitors, fetchDeclinedVisitors, declineVisitor, approveVisitor, deleteVisitorById, fetchNewRequests, isInside, visitorHasLeft} = require("../services/visitorService");
// Add a visitor
router.post("/visitors", async (req, res) => {
  let data = req.body;
  console.log("data recieved: ", data);

  try {
    const visitor = new Visitor(data);
    //console.log("visitors recieved: ", visitor);
    await visitor.save();
    res.status(201).send("User is saved");
  } catch (error) {
    res.status(400).send(error);
    console.log("error: ", error);
  }
});
// Update visitor route
router.put("/updatevisitors/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
console.log("Herrrrr:",data);
  try {
    const visitor = await Visitor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!visitor) {
      return res.status(404).send("Visitor not found");
    }
    res.status(200).send(visitor);
  } catch (error) {
    res.status(400).send(error);
    console.log("error: ", error);
  }
});
// Get all visitors
router.get("/getVisitors", async (req, res) => {
  const { date } = req.query;

  // Log the incoming request query
  console.log("Received request to /getVisitors with query:", req.query);

  try {
    const visitor = await fetchVisitorLogs(date);
    
    // Log the fetched visitor data
    console.log("Fetched visitor received:", visitor);
    
    if (visitor) {
      res.status(200).send(visitor);
    } else {
      res.status(404).send({ error: "No visitors found for the given date" });
    }
  } catch (error) {
    // Log any errors that occur
    console.error("Error fetching visitors:", error);
    res.status(500).send({ error: "An error occurred while fetching visitors" });
  }
});

// Fetch new requests
router.get("/newRequests", async (req, res) => {
  const { date } = req.query;
  console.log("Fetch New Requests on date:", date);
  try {
    const newRequests = await fetchNewRequests(date);
    res.status(200).send(newRequests);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
// Fetch visitors yet to arrive
router.get("/yetToArrive", async (req, res) => {
  const { date } = req.query;
  
  try {
    console.log("Reeeequests from the route", date);
    const yetToArrive = await visitorsYetToArrive(date);
    console.log("Responding with visitors yet to arrive:", yetToArrive);
    res.status(200).send(yetToArrive);
  } catch (error) {
    console.error("Error in /yetToArrive route:", error);
    res.status(500).send({ error: error.message });
  }
  
});
//Fetch visitors inside the compound
router.get("/fetchInside", async (req, res) => {
  const { date } = req.query;
  
  try {
    console.log("]]]]]from the route", date);
    const fetchInside = await fetchVisitorsInside(date);
    console.log("Responding with visitors inside:", fetchInside);
    res.status(200).send(fetchInside);
  } catch (error) {
    console.error("Error in /fetchVisitorsInside route:", error);
    res.status(500).send({ error: error.message });
  }
  
});
//fetch visitors who left
router.get("/fetchLeft", async (req, res) => {
  const { date } = req.query;  
  try {
    console.log("lefttttt", date);
    const fetchLeft = await fetchVisitorsLeft(date);
    console.log("Responding with visitors who left:", fetchLeft);
    res.status(200).send(fetchLeft);
  } catch (error) {
    console.error("Error in /fetchVisitorsLeft route:", error);
    res.status(500).send({ error: error.message });
  }
  
});
router.get("/getVisitor/:visitorId", async (req, res) => {
  console.log("visitors get request recieved: ", req.query);
  try {
    const { visitorId } = req.params;

    // Fetch visitor by ID from your data source (e.g., database)
    const visitor = await Visitor.findById(visitorId);
    console.log("Here's the visitor by the id", visitorId, " ", visitor);
    if (visitor) {
      res.status(200).send(visitor); // Send visitor as response
    } else {
      res.status(404).send({ message: "Visitor not found" });
    }
  } catch (error) {
    console.error("Error fetching visitor:", error);
    res
      .status(500)
      .send({ error: "Failed to fetch visitor", message: error.message });
  }
});
// Get a specific visitor
router.get("/visitors/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const visitor = await Visitor.findById(_id);
    if (!visitor) {
      return res.status(404).send();
    }
    res.status(200).send(visitor);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.delete('/deleteVisitor/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const visitor = await Visitor.findByIdAndDelete(id);
    if (!visitor) {
      return res.status(404).send('Visitor not found');
    }
    res.status(200).send({ message: 'Visitor deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete visitor', error: error.message });
    console.error('Error:', error);
  }
});

// Route to fetch visitor logs
router.get("/logs", async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const logs = await fetchVisitorLogs(new Date(startDate), new Date(endDate));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching visitor logs", error });
  }
});
//route to approve visitor
router.put("/approveVisitor/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const visitor = await approveVisitor(id);
    res.status(200).send(visitor);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
//route to mark visitor as inside
router.put("/visitorsInside/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const visitor = await visitorInside(id);
    res.status(200).send(visitor);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
// route to let visitor leave
router.put("/visitorLeft/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const visitor = await visitorHasLeft(id);
    res.status(200).send(visitor);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
// Decline Visitor Route
router.put("/declineVisitor/:id", async (req, res) => {
  const { id } = req.params;
  const { declineReason } = req.body; // Optional decline reason

  try {
    const visitor = await declineVisitor(id, declineReason);
    res.status(200).send(visitor);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Fetch approved visitors
router.get("/approvedVisitors", async (req, res) => {
  try {
    const approvedVisitors = await fetchApprovedVisitors();
    res.status(200).send(approvedVisitors);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
//fetch declined visitors
router.get("/declinedVisitors", async (req, res) => {
  try {
    const declinedVisitors = await fetchDeclinedVisitors();
    res.status(200).send(declinedVisitors);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
