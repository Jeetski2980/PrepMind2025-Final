# PrepMind AI - Free Test Prep Platform

PrepMind is a free AI-powered test preparation platform that helps students prepare for SAT, ACT, and AP exams through personalized practice questions and tutoring.

## What This App Does

PrepMind provides two main features:
1. **AI Practice Questions** - Generate unlimited practice questions for any test type and subject
2. **AI Tutor Chat** - Get help with test prep concepts and strategies through an AI chatbot

The platform is designed to be completely free and accessible to all students, especially those who might not have access to expensive test prep resources.

## How It Was Built

### Architecture Overview

PrepMind is a full-stack web application built with:

**Frontend:**
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Radix UI components for accessible UI elements
- Lucide React for icons

**Backend:**
- Node.js with Express
- Together AI for generating questions and chat responses
- CORS enabled for cross-origin requests

**Development:**
- Vite for fast development and building
- Hot reload for both frontend and backend
- TypeScript throughout for type safety

### File Structure
```
├── client/                 # React frontend
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI component library
│   │   ├── Layout.tsx     # Main layout with header/footer
│   │   └── ApiKeyNotice.tsx # AI status indicator
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Homepage
│   │   ├── Practice.tsx   # Practice questions
│   │   ├── Tutor.tsx      # AI chat tutor
│   │   ├── About.tsx      # About page
│   │   └── NotFound.tsx   # 404 page
│   └── App.tsx            # Main app with routing
├── server/                # Express backend
│   ├── routes/            # API endpoints
│   │   ├── questions.ts   # Question generation
│   │   └── chat.ts        # Chat responses
│   ├── services/          # Business logic
│   │   └── together.ts    # Together AI integration
│   └── index.ts           # Server setup
├── shared/                # Shared types
│   └── api.ts             # TypeScript interfaces
└── public/                # Static assets
    ├── favicon.svg        # Site icon
    └── robots.txt         # SEO directives
```

## APIs and Integrations

### Together AI
PrepMind uses Together AI's language models to power both question generation and chat responses:

- **Model:** `meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo`
- **Purpose:** Generate realistic test questions and provide educational guidance
- **API Key:** Required and stored as environment variable

### Browser APIs
The tutor page uses browser APIs for enhanced functionality:
- **Speech Recognition:** Convert speech to text for voice input
- **Speech Synthesis:** Read AI responses aloud
- **LocalStorage:** Save dark mode preference

## Features

### AI Practice Questions
- Choose from SAT, ACT, or AP exams
- Select specific subjects (Math, Reading, Writing, Science, etc.)
- Optional topic filtering for focused practice
- Generate 5-20 questions per session
- Detailed explanations for each answer
- Progress tracking and scoring

### AI Tutor Chat
- Natural language conversation about test prep
- Voice input and audio output support
- Focused on educational content
- Encouraging and supportive responses

### Additional Features
- Dark mode toggle with system preference detection
- Responsive design for all screen sizes
- Clean, accessible interface
- Fast loading and performance optimized

## Setup and Installation

### Prerequisites
- Node.js 18 or higher
- Together AI API key

### Local Development

1. **Clone the repository**
```bash
git clone [your-repo-url]
cd prepmind
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```
TOGETHER_API_KEY=your_together_ai_api_key_here
NODE_ENV=development
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
npm start
```

## Deploying to Render

PrepMind is optimized for deployment on Render's free tier:

### Quick Deploy Steps

1. **Push code to GitHub**
   - Create a GitHub repository
   - Push all code to the main branch

2. **Create Render Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure the service**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `NODE_ENV` = `production`
     - `TOGETHER_API_KEY` = `[your-api-key]`

4. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment

### Render Configuration

The app includes optimized configuration for Render:
- Proper package.json scripts
- Environment variable handling
- Static file serving
- Health check endpoint (`/api/ping`)

### Free Tier Limitations
- Service sleeps after 15 minutes of inactivity
- 750 hours per month included
- Cold start time of 10-30 seconds

## Development Notes

### Code Style
The code is written to be readable and maintainable:
- Simple, clear function names
- Minimal abstraction where possible
- Consistent formatting and structure
- TypeScript for type safety

### Error Handling
- Graceful degradation when AI services fail
- Fallback content for offline scenarios
- User-friendly error messages
- Console logging for debugging

### Performance
- Lazy loading where appropriate
- Optimized bundle size
- Fast development server with hot reload
- Efficient re-renders with React best practices

## API Endpoints

### POST /api/generate-questions
Generate practice questions for a specific test and subject.

**Request:**
```json
{
  "testType": "SAT",
  "subject": "Math", 
  "topic": "Algebra",
  "numQuestions": 5
}
```

**Response:**
```json
{
  "success": true,
  "questions": [
    {
      "id": 1,
      "question": "If 3x + 7 = 22, what is x?",
      "choices": ["x = 5", "x = 7", "x = 15", "x = 29"],
      "correct_answer": 0,
      "explanation": "Subtract 7 from both sides...",
      "difficulty": "Easy"
    }
  ]
}
```

### POST /api/chat
Get AI tutor response to a student question.

**Request:**
```json
{
  "message": "How do I solve quadratic equations?"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Quadratic equations can be solved using several methods..."
}
```

### GET /api/ping
Health check endpoint.

**Response:**
```json
{
  "message": "PrepMind API is running"
}
```

## Contributing

To contribute to PrepMind:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Guidelines
- Keep code simple and readable
- Add comments for complex logic
- Test all functionality before submitting
- Follow existing code style

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Create a GitHub issue
- Check the console for error messages
- Verify environment variables are set correctly
- Ensure Together AI API key has sufficient credits

---

Built with ❤️ to make test prep accessible to everyone.
