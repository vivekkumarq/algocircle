import { TestBed } from '@angular/core/testing';
import { ContentBlocks } from './content-blocks';
import { Block } from '../../../core/models/chapter.models';
import { StorageService } from '../../../core/services/storage.service';

const PAIR: Block[] = [
  { kind: 'code', language: 'java', source: 'int x = 1;' },
  { kind: 'code', language: 'python', source: 'x = 1' },
];

describe('content blocks', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ContentBlocks] });
    TestBed.inject(StorageService).remove('code-language');
  });

  function section(blocks: Block[]) {
    const fixture = TestBed.createComponent(ContentBlocks);
    fixture.componentRef.setInput('blocks', blocks);
    fixture.detectChanges();
    return fixture;
  }

  const shown = (fixture: ReturnType<typeof section>) =>
    (fixture.nativeElement as HTMLElement).querySelector('pre code')?.textContent?.trim();

  it('collapses a java and python pair into one switcher, java first', () => {
    const one = section(PAIR);
    expect(one.nativeElement.querySelectorAll('[role="tab"]').length).toBe(2);
    expect(shown(one)).toBe('int x = 1;');
  });

  it('switches every section on the page when python is chosen in one', () => {
    const first = section(PAIR);
    const second = section(PAIR);

    first.nativeElement.querySelectorAll('[role="tab"]')[1].click();
    first.detectChanges();
    second.detectChanges();

    expect(shown(first)).toBe('x = 1');
    expect(shown(second)).toBe('x = 1');
  });

  it('renders inline markup in text but escapes anything else', () => {
    const one = section([{ kind: 'para', text: 'use `a[i]` <b>not this</b>' }]);
    const p: HTMLElement = one.nativeElement.querySelector('p');
    expect(p.querySelector('code')?.textContent).toBe('a[i]');
    expect(p.querySelector('b')).toBeNull();
  });
});
