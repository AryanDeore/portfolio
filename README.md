# Alex Johnson - Interactive Portfolio

An interactive portfolio website with an AI-powered chat interface that allows visitors to ask questions about Alex Johnson's experience, skills, projects, and background.

## ✨ Features

- **Interactive Chat Interface** - Ask questions about experience, skills, and projects
- **Smooth Mode Transitions** - Seamless switch between landing page and chat mode
- **Sticky Chat Input** - Appears on scroll for easy access
- **Responsive Design** - Works perfectly on all screen sizes
- **Professional Projects Section** - Showcases work with testimonials
- **Modern UI** - Built with shadcn/ui components and Tailwind CSS

## 🚀 Technology Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Fonts**: Geist Sans & Geist Mono

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 User Experience Flow

### Landing Page → Chat Mode
1. User lands on the portfolio page
2. Sees hero section with chat input and example questions
3. Types a question or clicks an example
4. Instantly switches to chat mode with AI response
5. Can continue the conversation or start a new chat

### Sticky Chat Input
- Appears when scrolling past 80% of viewport height
- Provides quick access to start a conversation
- Smooth animations and transitions

## 🎨 Design Features

- **Glass Effect Navigation** - Backdrop blur with transparency
- **Gradient Text** - Beautiful gradient effects on headings
- **Smooth Animations** - Fade-in, slide-up, and scale animations
- **Custom Scrollbar** - Styled scrollbar for better UX
- **Professional Color Scheme** - Clean, modern design system

## 🤖 AI Chat Simulation

The portfolio includes a sophisticated AI response system that:
- Recognizes keywords in user questions
- Provides relevant responses about experience and skills
- Simulates realistic response delays
- Maintains conversation context

## 📦 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and animations
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main portfolio page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components (Navbar, Footer)
│   ├── sections/          # Page sections (Hero, Testimonials)
│   └── chat/              # Chat-related components
└── lib/
    ├── utils.ts           # Utility functions
    └── ai-responses.ts    # AI response simulation
```

## 🚀 Deployment

The portfolio is optimized for deployment on Vercel:

```bash
npm run build
npm start
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using Next.js, React, and modern web technologies.