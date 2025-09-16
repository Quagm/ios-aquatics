import Image from "next/image"

export default function HeroSection({ title, description, backgroundImage = "/bg-image.png" }) {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt="Background"
        fill
        priority
        className="object-cover z-0"
      />

      {/* Content overlay */}
      <div className="relative z-10 max-w-xl absolute bottom-12 left-12 p-6">
        <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
          {title}
        </h2>
        <p className="text-lg text-white/90 max-w-xl text-justify leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  )
}
