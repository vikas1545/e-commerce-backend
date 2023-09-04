const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch {
    res.status(400).json(err);
  }
};

exports.ferchAllProducts = async (req, res) => {
  let query = Product.find({});
  let totalProductsQuery = Product.find({});

  if (req.query.category) {
    query = query.where({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.where({
      category: req.query.category,
    });
  }
  if (req.query.brand) {
    query = query.where({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.where({ brand: req.query.brand });
  }

  const totalDocs = await totalProductsQuery.countDocuments().exec();

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    console.log("err :", err);
    res.status(400).json({ error: err.message });
  }
};

exports.ferchProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async(req,res)=>{
  const {id}=req.params;

  try {
    //here {new:true} means return updated document
    const product = await Product.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json(product);
  }
  catch(err) {
     res.status(400).json(err)
  }
}
