// Slice de lista de compras
export const createShoppingListSlice = (set, get) => ({
  // Estado
  shoppingList: {
    items: [],
    totalBs: 0,
    totalUsd: 0,
    lastUpdated: null
  },
  
  // Acciones
  addToShoppingList: (product) => set((state) => {
    const existingItem = state.shoppingList.items.find(
      item => item.id === product.id
    )
    
    let newItems
    if (existingItem) {
      newItems = state.shoppingList.items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      newItems = [...state.shoppingList.items, { ...product, quantity: 1 }]
    }
    
    const totalBs = newItems.reduce((sum, item) => 
      sum + (item.price_bs * item.quantity), 0
    )
    const totalUsd = newItems.reduce((sum, item) => 
      sum + (item.price_usd * item.quantity), 0
    )
    
    return {
      shoppingList: {
        items: newItems,
        totalBs,
        totalUsd,
        lastUpdated: new Date().toISOString()
      }
    }
  }),
  
  removeFromShoppingList: (productId) => set((state) => {
    const newItems = state.shoppingList.items.filter(
      item => item.id !== productId
    )
    
    const totalBs = newItems.reduce((sum, item) => 
      sum + (item.price_bs * item.quantity), 0
    )
    const totalUsd = newItems.reduce((sum, item) => 
      sum + (item.price_usd * item.quantity), 0
    )
    
    return {
      shoppingList: {
        items: newItems,
        totalBs,
        totalUsd,
        lastUpdated: new Date().toISOString()
      }
    }
  }),
  
  updateShoppingListQuantity: (productId, quantity) => set((state) => {
    const newItems = state.shoppingList.items.map(item =>
      item.id === productId
        ? { ...item, quantity: Math.max(0, quantity) }
        : item
    ).filter(item => item.quantity > 0)
    
    const totalBs = newItems.reduce((sum, item) => 
      sum + (item.price_bs * item.quantity), 0
    )
    const totalUsd = newItems.reduce((sum, item) => 
      sum + (item.price_usd * item.quantity), 0
    )
    
    return {
      shoppingList: {
        items: newItems,
        totalBs,
        totalUsd,
        lastUpdated: new Date().toISOString()
      }
    }
  }),
  
  clearShoppingList: () => set({
    shoppingList: {
      items: [],
      totalBs: 0,
      totalUsd: 0,
      lastUpdated: new Date().toISOString()
    }
  }),
  
  // Getters
  getShoppingListItems: () => get().shoppingList.items,
  getShoppingListTotal: () => ({
    bs: get().shoppingList.totalBs,
    usd: get().shoppingList.totalUsd
  }),
  getShoppingListItemCount: () => {
    const items = get().shoppingList.items
    return items.reduce((count, item) => count + item.quantity, 0)
  },
  isItemInShoppingList: (productId) => {
    const items = get().shoppingList.items
    return items.some(item => item.id === productId)
  },
  getItemQuantity: (productId) => {
    const items = get().shoppingList.items
    const item = items.find(item => item.id === productId)
    return item ? item.quantity : 0
  }
})