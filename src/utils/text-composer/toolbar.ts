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
  blockType: TextBlockType
  bold: boolean
  italic: boolean
  underline: boolean
  canFormat: boolean
}

function getDefaultState(): ToolbarState {
  return {
    blockType: 'p',
    bold: false,
    italic: false,
    underline: false,
    canFormat: false
  }
}

class ToolbarController {
  private _state = ref<ToolbarState>(getDefaultState())

  constructor() {
    textComposer.onActiveEditorChange(this._updateState)
  }

  get editor() {
    const editor = textComposer.getEditor()
    const root = textComposer.getActiveRoot()
    if (!editor || !root) return null

    return editor
  }

  _updateState = (editorState: EditorState): void => {
    editorState.read(() => {
      this._state.value = this._readState() ?? getDefaultState()
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
    if (!$isRangeSelection(selection)) return getDefaultState()

    const anchorNode = selection.anchor.getNode()
    const topLevel = anchorNode.getTopLevelElementOrThrow()

    return {
      blockType: $isHeadingNode(topLevel) ? topLevel.getTag() : 'p',
      bold: selection.hasFormat('bold'),
      italic: selection.hasFormat('italic'),
      underline: selection.hasFormat('underline'),
      canFormat: true
    }
  }
}

const toolbar_controller = new ToolbarController()
export default toolbar_controller
