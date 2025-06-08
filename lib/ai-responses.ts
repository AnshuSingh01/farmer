// Predefined AI responses for the assistant
export const aiResponses = {
  rice: "For rice cultivation in Karnataka, the best planting time is during the monsoon season (June-July). Ensure proper field preparation with adequate water supply. The soil should be well-puddled and leveled.",
  pest: "For pest management, implement integrated pest management (IPM) practices. Use neem-based pesticides, maintain field hygiene, and monitor regularly. Consider biological control agents like Trichogramma for sustainable pest control.",
  irrigation: "Irrigation timing depends on crop stage and soil moisture. For rice, maintain 2-3 cm water level during active tillering. For other crops, irrigate when soil moisture drops to 70% of field capacity.",
  market: "Current wheat prices show an upward trend. Consider storing your produce if prices are below ₹2,100/quintal. Market analysis suggests prices may increase by 8-12% in the next quarter.",
  default: "Thank you for your question! Based on current farming practices in Karnataka, I recommend consulting with local agricultural extension officers for specific guidance. Would you like me to provide more information on any particular aspect of farming?"
};

// Quick question categories and examples
export const quickQuestionCategories = [
  {
    icon: "🌾",
    title: "Crop Advice",
    subtitle: "Best practices for your crops",
    questions: [
      "How to increase rice yield?",
      "Best wheat variety for Punjab?",
      "When to sow cotton in Maharashtra?"
    ]
  },
  {
    icon: "🐛",
    title: "Pest & Disease",
    subtitle: "Protect your crops",
    questions: [
      "How to control stem borer in rice?",
      "Organic pest control for vegetables?",
      "How to prevent yellow rust in wheat?"
    ]
  },
  {
    icon: "💧",
    title: "Irrigation",
    subtitle: "Water management tips",
    questions: [
      "How often to irrigate sugarcane?",
      "Drip vs. canal irrigation?",
      "How to save water in paddy fields?"
    ]
  },
  {
    icon: "📈",
    title: "Market & Prices",
    subtitle: "Get the best rates",
    questions: [
      "Current price of groundnut?",
      "Where to sell maize in Karnataka?",
      "How to get MSP for wheat?"
    ]
  }
]; 