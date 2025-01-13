import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import { writeFileSync } from 'fs';

interface Message {
    text: string;
    author: string;
    timestamp: string;
    profilePictureUrl: string;
}

class QuoteGenerator {
    private padding: number;
    private fontSize: number;
    private lineHeight: number;
    private profilePictureSize: number;

    constructor() {
        this.padding = 20;
        this.fontSize = 16;
        this.lineHeight = 24;
        this.profilePictureSize = 50;
    }

    private wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = context.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    public async generateQuoteImage(message: Message): Promise<Buffer> {
        const canvas = createCanvas(800, 600); // Temporary size, will be adjusted later
        const context = canvas.getContext('2d');

        // Load profile picture
        const profilePicture = await loadImage(message.profilePictureUrl);

        // Measure text
        context.font = `bold ${this.fontSize}px Arial`;
        const authorWidth = context.measureText(`~ ${message.author}`).width;
        context.font = `${this.fontSize}px Arial`;
        const lines = this.wrapText(context, message.text, 600 - this.padding - this.profilePictureSize - 20);
        const textHeight = lines.length * this.lineHeight;
        const timestampWidth = context.measureText(message.timestamp).width;

        // Calculate canvas size
        const canvasWidth = Math.max(600, this.padding + this.profilePictureSize + 20 + Math.max(authorWidth, timestampWidth));
        const canvasHeight = this.padding + this.profilePictureSize + textHeight + this.lineHeight;

        // Resize canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Background with rounded corners
        context.fillStyle = '#DCF8C6'; // WhatsApp message bubble color
        context.beginPath();
        context.moveTo(this.padding + this.profilePictureSize + 10, 0);
        context.arcTo(canvasWidth - this.padding, 0, canvasWidth - this.padding, canvasHeight, 20);
        context.arcTo(canvasWidth - this.padding, canvasHeight, this.padding + this.profilePictureSize + 10, canvasHeight, 20);
        context.arcTo(this.padding + this.profilePictureSize + 10, canvasHeight, this.padding + this.profilePictureSize + 10, 0, 20);
        context.arcTo(this.padding + this.profilePictureSize + 10, 0, canvasWidth - this.padding, 0, 20);
        context.closePath();
        context.fill();

        // Draw profile picture
        context.save();
        context.beginPath();
        context.arc(this.padding + this.profilePictureSize / 2, this.padding + this.profilePictureSize / 2, this.profilePictureSize / 2, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        context.drawImage(profilePicture, this.padding, this.padding, this.profilePictureSize, this.profilePictureSize);
        context.restore();

        // Author
        context.fillStyle = '#000000';
        context.font = `bold ${this.fontSize}px Arial`;
        context.fillText(`~ ${message.author}`, this.padding + this.profilePictureSize + 20, this.padding + this.fontSize);

        // Text
        context.font = `${this.fontSize}px Arial`;
        let y = this.padding + this.fontSize + this.lineHeight;
        lines.forEach(line => {
            context.fillText(line, this.padding + this.profilePictureSize + 20, y);
            y += this.lineHeight;
        });

        // Timestamp
        context.font = `${this.fontSize - 4}px Arial`;
        context.fillText(message.timestamp, canvasWidth - this.padding - timestampWidth, canvasHeight - this.padding);

        return canvas.toBuffer();
    }
}

export default QuoteGenerator;

(async () => {
    const qg = new QuoteGenerator();
    const buffer = await qg.generateQuoteImage({
        author: "kamuridesu",
        text: "Hello, world!",
        timestamp: "13:32",
        profilePictureUrl: "https://avatars.githubusercontent.com/u/27641366?v=4"
    });

    writeFileSync('quote.png', buffer);
})();