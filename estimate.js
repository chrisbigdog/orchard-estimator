export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Please use POST." });
  }

  const { block_size_sqm } = req.body;
  if (!block_size_sqm || block_size_sqm <= 0) {
    return res.status(400).json({ error: "Invalid block size. Please enter a positive number." });
  }

  const block_area_standard = 50000;

  const materialData = {
    "UNDERVINE": {
      "Undervine screw": { quantity: 4386, unit: "pcs" },
      "Undervine Clips": { quantity: 4386, unit: "pcs" },
      "Undervine Cloth": { quantity: 33, unit: "rolls" },
      "2.5mm HT wire": { quantity: 7, unit: "rolls" }
    },
    "AGBEAM": {
      "Agbeam Staple": { quantity: 2193, unit: "pcs" },
      "Agbeam": { quantity: 833, unit: "pcs" },
      "Agbeam joiners": { quantity: 833, unit: "pcs" },
      "50 mil Staple": { quantity: 4386, unit: "pcs" },
      "Plascourse (75x150) cutting": { quantity: 329, unit: "meters" },
      "25mm tex screw": { quantity: 833, unit: "pcs" }
    },
    "HAIL CLOTH": {
      "Hail cloth V16C18": { quantity: 2632, unit: "meters" },
      "Bent Staple": { quantity: 365, unit: "pcs" },
      "Gate Staple": { quantity: 471, unit: "pcs" },
      "50 mil Staple": { quantity: 968, unit: "pcs" },
      "7.5 Splice": { quantity: 982, unit: "pcs" },
      "Nitto Tape": { quantity: 15, unit: "pcs" },
      "4.5mm HT Wire": { quantity: 5263, unit: "meters" },
      "1.3m PVC Conduits": { quantity: 136, unit: "pcs" },
      "Thimble and Rods with Nut": { quantity: 53, unit: "pcs" },
      "350mm Screw Anchor": { quantity: 53, unit: "pcs" },
      "7.5mm Sleeves": { quantity: 2605, unit: "pcs" },
      "12mm sleeves": { quantity: 272, unit: "pcs" },
      "7.5mm cable": { quantity: 8482, unit: "meters" }
    }
  };

  let estimatedMaterials = {};
  
  for (let category in materialData) {
    estimatedMaterials[category] = {};
    for (let material in materialData[category]) {
      let estimatedValue = (materialData[category][material].quantity / block_area_standard) * block_size_sqm;
      estimatedMaterials[category][material] = {
        quantity: Math.round(estimatedValue),
        unit: materialData[category][material].unit
      };
    }
  }

  return res.status(200).json(estimatedMaterials);
}
