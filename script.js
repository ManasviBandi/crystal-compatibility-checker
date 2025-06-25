let crystalData = {};
let latestResultText = "";

function fetchCrystalImage(prompt) {
  fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  .then(res => res.json())
  .then(data => {
    const resultImage = document.getElementById('compatibility-image');
    resultImage.src = data.url;
    resultImage.style.display = 'block';
    resultImage.classList.add('show');
  })
  .catch(err => {
    console.error('Image generation failed:', err);
  });
}

// Fetch crystal data
fetch('crystals.json')
  .then(response => response.json())
  .then(data => {
    crystalData = data;
    setupAutocomplete('crystal1', 'suggestions1');
    setupAutocomplete('crystal2', 'suggestions2');
  })
  .catch(error => console.error('Failed to load crystal data:', error));

// Autocomplete function
function setupAutocomplete(inputId, suggestionBoxId) {
  const input = document.getElementById(inputId);
  const suggestionBox = document.getElementById(suggestionBoxId);

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    suggestionBox.innerHTML = '';

    if (query.length === 0) return;

    const matches = Object.keys(crystalData).filter(name =>
      name.toLowerCase().includes(query)
    );

    matches.forEach(match => {
      const div = document.createElement('div');
      div.textContent = match;
      div.classList.add('suggestion-item');
      div.addEventListener('click', () => {
        input.value = match;
        suggestionBox.innerHTML = '';
      });
      suggestionBox.appendChild(div);
    });
  });
}

// Handle compatibility check with spinner
document.querySelector('.compatibility-button').addEventListener('click', () => {
  const crystal1 = document.getElementById('crystal1').value.trim();
  const crystal2 = document.getElementById('crystal2').value.trim();
  const spinner = document.getElementById('loading-spinner');

  if (!crystal1 || !crystal2) {
    displayResult("Please enter both crystal names.", "fail");
    return;
  }

  if (!crystalData[crystal1] || !crystalData[crystal2]) {
    displayResult("One or both crystals are not recognized. Please check the spelling.", "fail");
    return;
  }

  const properties1 = crystalData[crystal1].properties;
  const properties2 = crystalData[crystal2].properties;

  // Show spinner
  spinner.style.display = 'block';

  fetch('/api/compatibility', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crystal1, crystal2, properties1, properties2 })
  })
  .then(response => response.json())
  .then(data => {
    spinner.style.display = 'none';

    let { compatibilityScore, reason, bestUses } = data;

    // Fallback if AI returns "compatibility" instead of a score
    if (!compatibilityScore && data.compatibility) {
      const label = data.compatibility.toLowerCase();
      compatibilityScore = label === 'high' ? 85 : label === 'medium' ? 60 : 30;
    }

    if (compatibilityScore === undefined || !reason || !bestUses) {
      throw new Error("Invalid AI response structure");
    }

    // Emoji based on score
    const emoji = compatibilityScore >= 80 ? "💚" :
                  compatibilityScore >= 50 ? "💫" :
                  "⚠️";

    const message = 
      <div class="compatibility-score">${emoji} 0% Compatibility</div>
      <div class="compatibility-bar">
        <div class="compatibility-fill" data-score="${compatibilityScore}"></div>
      </div>
      <div class="result-info">
        <p><span class="label">Reason:</span> ${reason}</p>
        <p><span class="label">Best Uses:</span> ${bestUses.join(", ")}</p>
      </div>
    ;

    // Determine glow class based on score
    let scoreClass = "low";
    if (compatibilityScore >= 70) scoreClass = "high";
    else if (compatibilityScore >= 40) scoreClass = "medium";

    displayResult(message, scoreClass);
    animateScore(compatibilityScore, emoji);
  })
  .catch(error => {
    console.error('Error with the compatibility check:', error);
    spinner.style.display = 'none';
    displayResult("An error occurred while checking compatibility.", "fail");
  });
});

// Display result on UI
function displayResult(message, score) {
  const resultContainer = document.getElementById('result-container');
  const resultText = document.getElementById('compatibility-result');
  const resultImage = document.getElementById('compatibility-image');

  resultText.innerHTML = message;
  latestResultText = resultText.innerText;

  resultContainer.classList.remove('compatibility-success', 'compatibility-warning', 'compatibility-fail');
  resultContainer.classList.remove('energy-glow-high', 'energy-glow-medium', 'energy-glow-low');
  document.body.classList.remove('energy-glow-high', 'energy-glow-medium', 'energy-glow-low');

  if (score === "high") {
    resultContainer.classList.add("compatibility-success", "energy-glow-high");
    document.body.classList.add('energy-glow-high');
    resultText.style.color = '#94fba3';
    resultImage.src = 'high-compatability.png';
    resultImage.style.display = 'block';
  } else if (score === "medium") {
    resultContainer.classList.add("compatibility-warning", "energy-glow-medium");
    document.body.classList.add('energy-glow-medium');
    resultText.style.color = '#ffdb58';
    resultImage.src = 'images/medium.png';
    resultImage.style.display = 'block';
  } else {
    resultContainer.classList.add("compatibility-fail", "energy-glow-low");
    document.body.classList.add('energy-glow-low');
    resultText.style.color = '#ff6f91';
    resultImage.src = 'images/low.png';
    resultImage.style.display = 'block';
  }

  // Animate progress bar
  const fillBar = document.querySelector('.compatibility-fill');
  if (fillBar) {
    let fillColor = '#ff6f91'; // red
    if (score === "high") fillColor = '#94fba3';
    else if (score === "medium") fillColor = '#ffdb58';

    fillBar.style.width = '0%';
    setTimeout(() => {
      fillBar.style.backgroundColor = fillColor;
      fillBar.style.width = fillBar.getAttribute('data-score') + '%';
    }, 100);
  }
}

// Animate score from 0 to final value with emoji
function animateScore(finalScore, emoji) {
  const scoreDisplay = document.querySelector(".compatibility-score");
  let current = 0;

  const interval = setInterval(() => {
    if (current >= finalScore) {
      clearInterval(interval);
      scoreDisplay.textContent = ${emoji} ${finalScore}% Compatibility;
    } else {
      scoreDisplay.textContent = ${emoji} ${current++}% Compatibility;
    }
  }, 20);
}

// Download result as PDF
document.querySelector('.download-button').addEventListener('click', () => {
  if (!latestResultText) {
    alert('No compatibility result to download!');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(latestResultText, 10, 10);
  doc.save('compatibility-result.pdf');
});
