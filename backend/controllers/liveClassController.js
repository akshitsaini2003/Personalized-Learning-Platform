const LiveClass = require('../models/LiveClass');

// ✅ **Admin: Live Class Add Kare**
exports.addLiveClass = async (req, res) => {
    try {
        const { title, videoId, description, thumbnail, allowedUsers } = req.body;

        // Validate required fields
        if (!title || !videoId) {
            return res.status(400).json({ error: "Title and Video ID are required" });
        }

        // Create new live class
        const newLiveClass = new LiveClass({
            title,
            videoId,
            description,
            thumbnail,
            addedBy: req.user.id, // Admin ID
            allowedUsers // List of allowed users
        });

        // Save to database
        await newLiveClass.save();

        // Send success response
        res.status(201).json({ 
            message: "Live class added successfully", 
            liveClass: newLiveClass 
        });

    } catch (error) {
        console.error("Error adding live class:", error);
        res.status(500).json({ 
            error: "Server error", 
            details: error.message 
        });
    }
};

// ✅ **Admin: Live Class Edit Kare**

exports.editLiveClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, videoId, description, thumbnail, allowedUsers } = req.body;

        // Validate required fields
        if (!title || !videoId) {
            return res.status(400).json({ error: "Title and Video ID are required" });
        }

        // Find and update the live class
        const updatedLiveClass = await LiveClass.findByIdAndUpdate(
            id,
            { title, videoId, description, thumbnail, allowedUsers },
            { new: true } // Return updated document
        );

        if (!updatedLiveClass) {
            return res.status(404).json({ error: "Live class not found" });
        }

        // Send success response
        res.status(200).json({ 
            message: "Live class updated successfully", 
            liveClass: updatedLiveClass 
        });

    } catch (error) {
        console.error("Error updating live class:", error);
        res.status(500).json({ 
            error: "Server error", 
            details: error.message 
        });
    }
};
// ✅ **User: Sirf Admin ki Add Ki Hui Classes Dekhe**
exports.getLiveClasses = async (req, res) => {
    try {
        // Fetch all live classes sorted by createdAt (latest first)
        const liveClasses = await LiveClass.find({
            $or: [
                { allowedUsers: { $in: [req.user.id] } }, // User is in the allowedUsers list
                { allowedUsers: { $size: 0 } } // No restrictions (empty allowedUsers list)
            ]
        })
        .sort({ createdAt: -1 })
        .populate('addedBy', 'name email') // Populate addedBy field with admin details
        .populate('allowedUsers', 'name email'); // Populate allowedUsers field with user details

        // Send response
        res.status(200).json(liveClasses);

    } catch (error) {
        console.error("Error fetching live classes:", error);
        res.status(500).json({ 
            error: "Server error", 
            details: error.message 
        });
    }
};
// ✅ **Admin: Live Class Delete Kare**
exports.deleteLiveClass = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the live class
        const deletedLiveClass = await LiveClass.findByIdAndDelete(id);

        if (!deletedLiveClass) {
            return res.status(404).json({ error: "Live class not found" });
        }

        // Send success response
        res.status(200).json({ 
            message: "Live class deleted successfully", 
            liveClass: deletedLiveClass 
        });

    } catch (error) {
        console.error("Error deleting live class:", error);
        res.status(500).json({ 
            error: "Server error", 
            details: error.message 
        });
    }
};