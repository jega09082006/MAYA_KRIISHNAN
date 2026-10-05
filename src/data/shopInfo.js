// Single Source of Truth for Shop Details — Maya Krishnan
export const shopInfo = {
  nameTamil: "மாயக்கிருஷ்ணன்",
  nameEnglish: "Maya Krishnan",
  businessTamil: "பலசரக்கு & தமிழ்மருந்து கடை",
  businessEnglish: "Grocery & Tamil Marundhu Shop",
  phoneDisplay: "63691 42873",
  phoneLink: "tel:+916369142873",
  whatsappNumber: "916369142873",
  whatsappMessage: "வணக்கம் மாயக்கிருஷ்ணன்! எனக்கு சில பொருட்களைப் பற்றி தெரிந்து கொள்ள வேண்டும். / Hello Maya Krishnan, I would like to know about your products.",
  addressTamil: "பெரிய கடை பஜார், அருப்புக்கோட்டை – 626101",
  addressEnglish: "Periya Kadai Bazaar, Aruppukkottai – 626101, Tamil Nadu",
  // Leave blank until the exact shop location link is available.
  // Everything that uses the map hides automatically while this is empty.
  mapsLink: "",
  blessingLine: "ஸ்ரீ சந்திவீர சுவாமி துணை" // leave empty until the owner confirms the wording
};

export const getWhatsAppLink = (customMessage) =>
  `https://wa.me/${shopInfo.whatsappNumber}?text=${encodeURIComponent(customMessage || shopInfo.whatsappMessage)}`;
