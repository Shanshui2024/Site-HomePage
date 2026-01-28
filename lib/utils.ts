/**
 * 通用工具函数
 */

/**
 * Fisher-Yates 洗牌算法 - 随机打乱数组
 * @param array 要打乱的数组
 * @returns 打乱后的新数组（不修改原数组）
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
