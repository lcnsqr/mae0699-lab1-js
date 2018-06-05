// Projetar vetor v na superfície da esfera de raio 1
function projetar(v){
	var s = 0;
	for (var i = 0; i < v.length; i++){
		s += Math.pow(v[i], 2);
	}
	// Tamanho do vetor
	s = Math.sqrt(s);
	// Alterar tamanho para 1
	var w = [];
	for (var i = 0; i < v.length; i++){
		w.push(v[i] / s);
	}
	return w;
}

// Um par de variáveis aleatórias com distribuição normal,
// esperança zero e variância unitária (método Box-Muller)
function parNormal(){
	// Gerar um ponto uniforme dentro do disco 
	// de raio unitário centrado na origem
	var par = [0,0];
	par[0] = -1.0 + 2.0*Math.random();
	par[1] = -1.0 + 2.0*Math.random();
	var r = Math.pow(par[0], 2) + Math.pow(par[1], 2);
	// Gerar novamente caso ponto fora 
	// do disco ou exatamente na origem
	while ( r > 1 || r == 0 ){
		par[0] = -1.0 + 2.0*Math.random();
		par[1] = -1.0 + 2.0*Math.random();
		r = Math.pow(par[0], 2) + Math.pow(par[1], 2);
	}
	// Fator comum
	var f = Math.sqrt(-2*Math.log(r)/r);
	// Par normal
	par[0] *= f;
	par[1] *= f;
	return par;
}

// n variáveis aleatórias com distribuição 
// normal, esperança zero e variância unitária
function ponto(n){
	var par;
	var ponto = [];
	if ( n == 1 ){
		par = parNormal();
		// Um valor do par é descartado
		ponto.push(par[0]);
		return projetar(ponto);
	}
	for (var i = 0; i < n - 1; i += 2){
		par = parNormal();
		ponto.push(par[0]);
		ponto.push(par[1]);
	}
	// Se n ímpar, falta gerar o último
	if ( n % 2 == 1 ){
		par = parNormal();
		// Um valor do par é descartado
		ponto.push(par[0]);
	}
	return projetar(ponto);
}

// Gerar pontos uniformemente distribuídos na superfície 
// da esfera do R^n utilizando o método Box-Muller
onmessage = function(event){
	// Quantidade de pontos
	var m = event.data.m;
	// Número de dimensões em cada ponto
	var n = event.data.n;
	// Variável para armazenar os pontos
	var pontos = [];
	// Gerar m pontos
	for (var i = 0; i < m; i++){
		pontos.push(ponto(n));
	}
	// Retornar pontos gerados
	postMessage(pontos);
};
