const Item = require('../models/item.model');

// const mockLostItems = [
//   {
//     id: 'lost-1',
//     title: 'Lost Wallet',
//     description: 'Brown leather wallet with ID and credit cards',
//     location: 'Downtown',
//     date: 'May 20, 2025',
//     type: 'lost',
//     image: 'wallet.jpg'
//   },
//   {
//     id: 'lost-2',
//     title: 'Missing iPhone',
//     description: 'Blue iPhone 15 with cracked screen protector',
//     location: 'Coffee Shop',
//     date: 'May 21, 2025',
//     type: 'lost',
//     image: 'iphone.jpg'
//   },
//   {
//     id: 'lost-3',
//     title: 'Lost Car Keys',
//     description: 'Toyota car keys with blue remote',
//     location: 'Shopping Mall',
//     date: 'May 19, 2025',
//     type: 'lost'
//   }
// ];

// const mockFoundItems = [
//   {
//     id: 'found-1',
//     title: 'Found Keys',
//     description: 'Set of house keys with red keychain',
//     location: 'Central Park',
//     date: 'May 22, 2025',
//     type: 'found',
//     image: 'keys.jpg'
//   },
//   {
//     id: 'found-2',
//     title: 'Found Watch',
//     description: 'Silver watch with black leather strap',
//     location: 'Bus Station',
//     date: 'May 23, 2025',
//     type: 'found',
//     image: 'watch.jpg'
//   },
//   {
//     id: 'found-3',
//     title: 'Found Sunglasses',
//     description: 'Ray-Ban sunglasses in black case',
//     location: 'Beach',
//     date: 'May 24, 2025',
//     type: 'found'
//   }
// ];

exports.createItem = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      location,
      date,
      contactInfo,
      userId,
      imageUrl
    } = req.body;

    // Validate required fields
    if (!type || !title || !description || !category || !location || !date || !contactInfo || !userId) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Validate type
    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "lost" or "found"'
      });
    }

    // Validate imageUrl if provided (optional validation)
    if (imageUrl && typeof imageUrl !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'imageUrl must be a valid string'
      });
    }

    // Create item object with conditional imageUrl
    const itemData = {
      type,
      title,
      description,
      category,
      location,
      date,
      contactInfo,
      userId
    };

    // Only add imageUrl if it's provided and not empty
    if (imageUrl && imageUrl.trim()) {
      itemData.imageUrl = imageUrl.trim();
    }

    // Create new item
    const newItem = new Item(itemData);

    const savedItem = await newItem.save();

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: savedItem
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// Get items by type (lost or found)
exports.getItemsByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    // Validate type parameter
    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be either "lost" or "found"'
      });
    }

    // Query MongoDB for items by type, sorted by creation date (newest first)
    const items = await Item.find({ type: type })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email') // Optional: populate user details if needed
      .lean(); // Use lean() for better performance when you don't need mongoose document methods

    // Transform data to match frontend expectations
    const transformedItems = items.map(item => ({
      id: item._id.toString(),
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      date: item.date,
      type: item.type,
      contactInfo: item.contactInfo,
      userId: item.userId,
      image: item.imageUrl,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: transformedItems,
      count: transformedItems.length,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} items retrieved successfully`
    });

  } catch (error) {
    console.error(`Error fetching ${req.params.type} items:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch ${req.params.type} items`,
      error: error.message
    });
  }
};

// // Get single item by ID
// const getItemById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const item = await Item.findById(id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: item
//     });

//   } catch (error) {
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid item ID'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Update item
// const updateItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     // Remove fields that shouldn't be updated
//     delete updates._id;
//     delete updates.reportedAt;
//     delete updates.createdAt;
//     delete updates.updatedAt;

//     const item = await Item.findById(id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found'
//       });
//     }

//     // Check if user owns the item (basic authorization)
//     if (updates.userId && item.userId !== updates.userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only update your own items'
//       });
//     }

//     const updatedItem = await Item.findByIdAndUpdate(
//       id,
//       updates,
//       {
//         new: true,
//         runValidators: true
//       }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Item updated successfully',
//       data: updatedItem
//     });

//   } catch (error) {
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: Object.values(error.errors).map(err => err.message)
//       });
//     }

//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid item ID'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Delete item
// const deleteItem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.body; // or get from auth middleware

//     const item = await Item.findById(id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found'
//       });
//     }

//     // Check if user owns the item (basic authorization)
//     if (userId && item.userId !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only delete your own items'
//       });
//     }

//     await Item.findByIdAndDelete(id);

//     res.status(200).json({
//       success: true,
//       message: 'Item deleted successfully'
//     });

//   } catch (error) {
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid item ID'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // Update item status (mark as found/closed)
// const updateItemStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, userId } = req.body;

//     if (!['active', 'found', 'closed'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status. Must be active, found, or closed'
//       });
//     }

//     const item = await Item.findById(id);

//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: 'Item not found'
//       });
//     }

//     // Check if user owns the item
//     if (userId && item.userId !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'You can only update your own items'
//       });
//     }

//     const updatedItem = await Item.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Item status updated successfully',
//       data: updatedItem
//     });

//   } catch (error) {
//     if (error.name === 'CastError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid item ID'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };
