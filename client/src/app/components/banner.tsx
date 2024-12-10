import Image from "next/image";
import banner from "@/assets/banner.webp";

export default function Banner() {
  return (
    <figure className="relative w-full">
      <Image
        src={banner}
        alt="banner"
        className="w-full h-auto"
        priority
      />
    </figure>
  );
}
