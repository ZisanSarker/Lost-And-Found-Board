export class ItemCategorizer {
  static categorizeItem(item: { title: string; description: string; category?: string }): string {
    if (item.category && item.category !== 'other') {
      return item.category;
    }
    
    const text = `${item.title} ${item.description}`.toLowerCase();
    
    const categoryPatterns = {
      electronics: ['phone', 'laptop', 'watch', 'tablet', 'headphones', 'charger'],
      accessories: ['wallet', 'keys', 'ring', 'jewelry', 'necklace', 'bracelet'],
      documents: ['document', 'book', 'card', 'passport', 'license', 'certificate'],
      clothing: ['shirt', 'jacket', 'pants', 'dress', 'shoes', 'clothing'],
      bags: ['bag', 'backpack', 'purse', 'suitcase', 'briefcase']
    };

    for (const [category, patterns] of Object.entries(categoryPatterns)) {
      if (patterns.some(pattern => text.includes(pattern))) {
        return category;
      }
    }

    return 'other';
  }
}