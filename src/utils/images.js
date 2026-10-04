import egIcon from "../assets/eg_icon.png";

export const EG_ICON = egIcon;

export const getItemImage = (item) => {
  if (item && item.image && typeof item.image === "string" && item.image.trim() !== "") {
    return item.image;
  }
  if (item && item.imageUrl && typeof item.imageUrl === "string" && item.imageUrl.trim() !== "") {
    return item.imageUrl;
  }
  return EG_ICON;
};

export const getCategoryImage = (category) => {
  if (category && category.image && typeof category.image === "string" && category.image.trim() !== "") {
    return category.image;
  }
  if (category && category.imageUrl && typeof category.imageUrl === "string" && category.imageUrl.trim() !== "") {
    return category.imageUrl;
  }
  return EG_ICON;
};
