const prices = {
  "Aloo Tikki": 20,
  Paneer: 25,
  Cheese: 15,
  Tomato: 10,
  Onion: 10,
  Lettuce: 8,
  Bread: 5,
};

const PLATFORM_FEE = 5;

function calculatePrice(slices, quantity) {
  let total = 0;
 slices.forEach((slice) => {
    total += prices[slice] || 0;
  });

  // Cheese + Paneer discount
  if (
    slices.includes("Cheese") &&
    slices.includes("Paneer")
  ) {
    total -= 3;
  }
   // Consecutive Aloo Tikki surcharge
  for (let i = 0; i < slices.length - 1; i++) {
    if (
      slices[i] === "Aloo Tikki" &&
      slices[i + 1] === "Aloo Tikki"
    ) {
      total += 2;
    }
  }

  total = total * quantity + PLATFORM_FEE;

  return total;
}

module.exports = calculatePrice;