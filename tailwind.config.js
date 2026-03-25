/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PREMIUM MEDICAL DESIGN SYSTEM
        // Primary Colors
        navy: "#0B1B2B",
        white: "#F8FAFC",
        
        // Accent Colors  
        "medical-green": "#2BB673",
        "premium-gold": "#D4AF37",
        
        // Semantic Colors
        primary: "#0B1B2B",
        secondary: "#2BB673", 
        accent: "#D4AF37",
        background: "#F8FAFC",
        surface: "#FFFFFF",
        
        // Action States
        success: "#2BB673",
        warning: "#D4AF37",
        error: "#DC2626",
        
        // Neutral Grays (Tailwind Standard)
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6", 
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827"
        }
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"], 
        label: ["Inter", "sans-serif"]
      },
      // SPACING SYSTEM (8PX GRID)
      spacing: {
        1: "8px",   // 8
        2: "16px",  // 16  
        3: "24px",  // 24
        4: "32px",  // 32
        6: "48px",  // 48
        8: "64px",  // 64
        12: "96px", // 96
        // Keep Tailwind defaults for smaller values
        "0.5": "2px",
        "1.5": "6px", 
        "2.5": "10px",
        "3.5": "14px",
        "5": "20px",
        "7": "28px",
        "9": "36px",
        "10": "40px",
        "11": "44px",
        // Extended large spacing
        16: "128px",
        20: "160px",
        24: "192px",
        32: "256px"
      },
      borderRadius: {
        lg: "12px",
        xl: "16px", 
        "2xl": "24px",
        "3xl": "32px"
      },
      // TYPOGRAPHY SYSTEM  
      fontSize: {
        // Display
        "5xl": ["3rem", { lineHeight: "1.1", fontWeight: "600" }],      // H1
        "3xl": ["1.875rem", { lineHeight: "1.2", fontWeight: "600" }], // H2  
        "xl": ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],   // H3
        // Body
        "base": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],    // Body
        "sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }]   // Small
      },
      fontWeight: {
        normal: "400",
        medium: "500", 
        semibold: "600",
        bold: "700"
      },
      // ENHANCED SHADOW SYSTEM
      boxShadow: {
        // Soft elevation - Cards, subtle elements
        soft: "0 1px 3px rgba(11, 27, 43, 0.12), 0 1px 2px rgba(11, 27, 43, 0.08)",
        // Medium elevation - Hover states, important cards
        medium: "0 4px 12px rgba(11, 27, 43, 0.15), 0 2px 4px rgba(11, 27, 43, 0.08)",
        // High elevation - Featured elements, modals, focused states
        elevated: "0 10px 25px rgba(11, 27, 43, 0.18), 0 4px 8px rgba(11, 27, 43, 0.08)",
        // Premium elevation - Hero elements, primary CTAs
        premium: "0 20px 40px rgba(11, 27, 43, 0.12), 0 8px 16px rgba(11, 27, 43, 0.08)",
        // Colored shadows for accents
        "medical-green": "0 8px 20px rgba(43, 182, 115, 0.15), 0 3px 6px rgba(43, 182, 115, 0.08)",
        "premium-gold": "0 8px 20px rgba(212, 175, 55, 0.15), 0 3px 6px rgba(212, 175, 55, 0.08)",
        // Inner shadows
        inset: "inset 0 2px 4px rgba(11, 27, 43, 0.06)",
        // Button pressed state
        pressed: "inset 0 2px 4px rgba(11, 27, 43, 0.12)"
      },
      // BACKDROP BLUR
      backdropBlur: {
        glass: "20px"
      },
      // GRADIENTS (PREMIUM MEDICAL)
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #0B1B2B 0%, #1e3a5f 100%)",
        "success-gradient": "linear-gradient(135deg, #2BB673 0%, #22c55e 100%)",
        "premium-gradient": "linear-gradient(135deg, #D4AF37 0%, #fbbf24 100%)"
      },
      // ANIMATIONS
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}