import { Pipe, PipeTransform } from '@angular/core';

/**
 * Authored text uses two bits of inline markup: `code` and **bold**. This
 * escapes everything first and then re-introduces only those two tags, so
 * lesson or problem text can never inject markup of its own. Bind the result
 * with `[innerHTML]`; Angular's sanitiser passes `<code>` and `<strong>`.
 */
export function richText(text: string | null | undefined): string {
  return (text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

@Pipe({ name: 'rich' })
export class RichPipe implements PipeTransform {
  transform(text: string | null | undefined): string {
    return richText(text);
  }
}
