/*
 * Variáveis globais são os parâmetros do simulador
 */
// Intervalo de tempo (em milissegundos) 
// para calcular a taxa
var msec = 1000;
// Pontos gerados a cada requisição ao thread
var lote = 400;
// Número de dimensões do ponto
var dim = 3;
// Conjunto de pontos em três dimensões para exibir em tela
var pontos_ar = [];
var pontos_bm = [];
// Contagem de pontos por segundo para cada método
var contagem_ar = 0;
var contagem_bm = 0;

// Iniciar vetor do gráfico da razão BoxMuller/AceitaçãoRejeição
var grafRazao = [];
// Gráfico exibe as últimas 77 amostras
for (var l=0; l<=77; l++){
	grafRazao.push(0);
}

// Thread que gera os pontos pelo método aceitação/rejeição
var gerador_ar = new Worker('worker_ar.js');
gerador_ar.addEventListener('message', function(event){
	pontos_ar = event.data;
	contagem_ar += pontos_ar.length;
	gerador_ar.postMessage({ m: lote, n: dim });
}, false);

// Thread que gera os pontos pelo método Box-muller
var gerador_bm = new Worker('worker_bm.js');
gerador_bm.addEventListener('message', function(event){
	pontos_bm = event.data;
	contagem_bm += pontos_bm.length;
	gerador_bm.postMessage({ m: lote, n: dim });
}, false);

// Iniciar geradores de pontos
gerador_ar.postMessage({ m: lote, n: dim });
gerador_bm.postMessage({ m: lote, n: dim });

// Atualização do gráfico com a taxa
window.setInterval(function(){
	// Exibir amostragem de pontos em duas dimensões
	/*
	if ( thread.n() == 3 ){
		//console.log(thread.nome);
		if ( thread.sigla == "ar" ){
			pontos_ar == [];
			for (var c = 0; c < 10; c++){
				//console.log(thread.get(c, 0), thread.get(c, 1));
				pontos_ar.push([thread.get(c, 0), thread.get(c, 1), thread.get(c, 2)]);
			}
		}
	}
	*/

	// Gráfico da razão entre os métodos
	if ( contagem_ar == 0 ) return;
	// Box-muller sobre aceitação/rejeição
	// Razão acima de 1, vantagem box-muller
	var razao = contagem_bm / contagem_ar;
	// Atualizar exibição da contagem
	document.querySelector("#ar-pps").textContent = contagem_ar;
	document.querySelector("#bm-pps").textContent = contagem_bm;
	// Identificar divisão por zero
	if ( isNaN(razao) ) return;
	// Checar infinito
	if (razao == Number.POSITIVE_INFINITY || razao == Number.NEGATIVE_INFINITY) return;
	// Atualizar exibição
	document.querySelector("#graf-dim").textContent = ( dim > 1 ) ? dim + " dimensões" : dim + " dimensão";
	if (contagem_bm > contagem_ar){
		document.querySelector("#graf-melhor").textContent = "Box-Muller";
	}
	else {
		document.querySelector("#graf-melhor").textContent = "Aceitação/Rejeição";
	}
	// Zerar contadores
	contagem_ar = 0;
	contagem_bm = 0;
	// Exibir gráfico
	grafRazao.shift();
	grafRazao.push(razao);
	var linhaGraf = "M ";
	for (l=0; l<grafRazao.length; l++){
		x = l * 10;
		y = 300 - ((300*grafRazao[l])/2);
		linhaGraf = linhaGraf + x + "," + y + " ";
	}
	document.querySelector("#linha-razao").setAttribute("d", linhaGraf);

}, msec);

// Botões
document.querySelector("button[name='dim-menos']").addEventListener("click", function(event){
	// Mínimo de 1 dimensão
	if ( dim == 1 ) return;
	dim--;
	// Atualizar exibição da contagem das dimensões
	document.querySelector("#graf-dim").textContent = ( dim > 1 ) ? dim + " dimensões" : dim + " dimensão";
});
document.querySelector("button[name='dim-mais']").addEventListener("click", function(event){
	// Máximo de 7 dimensões
	if ( dim == 7 ) return;
	dim++;
	// Atualizar exibição da contagem das dimensões
	document.querySelector("#graf-dim").textContent = ( dim > 1 ) ? dim + " dimensões" : dim + " dimensão";
});
