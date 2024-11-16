const express = require('express');
const app = express();
const path = require('path');

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'Public')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// Rodar o servidor na porta dinâmica ou na 3000 (se localmente)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
