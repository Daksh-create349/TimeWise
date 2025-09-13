
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Bot, Calendar, Palette, GraduationCap, User, Cpu, Wind, PaletteIcon } from 'lucide-react';
import Logo from '@/components/logo';
import { Card } from '@/components/ui/card';
import imageData from '@/app/lib/placeholder-images.json';

const features = [
  {
    icon: <Bot className="h-6 w-6" />,
    title: 'Dynamic Content Generation',
    description: 'Faculty can generate syllabi, lesson plans, and course content with a single click, powered by generative AI.',
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: 'Smart Scheduling',
    description: 'Automate timetable creation with AI, balancing faculty preferences and resource availability effortlessly.',
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: 'AI-Powered Assistance',
    description: 'Students receive personalized course suggestions and learning resources based on their academic profile.',
  },
];


const techStack = [
    { name: 'Next.js', icon: <Wind className="w-5 h-5"/> },
    { name: 'React', icon: <User className="w-5 h-5"/> },
    { name: 'Tailwind CSS', icon: <Palette className="w-5 h-5"/> },
    { name: 'Genkit', icon: <Cpu className="w-5 h-5"/> },
];

export default function AboutPage() {
  const { faculty_dashboard, student_dashboard_video } = imageData.about;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="relative isolate">
        <div className="absolute top-0 left-0 w-full h-full -z-20">
            <video
            src="https://cdn.pixabay.com/video/2022/09/20/131990-751915304_large.mp4"
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
            />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 -z-10" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center opacity-0 slide-up">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>
            <div className="flex items-center justify-center gap-4">
              <Logo className="h-16 w-16 text-white" />
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-headline">
                TimeWise
              </h1>
            </div>
            <p className="mt-6 text-lg leading-8 text-white/80">
              AI-Powered Learning & Assessments - Smarter, Faster, Engaging
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 -mt-16">
        <Card className="p-8 lg:p-12 opacity-0 fade-in">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">How It Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl font-headline">
              Everything you need for a modern academic experience
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              TimeWise is an integrated platform designed to enhance the educational journey by leveraging the power of AI for both students and faculty.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-x-16 lg:gap-y-16">
              {features.map((feature, index) => (
                <div key={feature.title} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>
      </div>

       <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="opacity-0 fade-in">
                    <h3 className="text-2xl font-bold tracking-tight sm:text-3xl font-headline flex items-center gap-3">
                        <GraduationCap className="h-8 w-8 text-primary"/>
                        For Students
                    </h3>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Access a personalized dashboard with your schedule, assignments, and grades. Get AI-driven course suggestions tailored to your academic profile and explore topics with AI-curated learning resources.
                    </p>
                </div>
                <div className="relative opacity-0 fade-in-delay-1 rounded-xl shadow-2xl h-96">
                   <video
                      src={student_dashboard_video.url}
                      autoPlay
                      loop
                      muted
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-xl" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-24">
                 <div className="opacity-0 fade-in-delay-1 lg:order-2">
                    <h3 className="text-2xl font-bold tracking-tight sm:text-3xl font-headline flex items-center gap-3">
                        <User className="h-8 w-8 text-primary"/>
                        For Faculty
                    </h3>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Automate administrative tasks with our AI Timetable Generator. Create comprehensive course content, from syllabi to lesson plans, and manage assignments and attendance with ease.
                    </p>
                </div>
                <div className="relative opacity-0 fade-in-delay-2 lg:order-1 h-96">
                     <video
                      src={faculty_dashboard.url}
                      autoPlay
                      loop
                      muted
                      className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-xl" />
                </div>
            </div>
        </div>
      </div>
      
      <div className="bg-muted/50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl font-headline">
                Technology Stack
            </h3>
            <p className="mt-2 text-lg text-muted-foreground">
                Built with a modern, scalable, and AI-first technology stack.
            </p>
            <div className="mt-8 flex justify-center gap-8">
                {techStack.map(tech => (
                    <div key={tech.name} className="flex items-center gap-2 text-muted-foreground">
                        {tech.icon}
                        <span className="font-semibold">{tech.name}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>

    </div>
  );
}
