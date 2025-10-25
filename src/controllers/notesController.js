import { prisma } from "../config/database.js";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZ", 6);

async function getNotes(req, res) {
  try {
    const userId = req.user.id;

    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { lastEdited: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        archived: true,
        dateCreated: true,
        lastEdited: true,
      },
    });

    res.json({
      message: "Notes retrieved successfully",
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ error: "Failed to retrieve notes" });
  }
}

async function getNote(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await prisma.note.findFirst({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        archived: true,
        dateCreated: true,
        lastEdited: true,
      },
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note retrieved successfully", note });
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({ error: "Failed to retrieve note" });
  }
}

async function createNote(req, res) {
  try {
    const { title, content, tags, archived } = req.body;
    const userId = req.user.id;

    const note = await prisma.note.create({
      data: {
        id: nanoid(),
        title: title || null,
        content,
        tags: tags || [],
        archived: archived || false,
        userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        archived: true,
        dateCreated: true,
        lastEdited: true,
      },
    });

    res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
}

async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const { title, content, tags, archived } = req.body;
    const userId = req.user.id;

    const existingNote = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingNote.title,
        content: content !== undefined ? content : existingNote.content,
        tags: tags !== undefined ? tags : existingNote.tags,
        archived: archived !== undefined ? archived : existingNote.archived,
      },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        archived: true,
        dateCreated: true,
        lastEdited: true,
      },
    });

    res.json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
}

async function deleteNote(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingNote = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    await prisma.note.delete({ where: { id } });

    res.json({
      message: "Note deleted successfully",
      deletedNote: { id: existingNote.id, title: existingNote.title },
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
}

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
