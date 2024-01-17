const bcrypt = require("bcrypt");
const Admin = require("../models/adminSchema.js");
const Sclass = require("../models/sclassSchema.js");
const Student = require("../models/studentSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");
const Notice = require("../models/noticeSchema.js");
const Complain = require("../models/complainSchema.js");

const adminRegister = async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const admin = new Admin({
      ...req.body,
    });
    admin.password = hashedPass;

    const existingAdminByEmail = await Admin.findOne({ email: req.body.email });

    if (existingAdminByEmail) {
      res.send({ message: "Email already exists" });
    }
    const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

    if (existingSchool) {
      res.send({ message: "School name already exists" });
    } else {
      let result = await admin.save();
      result.password = undefined;
      res.send(result);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const adminLogIn = async (req, res) => {
  if (req.body.email && req.body.password) {
    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
      if (await bcrypt.compare(req.body.password, admin.password)) {
        admin.password = undefined;
        res.send(admin);
      } else {
        res.send({ message: "Invalid password" });
      }
    } else {
      res.send({ message: "User not found" });
    }
  } else {
    res.send({ message: "Email and password are required" });
  }
};

const getAdminDetail = async (req, res) => {
  try {
    let admin = await Admin.findById(req.params.id);
    if (admin) {
      admin.password = undefined;
      res.send(admin);
    } else {
      res.send({ message: "No admin found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const result = await Admin.findByIdAndDelete(req.params.id);

    await Sclass.deleteMany({ school: req.params.id });
    await Student.deleteMany({ school: req.params.id });
    await Teacher.deleteMany({ school: req.params.id });
    await Subject.deleteMany({ school: req.params.id });
    await Notice.deleteMany({ school: req.params.id });
    await Complain.deleteMany({ school: req.params.id });

    res.send(result);
  } catch (error) {
    res.status(500).json(err);
  }
};

const updateAdmin = async (req, res) => {
  try {
    if (req.body.password) {
      // If password is being changed too
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    let result = await Admin.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    result.password = undefined;
    res.send(result);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = { adminRegister, adminLogIn, getAdminDetail, deleteAdmin, updateAdmin };
