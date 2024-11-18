/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {Component, createEffect, createMemo, onCleanup, onMount} from "solid-js";
import {createStore} from "solid-js/store";
import {defaultSlideData, SlideData} from "./meta/data";
import {SlideConfig, defaultConfig} from "./meta/config";
import {SlideEvent} from "./meta/event";
import {useHandler} from "./hooks/useHandler";

import CloseIcon from './../../assets/icons/CloseIcon'
import RefreshIcon from './../../assets/icons/RefreshIcon'
import LoadingIcon from './../../assets/icons/LoadingIcon'
import ArrowsIcon from './../../assets/icons/ArrowsIcon'

export interface SlideRef {
  reset: () => void,
  clear: () => void,
  refresh: () => void,
  close: () => void,
}

export interface Props {
  data: SlideData,
  config?: SlideConfig;
  events?: SlideEvent,
  [x: string]: any,
}

const Index: Component<Props> = (props: Props) => {
  const [localConfig, setLocalConfig] = createStore<SlideConfig>({
    ...defaultConfig(),
  });
  createEffect(() => {
    setLocalConfig((s) => ({
      ...s,
      ...(props.config || {}),
    }));
  });

  const [localData, setLocalData] = createStore<SlideData>({
    ...defaultSlideData()
  });
  createEffect(() => {
    setLocalData((s) => ({
      ...s,
      ...(props.data || {}),
    }));
  });

  const [localEvents, setLocalEvents] = createStore<SlideEvent>({});
  createEffect(() => {
    setLocalEvents((s) => ({
      ...s,
      ...(props.events || {}),
    }));
  });

  let rootRef: any = null
  let dragBarRef: any = null
  let containerRef: any = null
  let dragBlockRef: any = null
  let tileRef: any = null

  const handler = useHandler(localData, localEvents, localConfig, () => {
    setLocalData({...localData, ...defaultSlideData()})
  })

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

  const fn = (event: any) => event.preventDefault()
  onMount(() => {
    handler.initRefs(rootRef, containerRef, tileRef, dragBlockRef, dragBarRef)
    dragBlockRef.addEventListener('dragstart', fn)
  })

  onCleanup(() => {
    dragBlockRef.removeEventListener('dragstart', fn)
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
    <div class="gc-header">
      <span>{localConfig.title}</span>
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
        style={{
          width: localConfig.width + "px",
          height: localConfig.height + "px",
          display: hasDisplayImageState() ? 'block' : 'none'
        }}
        src={localData.image}
        alt="" />
      <div
        class="gc-tile"
        ref={tileRef}
        style={{
          width: (localData.thumbWidth || 0) + 'px',
          height: (localData.thumbHeight || 0) + 'px',
          top: (localData.thumbY || 0) + "px",
          left: handler.state.thumbLeft() + "px"
        }}
      >
        <img
          classList={{"gc-hide": localData.thumb == ""}}
          src={localData.thumb}
          style={{ display: hasDisplayImageState() ? 'block' : 'none' }}
          alt=""
        />
      </div>
    </div>
    <div class="gc-footer">
      <div class="gc-drag-slide-bar" ref={dragBarRef}>
        <div class="gc-drag-line" />
        <div
          class="gc-drag-block"
          ref={dragBlockRef}
          onMouseDown={handler.dragEvent}
          style={{left: handler.state.dragLeft() + "px"}}
          classList={{"disabled": !hasDisplayImageState()}}
        >
          <div class="drag-block-inline" onTouchStart={handler.dragEvent}>
            <ArrowsIcon/>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default Index