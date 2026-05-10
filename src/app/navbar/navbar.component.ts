import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, inject } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BatchDetail, Course, CreateBatchService } from '../services/create-batch.service';
import { SuccessStoriesService, SuccessStory } from '../services/success-stories.service';
import { ManageNotesService, Note } from '../services/manage-notes.service';
import { UiStateService } from '../services/ui-state.service'; 
import { InquiryService } from '../services/inquiry.service'; 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private batchService = inject(CreateBatchService);
  private successService = inject(SuccessStoriesService);
  private notesService = inject(ManageNotesService);
  private uiService = inject(UiStateService);
  private inquiryService = inject(InquiryService);
  private ngZone = inject(NgZone);
  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);
  private languageService = inject(LanguageService);

  selectedFeature: 'batch' | 'notes' | 'success' = 'batch';
  isLoading = true;
  
  // --- Batch State ---
  featuredBatchIndex = 0;
  featuredBatch: any = null;
  upcomingBatches: any[] = [];
  private batchInterval: any;

  // --- Success Stories State ---
  successStories: SuccessStory[] = [];
  visibleStories: SuccessStory[] = []; 
  isLoadingStories = false;
  private storyInterval: any;
  currentStoryIndex = 0; 

  // --- Story Modal State ---
  selectedStory: SuccessStory | null = null;
  isStoryModalOpen = false;

  // --- Real-Time Notes State ---
  @ViewChild('noteScrollContainer') noteScrollContainer!: ElementRef;
  
  selectedSyllabus: string = '';
  syllabusOptions: string[] = [];
  
  allNotes: Note[] = [];   
  notesList: Note[] = []; 
  isLoadingNotes = false;
  noteSearchTerm = '';
  
  private noteScrollInterval: any;
  private isNoteScrollPaused = false;

  // --- Inquiry Form State ---
  showInquiryForm = false;
  inquiryForm!: FormGroup;
  isSubmitting = false;
  submissionSuccess = false;

  // --- PDF Preview State ---
  isPreviewOpen = false;
  previewUrl: SafeResourceUrl | null = null;
  previewTitle = '';
  previewTextContent = '';
  previewDescription = '';
  previewTextLines: string[] = [];

  private readonly dummyNotes: Note[] = [
    {
      id: 9001,
      title: 'HTML Topper Notes (Rank 1)',
      description: 'Complete HTML handwritten notes by batch topper with interview questions.',
      category: 'Lecture Note',
      subject: 'HTML',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-10T10:00:00Z',
      preview_content: 'HTML Topper Notes\n• Semantic tags: header, nav, main, section, article, footer\n• Forms: label + input linking, required and pattern validation\n• Media: responsive images, alt text, accessible embeds\n• Accessibility: aria-labels, heading hierarchy, keyboard focus states'
    },
    {
      id: 9002,
      title: 'CSS Topper Notes (Rank 1)',
      description: 'Advanced CSS layouts, Grid, Flexbox, and Animations by batch topper.',
      category: 'Lecture Note',
      subject: 'CSS',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-11T11:00:00Z',
      preview_content: 'CSS Topper Notes\n• Build 3 card responsive grid with CSS Grid\n• Add sticky navbar and mobile drawer using flexbox\n• Create reusable utility classes for spacing and typography\n• Use media queries for 1200px, 768px and 480px breakpoints'
    },
    {
      id: 9003,
      title: 'JavaScript DOM Topper Notes',
      description: 'Deep dive into JS DOM manipulation, events, and async programming by batch topper.',
      category: 'Lecture Note',
      subject: 'JavaScript',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-12T12:00:00Z',
      preview_content: 'JavaScript Topper Notes\n• Query selectors and event listeners\n• Form validation with custom error messaging\n• Dynamic list rendering with add/edit/delete actions\n• LocalStorage integration for state persistence'
    },
    {
      id: 9004,
      title: 'Python Topper Handwritten Notes',
      description: 'Python basics to advanced with data structures. Official topper notes.',
      category: 'Lecture Note',
      subject: 'Python',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-13T13:00:00Z',
      preview_content: 'Python Topper Notes\n• OOP and decorators basics\n• File handling and exception management\n• Common DSA patterns (array, hashmap, two-pointer)\n• 25 interview questions with short answer hints'
    },
    {
      id: 9005,
      title: 'SQL Topper Revision Notes',
      description: 'Complex queries, indexing, and normalization notes from the top scorer.',
      category: 'Lecture Note',
      subject: 'SQL',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-14T14:00:00Z',
      preview_content: 'SQL Topper Notes\n• INNER vs LEFT vs RIGHT vs FULL joins\n• GROUP BY with HAVING and aggregate functions\n• Subqueries, EXISTS, and CTE usage\n• Index basics and query optimization tips'
    },
    {
      id: 9006,
      title: 'React.js Topper Notes (Rank 1)',
      description: 'React Hooks, Context API, Redux, and Next.js fundamentals from batch topper.',
      category: 'Lecture Note',
      subject: 'React',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-15T10:00:00Z',
      preview_content: 'React.js Topper Notes\n• useState, useEffect, useRef, and custom hooks\n• Context API vs Redux Toolkit\n• Next.js Server Components and Routing\n• Interview questions on React lifecycle and rendering'
    },
    {
      id: 9007,
      title: 'Node.js & Express Topper Notes',
      description: 'Backend routing, middleware, authentication (JWT), and API design.',
      category: 'Lecture Note',
      subject: 'Node.js',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-16T11:00:00Z',
      preview_content: 'Node.js Topper Notes\n• Event Loop and Asynchronous processing\n• Express.js middleware and route handling\n• JWT authentication and bcrypt password hashing\n• RESTful API best practices'
    },
    {
      id: 9008,
      title: 'MongoDB Topper Notes',
      description: 'NoSQL concepts, Mongoose ODM, Aggregation Pipeline, and Indexing.',
      category: 'Lecture Note',
      subject: 'MongoDB',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-17T12:00:00Z',
      preview_content: 'MongoDB Topper Notes\n• Document vs Relational databases\n• Mongoose schemas and models\n• Aggregation pipelines ($match, $group, $lookup)\n• Optimizing queries with indexes'
    },
    {
      id: 9009,
      title: 'Java OOPs & Collections Topper Notes',
      description: 'Core Java, OOP principles, Collections Framework, and Multithreading.',
      category: 'Lecture Note',
      subject: 'Java',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-18T13:00:00Z',
      preview_content: 'Java Topper Notes\n• Encapsulation, Inheritance, Polymorphism, Abstraction\n• HashMap, ArrayList, LinkedList internals\n• Multithreading and Concurrency\n• Exception handling best practices'
    },
    {
      id: 9010,
      title: 'C++ & STL Topper Notes',
      description: 'Pointers, Memory Management, and Standard Template Library (STL).',
      category: 'Lecture Note',
      subject: 'C++',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-19T14:00:00Z',
      preview_content: 'C++ Topper Notes\n• Pointers, References, and Memory Leaks\n• Object-Oriented Programming in C++\n• Vectors, Maps, Sets, and STL Algorithms\n• Operator Overloading and Templates'
    },
    {
      id: 9011,
      title: 'DSA Topper Notes (Rank 1)',
      description: 'Data Structures and Algorithms notes with top 100 interview problems.',
      category: 'Lecture Note',
      subject: 'DSA',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-20T10:00:00Z',
      preview_content: 'DSA Topper Notes\n• Arrays, Linked Lists, Stacks, Queues\n• Trees (BST, AVL, Segment Tree) and Graphs\n• Dynamic Programming and Greedy Algorithms\n• Time and Space Complexity Analysis'
    },
    {
      id: 9012,
      title: 'Git & GitHub Topper Notes',
      description: 'Version control basics, branching, merging, and resolving conflicts.',
      category: 'Lecture Note',
      subject: 'Git',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-21T11:00:00Z',
      preview_content: 'Git & GitHub Topper Notes\n• git init, add, commit, push, pull\n• Branching strategies and Pull Requests\n• Resolving merge conflicts\n• Rebase vs Merge differences'
    },
    {
      id: 9013,
      title: 'Docker & AWS Topper Notes',
      description: 'Containerization basics, Dockerfiles, and AWS cloud deployment.',
      category: 'Lecture Note',
      subject: 'Docker',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-22T12:00:00Z',
      preview_content: 'Docker & AWS Topper Notes\n• Docker images, containers, and Dockerfile commands\n• Docker Compose for multi-container apps\n• AWS EC2, S3, and RDS basics\n• CI/CD pipeline concepts'
    },
    {
      id: 9014,
      title: 'Angular Topper Notes (Rank 1)',
      description: 'Components, Directives, Services, RxJS, and Routing in Angular.',
      category: 'Lecture Note',
      subject: 'Angular',
      pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploaded_at: '2026-04-23T13:00:00Z',
      preview_content: 'Angular Topper Notes\n• Data binding and structural directives\n• Dependency Injection and Services\n• Reactive Forms and Form Validation\n• RxJS Observables and Operators'
    }
  ];

  private readonly dummyStories: SuccessStory[] = [
    {
      id: 8101,
      name: 'Aman Verma',
      role: 'Frontend Developer',
      company: 'Infosys',
      package: '6.2 LPA',
      quote: 'Quenrix ke mock interviews aur project guidance ne mera confidence totally transform kar diya.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg'
    },
    {
      id: 8102,
      name: 'Ritika Sharma',
      role: 'Data Analyst',
      company: 'Wipro',
      package: '7.1 LPA',
      quote: 'Study plan, notes aur weekly mentorship ki wajah se placement prep ka clear roadmap mila.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg'
    },
    {
      id: 8103,
      name: 'Nikhil Raj',
      role: 'Software Engineer',
      company: 'TCS',
      package: '8.0 LPA',
      quote: 'Batch sessions + revision notes + coding practice set ne meri interview hit-rate kaafi improve ki.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg'
    },
    {
      id: 8104,
      name: 'Sneha Gupta',
      role: 'Backend Developer',
      company: 'Capgemini',
      package: '9.4 LPA',
      quote: 'Real-world assignments aur mentor feedback ne mujhe production-level coding soch di.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_201x_logo.svg'
    }
  ];

  ngOnInit() {
    this.initForm();
    this.fetchRealTimeBatches();
    this.fetchSuccessStories(); 
    this.loadSubjects();

    this.uiService.action$.subscribe(payload => {
      if (payload.action === 'show-notes') {
        this.selectFeature('notes');
        this.scrollToFeatures();
      } else if (payload.action === 'show-success') {
        this.selectFeature('success');
        this.scrollToFeatures();
      }
    });
  }

  scrollToFeatures() {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnDestroy() {
    this.stopBatchRotation();
    this.stopNoteScroll();
    this.stopStoryRotation(); 
    document.body.style.overflow = 'auto';
  }

  // --- INQUIRY FORM LOGIC ---
  initForm() {
    this.inquiryForm = this.fb.group({
      name: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      email: ['', [Validators.email]], 
      course_name: ['General', Validators.required]
    });
  }

  openInquiryForm(courseName: string = 'General') {
    // Stop background activities when form opens to prevent glitches
    this.stopBatchRotation();
    this.stopStoryRotation();

    this.submissionSuccess = false;
    this.inquiryForm.patchValue({ course_name: courseName });
    this.showInquiryForm = true;
    document.body.style.overflow = 'hidden'; // Lock scroll
  }

  closeInquiryForm() {
    this.showInquiryForm = false;
    this.inquiryForm.reset();
    this.submissionSuccess = false;
    document.body.style.overflow = 'auto'; // Unlock scroll

    // Resume background activities
    this.startBatchRotation();
    this.startStoryRotation();
  }

  // Improved Overlay Click Handler
  // This ensures the form only closes if the user clicks strictly on the overlay,
  // not if they drag mouse from inside the form to outside.
  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeInquiryForm();
    }
  }

  submitInquiry() {
    if (this.inquiryForm.valid) {
      this.isSubmitting = true;
      const formData = this.inquiryForm.value;
      
      this.inquiryService.createInquiry(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submissionSuccess = true;
        },
        error: (error) => {
          console.error('Inquiry submission failed', error);
          this.isSubmitting = false;
          alert(this.t('nav.submitFailed'));
        }
      });
    } else {
      this.inquiryForm.markAllAsTouched();
    }
  }

  // --- Notes Logic ---
  loadSubjects() {
    this.notesService.getAllSubjects().subscribe({
      next: (subjects) => {
        const validSubjects = subjects ? subjects.filter(s => s && s.trim().length > 0) : [];
        this.syllabusOptions = validSubjects.length > 0
          ? validSubjects
          : [...new Set(this.dummyNotes.map(note => note.subject))];
        if (this.syllabusOptions.length > 0) {
           this.selectedSyllabus = this.syllabusOptions[0];
        }
      },
      error: (err) => {
        console.error('Failed to load subjects', err);
        this.syllabusOptions = [...new Set(this.dummyNotes.map(note => note.subject))];
        this.selectedSyllabus = this.syllabusOptions[0] || '';
      }
    });
  }

  selectFeature(feature: 'batch' | 'notes' | 'success') {
    this.selectedFeature = feature;
    if (feature === 'notes') {
      if (this.selectedSyllabus) {
        this.fetchNotesBySubject(this.selectedSyllabus);
      } else if (this.syllabusOptions.length > 0) {
        this.selectedSyllabus = this.syllabusOptions[0];
        this.fetchNotesBySubject(this.selectedSyllabus);
      }
    }
  }

  onSyllabusChange(newSubject: string) {
    this.selectedSyllabus = newSubject;
    if (this.selectedFeature === 'notes') {
        this.fetchNotesBySubject(newSubject);
    }
  }

  fetchNotesBySubject(subject: string) {
    this.isLoadingNotes = true;
    this.stopNoteScroll(); 
    this.notesList = []; 

    this.notesService.getNotes(subject).subscribe({
      next: (data) => {
        const fallbackNotes = this.getDummyNotesBySubject(subject);
        this.allNotes = data && data.length > 0 ? data : fallbackNotes;
        this.applyNoteFilter();
        this.isLoadingNotes = false;
        setTimeout(() => this.startNoteScroll(), 500);
      },
      error: (err) => {
        console.error('Error fetching notes:', err);
        this.allNotes = this.getDummyNotesBySubject(subject);
        this.applyNoteFilter();
        this.isLoadingNotes = false;
        setTimeout(() => this.startNoteScroll(), 300);
      }
    });
  }

  onNoteSearch(termOrEvent: string | Event) {
    const term = typeof termOrEvent === 'string'
      ? termOrEvent
      : ((termOrEvent.target as HTMLInputElement)?.value ?? '');

    this.noteSearchTerm = term;
    this.applyNoteFilter();
    setTimeout(() => this.startNoteScroll(), 120);
  }

  private applyNoteFilter(): void {
    const term = this.noteSearchTerm.trim().toLowerCase();

    if (!term) {
      this.notesList = [...this.allNotes];
      return;
    }

    this.notesList = this.allNotes.filter((note) => {
      const title = note.title?.toLowerCase() ?? '';
      const description = note.description?.toLowerCase() ?? '';
      const category = note.category?.toLowerCase() ?? '';
      const subject = note.subject?.toLowerCase() ?? '';
      return title.includes(term) || description.includes(term) || category.includes(term) || subject.includes(term);
    });
  }

  getCategoryClass(category: string): string {
    switch (category) {
      case 'Lecture Note': return 'cat-lecture';
      case 'Assignment': return 'cat-assignment';
      case 'Lab Manual': return 'cat-lab';
      case 'Question Paper': return 'cat-paper';
      default: return '';
    }
  }

  // --- Preview Modal Logic ---
  openPreviewModal(note: Note) {
    if (!note.id || note.id >= 9000) {
      this.previewTitle = note.title;
      this.previewDescription = note.description || '';
      this.previewTextContent = note.preview_content || this.buildDefaultPreview(note);
      this.previewTextLines = this.previewTextContent.split('\n').filter(line => line.trim().length > 0);
      this.previewUrl = null;
      this.isPreviewOpen = true;
      document.body.style.overflow = 'hidden';
      return;
    }

    this.notesService.getDownloadLink(note.id).subscribe({
      next: (res) => {
        if (res.download_url) {
           this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.download_url);
           this.previewTitle = note.title;
           this.previewDescription = note.description || '';
           this.previewTextContent = '';
           this.isPreviewOpen = true;
           document.body.style.overflow = 'hidden'; // Lock scroll
        }
      },
      error: () => alert(this.t('nav.previewLoadFailed'))
    });
  }

  closePreviewModal() {
    this.isPreviewOpen = false;
    this.previewUrl = null;
    this.previewTextContent = '';
    this.previewDescription = '';
    document.body.style.overflow = 'auto'; // Unlock scroll
  }

  private buildDefaultPreview(note: Note): string {
    return `${note.title}\n• Subject: ${note.subject}\n• Category: ${note.category}\n• Summary: ${note.description}`;
  }

  startNoteScroll() {
    this.stopNoteScroll();
    if (this.noteScrollContainer && 
        this.noteScrollContainer.nativeElement.scrollHeight > this.noteScrollContainer.nativeElement.clientHeight) {
      this.ngZone.runOutsideAngular(() => {
        this.noteScrollInterval = setInterval(() => {
          if (!this.isNoteScrollPaused && this.noteScrollContainer) {
            const el = this.noteScrollContainer.nativeElement;
            el.scrollTop += 1; 
            if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
              el.scrollTop = 0;
            }
          }
        }, 50); 
      });
    }
  }

  stopNoteScroll() { if (this.noteScrollInterval) clearInterval(this.noteScrollInterval); }
  pauseNoteScroll() { this.isNoteScrollPaused = true; }
  resumeNoteScroll() { this.isNoteScrollPaused = false; }


  // --- BATCH LOGIC ---

  fetchRealTimeBatches() {
    this.isLoading = true;
    this.batchService.getCourses().subscribe({
      next: (courses: Course[]) => {
        if (courses.length === 0) { this.handleEmptyBatches(); return; }
        
        const batchRequests = courses.map(course => 
          this.batchService.getBatchesByCourse(course.courseid).pipe(
            catchError(err => {
              console.warn(`Could not fetch batches for course ${course.courseid}`, err);
              return of([]); 
            })
          )
        );
        
        forkJoin(batchRequests).subscribe({
          next: (responses: BatchDetail[][]) => {
            let allActiveBatches: BatchDetail[] = [];

            responses.forEach((batchList, index) => {
              const currentCourse = courses[index];
              const activeForCourse = batchList.filter(b => {
                 const isActive = b.is_active as any;
                 return isActive !== false && isActive != 0 && isActive !== '0';
              });
              
              activeForCourse.forEach(b => {
                if (!b.course) {
                  b.course = currentCourse; 
                } else if (!b.course.coursename) {
                   b.course = currentCourse;
                }
              });

              allActiveBatches = [...allActiveBatches, ...activeForCourse];
            });

            this.mapToUIModel(allActiveBatches);
          },
          error: (err) => {
            console.error('Global error in batch fetch', err);
            this.handleEmptyBatches();
          }
        });
      },
      error: () => this.handleEmptyBatches()
    });
  }

  mapToUIModel(backendBatches: BatchDetail[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const validBatches = backendBatches.filter(batch => {
      const bAny = batch as any;
      const rawDate = batch.startDate || bAny.start_date || bAny.startDate || bAny.StartDate;
      if (!rawDate) return true; 
      
      if (typeof rawDate === 'string' && rawDate.indexOf('-') > -1) {
        const parts = rawDate.split('-');
        if (parts.length >= 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1; 
          const d = parseInt(parts[2], 10);
          const batchDate = new Date(y, m, d);
          return batchDate >= today; 
        }
      }
      const batchDate = new Date(rawDate);
      if (isNaN(batchDate.getTime())) return true; 
      return batchDate >= today;
    });

    if (validBatches.length === 0) { 
        this.handleEmptyBatches(); 
        return; 
    }

    validBatches.sort((a, b) => {
      const aAny = a as any;
      const bAny = b as any;
      const dateAStr = a.startDate || aAny.start_date || aAny.startDate;
      const dateBStr = b.startDate || bAny.start_date || bAny.startDate;
      
      const dateA = dateAStr ? new Date(dateAStr).getTime() : Infinity;
      const dateB = dateBStr ? new Date(dateBStr).getTime() : Infinity;
      return dateA - dateB;
    });

    const defaultImages = [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    ];

    this.upcomingBatches = validBatches.map((batch, index) => {
      const bAny = batch as any;
      const finalStartDate = batch.startDate || bAny.start_date || bAny.startDate || null;
      const finalTiming = batch.timing || bAny.timing || this.t('nav.defaultTime');
      const finalMode = batch.mode || bAny.mode || this.t('nav.defaultMode');

      return {
        courseName: batch.course?.coursename || batch.batchName || this.t('nav.defaultCourse'),
        startDate: finalStartDate, 
        time: finalTiming,
        mode: finalMode, 
        description: this.t('nav.batchDesc', { batch: batch.batchName, mode: finalMode }),
        tags: [this.t('nav.enrollingNow'), finalMode, this.t('nav.tagPlacement')],
        imageUrl: defaultImages[index % defaultImages.length]
      };
    });
    
    this.featuredBatch = this.upcomingBatches[0];
    this.isLoading = false;
    this.startBatchRotation();
  }

  handleEmptyBatches() {
    this.upcomingBatches = [];
    this.featuredBatch = null;
    this.isLoading = false;
  }

  startBatchRotation() {
    this.stopBatchRotation();
    if (this.upcomingBatches.length > 1) {
      this.batchInterval = setInterval(() => {
        this.featuredBatchIndex = (this.featuredBatchIndex + 1) % this.upcomingBatches.length;
        this.featuredBatch = this.upcomingBatches[this.featuredBatchIndex];
      }, 6000);
    }
  }

  stopBatchRotation() { if (this.batchInterval) clearInterval(this.batchInterval); }

  // --- SUCCESS STORIES LOGIC ---

  fetchSuccessStories() {
      this.isLoadingStories = true;
      this.successService.getStories().subscribe({
          next: (data) => { 
            this.successStories = data && data.length > 0 ? data : [...this.dummyStories];
            this.isLoadingStories = false; 
            
            if (this.successStories.length > 0) {
               this.updateVisibleStories();
               this.startStoryRotation();
            }
          },
          error: (err) => {
            console.error('Error fetching stories', err);
            this.successStories = [...this.dummyStories];
            this.updateVisibleStories();
            this.startStoryRotation();
            this.isLoadingStories = false;
          }
      });
  }

  private getDummyNotesBySubject(subject: string): Note[] {
    const normalized = (subject || '').trim().toLowerCase();
    const filtered = this.dummyNotes.filter(note => note.subject.toLowerCase() === normalized);
    return filtered.length > 0 ? filtered : [...this.dummyNotes];
  }

  updateVisibleStories() {
    if (this.successStories.length === 0) return;
    
    const count = 3; 
    this.visibleStories = [];
    
    for (let i = 0; i < count; i++) {
      const index = (this.currentStoryIndex + i) % this.successStories.length;
      this.visibleStories.push(this.successStories[index]);
    }
  }

  startStoryRotation() {
    this.stopStoryRotation();
    this.storyInterval = setInterval(() => {
      this.currentStoryIndex = (this.currentStoryIndex + 1) % this.successStories.length;
      this.updateVisibleStories();
    }, 5000);
  }

  stopStoryRotation() {
    if (this.storyInterval) clearInterval(this.storyInterval);
  }

  openStoryModal(story: SuccessStory) {
    this.selectedStory = story;
    this.isStoryModalOpen = true;
    this.stopStoryRotation(); 
    document.body.style.overflow = 'hidden'; // Lock scroll
  }

  closeStoryModal() {
    this.isStoryModalOpen = false;
    this.selectedStory = null;
    this.startStoryRotation(); 
    document.body.style.overflow = 'auto'; // Unlock scroll
  }
  t(key: string, params?: Record<string, string | number>): string {
    return this.languageService.t(key, params);
  }
}