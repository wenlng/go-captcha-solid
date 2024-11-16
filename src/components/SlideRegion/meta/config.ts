/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

export interface SlideRegionConfig {
  width?: number;
  height?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
  showTheme?: boolean;
  title?: string;
  iconSize?: number;
  scope ?: boolean;
}

export const defaultConfig = ():SlideRegionConfig => ({
  width: 300,
  height: 220,
  verticalPadding: 16,
  horizontalPadding: 12,
  showTheme: true,
  title: "请拖动滑块完成拼图",
  iconSize: 22,
  scope: true,
})