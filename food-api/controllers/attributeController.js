const Attribute = require('../models/Attribute');
const AttributeValue = require('../models/AttributeValue');

class AttributeController {
    static async getAllAttributes(req, res) {
        try {
            const attributes = await Attribute.getAllAttributes();
            res.json({ error: false, data: attributes });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    static async addAttribute(req, res) {
        try {
            const data = req.body;
            const attributeId = await Attribute.createAttribute(data);
            res.json({ error: false, message: 'Attribute added successfully', attributeId });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    static async updateAttribute(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const success = await Attribute.updateAttribute(id, data);
            if (success) {
                res.json({ error: false, message: 'Attribute updated successfully' });
            } else {
                res.status(404).json({ error: true, message: 'Attribute not found' });
            }
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    static async deleteAttribute(req, res) {
        try {
            const { id } = req.params;
            const affectedRows = await Attribute.deleteAttribute(id);
            if (affectedRows) {
                res.json({ error: false, message: 'Attribute deleted successfully' });
            } else {
                res.status(404).json({ error: true, message: 'Attribute not found' });
            }
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    static async addOrUpdateAttribute(req, res) {
        try {
            const success = await Attribute.addOrUpdateAttribute(req.body);
            if (success) {
                res.json({ error: false, message: 'Attribute saved successfully' });
            } else {
                res.status(400).json({ error: true, message: 'Failed to save attribute' });
            }
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    static async getAttributes(req, res) {
        try {
            const { offset, limit, sort, order, search } = req.query;
            const attributes = await Attribute.getAttributes({ offset, limit, sort, order, search });
            res.json({ error: false, data: attributes });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    static async manageAttribute(req, res) {
        try {
            const { edit_attribute_id, name, attribute_values, value_id, value_name } = req.body;

            if (edit_attribute_id) {
                // Update attribute
                const attributeData = { name, edit_attribute_id };
                const attributeValues = value_name.map((value, index) => ({
                    id: value_id[index],
                    value,
                }));

                const success = await Attribute.addOrUpdateAttribute({
                    ...attributeData,
                    value_name: attributeValues.map((v) => v.value),
                    value_id: attributeValues.map((v) => v.id),
                });

                if (success) {
                    res.json({ error: false, message: 'Attribute updated successfully' });
                } else {
                    res.status(400).json({ error: true, message: 'Failed to update attribute' });
                }
            } else {
                // Add new attribute
                const success = await Attribute.addOrUpdateAttribute({
                    name,
                    attribute_values: JSON.parse(attribute_values),
                });

                if (success) {
                    res.json({ error: false, message: 'Attribute added successfully' });
                } else {
                    res.status(400).json({ error: true, message: 'Failed to add attribute' });
                }
            }
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    static async attributeList(req, res) {
        try {
            const attributes = await Attribute.getAttributes(req.query);
            res.json({ error: false, data: attributes });
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }

    static async updateAttributeValueStatus(req, res) {
        try {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ error: true, message: 'ID field is required' });
            }

            const success = await AttributeValue.updateAttributeValue(id, { status: 0 });
            if (success) {
                res.json({ error: false, message: 'Value deleted successfully' });
            } else {
                res.status(400).json({ error: true, message: 'Failed to delete value' });
            }
        } catch (error) {
            res.status(500).json({ error: true, message: error.message });
        }
    }
}

module.exports = AttributeController;
