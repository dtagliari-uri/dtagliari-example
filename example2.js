async function updateBrasiliaTime() {
    const timeElement = document.getElementById('brasilia-time');
    const dateElement = document.getElementById('brasilia-date');
    const clockContainer = document.querySelector('.clock-container');

    try {
        const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Sao_Paulo');
        if (!response.ok) throw new Error('Falha ao buscar horário');

        const data = await response.json();

        // Formata a hora e a data
        const timeStr = `${data.hour.toString().padStart(2, '0')}:${data.minute.toString().padStart(2, '0')}:${data.seconds.toString().padStart(2, '0')}`;
        const dateStr = data.date;

        if (timeElement) timeElement.textContent = timeStr;
        if (dateElement) dateElement.textContent = dateStr;

        clockContainer.classList.remove('error');
    } catch (error) {
        console.error('Erro ao buscar o horário de Brasília:', error);
        if (timeElement) timeElement.textContent = '--:--:--';
        clockContainer.classList.add('error');
    }
}

// Atualiza a cada segundo para o efeito de relógio (idealmente buscaríamos uma vez e incrementaríamos localmente, 
// mas para simplicidade e precisão de rede, vamos atualizar o estado)
// Nota: Para evitar excesso de requisições à API pública, vamos atualizar a cada 30 segundos e fazer o tick localmente se necessário.
// Mas o pedido foi uma consulta, então vamos manter uma frequência razoável.

updateBrasiliaTime();
setInterval(updateBrasiliaTime, 30000); // Atualiza com a API a cada 30 segundos

// Relógio local simplificado para o "tick" de segundos entre requisições de API
setInterval(() => {
    const timeElement = document.getElementById('brasilia-time');
    if (timeElement && timeElement.textContent !== '--:--:--') {
        let [h, m, s] = timeElement.textContent.split(':').map(Number);
        s++;
        if (s >= 60) { s = 0; m++; }
        if (m >= 60) { m = 0; h++; }
        if (h >= 24) { h = 0; }

        timeElement.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
}, 1000);
