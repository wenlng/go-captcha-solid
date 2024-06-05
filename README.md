# Go Captcha Solid Package

```shell
yarn add go-captcha-solid
# or
npm install go-captcha-solid
# or
pnpm install go-captcha-solid
```

## 🖖 Click Mode Captcha
```jsx
import GoCaptcha from 'go-captcha-solid';

<GoCaptcha.Click
  config={{}}
  data={{}}
  events={{}}
/>
```

### params
```ts
// config = {}
interface Config {
  width?: number;
  height?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
  showTheme?: boolean;
  title?: string;
  buttonText?: string;
}

// data = {}
interface Data {
  image: string;
  thumb: string;
}

// events = {}
interface Events {
  click?: (x: number, y: number) => void;
  refresh?: () => void;
  close?: () => void;
  confirm?: (dots: Array<CaptchaDot>) => boolean;
}
```

## 🖖 Slide Mode Captcha
```jsx
import GoCaptcha from 'go-captcha-solid';

<GoCaptcha.Slide
  config={{}}
  data={{}}
  events={{}}
/>

<GoCaptcha.SlideRegion
  config={{}}
  data={{}}
  events={{}}
/>
```
### Parameter Reference
```ts
// config = {}
interface Config {
  width?: number;
  height?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
  showTheme?: boolean;
  title?: string;
}

// data = {}
interface Data {
  thumbX: number;
  thumbY: number;
  thumbWidth: number;
  thumbHeight: number;
  image: string;
  thumb: string;
}

// events = {}
interface Events {
  move?: (x: number, y: number) => void;
  refresh?: () => void;
  close?: () => void;
  confirm?: (point: CaptchaPoint) => boolean;
}
```


## 🖖 Rotate Mode Captcha
```jsx
import GoCaptcha from 'go-captcha-solid';

<GoCaptcha.Rotate
  config={{}}
  data={{}}
  events={{}}
/>
```

### Parameter Reference
```ts
// config = {}
interface Config {
  width?: number;
  height?: number;
  thumbWidth?: number;
  thumbHeight?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
  showTheme?: boolean;
  title?: string;
}

// data = {}
interface Data {
  angle: number;
  image: string;
  thumb: string;
}

// events = {}
interface Events {
  rotate?: (angle: number) => void;
  refresh?: () => void;
  close?: () => void;
  confirm?: (angle: number) => boolean;
}
```


## 🖖 Button
```jsx
import GoCaptcha from 'go-captcha-solid';

<GoCaptcha.Button />
```

### Parameter Reference
```ts
interface _ {
  config?: CaptchaConfig;
  clickEvent?: () => void;
  disabled?: boolean;
  type?: "default" | "warn" | "error" | "success";
  title?: string;
}

export interface CaptchaConfig {
  width?: number;
  height?: number;
  verticalPadding?: number;
  horizontalPadding?: number;
}
```