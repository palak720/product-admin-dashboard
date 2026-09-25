// { title, price, ... } -> { title: "error msg", price: "error msg" }
// Khaali object matlab koi error nahi
export function validateProduct(values) {
  const errors = {};

  if (!values.title?.trim()) {
    errors.title = "Title is required.";
  } else if (values.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }

  if (!values.category?.trim()) {
    errors.category = "Category is required.";
  }

  const price = Number(values.price);
  if (values.price === "" || values.price === null || values.price === undefined) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }

  const stock = Number(values.stock);
  if (values.stock === "" || values.stock === null || values.stock === undefined) {
    errors.stock = "Stock is required.";
  } else if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be 0 or a positive whole number.";
  }

  if (!values.description?.trim()) {
    errors.description = "Description is required.";
  } else if (values.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  if (values.thumbnail && !isValidUrl(values.thumbnail)) {
    errors.thumbnail = "Thumbnail must be a valid URL.";
  }

  return errors;
}

function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}