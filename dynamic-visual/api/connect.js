(function() {
  // Styles (Cyberpunk)
  const styles = `
    .cyberpunk-button {
      padding: 10px 20px;
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      background-color: #00ff00;
      border: 2px solid #00ff00;
      border-radius: 5px;
      box-shadow: 0 0 10px #00ff00, 0 0 20px #008000;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease-in-out;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      display: inline-block; /* Ensure it behaves like an inline element */
      font-family: 'Courier New', monospace;
    }

    .cyberpunk-button:hover {
      color: #000;
      background-color: #00ff00;
      box-shadow: 0 0 5px #00ff00, 0 0 25px #00ff00, 0 0 50px #00ff00;
      transform: translateY(-3px);
    }

    .cyberpunk-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #0f0, #0ff, #f0f, #ff0, #0f0);
      z-index: -1;
      background-size: 400%;
      border-radius: 5px;
      opacity: 0;
      transition: all 0.5s ease-in-out;
    }

    .cyberpunk-button:hover::before {
      opacity: 1;
      animation: glitch 5s linear infinite;
    }

    @keyframes glitch {
      0% {
        transform: translate(0);
      }
      20% {
        transform: translate(-2px, 2px);
      }
      40% {
        transform: translate(-2px, -2px);
      }
      60% {
        transform: translate(2px, 2px);
      }
      80% {
        transform: translate(2px, -2px);
      }
      100% {
        transform: translate(0);
      }
    }
  `;

  // Inject Styles
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);

  // Button Data
  const buttons = [
    {
      href: "http://www.linkedin.com/in/justinnl",
      text: "LinkedIn",
      target: "_blank"
    },
    {
      href: "https://portfolio-web-mu-ten.vercel.app/",
      text: "Website",
      target: "_blank"
    }
  ];

  // Glitch Text Function
  function glitchText(element) {
    const text = element.innerText;
    let glitching = false;

    element.addEventListener('mouseover', () => {
      if (glitching) return;

      glitching = true;
      let glitchInterval = setInterval(() => {
        let newText = '';
        for (let i = 0; i < text.length; i++) {
          const offset = Math.random() < 0.2 ? Math.floor(Math.random() * 6) - 3 : 0;
          newText += `<span style="position: relative; top: ${offset}px; left: ${offset}px;">${text[i]}</span>`;
        }
        element.innerHTML = newText;
      }, 100);

      setTimeout(() => {
        clearInterval(glitchInterval);
        element.innerHTML = text;
        glitching = false;
      }, 1000);
    });
  }

  // Create and Append Buttons
  function createButtons() {
    const container = document.createElement('div'); // Create a container for the buttons
    container.style.display = 'flex'; // Use flexbox for horizontal layout
    container.style.gap = '20px'; // Add some space between the buttons
    container.style.justifyContent = 'center'; // Center the buttons horizontally

    buttons.forEach(buttonData => {
      const button = document.createElement('a');
      button.href = buttonData.href;
      button.text = buttonData.text;
      button.className = "cyberpunk-button";
      button.target = buttonData.target;

      glitchText(button); // Apply glitch effect

      container.appendChild(button); // Append to the container
    });

    // Append the container to the body (or any desired element)
    document.body.appendChild(container);
  }

  // Run
  createButtons();
})();
