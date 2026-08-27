# 🎬 Clip Creator Studio

A high-performance video clip creation platform designed to create 50+ video clips per day with ease.

## Features

✨ **Key Capabilities**
- 🚀 Create up to 50+ clips per day
- 📱 Beautiful, intuitive UI
- 🎥 Drag-and-drop video upload
- ✂️ Precise clip trimming with timeline controls
- 🖼️ Automatic thumbnail generation
- 💾 Cloud storage support
- 📊 Clip management dashboard
- ⚡ Lightning-fast processing with FFmpeg
- 📥 One-click download

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS for styling
- Zustand for state management
- React Hot Toast for notifications
- Vite for fast development

**Backend:**
- Node.js + Express
- TypeScript
- SQLite database
- FFmpeg for video processing
- Multer for file uploads

## Installation

### Prerequisites
- Node.js 16+
- FFmpeg installed on your system
  - **macOS:** `brew install ffmpeg`
  - **Ubuntu:** `sudo apt-get install ffmpeg`
  - **Windows:** Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/joshimadhav892-byte/clip-creator-studio.git
   cd clip-creator-studio
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Start the development servers**
   
   Terminal 1 - Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## Usage

### Creating a Clip

1. Click **"Create New Clip"** button
2. **Upload a video** by dragging and dropping or clicking to select
3. **Set the title** for your clip
4. **Adjust start and end times** using the timeline controls
5. Click **"Create Clip"** to process
6. Wait for processing to complete (usually 5-30 seconds)
7. Download or share your clip!

### Managing Clips

- View all your clips in the **Dashboard**
- **Download** any clip with one click
- **Delete** clips to free up space
- Track clip **processing status**

## API Endpoints

### GET `/api/clips`
Fetch all clips

### POST `/api/upload`
Upload a video file
- Body: `FormData` with `video` file
- Returns: `{ videoUrl, filename, size }`

### POST `/api/clips`
Create a new clip
- Body: `{ title, videoUrl, duration, startTime, endTime }`
- Returns: Clip object

### DELETE `/api/clips/:id`
Delete a clip by ID

### GET `/api/videos/:filename`
Stream video file with range support

## Performance Tips

💡 **For Creating 50+ Clips Per Day:**

1. **Batch Processing**: Upload multiple videos at once
2. **Template Clips**: Create similar clips with templates
3. **Keyboard Shortcuts**: Use keyboard for faster navigation
4. **Bulk Operations**: Select multiple clips for batch actions
5. **Auto-Save**: Clips are saved automatically

## Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe
MAX_FILE_SIZE=500000000
```

## Project Structure

```
clip-creator-studio/
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand store
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── server.ts         # Express server
│   ├── database.ts       # SQLite operations
│   ├── videoProcessor.ts # FFmpeg operations
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
├── README.md
└── LICENSE
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Install FFmpeg
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000 3000
CMD ["npm", "start"]
```

### Heroku

```bash
heroku create your-app-name
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
git push heroku main
```

## Troubleshooting

### FFmpeg not found
- Install FFmpeg on your system
- Set `FFMPEG_PATH` environment variable

### Videos not processing
- Check server logs for errors
- Ensure video format is supported (MP4, WebM, Ogg)
- Check available disk space

### Upload fails
- Ensure file size is under limit (default 500MB)
- Check CORS configuration
- Verify backend is running

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- 📧 Email: support@clipcreatdrstudio.com
- 🐛 GitHub Issues: [Report a bug](https://github.com/joshimadhav892-byte/clip-creator-studio/issues)
- 💬 Discussions: [Join our community](https://github.com/joshimadhav892-byte/clip-creator-studio/discussions)

---

**Made with ❤️ for content creators**
