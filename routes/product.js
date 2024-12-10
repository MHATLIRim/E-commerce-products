const express= require('express') ;
const router = express.Router();
const { Product, productValidationSchema } = require('../models/Product');


// Route to add a product

router.post('/', async (req, res) => {

    try {
        await productValidationSchema.validate(req.body);
        const { name, description , price, category} = req.body;
        const newProduct= new Product({name, description, price, category});
        await newProduct.save();
        res.status(201).json ({message: 'Product added successfully', product: newProduct});
    } catch (error) {
        res.status(500).json ({message: 'Erreur ajout produit' , error}) ;
        
    }
});

// Route to get all products
router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  });
  
  // Route to delete a product
  router.delete('/delete/:id', async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error });
    }
  });
  
  // Route to update a product
  router.put('/edit/:id', async (req, res) => {
    try {
      await productValidationSchema.validate(req.body);
      const { name, description, price, category } = req.body;
      const updatedProduct= await Product.findByIdAndUpdate(req.params.id, { name, description, price, category}, { new: true });
      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error });
    }
  });



module.exports = router;