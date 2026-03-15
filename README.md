# 🎀 Tic Tac Toe – Kawaii Edition

A cute, interactive Tic Tac Toe game featuring Hello Kitty and Cinnamoroll with smooth animations, sound effects, and a delightful claymorphism design aesthetic.

## Features

✨ **Character-Based Gameplay** – Play as Hello Kitty (✕) vs Cinnamoroll (○)  
🎨 **Cute Claymorphism Design** – Soft shadows, gradients, and smooth animations  
🔊 **Web Audio Synth** – Dynamic sound effects for moves, wins, and draws  
🎉 **Confetti Celebration** – Colorful particle effects on victory  
📱 **Fully Responsive** – Optimized for mobile, tablet, and desktop  
♿ **Accessible** – ARIA labels and semantic HTML for screen readers  
⚡ **No Build Required** – Single HTML file with inline styles and scripts

## Tech Stack

- **HTML5** – Semantic markup with ARIA attributes
- **CSS3** – CSS Grid, Flexbox, Gradients, Animations
- **Vanilla JavaScript** – Web Audio API, Canvas for confetti
- **Assets** – PNG character images (hello_kitty_character.png, cinnamoroll_player.png)

## Getting Started

### Local Development

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. No build step or dependencies required!

### File Structure

```
sanrio-tic-tac-toe/
├── index.html              # Main game (HTML + CSS + JS)
├── style.css               # External styles (optional)
├── assets/
│   ├── hello_kitty_character.png
│   └── cinnamoroll_player.png
└── README.md
```

## How to Play

1. Click **"New Game"** to start
2. **Hello Kitty** goes first (✕)
3. Take turns clicking cells to place your marker
4. Get three markers in a row (horizontal, vertical, or diagonal) to win!
5. Click **"Restart"** to play again

## Browser Support

- ✅ Chrome/Chromium 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

## Deployment

This is a static site and can be deployed anywhere:

### Quick Options

- **Netlify**: Drag & drop the folder → instant deployment
- **Vercel**: Push to GitHub, auto-deploy with git
- **GitHub Pages**: Push to repo, enable Pages in settings
- **Traditional Hosting**: Upload files via FTP/SFTP

### Recommended Setup for GitHub Pages

```bash
# If not already a repo:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sanrio-tic-tac-toe
git push -u origin main
```

Then enable GitHub Pages in repository settings → Pages → Source: main branch.

## Optimization Tips for Production

- Image compression: Use tools like TinyPNG to optimize PNG assets
- Asset hashing: Consider renaming assets with hash suffixes for cache busting
- Minification: Optionally minify inline CSS and JS for smaller file size
- CDN: Host on a CDN for faster global delivery (Cloudflare, AWS CloudFront)

## Sound and Motion Notes

- Web Audio API is used for sound synthesis (no audio files)
- Confetti animation uses Canvas API
- All animations use CSS/CSS-in-JS for performance
- Respects `prefers-reduced-motion` can be added on request

## License

This project is open source. Feel free to use, modify, and share!

## Credits

🎀 Inspired by Sanrio characters: Hello Kitty & Cinnamoroll  
✨ Design: Kawaii, soft, and delightful