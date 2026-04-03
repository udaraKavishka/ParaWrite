/**
 * About Component
 * Developer information and project details
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Github, Mail, Heart, Coffee, Star } from 'lucide-react';
import { AlertCircle, Code, Lightbulb } from 'lucide-react';

const openExternal = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

const About = () => {
  return (
    <div className="space-y-8">
      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">About ParaWrite</CardTitle>
          <CardDescription>
            Professional sentence-by-sentence paraphrasing tool with enterprise-grade features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            ParaWrite is a modern, open-source paraphrasing tool designed for professionals who need
            precise control over their text editing workflow. Built with React, TypeScript, and cutting-edge
            web technologies, it offers enterprise-grade sentence splitting, context awareness, and
            comprehensive export options.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">React 18</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
            <Badge variant="secondary">Vite</Badge>
            <Badge variant="secondary">Supabase</Badge>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Developer Info */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Developer</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Udara Nalawansa</CardTitle>
            <CardDescription>Full-Stack Developer & Creator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Passionate about building tools that enhance productivity and improve workflows.
              Focused on clean code, excellent UX, and solving real-world problems with technology.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => openExternal('https://github.com/udaraKavishka/')}
              >
                <Github className="w-4 h-4" />
                GitHub Profile
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => openExternal('https://github.com/udaraKavishka/ParaWrite')}
              >
                <Github className="w-4 h-4" />
                Project Repository
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.location.href = 'mailto:hello@udaradev.me'}
              >
                <Mail className="w-4 h-4" />
                Email Me
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Contact & Contribution */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Get Involved</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Feature Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Request Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Have an idea for a new feature? Open an issue on GitHub or send me an email.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openExternal('https://github.com/udaraKavishka/ParaWrite/issues/new')}
              >
                Open GitHub Issue
              </Button>
            </CardContent>
          </Card>

          {/* Bug Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Report Bugs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Found a bug? Let me know! File an issue with details and I'll investigate.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openExternal('https://github.com/udaraKavishka/ParaWrite/issues/new')}
              >
                Report Bug
              </Button>
            </CardContent>
          </Card>

          {/* Contribute */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-500" />
                Contribute Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Want to contribute? Fork the repo, make your changes, and submit a pull request!
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openExternal('https://github.com/udaraKavishka/ParaWrite/fork')}
              >
                Fork Repository
              </Button>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Coffee className="w-5 h-5 text-orange-500" />
                Support Development
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Enjoying ParaWrite? Star the repo on GitHub to show your support!
              </p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => openExternal('https://github.com/udaraKavishka/ParaWrite/')}
              >
                <Star className="w-4 h-4" />
                Star on GitHub
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* License & Credits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">License & Credits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>License:</strong> MIT License - Free to use, modify, and distribute
            </p>
            <p>
              <strong>Built with:</strong> React, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Supabase
            </p>
            <p>
              <strong>Hosting:</strong> Vercel
            </p>
          </div>
          
          <div className="pt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="w-4 h-4 text-red-500" />
            <span>Made with care for the writing community</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
