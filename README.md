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
- React 18 with JavaScript
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
- Modern JavaScript throughout for clean, readable code

### File Structure
```
├── client/                 # React frontend
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI component library
│   │   ├── Layout.jsx     # Main layout with header/footer
│   │   └── ApiKeyNotice.jsx # AI status indicator
│   ├── pages/             # Page components
│   │   ├── Index.jsx      # Homepage
│   │   ├── Practice.jsx   # Practice questions
│   │   ├── Tutor.jsx      # AI chat tutor
│   │   ├── About.jsx      # About page
│   │   └── NotFound.jsx   # 404 page
│   └── App.jsx            # Main app with routing
├── server/                # Express backend
│   ├── routes/            # API endpoints
│   │   ├── questions.js   # Question generation
│   │   └── chat.js        # Chat responses
│   ├── services/          # Business logic
│   │   └── together.js    # Together AI integration
│   └── index.js           # Server setup
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
- Enhanced detailed explanations for each answer (3-5 sentences with concept explanations, tips, and context)
- Progress tracking and scoring
- Loading animation during question generation

### AI Tutor Chat
- Natural language conversation about test prep
- Voice input and audio output support
- Focused on educational content
- Encouraging and supportive responses
- Custom PrepMind logo icon instead of generic robot icon

### UI/UX Enhancements
- Custom UI switch for dark/light mode toggle with smooth animations
- Dark mode toggle with system preference detection and improved functionality
- Responsive design for all screen sizes
- Clean, accessible interface with enhanced animations
- Fast loading and performance optimized
- Animated "Everything You Need to Succeed" heading with hover effects
- Custom styled "Meet Your AI Tutor" button with hover animations
- Enhanced flip card animations on About page with 3x bolder glowing green borders
- Rotating border animations on homepage feature cards
- Floating FAQ button (contact support) positioned for better visibility
- Improved Technical Specifications section with larger text
- Outline removed from footer copyright text for cleaner appearance
- Enhanced visual consistency across dark and light modes

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
- Modern JavaScript for clean, readable code

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

## Recent Updates

### Latest UI/UX Improvements (2024)

**Enhanced User Experience:**
- ✅ **AI Tutor Icon Update**: Replaced generic robot icon with custom PrepMind logo SVG for better brand consistency
- ✅ **Dark/Light Mode Fix**: Fixed toggle functionality with proper event handling and smooth transitions
- ✅ **Enhanced Explanations**: Made practice question explanations 3-5 sentences long with detailed concept explanations and helpful tips
- ✅ **Custom Button Redesign**: Replaced "Meet Your AI Tutor" button with custom design featuring smooth hover animations
- ✅ **Animated Text Effects**: Added animated text feature to "Everything You Need to Succeed" heading with color-changing hover effects

**Visual Enhancements:**
- ✅ **Enhanced Flip Cards**: Made About page flip card border animations 3x bolder and more prominent
- ✅ **Improved FAQ Button**: Moved floating FAQ button position for better tooltip visibility
- ✅ **Typography Updates**: Increased Technical Specifications text size for better readability
- ✅ **Clean Footer**: Removed outline from copyright text for cleaner appearance
- ✅ **Loading Animations**: Added engaging loader animation for practice question generation

**Technical Improvements:**
- ✅ **Database Architecture**: No traditional database - uses API services (OpenAI, Together AI) for AI-powered features
- ✅ **Responsive Design**: All new features are fully responsive and work across all device sizes
- ✅ **Accessibility**: Maintained accessibility standards while adding visual enhancements
- ✅ **Performance**: Optimized animations and transitions for smooth performance

## Support

For issues or questions:
- Create a GitHub issue
- Check the console for error messages
- Verify environment variables are set correctly
- Ensure Together AI API key has sufficient credits

---

Built with ❤️ to make test prep accessible to everyone.
