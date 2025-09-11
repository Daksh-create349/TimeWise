
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Logo from '@/components/logo';

export default function PortalPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="text-center mb-16">
        <Logo className="mb-4" width={80} height={80} />
        <h1 className="text-6xl font-bold text-foreground font-headline">
          TimeWise
        </h1>
        <p className="text-lg text-primary mt-4">
          AI-Powered Learning & Assessments - Smarter, Faster, Engaging
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <PortalCard
          title="Students"
          href="/login/student"
          imageUrl="https://i.pinimg.com/736x/8b/85/e6/8b85e627bc90a5336114a407dff9b6f3.jpg"
          imageHint="university students"
        />
        <PortalCard
          title="Faculty"
          href="/login/faculty"
          imageUrl="https://i.pinimg.com/736x/e1/43/47/e14347894ccb2289ccb5cc9a85ccdb21.jpg"
          imageHint="university professor"
        />
      </div>
    </main>
  );
}

function PortalCard({ title, href, imageUrl, imageHint }: { title: string, href: string, imageUrl: string, imageHint: string }) {
  return (
    <Link href={href}>
      <Card 
        className="relative group h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-black text-white"
        style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }}
        data-ai-hint={imageHint}
      >
        <CardContent className="relative z-10 flex h-full items-end justify-between p-6">
          <h2 className="text-3xl font-bold">{title}</h2>
          <div className="bg-white text-black rounded-full h-12 w-12 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            <ArrowRight className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
