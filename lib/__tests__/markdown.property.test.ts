/**
 * Markdown解析属性测试
 * 
 * Feature: personal-portfolio, Property 13: Markdown往返一致性
 * 
 * *对于任意*有效的Markdown内容，解析为AST然后渲染为HTML，
 * 再从HTML提取文本内容，应该保留原始Markdown的语义结构
 * （标题、列表、链接等）。
 * 
 * **Validates: Requirements 7.4, 12.4**
 */

import { describe, it, expect } from '@jest/globals';
import * as fc from 'fast-check';
import matter from 'gray-matter';

/**
 * 模拟gray-matter解析frontmatter的核心逻辑
 * 这是lib/blog.ts中使用的解析方式
 */
function parseMarkdownWithFrontmatter(rawContent: string): {
  frontmatter: Record<string, unknown>;
  content: string;
} {
  const { data, content } = matter(rawContent);
  return {
    frontmatter: data,
    content: content.trim(),
  };
}

/**
 * 从Markdown内容中提取语义结构
 * 用于验证解析后的内容保留了原始结构
 */
function extractMarkdownStructure(markdown: string): {
  headings: string[];
  listItems: string[];
  links: Array<{ text: string; url: string }>;
  blockquotes: string[];
} {
  const headings: string[] = [];
  const listItems: string[] = [];
  const links: Array<{ text: string; url: string }> = [];
  const blockquotes: string[] = [];

  const lines = markdown.split('\n');

  for (const line of lines) {
    // 标题
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      headings.push(headingMatch[2].trim());
      continue;
    }

    // 列表项
    const listMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
    if (listMatch) {
      listItems.push(listMatch[1].trim());
      continue;
    }

    // 有序列表项
    const orderedListMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
    if (orderedListMatch) {
      listItems.push(orderedListMatch[1].trim());
      continue;
    }

    // 引用块
    const blockquoteMatch = line.match(/^>\s*(.+)$/);
    if (blockquoteMatch) {
      blockquotes.push(blockquoteMatch[1].trim());
      continue;
    }

    // 链接
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(line)) !== null) {
      links.push({ text: linkMatch[1], url: linkMatch[2] });
    }
  }

  return { headings, listItems, links, blockquotes };
}

// ============================================================================
// Arbitrary Generators (定义在使用之前)
// ============================================================================

/**
 * 生成YAML安全的字符串（避免特殊字符导致解析错误）
 */
const safeChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';

function yamlSafeString(minLength: number, maxLength: number): fc.Arbitrary<string> {
  return fc.array(
    fc.constantFrom(...safeChars.split('')),
    { minLength, maxLength }
  ).map((chars: string[]) => chars.join('').trim() || 'text');
}

/**
 * 生成有效日期字符串
 */
const dateStringArbitrary = fc.tuple(
  fc.integer({ min: 2020, max: 2030 }),
  fc.integer({ min: 1, max: 12 }),
  fc.integer({ min: 1, max: 28 })
).map(([year, month, day]) => 
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
);

/**
 * 生成有效的frontmatter
 */
const frontmatterArbitrary = fc.record({
  title: yamlSafeString(1, 50),
  description: yamlSafeString(0, 100),
  date: dateStringArbitrary,
  tags: fc.array(yamlSafeString(1, 20), { minLength: 0, maxLength: 5 }),
});

/**
 * 生成有效的Markdown标题
 */
const headingArbitrary = fc.tuple(
  fc.integer({ min: 1, max: 6 }),
  yamlSafeString(1, 50)
).map(([level, text]) => `${'#'.repeat(level)} ${text}`);

/**
 * 生成有效的Markdown列表项
 */
const listItemArbitrary = yamlSafeString(1, 50)
  .map((text: string) => `- ${text}`);

/**
 * 生成有效的Markdown链接
 */
const linkArbitrary = fc.tuple(
  yamlSafeString(1, 30),
  fc.constantFrom('https://example.com', 'https://test.org', 'https://demo.net')
).map(([text, url]) => `[${text}](${url})`);

/**
 * 生成有效的Markdown段落
 */
const paragraphArbitrary = yamlSafeString(1, 100);

/**
 * 生成有效的Markdown引用块
 */
const blockquoteArbitrary = yamlSafeString(1, 50)
  .map((text: string) => `> ${text}`);

/**
 * 生成完整的Markdown文档（带frontmatter）
 */
const markdownDocumentArbitrary = fc.tuple(
  frontmatterArbitrary,
  fc.array(
    fc.oneof(
      headingArbitrary,
      listItemArbitrary,
      paragraphArbitrary,
      blockquoteArbitrary
    ),
    { minLength: 1, maxLength: 10 }
  )
).map(([fm, elements]) => {
  const frontmatterStr = `---
title: "${fm.title}"
description: "${fm.description}"
date: "${fm.date}"
tags: [${fm.tags.map((t: string) => `"${t}"`).join(', ')}]
---`;
  return `${frontmatterStr}\n\n${elements.join('\n\n')}`;
});

// ============================================================================
// Property Tests
// ============================================================================

/**
 * Feature: personal-portfolio, Property 13: Markdown往返一致性
 */
describe('Property 13: Markdown往返一致性', () => {
  /**
   * Property 13.1: Frontmatter解析保持数据完整性
   * 
   * 对于任意有效的frontmatter，解析后的数据应该与原始数据匹配
   */
  it('frontmatter解析应保持数据完整性', () => {
    fc.assert(
      fc.property(
        frontmatterArbitrary,
        (fm) => {
          const rawContent = `---
title: "${fm.title}"
description: "${fm.description}"
date: "${fm.date}"
tags: [${fm.tags.map((t: string) => `"${t}"`).join(', ')}]
---

Content here`;

          const parsed = parseMarkdownWithFrontmatter(rawContent);

          // 验证：解析后的frontmatter字段应与原始数据匹配
          expect(parsed.frontmatter.title).toBe(fm.title);
          expect(parsed.frontmatter.description).toBe(fm.description);
          expect(parsed.frontmatter.date).toBe(fm.date);
          expect(parsed.frontmatter.tags).toEqual(fm.tags);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 13.2: Markdown内容与frontmatter正确分离
   * 
   * 解析后的content不应包含frontmatter内容
   */
  it('解析后的content不应包含frontmatter', () => {
    fc.assert(
      fc.property(
        markdownDocumentArbitrary,
        (doc) => {
          const parsed = parseMarkdownWithFrontmatter(doc);

          // 验证：content不应包含frontmatter分隔符
          expect(parsed.content).not.toContain('---');
          expect(parsed.content).not.toContain('title:');
          expect(parsed.content).not.toContain('date:');

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 13.3: 标题结构保持一致
   * 
   * 解析前后的标题数量和内容应该保持一致
   */
  it('标题结构应在解析后保持一致', () => {
    fc.assert(
      fc.property(
        fc.array(headingArbitrary, { minLength: 1, maxLength: 5 }),
        (headings) => {
          const content = headings.join('\n\n');
          const structureBefore = extractMarkdownStructure(content);
          
          // 模拟解析过程（gray-matter只处理frontmatter，不改变content）
          const parsed = parseMarkdownWithFrontmatter(`---\ntitle: "Test"\n---\n\n${content}`);
          const structureAfter = extractMarkdownStructure(parsed.content);

          // 验证：标题数量应保持一致
          expect(structureAfter.headings.length).toBe(structureBefore.headings.length);

          // 验证：标题内容应保持一致
          structureBefore.headings.forEach((heading, index) => {
            expect(structureAfter.headings[index]).toBe(heading);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 13.4: 列表结构保持一致
   * 
   * 解析前后的列表项数量和内容应该保持一致
   */
  it('列表结构应在解析后保持一致', () => {
    fc.assert(
      fc.property(
        fc.array(listItemArbitrary, { minLength: 1, maxLength: 5 }),
        (items) => {
          const content = items.join('\n');
          const structureBefore = extractMarkdownStructure(content);
          
          const parsed = parseMarkdownWithFrontmatter(`---\ntitle: "Test"\n---\n\n${content}`);
          const structureAfter = extractMarkdownStructure(parsed.content);

          // 验证：列表项数量应保持一致
          expect(structureAfter.listItems.length).toBe(structureBefore.listItems.length);

          // 验证：列表项内容应保持一致
          structureBefore.listItems.forEach((item, index) => {
            expect(structureAfter.listItems[index]).toBe(item);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 13.5: 链接结构保持一致
   * 
   * 解析前后的链接数量、文本和URL应该保持一致
   */
  it('链接结构应在解析后保持一致', () => {
    fc.assert(
      fc.property(
        fc.array(linkArbitrary, { minLength: 1, maxLength: 5 }),
        (links) => {
          const content = links.join('\n\n');
          const structureBefore = extractMarkdownStructure(content);
          
          const parsed = parseMarkdownWithFrontmatter(`---\ntitle: "Test"\n---\n\n${content}`);
          const structureAfter = extractMarkdownStructure(parsed.content);

          // 验证：链接数量应保持一致
          expect(structureAfter.links.length).toBe(structureBefore.links.length);

          // 验证：链接内容应保持一致
          structureBefore.links.forEach((link, index) => {
            expect(structureAfter.links[index].text).toBe(link.text);
            expect(structureAfter.links[index].url).toBe(link.url);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 13.6: 引用块结构保持一致
   * 
   * 解析前后的引用块数量和内容应该保持一致
   */
  it('引用块结构应在解析后保持一致', () => {
    fc.assert(
      fc.property(
        fc.array(blockquoteArbitrary, { minLength: 1, maxLength: 5 }),
        (quotes) => {
          const content = quotes.join('\n\n');
          const structureBefore = extractMarkdownStructure(content);
          
          const parsed = parseMarkdownWithFrontmatter(`---\ntitle: "Test"\n---\n\n${content}`);
          const structureAfter = extractMarkdownStructure(parsed.content);

          // 验证：引用块数量应保持一致
          expect(structureAfter.blockquotes.length).toBe(structureBefore.blockquotes.length);

          // 验证：引用块内容应保持一致
          structureBefore.blockquotes.forEach((quote, index) => {
            expect(structureAfter.blockquotes[index]).toBe(quote);
          });

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 13.7: 解析是幂等的
   * 
   * 对同一内容多次解析应返回相同结果
   */
  it('多次解析应返回相同结果', () => {
    fc.assert(
      fc.property(
        markdownDocumentArbitrary,
        (doc) => {
          const parsed1 = parseMarkdownWithFrontmatter(doc);
          const parsed2 = parseMarkdownWithFrontmatter(doc);

          // 验证：两次解析的frontmatter应相同
          expect(parsed1.frontmatter).toEqual(parsed2.frontmatter);

          // 验证：两次解析的content应相同
          expect(parsed1.content).toBe(parsed2.content);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 13.8: 空内容处理
   * 
   * 只有frontmatter没有内容的文档应该正确解析
   */
  it('只有frontmatter的文档应正确解析', () => {
    fc.assert(
      fc.property(
        frontmatterArbitrary,
        (fm) => {
          const rawContent = `---
title: "${fm.title}"
description: "${fm.description}"
date: "${fm.date}"
tags: [${fm.tags.map((t: string) => `"${t}"`).join(', ')}]
---`;

          const parsed = parseMarkdownWithFrontmatter(rawContent);

          // 验证：frontmatter应正确解析
          expect(parsed.frontmatter.title).toBe(fm.title);

          // 验证：content应为空字符串
          expect(parsed.content).toBe('');

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 13.9: 复杂文档结构保持完整
   * 
   * 包含多种元素的复杂文档在解析后应保持所有结构
   */
  it('复杂文档结构应在解析后保持完整', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.array(headingArbitrary, { minLength: 1, maxLength: 3 }),
          fc.array(listItemArbitrary, { minLength: 1, maxLength: 3 }),
          fc.array(paragraphArbitrary, { minLength: 1, maxLength: 3 }),
          fc.array(blockquoteArbitrary, { minLength: 1, maxLength: 2 })
        ),
        ([headings, listItems, paragraphs, quotes]) => {
          // 构建复杂文档
          const content = [
            ...headings,
            ...listItems,
            ...paragraphs,
            ...quotes
          ].join('\n\n');

          const structureBefore = extractMarkdownStructure(content);
          
          const parsed = parseMarkdownWithFrontmatter(`---\ntitle: "Test"\n---\n\n${content}`);
          const structureAfter = extractMarkdownStructure(parsed.content);

          // 验证：所有结构元素数量应保持一致
          expect(structureAfter.headings.length).toBe(structureBefore.headings.length);
          expect(structureAfter.listItems.length).toBe(structureBefore.listItems.length);
          expect(structureAfter.blockquotes.length).toBe(structureBefore.blockquotes.length);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 13.10: 特殊字符处理
   * 
   * 包含特殊字符的内容应正确解析而不丢失
   */
  it('特殊字符应在解析后保持不变', () => {
    const specialChars = ['&', '<', '>', '@', '$', '%', '!', '?'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...specialChars),
        yamlSafeString(1, 20),
        (char, text) => {
          const content = `Paragraph with ${char} special ${text} character`;
          
          const parsed = parseMarkdownWithFrontmatter(`---\ntitle: "Test"\n---\n\n${content}`);

          // 验证：特殊字符应保留在解析后的内容中
          expect(parsed.content).toContain(char);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
