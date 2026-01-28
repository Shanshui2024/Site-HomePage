/**
 * 颜色对比度属性测试
 * 
 * Feature: personal-portfolio, Property 3: 颜色对比度符合WCAG标准
 * 
 * *对于任意*主题配置中的文字和背景颜色组合，对比度应该满足WCAG AA标准
 * （至少4.5:1用于正常文本，3:1用于大文本）。
 * 
 * **Validates: Requirements 2.4**
 */

import * as fc from 'fast-check';

// TailwindCSS主题颜色配置（与tailwind.config.ts一致）
const PRIMARY_COLORS = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',  // Main blue color
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
};

// 常用背景颜色
const BACKGROUND_COLORS = {
  white: '#ffffff',
  black: '#000000',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray900: '#111827',
};

// 常用文本颜色
const TEXT_COLORS = {
  black: '#000000',
  white: '#ffffff',
  gray900: '#111827',
  gray800: '#1f2937',
  gray700: '#374151',
  gray600: '#4b5563',
  gray100: '#f3f4f6',
};

// WCAG对比度标准
const WCAG_AA_NORMAL_TEXT = 4.5;  // 正常文本最小对比度
const WCAG_AA_LARGE_TEXT = 3.0;   // 大文本最小对比度

/**
 * 将十六进制颜色转换为RGB值
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * 计算相对亮度（根据WCAG 2.1标准）
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * 计算两个颜色之间的对比度（根据WCAG 2.1标准）
 * https://www.w3.org/WAI/GL/wiki/Contrast_ratio
 */
function getContrastRatio(foreground: string, background: string): number {
  const l1 = getRelativeLuminance(foreground);
  const l2 = getRelativeLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 检查对比度是否符合WCAG AA标准
 */
function meetsWCAGAA(foreground: string, background: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  const threshold = isLargeText ? WCAG_AA_LARGE_TEXT : WCAG_AA_NORMAL_TEXT;
  return ratio >= threshold;
}

/**
 * 项目中实际使用的颜色组合
 * 这些是在组件中实际使用的前景色/背景色组合
 */
const ACTUAL_COLOR_COMBINATIONS = [
  // 主要文本颜色在白色背景上
  { foreground: TEXT_COLORS.gray900, background: BACKGROUND_COLORS.white, description: '深灰文本在白色背景', isLargeText: false },
  { foreground: TEXT_COLORS.gray800, background: BACKGROUND_COLORS.white, description: '灰色文本在白色背景', isLargeText: false },
  { foreground: TEXT_COLORS.gray700, background: BACKGROUND_COLORS.white, description: '中灰文本在白色背景', isLargeText: false },
  
  // 主色调在白色背景上
  { foreground: PRIMARY_COLORS[600], background: BACKGROUND_COLORS.white, description: '主蓝色600在白色背景', isLargeText: false },
  { foreground: PRIMARY_COLORS[700], background: BACKGROUND_COLORS.white, description: '主蓝色700在白色背景', isLargeText: false },
  { foreground: PRIMARY_COLORS[800], background: BACKGROUND_COLORS.white, description: '主蓝色800在白色背景', isLargeText: false },
  
  // 白色文本在深色背景上
  { foreground: TEXT_COLORS.white, background: PRIMARY_COLORS[600], description: '白色文本在主蓝色600背景', isLargeText: false },
  { foreground: TEXT_COLORS.white, background: PRIMARY_COLORS[700], description: '白色文本在主蓝色700背景', isLargeText: false },
  { foreground: TEXT_COLORS.white, background: BACKGROUND_COLORS.gray900, description: '白色文本在深灰背景', isLargeText: false },
  
  // 大文本组合（标题等）
  { foreground: TEXT_COLORS.gray900, background: BACKGROUND_COLORS.white, description: '深灰标题在白色背景', isLargeText: true },
  { foreground: PRIMARY_COLORS[500], background: BACKGROUND_COLORS.white, description: '主蓝色500标题在白色背景', isLargeText: true },
  
  // 浅色背景上的文本
  { foreground: TEXT_COLORS.gray900, background: PRIMARY_COLORS[50], description: '深灰文本在浅蓝背景', isLargeText: false },
  { foreground: TEXT_COLORS.gray800, background: PRIMARY_COLORS[100], description: '灰色文本在浅蓝100背景', isLargeText: false },
];

/**
 * Feature: personal-portfolio, Property 3: 颜色对比度符合WCAG标准
 */
describe('Property 3: 颜色对比度符合WCAG标准', () => {
  /**
   * 生成有效的十六进制颜色
   */
  const hexColorArbitrary = fc.tuple(
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 }),
    fc.integer({ min: 0, max: 255 })
  ).map(([r, g, b]) => 
    `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  );

  /**
   * Property 3.1: 对比度计算函数正确性
   * 
   * 验证：对比度计算应该返回1到21之间的值
   */
  it('对比度计算应返回1到21之间的值', () => {
    fc.assert(
      fc.property(
        // 生成有效的十六进制颜色
        hexColorArbitrary,
        hexColorArbitrary,
        (color1, color2) => {
          const ratio = getContrastRatio(color1, color2);
          // 对比度范围应该在1（相同颜色）到21（黑白）之间
          return ratio >= 1 && ratio <= 21;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.2: 对比度计算对称性
   * 
   * 验证：交换前景色和背景色不应改变对比度值
   */
  it('交换前景色和背景色不应改变对比度值', () => {
    fc.assert(
      fc.property(
        hexColorArbitrary,
        hexColorArbitrary,
        (color1, color2) => {
          const ratio1 = getContrastRatio(color1, color2);
          const ratio2 = getContrastRatio(color2, color1);
          // 允许浮点数精度误差
          return Math.abs(ratio1 - ratio2) < 0.0001;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.3: 相同颜色对比度为1
   * 
   * 验证：相同颜色的对比度应该为1
   */
  it('相同颜色的对比度应该为1', () => {
    fc.assert(
      fc.property(
        hexColorArbitrary,
        (color) => {
          const ratio = getContrastRatio(color, color);
          return Math.abs(ratio - 1) < 0.0001;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.4: 黑白对比度最大
   * 
   * 验证：黑色和白色之间的对比度应该接近21
   */
  it('黑色和白色之间的对比度应该接近21', () => {
    const ratio = getContrastRatio('#000000', '#ffffff');
    expect(ratio).toBeCloseTo(21, 0);
  });

  /**
   * Property 3.5: 项目实际使用的颜色组合符合WCAG AA标准
   * 
   * 验证：所有在项目中实际使用的颜色组合都应该符合WCAG AA标准
   */
  it('项目实际使用的颜色组合应符合WCAG AA标准', () => {
    const failedCombinations: string[] = [];

    ACTUAL_COLOR_COMBINATIONS.forEach(({ foreground, background, description, isLargeText }) => {
      const ratio = getContrastRatio(foreground, background);
      const threshold = isLargeText ? WCAG_AA_LARGE_TEXT : WCAG_AA_NORMAL_TEXT;
      const passes = ratio >= threshold;

      if (!passes) {
        failedCombinations.push(
          `${description}: 对比度 ${ratio.toFixed(2)}:1 (需要 ${threshold}:1)`
        );
      }
    });

    if (failedCombinations.length > 0) {
      throw new Error(
        `以下颜色组合不符合WCAG AA标准:\n${failedCombinations.join('\n')}`
      );
    }
  });

  /**
   * Property 3.6: 主色调与白色背景的对比度
   * 
   * 验证：用于文本的主色调（600-900）在白色背景上应符合WCAG AA标准
   */
  it('主色调600-900在白色背景上应符合WCAG AA标准（正常文本）', () => {
    const textPrimaryColors = [
      PRIMARY_COLORS[600],
      PRIMARY_COLORS[700],
      PRIMARY_COLORS[800],
      PRIMARY_COLORS[900],
    ];

    textPrimaryColors.forEach((color) => {
      const ratio = getContrastRatio(color, BACKGROUND_COLORS.white);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
    });
  });

  /**
   * Property 3.7: 白色文本在深色主色调背景上的对比度
   * 
   * 验证：白色文本在深色主色调背景（600-900）上应符合WCAG AA标准
   */
  it('白色文本在主色调600-900背景上应符合WCAG AA标准', () => {
    const darkPrimaryColors = [
      PRIMARY_COLORS[600],
      PRIMARY_COLORS[700],
      PRIMARY_COLORS[800],
      PRIMARY_COLORS[900],
    ];

    darkPrimaryColors.forEach((color) => {
      const ratio = getContrastRatio(TEXT_COLORS.white, color);
      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL_TEXT);
    });
  });

  /**
   * Property 3.8: 对于任意深色主色调，白色文本应符合WCAG AA标准
   * 
   * 验证：使用属性测试验证深色主色调与白色文本的组合
   */
  it('对于任意深色主色调（600-900），白色文本应符合WCAG AA标准', () => {
    const darkPrimaryColorValues = [
      PRIMARY_COLORS[600],
      PRIMARY_COLORS[700],
      PRIMARY_COLORS[800],
      PRIMARY_COLORS[900],
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...darkPrimaryColorValues),
        (backgroundColor) => {
          const ratio = getContrastRatio(TEXT_COLORS.white, backgroundColor);
          return ratio >= WCAG_AA_NORMAL_TEXT;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.9: 对于任意浅色背景，深色文本应符合WCAG AA标准
   * 
   * 验证：深色文本在浅色背景上应符合WCAG AA标准
   */
  it('对于任意浅色背景，深色文本应符合WCAG AA标准', () => {
    const lightBackgrounds = [
      BACKGROUND_COLORS.white,
      BACKGROUND_COLORS.gray50,
      BACKGROUND_COLORS.gray100,
      PRIMARY_COLORS[50],
      PRIMARY_COLORS[100],
    ];

    const darkTexts = [
      TEXT_COLORS.gray900,
      TEXT_COLORS.gray800,
      TEXT_COLORS.gray700,
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...lightBackgrounds),
        fc.constantFrom(...darkTexts),
        (background, text) => {
          const ratio = getContrastRatio(text, background);
          return ratio >= WCAG_AA_NORMAL_TEXT;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.10: 大文本对比度要求较低
   * 
   * 验证：大文本（18pt或14pt粗体）只需要3:1的对比度
   */
  it('大文本只需要3:1的对比度', () => {
    // 主色调500在白色背景上作为大文本应该通过
    const ratio = getContrastRatio(PRIMARY_COLORS[500], BACKGROUND_COLORS.white);
    expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_LARGE_TEXT);
  });

  /**
   * Property 3.11: 相对亮度计算正确性
   * 
   * 验证：相对亮度应该在0到1之间
   */
  it('相对亮度应该在0到1之间', () => {
    fc.assert(
      fc.property(
        hexColorArbitrary,
        (color) => {
          const luminance = getRelativeLuminance(color);
          return luminance >= 0 && luminance <= 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3.12: 黑色亮度为0，白色亮度为1
   * 
   * 验证：黑色的相对亮度应该为0，白色应该为1
   */
  it('黑色亮度为0，白色亮度为1', () => {
    const blackLuminance = getRelativeLuminance('#000000');
    const whiteLuminance = getRelativeLuminance('#ffffff');
    
    expect(blackLuminance).toBeCloseTo(0, 5);
    expect(whiteLuminance).toBeCloseTo(1, 5);
  });
});
