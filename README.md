# ParaWrite

A professional sentence-by-sentence paraphrasing tool with enterprise-grade text processing, intelligent sentence splitting, and comprehensive export options.

## 📋 Overview

ParaWrite is a modern web application designed to streamline manual paraphrasing. Unlike automated tools, ParaWrite keeps you in control while providing intelligent sentence splitting, context awareness, and professional export options. Built with React, TypeScript, and cutting-edge web technologies, it offers production-ready performance and reliability.

**Current Version:** 2.0.0

## ✨ Features

### Core Capabilities
- **📁 Multi-format Support**: Upload TXT, DOCX, or PDF files
- **✍️ Direct Text Input**: Paste text directly into the application
- **🔍 Sentence-by-Sentence Editing**: Work through your text systematically with full context
- **👀 Context Preview**: See previous and next sentences while editing current one
- **📊 Progress Tracking**: Visual progress bar shows completion status
- **🎨 Modern UI**: Built with shadcn/ui and Tailwind CSS for a polished experience
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🗂️ Tabbed Interface**: Easy navigation between Tool, Version History, Use Cases, and About

### 🚀 Enterprise-Grade Features

#### Intelligent Sentence Splitting
- **3 Splitting Modes**: Strict, Balanced, Loose - choose based on your needs
- **Domain Profiles**: Academic, Legal, Technical, Medical - specialized abbreviation handling
- **15+ Edge Cases**: Handles Dr., e.g., etc., i.e., U.S.A., decimals (3.14), quotes, ellipses, and more
- **100% Test Pass Rate**: Comprehensive test suite with 18 test cases
- **Performance**: 88,156 sentences/second on standard hardware

#### Professional Export Options
- **Multiple Formats**: Export to TXT, DOCX, or Markdown
- **Paragraph Preservation**: Maintains original paragraph structure
- **Automatic Naming**: Smart filename generation based on content

#### Reliability & Data Safety
- **Auto-save**: Saves your work every 30 seconds automatically
- **Crash Recovery**: Resume exactly where you left off after unexpected closures
- **Session History**: 7-day retention in browser localStorage
- **Never Lose Work**: Built-in redundancy ensures your edits are safe

#### Advanced Text Analysis
- **Readability Metrics**: Flesch Reading Ease and Flesch-Kincaid Grade Level
- **Context Awareness**: Track key terms, detect acronyms, identify entities
- **Consistency Warnings**: Alerts for inconsistent terminology usage
- **Before/After Comparison**: Track improvements with detailed metrics

#### Performance at Scale
- **Web Worker Processing**: Background processing prevents UI freezing
- **Large Document Support**: Handles 30,000+ sentences smoothly
- **Optimized Algorithms**: Efficient memory usage and processing speed
- **Responsive Interface**: UI stays interactive even during heavy processing

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/udaraKavishka/ParaWrite.git
cd ParaWrite
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:8080`

### Future Enhancements

#### Supabase Integration (Coming Soon)

**Note**: Supabase integration is planned for a future update to provide:
- Enhanced PDF processing fallback
- Better handling of complex PDF formats
- OCR support for scanned documents

For now, PDF files are processed client-side using the `pdf-parse` library, which works for most text-based PDFs.

## Python extraction backend (Supabase-friendly)

ParaWrite now supports an external Python extraction service for file parsing and retry workflows.

### Supported formats

- PDF
- DOCX
- DOC
- MD
- MDX
- TXT

### OCR retry mode for scanned PDFs

When normal PDF extraction fails or text is missing, users can trigger `Retry (OCR)` in the review panel.

Install system OCR binary (required for `pytesseract`):

```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y tesseract-ocr

# macOS
brew install tesseract
```

Then reinstall backend deps:

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

### Why this backend exists

- Better extraction quality for complex PDFs and mixed document structures.
- Retry with alternate extraction strategies when users report problems.
- Show extracted text first so users can edit/confirm before paraphrasing.

### Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

If you see CORS errors in browser console (example: "Access-Control-Allow-Origin missing"):

1. Set `ALLOWED_ORIGINS` in `backend/.env` to include your frontend URL.
2. Restart backend after changing env.
3. Verify with:

```bash
curl -i -X OPTIONS http://localhost:8000/api/extract \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: POST"
```

Response must include `Access-Control-Allow-Origin`.

### Backend status modes

Set in `backend/.env`:

```env
BACKEND_MODE=active
```

Options:
- `active`: normal service
- `construction`: reports service as under construction

Header status dot meaning:
- Green blinking: active
- Red: not working
- Amber: currently under construction

### Optional Supabase auth + logging on backend

In `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-or-publishable-key
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

- Backend now logs extraction metadata to Supabase without requiring authentication.
- For unauthenticated logging, apply the included `anon` insert policy migration.

Apply migration:

```bash
supabase db push
```

### Frontend env

Add this to your `.env` file:

```env
VITE_EXTRACTION_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
VITE_FRONTEND_PORT=8080
```

`npm run dev` now uses `VITE_FRONTEND_PORT` with strict binding (`strictPort: true`).
If the port is in use, Vite will fail instead of switching to another port.

### API contract

- `POST /api/extract` (multipart/form-data)
  - `file` (required)
  - `retry_mode` (`balanced`, `fast`, `deep`)
  - `error_reason` (optional)
  - `previous_method` (optional)

- `GET /api/health`

<!-- If you encounter issues with PDF parsing:
- Ensure your PDF contains actual text (not scanned images)
- Try converting to DOCX format for better compatibility
- Check [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for future Supabase integration instructions -->

### Quick Start

```bash
# Install and run
npm install && npm run dev

# Run tests to verify
npm run test:splitter

# Build for production
npm run build
```

## 📖 Usage

### Basic Workflow

1. **Input Stage**
   - Upload a document (TXT, DOCX, or PDF)
   - Or paste text directly into the textarea
   - Click "Start Paraphrasing"

2. **Editing Stage**
   - View one sentence at a time with context
   - Edit in the provided textarea
   - Use "Previous" and "Next" buttons to navigate
   - Progress bar shows your completion status
   - Click "Complete" on the last sentence

3. **Output Stage**
   - Review your complete edited text
   - Export as TXT, DOCX, or Markdown
   - Copy to clipboard
   - Start over with new text

### Sentence Splitting Intelligence

ParaWrite uses advanced pattern recognition to handle complex text:

#### Supported Edge Cases

| Case | Example | Handling |
|------|---------|----------|
| **Abbreviations** | `Dr. Smith`, `e.g.`, `etc.`, `i.e.` | Recognized and kept intact |
| **Acronyms** | `U.S.A.`, `Ph.D.` | Multi-dot patterns preserved |
| **Initials** | `John A. Smith` | Single initials in names handled |
| **Decimals** | `3.14`, `$1,234.56` | Numeric patterns protected |
| **Company Suffixes** | `Inc.`, `Corp.`, `Ltd.` | Business entity recognition |
| **Mixed Punctuation** | `?!`, `!?`, `...` | Combined as single boundary |
| **Quotes** | `"Hello."`, `'Yes!'` | Trailing quotes included |
| **Brackets** | `(example).`, `[note].` | Closing brackets with period |
| **Academic** | `et al.`, `cf.`, `ibid.` | Scholarly abbreviations |
| **Legal** | `v.`, `No.`, `§ 12.5` | Legal citation handling |
| **Ellipses** | `Wait...`, `And so...` | Preserved as dramatic pauses |
| **Dialogue** | `she said.`, `he asked,` | Lowercase starters allowed |

#### Splitting Modes

**Strict Mode**
- Most conservative splitting
- Prioritizes accuracy over sentence count
- Best for legal, academic, and formal documents
- Requires strong evidence for sentence boundaries

**Balanced Mode** (Default)
- Balanced approach between strictness and splitting
- Best for general content and most use cases
- Good mix of accuracy and readability

**Loose Mode**
- More aggressive splitting
- Prioritizes smaller, manageable sentences
- Best for creative writing and casual content
- Easier to work with for extensive rewrites

#### Domain Profiles

**Academic Profile**
- Recognizes: `et al.`, `cf.`, `ibid.`, `op. cit.`, `Ph.D.`, `M.A.`, `B.Sc.`
- Handles citations and Latin phrases
- Preserves scholarly conventions

**Legal Profile**
- Recognizes: `v.`, `vs.`, `No.`, `Inc.`, `Corp.`, `Ltd.`, `LLC`
- Handles case citations and section references
- Preserves legal entity names

**Technical Profile**
- Recognizes: `v1.0`, `API`, `URL`, file extensions
- Handles version numbers and technical abbreviations
- Preserves code references

**Medical Profile**
- Recognizes: `Dr.`, `MD`, `mg`, `ml`, vital signs
- Handles dosages and medical abbreviations
- Preserves clinical notation

## 🏗️ Tech Stack

### Frontend
- **React 18.3** - Modern UI library with hooks
- **TypeScript** - Type safety and better developer experience
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible component primitives

### Key Libraries
- **React Router** - Client-side routing
- **TanStack Query** - Powerful data fetching and caching
- **Lucide React** - Beautiful, consistent icon library
- **Mammoth.js** - DOCX file parsing
- **pdf-parse** - Client-side PDF text extraction
- **docx** - DOCX file generation for exports
- **Supabase** - Backend infrastructure (planned for future enhancements)

### Performance Optimizations
- **Web Workers** - Background processing for large documents
- **Code Splitting** - Lazy loading for faster initial loads
- **Memoization** - Optimized re-renders with React hooks
- **localStorage** - Efficient local data persistence

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run build:dev       # Build for development
npm run preview         # Preview production build

# Quality Assurance
npm run lint            # Run ESLint
npm run test:splitter   # Run sentence splitting tests

# Deployment
npm run build           # Production build ready for hosting
```

### Project Structure

```
ParaWrite/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui base components (40+)
│   │   ├── FileUpload.tsx  # File upload with drag-and-drop
│   │   ├── TextInput.tsx   # Text input textarea
│   │   ├── ParaphrasingScreen.tsx  # Main editing interface
│   │   ├── FinalOutput.tsx # Output and export screen
│   │   ├── VersionHistory.tsx      # Version changelog
│   │   ├── UseCases.tsx    # Real-world examples
│   │   └── About.tsx       # Developer info
│   ├── data/               # Static data
│   │   ├── versionHistory.ts  # Complete changelog
│   │   └── useCases.ts     # 12+ use case examples
│   ├── hooks/              # Custom React hooks
│   │   ├── use-toast.ts    # Toast notifications
│   │   ├── use-mobile.tsx  # Mobile detection
│   │   └── use-splitter-worker.ts  # Web Worker integration
│   ├── workers/            # Background processing
│   │   └── splitter.worker.ts  # Sentence splitting worker
│   ├── types/              # TypeScript definitions
│   │   └── sentence.ts     # Sentence and context types
│   ├── utils/              # Utility functions
│   │   ├── textProcessing.ts    # Core splitting engine
│   │   ├── splitterConfig.ts    # Modes & profiles
│   │   ├── contextAnalysis.ts   # Term tracking
│   │   ├── exportUtils.ts       # Multi-format exports
│   │   ├── sessionStorage.ts    # Auto-save system
│   │   ├── readability.ts       # Text metrics
│   │   ├── testFixtures.ts      # Test cases
│   │   └── testRunner.ts        # Test execution
│   ├── integrations/       # External services
│   │   └── supabase/       # Supabase client
│   ├── lib/               # Shared libraries
│   │   └── utils.ts       # Helper functions
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Main application
│   │   └── NotFound.tsx   # 404 page
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── tailwind.config.ts    # Tailwind CSS configuration
```

## 🧪 Testing

### Running Tests

```bash
npm run test:splitter
```

### Expected Results
```
✅ 18/18 tests passing
✅ 100% pass rate
⚡ ~88,000 sentences/second
✅ 100% determinism (consistent results)
```

### Test Coverage

The test suite validates:
1. Basic sentence splitting (simple periods)
2. Abbreviations (Dr., Mr., Mrs., Ms.)
3. Extended abbreviations (e.g., i.e., etc.)
4. Academic abbreviations (Ph.D., et al.)
5. Acronyms with periods (U.S.A., U.K.)
6. Company suffixes (Inc., Corp., Ltd.)
7. Single initials (John A. Smith)
8. Multiple initials (J.R.R. Tolkien)
9. Decimal numbers (3.14, 12.5)
10. Mixed punctuation (?!, !?)
11. Ellipses (...)
12. Quotes after periods ("Hello.")
13. Brackets after periods (text).
14. Lowercase sentence starters (dialogue)
15. Multiple sentences in paragraph
16. Academic citations
17. Legal document formatting
18. Technical documentation

### Performance Benchmarks

Tested with 30,000-sentence document:
- **Processing Time**: <1 second
- **UI Responsiveness**: No freezing or lag
- **Memory Usage**: Optimized and stable
- **Accuracy**: 100% on test suite

## 🌟 Use Cases

ParaWrite excels in these scenarios:

### Academic Writing
- **Problem**: Papers contain complex abbreviations (et al., i.e., Ph.D.) that split incorrectly
- **Solution**: Academic domain profile recognizes 50+ scholarly abbreviations
- **Result**: Perfect sentence boundaries for citations and formal writing

### Legal Documents
- **Problem**: Case citations (Smith v. Jones, Inc.) and section references split incorrectly
- **Solution**: Legal domain mode handles specialized legal abbreviations
- **Result**: Accurate splitting for contracts, briefs, and legal documents

### Technical Documentation
- **Problem**: Version numbers (v2.5.1), file paths, and decimals trigger false splits
- **Solution**: Technical mode preserves numeric patterns and technical notation
- **Result**: Clean splitting for API docs, tutorials, and technical content

### Medical Records
- **Problem**: Dosages (2.5 mg), vital signs (98.6°F), and medical abbreviations split incorrectly
- **Solution**: Medical profile recognizes clinical abbreviations and measurements
- **Result**: Accurate transcription and editing of medical documents

### Content Marketing
- **Problem**: Need specific reading levels but manual assessment is difficult
- **Solution**: Built-in readability metrics provide instant feedback
- **Result**: Optimize content for target audience with data-driven editing

### Large Documents
- **Problem**: Processing 10,000+ sentences freezes the browser
- **Solution**: Web Worker background processing handles massive files
- **Result**: Smooth editing experience even with lengthy documents

### Crash Recovery
- **Problem**: Browser crashes lose hours of editing work
- **Solution**: Auto-save every 30 seconds with instant recovery
- **Result**: Never lose work, even during unexpected closures

### Multi-Language Content
- **Problem**: Acronyms (U.S.A.), initials (John A. Smith), and mixed punctuation create ambiguity
- **Solution**: Pattern recognition distinguishes mid-word from sentence-ending periods
- **Result**: Accurate splitting for international content

## 📊 Version History

### v2.0.0 - Enterprise-Grade Enhancement (January 2026)
**Major overhaul with professional features and production-ready architecture**

**New Features:**
- Configurable sentence splitting engine (strict, balanced, loose modes)
- Domain-aware abbreviation profiles (academic, legal, technical, medical)
- Comprehensive edge case handling (15+ patterns)
- Web Worker implementation for background processing
- Multi-format export system (TXT, DOCX, Markdown)
- Auto-save with crash recovery (30-second intervals)
- Non-destructive editing with full history
- Context awareness (term tracking, consistency warnings)
- Readability metrics (Flesch Reading Ease, Grade Level)
- Comprehensive test suite (18 tests, 100% pass rate)

**Performance:**
- 88,156 sentences/second
- Handles 30,000+ sentences without UI freeze
- Optimized for large documents

**Quality Metrics:**
- Test Pass Rate: 100%
- Edge Cases Handled: 15+
- Export Formats: 3

### v1.5.0 - Advanced Splitting Logic (January 2026)
**Enhanced sentence splitting for complex edge cases**

- Multi-dot abbreviation handling (e.g., i.e., etc.)
- Acronym detection with context awareness
- Company suffix recognition (Inc., Corp., Ltd.)
- Single initial handling (John A. Smith)
- Decimal number preservation
- Multi-punctuation support (?!, ...)
- Quote and bracket awareness

### v1.0.0 - Initial Release (December 2025)
**First public release**

- Basic sentence splitting
- Sentence-by-sentence editing interface
- File upload support (TXT, DOCX, PDF)
- Text input via textarea
- Simple text output
- Real-time preview



## 🎯 Project Status

**Current Version:** 2.0.0 (Production Ready ✅)

### Completed Features
- ✅ Core text processing engine
- ✅ Intelligent sentence splitting (3 modes, 4 domain profiles)
- ✅ Professional export options (TXT, DOCX, Markdown)
- ✅ Auto-save and crash recovery
- ✅ Readability metrics and text analysis
- ✅ Web Worker performance optimization
- ✅ Comprehensive testing (18 tests, 100% pass rate)
- ✅ Complete documentation and transparency
- ✅ Tabbed UI with version history and use cases

### Quality Metrics
- **Test Pass Rate**: 100% (18/18 tests)
- **Performance**: 88,156 sentences/second
- **Edge Cases**: 15+ patterns handled
- **Export Formats**: 3 (TXT, DOCX, Markdown)
- **Auto-save Interval**: 30 seconds
- **Use Cases Documented**: 12+
- **Splitting Modes**: 3 (Strict, Balanced, Loose)
- **Domain Profiles**: 4 (Academic, Legal, Technical, Medical)

### Roadmap

**v2.5.0 - Enhanced UX (Planned)**
- Focus mode for distraction-free editing
- Keyboard shortcuts for power users
- Inline diff view for changes
- Drag-and-drop sentence reordering
- Custom themes and appearance settings
- Advanced accessibility improvements

**v3.0.0 - SaaS Architecture (Planned)**
- User authentication (Supabase Auth)
- Cloud storage for documents
- Team collaboration features
- Real-time multi-user editing
- Subscription-based billing
- API access for integrations
- Advanced analytics dashboard
- Custom vocabulary and style guides

## 🤝 Contributing

Contributions are welcome! Whether you're fixing bugs, adding features, improving documentation, or spreading the word, your help is appreciated.

### How to Contribute

1. **Report Bugs**
   - Check if the bug is already reported in Issues
   - Provide clear reproduction steps
   - Include screenshots if applicable
   - Mention your browser and OS

2. **Request Features**
   - Describe the feature and its benefits
   - Explain your use case
   - Suggest implementation approach if possible

3. **Submit Code**
   ```bash
   # Fork and clone
   git clone https://github.com/YOUR_USERNAME/ParaWrite.git
   cd ParaWrite
   
   # Create feature branch
   git checkout -b feature/amazing-feature
   
   # Make changes and test
   npm install
   npm run test:splitter
   npm run dev
   
   # Commit and push
   git commit -m 'Add amazing feature'
   git push origin feature/amazing-feature
   
   # Open Pull Request on GitHub
   ```

4. **Improve Documentation**
   - Fix typos and unclear explanations
   - Add examples and use cases
   - Create tutorials or guides

5. **Spread the Word**
   - Star ⭐ the repository
   - Share with colleagues and friends
   - Write blog posts or tutorials
   - Tweet about ParaWrite

### Development Guidelines

- Follow TypeScript best practices
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Keep changes focused (one feature per PR)
- Ensure all tests pass before submitting

### Code Standards

- Use TypeScript with strict mode
- Follow existing code style
- Document complex functions with JSDoc
- Avoid `any` types when possible
- Use functional components with hooks
- Keep components focused and reusable

## 📝 License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software with proper attribution.

**MIT License Summary:**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ Liability and warranty not provided
- ℹ️ License and copyright notice required

See the [LICENSE](LICENSE) file for full details.

## 👨‍💻 Developer

**Udara Nalawansa**  
Full-Stack Developer & Creator of ParaWrite

### Connect
- 🐙 **GitHub**: [@udaraKavishka](https://github.com/udaraKavishka)
- 📧 **Email**: hello@udaradev.me
- 🌐 **Project**: [ParaWrite Repository](https://github.com/udaraKavishka/ParaWrite)

### About
Passionate about building tools that enhance productivity and improve workflows. Focused on clean code, excellent UX, and solving real-world problems with technology.

## 📧 Contact & Support

### Get Help
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/udaraKavishka/ParaWrite/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/udaraKavishka/ParaWrite/discussions)
- 📧 **Direct Email**: hello@udaradev.me
- ⭐ **Support the Project**: Star the repo on GitHub

### Response Time
- Critical bugs: 24-48 hours
- Feature requests: 1-2 weeks
- General questions: 2-3 days
- Pull requests: 3-5 days

## 🙏 Acknowledgments

ParaWrite is built with amazing open-source technologies:

- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool
- **[React](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible primitives
- **[Lucide](https://lucide.dev/)** - Icon library
- **[Supabase](https://supabase.com/)** - Backend infrastructure

Special thanks to the open-source community for making projects like this possible.

---

<div align="center">
  
  **ParaWrite v2.0.0**
  
  Made with ❤️ for the writing community
  
  [⭐ Star on GitHub](https://github.com/udaraKavishka/ParaWrite/) • [🐛 Report Bug](https://github.com/udaraKavishka/ParaWrite/issues) • [💡 Request Feature](https://github.com/udaraKavishka/ParaWrite/issues)
  
  © 2025-2026 Udara Nalawansa • MIT License
  
</div>
