/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {Component, createEffect, createMemo, onCleanup, onMount} from "solid-js";
import {createStore} from "solid-js/store";

import {SlideRegionConfig, defaultConfig} from "./meta/config";
import {useHandler} from "./hooks/useHandler";
import {defaultSlideRegionData, SlideRegionData} from "./meta/data";
import {SlideRegionEvent} from "./meta/event";

import CloseIcon from './../../assets/icons/CloseIcon'
import RefreshIcon from './../../assets/icons/RefreshIcon'
import LoadingIcon from './../../assets/icons/LoadingIcon'

export interface SlideRegionRef {
  reset: () => void,
  clear: () => void,
  refresh: () => void,
  close: () => void,
}

export interface Props {
  data: SlideRegionData,
  config?: SlideRegionConfig;
  events?: SlideRegionEvent,
  [x: string]: any,
}

const Index: Component<Props> = (props: Props) => {
  const [localConfig, setLocalConfig] = createStore<SlideRegionConfig>({
    ...defaultConfig(),
  });
  createEffect(() => {
    setLocalConfig((s) => ({
      ...s,
      ...(props.config || {}),
    }));
  });

  const [localData, setLocalData] = createStore<SlideRegionData>({
    ...defaultSlideRegionData(),
  });
  createEffect(() => {
    setLocalData((s) => ({
      ...s,
      ...(props.data || {}),
    }));
  });

  const [localEvents, setLocalEvents] = createStore<SlideRegionEvent>({});
  createEffect(() => {
    setLocalEvents((s) => ({
      ...s,
      ...(props.events || {}),
    }));
  });

  let rootRef: any = null
  let containerRef: any = null
  let tileRef: any = null

  const handler = useHandler(localData, localEvents, localConfig, () => {
    setLocalData({...localData, ...defaultSlideRegionData()})
  });

  const hasDisplayWrapperState = createMemo(() => ((localConfig.width || 0) > 0 || (localConfig.height || 0) > 0));
  const hasDisplayImageState = createMemo(() => (localData.image && localData.image.length > 0) && (localData.thumb && localData.thumb.length > 0));

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

  const fn = (event: any) => event.preventDefault()
  onMount(() => {
    handler.initRefs(rootRef, containerRef, tileRef)
    tileRef.addEventListener('dragstart', fn)
  });

  onCleanup(() => {
    tileRef.removeEventListener('dragstart', fn)
  })

  return <div
    class="go-captcha gc-wrapper gc-slide-mode"
    classList={{"gc-theme": localConfig.showTheme}}
    style={style()}
    ref={(el) => {
      rootRef = el
      props && props.ref && props.ref({
        current: el,
        reset: handler.resetData,
        clear: handler.clearData,
        refresh: handler.refresh,
        close: handler.close
      })
    }}
  >
    <div class="gc-header gc-center">
      <span>{localConfig.title}</span>
    </div>
    <div
      class="gc-body"
      ref={containerRef}
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
        classList={{"gc-hide": localData.image == ""}}
        src={localData.image}
        style={{
          width: localConfig.width + "px",
          height: localConfig.height + "px",
          display: hasDisplayImageState() ? 'block' : 'none'
        }}
        alt=""
      />
      <div
        class="gc-tile"
        ref={tileRef}
        style={{
          width: (localData.thumbWidth || 0) + 'px',
          height: (localData.thumbHeight || 0) + 'px',
          top: handler.thumbPoint.y + "px",
          left: handler.thumbPoint.x + "px"
        }} onMouseDown={handler.dragEvent}
        onTouchStart={handler.dragEvent}
      >
        <img
          classList={{"gc-hide": localData.thumb == ""}}
          style={{display: hasDisplayImageState() ? 'block' : 'none'}}
          src={localData.thumb}
          alt=""
        />
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
    </div>
  </div>
}

export default Index