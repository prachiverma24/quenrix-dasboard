import { Component, inject } from '@angular/core';
import { UiStateService } from '../services/ui-state.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent {
  private uiService = inject(UiStateService);
  private languageService = inject(LanguageService);

  // Dummy code snippet for the code editor card
  codeSnippet = `// Create your first HTML page
function displayMessage() {
  const greeting = "Hello, Developer!";
  console.log(greeting);
  
  return greeting;
}

displayMessage();`;

  // Navigation to different sections
  onStartAssessment(): void {
    this.uiService.triggerAction('open-about');
  }

  t(key: string): string {
    return this.languageService.t(key);
  }
}
