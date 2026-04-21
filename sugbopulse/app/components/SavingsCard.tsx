'use client';

export default function SavingsCard() {
  // Hardcoded savings math for MVP
  const trikePrice = 80;
  const jeepFare = 13;
  const dailySavings = trikePrice - jeepFare;
  const weeklySavings = dailySavings * 5; // Assuming 5 rides per week

  return (
    <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-black rounded-lg p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">💰 SAVINGS CHECK</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Special Trike Cost:</span>
          <span className="font-bold">₱{trikePrice}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Standard Jeep Fare:</span>
          <span className="font-bold">₱{jeepFare}</span>
        </div>
        
        <div className="border-t-2 border-black my-2"></div>
        
        <div className="flex justify-between text-lg font-bold">
          <span>You Save Today:</span>
          <span>₱{dailySavings}</span>
        </div>

        <div className="flex justify-between text-sm text-black/80">
          <span>This Week:</span>
          <span>₱{weeklySavings}</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-black/10 rounded-lg">
        <p className="text-sm font-semibold text-center">
          🍚 That's {Math.floor(weeklySavings / 200)} kilos of rice for your family this week!
        </p>
      </div>
    </div>
  );
}
