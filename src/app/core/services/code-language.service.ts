import { Injectable, inject, signal } from '@angular/core';
import { CodeLanguage } from '../models/chapter.models';
import { StorageService } from './storage.service';

/**
 * The language a reader wants to see code in. One choice for the whole site:
 * pick Python on any snippet and every lesson, problem and later visit
 * follows it.
 */
@Injectable({ providedIn: 'root' })
export class CodeLanguageService {
  private readonly storage = inject(StorageService);
  private readonly value = signal<CodeLanguage>(this.storage.read<CodeLanguage>('code-language', 'java'));

  readonly current = this.value.asReadonly();

  set(language: CodeLanguage): void {
    this.value.set(language);
    this.storage.write('code-language', language);
  }
}
