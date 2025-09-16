"use client"
import Footer from "@/components/footer"
import NavigationBar from "@/components/navigation-bar"
import HeroSection from "@/components/HeroSection"


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <HeroSection 
        title="Welcome to Web IOS Aquatics"
        description="IOS Aquatics is a home based aquarium and accessories store located in Moonwalk Village, Las Piñas City. It offers variety of fresh water livestocks, plants, fish foods, aquatic equipment, and accessories at the lowest price possible."
      />
      <div className="min-h-screen bg-gradient-to-b from-[#051C29] to-[#0a2a3a] py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6 text-white">
              About Us
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto align-center">
              The IOS Aquatics store contains basic aquarium keeping tools and equipment such as lights and filters, aquascaping materials and hardscapes. Livestock care products like feeds and water medication and of course a variety of livestock and plants.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
