const db = require('./db');
const bcrypt = require('bcrypt');

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Limpar dados existentes (opcional)
    // db.prepare("DELETE FROM users").run();
    // db.prepare("DELETE FROM clientes").run();
    // db.prepare("DELETE FROM produtos").run();

    // 1. Criar usuários de teste
    const usuarios = [
      { nome: 'Admin User', email: 'admin@test.com', senha: 'admin123', role: 'admin' },
      { nome: 'Garcom User', email: 'garcom@test.com', senha: 'garcom123', role: 'garcom' },
      { nome: 'Cozinha User', email: 'cozinha@test.com', senha: 'cozinha123', role: 'cozinha' },
    ];

    for (const user of usuarios) {
      const existente = db.prepare('SELECT * FROM users WHERE email = ?').get(user.email);
      if (!existente) {
        const senhaHash = await bcrypt.hash(user.senha, 10);
        db.prepare('INSERT INTO users (nome, email, senha, role) VALUES (?, ?, ?, ?)')
          .run(user.nome, user.email, senhaHash, user.role);
        console.log(`✅ Usuário criado: ${user.nome}`);
      }
    }

    // 2. Criar produtos
    const produtos = [
      { nome: 'Água (500ml)', preco: 3.50, categoria: 'Bebidas' },
      { nome: 'Refrigerante (350ml)', preco: 5.00, categoria: 'Bebidas' },
      { nome: 'Cerveja (350ml)', preco: 6.00, categoria: 'Bebidas' },
      { nome: 'Vinho (Taça)', preco: 12.00, categoria: 'Bebidas' },
      { nome: 'Chopp (Chope)', preco: 8.00, categoria: 'Bebidas' },
      { nome: 'Café Espresso', preco: 3.00, categoria: 'Quentes' },
      { nome: 'Cappuccino', preco: 6.00, categoria: 'Quentes' },
      { nome: 'Chá Gelado', preco: 4.50, categoria: 'Quentes' },
      { nome: 'Pizza Margarita (Pequena)', preco: 35.00, categoria: 'Pizza' },
      { nome: 'Pizza Margherita (Grande)', preco: 50.00, categoria: 'Pizza' },
      { nome: 'Pizza Calabresa (Pequena)', preco: 38.00, categoria: 'Pizza' },
      { nome: 'Pizza Calabresa (Grande)', preco: 55.00, categoria: 'Pizza' },
      { nome: 'Hambúrguer Clássico', preco: 25.00, categoria: 'Lanches' },
      { nome: 'Hambúrguer Premium', preco: 35.00, categoria: 'Lanches' },
      { nome: 'Batata Frita (P)', preco: 12.00, categoria: 'Acompanhamentos' },
      { nome: 'Batata Frita (G)', preco: 16.00, categoria: 'Acompanhamentos' },
      { nome: 'Salada de Alface', preco: 18.00, categoria: 'Saladas' },
      { nome: 'Salada Grega', preco: 28.00, categoria: 'Saladas' },
      { nome: 'Sorvete (Bola)', preco: 5.00, categoria: 'Sobremesas' },
      { nome: 'Brownie', preco: 12.00, categoria: 'Sobremesas' },
    ];

    for (const produto of produtos) {
      const existente = db.prepare('SELECT * FROM produtos WHERE nome = ?').get(produto.nome);
      if (!existente) {
        db.prepare('INSERT INTO produtos (nome, preco, categoria, ativo) VALUES (?, ?, ?, 1)')
          .run(produto.nome, produto.preco, produto.categoria);
        console.log(`✅ Produto criado: ${produto.nome}`);
      }
    }

    // 3. Criar clientes de teste
    const clientes = [
      { nome: 'Mesa 01', cpf: '000.000.001-00', telefone: '(11) 91234-5678', pulseira: 'MESA001' },
      { nome: 'Mesa 02', cpf: '000.000.002-00', telefone: '(11) 91234-5679', pulseira: 'MESA002' },
      { nome: 'Mesa 03', cpf: '000.000.003-00', telefone: '(11) 91234-5680', pulseira: 'MESA003' },
      { nome: 'João Silva', cpf: '123.456.789-00', telefone: '(11) 98765-4321', pulseira: 'CLI001' },
      { nome: 'Maria Santos', cpf: '987.654.321-00', telefone: '(11) 98765-4322', pulseira: 'CLI002' },
    ];

    for (const cliente of clientes) {
      const existente = db.prepare('SELECT * FROM clientes WHERE pulseira = ?').get(cliente.pulseira);
      if (!existente) {
        db.prepare('INSERT INTO clientes (nome, cpf, telefone, pulseira, status) VALUES (?, ?, ?, ?, ?)')
          .run(cliente.nome, cliente.cpf, cliente.telefone, cliente.pulseira, 'ativo');
        console.log(`✅ Cliente criado: ${cliente.nome}`);
      }
    }

    console.log('✨ Seed completado com sucesso!');
    console.log('\n📝 Credenciais de teste:');
    console.log('   Admin: admin@test.com / admin123');
    console.log('   Garçom: garcom@test.com / garcom123');
    console.log('   Cozinha: cozinha@test.com / cozinha123');

  } catch (err) {
    console.error('❌ Erro no seed:', err.message);
    process.exit(1);
  }
}

seed();
