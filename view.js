// Exibição dos pontos do método Aceitação/Rejeição
var anim_ar = document.createElement("canvas");
document.querySelector('td[data-metodo="ar"]').appendChild(anim_ar);
anim_ar.width = anim_ar.clientWidth;
anim_ar.height = anim_ar.clientHeight;
// Transformar coordenadas padrao do canvas
var ctxAnim_ar = anim_ar.getContext("2d");
ctxAnim_ar.transform(1, 0, 0, -1, anim_ar.width/2, anim_ar.height/2);
//ctxAnim_ar.globalCompositeOperation = "lighten";

// Exibição dos pontos do método Box-Muller
var anim_bm = document.createElement("canvas");
document.querySelector('td[data-metodo="bm"]').appendChild(anim_bm);
anim_bm.width = anim_bm.clientWidth;
anim_bm.height = anim_bm.clientHeight;
// Transformar coordenadas padrao do canvas
var ctxAnim_bm = anim_bm.getContext("2d");
ctxAnim_bm.transform(1, 0, 0, -1, anim_bm.width/2, anim_bm.height/2);
//ctxAnim_bm.globalCompositeOperation = "lighten";

// Ponto de vista para os pontos
var Vista = function(pos, df){
	// Posicao da lente
	this.pos = pos;
	// Deslocamento da posicao para a origem
	this.des = Op.scale(-1, this.pos);
	// Base ortonormal de representacao dos objetos
	// O terceiro vetor basico e a direcao da vista
	this.base = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	];
	// Transpor base para simplificar operacoes
	this.base_ = Op.transpose(this.base);
	// Distancia da lente ao ponto focal
	// Escalar na direcao inversa da vista
	// Sempre positivo
	this.df = df;
	// Ponto focal na direcao inversa (a frente da lente)
	this.pf = Op.scale(this.df, this.base[2]);
};
Vista.prototype = {
	rotacionar: function(x, y, z){
		// Ajustar base
		this.base[0] = Op.rotate_x(x, this.base[0]);
		this.base[0] = Op.rotate_y(y, this.base[0]);
		this.base[0] = Op.rotate_z(z, this.base[0]);
		this.base[1] = Op.rotate_x(x, this.base[1]);
		this.base[1] = Op.rotate_y(y, this.base[1]);
		this.base[1] = Op.rotate_z(z, this.base[1]);
		this.base[2] = Op.rotate_x(x, this.base[2]);
		this.base[2] = Op.rotate_y(y, this.base[2]);
		this.base[2] = Op.rotate_z(z, this.base[2]);
		// Transpor base para simplificar operacoes
		this.base_ = Op.transpose(this.base);
		// Ajustar ponto focal
		this.pf = Op.scale(this.df, this.base[2]);
	},
	transladar: function(pos){
		// Posicao da lente
		this.pos = pos;
		// Deslocamento da posicao para a origem
		this.des = Op.scale(-1, this.pos);
	},
	reiniciar: function(pos, df){
		// Posicao da lente
		this.pos = pos;
		// Deslocamento da posicao para a origem
		this.des = Op.scale(-1, this.pos);
		// Base ortonormal de representacao dos objetos
		// O terceiro vetor basico e a direcao da vista
		this.base = [
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 1]
		];
		// Transpor base para simplificar operacoes
		this.base_ = Op.transpose(this.base);
		// Distancia da lente ao ponto focal
		// Escalar na direcao inversa da vista
		// Sempre positivo
		this.df = df;
		// Ponto focal na direcao inversa (a frente da lente)
		this.pf = Op.scale(this.df, this.base[2]);
	}
}

// Parâmetros gerais para a exibição dos pontos
var distFocal = 1400;
var camPos = [0, 400, -4096];
var cor = "#ffffff";
// Criar vista com posicao e distancia focal 
// para os pontos do método aceitação/rejeição
var vista_ar = new Vista(camPos, distFocal);
// Criar vista com posicao e distancia focal 
// para os pontos do método box-muller
var vista_bm = new Vista(camPos, distFocal);

// Abaixar a cabeça
var bow = Math.atan(Math.abs(camPos[1])/(2048+Math.abs(camPos[2])));

// Desenhar linha guia na tela
var risco = function(vista, ctxAnim, a, b, cor){
	var c = Op.transform(vista.base_, Op.sum(a, vista.des));
	var d = Op.transform(vista.base_, Op.sum(b, vista.des));
	// Razao para perspectiva
	var rc = vista.df / c[2];
	var rd = vista.df / d[2];
	// Criar projecao na tela
	var e = [
		rc * c[0],
		rc * c[1]
	];
	var f = [
		rd * d[0],
		rd * d[1]
	];
	ctxAnim.beginPath();
	ctxAnim.moveTo(e[0], e[1]);
	ctxAnim.lineTo(f[0], f[1]);
	ctxAnim.strokeStyle = cor;
	ctxAnim.lineWidth = 2;
	ctxAnim.closePath();
	ctxAnim.stroke();
};

// Exibição dos pontos
var exibirPontos = function(pontos, vista, anim, ctxAnim){
	// Atualizacao de quadro
	ctxAnim.clearRect(-anim.clientWidth/2, -anim.clientHeight/2, anim.clientWidth, anim.clientHeight);
	// Guias 
	risco(vista, ctxAnim, [-500,0,0],[0,0,0],"#555");
	risco(vista, ctxAnim, [0,-500,0],[0,0,0],"#555");
	risco(vista, ctxAnim, [0,0,-500],[0,0,0],"#555");
	risco(vista, ctxAnim, [0,0,0],[500,0,0],"#bbb");
	risco(vista, ctxAnim, [0,0,0],[0,500,0],"#bbb");
	risco(vista, ctxAnim, [0,0,0],[0,0,500],"#bbb");

	for (var c0 = 0; c0 < pontos.length; c0++){
		// Transladar ponto de modo que 
		// a posicao da lente seja a origem
		// e passar para a base da vista
		var ponto = Op.transform(vista.base_, Op.sum(Op.scale(300, pontos[c0]), vista.des));
		// O terceiro componente (projecao do ponto na direcao da lente) negativo 
		// ou igual a zero implica que o ponto esta do outro lado (atras) ou no
		// plano ortogonal a direcao da lente. Fora do campo de visao
		if ( ponto[2] <= 0 ) continue;
		// Razao para perspectiva
		var r = vista.df / ponto[2];
		// Criar projecao na tela
		var q = [
			r * ponto[0],
			r * ponto[1]
		];
		// Raio do ponto
		var raio = r * 3;
		// Ignorar se raio muito pequeno
		if ( raio < .5 ) continue;
		// Ignorar se fora da tela
		if ( Op.norm(q) - raio > (anim.width + anim.height)/2 ) continue;
		// Circulo
		ctxAnim.beginPath();
		// Preenchimento
		ctxAnim.arc(q[0], q[1], raio, 0, 2*Math.PI, 0);
		
		var value = 10 * r ;
		value = ( value > 1 ) ? 1 : value;
		var cval = Math.floor(255 * value);
		ctxAnim.fillStyle = cor;
		ctxAnim.strokeStyle = cor;
		ctxAnim.fill();
	}
};

// Amostragem de pontos para exibição
var exibir_ar = [];
var exibir_bm = [];
function amostragem(){
	if ( pontos_ar.length > 0 ){
		// Exibir pontos gerados por Aceitação/Rejeição
		exibir_ar = [];
		if ( dim == 3 ){
			for (var i = 0; i < 300; i++){
				exibir_ar.push(pontos_ar[i]);
			}
		}
	}
	if ( pontos_bm.length > 0 ){
		// Exibir pontos gerados por Box-Muller
		exibir_bm = [];
		if ( dim == 3 ){
			for (var i = 0; i < 300; i++){
				exibir_bm.push(pontos_bm[i]);
			}
		}
	}
}
// Esperar 1 segundo para a primeira exibição
setTimeout(function(){
	amostragem();
}, 1000);
// Trocar a cada 5 segundos
setInterval(function(){
	amostragem();
}, 5000);

// Rotacao da camera
var rotacao = 0;
function animar(timestamp){
	rotacao += Math.PI/1024;
	rotacao = ( rotacao < Math.PI * 2 ) ? rotacao : 0;
	var pos = Op.rotate_y(-rotacao, camPos);
	// Reiniciar vista na nova posicao
	vista_ar.reiniciar(pos, distFocal);
	vista_bm.reiniciar(pos, distFocal);
	// Rotacionar para apontar ao centro
	vista_ar.rotacionar(0, rotacao, 0);
	vista_ar.rotacionar(-bow, 0, 0);
	vista_bm.rotacionar(0, rotacao, 0);
	vista_bm.rotacionar(-bow, 0, 0);
	// Exibir pontos gerados por Aceitação/Rejeição
	exibirPontos(exibir_ar, vista_ar, anim_ar, ctxAnim_ar);
	// Exibir pontos gerados por Box-Muller
	exibirPontos(exibir_bm, vista_bm, anim_bm, ctxAnim_bm);
	window.requestAnimationFrame(animar);
}

window.requestAnimationFrame(animar);
