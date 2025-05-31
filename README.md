# 🎯 Fearvana AI - Find Your Sacred Edge

**"Find Your Sacred Edge. Live it. Track it. Automate growth."**

Akshay Nanavati's AI-powered personal development platform designed specifically for YPO leaders and high-achievers who want to transform fear into fuel for extraordinary growth.

## 🌟 What is Fearvana AI?

Fearvana AI is the digital embodiment of Akshay Nanavati's teachings from [Fearvana.com](https://fearvana.com). It helps leaders discover their "Sacred Edge" - that place where fear and excitement meet - and provides AI-powered coaching to push through mental barriers and achieve breakthrough results.

## 🎯 Core Features

### 🤖 AI Akshay Coach
- **RAG-Powered Conversations**: Chat with AI trained on Akshay's books, frameworks, and teachings
- **Personalized Coaching**: Get direct, challenging guidance rooted in the warrior mindset
- **Voice Integration**: Hear responses in Akshay's voice (ElevenLabs integration)
- **Sacred Edge Discovery**: Guided sessions to identify what you're avoiding and why

### 🎯 Sacred Edge Finder
- **Deep Reflection Tool**: Multi-phase assessment to uncover your biggest growth opportunities
- **Fear Analysis**: Understand the patterns behind what you avoid
- **Action Planning**: Get specific experiments to push your Sacred Edge
- **Progress Tracking**: Monitor your courage-building journey

### 📋 AI-Generated Daily Tasks
- **Personalized Action Plans**: Daily missions tailored to your Sacred Edge
- **Comfort Zone Challenges**: Tasks designed to build mental toughness
- **Priority Intelligence**: AI determines what matters most right now
- **Progress Gamification**: Track completion and build momentum

### 📊 Life Levels Dashboard
- **8 Core Areas**: Mindset, Relationships, Wealth, Fitness, Health, Career, Peace
- **Visual Progress**: Radar charts and trend analysis
- **Goal Tracking**: Set and monitor targets across all life areas
- **Sacred Edge Integration**: Identify which areas need courage-based growth

### 🧠 Insights & Analytics
- **Pattern Recognition**: AI identifies your fear patterns and breakthrough moments
- **Journal Integration**: Reflect on daily experiences and extract insights
- **Trend Analysis**: Understand what drives your peak performance
- **Actionable Intelligence**: Get specific recommendations based on your data

## 🏗️ Technical Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: React hooks + Context
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

### AI & Backend
- **Primary AI**: Claude 3 Sonnet (Anthropic)
- **Fallback AI**: GPT-4o (OpenAI)
- **RAG Pipeline**: LlamaIndex + Pinecone vector database
- **Embeddings**: OpenAI text-embedding-3-small
- **Voice**: ElevenLabs (custom Akshay voice)
- **Database**: Supabase (optional)

### Deployment
- **Hosting**: Vercel
- **Environment**: Docker containers
- **CDN**: Vercel Edge Network
- **Analytics**: Built-in tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- API keys for AI services

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/fearvana-ai.git
cd fearvana-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Run development server
npm run dev
```

### Environment Variables

```env
# AI Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key
ELEVENLABS_API_KEY=your_elevenlabs_key
PINECONE_API_KEY=your_pinecone_key

# Database (Optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_TEMPO=true
```

## 📁 Project Structure

```
fearvana-ai/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Dashboard home
│   │   ├── chat/              # AI Akshay chat interface
│   │   ├── sacred-edge/       # Sacred Edge discovery tool
│   │   ├── tasks/             # Daily AI-generated tasks
│   │   ├── levels/            # Life areas tracking
│   │   ├── insights/          # Analytics & journaling
│   │   └── api/               # Backend API routes
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Shadcn/ui base components
│   │   ├── dashboard/        # Dashboard-specific components
│   │   └── layout/           # Layout components
│   └── lib/                  # Utilities and configurations
│       ├── constants.ts      # App constants and prompts
│       ├── ai-service.ts     # AI integration logic
│       └── utils.ts          # Helper functions
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 🎯 Sacred Edge Philosophy

The Sacred Edge is Akshay Nanavati's core concept - the intersection of fear and excitement where real growth happens. This platform helps users:

1. **Identify** what they're avoiding
2. **Understand** why they're avoiding it
3. **Create** experiments to face their fears
4. **Track** progress and breakthroughs
5. **Integrate** lessons into daily life

## 🔧 API Integration

### Chat API
```typescript
// Example: Chat with AI Akshay
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "I'm afraid to have a difficult conversation",
    context: userContext
  })
})
```

### Sacred Edge API
```typescript
// Example: Generate Sacred Edge analysis
const analysis = await fetch('/api/sacred-edge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    responses: userResponses,
    userId: currentUser.id
  })
})
```

## 🎨 Design System

- **Primary Colors**: Orange (#f97316) to Red (#ef4444) gradients
- **Typography**: Geist Sans for UI, Geist Mono for code
- **Components**: Shadcn/ui with custom Fearvana styling
- **Icons**: Lucide React with custom Sacred Edge iconography
- **Animations**: Tailwind CSS animations with custom transitions

## 🔒 Privacy & Security

- **Data Minimization**: Only collect essential user data
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Privacy-First**: AI sessions can be anonymous or locally stored
- **GDPR Compliant**: Full data export and deletion capabilities
- **Secure APIs**: Rate limiting and authentication on all endpoints

## 📈 Analytics & Insights

- **User Journey Tracking**: Monitor Sacred Edge discovery process
- **Engagement Metrics**: Track feature usage and completion rates
- **AI Performance**: Monitor response quality and user satisfaction
- **Growth Patterns**: Identify successful coaching strategies

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Akshay Nanavati** - Creator of the Sacred Edge philosophy and Fearvana methodology
- **YPO Community** - Early adopters and feedback providers
- **Open Source Community** - For the amazing tools and libraries that make this possible

## 📞 Support

- **Documentation**: [docs.fearvana.ai](https://docs.fearvana.ai)
- **Community**: [Discord](https://discord.gg/fearvana)
- **Email**: support@fearvana.com
- **Website**: [fearvana.com](https://fearvana.com)

---

**"The cave you fear to enter holds the treasure you seek."** - Akshay Nanavati

Ready to find your Sacred Edge? [Get started now](https://fearvana.ai) 🎯
