const express = require("express");
const router = express.Router();
const Visitor = require("../Models/visitor");
const { fetchVisitorLogs } = require("../services/visitorService");
const { fetchApprovedVisitors, declineVisitor, approveVisitor} = require("../services/visitorService");
const { deleteVisitorById} = require("../services/visitorService");
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

// Get all visitors
router.get("/getVisitors", async (req, res) => {
  const { date } = req.query;
  
  const visitor = await fetchVisitorLogs(date);
  console.log("fetched visitor recieved: ", visitor);
  if (visitor) {
    res.status(200).send(visitor);
  } else {
    res.status(500).send(error);
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

// Update a visitor
// router.put("/updateVisitorStatus", async (req, res) => {
//   const { id, approved, declined, declineReason } = req.body;
//   try {
//     const visitor = await Visitor.findById(id);
//     if (!visitor) {
//       return res.status(404).send({ message: "Visitor not found" });
//     }
//     visitor.approved = approved;
//     visitor.declined = declined;
//     visitor.declineReason = declineReason;
//     await visitor.save();
//     res.status(200).send(visitor);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// router.patch("/visitors/:id", async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = [
//     "name",
//     "purpose",
//     "startDate",
//     "endDate",
//     "numberOfVisitors",
//     "bringCar",
//     "selectedPlateNumbers",    
//     "possessionCheckedState",    
//     "approved",
//     "declined",
//     "declineReason",
//   ];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid updates!" });
//   }

//   try {
//     const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!visitor) {
//       return res.status(404).send();
//     }

//     res.status(200).send(visitor);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// Delete a visitor
router.delete("/visitors/:visitorId", async (req, res) => {
  try {
    const visitorId = req.params.id;
    const visitor = await deleteVisitorById(visitorId);

    res.status(200).send(visitor);
  } catch (error) {
    res.status(500).send({ error: error.message });
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

router.put("/approveVisitor/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const visitor = await approveVisitor(id);
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
// Define the route for fetching approved visitors
router.get('/getapprovedVisitors', async (req, res) => {
  const { approved } = req.query;
  console.log("Approved visitors request received: ", req.query);
  try {
    const visitors = await fetchApprovedVisitors(approved === 'true');
    console.log("Fetched approved visitors: ", visitors);
    res.status(200).send(visitors);
  } catch (error) {
    console.error("Error fetching approved visitors: ", error);
    res.status(500).send(error);
  }
});
// Endpoint to mark a visitor as inside
router.put('/visitor/:id/enter', async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).send('Visitor not found');

    visitor.isInside = true;
    await visitor.save();
    res.status(200).json(visitor);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
// Endpoint to mark a visitor as left
router.put('/visitor/:id/leave', async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).send('Visitor not found');

    visitor.hasLeft = true;
    await visitor.save();
    res.status(200).json(visitor);
  } catch (err) {
    res.status(500).send('Server error');
  }
});
module.exports = router;
