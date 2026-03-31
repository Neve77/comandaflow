# 📐 Order Management System - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        COMANDAFLOW                          │
│                   Order Management System                    │
└─────────────────────────────────────────────────────────────┘

┌─ FRONTEND (Next.js) ────────────────────────────────────────┐
│                                                              │
│  Dashboard (index.js)                                        │
│  ├── Card: 🍽️ Garçom       → garcom.js (clients)            │
│  ├── Card: 👨‍🍳 Cozinha      → cozinha.js (kitchen)           │
│  ├── Card: ⚙️  Admin       → admin.js (products)            │
│  ├── Card: 📊 Relatórios   → relatorios.js (exports)        │
│  ├── Card: 📋 Pedidos ⭐   → pedidos.js (orders) NEW!        │
│  └── Card: 💳 Fechamento   → fechamento.js (payment)        │
│                                                              │
│  Services (api.js)                                           │
│  ├── auth.*       (login/register)                           │
│  ├── clientes.*   (client CRUD)                              │
│  ├── produtos.*   (product CRUD)                             │
│  ├── pedidos.* ⭐  (order CRUD + NEW functions)             │
│  ├── fechamento.* (payment processing)                       │
│  └── dashboard.*  (statistics)                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                           ↓ HTTP/WebSocket
                      API_URL: :4000
                           ↑ JSON
┌─ BACKEND (Fastify) ────────────────────────────────────────┐
│                                                              │
│  Routes                                                      │
│  ├── /auth/*           (authentication)                      │
│  ├── /clientes/*       (client endpoints)                    │
│  ├── /produtos/*       (product endpoints)                   │
│  ├── /pedidos          (GET - list all)                      │
│  ├── /pedidos/:id      (PUT/DELETE) ⭐ NEW                   │
│  ├── /pedidos/:id/notas (POST) ⭐ NEW                        │
│  ├── /pedidos/pendentes (GET - kitchen)                      │
│  ├── /pedidos/:id/status (PUT - update status)              │
│  ├── /fechamento/*     (payment)                             │
│  ├── /dashboard/*      (statistics)                          │
│  └── /relatorios/*     (exports)                             │
│                                                              │
│  Database (SQLite - better-sqlite3)                          │
│  ├── users            (authentication)                       │
│  ├── clientes         (customer data)                        │
│  ├── produtos         (product catalog)                      │
│  ├── pedidos ⭐        (orders + NEW anotacoes column)       │
│  ├── itens            (order items)                          │
│  └── [other tables]                                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## New API Endpoints (⭐ Added)

### 1. Update Order Price
```
PUT /pedidos/:id

Request Body:
{
  "total": 65.50
}

Response Success:
{
  "ok": true,
  "mensagem": "Preço atualizado com sucesso"
}

Response Error:
{
  "erro": "Preço inválido"
}
```

**Use Case:** Admin adjusts order total (discount, correction, etc.)

---

### 2. Delete Order
```
DELETE /pedidos/:id

Request Body: (empty)

Response Success:
{
  "ok": true,
  "mensagem": "Pedido deletado com sucesso"
}

Response Error:
{
  "erro": "Pedido não encontrado"
}

Side Effect:
- Deletes all related items in itens table (cascade)
```

**Use Case:** Remove mistakes or cancelled orders

---

### 3. Add Order Annotation
```
POST /pedidos/:id/notas

Request Body:
{
  "nota": "Cliente quer sem sal"
}

Response Success:
{
  "ok": true,
  "mensagem": "Anotação adicionada"
}

Response Error:
{
  "erro": "Anotação vazia" | "Pedido não encontrado"
}

Database Update:
- Appends note with timestamp to pedidos.anotacoes
- Format: "[HH:MM:SS] Texto da anotação"
- Multiple notes separated by newlines
```

**Use Case:** Garçom adds special requests/notes about the order

---

## Database Schema Changes

### New Column in `pedidos` Table
```sql
ALTER TABLE pedidos ADD COLUMN anotacoes TEXT;
```

**Column Structure:**
```
Column Name: anotacoes
Type: TEXT
Nullable: YES
Default: NULL
Purpose: Store timestamped order notes

Example Content:
[14:22:15] Cliente quer sem sal
[14:25:30] Sem cebola também
[14:28:45] Prioridade - cliente com pressa
```

**Migration Handling:**
```javascript
// In backend/db.js
try {
  db.prepare(`ALTER TABLE pedidos ADD COLUMN anotacoes TEXT`).run();
} catch (err) {
  // Column already exists, ignore error
  // This allows script to run on both new and existing databases
}
```

---

## Frontend Implementation

### New Page: `frontend/pages/pedidos.js`

**Key Components:**
```javascript
export default function Pedidos() {
  // State Management
  const [pedidos, setPedidos] = useState([]);        // All orders
  const [clientes, setClientes] = useState([]);      // All clients
  const [aba, setAba] = useState('listar');          // Tab: list/create
  const [pulseiraFiltro, setPulseiraFiltro] = useState(''); // Comanda filter
  
  // Editing states
  const [editandoId, setEditandoId] = useState(null);     // Price edit
  const [anotandoId, setAnotandoId] = useState(null);     // Adding note
  
  // Functions
  const handleCriarPedido(e)          // Create order
  const handleDeletarPedido(id)       // Delete order
  const handleAtualizarTotal(id)      // Update price
  const handleAdicionarNota(id)       // Add annotation
  
  // Render
  return (
    Tab: Listar (List)
      ├── Filter by comanda
      ├── Order cards with:
      │   ├── Comanda number
      │   ├── Client name
      │   ├── Total price
      │   ├── Status badge
      │   ├── Annotations display
      │   └── Action buttons (+ Annotate, + Edit, + Delete)
      │
      Tab: Criar (Create)
        ├── Client selector
        ├── Total price input
        └── Create button
  )
}
```

**UI/UX Features:**
- Gradient backgrounds (purple/pink theme)
- Tab-based navigation
- Real-time filter
- Status badges with colors
- Inline editing (no page reload)
- Confirmation dialogs for destructive actions
- Success/error notifications with auto-dismiss
- Responsive grid layout
- Mobile-friendly interface

---

## API Client Functions (Updated `frontend/services/api.js`)

```javascript
// New functions added:
pedidos.atualizar(id, total)
// Calls: PUT /pedidos/🆔
// Purpose: Update order total price
// Returns: {ok: true, mensagem}

pedidos.deletar(id)
// Calls: DELETE /pedidos/:id
// Purpose: Delete order and cascade to items
// Returns: {ok: true, mensagem}

pedidos.adicionarNota(id, nota)
// Calls: POST /pedidos/:id/notas
// Purpose: Add timestamped annotation
// Returns: {ok: true, mensagem}
```

**Example Usage:**
```javascript
// Create a new order
const response = await api.pedidos.criar(pulseira, []);
console.log(response.id); // New order ID

// Update its price
await api.pedidos.atualizar(response.id, 50.00);

// Add a note
await api.pedidos.adicionarNota(response.id, "Cliente quer sem sal");

// Delete if needed
await api.pedidos.deletar(response.id);
```

---

## Data Flow Example

### Scenario: Add annotation to order #5

**User Action:**
```
Garçom clicks "Adicionar Anotação" on order #5
Garçom types "Cliente quer picante extra"
Garçom clicks "✓"
```

**Frontend Processing:**
```javascript
// frontend/pages/pedidos.js
const handleAdicionarNota = async (pedidoId) => {
  // pedidoId = 5, novaNota = "Cliente quer picante extra"
  await api.pedidos.adicionarNota(5, "Cliente quer picante extra");
  // Calls: POST /pedidos/5/notas with body
}

// frontend/services/api.js
pedidos.adicionarNota = (id, nota) =>
  request(`/pedidos/${id}/notas`, {
    method: 'POST',
    body: JSON.stringify({ nota }),
  })
  // Sends HTTP POST to http://localhost:4000/pedidos/5/notas
```

**Backend Processing:**
```javascript
// backend/routes/pedidos.js
fastify.post("/pedidos/:id/notas", async (request) => {
  const { id } = request.params;      // id = 5
  const { nota } = request.body;      // nota = "Cliente quer picante extra"
  
  const pedido = db.prepare("SELECT * FROM pedidos WHERE id = ?").get(5);
  // Get current anotacoes: "[14:22:15] Cliente quer sem sal\n"
  
  const notaFormatada = `[${new Date().toLocaleTimeString('pt-BR')}] ${nota}`;
  // notaFormatada = "[14:32:45] Cliente quer picante extra"
  
  const anotacoesAtuais = pedido.anotacoes + "\n";
  // anotacoesAtuais = "[14:22:15] Cliente quer sem sal\n"
  
  db.prepare("UPDATE pedidos SET anotacoes = ? WHERE id = ?").run(
    anotacoesAtuais + notaFormatada,
    id
  );
  // UPDATE pedidos SET anotacoes = "[14:22:15] Cliente quer sem sal\n[14:32:45] Cliente quer picante extra" WHERE id = 5
  
  return { ok: true, mensagem: "Anotação adicionada" };
})
```

**Database Update:**
```sql
-- Before:
UPDATE pedidos 
SET anotacoes = "[14:22:15] Cliente quer sem sal"
WHERE id = 5;

-- After adicionarNota:
UPDATE pedidos 
SET anotacoes = "[14:22:15] Cliente quer sem sal\n[14:32:45] Cliente quer picante extra"
WHERE id = 5;
```

**Frontend Re-rendering:**
```javascript
// After API success
setSuccess('Anotação adicionada com sucesso!');
setTimeout(() => setSuccess(''), 3000);
carregarDados(); // Reload orders

// Display updated:
Order Card now shows:
📝 Anotações:
[14:22:15] Cliente quer sem sal
[14:32:45] Cliente quer picante extra
```

---

## Integration Points

### 1. Dashboard → Pedidos
```
index.js (Dashboard)
  └── Card: "Gerenciador de Pedidos"
      └── Link to pedidos.js
```

### 2. Garcom → Dashboard
```
garcom.js (Client registration)
  may have link to pedidos.js for order annotation
```

### 3. Admin → Order & Client Management
```
admin.js (Product management)
  └── (Future) Could link to pedidos.js for managing orders
```

### 4. Kitchen → Order Viewing
```
cozinha.js (Kitchen display)
  └── (Future) Could integrate annotations display
      └── Show [timestamp] notes from pedidos.anotacoes
```

---

## Security Considerations

### Authentication
- All endpoints require JWT token (handled by `auth` middleware)
- Token extracted from Authorization header
- Invalid/missing tokens return 401 Unauthorized

### Authorization (Implicit)
- All logged-in users can access order management
- No role-based restrictions on new endpoints
- Consider adding admin-only check for DELETE/PUT in production

### Data Validation
```javascript
// Price validation
if (total === undefined || total <= 0) {
  return { erro: "Preço inválido" };
}

// Note validation
if (!nota || nota.trim().length === 0) {
  return { erro: "Anotação vazia" };
}

// Order existence check
const pedido = db.prepare("SELECT * FROM pedidos WHERE id = ?").get(id);
if (!pedido) {
  return { erro: "Pedido não encontrado" };
}
```

---

## Performance Considerations

### Database Queries
- Each operation runs separate queries (could batch in future)
- Indexes on `pedidos.id` and `pedidos.cliente_id` recommended
- String concatenation for annotations is inefficient at scale (use JSON in future)

### Frontend Rendering
- Full reload on data change (could use incremental updates)
- No pagination yet (loads all orders)
- Filter is client-side only (could move to backend)

### Future Optimizations
1. **Pagination:** `LIMIT X OFFSET Y` in backend
2. **Real-time:** WebSocket instead of manual reload
3. **Annotation Storage:** JSON array instead of string concatenation
4. **Batch Operations:** Update multiple orders at once

---

## Testing Checklist

### Frontend Tests
- [ ] Pages loads without errors
- [ ] Filter by comanda works
- [ ] Create order button appears on tab2
- [ ] Add annotation opens input
- [ ] Edit price opens input
- [ ] Delete shows confirmation
- [ ] Success messages display
- [ ] Error messages display
- [ ] Mobile layout looks good

### Backend Tests
- [ ] GET /pedidos returns all orders
- [ ] PUT /pedidos/:id updates total
- [ ] DELETE /pedidos/:id removes order and items
- [ ] POST /pedidos/:id/notas appends annotation
- [ ] Invalid data returns error
- [ ] Missing auth returns 401

### Integration Tests
- [ ] Create order → Appears in list
- [ ] Add note → Displays in annotation section
- [ ] Edit price → Shows updated value
- [ ] Delete order → Removed from list
- [ ] Multiple operations → All work smoothly

---

## Deployment Notes

### Environment Variables
```
NEXT_PUBLIC_API_URL=http://localhost:4000  # Frontend → Backend
```

### Production Checklist
- [ ] CORS properly configured
- [ ] Authentication enforced
- [ ] SQL injection prevented (using prepared statements ✅)
- [ ] Error messages don't leak sensitive data
- [ ] Rate limiting on API endpoints
- [ ] Database backups automated
- [ ] Docker containers created
- [ ] Deployment guide written

---

## Future Enhancements (Roadmap)

### Phase 2: Real-time Updates
- [ ] WebSocket for live order changes
- [ ] Socket.io events for annotations
- [ ] Kitchen receives instant notifications

### Phase 3: Advanced Features
- [ ] Annotation templates ("picante", "sem sal", etc.)
- [ ] Order history/archive
- [ ] Annotation search
- [ ] Export with annotations to PDF
- [ ] Multi-user concurrent edits

### Phase 4: Analytics
- [ ] Most common annotations
- [ ] Average order processing time
- [ ] Peak hours analysis
- [ ] Custom reports

### Phase 5: Integration
- [ ] Kitchen display shows annotations
- [ ] Email notifications on special requests
- [ ] SMS alerts for priority orders
- [ ] Mobile app version

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** ✅ Implementation Complete  
**Next Step:** User testing and feedback
