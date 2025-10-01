import { HeroCarousel } from "./HeroCarousel";
import page1 from "../../images/hero-banner/image 12.png";
import page2 from "../../images/hero-banner/image 36.png";
import page3 from "../../images/hero-banner/image 37.png";
import page4 from "../../images/hero-banner/image 38.png";

export default function HomeHero() {
  const slides = [
    {
      src: page1,
      title: "EV RENTAL",
      subtitle: "Bên nhau trọn đường",
    },
    {
      src: page2,
      title: "Thuê xe điện dễ dàng",
      subtitle: "Đặt xe trong 60 giây",
    },
    {
      src: page3,
      title: "An toàn & tiện nghi",
      subtitle: "Hành trình xanh cho mọi nhà",
    },
    {
      src: page4,
      title: "An toàn & tiện nghi",
      subtitle: "Hành trình xanh cho mọi nhà",
    },
  ];
  return (
    <section className="container my-4">
      <HeroCarousel slides={slides} intervalMs={3500} /* fade={true} để chuyển kiểu mờ */ />
    </section>
  );
}
