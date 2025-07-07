var styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

  * { font-family: "Poppins", sans-serif; }
  body {
    margin: 0;
    height: 100vh;
    display: flex;
    overflow: hidden;
  }
  .sidebar {
    width: 200px;
    background-color: #d9ecfd;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px 12px;
    box-shadow: 2px 0 4px rgba(0,0,0,0.1);
  }
  .sidebar-header {
    text-align: center;
    margin-bottom: 24px;
  }
  .sidebar-logo {
    width: 40px;
    height: 40px;
  }
  .sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .sidebar-menu a {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .menu-item {
    background-color: rgba(255, 255, 255, 0.4);
    padding: 8px 12px;
    margin: 6px 0;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .menu-item.active {
    background-color: #2196f3;
    color: white;
  }
  .sidebar-footer {
    text-align: center;
    font-size: 12px;
    color: #333;
  }
`;

function menuNavbar(tipo) {
  const isAdmin = tipo === 'usuarios' || tipo === 'dashboards' || tipo === 'tarefasAdmin';

  if (isAdmin) {
    return `
      <div class="sidebar">
        <div class="sidebar-header">
          <a href="/admin/usuarios"><img src="/images/minilogo.png" alt="Logo" class="sidebar-logo"></a>
        </div>
        <ul class="sidebar-menu">
          <li class="menu-item ${tipo === 'usuarios' ? 'active' : ''}">
            <a href="/admin/usuarios"><ion-icon name="people-outline"></ion-icon> Usuários</a>
          </li>
          <li class="menu-item ${tipo === 'dashboards' ? 'active' : ''}">
            <a href="/admin/dashboards"><ion-icon name="analytics-outline"></ion-icon> Dashboards</a>
          </li>
          <li class="menu-item ${tipo === 'tarefasAdmin' ? 'active' : ''}">
            <a href="/admin/tarefas"><ion-icon name="list-outline"></ion-icon> Tarefas</a>
          </li>
          <li class="menu-item" style="background-color: #EE204D;">
            <a href="/admin/logout"><ion-icon name="log-out-outline"></ion-icon> Sair</a>
          </li>
        </ul>
      </div>
    `;
  } else {
    // menu de usuário comum permanece o mesmo
    return `
      <div class="sidebar">
        <div class="sidebar-header">
          <a href="/grupos"><img src="/images/minilogo.png" alt="Logo" class="sidebar-logo"></a>
        </div>
        <ul class="sidebar-menu">
          <li class="menu-item ${tipo === 'grupos' ? 'active' : ''}">
            <a href="/grupos"><ion-icon name="people-outline"></ion-icon> Grupos</a>
          </li>
          <li class="menu-item ${tipo === 'tarefas' ? 'active' : ''}">
            <a href="/tarefas"><ion-icon name="calendar-outline"></ion-icon> Tarefas</a>
          </li>
          <li class="menu-item ${tipo === 'criar' ? 'active' : ''}">
            <a href="/cadastrogrupo"><ion-icon name="add-circle-outline"></ion-icon> Criar</a>
          </li>
          <li class="menu-item" style="background-color: #EE204D;">
            <a href="/logout"><ion-icon name="log-in-outline"></ion-icon> Sair</a>
          </li>
        </ul>
        <div class="sidebar-footer">
          <a href="/perfil" class="menu-item ${tipo === 'perfil' ? 'active' : ''}">Configurações</a>
        </div>
      </div>
    `;
  }
}


function initMenu(tipo) {
  if (!document.getElementById('menu-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'menu-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
  // Remove sidebar atual, se existir
  const existingSidebar = document.querySelector('.sidebar');
  if (existingSidebar) existingSidebar.remove();

  // Insere o menu novo
  document.body.insertAdjacentHTML('afterbegin', menuNavbar(tipo));
}
