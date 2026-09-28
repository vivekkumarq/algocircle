import { Pipe, PipeTransform } from '@angular/core';

/**
 * Authored text uses three bits of inline markup: `code`, **bold** and
 * *emphasis*. This escapes everything first and then re-introduces only those
 * tags, so lesson or problem text can never inject markup of its own. Bind the
 * result with `[innerHTML]`; Angular's sanitiser passes all three.
 */
export function richText(text: string | null | undefined): string {
  return (text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // A single pair hugging a word; `2 * 3` has spaces, so it is left alone.
    .replace(/(^|[^*\w])\*(?![\s*])([^*\n]+?)(?<![\s*])\*(?![*\w])/g, '$1<em>$2</em>');
}

@Pipe({ name: 'rich' })
export class RichPipe implements PipeTransform {
  transform(text: string | null | undefined): string {
    return richText(text);
  }
}
