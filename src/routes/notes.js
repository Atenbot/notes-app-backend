const express = require("express");
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");
const { authenticateToken } = require("../middleware/auth");
const {
  createNoteValidation,
  updateNoteValidation,
  handleValidationErrors,
} = require("../middleware/validation");

const router = express.Router();

router.use(authenticateToken);

router.get("/", getNotes);

router.get("/:id", getNote);

router.post("/", createNoteValidation, handleValidationErrors, createNote);

router.put("/:id", updateNoteValidation, handleValidationErrors, updateNote);

router.delete("/:id", deleteNote);

module.exports = router;
