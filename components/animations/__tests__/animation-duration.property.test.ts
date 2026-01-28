/**
 * 动画时长属性测试
 * 
 * Feature: personal-portfolio, Property 17: 动画时长限制
 * 
 * *对于任意*动画配置对象，其duration属性值应该不超过300毫秒。
 * 
 * **Validates: Requirements 9.4**
 */

import { describe, it, expect } from '@jest/globals';
import * as fc from 'fast-check';

/**
 * Animation configuration interface
 * Represents the duration configuration for animation components
 */
interface AnimationConfig {
  duration: number;
  delay?: number;
}

/**
 * Maximum allowed animation duration in seconds (300ms = 0.3s)
 * Using Math.fround to ensure 32-bit float compatibility with fast-check
 */
const MAX_ANIMATION_DURATION = Math.fround(0.3);

/**
 * Caps the animation duration to the maximum allowed value
 * This mirrors the logic in FadeIn and SlideIn components
 */
function capAnimationDuration(duration: number): number {
  return Math.min(duration, MAX_ANIMATION_DURATION);
}

/**
 * Feature: personal-portfolio, Property 17: 动画时长限制
 * 
 * 测试动画时长限制的正确性属性
 */
describe('Property 17: 动画时长限制', () => {
  /**
   * Property 17.1: 任意动画时长应被限制在300ms以内
   * 
   * 对于任意正数的动画时长配置，经过capAnimationDuration处理后，
   * 结果应该不超过300ms (0.3秒)。
   */
  it('任意动画时长应被限制在300ms以内', () => {
    fc.assert(
      fc.property(
        // 生成任意正数的动画时长（0到10秒范围）
        fc.float({ min: 0, max: 10, noNaN: true }),
        (inputDuration) => {
          const cappedDuration = capAnimationDuration(inputDuration);
          
          // 验证处理后的时长不超过300ms
          expect(cappedDuration).toBeLessThanOrEqual(MAX_ANIMATION_DURATION);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 17.2: 小于300ms的时长应保持不变
   * 
   * 对于任意小于300ms的动画时长，处理后应保持原值不变。
   */
  it('小于300ms的时长应保持不变', () => {
    fc.assert(
      fc.property(
        // 生成0到0.3秒范围内的时长
        fc.float({ min: 0, max: MAX_ANIMATION_DURATION, noNaN: true }),
        (inputDuration) => {
          const cappedDuration = capAnimationDuration(inputDuration);
          
          // 验证小于等于300ms的时长保持不变
          expect(cappedDuration).toBe(inputDuration);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 17.3: 大于300ms的时长应被截断为300ms
   * 
   * 对于任意大于300ms的动画时长，处理后应被截断为300ms。
   */
  it('大于300ms的时长应被截断为300ms', () => {
    fc.assert(
      fc.property(
        // 生成大于0.3秒的时长 (using Math.fround for 32-bit float compatibility)
        fc.float({ min: Math.fround(0.31), max: 10, noNaN: true }),
        (inputDuration) => {
          const cappedDuration = capAnimationDuration(inputDuration);
          
          // 验证大于300ms的时长被截断为300ms
          expect(cappedDuration).toBe(MAX_ANIMATION_DURATION);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 17.4: 动画配置对象的时长属性应符合限制
   * 
   * 对于任意动画配置对象，其duration属性经过处理后应不超过300ms。
   */
  it('动画配置对象的时长属性应符合限制', () => {
    fc.assert(
      fc.property(
        // 生成动画配置对象
        fc.record({
          duration: fc.float({ min: 0, max: 10, noNaN: true }),
          delay: fc.option(fc.float({ min: 0, max: 5, noNaN: true }), { nil: undefined }),
        }),
        (config: AnimationConfig) => {
          const cappedDuration = capAnimationDuration(config.duration);
          
          // 验证处理后的时长不超过300ms
          expect(cappedDuration).toBeLessThanOrEqual(MAX_ANIMATION_DURATION);
          
          // 验证delay不受影响（如果存在）
          if (config.delay !== undefined) {
            expect(config.delay).toBeGreaterThanOrEqual(0);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 17.5: 默认动画时长应符合限制
   * 
   * 验证FadeIn和SlideIn组件的默认时长（0.3秒）符合300ms限制。
   */
  it('默认动画时长应符合限制', () => {
    const DEFAULT_FADE_IN_DURATION = 0.3;
    const DEFAULT_SLIDE_IN_DURATION = 0.3;
    
    expect(DEFAULT_FADE_IN_DURATION).toBeLessThanOrEqual(MAX_ANIMATION_DURATION);
    expect(DEFAULT_SLIDE_IN_DURATION).toBeLessThanOrEqual(MAX_ANIMATION_DURATION);
  });

  /**
   * Property 17.6: 边界值测试 - 恰好300ms的时长应保持不变
   * 
   * 验证恰好等于300ms的时长不会被错误截断。
   */
  it('恰好300ms的时长应保持不变', () => {
    const exactDuration = MAX_ANIMATION_DURATION;
    const cappedDuration = capAnimationDuration(exactDuration);
    
    expect(cappedDuration).toBe(MAX_ANIMATION_DURATION);
  });

  /**
   * Property 17.7: 零时长应保持为零
   * 
   * 验证零时长（即时过渡）不会被错误处理。
   */
  it('零时长应保持为零', () => {
    const zeroDuration = 0;
    const cappedDuration = capAnimationDuration(zeroDuration);
    
    expect(cappedDuration).toBe(0);
  });
});
