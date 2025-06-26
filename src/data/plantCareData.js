const plantCareData = {
    faqs: [
      {
        question: "How often should I water my plants?",
        answer: "Watering frequency depends on the plant type, pot size, and environment. Most houseplants need watering when the top 1-2 inches of soil feels dry. Succulents prefer drying out completely between waterings.",
        additionalInfo: "Use the finger test: Stick your finger in the soil up to the second knuckle. If it feels dry, it's time to water."
      },
      {
        question: "Why are my plant's leaves turning yellow?",
        answer: "Yellow leaves can indicate overwatering, underwatering, nutrient deficiency, or natural aging. Check your watering habits first - overwatering is the most common cause.",
        additionalInfo: "Bottom leaves yellowing naturally is often just the plant shedding old growth."
      },
      {
        question: "What's the best location for my plant?",
        answer: "Most houseplants thrive in bright, indirect light near east or west-facing windows. Low-light plants like snake plants can tolerate north-facing windows or interior spaces.",
        additionalInfo: "Rotate your plant 90° weekly to ensure even growth towards the light."
      },
      {
        question: "How do I know if my plant needs repotting?",
        answer: "Signs include roots growing through drainage holes, water running straight through, slowed growth, or the plant becoming top-heavy. Most plants need repotting every 12-18 months.",
        additionalInfo: "Spring is the best time to repot as plants enter their active growth phase."
      },
      {
        question: "How can I increase humidity for tropical plants?",
        answer: "Group plants together, use a pebble tray with water, mist leaves in the morning, or use a humidifier. Bathrooms often have naturally higher humidity.",
        additionalInfo: "Avoid misting plants with fuzzy leaves like African violets as it can cause spotting."
      }
    ],
    commonProblems: [
      {
        symptom: "Brown leaf tips",
        causes: [
          "Low humidity",
          "Over-fertilization",
          "Tap water chemicals (fluoride/chlorine)",
          "Underwatering"
        ],
        solution: "Use distilled water, increase humidity, flush soil monthly"
      },
      {
        symptom: "Drooping leaves",
        causes: [
          "Underwatering",
          "Overwatering",
          "Root rot",
          "Temperature stress"
        ],
        solution: "Check soil moisture, inspect roots, adjust watering schedule"
      },
      {
        symptom: "Small new leaves",
        causes: [
          "Insufficient light",
          "Nutrient deficiency",
          "Root-bound plant"
        ],
        solution: "Move to brighter location, fertilize, or repot"
      }
    ],
    seasonalTips: {
      spring: [
        "Begin regular fertilizing as growth resumes",
        "Increase watering frequency",
        "Start pest prevention measures",
        "Prune winter damage"
      ],
      summer: [
        "Water more frequently in heat",
        "Provide shade for sensitive plants",
        "Watch for pests like spider mites",
        "Rotate plants for even growth"
      ],
      fall: [
        "Reduce fertilizing",
        "Prepare plants for lower light levels",
        "Bring outdoor plants inside before frost",
        "Check for pests before bringing plants indoors"
      ],
      winter: [
        "Water less frequently",
        "Stop fertilizing most plants",
        "Increase humidity",
        "Dust leaves to maximize light absorption"
      ]
    }
  };
  
  export default plantCareData;