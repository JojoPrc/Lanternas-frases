document.addEventListener('DOMContentLoaded', () => {
  const lanterna = document.querySelector('.lanterna');
  const mensagens = document.querySelectorAll('.mensagem-secreta');
  const lanternaArea = document.querySelector('.lanterna-area');
  const totalMensagens = mensagens.length;

  let mensagensReveladas = 0;
  let ladoDaMensagem = 'left'; // Começa com o card à esquerda

  // Elemento do card final
  const cardFinal = document.createElement('div');
  cardFinal.classList.add('card-final');
  cardFinal.innerHTML = `
    <div class="mensagem-final">Às vezes, as palavras não são necessárias.</div>
    <div class="destaque">Só o fato de estarmos quase juntos já diz tudo.</div>
  `;
  document.body.appendChild(cardFinal);
  cardFinal.style.display = 'none'; // Inicialmente oculto

  // Função para criar corações brilhantes
  function criarCoracao(x, y) {
    const coracao = document.createElement('div');
    coracao.classList.add('coracao');
    coracao.innerHTML = '❤️';
    coracao.style.left = `${x}px`;
    coracao.style.top = `${y}px`;
    document.body.appendChild(coracao);

    // Remove o coração após a animação
    setTimeout(() => {
      coracao.remove();
    }, 2000);
  }

  // Função para atualizar a posição da lanterna
  function updateLanternaPosition(e) {
    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;

    // Atualiza a posição da lanterna
    gsap.to(lanterna, { x: x - lanterna.offsetWidth / 2, y: y - lanterna.offsetHeight / 2, duration: 0.1 });

    // Revela as mensagens de forma criativa
    mensagens.forEach((mensagem) => {
      if (!mensagem.classList.contains('revelada') && isInRange(x, y, mensagem)) {
        // Revela o card de forma animada
        gsap.fromTo(mensagem, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1, delay: 0.1 });
        mensagem.classList.add('revelada');
        
        // Adiciona corações brilhantes
        criarCoracao(x, y);
        
        mensagensReveladas++;
        
        // Alterna entre os lados para exibir os cards
        const novoLado = ladoDaMensagem === 'left' ? 'right' : 'left';
        ladoDaMensagem = novoLado;

        // Aplica a classe para posicionar o card
        const cardNovo = document.createElement('div');
        cardNovo.classList.add('card', novoLado);
        cardNovo.innerHTML = `
          <div class="mensagem-info">Mensagem ${mensagensReveladas} de ${totalMensagens}</div>
          <div>${mensagem.innerHTML}</div>
        `;
        document.body.appendChild(cardNovo);
        
        setTimeout(() => {
          cardNovo.classList.add('show');
        }, 100);

        // Quando todas as mensagens foram reveladas, mostramos o card final
        if (mensagensReveladas === totalMensagens) {
          mostrarCardFinal();
        }
      }
    });
  }

  // Verifique se a lanterna passou por cima da mensagem
  function isInRange(xPos, yPos, element) {
    const rect = element.getBoundingClientRect();
    return xPos > rect.left && xPos < rect.right && yPos > rect.top && yPos < rect.bottom;
  }

  // Posiciona as mensagens assim que a página carrega, sem sobreposição
  function positionMessages() {
    const positions = [];

    mensagens.forEach((mensagem, index) => {
      let overlap;
      let randX, randY;

      do {
        overlap = false;
        randX = Math.random() * (window.innerWidth - 200); // Aleatório dentro da tela
        randY = Math.random() * (window.innerHeight - 100); // Aleatório dentro da tela

        positions.forEach(pos => {
          if (randX < pos.x + 200 && randX + 200 > pos.x &&
              randY < pos.y + 100 && randY + 100 > pos.y) {
            overlap = true;
          }
        });
      } while (overlap);

      positions.push({ x: randX, y: randY });
      mensagem.style.left = `${randX}px`;
      mensagem.style.top = `${randY}px`;
    });
  }

  // Mostra o card final quando todas as mensagens foram encontradas
  function mostrarCardFinal() {
    // Exibe o card final com animação suave
    cardFinal.style.display = 'block';
    gsap.fromTo(cardFinal, { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1 });

    // Remove os outros cards de mensagens
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.remove();
    });
  }

  // Posiciona as mensagens e começa o rastreamento do mouse/touch
  positionMessages();
  lanternaArea.addEventListener('mousemove', updateLanternaPosition);
  lanternaArea.addEventListener('touchmove', (e) => {
    e.preventDefault();
    updateLanternaPosition(e);
  });
});
