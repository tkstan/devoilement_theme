import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";

const ScratchSurface = forwardRef(
  (
    {
      width,
      height,
      brushSize = 30,
      finishPercent = 50,
      coverImage,
      coverColor = "#d4d4d8",
      onComplete = () => {},
      className = "",
    },
    ref
  ) => {
    const canvasRef = useRef(null);
    const isPointerDown = useRef(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const drawCover = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.reset?.();
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.globalCompositeOperation = "source-over";
      if (coverImage) {
        const image = new Image();
        image.src = coverImage;
        image.onload = () => {
          ctx.drawImage(image, 0, 0, width, height);
          ctx.restore();
          ctx.globalCompositeOperation = "destination-out";
          setIsCompleted(false);
        };
        image.onerror = () => {
          ctx.fillStyle = coverColor;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
          ctx.globalCompositeOperation = "destination-out";
          setIsCompleted(false);
        };
      } else {
        ctx.fillStyle = coverColor;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        ctx.globalCompositeOperation = "destination-out";
        setIsCompleted(false);
      }
    }, [coverColor, coverImage, height, width]);

    useImperativeHandle(
      ref,
      () => ({
        reset: drawCover,
        isCompleted,
      }),
      [drawCover, isCompleted]
    );

    useEffect(() => {
      drawCover();
    }, [drawCover]);

    const scratch = useCallback(
      (event) => {
        const canvas = canvasRef.current;
        if (!canvas) {
          return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return;
        }
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
      },
      [brushSize]
    );

    const evaluateCompletion = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || isCompleted) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      const { width: canvasWidth, height: canvasHeight } = canvas;
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      const totalPixels = imageData.data.length / 4;
      let transparentPixels = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) {
          transparentPixels += 1;
        }
      }
      const clearedPercent = (transparentPixels / totalPixels) * 100;
      if (clearedPercent >= finishPercent) {
        setIsCompleted(true);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        onComplete?.();
      }
    }, [finishPercent, isCompleted, onComplete]);

    const handlePointerDown = (event) => {
      if (isCompleted) {
        return;
      }
      isPointerDown.current = true;
      scratch(event);
      event.target.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event) => {
      if (!isPointerDown.current || isCompleted) {
        return;
      }
      scratch(event);
    };

    const handlePointerUp = (event) => {
      if (!isPointerDown.current) {
        return;
      }
      isPointerDown.current = false;
      event.target.releasePointerCapture?.(event.pointerId);
      evaluateCompletion();
    };

    return (
      <canvas
        ref={canvasRef}
        className={`scratch-surface__canvas ${className}`.trim()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    );
  }
);

ScratchSurface.displayName = "ScratchSurface";

ScratchSurface.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  brushSize: PropTypes.number,
  finishPercent: PropTypes.number,
  coverImage: PropTypes.string,
  coverColor: PropTypes.string,
  onComplete: PropTypes.func,
  className: PropTypes.string,
};

export default ScratchSurface;
