document.getElementById('searchButton').addEventListener('click', async () => {
  const query = document.getElementById('searchInput').value.trim()
  const resultsGrid = document.getElementById('resultsGrid')
  const loading = document.getElementById('loading')

  if (!query) return alert('Please enter a product to search.')

  resultsGrid.innerHTML = ''
  loading.style.display = 'flex'
  loading.style.justifyContent = 'center'
  loading.style.alignItems = 'center'
  loading.style.flexDirection = 'column'

  try {
    const res = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })

    const data = await res.json()
    loading.style.display = 'none'

    // Render items from all platforms in separate cards
    const amazonHtml = (data.amazon || []).map(item => `
      <div class="result-card">
        <h3><i class="fa-brands fa-amazon"></i> Amazon</h3>
        <div class="img"> <img src="${item.img}" alt=${item.title}> </div>
        <a href="${item.link}" target="_blank">${item.title}</a>
        <p>Current Price: ${item.price} (${item.discountPercentage}% off)</p>
        <p>Original Price: ${item.realprice}</p>
      </div>
    `).join('')

    const flipkartHtml = (data.flipkart || []).map(item => `
      <div class="result-card">
        <h3><i class="fas fa-shopping-bag"></i> Flipkart</h3>
        <div class="img"> <img src="${item.img}" alt=${item.title}> </div>
        <a href="${item.link}" target="_blank">${item.title}</a>
        <p>Current Price: ${item.price} (${item.off})</p>
        <p>Original Price: ${item.realprice}</p>
      </div>
    `).join('')

    const relianceHtml = (data.relianceDigital || []).map(item => `
      <div class="result-card">
        <h3><i class="fas fa-mobile-alt"></i> Reliance Digital</h3>
        <div class="img"> <img src="${item.img}" alt=${item.title}> </div>
        <a href="${item.link}" target="_blank">${item.title}</a>
        <p>Current Price: ${item.price} (${item.off}% off)</p>
        <p>Original Price: ${item.realprice}</p>
      </div>
    `).join('')

    resultsGrid.innerHTML = amazonHtml + flipkartHtml + relianceHtml || '<p>No results found.</p>'
  } catch (err) {
    loading.style.display = 'none'
    alert('Something went wrong. Try again later.')
    console.error(err)
  }
})

// Mobile menu functionality
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav')) {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
}

