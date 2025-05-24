// Simula dados do back-end
const grupos = [
    { id: 1, nome: "Grupo 1", descricao: "Grupo sobre estudos", tarefas: 3 },
    { id: 2, nome: "Grupo 2", descricao: "Grupo de trabalho", tarefas: 5 },
    { id: 3, nome: "Grupo 3", descricao: "Amigos", tarefas: 2 },
    { id: 4, nome: "Grupo 4", descricao: "Descrição Curta do Grupo", tarefas: 1 }
  ];
  
  const container = document.getElementById('grupo-container');
  
  fetch('views-objects/html/cardPadrao.html')
    .then(res => res.text())
    .then(template => {
      grupos.forEach(grupo => {
        let cardHTML = template
          .replace('{{id}}', grupo.id)
          .replace('{{nome}}', grupo.nome)
          .replace('{{descricao}}', grupo.descricao)
          .replace('{{tarefas}}', grupo.tarefas);
  
        container.innerHTML += cardHTML;
      });
    });
  