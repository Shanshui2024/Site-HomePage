/**
 * 个人简介页面 - TypeScript类型定义
 * 
 * 本文件定义了整个应用程序使用的所有数据模型接口和UI组件Props接口
 * 验证需求：10.2, 10.3
 */

// ============================================================================
// 数据模型接口
// ============================================================================

/**
 * 个人信息数据模型
 * 用于首页和关于页面展示个人基本信息
 */
export interface Profile {
  /** 姓名 */
  name: string;
  /** 职位/头衔 */
  title: string;
  /** 个人简介 */
  bio: string;
  /** 头像图片路径 */
  avatar: string;
  /** 邮箱地址 */
  email: string;
  /** 社交媒体链接 */
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
}

/**
 * 技术项数据模型
 * 表示单个技术栈项目
 */
export interface TechItem {
  /** 技术名称 */
  name: string;
  /** 图标标识符或路径 */
  icon: string;
  /** 熟练度级别 */
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  /** 所属类别 */
  category: string;
}

/**
 * 技术栈类别数据模型
 * 用于分组展示技术栈
 */
export interface TechCategory {
  /** 类别名称（如"前端开发"、"后端开发"） */
  name: string;
  /** 该类别下的技术项列表 */
  items: TechItem[];
}

/**
 * 技术栈完整数据模型
 * 包含所有技术栈分类
 */
export interface TechStackData {
  /** 技术栈分类列表 */
  categories: TechCategory[];
}

/**
 * 博客文章元数据
 * 从Markdown文件的frontmatter解析
 */
export interface BlogMetadata {
  /** 文章标题 */
  title: string;
  /** 文章摘要/描述 */
  description: string;
  /** 发布日期（ISO 8601格式） */
  date: string;
  /** 标签列表 */
  tags: string[];
  /** 封面图片路径（可选） */
  coverImage?: string;
}

/**
 * 博客文章完整数据模型
 * 包含元数据和内容
 */
export interface BlogPost extends BlogMetadata {
  /** 文章唯一标识符（URL slug） */
  slug: string;
  /** Markdown格式的文章内容 */
  content: string;
}

/**
 * 友情链接数据模型
 */
export interface FriendLink {
  /** 友链名称 */
  name: string;
  /** 友链描述 */
  description: string;
  /** 友链URL */
  url: string;
  /** 友链头像图片路径 */
  avatar: string;
}

/**
 * 友链列表数据模型
 */
export interface FriendLinksData {
  /** 友情链接列表 */
  links: FriendLink[];
}

/**
 * 教育背景数据模型
 */
export interface Education {
  /** 学校名称 */
  school: string;
  /** 学位 */
  degree: string;
  /** 时间段 */
  period: string;
}

/**
 * 工作经历数据模型
 */
export interface Experience {
  /** 公司名称 */
  company: string;
  /** 职位 */
  position: string;
  /** 时间段 */
  period: string;
  /** 工作描述 */
  description: string;
}

/**
 * 时间线事件数据模型
 */
export interface TimelineEvent {
  /** 年份 */
  year: string;
  /** 事件描述 */
  event: string;
}

/**
 * 关于页面数据模型
 */
export interface AboutData {
  /** 详细个人简介（支持Markdown） */
  introduction: string;
  /** 教育背景列表（可选） */
  education?: Education[];
  /** 工作经历列表（可选） */
  experience?: Experience[];
  /** 时间线事件列表（可选） */
  timeline?: TimelineEvent[];
}

// ============================================================================
// 导航组件接口
// ============================================================================

/**
 * 导航项数据模型
 */
export interface NavItem {
  /** 导航项显示文本 */
  label: string;
  /** 导航链接路径 */
  href: string;
  /** 图标（可选） */
  icon?: React.ReactNode;
}

/**
 * 导航组件Props
 */
export interface NavigationProps {
  /** 当前页面路径，用于高亮激活状态 */
  currentPath: string;
}

/**
 * 移动端菜单组件Props
 */
export interface MobileMenuProps {
  /** 菜单是否打开 */
  isOpen: boolean;
  /** 关闭菜单的回调函数 */
  onClose: () => void;
  /** 当前页面路径 */
  currentPath: string;
}

// ============================================================================
// 动画组件接口
// ============================================================================

/**
 * 渐入动画组件Props
 */
export interface FadeInProps {
  /** 要应用动画的子元素 */
  children: React.ReactNode;
  /** 动画延迟（毫秒），默认0 */
  delay?: number;
  /** 动画持续时间（毫秒），默认300，最大300 */
  duration?: number;
  /** 自定义className */
  className?: string;
}

/**
 * 滑入动画组件Props
 */
export interface SlideInProps {
  /** 要应用动画的子元素 */
  children: React.ReactNode;
  /** 滑入方向 */
  direction?: 'left' | 'right' | 'up' | 'down';
  /** 动画延迟（毫秒），默认0 */
  delay?: number;
  /** 动画持续时间（毫秒），默认300，最大300 */
  duration?: number;
  /** 自定义className */
  className?: string;
}

// ============================================================================
// UI组件接口
// ============================================================================

/**
 * 按钮变体类型
 */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

/**
 * 按钮尺寸类型
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * 按钮组件Props
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮变体样式 */
  variant?: ButtonVariant;
  /** 按钮尺寸 */
  size?: ButtonSize;
  /** 是否为全宽按钮 */
  fullWidth?: boolean;
  /** 子元素 */
  children: React.ReactNode;
}

/**
 * 卡片组件Props
 */
export interface CardProps {
  /** 卡片内容 */
  children: React.ReactNode;
  /** 是否可悬停（添加悬停效果） */
  hoverable?: boolean;
  /** 是否可点击 */
  clickable?: boolean;
  /** 点击事件处理函数 */
  onClick?: () => void;
  /** 自定义className */
  className?: string;
}

/**
 * 徽章组件Props
 */
export interface BadgeProps {
  /** 徽章文本 */
  children: React.ReactNode;
  /** 徽章变体 */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** 自定义className */
  className?: string;
}

// ============================================================================
// 页面组件接口
// ============================================================================

/**
 * 博客文章卡片组件Props
 */
export interface BlogPostCardProps {
  /** 博客文章数据 */
  post: BlogPost;
}

/**
 * 博客文章列表组件Props
 */
export interface BlogListProps {
  /** 博客文章列表 */
  posts: BlogPost[];
  /** 当前选中的标签（用于筛选） */
  selectedTag?: string;
}

/**
 * 标签筛选组件Props
 */
export interface TagFilterProps {
  /** 所有可用标签 */
  tags: string[];
  /** 当前选中的标签 */
  selectedTag?: string;
  /** 标签选择变化的回调函数 */
  onTagChange: (tag: string | undefined) => void;
}

/**
 * 技术栈网格组件Props
 */
export interface TechStackGridProps {
  /** 技术栈数据 */
  data: TechStackData;
}

/**
 * 技术项卡片组件Props
 */
export interface TechItemCardProps {
  /** 技术项数据 */
  item: TechItem;
}

/**
 * 友链卡片组件Props
 */
export interface FriendLinkCardProps {
  /** 友链数据 */
  link: FriendLink;
}

/**
 * 友链列表组件Props
 */
export interface FriendLinksProps {
  /** 友链列表 */
  links: FriendLink[];
}

/**
 * Markdown渲染器组件Props
 */
export interface MarkdownRendererProps {
  /** Markdown内容 */
  content: string;
  /** 自定义className */
  className?: string;
}

/**
 * 时间线组件Props
 */
export interface TimelineProps {
  /** 时间线事件列表 */
  events: TimelineEvent[];
}

// ============================================================================
// 工具类型
// ============================================================================

/**
 * 响应式断点类型
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * 主题颜色类型
 */
export type ThemeColor = 'primary' | 'secondary' | 'accent' | 'neutral';

/**
 * 动画配置
 */
export interface AnimationConfig {
  /** 动画持续时间（毫秒），最大300 */
  duration: number;
  /** 动画延迟（毫秒） */
  delay?: number;
  /** 缓动函数 */
  easing?: string;
}

/**
 * 页面元数据
 */
export interface PageMetadata {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description: string;
  /** Open Graph图片 */
  ogImage?: string;
  /** 关键词 */
  keywords?: string[];
}

// ============================================================================
// Re-export validation schemas
// ============================================================================

export {
  ProfileSchema as profileSchema,
  TechStackDataSchema as techStackSchema,
  FriendLinksDataSchema as friendLinksSchema,
  AboutDataSchema as aboutSchema,
  BlogPostSchema as blogPostSchema,
  BlogMetadataSchema as blogMetadataSchema,
} from '@/lib/validation';
