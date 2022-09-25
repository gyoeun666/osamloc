const productsDao = require('../models/productDao');

const weeklyBest = async productSort => {
  const sort = orderBy(productSort);

  return await productsDao.weeklyBest(sort);
};

const productBest = async () => {
  return await productsDao.productBest();
};

const getTwoDepthCategory = async (id, productSort, page) => {
  const sort = orderBy(productSort);
  return await productsDao.getTwoDepthCategory(id, sort, page);
};

const threeDepthCategorySort = async (name, productSort, page) => {
  const sort = orderBy(productSort);

  return await productsDao.threeDepthCategorySort(name, sort, page);
};

const productTypeSort = async (name, type, productSort, page) => {
  const sort = orderBy(productSort);
  const categoryType = getCategoryType(name, type);

  return await productsDao.productTypeSort(categoryType, sort, page);
};

const getCategoryType = (name, type) => {
  const filter = type.split(',').map(s => `'${s}'`);
  const FilterType = {
    category: `WHERE c.name = "${name}"`,
    categoryType: `WHERE c.name = "${name}" AND t.name IN (${filter})`,
  };

  if (name && type) {
    return FilterType.categoryType;
  } else if (name) {
    return FilterType.category;
  }

  return null;
};

const orderBy = productSort => {
  const sortOrderBy = {
    review: 'ORDER BY reviewCount DESC',
    popular: 'ORDER BY likeCount DESC',
    newProduct: 'ORDER BY pr.created_at DESC',
    priceAsc:
      'ORDER BY CASE WHEN sale_price is null THEN price_origin ELSE sale_price END ASC',
    priceDesc:
      'ORDER BY CASE WHEN sale_price is null THEN price_origin ELSE sale_price END DESC',
  };

  if (productSort === 'review') {
    return sortOrderBy.review;
  } else if (productSort === 'popular') {
    return sortOrderBy.popular;
  } else if (productSort === 'new') {
    return sortOrderBy.newProduct;
  } else if (productSort === 'price-asc') {
    return sortOrderBy.priceAsc;
  } else if (productSort === 'price-desc') {
    return sortOrderBy.priceDesc;
  }
  return null;
};

module.exports = {
  weeklyBest,
  productBest,
  getTwoDepthCategory,
  threeDepthCategorySort,
  productTypeSort,
};
