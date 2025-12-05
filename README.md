# ParaWrite

A clean, efficient tool for manual text paraphrasing. Edit your documents sentence by sentence with full context for better results.

## 📋 Overview

ParaWrite is a modern web application designed to streamline the paraphrasing process. It allows users to upload documents or paste text, then edit them sentence by sentence with a clean, distraction-free interface. Unlike automated paraphrasing tools, ParaWrite keeps you in control while providing the structure and workflow to make manual editing efficient.

## ✨ Features

- **📁 Multi-format Support**: Upload TXT, DOCX, or PDF files
- **✍️ Direct Text Input**: Paste text directly into the application
- **🔍 Sentence-by-Sentence Editing**: Work through your text systematically
- **👀 Context Preview**: See previous and next sentences while editing
- **📊 Progress Tracking**: Visual progress bar shows completion status
- **💾 Export Options**: Download your edited text as TXT, DOCX, or PDF
- **📋 Copy to Clipboard**: Quick copy functionality for finished text
- **🎨 Modern UI**: Built with shadcn/ui for a polished user experience
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ParaWrite.git
cd ParaWrite
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Radix UI** - Accessible component primitives

### Additional Libraries
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Lucide React** - Icon library
- **Recharts** - Charting library
- **Mammoth.js** - DOCX file parsing
- **Supabase** - Backend infrastructure

## 📖 Usage

### Workflow

1. **Input Stage**: 
   - Upload a document (TXT, DOCX, or PDF)
   - Or paste your text directly

2. **Paraphrasing Stage**:
   - Review each sentence individually
   - Edit in the textarea provided
   - See context (previous and next sentences)
   - Navigate between sentences or skip unchanged ones

3. **Output Stage**:
   - Review your complete edited text
   - Download in your preferred format
   - Copy to clipboard
   - Start over with new text

### Keyboard Shortcuts

While editing sentences:
- Use the "Next" button to save and move forward
- Use "Skip" to keep the original sentence
- Progress bar shows your completion status

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Project Structure

```
ParaWrite/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── FileUpload.tsx  # File upload component
│   │   ├── TextInput.tsx   # Text input component
│   │   ├── ParaphrasingScreen.tsx  # Main editing interface
│   │   └── FinalOutput.tsx # Output and export screen
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External service integrations
│   ├── lib/               # Utility libraries
│   ├── pages/             # Page components
│   ├── utils/             # Helper functions
│   └── main.tsx           # Application entry point
├── public/                # Static assets
└── package.json          # Project dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ for better writing
