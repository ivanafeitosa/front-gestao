//Acesando o componente que conterá as tarefas
const groupTarefas = document.getElementById("groupTarefas");
const form = document.getElementById("tarefa-form");

//Acessando os inputs do formulário
const inputResponsavel = document.getElementById('nomeResponsavel');
const inputDescricao = document.getElementById('descricao');
const inputStatus = document.getElementById('status');

//Variável apoio para atualizar tarefas
let tarefaIdParaAtualizar = null;
let dataCriacao = null;

//GET
const carregarTarefas = async () => {
    const response = await fetch('http://localhost:8080/tarefas');
    const tarefas = await response.json();

    groupTarefas.innerHTML = "";

    tarefas.map((tarefa) => {
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
                  <h5 class="card-title">${tarefa.nomeResponsavel}</h5>
                  <p class="card-text">${tarefa.descricao}</p>
                  <div class="buttonGroup">
                    <button type="button" class="btn btn-success" onclick="alteraStatusTarefa(${tarefa.id},'Finalizado')">Concluir</button>
                    <button type="button" class="btn btn-secondary" onclick="prepararAtualizacaoTarefa(${tarefa.id})">Atualizar</button>
                    <button type="button" class="btn btn-warning" onclick="alteraStatusTarefa(${tarefa.id},'Cancelado')">Cancelar</button>
                    <button type="button" class="btn btn-danger" onclick="deletarTarefa(${tarefa.id})">Fechar</button>
                  </div>
                  <p class="card-text mt-2">Status: ${tarefa.status} ${icon}</p>
                </div>
                <div class="card-footer">
                  ${tarefa.dataCriacao}
                </div>
            </div>
            `
    });
};

//POST e PUT
const prepararAtualizacaoTarefa = async (id) => {
    const response = await fetch(`http://localhost:8080/tarefas/${id}`);
    const tarefa = await response.json();

    inputResponsavel.value = tarefa.nomeResponsavel;
    inputDescricao.value = tarefa.descricao;
    inputStatus.value = tarefa.status;

    document.getElementById("btnCoringa").innerText = "Atualizar Tarefa";

    tarefaIdParaAtualizar = id;
    dataCriacao = tarefa.dataCriacao;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if(tarefaIdParaAtualizar) {
        await fetch(`http://localhost:8080/tarefas/${tarefaIdParaAtualizar}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeResponsavel: inputResponsavel.value,
                descricao: inputDescricao.value,
                status: inputStatus.value,
                dataCriacao,
            }),
        });
        tarefaIdParaAtualizar = null;
        dataCriacao = null;
        document.getElementById("btnCoringa").innerText = "Adicionar Tarefa";
    } else {
        await fetch('http://localhost:8080/tarefas', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeResponsavel: inputResponsavel.value,
                descricao: inputDescricao.value,
                status: inputStatus.value,
                dataCriacao: new Date().toISOString() 
            }),
        });
        alert("Tarefa cadastrada com sucesso!");
    }

    carregarTarefas();
    form.reset();
});

//Alterar status
const alteraStatusTarefa = async (id, status) => {
    const response = await fetch(`http://localhost:8080/tarefas/${id}`);
    const tarefa = await response.json();
    tarefa.status = status;

    const responsePUT = await fetch(`http://localhost:8080/tarefas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarefa),
    });
    location.reload();
}

//DELETE
const deletarTarefa = async (id) => {
    const confirma = confirm("Você tem certeza que deseja excluir este item?");
    if(confirma) {
        await fetch(`http://localhost:8080/tarefas/${id}`, {
            method: "DELETE",
        });
        alert("Produto deletado com sucesso!");
        location.reload();
    };
};

carregarTarefas();

