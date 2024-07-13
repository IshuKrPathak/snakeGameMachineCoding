import { useEffect, useRef, useState } from "react";

const GRID_SZIE = 15;
const GAME_GRID = Array.from({ length: GRID_SZIE }, () =>
  new Array(GRID_SZIE).fill("")
);

const generateFood = () => {
  const x = Math.floor(Math.random() * GRID_SZIE);
  const y = Math.floor(Math.random() * GRID_SZIE);
  return [x, y];
};
export default function SnakeGame() {
  const [snakeBody, setSnakeBody] = useState([
    [5, 5],
    [6, 5],
    [7, 5],
  ]);

  const directionRef = useRef([1, 0]);
  const foodRef = useRef(generateFood());

  const isSnakeBodyDiv = (xy, yc) => {
    return snakeBody.some(([x, y]) => {
      return x === xy && y === yc;
    });
  };

  //to move the snake we simply delete tail and add new head
  useEffect(() => {
    const interval = setInterval(() => {
      setSnakeBody((prevSnakeBody) => {
        const copySnakeBody = prevSnakeBody.map((arr) => [...arr]);
        copySnakeBody.pop(); // tail remove
        const newHead = [
          prevSnakeBody[0][0] + directionRef.current[0],
          prevSnakeBody[0][1] + directionRef.current[1],
        ];

        if (
          newHead[0] < 0 ||
          newHead[0] >= GRID_SZIE ||
          newHead[1] < 0 ||
          newHead >= GRID_SZIE
        ) {
          directionRef.current = [1, 0];
          return [
            [5, 5],
            [6, 5],
            [7, 5],
          ];
        }
        //add new row and col into head
        copySnakeBody.unshift(newHead); //new head
        return copySnakeBody;
      });
    }, 1000);

    //handle direction through keys
    const handleDirection = (e) => {
      const key = e.key;
      if (key == "ArrowUp" && directionRef.current[1] != 1) {
        directionRef.current = [0, -1];
      } else if (key == "ArrowLeft" && directionRef.current[0] != 1) {
        directionRef.current = [-1, 0];
      } else if (key == "ArrowRight" && directionRef.current[0] != -1) {
        directionRef.current = [1, 0];
      } else if (key == "ArrowDown" && directionRef.current[1] != -1) {
        directionRef.current = [0, 1];
      }
    };

    window.addEventListener("keydown", handleDirection);
    return () => {
      //unmounting
      clearInterval(interval);
      window.removeEventListener("keydown", handleDirection);
    };
  }, []);

  return (
    <div className=" container">
      {GAME_GRID.map((row, yc) => {
        return row.map((cell, xc) => {
          return (
            <div
              className={`cell ${isSnakeBodyDiv(xc, yc) ? "snake" : ""}
              ${
                foodRef.current[0] === xc && foodRef.current[1] === yc
                  ? "food"
                  : ""
              }
              `}
            ></div>
          );
        });
      })}
    </div>
  );
}
