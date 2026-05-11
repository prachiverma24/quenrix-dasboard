import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { examAPi } from '../services/createexam.service';
import { ApiService } from '../services/api.service';
import { Subscription, interval, of, forkJoin } from 'rxjs';
import { catchError, map, concatMap, tap } from 'rxjs/operators';

declare const monaco: any;

interface QuestionOption {
  optionid: number;
  option_text: string;
}

interface ExamQuestion {
  questionid: number;
  questiontext: string;
  points: number;
  questiontypeid: number;
  options: QuestionOption[];
  studentAnswer: string | number | null;
  status: 'unanswered' | 'answered';
}

interface AttemptResult {
  attemptid: number;
  total_score: number;
  max_score: number;
  status_message: string;
}

// Updated: comprehensive interface for all question types
interface DetailedAnswer {
  questionid: number;
  question_number: number;
  question_text: string;
  question_type_id: number;        // 1=MCQ, 2=Descriptive, 3=Coding
  max_points: number;
  points_earned: number;
  is_correct: boolean;
  student_answer: string | null;
  correct_answer: string | null;   // For MCQ
  ai_score: number | null;
  ai_feedback: string | null;
  options: {                        // For MCQ
    optionid: number;
    optiontext: string;
    iscorrect: boolean;
  }[];
  selected_option_id: number | null;
  correct_option_id: number | null;
  improvement_tip: string | null;
}

@Component({
  selector: 'app-attend-exam',
  templateUrl: './attend-exam.component.html',
  styleUrls: ['./attend-exam.component.css']
})
export class AttendExamComponent implements OnInit, OnChanges, OnDestroy {
  @Input() examId: number | null = null;
  @Input() durationMinutes: number = 60;
  @Input() examName: string = 'Corporate Technical Assessment';

  @Output() examFinished = new EventEmitter<{ status: 'submitted' | 'expired', message: string }>();

  isLoading: boolean = false;
  error: string | null = null;
  isSubmitting: boolean = false;

  private examInitialized: boolean = false;

  questions: ExamQuestion[] = [];
  currentQuestionIndex: number = 0;

  timeLeftSeconds: number = 0;
  timerSubscription: Subscription | undefined;
  formattedTimeLeft: string = '00:00:00';

  showResult: boolean = false;
  finalResult: AttemptResult | null = null;
  attemptId: number | null = null;
  detailedAnswers: DetailedAnswer[] = [];
  isLoadingResults: boolean = false;

  tabSwitchCount: number = 0;
  maxTabSwitches: number = 3;
  showTabWarning: boolean = false;

  editorInstance: any;
  editorLoaded: boolean = false;
  useFallbackEditor: boolean = false;

  languages = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C#', value: 'csharp' },
    { label: 'C++', value: 'cpp' },
    { label: 'HTML', value: 'html' },
    { label: 'SQL', value: 'sql' },
    { label: 'Other (Plain Text)', value: 'plaintext' }
  ];

  selectedLanguage: string = 'javascript';
  autoDetectedLanguage: boolean = false;

  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    fontSize: 14,
    contextmenu: true,
    fontFamily: "'JetBrains Mono', 'Consolas', 'Courier New', monospace",
    lineNumbers: 'on',
    minimap: { enabled: false }
  };

  constructor(private examService: examAPi, private apiService: ApiService) {}

  @HostListener('window:blur', ['$event'])
  onBlur(event: any): void {
    if (!this.showResult && !this.isLoading && !this.isSubmitting && this.questions.length > 0) {
      this.handleTabSwitch();
    }
  }

  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange(event: any): void {
    if (document.hidden && !this.showResult && !this.isLoading && !this.isSubmitting) {
      this.handleTabSwitch();
    }
  }

  handleTabSwitch(): void {
    this.tabSwitchCount++;
    if (this.tabSwitchCount >= this.maxTabSwitches) {
      this.autoSubmitExam('expired', 'Exam terminated due to multiple tab switching violations.');
    } else {
      this.showTabWarning = true;
    }
  }

  closeWarning(): void {
    this.showTabWarning = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['examId']) {
      const newExamId = changes['examId'].currentValue;
      if (newExamId !== null && newExamId !== undefined && newExamId !== 0 && !this.examInitialized) {
        this.examInitialized = true;
        this.initializeExam();
      }
    }
  }

  ngOnInit(): void {
    if (this.examId !== null && this.examId !== undefined && this.examId !== 0 && !this.examInitialized) {
      this.examInitialized = true;
      this.initializeExam();
    }
  }

  private initializeExam(): void {
    console.log('✅ Exam initializing with ID:', this.examId);
    this.error = null;
    this.examInitialized = true;
    this.detectLanguageFromContext(true);
    this.fetchExamQuestions(this.examId!);
    this.timeLeftSeconds = this.durationMinutes * 60;
    this.formattedTimeLeft = this.formatTime(this.timeLeftSeconds);
    this.startTimer();
  }

  onEditorInit(editor: any) {
    this.editorInstance = editor;
    this.editorLoaded = true;

    if (!this.questions[this.currentQuestionIndex]?.studentAnswer) {
      this.questions[this.currentQuestionIndex].studentAnswer = this.getCommentSyntax();
    }

    setTimeout(() => {
      if (this.editorInstance) this.editorInstance.layout();
    }, 200);
  }

  getCommentSyntax(): string {
    if (this.selectedLanguage === 'python' || this.selectedLanguage === 'ruby' || this.selectedLanguage === 'perl') return '# Write your code here...';
    if (this.selectedLanguage === 'html' || this.selectedLanguage === 'xml') return '<!-- Write your code here... -->';
    if (this.selectedLanguage === 'sql') return '-- Write your query here...';
    if (this.selectedLanguage === 'plaintext') return '';
    return '// Write your code here...';
  }

  checkEditorLoading() {
    if (this.questions[this.currentQuestionIndex]?.questiontypeid !== 3) return;
    this.useFallbackEditor = false;
    setTimeout(() => {
      const monacoReady = typeof monaco !== 'undefined' && monaco.editor;
      if (!this.editorLoaded && !monacoReady) {
        this.useFallbackEditor = true;
      }
    }, 4000);
  }

  changeLanguage() {
    this.autoDetectedLanguage = false;
    if (this.editorInstance && typeof monaco !== 'undefined' && monaco.editor) {
      monaco.editor.setModelLanguage(this.editorInstance.getModel(), this.selectedLanguage);
    }
  }

  detectLanguageFromContext(onlyExamName: boolean = false) {
    const textToScan = (this.examName + (onlyExamName ? '' : ' ' + (this.questions[this.currentQuestionIndex]?.questiontext || ''))).toLowerCase();
    let detected = 'javascript';
    if (textToScan.includes('python')) detected = 'python';
    else if (textToScan.includes('c#') || textToScan.includes('csharp') || textToScan.includes('.net')) detected = 'csharp';
    else if ((textToScan.includes('java') || textToScan.includes('spring')) && !textToScan.includes('script')) detected = 'java';
    else if (textToScan.includes('c++') || textToScan.includes('cpp')) detected = 'cpp';
    else if (textToScan.includes('sql') || textToScan.includes('database') || textToScan.includes('query')) detected = 'sql';
    else if (textToScan.includes('html') || textToScan.includes('css') || textToScan.includes('web')) detected = 'html';
    else if (textToScan.includes('typescript') || textToScan.includes('ts')) detected = 'typescript';
    else if (textToScan.includes('ruby')) detected = 'ruby';
    else if (textToScan.includes('go') && !textToScan.includes('mongo')) detected = 'go';
    else if (textToScan.includes('php')) detected = 'php';
    else if (textToScan.includes('swift')) detected = 'swift';
    else if (textToScan.includes('kotlin')) detected = 'kotlin';
    else if (textToScan.includes('rust')) detected = 'rust';
    else if (textToScan.includes('shell') || textToScan.includes('bash')) detected = 'shell';

    const exists = this.languages.some(l => l.value === detected);
    if (!exists && detected !== 'javascript') {
      const label = detected.charAt(0).toUpperCase() + detected.slice(1);
      this.languages.splice(this.languages.length - 1, 0, { label, value: detected });
    }

    if (detected !== this.selectedLanguage) {
      this.selectedLanguage = detected;
      this.editorOptions = { ...this.editorOptions, language: this.selectedLanguage };
      this.changeLanguage();
    }
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  fetchExamQuestions(examId: number): void {
    this.isLoading = true;
    this.error = null;

    this.examService.fetchExamQuestions(examId).pipe(
      map((res: any) => {
        const questionArray: any[] = Array.isArray(res) ? res : (res?.questions || res?.results || res?.data || []);
        return questionArray.map(q => ({
          questionid: q.questionid,
          questiontext: q.questiontext,
          points: q.points,
          questiontypeid: q.questiontypeid,
          options: (q.options || []).map((opt: any) => ({
            optionid: opt.optionid,
            option_text: opt.optiontext || opt.option_text
          })),
          studentAnswer: q.questiontypeid === 1 ? null : '',
          status: 'unanswered'
        } as ExamQuestion));
      }),
      catchError(err => {
        console.error('❌ Error fetching questions:', err);
        this.error = 'Questions could not be loaded. Please refresh.';
        this.isLoading = false;
        return of([]);
      })
    ).subscribe((questions: ExamQuestion[]) => {
      this.questions = questions;
      this.isLoading = false;
      if (this.questions.length > 0) {
        this.goToQuestion(0);
      } else {
        this.error = 'No questions found for this exam.';
      }
    });
  }

  startTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeftSeconds > 0) {
        this.timeLeftSeconds--;
        this.formattedTimeLeft = this.formatTime(this.timeLeftSeconds);
      } else {
        this.autoSubmitExam('expired', 'Time Limit Reached.');
      }
    });
  }

  formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex = index;
    if (this.questions[index]?.questiontypeid === 3) {
      this.detectLanguageFromContext(false);
      this.checkEditorLoading();
      if (!this.questions[index].studentAnswer) {
        this.questions[index].studentAnswer = this.getCommentSyntax();
      }
      if (this.editorInstance) {
        setTimeout(() => {
          this.editorInstance.layout();
          this.changeLanguage();
        }, 100);
      }
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.goToQuestion(this.currentQuestionIndex + 1);
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.goToQuestion(this.currentQuestionIndex - 1);
    }
  }

  handleAnswer(answer: any): void {
    const q = this.questions[this.currentQuestionIndex];
    q.studentAnswer = answer;
    const hasValue = q.questiontypeid === 1 ? answer !== null : (answer && answer.toString().trim().length > 0);
    q.status = hasValue ? 'answered' : 'unanswered';
  }

  autoSubmitExam(status: 'submitted' | 'expired', customMessage?: string): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.timerSubscription?.unsubscribe();

    const loginData = this.apiService.getStoredStudentData();
    const studentId = loginData?.userId || 'GUEST';

    const payload = {
      examid: this.examId!,
      userid: studentId,
      attemptdate: new Date().toISOString(),
      total_score: 0,
      ai_evaluated: false,
      updated_at: new Date().toISOString()
    };

    this.examService.createAttempt(payload).pipe(
      tap(res => this.attemptId = res.attemptid),
      concatMap(res => {
        const obs = this.questions.map(q => {
          if (q.studentAnswer !== null && q.studentAnswer !== '') {
            return this.examService.submitAnswer({
              attemptid: res.attemptid,
              questionid: q.questionid,
              selectedoptionid: q.questiontypeid === 1 ? q.studentAnswer : null,
              descriptive_answer: q.questiontypeid === 2 ? q.studentAnswer : null,
              code_answer: q.questiontypeid === 3 ? q.studentAnswer : null,
              is_correct: false,
              points_earned: 0
            }).pipe(catchError(() => of(null)));
          }
          return of(null);
        });
        return forkJoin(obs);
      }),
      concatMap(() => this.examService.evaluateAndFetchResult(this.attemptId!))
    ).subscribe({
      next: (res) => {
        this.finalResult = res;
        this.showResult = true;
        this.isSubmitting = false;
        if (this.attemptId) {
          this.fetchResultsWithFeedback(this.attemptId);
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.examFinished.emit({ status, message: customMessage || 'Submitted' });
      }
    });
  }

  fetchResultsWithFeedback(id: number): void {
    this.isLoadingResults = true;
    // Cast to `any` first to avoid a type conflict with the service's stale DetailedAnswer type.
    // The service return type will be updated separately; this cast is safe because the
    // backend now returns the full shape defined by our local DetailedAnswer interface.
    (this.examService.fetchDetailedAnswers(id) as any).subscribe({
      next: (ans: DetailedAnswer[]) => {
        this.detailedAnswers = ans;
        this.isLoadingResults = false;
      },
      error: () => {
        this.isLoadingResults = false;
      }
    });
  }

  // ─── Result Helpers ─────────────────────────────────────────────────────────

  get scorePercentage(): number {
    if (!this.finalResult || !this.finalResult.max_score) return 0;
    return Math.round((this.finalResult.total_score / this.finalResult.max_score) * 100);
  }

  get grade(): string {
    const pct = this.scorePercentage;
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  }

  get gradeColor(): string {
    const pct = this.scorePercentage;
    if (pct >= 80) return 'grade-green';
    if (pct >= 60) return 'grade-amber';
    return 'grade-red';
  }

  get correctCount(): number {
    return this.detailedAnswers.filter(a => a.is_correct).length;
  }

  get wrongCount(): number {
    return this.detailedAnswers.filter(a => !a.is_correct && a.student_answer !== null).length;
  }

  get skippedCount(): number {
    return this.detailedAnswers.filter(a => a.student_answer === null).length;
  }

  getQuestionTypeName(typeId: number): string {
    switch (typeId) {
      case 1: return 'MCQ';
      case 2: return 'Descriptive';
      case 3: return 'Coding';
      default: return 'Unknown';
    }
  }

  getQuestionTypeClass(typeId: number): string {
    switch (typeId) {
      case 1: return 'badge-mcq';
      case 2: return 'badge-desc';
      case 3: return 'badge-code';
      default: return '';
    }
  }

  // ─── PDF Download ────────────────────────────────────────────────────────────

  downloadPDF(): void {
    if (!this.finalResult) return;

    const attemptDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const scoreColor = this.scorePercentage >= 80 ? '#10b981' : this.scorePercentage >= 60 ? '#f59e0b' : '#ef4444';

    const questionsHTML = this.detailedAnswers.map((ans, i) => {
      const statusIcon = ans.student_answer === null
        ? '⊘'
        : ans.is_correct ? '✓' : '✗';
      const statusColor = ans.student_answer === null
        ? '#94a3b8'
        : ans.is_correct ? '#10b981' : '#ef4444';
      const typeName = this.getQuestionTypeName(ans.question_type_id);
      const scoreRatio = ans.max_points > 0 ? (ans.points_earned / ans.max_points) : 0;
      const badgeColor = scoreRatio === 1 ? '#dcfce7' : scoreRatio > 0 ? '#fef9c3' : '#fee2e2';
      const badgeText = scoreRatio === 1 ? '#166534' : scoreRatio > 0 ? '#854d0e' : '#991b1b';

      let answerBlock = '';

      if (ans.question_type_id === 1) {
        // MCQ: list all options, highlight correct and selected
        const optionsHTML = (ans.options || []).map(opt => {
          const isSelected = opt.optionid === ans.selected_option_id;
          const isCorrect = opt.iscorrect;
          let bg = '#f8fafc';
          let border = '#e2e8f0';
          let icon = '';
          if (isCorrect && isSelected) { bg = '#dcfce7'; border = '#10b981'; icon = '✓ '; }
          else if (isCorrect && !isSelected) { bg = '#ecfdf5'; border = '#6ee7b7'; icon = '✓ '; }
          else if (!isCorrect && isSelected) { bg = '#fee2e2'; border = '#ef4444'; icon = '✗ '; }
          return `<div style="padding:6px 10px;margin-bottom:4px;border-radius:6px;background:${bg};border:1px solid ${border};font-size:13px;color:#334155;">${icon}${opt.optiontext || ''}</div>`;
        }).join('');
        answerBlock = `
          <div style="margin-bottom:8px;font-size:12px;color:#64748b;text-transform:uppercase;font-weight:700;">Options:</div>
          ${optionsHTML}
          ${!ans.is_correct && ans.correct_answer ? `<div style="margin-top:8px;padding:8px 12px;background:#ecfdf5;border-left:3px solid #10b981;border-radius:6px;font-size:13px;color:#065f46;"><strong>Correct Answer:</strong> ${ans.correct_answer}</div>` : ''}
        `;
      } else {
        const ansText = ans.student_answer || '<em style="color:#94a3b8;">No answer submitted</em>';
        const codeStyle = ans.question_type_id === 3 ? 'font-family:monospace;background:#1e1e1e;color:#d4d4d4;padding:10px;border-radius:6px;' : '';
        answerBlock = `
          <div style="margin-bottom:6px;font-size:12px;color:#64748b;text-transform:uppercase;font-weight:700;">Your Answer:</div>
          <div style="padding:8px 12px;background:#f1f5f9;border-radius:6px;font-size:13px;${codeStyle}white-space:pre-wrap;">${ansText}</div>
          ${ans.ai_feedback ? `<div style="margin-top:8px;padding:8px 12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;font-size:13px;color:#1e3a8a;"><strong>🤖 AI Feedback:</strong> ${ans.ai_feedback}</div>` : ''}
        `;
      }

      return `
        <div style="margin-bottom:20px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;page-break-inside:avoid;">
          <div style="background:#f8fafc;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-weight:700;color:#0f172a;font-size:14px;">Q${i + 1}.</span>
              <span style="font-size:11px;padding:2px 8px;border-radius:20px;background:#e0f2fe;color:#0369a1;font-weight:600;">${typeName}</span>
              <span style="font-size:18px;font-weight:900;color:${statusColor};">${statusIcon}</span>
            </div>
            <span style="font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;background:${badgeColor};color:${badgeText};">
              ${ans.points_earned.toFixed(1)} / ${ans.max_points} pts
            </span>
          </div>
          <div style="padding:12px 16px;">
            <p style="font-weight:600;font-size:14px;color:#1e293b;margin:0 0 12px 0;">${ans.question_text}</p>
            ${answerBlock}
            ${ans.improvement_tip ? `<div style="margin-top:10px;padding:8px 12px;background:#fffbeb;border-left:3px solid #f59e0b;border-radius:6px;font-size:12px;color:#92400e;"><strong>💡 Tip:</strong> ${ans.improvement_tip}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Exam Result - ${this.examName}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #334155; background: #fff; padding: 30px 40px; }
          @media print {
            body { padding: 10px 20px; }
            .no-print { display: none !important; }
            @page { margin: 15mm; size: A4; }
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div style="text-align:center;padding-bottom:24px;border-bottom:2px solid #e2e8f0;margin-bottom:24px;">
          <h1 style="font-size:22px;font-weight:800;color:#0f172a;margin-bottom:4px;">${this.examName}</h1>
          <p style="color:#64748b;font-size:13px;">Exam Result Report &nbsp;|&nbsp; ${attemptDate}</p>
        </div>

        <!-- Score Summary -->
        <div style="display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap;">
          <div style="flex:1;min-width:120px;text-align:center;padding:16px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
            <div style="font-size:32px;font-weight:900;color:${scoreColor};">${this.finalResult?.total_score?.toFixed(1)}</div>
            <div style="font-size:12px;color:#64748b;margin-top:4px;">out of ${this.finalResult?.max_score}</div>
            <div style="font-size:11px;color:#94a3b8;">Total Score</div>
          </div>
          <div style="flex:1;min-width:120px;text-align:center;padding:16px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
            <div style="font-size:32px;font-weight:900;color:${scoreColor};">${this.scorePercentage}%</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:4px;">Percentage</div>
          </div>
          <div style="flex:1;min-width:120px;text-align:center;padding:16px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
            <div style="font-size:32px;font-weight:900;color:${scoreColor};">${this.grade}</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:4px;">Grade</div>
          </div>
          <div style="flex:1;min-width:120px;text-align:center;padding:16px;border-radius:12px;background:#dcfce7;border:1px solid #bbf7d0;">
            <div style="font-size:32px;font-weight:900;color:#166534;">${this.correctCount}</div>
            <div style="font-size:11px;color:#166534;margin-top:4px;">Correct</div>
          </div>
          <div style="flex:1;min-width:120px;text-align:center;padding:16px;border-radius:12px;background:#fee2e2;border:1px solid #fecaca;">
            <div style="font-size:32px;font-weight:900;color:#991b1b;">${this.wrongCount}</div>
            <div style="font-size:11px;color:#991b1b;margin-top:4px;">Incorrect</div>
          </div>
          <div style="flex:1;min-width:120px;text-align:center;padding:16px;border-radius:12px;background:#f1f5f9;border:1px solid #cbd5e1;">
            <div style="font-size:32px;font-weight:900;color:#64748b;">${this.skippedCount}</div>
            <div style="font-size:11px;color:#64748b;margin-top:4px;">Skipped</div>
          </div>
        </div>

        <!-- Question-wise Analysis -->
        <h2 style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid #3b82f6;">
          📋 Question-wise Analysis
        </h2>
        ${questionsHTML}

        <div style="text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;">
          Generated by Exam Portal &nbsp;|&nbsp; ${attemptDate}
        </div>

        <div class="no-print" style="text-align:center;margin-top:30px;">
          <button onclick="window.print()" style="padding:12px 30px;background:#3b82f6;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;">
            🖨️ Print / Save as PDF
          </button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  }

  // ─── Palette helpers ─────────────────────────────────────────────────────────

  get answeredCount(): number { return this.questions.filter(q => q.status === 'answered').length; }
  get unansweredCount(): number { return this.questions.length - this.answeredCount; }
}