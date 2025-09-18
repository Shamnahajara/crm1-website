import { LeadForm } from "../components/lead-form"

export default function Home() {
  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-float">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary animate-glow mb-2">{"Get Started Today"}</h1>
          <p className="text-muted-foreground text-lg">{"Join thousands of satisfied customers"}</p>
        </div>
        <LeadForm />
      </div>
    </main>
  )
}
