# 🚀 Gerenciador de Pedidos - Quick Start Guide

## How to Access the New Feature

### From Dashboard
1. Login to ComandaFlow (http://localhost:3000)
2. On the main dashboard, look for the new card: **"📋 Gerenciador de Pedidos"**
3. Click on it to access the order management interface

### Direct URL
- **http://localhost:3000/pedidos**

## User Workflows

### 👨‍💼 For Garçom (Waiter)

#### Scenario: Customer wants to add a note to their order
1. Navigate to **"Gerenciador de Pedidos"**
2. In the **"Filtrar por Comanda"** field, enter the customer's bracelet/pulseira number
3. Orders for that table/bracelet appear below
4. Click **"📝 Adicionar Anotação"** on the desired order
5. Type your note (e.g., "Cliente pediu sem sal", "Sem cebola")
6. Click **"✓"** to save
7. Note appears with timestamp: `[14:30:22] Cliente pediu sem sal`

#### Scenario: Need to see all orders for a specific table
1. Navigate to **"Gerenciador de Pedidos"**
2. Enter comanda number in filter (e.g., "001", "A12")
3. All orders for that comanda appear with:
   - Client name
   - Total amount
   - Current status (pendente/concluído)
   - All annotations

### ⚙️ For Admin

#### Create a New Order
1. Navigate to **"Gerenciador de Pedidos"**
2. Click on **"➕ Criar Pedido"** tab
3. Select a client from dropdown (shows name + bracelet number)
4. Enter total value (e.g., 45.50)
5. Click **"✓ Criar Pedido"**
6. Order appears in list (status: pendente)

#### Edit Order Price
1. Find the order in the list
2. Click **"💰 Editar Preço"** on the order card
3. Enter new total value
4. Click **"✓"** to save
5. Price updates immediately

#### Delete an Order
1. Find the order in the list
2. Click **"🗑️ Deletar Pedido"**
3. Confirm deletion in dialog
4. Order is removed from system

#### View Order Annotations
1. Find the order in the list
2. Scroll down to see **"📝 Anotações"** section
3. All timestamped notes appear in chronological order
4. Example:
   ```
   [14:22:15] Sem picante
   [14:25:30] Cliente quer com gelo
   [14:28:45] Alergia a amendoim
   ```

## Key Features

| Feature | Description |
|---------|-------------|
| 🔍 **Filter by Comanda** | Instantly filter orders by bracelet/table number |
| 📝 **Timestamped Notes** | Annotations auto-formatted with time `[HH:MM:SS]` |
| 💰 **Price Adjustment** | Admin can modify order totals on the fly |
| 🗑️ **Order Deletion** | Remove orders with one click + confirmation |
| ✅ **Status Tracking** | Visual indicators for order status |
| 📱 **Mobile Friendly** | Responsive design works on phones/tablets |
| 🔄 **Real-time Updates** | See changes as they happen |

## Examples

### Example 1: Customer wants modifications
```
Order: Comanda #005 (João Silva)
Action: Click "Adicionar Anotação"
Note: "Cliente quer o bife bem feito, sem sal na batata"
Result: [14:15:33] Cliente quer o bife bem feito, sem sal na batata
```

### Example 2: Admin error on price
```
Order created with wrong price: R$ 80.00
Correct price: R$ 50.00
Action: Click "Editar Preço" → Enter 50.00 → ✓
Result: Total updated to R$ 50.00
```

### Example 3: Multiple notes on one order
```
Order: Comanda #012
14:10:22 - [Waiter] Virou para cozinha
14:12:45 - [Admin] Preço alterado para R$ 65.50
14:15:10 - [Waiter] Cliente com pressa, prioritário!
14:18:00 - [Waiter] Alergia: morango
```

## GUI Elements Explained

### Order Card Components
```
┌─ Gerenciador de Pedidos ─────────────────┐
│                                           │
│ 🔍 Filtrar por Comanda                    │
│ [  Digite o número da pulseira...     ]   │
│                                           │
├─ Comanda #001 ──────────────────────────┤
│ Comanda: #001      Cliente: Maria         │
│ Total: R$ 45,50                           │
│ Status: PENDENTE [yellow badge]           │
│                                           │
│ 📝 Anotações:                             │
│ [14:22:15] Sem picante                   │
│ [14:28:30] Cliente quer com gelo         │
│                                           │
│ [📝 Adicionar Anotação] [💰 Editar Preço] │
│ [🗑️ Deletar Pedido]                       │
│                                           │
└─────────────────────────────────────────┘
```

## Common Operations

### Operation 1: Add note to order
**Steps:** List → Filter comanda → Click "Adicionar Anotação" → Type note → ✓

**Time:** ~10 seconds

### Operation 2: Change price
**Steps:** List → Click "Editar Preço" → Enter value → ✓

**Time:** ~5 seconds

### Operation 3: Create order
**Steps:** Create tab → Select client → Enter price → ✓ Criar Pedido

**Time:** ~8 seconds

## Database Behind the Scenes

When you add a note like "Cliente quer sem sal":
1. Frontend sends: `{ nota: "Cliente quer sem sal" }`
2. Backend receives it at: `POST /pedidos/:id/notas`
3. Backend timestamps it: `[14:30:22] Cliente quer sem sal`
4. Backend stores in database: `pedidos.anotacoes` column
5. Notes stack with newlines for multiple entries
6. Next time order loads: all notes display (read-only)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Filter not working | Make sure you're typing the exact bracelet number (case-sensitive) |
| Price won't update | Ensure you enter a valid number (e.g., 45.50, not "quarenta e cinco") |
| Annotations not saving | Check connection to backend - look for error message |
| Can't create order | Make sure at least one client exists and you selected one |
| Page not found | Backend might not be running - check `npm run dev` in backend folder |

## Technical Details

- **Frontend Route:** `/pedidos` (Next.js page)
- **Backend Endpoints:** `/pedidos` (GET/POST), `/pedidos/:id` (PUT/DELETE), `/pedidos/:id/notas` (POST)
- **Database Table:** `pedidos` with new `anotacoes TEXT` column
- **Real-time:** Uses REST API (Socket.io integration possible for future)
- **Authentication:** All endpoints require JWT token (handled automatically)

## Tips & Tricks

💡 **Tip 1:** You can leave the filter empty to see ALL orders in the system

💡 **Tip 2:** Order annotations are great for kitchen notes: "Prioridade!", "Cliente com alergia", etc.

💡 **Tip 3:** Admin can create orders for specific clients without kitchen involvement

💡 **Tip 4:** Price edit is useful for discounts or mistakes

💡 **Tip 5:** Each note includes exact timestamp for accountability

---

## Next Steps

After testing this feature, consider:
- 📊 **View annotations in Kitchen (Cozinha) page** - Show order notes at station
- 📤 **Export orders to PDF** - With all annotations included
- 🔔 **Real-time notifications** - Alert kitchen when notes are added
- 🎨 **UI Polish** - Tailwind CSS modernization (mentioned in old notes)
- 🚀 **Production Guide** - Docker deployment and client handover

**Questions?** Check the `ORDER_MANAGEMENT_IMPLEMENTATION.md` file for detailed technical info.
