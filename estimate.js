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
      "Undervine screw": 4386,
      "Undervine Clips": 4386,
      "Undervine Cloth": 600,
      "2.5mm HT wire": 50
    },
    "AGBEAM": {
      "Agbeam Staple": 1500,
      "Agbeam": 200,
      "Agbeam joiners": 250,
      "50 mil Staple": 500,
      "Plascourse (75x150) cutting": 300,
      "25mm tex screw": 400
    },
    "HAIL CLOTH": {
      "Hail cloth V16C18": 100,
      "Bent Staple": 1500,
      "Gate Staple": 700,
      "50 mil Staple": 900,
      "7.5 Splice": 300,
      "Nitto Tape": 150,
      "4.5mm HT Wire": 60,
      "1.3m PVC Conduits": 80,
      "Thimble and Rods with Nut": 50,
      "350mm Screw Anchor": 90,
      "7.5mm Sleeves": 75,
      "12mm sleeves": 120,
      "7.5mm cable": 110
    }
  };

  let estimatedMaterials = {};
  
  for (let category in materialData) {
    estimatedMaterials[category] = {};
    for (let material in materialData[category]) {
      let estimatedValue = (materialData[category][material] / block_area_standard) * block_size_sqm;
      estimatedMaterials[category][material] = {
        quantity: Math.round(estimatedValue),
        unit: "pcs"
      };
    }
  }

  return res.status(200).json(estimatedMaterials);
}
