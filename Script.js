document.addEventListener("DOMContentLoaded", () => {

  const boxes = document.querySelectorAll(`links, .icons, .navbar, .text, .services, .about h1, h2, p, .experience, .projects, .tick, text2 p, .quote, .insideproj .testimonials, .foota,
    .world1, .best, .logs,  .men, .for, .for1, .round, .serv, .foota a, .constr, .zin, .space, .three1, .three2, .footcont, .quote input, .slider `);

  // Only 3 directions: up, left, right. Cycles 1,2,3,1,2,3...
  const directions = ['reveal-up', 'reveal-left', 'reveal-right', 'reveal-left', 'reveal-right'];
  
  boxes.forEach((box, i) => {
    box.classList.add('reveal-box');
    box.classList.add(directions[i % directions.length]); // cycle through 3
    box.style.transitionDelay = `${(i % 6.2) * 80}ms`; // stagger
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -60px 0px"
  });

  boxes.forEach(box => observer.observe(box));
});



  const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active'); // for the X animation
});

// Close menu when you tap a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  });
});



// @ts-nocheck
const slidesTrack = document.getElementById('slides');
const allSlides = document.querySelectorAll('.slide');
const dotsBox = document.getElementById('dots');

let currentIndex = 0;
const totalSlides = allSlides.length;

// Create dots
for (let i = 0; i < totalSlides; i++) {
  let dot = document.createElement('span');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', function() {
    currentIndex = i;
    showSlide();
  });
  dotsBox.appendChild(dot);
}

const allDots = document.querySelectorAll('.dot');

function showSlide() {
  slidesTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

  allDots.forEach(function(item) {
    item.classList.remove('active');
  });
  allDots[currentIndex].classList.add('active');
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  showSlide();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  showSlide();
}

// Auto slide
let autoPlay = setInterval(nextSlide, 3000);

// Swipe for mobile
let startX = 0;
slidesTrack.addEventListener('touchstart', function(e) {
  startX = e.touches[0].clientX;
  clearInterval(autoPlay);
}, {passive: true});

slidesTrack.addEventListener('touchend', function(e) {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) nextSlide();
  if (endX - startX > 50) prevSlide();
  autoPlay = setInterval(nextSlide, 3000);
});





// ==== PASTE YOUR 2 FREE KEYS HERE ====
const GROQ_API_KEY = "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"; // from console.groq.com/keys
const GEMINI_API_KEY = "AQ.Ab8RN6KF8kkoxX60iZnGh-WgPgozYYilMzuzEDPpOFd_1NVv5Q"; // from aistudio.google.com/app/apikey

const chatBtn = document.getElementById('chatBtn');
const chatBox = document.getElementById('chatBox');
const closeBtn = document.getElementById('closeBtn');
const msgs = document.getElementById('msgs');
const inp = document.getElementById('inp');
const sendBtn = document.getElementById('sendBtn');

chatBtn.onclick = () => {
    chatBox.classList.add('open');
    chatBtn.style.transform = 'scale(0)';
    inp.focus();
};
closeBtn.onclick = () => {
    chatBox.classList.remove('open');
    chatBtn.style.transform = 'scale(1)';
};

function addMsg(text, who) {
    const div = document.createElement('div');
    div.className = `msg ${who}`;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
}
function showTyping() {
    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.id = 'typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}
function removeTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }

// GROQ - Try first
async function askGroq(query) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a helpful AI assistant. Reply directly pertaining to the user's query." },
                { role: "user", content: query }
            ],
            max_tokens: 800
        })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
}

// GEMINI - Fallback
async function askGemini(query) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: query }] }] })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
}

// BOSS LOGIC: Try Groq, if fail try Gemini
async function askAI(query) {
    try {
        if (!GROQ_API_KEY.includes("PASTE")) {
            return await askGroq(query);
        }
        throw new Error("Groq key not set");
    } catch (groqError) {
        console.log("Groq failed:", groqError.message, " -> Trying Gemini...");
        try {
            if (!GEMINI_API_KEY.includes("PASTE")) {
                return await askGemini(query);
            }
            throw new Error("No API keys set");
        } catch (geminiError) {
            throw new Error("Both AIs busy. Try again in 2 seconds. (" + geminiError.message + ")");
        }
    }
}

async function handleSend() {
    const question = inp.value.trim();
    if (!question) return;
    if (GROQ_API_KEY.includes("PASTE") && GEMINI_API_KEY.includes("PASTE")) {
        addMsg("⚠️ Boss, paste at least 1 key in script.js\nGroq: console.groq.com/keys\nGemini: aistudio.google.com/app/apikey", "bot");
        return;
    }
    addMsg(question, "user");
    inp.value = "";
    showTyping();
    try {
        const answer = await askAI(question);
        removeTyping();
        typeWriterEffect(answer);
    } catch (err) {
        removeTyping();
        addMsg(err.message, "bot");
    }
}

function typeWriterEffect(text) {
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.textContent = '';
    msgs.appendChild(div);
    let i = 0;
    function type() {
        if (i < text.length) {
            div.textContent += text.charAt(i);
            i++;
            msgs.scrollTop = msgs.scrollHeight;
            setTimeout(type, 8);
        }
    }
    type();
}

sendBtn.onclick = handleSend;
inp.addEventListener("keydown", (e) => { if (e.key === "Enter") handleSend(); });