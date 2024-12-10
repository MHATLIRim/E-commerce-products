const mongoose = require('mongoose');
const yup = require('yup');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String
});

const Product = mongoose.model('Product', productSchema);

const productValidationSchema = yup.object().shape({

    name: yup.string().required(),
    description: yup.string().required(),
    price: yup.number().positive().required(),
    category: yup.string().required()


});

module.exports = { Product, productValidationSchema };
