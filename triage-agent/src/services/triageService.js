const axios = require('axios');

class TriageService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiBaseUrl = 'https://api.openai.com/v1';
  }

  /**
   * Analyze a GitHub issue using AI and return triage recommendations
   */
  async analyzeIssue({ title, body, comments = [], labels = [], repository }) {
    try {
      // Prepare the context for the AI
      const context = this.buildAnalysisContext({
        title,
        body,
        comments,
        labels,
        repository
      });

      // Get AI analysis
      const aiResponse = await this.callOpenAI(context);

      // Parse and validate the response
      const analysis = this.parseAIResponse(aiResponse);

      // Add metadata
      analysis.timestamp = new Date().toISOString();
      analysis.agent_version = '1.0.0';

      return analysis;

    } catch (error) {
      console.error('[TRIAGE SERVICE] Error:', error);
      
      // Return fallback analysis
      return this.getFallbackAnalysis(title, body);
    }
  }

  /**
   * Build context string for AI analysis
   */
  buildAnalysisContext({ title, body, comments, labels, repository }) {
    let context = `Analyze this GitHub issue for triage:

REPOSITORY: ${repository || 'Unknown'}
TITLE: ${title}

DESCRIPTION:
${body}`;

    if (labels && labels.length > 0) {
      context += `\n\nEXISTING LABELS: ${labels.join(', ')}`;
    }

    if (comments && comments.length > 0) {
      context += `\n\nCOMMENTS:`;
      comments.forEach((comment, index) => {
        context += `\n${index + 1}. ${comment.substring(0, 500)}`;
      });
    }

    context += `\n\nPlease analyze this issue and provide:
1. Priority level (low/medium/high/critical)
2. Severity level (minor/moderate/major/critical)  
3. Suggested labels (array of strings)
4. Brief summary (1-2 sentences)
5. Next steps (array of actionable items)
6. Confidence score (0-1)
7. Reasoning for your decisions

Respond with valid JSON in this exact format:
{
  "priority": "medium",
  "severity": "moderate", 
  "suggested_labels": ["bug", "needs-investigation"],
  "summary": "Brief description of the issue",
  "next_steps": ["Action 1", "Action 2"],
  "confidence": 0.85,
  "reasoning": "Explanation of the analysis"
}`;

    return context;
  }

  /**
   * Call OpenAI API for analysis
   */
  async callOpenAI(context) {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await axios.post(
      `${this.openaiBaseUrl}/chat/completions`,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert software engineer and project manager specializing in GitHub issue triage. Analyze issues carefully and provide structured recommendations.'
          },
          {
            role: 'user',
            content: context
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * Parse AI response and validate structure
   */
  parseAIResponse(aiResponse) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate required fields
      const analysis = {
        priority: this.validatePriority(parsed.priority),
        severity: this.validateSeverity(parsed.severity),
        suggested_labels: Array.isArray(parsed.suggested_labels) ? parsed.suggested_labels : [],
        summary: typeof parsed.summary === 'string' ? parsed.summary : 'No summary provided',
        next_steps: Array.isArray(parsed.next_steps) ? parsed.next_steps : [],
        confidence: this.validateConfidence(parsed.confidence),
        reasoning: typeof parsed.reasoning === 'string' ? parsed.reasoning : 'No reasoning provided'
      };

      return analysis;

    } catch (error) {
      console.error('[TRIAGE SERVICE] Failed to parse AI response:', error);
      console.error('AI Response:', aiResponse);
      
      // Return basic analysis from the raw response
      return this.extractBasicAnalysis(aiResponse);
    }
  }

  /**
   * Validate priority level
   */
  validatePriority(priority) {
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    return validPriorities.includes(priority) ? priority : 'medium';
  }

  /**
   * Validate severity level
   */
  validateSeverity(severity) {
    const validSeverities = ['minor', 'moderate', 'major', 'critical'];
    return validSeverities.includes(severity) ? severity : 'moderate';
  }

  /**
   * Validate confidence score
   */
  validateConfidence(confidence) {
    const conf = parseFloat(confidence);
    if (isNaN(conf)) return 0.5;
    return Math.max(0, Math.min(1, conf));
  }

  /**
   * Extract basic analysis when JSON parsing fails
   */
  extractBasicAnalysis(response) {
    const text = response.toLowerCase();
    
    // Try to extract priority
    let priority = 'medium';
    if (text.includes('critical') || text.includes('urgent')) priority = 'critical';
    else if (text.includes('high')) priority = 'high';
    else if (text.includes('low')) priority = 'low';

    // Try to extract severity
    let severity = 'moderate';
    if (text.includes('critical')) severity = 'critical';
    else if (text.includes('major')) severity = 'major';
    else if (text.includes('minor')) severity = 'minor';

    return {
      priority,
      severity,
      suggested_labels: ['needs-triage'],
      summary: 'Issue analysis completed with limited parsing',
      next_steps: ['Review issue manually', 'Apply appropriate labels'],
      confidence: 0.3,
      reasoning: 'Fallback analysis due to parsing issues'
    };
  }

  /**
   * Fallback analysis when AI call fails
   */
  getFallbackAnalysis(title, body) {
    const text = (title + ' ' + body).toLowerCase();
    
    // Basic keyword analysis
    let priority = 'medium';
    let severity = 'moderate';
    const suggestedLabels = ['needs-triage'];

    // Check for urgent keywords
    if (text.includes('critical') || text.includes('urgent') || text.includes('broken') || text.includes('crash')) {
      priority = 'high';
      severity = 'major';
    }

    // Check for bug indicators
    if (text.includes('bug') || text.includes('error') || text.includes('issue') || text.includes('problem')) {
      suggestedLabels.push('bug');
    }

    // Check for feature requests
    if (text.includes('feature') || text.includes('enhancement') || text.includes('request')) {
      suggestedLabels.push('enhancement');
      priority = 'low';
      severity = 'minor';
    }

    return {
      priority,
      severity,
      suggested_labels: suggestedLabels,
      summary: `Issue titled "${title}" requires manual review`,
      next_steps: [
        'Review issue details manually',
        'Assign appropriate priority',
        'Add relevant labels'
      ],
      confidence: 0.2,
      reasoning: 'Fallback analysis - AI service unavailable',
      timestamp: new Date().toISOString(),
      agent_version: '1.0.0'
    };
  }
}

module.exports = new TriageService();