// toolbar-controller.ts
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type EditorState
} from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { $createHeadingNode, $isHeadingNode, type HeadingTagType } from '@lexical/rich-text'
import textComposer from './index'
import { ref } from 'vue'

export type TextBlockType = 'p' | HeadingTagType

export type ToolbarState = {
  block_type?: TextBlockType
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

class ToolbarController {
  private _state = ref<ToolbarState>()
  private _unregister?: () => void

  constructor() {
    this._unregister = textComposer.registerUpdateListener(this._updateState)
  }

  destroy() {
    this._unregister?.()
  }

  get editor() {
    const editor = textComposer.getEditor()
    const root = textComposer.getActiveRoot()
    if (!editor || !root) return null

    return editor
  }

  get block_type() {
    return this._state.value?.block_type ?? 'p'
  }

  get bold() {
    return this._state.value?.bold ?? false
  }

  get italic() {
    return this._state.value?.italic ?? false
  }

  get underline() {
    return this._state.value?.underline ?? false
  }

  _updateState = (): void => {
    const editorState = this.editor?.getEditorState()
    editorState?.read(() => {
      this._state.value = this._readState()
    })
  }

  setParagraph = () => {
    this.editor?.update(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return
      $setBlocksType(selection, () => $createParagraphNode())
    })
  }

  setHeading = (tag: HeadingTagType) => {
    this.editor?.update(() => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return
      $setBlocksType(selection, () => $createHeadingNode(tag))
    })
  }

  toggleBold = () => {
    this.editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
  }

  toggleItalic = () => {
    this.editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
  }

  toggleUnderline = () => {
    this.editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
  }

  private _readState(): ToolbarState {
    const selection = $getSelection()
    if (!$isRangeSelection(selection)) return {}

    const anchorNode = selection.anchor.getNode()
    const topLevel = anchorNode.getTopLevelElementOrThrow()

    return {
      block_type: $isHeadingNode(topLevel) ? topLevel.getTag() : 'p',
      bold: selection.hasFormat('bold'),
      italic: selection.hasFormat('italic'),
      underline: selection.hasFormat('underline')
    }
  }
}

const toolbar_controller = new ToolbarController()
export default toolbar_controller
