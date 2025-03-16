import { Navbar } from "@/components/ui/Navbar";
import { GoBack } from "@/components/ui/Goback";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] relative">
      <Navbar />
      <GoBack />
      <div className="flex flex-col items-center justify-start pt-8">
        <h1 className="text-5xl font-bold mb-8">About</h1>
        <div className="w-[95%] md:w-[80%] lg:w-[60%] max-w-2xl mx-auto">
          {/* Application Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">About This Application</h2>
            <p className="mb-3">
              This dairy farm management application is designed as a streamlined solution for small-scale dairy farms.
              It helps farmers digitize their record-keeping and gain insights through simple data visualization.
            </p>
            <p className="mb-3">
              Our main goal is to provide an intuitive interface for everyday farm management tasks while
              eliminating the need for paper records.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-2">Key Features</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Comprehensive cattle inventory management</li>
              <li>Event tracking (calving, health events, breeding)</li>
              <li>Statistics and visualizations for farm data</li>
              <li>Simple and intuitive interface for daily operations</li>
            </ul>
          </section>

          {/* Technology Stack */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Technology Stack</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Frontend</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Next.js 14 with App Router</li>
                  <li>React</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Shadcn/UI components</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Data & Backend</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>MongoDB</li>
                  <li>Recharts for data visualization</li>
                  <li>API Routes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Version Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Version Information</h2>
            <p className="mb-1"><strong>Version:</strong> 1.0.0</p>
            <p className="mb-1"><strong>Project Type:</strong> Bachelor's thesis</p>
            <p className="mb-3">
              This application was developed as part of a bachelor's thesis project
              focused on creating practical solutions for small dairy farm operations.
            </p>
            
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Dairy Farm Management System
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}