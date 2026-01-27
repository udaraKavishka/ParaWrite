/**
 * Use Cases Component
 * Displays real-world scenarios and solutions
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCases, categories } from '@/data/useCases';
import { CheckCircle2, AlertCircle, Lightbulb, Code } from 'lucide-react';

const UseCases = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredUseCases =
    selectedCategory === 'All'
      ? useCases
      : useCases.filter((uc) => uc.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Use Cases & Solutions</h2>
        <p className="text-muted-foreground">
          Real-world scenarios and how ParaWrite handles them with precision
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/80"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Use Cases Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredUseCases.map((useCase) => (
          <Card key={useCase.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <Badge variant="secondary" className="mb-2">
                    {useCase.category}
                  </Badge>
                  <CardTitle className="text-lg">{useCase.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              {/* Problem */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm">Problem</h4>
                    <p className="text-sm text-muted-foreground">{useCase.problem}</p>
                  </div>
                </div>
              </div>

              {/* Solution */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm">Solution</h4>
                    <p className="text-sm text-muted-foreground">{useCase.solution}</p>
                  </div>
                </div>
              </div>

              {/* Example */}
              {useCase.example && (
                <div className="space-y-2 p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <h4 className="font-semibold text-sm">Example</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium">Input:</span>
                      <pre className="mt-1 p-2 rounded bg-background text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                        {useCase.example.input}
                      </pre>
                    </div>
                    <div>
                      <span className="font-medium">Result:</span>
                      <pre className="mt-1 p-2 rounded bg-background text-green-600 overflow-x-auto whitespace-pre-wrap">
                        {useCase.example.output}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Features Used */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  Features Used
                </h4>
                <div className="flex flex-wrap gap-1">
                  {useCase.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUseCases.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No use cases found for this category.
        </div>
      )}
    </div>
  );
};

export default UseCases;
