import React, { useRef, useState } from "react";
import ScratchCard from "react-scratchcard-v2";
import { Card, CardContent } from "@/components/ui/card";

const App = () => {
  const imageUrl = "/assets/reveal-image.jpg"; // Image à découvrir
  const scratchImageUrl = "/assets/scratch-image.jpg"; // Image blanche à gratter
  const [revealed, setRevealed] = useState(false);
  const scratchCardRef = useRef(null);

  const settings = {
    width: 430,
    height: 932,
    image: scratchImageUrl, // Image blanche qui cache
    brushSize: 30,
    finishPercent: 50,
    onComplete: () => setRevealed(true),
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 relative w-full h-full"
      style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <h1 className="text-xl font-bold mb-4 text-center relative z-30">Dévoilement du Thème</h1>
      <Card className="w-[430px] h-[932px] relative overflow-hidden rounded-xl shadow-lg z-20">
        <CardContent className="flex flex-col items-center relative w-full h-full p-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-black bg-white bg-opacity-75 px-4 py-2 rounded-lg z-30">
            Grattez ici
          </div>
          <ScratchCard ref={scratchCardRef} {...settings} className="absolute top-0 left-0 w-full h-full z-20" />
        </CardContent>
      </Card>
      {revealed && <p className="mt-2 text-lg text-green-600 text-center relative z-30">Thème dévoilé !</p>}
    </div>
  );
};

export default App;
