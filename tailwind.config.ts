/**
 * Tailwind CSS Configuration for ReTag Marketplace
 *
 * This configuration customizes Tailwind CSS for the ReTag application.
 * It includes:
 * - Dark mode support
 * - Custom theme extensions (fonts, colors, animations)
 * - Container configuration for responsive design
 * - Content paths for purging unused styles
 *
 * @author ReTag Team
 */

import type {Config} from 'tailwindcss';

export default {
  // Dark mode configuration - uses class-based dark mode
  darkMode: ['class'],

  // Content paths - tells Tailwind where to look for class names
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',      // Pages directory
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Components directory
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',        // App directory (Next.js 13+)
  ],
  theme: {
    // Container configuration for responsive layouts
    container: {
      center: true,                    // Center containers by default
      padding: {                       // Responsive padding
        DEFAULT: '1rem',               // Default padding
        sm: '1.5rem',                  // Small screens and up
        lg: '2rem',                    // Large screens and up
      },
      screens: {
        '2xl': '1400px',              // Maximum container width
      },
    },

    // Theme extensions
    extend: {
      // Custom font families
      fontFamily: {
        body: ['Inter', 'sans-serif'],      // Body text font
        headline: ['Inter', 'sans-serif'],  // Headline font
        code: ['monospace'],                // Code font
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
