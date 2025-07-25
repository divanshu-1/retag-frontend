'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Image Upload Guide Component
 * 
 * Provides comprehensive guidance for optimal product image uploads
 * including aspect ratios, file sizes, and quality recommendations
 */
export default function ImageUploadGuide() {
  const aspectRatios = [
    {
      ratio: '4:5',
      description: 'Product Cards (Recommended)',
      usage: 'Main product listing, grid view',
      dimensions: '800x1000px',
      status: 'recommended'
    },
    {
      ratio: '1:1',
      description: 'Square Format',
      usage: 'Social media, thumbnails',
      dimensions: '800x800px',
      status: 'good'
    },
    {
      ratio: '3:4',
      description: 'Portrait Format',
      usage: 'Detail shots, lifestyle photos',
      dimensions: '600x800px',
      status: 'good'
    },
    {
      ratio: '16:9',
      description: 'Landscape Format',
      usage: 'Banner images, wide shots',
      dimensions: '1200x675px',
      status: 'optional'
    }
  ];

  const qualityGuidelines = [
    {
      title: 'File Format',
      recommendation: 'JPEG for photos, PNG for graphics',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    {
      title: 'File Size',
      recommendation: 'Under 2MB per image',
      icon: <AlertCircle className="h-4 w-4 text-yellow-500" />
    },
    {
      title: 'Resolution',
      recommendation: 'Minimum 800px on shortest side',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    {
      title: 'Quality',
      recommendation: '85-95% JPEG quality',
      icon: <Info className="h-4 w-4 text-blue-500" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'optional':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Optimal Image Aspect Ratios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aspectRatios.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{item.ratio}</h3>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-700">{item.description}</p>
                <p className="text-xs text-gray-500">{item.usage}</p>
                <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {item.dimensions}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-green-700">
              The <strong>4:5 aspect ratio</strong> is optimal for ReTag's product cards. 
              It provides the best balance between showing product details and maintaining 
              a clean grid layout across all devices.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quality Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qualityGuidelines.map((guideline, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {guideline.icon}
                <div>
                  <h4 className="font-medium">{guideline.title}</h4>
                  <p className="text-sm text-gray-600">{guideline.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p className="text-sm">Use consistent lighting and background across all product images</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p className="text-sm">Include multiple angles: front, back, side, and detail shots</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p className="text-sm">Show the product being worn or used when applicable</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p className="text-sm">Ensure images are sharp and well-focused</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <p className="text-sm">Avoid watermarks or text overlays on product images</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
