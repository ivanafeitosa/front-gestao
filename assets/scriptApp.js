//Acesando o componente que conterá as tarefas
const groupTarefas = document.getElementById("groupTarefas");

//Acessando os inputs do formulário
const inputUsuario = document.getElementById('inputUsuario');
const inputTarefa = document.getElementById('inputTarefa');
const inputStatus = document.getElementById('inputStatus');

//Gerando Ids únicos para cada nova tarefa
let contadorId = 0;

function obterMaiorId(tarefas) {
    let maiorId = 0;
    tarefas.forEach(tarefa => {
        if (tarefa.id > maiorId) {
            maiorId = tarefa.id;
        }
    });
    return maiorId;
}

//GET
fetch('http://localhost:8080/tarefas')
    .then(response => response.json())
    .then(dados => {
        dados.map(tarefa => {
            let status = tarefa.status;
            let icon = '';

            switch (status) {
                case 'Iniciado':
                    icon = '<i class="bi bi-hand-thumbs-up"></i>';
                    break;
                case 'Finalizado':
                    icon = '<i class="bi bi-check-lg"></i>';
                    break;
                case 'Pendente':
                    icon = '<i class="bi bi-clock-history"></i>';
                    break;
                case 'Cancelado':
                    icon = '<i class="bi bi-x"></i>';
                    break;
                default:
                    console.log("Opção não existe!");
            }
            groupTarefas.innerHTML +=
                `
            <div class="card text-center bg-dark text-white mt-5">
                <div class="card-header">
                  Tarefa #${tarefa.id}
                </div>
                <div class="card-body">
                  <h5 class="card-title">${tarefa.nome}</h5>
                  <p class="card-text">${tarefa.descricao}</p>
                  <div class="buttonGroup">
                    <button type="button" class="btn btn-success" onclick="alteraTarefa(${tarefa.id},'Finalizado')">Concluir</button>
                    <button type="button" class="btn btn-warning" onclick="alteraTarefa(${tarefa.id},'Cancelado')">Cancelar</button>
                    <button type="button" class="btn btn-danger" onclick="deleteTarefa(${tarefa.id})">Fechar</button>
                  </div>
                  <p class="card-text mt-2">Status: ${tarefa.status} ${icon}</p>
                </div>
                <div class="card-footer">
                  ${tarefa.data}
                </div>
            </div>
            `
        });
        contadorId = obterMaiorId(dados);
    });


// POST
document.getElementById('addTarefa').addEventListener('click', () => {
    let dataHoraAtual = new Date();
    let dataHoraFormatada = dataHoraAtual.toLocaleString();

    contadorId++;

    const novaTarefa = {
        id: parseInt(contadorId),
        nome: inputUsuario.value,
        descricao: inputTarefa.value,
        status: inputStatus.value,
        data: dataHoraFormatada
    }

    fetch(`http://localhost:8080/tarefas`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(novaTarefa)
    })
        .then(response => response.json())
        .then(dados => {
            // alert('Produto cadastrado com sucesso');
            location.reload();
        });
});


// PUT
const alteraTarefa = async (id, status) => {
    let tarefaAlterada;

    await fetch(`http://localhost:8080/tarefas/${id}`)
        .then(response => response.json())
        .then(dado => {
            dado.status = status;
            tarefaAlterada = dado;
        });

    fetch(`http://localhost:8080/tarefas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarefaAlterada),
    })
        .then(response => response.json())
        .then(dados => {
            // alert('Produto alterado com sucesso!');
            location.reload();
        });
};

//DELETE
const deleteTarefa = (id) => {
    const confirma = confirm("Você tem certeza que deseja excluir este item?");
    if (confirma) {
        fetch(`http://localhost:8080/tarefas/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(dados => {
                alert('Produto deletado com sucesso!');
                location.reload();
            })
    };
};
