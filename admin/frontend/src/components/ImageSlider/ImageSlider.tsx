import { FC, useState, TouchEvent } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import classNames from "classnames";

import styles from "./ImageSlider.module.css";

interface Image {
  url: string;
  title: string;
}

interface ImageSliderProps {
  images: Image[];
}

/**
 * ImageSlider component will fill 100% of parent's width and height
 */
const ImageSlider: FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const previousPicture = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const nextPicture = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const goToPicture = (index: number) => {
    if (index < 0 || index > images.length - 1) return;
    setCurrentIndex(index);
  };

  // Scroll with touch events
  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextPicture();
    else if (isRightSwipe) previousPicture();
  };

  return (
    <div
      className={classNames(styles["image-slider"])}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className={classNames(styles["image-slider_container"])}
        style={{ backgroundImage: `url(${images[currentIndex].url})` }}
      ></div>
      {images.length > 1 && (
        <>
          <div
            className={classNames(styles["image-slider_arrow-left"])}
            onClick={previousPicture}
          >
            <AiOutlineLeft />
          </div>
          <div
            className={classNames(styles["image-slider_arrow-right"])}
            onClick={nextPicture}
          >
            <AiOutlineRight />
          </div>
          <div className={classNames(styles["image-slider_dots_container"])}>
            {images.map((_, idx) => (
              <div
                key={`img-${idx}`}
                className={classNames(
                  `${
                    idx === currentIndex
                      ? styles["image-slider_dots_container_dot_active"]
                      : styles["image-slider_dots_container_dot"]
                  }`
                )}
                onClick={() => goToPicture(idx)}
              >
                &#x2022;
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
