import React from "react";

type Slide = {
  src: string;       // link ảnh (bạn thay sau)
  title?: string;    // tiêu đề overlay
  subtitle?: string; // mô tả overlay
};

type Props = {
  id?: string;           // id duy nhất cho carousel
  slides: Slide[];
  intervalMs?: number;   // thời gian giữa mỗi slide
  fade?: boolean;        // true = hiệu ứng fade, false = trượt trái→phải
};

export const HeroCarousel: React.FC<Props> = ({
  id = "heroCarousel",
  slides,
  intervalMs = 3500,
  fade = false,
}) => {
  return (
    <div
      id={id}
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="2000"
      data-bs-pause="false"
      data-bs-touch="true"
    >
      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target={`#${id}`}
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === 0 ? "true" : undefined}
          />
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`carousel-item ${i === 0 ? "active" : ""}`}
            data-bs-interval={intervalMs}
          >
            {/* Giữ tỷ lệ cao 21:9, ảnh cover toàn khung */}
            <div className="ratio ratio-21x9">
              <img
                src={s.src || "https://via.placeholder.com/1600x700?text=Hero"}
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
                alt={s.title || `Slide ${i + 1}`}
              />
              {/* Gradient + text overlay */}
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)",
                }}
              />
              <div className="position-absolute top-50 start-50 translate-middle text-center text-white px-3">
                <h1 className="fw-bold display-4 mb-3">{s.title}</h1>
                <p className="lead fs-5">{s.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="prev"
        aria-label="Prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="next"
        aria-label="Next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
      </button>
    </div>
  );
};
