import React, { useEffect, useRef } from 'react';
import './Main.css';
import Lottie from 'react-lottie';
import Parrot from '../Assets/Parrot.json';
import Loading_blur from '../Assets/Loading_blur.json';

const Main = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const text = "ReDACT";
    const fontSize = 100;
    const letters = text.split("");
    const blurAmount = 20;
    const letterInterval = 500; // time in milliseconds between blurring each letter
    let currentIndex = 0;

    // Set up the font
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "black";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    // Calculate initial position
    const startX = canvas.width / 2 - (ctx.measureText(text).width / 2);
    const startY = canvas.height / 2;

    function drawTextWithBlur() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      letters.forEach((letter, index) => {
        ctx.save();
        if (index < currentIndex && letter !== "R" && letter !== "C") {
          ctx.filter = `blur(${blurAmount}px)`;
        }
        ctx.fillText(letter, startX + ctx.measureText(text.substring(0, index)).width, startY);
        ctx.restore();
      });

      if (currentIndex < letters.length) {
        currentIndex++;
        setTimeout(drawTextWithBlur, letterInterval);
      }
    }

    // Start the animation
    drawTextWithBlur();
  }, []);

  return (
    <div className='main'>
      <canvas ref={canvasRef} width="800" height="200"></canvas>
    </div>
  );
};

export default Main;
