const Tax = require('../models/Tax');

class TaxController {
  static async getAllTaxes(req, res) {
    try {
      const taxes = await Tax.getAllTaxes();
      res.json({ error: false, data: taxes });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async addTax(req, res) {
    try {
      const data = req.body;
      const taxId = await Tax.createTax(data);
      res.json({ error: false, message: 'Tax added successfully', taxId });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async updateTax(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const success = await Tax.updateTax(id, data);
      if (success) {
        res.json({ error: false, message: 'Tax updated successfully' });
      } else {
        res.status(404).json({ error: true, message: 'Tax not found' });
      }
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }

  static async deleteTax(req, res) {
    try {
      const { id } = req.params;
      const affectedRows = await Tax.deleteTax(id);
      if (affectedRows) {
        res.json({ error: false, message: 'Tax deleted successfully' });
      } else {
        res.status(404).json({ error: true, message: 'Tax not found' });
      }
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
  }
}

module.exports = TaxController;
