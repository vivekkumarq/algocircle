import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { Watermark } from './watermark';

@Component({ template: 'learn' })
class LearnStub {}

@Component({ template: 'course' })
class CourseStub {}

describe('brand watermark', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Watermark],
      providers: [
        provideRouter([
          { path: 'learn/:slug', component: LearnStub },
          { path: 'course', component: CourseStub },
        ]),
      ],
    });
  });

  it('renders one decorative mark that is hidden from assistive tech', () => {
    const fixture = TestBed.createComponent(Watermark);
    fixture.detectChanges();

    const marks = fixture.nativeElement.querySelectorAll('.mark');
    expect(marks.length).toBe(1);
    expect(marks[0].getAttribute('aria-hidden')).toBe('true');
    expect(fixture.nativeElement.querySelectorAll('svg circle').length).toBeGreaterThan(6);
  });

  it('places itself differently for each section of the site', async () => {
    const fixture = TestBed.createComponent(Watermark);
    const router = TestBed.inject(Router);
    fixture.detectChanges();

    await router.navigateByUrl('/learn/arrays');
    fixture.detectChanges();
    const onLearn = fixture.nativeElement.querySelector('.mark').getAttribute('style');

    await router.navigateByUrl('/course');
    fixture.detectChanges();
    const onCourse = fixture.nativeElement.querySelector('.mark').getAttribute('style');

    expect(onLearn).not.toBe(onCourse);
  });
});
