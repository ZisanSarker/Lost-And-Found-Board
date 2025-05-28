const Item = require('../models/item.model');
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

    if (!type || !title || !description || !category || !location || !date || !contactInfo || !userId) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "lost" or "found"'
      });
    }

    if (imageUrl && typeof imageUrl !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'imageUrl must be a valid string'
      });
    }

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

    if (imageUrl && imageUrl.trim()) {
      itemData.imageUrl = imageUrl.trim();
    }

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


exports.getItemsByType = async (req, res) => {
  try {
    const { type } = req.params;

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be either "lost" or "found"'
      });
    }
    const items = await Item.find({ type: type })
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .lean(); 

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

exports.getUserItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const items = await Item.find({ userId: userId })
      .sort({ createdAt: -1 })
      .lean();

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
      imageUrl: item.imageUrl,
      status: item.status || 'active',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: transformedItems,
      count: transformedItems.length
    });

  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user items',
      error: error.message
    });
  }
};

exports.getItemById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Item ID is required' });
  }

  try {
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Item retrieved successfully',
      data: {
        id: item._id.toString(),
        title: item.title,
        description: item.description,
        category: item.category,
        location: item.location,
        date: item.date,
        type: item.type,
        contactInfo: item.contactInfo,
        userId: item.userId,
        imageUrl: item.imageUrl || null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    });

  } catch (error) {
    const isInvalidId = error.name === 'CastError';
    res.status(isInvalidId ? 400 : 500).json({
      success: false,
      message: isInvalidId ? 'Invalid item ID format' : 'Server error while retrieving item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.updateItem = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }

    const {
      title,
      category,
      description,
      location,
      date,
      contactInfo,
      type,
      userId
    } = req.body;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (userId && item.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own items'
      });
    }

    if (title !== undefined) item.title = title;
    if (category !== undefined) item.category = category;
    if (description !== undefined) item.description = description;
    if (location !== undefined) item.location = location;
    if (date !== undefined) item.date = date;
    if (contactInfo !== undefined) item.contactInfo = contactInfo;
    if (type !== undefined) item.type = type;

    const updatedItem = await item.save();

    const transformedItem = {
      id: updatedItem._id.toString(),
      title: updatedItem.title,
      description: updatedItem.description,
      category: updatedItem.category,
      location: updatedItem.location,
      date: updatedItem.date,
      type: updatedItem.type,
      contactInfo: updatedItem.contactInfo,
      userId: updatedItem.userId,
      imageUrl: updatedItem.imageUrl,
      createdAt: updatedItem.createdAt,
      updatedAt: updatedItem.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: transformedItem
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (userId && item.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own items'
      });
    }

    await Item.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};