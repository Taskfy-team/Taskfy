fetch('views-objects/html/navBar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('sidebar-placeholder').innerHTML = html;
    console.log('Navbar carregada!');
  })
  .catch(err => console.error('Erro ao carregar navbar:', err));
