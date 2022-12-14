class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano;
		this.mes = mes;
		this.dia = dia;
		this.tipo = tipo;
		this.descricao = descricao;
		this.valor = valor;
	}

	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false;
			}
		}
		return true;
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id');

		if(id === null) {
			localStorage.setItem('id', 0);
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id');
		return parseInt(proximoId) + 1;
	}

	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d));

		localStorage.setItem('id', id);
	}

	recuperRegistros(){
		//array
		let despesas = Array();
		let id = localStorage.getItem('id');

		//recuperar todas as despesas cadastradas em localstorage
		for(let i=1; i <= id; i++){
			//recuperar a despesa
		let despesa = JSON.parse(localStorage.getItem(i));
		
		//se existe items q foram removidos, se sim vamos pular
		if(despesa === null){
			continue;
		}
		despesa.id = i;
		despesas.push(despesa);
		}

		return despesas;
	}

	pesquisar(despesa){
		let despesasFiltradas = Array();
		despesasFiltradas = this.recuperRegistros();

		//ano
		if(despesa.ano != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
		}
		//mes
		if(despesa.mes != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
		}
		//dia
		if(despesa.dia != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
		}
		//tipo
		if(despesa.tipo != ''){
			despesasFiltradas = despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
		}
		//descrição
		if(despesa.descricao != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
		}
		//valor
		if(despesa.valor != ''){
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
		}
		return despesasFiltradas;
	}

	remover(id){
		localStorage.removeItem(id);
	}
	
}

let bd = new Bd();


function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
	)
	

	if(despesa.validarDados()) {
		bd.gravar(despesa)
		document.getElementById('modal_titulo').innerHTML = 'Registrado';
		document.getElementById('modal_div_titulo').className = 'modal-header text-success';
		document.getElementById('modal_conteudo').innerHTML = 'Registro inserido com sucesso!';
		document.getElementById('modal_voltar').className = 'btn btn-success';

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show') 
		ano.value = '' ;
		mes.value ='' ;
		dia.value = '';
		tipo.value= '';
		descricao.value ='';
		valor.value = '';

	} else {
		
		document.getElementById('modal_titulo').innerHTML = 'Erro!';
		document.getElementById('modal_conteudo').innerHTML = 'Campos obrigatorios estão vazios!';
		document.getElementById('modal_div_titulo').className = 'modal-header text-danger';
		document.getElementById('modal_voltar').className = 'btn btn-danger';

		//dialog de erro
		$('#modalRegistraDespesa').modal('show') ;
	}
}

function carregarListas(despesas = Array(), filtro = false){

	if(despesas.length == 0 && filtro == false){
	despesas = bd.recuperRegistros();
	}
	//selecionando o tbody
	let listaDespesas = document.getElementById('listaDespesas');
	listaDespesas.innerHTML = '';

	//percorrer o array despesas
	despesas.forEach(function(d){


		//criando o tr -Linha-
		let linha = listaDespesas.insertRow();

		//criar os td -colunas-
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

		//ajustar o tipo
		switch(parseInt(d.tipo)){
			case 1: 
				d.tipo = 'Alimentação';
			break
			case 2: 
				d.tipo = 'Educação';
			break
			case 3: 
				d.tipo = 'Lazer';
			break
			case 4: 
				d.tipo = 'Saúde';
			break
			case 5: 
				d.tipo = 'Transporte';
			break
		}

		linha.insertCell(1).innerHTML = d.tipo;
		linha.insertCell(2).innerHTML = d.descricao;
		linha.insertCell(3).innerHTML = `R$ ${d.valor}`;

		//botao exclusao
		let btn = document.createElement("button");
		btn.className = 'btn btn-danger';
		btn.innerHTML= '<i class="fas fa-times"></i>';

		let btn_excluir = document.getElementById('modal_excluir');
		btn_excluir.id = `id_despesa_${d.id}`;
		btn.onclick = function(){
			//remover despesa
				document.getElementById('modalexcluir_titulo').innerHTML = 'Excluir';
				document.getElementById('modalexcluir_div_titulo').className = 'modal-header text-danger';
				document.getElementById('modalexcluir_conteudo').innerHTML = 'Deseja realmente remover essa despesa?';
				document.getElementById('modalexcluir_voltar').className = 'btn btn-secondary';
	
				//dialog de pergunta
				$('#modalExcluirDespesa').modal('show') 
		}
		btn_excluir.onclick = function(){
			let id = this.id.replace('id_despesa_', '')
			bd.remover(id);
			window.location.reload();
		}
		linha.insertCell(4).append(btn);
	}
	);

	
}

function pesquisarDespesa(){
	let ano = document.getElementById('ano').value;
	let mes = document.getElementById('mes').value;
	let dia = document.getElementById('dia').value;
	let tipo = document.getElementById('tipo').value;
	let descricao = document.getElementById('descricao').value; 
	let valor = document.getElementById('valor').value;

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
	let despesas = bd.pesquisar(despesa);

	carregarListas(despesas, true);
}
