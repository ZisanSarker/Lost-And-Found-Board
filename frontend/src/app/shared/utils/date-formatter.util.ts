export function formatDate(date: Date): string {
  if (!date) return 'Unknown';

  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Unknown';
  }
}