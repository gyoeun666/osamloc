const productsService = require('../services/product');

//위클리 베스트
const weeklyBest = async (req, res) => {
  const { sort } = req.query;

  try {
    const products = await productsService.weeklyBest(sort);
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(404).json({ message: 'ERROR' });
  }
};

//베스트
const productBest = async (req, res) => {
  try {
    const products = await productsService.productBest();
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(404).json({ message: 'ERROR' });
  }
};

//2depth 제품 조회
const getTwoDepthCategory = async (req, res) => {
  const { id, sort, page } = req.query;
  try {
    const products = await productsService.getTwoDepthCategory(id, sort, page);
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(404).json({ message: 'ERROR' });
  }
};

//3depth 제품 조회
const threeDepthCategorySort = async (req, res) => {
  const { name, sort, page } = req.query;
  try {
    const products = await productsService.threeDepthCategorySort(
      name,
      sort,
      page
    );
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(404).json({ message: 'ERROR' });
  }
};

//3depth + type + (sort)
const productTypeSort = async (req, res) => {
  const { name, type, sort, page } = req.query;
  try {
    const products = await productsService.productTypeSort(
      name,
      type,
      sort,
      page
    );
    res.status(200).json({ data: products });
  } catch (error) {
    res.status(404).json({ message: 'ERROR' });
  }
};

module.exports = {
  weeklyBest,
  productBest,
  getTwoDepthCategory,
  threeDepthCategorySort,
  productTypeSort,
};
