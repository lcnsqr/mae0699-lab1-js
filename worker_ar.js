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

// Gerar ponto aleatório dentro da esfera de raio 
// unitário centrada na origem e projetar na casca
function ponto(n){
	var s;
	var r = 0;
	var p = [];
	// Aceitar ponto se dentro do círculo de raio 1
	while ( r > 1 || r == 0 ){
		p = [];
		s = 0;
		// Gerar ponto no quadrado de lado 2 centrado na origem
		for (var i = 0; i < n; i++){
			p.push(-1.0 + 2.0 * Math.random());
			s += Math.pow(p[i], 2);
		}
		// Tamanho do vetor
		r = Math.sqrt(s);
	}
	return projetar(p);
}

// Gerar pontos uniformemente distribuídos na superfície 
// da esfera do R^n utilizando o método Aceitação-Rejeição
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
