import { useState } from "react";

export function StarRating({ totalStars = 5 }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div>
      {[...Array(totalStars)].map((_, index) => {
        const starIndex = index + 1;
        return (
          <button
            key={starIndex}
            type="button"
            onClick={() => setRating(starIndex)}
            onMouseEnter={() => setHover(starIndex)}
            onMouseLeave={() => setHover(rating)}
            className={`${
              starIndex <= (hover || rating) ? "text-yellow-600" : "text-[#ccc]"
            } bg-transparent border-none outline-none cursor-pointer`}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
      <p>You rated this {rating} stars.</p>
    </div>
  );
}
