import { getDictionary } from "@/lib/dictionary";
import { Hero } from "@/components/hero";
import { Mission } from "@/components/mission";
import { Features } from "@/components/features";
import { Team } from "@/components/team";
import { WaitlistForm } from "@/components/waitlist-form";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { StackedCards } from "@/components/stacked-cards";

export default async function Home({ params } : { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang as 'en' | 'cs');

  const cards = [
    { id: "home", component: <Hero dict={dict} /> },
    { id: "vision", component: <Mission dict={dict} /> },
    { id: "features", component: <Features dict={dict} /> },
    { id: "team", component: <Team dict={dict} /> },
    { id: "contact", component: <WaitlistForm dict={dict} /> },
  ];

  return (
    <main 
      key={resolvedParams.lang} 
      className="relative min-h-screen animate-in fade-in duration-700 ease-in-out"
    >
      <ScrollIndicator />
      <StackedCards cards={cards} />
    </main>
  );
}
