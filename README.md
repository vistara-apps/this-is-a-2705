# Remixify

Instantly enhance your photos with AI-powered editing and creative effects.

## Overview

Remixify is a web application for users who want to quickly and easily edit their photos, add creative flair, and improve their visual content without complex software. It offers intuitive photo adjustments, AI-powered object removal, artistic filters, and text/graphic overlays.

## Features

- **Intuitive Photo Adjustments**: Easily adjust brightness, contrast, saturation, and exposure with simple sliders.
- **AI-Powered Object Removal**: Intelligently remove unwanted objects or blemishes from photos.
- **Artistic Filters & Effects**: Apply a variety of pre-set artistic filters to transform the mood and aesthetic of images.
- **Text & Graphic Overlays**: Add customizable text, shapes, or basic graphics to images.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Database**: Supabase PostgreSQL
- **AI Integration**: Google Gemini 2.5 Flash Image Edit API
- **Image Processing**: ApyHub Image Filter API
- **Payments**: Stripe

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account
- Google Gemini API key
- ApyHub API key
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/remixify.git
   cd remixify
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file based on `.env.example` and fill in your API keys:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   VITE_APYHUB_API_KEY=your-apyhub-api-key
   VITE_API_BASE_URL=your-api-base-url
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Supabase Setup

1. Create a new Supabase project
2. Set up the following tables:
   - `profiles`: User profiles
   - `subscriptions`: User subscription data
   - `images`: Image metadata
3. Create a storage bucket named `images` for storing user images

## Subscription Plans

- **Basic Plan**: $5/month
  - Basic image adjustments
  - Standard filters
  - Text & graphic overlays
  - 10 saved images

- **Pro Plan**: $15/month
  - All Basic features
  - AI object removal
  - Premium filters & effects
  - Unlimited saved images
  - Priority support

## Development

### Project Structure

```
remixify/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utility functions and API clients
│   ├── pages/          # Page components
│   ├── routes/         # Routing configuration
│   ├── services/       # API service functions
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── .env.example        # Example environment variables
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

### Building for Production

```bash
npm run build
# or
yarn build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [Google Gemini API](https://ai.google.dev/)
- [ApyHub](https://apyhub.com/)
- [Stripe](https://stripe.com/)
- [Lucide Icons](https://lucide.dev/)

