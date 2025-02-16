const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const Candidate = require("../models/candidate");
const User = require("../models/user");
const { jwtAuthmiddleware, generateToken } = require("../jwt");

const checkAdmin = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (user.role === "admin") {
      return true;
    }
  } catch (error) {
    return false;
  }
};

// Post route to add a candidate
router.post("/", jwtAuthmiddleware, async (req, res) => {
  try {
    if (!(await checkAdmin(req.user.userData.id))) {
      return res.status(403).json({ message: "user does not have Admin role" });
    }

    // Assuming request body contains the candidate data
    const data = req.body;

    // Create a new user document using the Mongoose model
    const newCandidate = new Candidate(data);

    // save the new user to the database
    const response = await newCandidate.save();
    console.log("Candidate data saved ");

    res.status(200).json({ response: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server Error" });
  }
});

router.put("/:candidateID", jwtAuthmiddleware, async (req, res) => {
  try {
    if (!checkAdmin(req.user.id))
      return res.status(403).json({ message: "user does not have Admin role" });

    const candidateID = req.params.candidateID; // Extract id from URL parameter
    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate data updated");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Invalid server error" });
  }
});

router.delete("/:candidateID", jwtAuthmiddleware, async (req, res) => {
  try {
    if (!checkAdmin(req.user.id))
      return res.status(403).json({ message: "user does not have Admin role" });

    const candidateID = req.params.candidateID; // Extract id from URL parameter

    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate deleted");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Invalid server error" });
  }
});

// let's start voting
router.post("/vote/:candidateID", jwtAuthmiddleware, async (req, res) => {
  // no admin can vote
  // user can only vote once
  candidateID = req.params.candidateID;
  userId = req.user.userData.id;
  // console.log("candidateID is : " + candidateID);
  // console.log("userId is : " + userId);

  try {
    // find candidate
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: "No candidate found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "No User found" });
    }

    if (user.isVoted) {
      return res.status(404).json({ message: "You have already voted" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin not allowed" });
    }

    // Update cadidate document
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    // update the user document
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote recorded succcessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Invalid server error" });
  }
});

// vote count
router.get("/vote/count", async (req, res) => {
  try {
    // Find all candidate and sort them in descending order

    const candidate = await Candidate.find().sort({ voteCount: "desc" });

    // Map the candidates to only return their name and votecount
    const voteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    return res.status(200).json(voteRecord);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Invalid server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();

    // Return the list of candidates
    res.status(200).json(candidates);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Invalid server error" });
  }
});

module.exports = router;
