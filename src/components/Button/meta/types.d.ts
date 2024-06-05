import {CaptchaConfig} from "./config";

export type ButtonType = "default" | "warn" | "error" | "success"

export interface Props {
  config?: CaptchaConfig;
  clickEvent?: () => void;
  disabled?: boolean;
  type?: ButtonType;
  title?: string;
}

export interface State {
  disabled?: boolean;
  type?: ButtonType;
  title?: string;
}
