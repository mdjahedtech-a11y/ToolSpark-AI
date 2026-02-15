import { LucideIcon } from 'lucide-react';

export enum ToolCategory {
  UTILITY = 'Utility',
  DAILY = 'Daily',
  AI = 'AI',
}

export enum ToolType {
  // Utility
  AGE_CALCULATOR = 'AGE_CALCULATOR',
  EMI_CALCULATOR = 'EMI_CALCULATOR',
  GPA_CALCULATOR = 'GPA_CALCULATOR',
  PERCENTAGE_CALCULATOR = 'PERCENTAGE_CALCULATOR',
  LOAN_CALCULATOR = 'LOAN_CALCULATOR',
  CURRENCY_CONVERTER = 'CURRENCY_CONVERTER',
  
  // Daily
  STYLISH_TEXT = 'STYLISH_TEXT',
  PASSWORD_GENERATOR = 'PASSWORD_GENERATOR',
  QR_GENERATOR = 'QR_GENERATOR',
  RANDOM_NAME = 'RANDOM_NAME',
  
  // AI
  AI_CAPTION = 'AI_CAPTION',
  AI_STORY = 'AI_STORY',
  AI_STUDY = 'AI_STUDY',
}

export interface ToolDef {
  id: ToolType;
  title: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  color: string;
}

export interface AdConfig {
  usageCount: number;
  threshold: number;
}