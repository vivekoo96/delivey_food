const Tag = require('../models/Tag');

exports.createTag = async (req, res) => {
  try {
    const { title } = req.body;
    const tagId = await Tag.createTag({ title });
    res.status(201).json({ success: true, message: 'Tag created successfully', tagId });
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ success: false, message: 'Failed to create tag' });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.getAllTags();
    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tags' });
  }
};

exports.updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const success = await Tag.updateTag(id, { title });
    if (success) {
      res.status(200).json({ success: true, message: 'Tag updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Tag not found' });
    }
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ success: false, message: 'Failed to update tag' });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Tag.deleteTag(id);
    if (success) {
      res.status(200).json({ success: true, message: 'Tag deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Tag not found' });
    }
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ success: false, message: 'Failed to delete tag' });
  }
};
