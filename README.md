# 🔮 Crystal Compatibility Checker

This is a web app I built that checks the compatibility between any two crystals using OpenAI’s API. The idea came from wanting to combine tech with emotional insight, and something that feels a little more personal than just numbers and data.

You just type in two crystal names, and it gives you:
- A compatibility score
- A short explanation
- Some ideas for how the pair might be used together

It even lets you download a little PDF of your result, for fun or sharing. You can also customize the crystals.json file to add any other crystals which you wish to be analyzed.

---

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **APIs**: OpenAI GPT-3.5 (text generation), DALL·E (image generation)
- **Other**: jsPDF for PDF downloads

---

## 💻 How to Run It

1. Clone the repo  
   `git clone https://github.com/ManasviBandi/crystal-compatibility-checker`

2. Install dependencies  
   `npm install`

3. Create a `.env` file and add your OpenAI key  
   `OPENAI_API_KEY=your-api-key-here`

4. Run the server  
   `node server.js`

5. Open your browser at  
   `http://localhost:3000`

---
## 📁 What's Inside

- `server.js` – backend logic and OpenAI API calls  
- `.env.example` – environment variable template  
- `public/` – all frontend files:
  - `index.html` – main UI
  - `style.css` – styling
  - `script.js` – frontend logic
  - `crystals.json` – crystal data

---

## ✨ Why I Made This

I built this during an internship to explore how AI could be used in more intuitive or emotional spaces, and not just for productivity tools or chatbots. I really enjoyed mixing creative design with backend development and learning how to structure AI prompts in a way that feels conversational but consistent.

---

## 🙋‍♀️ About Me

Hi! I’m Manasvi Bandi — a Software Engineering student at McMaster University who’s passionate about building tools that actually help people (or at least make them smile). Feel free to reach out or check out more of my work!

[LinkedIn](https://www.linkedin.com/in/manasvi-bandi-aab104285/) • [GitHub](https://github.com/ManasviBandi)
