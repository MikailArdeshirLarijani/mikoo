<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=24,12,3&height=190&section=header&text=mikoO%20AI%20Studio&fontSize=54&fontColor=ffffff&animation=twinkling&fontAlignY=38&desc=Next-Gen%20AI%20Desktop%20Command%20Center&descAlignY=58&descSize=16" width="100%"/>

[![Version](https://img.shields.io/badge/version-2.0.0-ec4899?style=for-the-badge)](https://github.com/MikailArdeshirLarijani/mikoo)
[![Platform](https://img.shields.io/badge/platform-Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)](https://github.com/MikailArdeshirLarijani/mikoo/releases)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![Built with](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://github.com/MikailArdeshirLarijani/mikoo)
[![Electron](https://img.shields.io/badge/Electron_44-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://github.com/MikailArdeshirLarijani/mikoo)

</div>

---

## 🌟 Overview

**mikoO AI Studio** is a unified, high-performance desktop client engineered for seamless interaction with world-class artificial intelligence models. Designed from the ground up using **Electron 44**, **React 19**, and **TypeScript**, it provides an unprecedented desktop workflow for creators, programmers, and AI enthusiasts.

> *A developer-centric AI workstation featuring live multi-model switching, generative image pipelines, speech recognition, and a runtime 30-parameter custom CSS personalization engine.*

---

## ⚡ Key Features

### 🧠 Advanced AI Multi-Model Hub
* **Instant Model Switching**: Seamlessly toggle between OpenAI **GPT-4o**, **GPT-4o Mini**, Anthropic **Claude 3.5 Sonnet**, and **Claude 3 Haiku** mid-session.
* **Integrated DALL-E 3 Generation**: Directly invoke image synthesis using the `/image [prompt]` inline command.
* **Granular Temperature Control**: Adjust sampling temperature dynamically from strictly factual (`0.0`) to highly creative (`2.0`).
* **Custom System Prompts**: Define custom personas and behavioral guidelines per session.

### 💬 Modern Interactive Workspace
* **In-Place Message Editing**: Edit and revise previously sent queries on the fly.
* **Regenerate & Branching**: Re-run AI generations with one click to explore alternate solutions.
* **Pinned Discussions**: Pin mission-critical chats to the top of your sidebar.
* **File Upload & Code Ingestion**: Read source code and text files directly into the active prompt context.
* **Voice Dictation**: Built-in speech-to-text recognition supporting both English and Persian input.
* **Live Token Estimator**: Real-time token usage counter displayed right under the composer.
* **Interrupt Stream**: Abort long generations instantly using the native `AbortController` stop trigger.
* **Export Sessions**: Export entire chat histories with formatted timestamps to plain text (`.txt`).

### 🎨 Personalization (30+ Live CSS Settings)
* **6 Theme Accent Colors**: Vibrant palettes (Blue, Purple, Emerald, Rose, Amber, Cyan).
* **Adaptive Typography**: Choose from System UI, Inter, Roboto, or monospace code typography.
* **Glassmorphism & Frosted Blur**: Optional acrylic backdrop effects on headers and sidebars.
* **Background Textures**: Switch between Minimal Solid, Dotted Matrix, and Blueprint Grid canvas layouts.
* **Syntax Highlighting**: Dark, Matrix Green, and Hacker Red code block aesthetics with quick copy actions.
* **Layout Geometry**: Customize border radiuses, chat widths, and docked vs. floating composer bubbles.

---

## 🛠️ Architecture & Tech Stack

| Domain | Technology | Details |
| :--- | :--- | :--- |
| **Desktop Runtime** | Electron 44 | Secure IPC architecture & cross-process bridge |
| **UI Framework** | React 19 | Fast virtual DOM reconciliation & modern hooks |
| **Language** | TypeScript | Strictly typed enterprise codebase |
| **Styling Engine** | TailwindCSS + Dynamic CSS | Zero-latency runtime theme injection |
| **State Management** | Zustand | Optimized store with local persistence |
| **Markdown & Code** | react-markdown + Prism | GFM compliant parser with syntax highlighting |
| **Bundler** | Vite 8 | Near-instant HMR & minified release artifacts |

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) `>= 18.x`
* [npm](https://www.npmjs.com/) or `yarn`

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/MikailArdeshirLarijani/mikoo.git

# Enter project directory
cd mikoo

# Install dependencies
npm install

# Start in development mode
npm run dev

# Package native Windows executable
npm run build:electron
```

### Configuration
1. Launch **mikoO AI Studio**.
2. Navigate to **Settings** → **API & Config**.
3. Supply your **OpenAI API Key** or **Anthropic API Key** (keys are kept securely on your local machine only).
4. Start exploring!

---

## 👤 Author

**Mikail Ardeshir** — High School Science Student, Full-Stack Web Builder & AI Enthusiast

* Telegram: [@MKL_AR](https://t.me/MKL_AR)
* Email: [mikailardeshir@gmail.com](mailto:mikailardeshir@gmail.com)
* GitHub: [@MikailArdeshirLarijani](https://github.com/MikailArdeshirLarijani)

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=24,12,3&height=90&section=footer" width="100%"/>

</div>