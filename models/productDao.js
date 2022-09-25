const { json } = require('express/lib/response');
const { DataSource } = require('typeorm');

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch(() => {
    console.log('Database initiate fail');
  });

//2depth + 리뷰순 조회
const getTwoDepthCategory = async (id, sort, page) => {
  const products = await myDataSource.query(
    `SELECT
      c.name AS category,
      t.name AS type,
      pr.id,
      pr.name,
      pr.description,
      (SELECT COUNT(w.product_id)
        FROM products p
        LEFT OUTER JOIN product_wishlist w
        ON p.id = w.product_id
        WHERE p.id = pr.id) AS likeCount,
      COUNT(r.product_id) AS reviewCount,
      t_i.default_img,
      t_i.hover_img,
      REPLACE(pr.price_origin, '.', ',') AS price_origin,
      s_r.sale,
      REPLACE(pr.sale_price, '.', ',') AS sale_price,
      count(*) OVER() AS totalCount
    FROM products pr
    JOIN category c ON c.id = pr.category_id
    JOIN product_types t ON t.id = pr.type_id
    LEFT OUTER JOIN review r ON pr.id = r.product_id
    JOIN thumbnail_images t_i ON t_i.id = pr.thumbnail_id
    LEFT OUTER JOIN sale_rate s_r ON s_r.id = pr.sale_rate_id
    WHERE c.parent_id = ?
    GROUP BY pr.id
    ${sort}
    LIMIT ?, 9`,
    [id, (page - 1) * 9]
  );
  return products;
};

//위클리 베스트
const weeklyBest = async sort => {
  const products = await myDataSource.query(
    `SELECT
    pr.id,
    pr.name,
    pr.description,
    (SELECT COUNT(w.product_id)
      FROM products p
      LEFT OUTER JOIN product_wishlist w
      ON p.id = w.product_id
      WHERE p.id = pr.id) AS likeCount,
    COUNT(r.product_id) AS reviewCount,
    t_i.default_img,
    t_i.hover_img,
    REPLACE(pr.price_origin, '.', ',') AS price_origin,
    s_r.sale,
    REPLACE(pr.sale_price, '.', ',') AS sale_price,
    pr.created_at
  FROM products pr
  LEFT OUTER JOIN review r ON pr.id = r.product_id
  JOIN thumbnail_images t_i ON t_i.id = pr.thumbnail_id
  LEFT OUTER JOIN sale_rate s_r ON s_r.id = pr.sale_rate_id
  WHERE pr.created_at > DATE_ADD(now(),interval -7 day)
  GROUP BY pr.id
  ${sort}
  LIMIT 9`
  );
  return products;
};

//베스트
const productBest = async () => {
  const products = await myDataSource.query(
    `SELECT
    pr.id,
    pr.name,
    pr.description,
    (SELECT COUNT(w.product_id)
      FROM products p
      LEFT OUTER JOIN product_wishlist w
      ON p.id = w.product_id
      WHERE p.id = pr.id) AS likeCount,
    COUNT(r.product_id) AS reviewCount,
    t_i.default_img,
    t_i.hover_img,
    REPLACE(pr.price_origin, '.', ',') AS price_origin,
    s_r.sale,
    REPLACE(pr.sale_price, '.', ',') AS sale_price,
    pr.created_at
  FROM products pr
  LEFT OUTER JOIN review r ON pr.id = r.product_id
  JOIN thumbnail_images t_i ON t_i.id = pr.thumbnail_id
  LEFT OUTER JOIN sale_rate s_r ON s_r.id = pr.sale_rate_id
  GROUP BY pr.id
  ORDER BY likeCount DESC
  LIMIT 9`
  );
  return products;
};

//3depth + (sort)
const threeDepthCategorySort = async (name, sort, page) => {
  const products = await myDataSource.query(
    `SELECT
    c.name AS category,
    pr.id,
    pr.name,
    pr.description,
    (SELECT COUNT(w.product_id)
      FROM products p
      LEFT OUTER JOIN product_wishlist w
      ON p.id = w.product_id
      WHERE p.id = pr.id) AS likeCount,
    COUNT(r.product_id) AS reviewCount,
    t_i.default_img,
    t_i.hover_img,
    REPLACE(pr.price_origin, '.', ',') AS price_origin,
    s_r.sale,
    REPLACE(pr.sale_price, '.', ',') AS sale_price,
    pr.created_at,
    count(*) OVER() AS totalCount
  FROM products pr
  JOIN category c ON c.id = pr.category_id
  LEFT OUTER JOIN review r ON pr.id = r.product_id
  JOIN thumbnail_images t_i ON t_i.id = pr.thumbnail_id
  LEFT OUTER JOIN sale_rate s_r ON s_r.id = pr.sale_rate_id
  WHERE c.name = ?
  GROUP BY pr.id
  ${sort}
  LIMIT ?, 9`,
    [name, (page - 1) * 9]
  );
  return products;
};

//3depth + type + (sort)
const productTypeSort = async (categoryType, sort, page) => {
  const products = await myDataSource.query(
    `SELECT
      c.name AS category,
      t.name AS type,
      pr.id,
      pr.name,
      pr.description,
      (SELECT COUNT(w.product_id)
        FROM products p
        LEFT OUTER JOIN product_wishlist w
        ON p.id = w.product_id
        WHERE p.id = pr.id) AS likeCount,
      COUNT(r.product_id) AS reviewCount,
      t_i.default_img,
      t_i.hover_img,
      REPLACE(pr.price_origin, '.', ',') AS price_origin,
      s_r.sale,
      REPLACE(pr.sale_price, '.', ',') AS sale_price,
      pr.created_at,
      count(*) OVER() AS totalCount
    FROM products pr
    JOIN category c ON c.id = pr.category_id
    JOIN product_types t ON t.id = pr.type_id
    JOIN thumbnail_images t_i ON t_i.id = pr.thumbnail_id
    LEFT OUTER JOIN review r ON pr.id = r.product_id
    LEFT OUTER JOIN sale_rate s_r ON s_r.id = pr.sale_rate_id
    ${categoryType}
    GROUP BY pr.id
    ${sort}
    LIMIT ?, 9`,
    [(page - 1) * 9]
  );
  return products;
};

module.exports = {
  weeklyBest,
  productBest,
  getTwoDepthCategory,
  threeDepthCategorySort,
  productTypeSort,
};
