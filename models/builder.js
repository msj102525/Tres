function filterBuilder(countryId, spiceLevel, allergyId, meatId, vegetarian) {
  let conditionArr = [];

  if (countryId) {
    conditionArr.push(`f.country_id = ${countryId}`);
  }

  if (spiceLevel) {
    conditionArr.push(`f.spice_level = ${spiceLevel}`);
  }

  if (allergyId) {
    let allergyArr = [];
    allergyArr.push(allergyId);
    conditionArr.push(`NOT EXISTS (
                            SELECT 1
                            FROM allergy_foods af
                            WHERE af.food_id = f.id
                            AND af.allergy_id IN (${allergyArr.join(",")})
                            )
    `);
  }

  if (meatId) {
    let meatArr = [];
    meatArr.push(meatId);
    conditionArr.push(`m.id IN (${meatArr.join(",")})`);
  }

  if (vegetarian) {
    conditionArr.push(`f.vegetarian = ${vegetarian}`);
  }

  let whereCondition = "";
  if (conditionArr.length > 0) {
    whereCondition = `WHERE ${conditionArr.join(" AND ")}`;
  }
  return whereCondition;
}

function orderByBuilder(orderBy) {
  let orderQuery = "";
  switch (orderBy) {
    case "priceAsc":
      orderQuery = "ORDER BY f.price ASC, f.id ASC";
      break;
    case "priceDesc":
      orderQuery = "ORDER BY f.price DESC, f.id DESC";
      break;
    case "best":
      orderQuery = "ORDER BY likes_count DESC";
      break;
    default:
      orderQuery = "ORDER BY f.id";
      break;
  }
  return orderQuery;
}

function limitBuilder(limit, offset) {
  if (!limit) {
    limit = 12;
  }

  if (!offset) {
    offset = 0;
  }

  return `LIMIT ${limit} OFFSET ${offset}`;
}

module.exports = {
  filterBuilder,
  orderByBuilder,
  limitBuilder,
};
