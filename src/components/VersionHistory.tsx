/**
 * Version History Component
 * Displays complete changelog with all iterations and updates
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { versionHistory, upcomingFeatures } from '@/data/versionHistory';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';

const VersionHistory = () => {
  return (
    <div className="space-y-8">
      {/* Current and Past Versions */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          Released Versions
        </h2>
        <div className="space-y-6">
          {versionHistory.map((version, index) => (
            <Card key={version.version} className={index === 0 ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">
                        {version.version} - {version.title}
                      </CardTitle>
                      {index === 0 && (
                        <Badge variant="default" className="ml-2">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm">
                      Released {version.date}
                    </CardDescription>
                  </div>
                </div>
                <p className="text-muted-foreground mt-2">{version.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Features */}
                {version.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">✨ Features</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {version.features.map((feature, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-green-500">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {version.improvements && version.improvements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">🚀 Improvements</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {version.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bug Fixes */}
                {version.bugFixes && version.bugFixes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">🐛 Bug Fixes</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {version.bugFixes.map((fix, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-yellow-500">•</span>
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metrics */}
                {version.metrics && version.metrics.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">📊 Key Metrics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {version.metrics.map((metric, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-muted/50 border border-border"
                        >
                          <div className="text-2xl font-bold text-primary">{metric.value}</div>
                          <div className="text-xs text-muted-foreground">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Upcoming Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-orange-500" />
          Roadmap & Upcoming Features
        </h2>
        <div className="space-y-6">
          {upcomingFeatures.map((version) => (
            <Card key={version.version} className="border-dashed">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">
                        {version.version} - {version.title}
                      </CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {version.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {version.features.map((feature, idx) => (
                    <li key={idx} className="flex gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;
