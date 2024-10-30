# Line Whisperer

Line Whisperer preserves your original line endings when copying text in VSCode, solving the common issue of line ending conversion on Windows systems.

## Features

- Preserves original line endings (LF/CRLF) when copying text
- Status bar indicator shows current line ending type for selected text
- Configurable default line ending preference
- Works via keyboard shortcut (Ctrl+Shift+C) or status bar click

## Usage

1. Select text in your editor
2. Either:
   - Press `Ctrl+Shift+C` (`Cmd+Shift+C` on Mac)
   - Click the Line Whisperer icon in the status bar
3. Paste your text with preserved line endings

## Configuration

Access settings via:
- Command Palette (`Ctrl+Shift+P`): "Preferences: Open Settings (UI)"
- Search for "Line Whisperer"

Available settings:
- `lineWhisperer.defaultLineEnding`: Choose default line ending ("auto", "LF", or "CRLF")
- `lineWhisperer.showStatusBarIcon`: Show/hide the status bar icon

## Customizing Keyboard Shortcuts

To change the default keyboard shortcut:
1. Open Keyboard Shortcuts (`Ctrl+K Ctrl+S`)
2. Search for "Line Whisperer"
3. Click the pencil icon to edit the shortcut
4. Press your desired key combination
5. Press Enter to save

## License

MIT