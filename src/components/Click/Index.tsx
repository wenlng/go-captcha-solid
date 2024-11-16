/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {Component, createEffect, createMemo, For} from 'solid-js';
import {createStore} from "solid-js/store";
import {ClickData} from "./meta/data";
import {ClickConfig, defaultConfig} from "./meta/config";
import {ClickEvent} from "./meta/event";

import {useHandler} from "./hooks/useHandler";
import LoadingIcon from './../../assets/icons/LoadingIcon'
import CloseIcon from './../../assets/icons/CloseIcon'
import RefreshIcon from './../../assets/icons/RefreshIcon'

export interface ClickRef {
  reset: () => void,
  clear: () => void,
  refresh: () => void,
  close: () => void,
}

export interface Props {
  data?: ClickData,
  config?: ClickConfig;
  events?: ClickEvent,
  [x: string]: any,
}

const Index: Component<Props> = (props) => {
  const [localConfig, setLocalConfig] = createStore<ClickConfig>({
    ...defaultConfig(),
  });
  createEffect(() => {
    setLocalConfig((s) => ({
      ...s,
      ...(props.config || {}),
    }));
  });

  const [localData, setLocalData] = createStore<ClickData>({image: "", thumb: ""});
  createEffect(() => {
    setLocalData((s) => ({
      ...s,
      ...(props.data || {}),
    }));
  });

  const [localEvents, setLocalEvents] = createStore<ClickEvent>({});
  createEffect(() => {
    setLocalEvents((s) => ({
      ...s,
      ...(props.events || {}),
    }));
  });

  const handler = useHandler(localData, localEvents, () => {
    setLocalData((s) => ({
      ...s,
      thumb: '',
      image: ''
    }))
  });

  const hasDisplayWrapperState = createMemo(() => ((localConfig.width || 0) > 0 || (localConfig.height || 0) > 0));
  const hasDisplayImageState = createMemo(() => (localData.image != '' && localData.thumb != ''));

  const style = createMemo(() => {
    const hPadding = localConfig.horizontalPadding || 0
    const vPadding = localConfig.verticalPadding || 0
    const width = (localConfig.width || 0) + ( hPadding * 2) + (localConfig.showTheme ? 2 : 0)

    return {
      "width":  width+ "px",
      "padding-left": hPadding + "px",
      "padding-right": vPadding + "px",
      "padding-top": vPadding + "px",
      "padding-bottom": vPadding + "px",
      "display": hasDisplayWrapperState() ? 'block' : 'none'
    }
  });

  return (
    <div
      class="go-captcha gc-wrapper gc-click-mode"
      classList={{"gc-theme": localConfig.showTheme}}
      style={style()}
      ref={(el) => {
        props.ref({
          current: el,
          reset: handler.resetData,
          clear: handler.clearData,
          refresh: handler.refresh,
          close: handler.close
        })
      }}
    >
      <div class="gc-header">
        <span>{localConfig.title}</span>
        <img
          classList={{"gc-hide": localData?.thumb == ''}}
          style={{
            width: localConfig.thumbWidth + "px",
            height: localConfig.thumbHeight + "px",
            display: hasDisplayImageState() ? 'block' : 'none'
          }}
          src={localData?.thumb}
          alt=""
        />
      </div>
      <div
        class="gc-body"
        style={{
          width: localConfig.width + "px",
          height: localConfig.height + "px"
        }}
      >
        <div class="gc-loading">
          <LoadingIcon />
        </div>
        <img
          class="gc-picture"
          classList={{"gc-hide": localData?.image == ''}}
          style={{
            width: localConfig.width + "px",
            height: localConfig.height + "px",
            display: hasDisplayImageState() ? 'block' : 'none'
          }}
          src={localData?.image}
          onClick={handler.clickEvent}
          alt=""
        />
        <div class="gc-dots">
          <For each={handler.dots()}>{(dot)=>(<div class="gc-dot" style={{
            top: (dot.y - ((localConfig.dotSize || 1)/2)-1) + "px",
            left: (dot.x - ((localConfig.dotSize || 1)/2)-1) + "px",
          }}>{dot.index}</div>)}</For>
        </div>
      </div>
      <div class="gc-footer">
        <div class="gc-icon-block">
          <CloseIcon
            width={localConfig.iconSize}
            height={localConfig.iconSize}
            onClick={handler.closeEvent}
          />
          <RefreshIcon
            width={localConfig.iconSize}
            height={localConfig.iconSize}
            onClick={handler.refreshEvent}
          />
        </div>
        <div class="gc-button-block">
          <button
            classList={{"disabled": !hasDisplayImageState()}}
            onClick={handler.confirmEvent}
          >{localConfig.buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default Index