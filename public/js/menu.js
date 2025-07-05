var styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

*{
  font-family: "Poppins", sans-serif;
}

body {
  height: 95.6vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin: 0px;
  overflow-y: hidden;
}

.sidebar {
  margin: 0px;
  width: 200px;
  height: 100%;
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


.menu-item span {
  float: right;
}

.sidebar-footer {
  text-align: center;
  font-size: 12px;
  color: #333;
}

.user-icon {
  width: 28px;
  margin-bottom: 4px;
}

`;

function menuNavbar(x) {
  let grupos = "";
  let tarefas = "";
  let calendario = "";
  let criar = "";
  let usuario = "";
  let configuracoes = "";

  switch (x) {
    case "perfil":
      configuracoes = "active";
      break;
    case "grupos":
      grupos = "active";
      break;
    case "tarefas":
      tarefas = "active";
      break;
    case "criar":
      criar = "active";
      break;
  }

  return `
    <div class="sidebar">
      <div class="sidebar-header">
        <a href="/grupos"><img src="/images/minilogo.png" alt="Logo" class="sidebar-logo"></a>
      </div>
      <ul class="sidebar-menu">
        <li class="menu-item ${grupos}">
          <a href="/grupos"><ion-icon name="people-outline"></ion-icon> Grupos</a>
        </li>
        <li class="menu-item ${tarefas}">
          <a href="/tarefas"><ion-icon name="calendar-outline"></ion-icon> Tarefas</a>
        </li>
        <li class="menu-item ${criar}">
          <a href="/cadastrogrupo"><ion-icon name="add-circle-outline"></ion-icon> Criar</a>
        </li>
        <li class="menu-item" style="background-color: #EE204D;">
        <a href="/logout"><ion-icon name="log-in-outline"></ion-icon> Sair</a>
      </li>
      </ul>
      <div class="sidebar-footer">
        <img src="icons/user.svg" alt="Usuário" class="user-icon">
        <a href="/perfil" style="text-decoration:none;" class="menu-item ${configuracoes}">Configurações</a>
        <a href="/logout" class="logout-button">Sair</a>
      </div>
    </div> 
  `;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function initMenu(x) {
  var styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  //verificarLogin();
  $("body").prepend(menuNavbar(x));
}

//DEPENDENCIAS DO SITE - FRONTEND

// const bootstrapCSS = document.createElement("link");
// bootstrapCSS.rel = "stylesheet";
// bootstrapCSS.href = BASE_URL_PORTALTST + "src/css/bootstrap.min.css";
// document.head.appendChild(bootstrapCSS);

// const bootstrapiconsCSS = document.createElement("link");
// bootstrapiconsCSS.rel = "stylesheet";
// bootstrapiconsCSS.href =
//   "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css";
// document.head.appendChild(bootstrapiconsCSS);

// const jqueryScript = document.createElement("script");
// jqueryScript.src = BASE_URL_PORTALTST + "src/js/jquery.js";
// jqueryScript.onload = () => {
//   const popperScript = document.createElement("script");
//   popperScript.src = BASE_URL_PORTALTST + "src/js/popper.min.js";
//   popperScript.onload = () => {
//     const bootstrapScript = document.createElement("script");
//     bootstrapScript.src = BASE_URL_PORTALTST + "src/js/bootstrap.min.js";
//     bootstrapScript.onload = () => {
//       const validScript = document.createElement("script");
//       validScript.src = BASE_URL_PORTALTST + "src/js/ajax/session/valid.js";
//       validScript.onload = () => {
//         initApp();
//       };
//       document.head.appendChild(validScript);
//     };
//     document.head.appendChild(bootstrapScript);
//   };
//   document.head.appendChild(popperScript);
// };
// document.head.appendChild(jqueryScript);
