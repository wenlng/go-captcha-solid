/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {ButtonConfig} from "./config";

export type ButtonType = "default" | "warn" | "error" | "success"

export interface Props {
  config?: ButtonConfig;
  clickEvent?: () => void;
  disabled?: boolean;
  type?: ButtonType;
  title?: string;
}

export interface ButtonState {
  disabled?: boolean;
  type?: ButtonType;
  title?: string;
}
