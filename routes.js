const express = require("express");
const {check, validationResult} = require("express-validator")
const router = express.Router();
const Desk = require("./models/deskModel");

router.get("/desk", [
    check("title").not().isEmpty().withMessage("Title is required"),
    check("messinessLevel").isInt({ min: 1, max: 10}).withMessage("Messiness level must be between 1 and 10")
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    try {
        const desks = await Desk.find();
        if (!desks.length) {
            return res.status(400).json({ message: "No desks found" });
        }
        return res.json(desks);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post("/desk", [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('messinessLevel').isInt({ min: 1, max: 10 }).withMessage('Messiness level must be between 1 and 10')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const desk = req.body;
        const newDesk = new Desk(desk);
        await newDesk.save();
        return res.status(201).json(newDesk); 
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.put("/desk/:id", [
    check("title").optional().not().isEmpty().withMessage("Title is required"),
    check("messinessLevel").optional().isInt({ min: 1, max: 10}).withMessage("Messiness level must be between 1 and 10")
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    try {
        const id = req.params.id;
        const desk = req.body;
        const updatedDesk = await Desk.findByIdAndUpdate(id, desk, { new: true });
        if (!updatedDesk) {
            return res.status(400).json({ message: "Desk not found" });
        }
        return res.status(200).json(updatedDesk);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.delete("/desk/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deletedDesk = await Desk.findByIdAndDelete(id); 
        if (!deletedDesk) {
            return res.status(400).json({ message: "Desk not found" });
        }
        return res.status(200).json(deletedDesk); 
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;