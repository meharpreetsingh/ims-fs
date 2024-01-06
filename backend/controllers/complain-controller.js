const Complain = require("../models/complainSchema.js");

const complainCreate = async (req, res) => {
  console.log(req.body);
  try {
    // Check if complain with same text already exists
    const existingComplain = await Complain.findOne({ text: req.body.text });
    if (existingComplain) {
      return res.status(400).json({ message: "Complain already exists" });
    }
    const complain = new Complain(req.body);
    const result = await complain.save();
    res.send(result);
  } catch (err) {
    res.status(500).json(err);
  }
};
const deleteComplain = async (req, res) => {
  try {
    const complain = await Complain.findByIdAndDelete(req.params.id);
    if (!complain) {
      res.status(404).send({ message: "Complain not found" });
    } else {
      res.send({ message: "Complain deleted successfully" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
const complainList = async (req, res) => {
  try {
    let complains = await Complain.find({ school: req.params.id }).populate("user", "name");
    if (complains.length > 0) {
      res.send(complains);
    } else {
      res.send({ message: "No complains found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { complainCreate, complainList, deleteComplain };
