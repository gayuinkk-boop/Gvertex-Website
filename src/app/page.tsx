import Navbar from '@/components/Navbar'
import Hero3D from '@/components/Hero3D'
import ServicesGrid from '@/components/ServicesGrid'
import IndustryFocus from '@/components/IndustryFocus'
import LeadForm from '@/components/LeadForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      {/* Sticky Header */}
      <Navbar />

      {/* Main Single Page Layout Composition */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero3D />

        {/* Services Grid Section */}
        <ServicesGrid />

        {/* Capabilities Section */}
        <IndustryFocus />

        {/* Lead Capture Section */}
        <LeadForm />
      </main>

      {/* Shared Footer */}
      <Footer />
    </>
  )
}
